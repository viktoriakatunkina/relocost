import { createClient, type PostgrestError } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ретрай на statement_timeout (Postgres 57014). При сборке сотен страниц 16
// воркеров одновременно бьют в Supabase, и часть запросов БД рубит по таймауту —
// сборка падала на случайных блог-страницах. Таймаут нагрузочно-зависимый и
// транзиентный, поэтому повтор с небольшим бэкоффом почти всегда проходит.
// Применяем ТОЛЬКО к read-клиенту (anon) — он используется для SSG-чтений;
// write-клиент (supabaseAdmin, оплаты) оставляем без авто-повторов.
//
// 2026-10-26: 5 попыток оставляем только на СБОРКЕ. В рантайме (next start,
// ISR) повторы на statement_timeout добивали перегруженную БД: каждый
// оборванный клиентом запрос продолжает выполняться в Postgres, а мы шлем
// следующий — с 20.10 это шторм из 300–480 statement timeout в день. В
// рантайме — один повтор и только на сетевой/5xx-сбой, не на 57014.
const IS_BUILD =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.LOWMEM_BUILD === "1";
const RETRY_DELAYS_MS = IS_BUILD ? [300, 800, 1600, 2600] : [500];

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// HTTP/2 keepalive на VPS иногда застывает на неопределённое время (Supabase
// не присылает FIN); без таймаута воркер Next.js ждёт 300 сек и падает.
// AbortController с 10 сек убивает подвисший запрос до истечения page-timeout.
const FETCH_TIMEOUT_MS = 10_000;

// 2026-08-25: под сегодняшним инцидентом Supabase (status.supabase.com,
// "Partially Degraded Service") поймали воркер сборки, зависший на ОДНОМ
// fetch на 45+ минут — AbortController.abort() не всегда реально обрывает
// подвисший HTTP/2-сокет undici (известный квирк, воспроизводился уже не
// раз). Поэтому гоним fetch ЕЩЁ и через внешний Promise.race с жёстким
// дедлайном (независимым от AbortController) — если сам fetch не вернул
// управление вовремя, retry-цикл всё равно продолжится на следующую
// попытку, а не будет ждать неопределённо долго.
const HARD_DEADLINE_MS = FETCH_TIMEOUT_MS + 3_000;

function raceWithHardDeadline<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`hard-deadline ${ms}ms exceeded`)), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

const fetchWithRetry: typeof fetch = async (input, init) => {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    // Пробрасываем сигнал Next.js, если есть — любой из двух прерывает запрос.
    const prevSignal = (init as RequestInit | undefined)?.signal;
    if (prevSignal) prevSignal.addEventListener("abort", () => ctrl.abort(), { once: true });
    try {
      const res = await raceWithHardDeadline(
        fetch(input, { ...init, signal: ctrl.signal }),
        HARD_DEADLINE_MS,
      );
      clearTimeout(tid);
      if (res.ok || attempt === RETRY_DELAYS_MS.length) return res;
      // Не-ок: повторяем на транзиентных сбоях под нагрузкой сборки. Кроме
      // statement_timeout (57014) сюда попадают любые 5xx и 429 — под нагрузкой
      // Supabase/прокси иногда отдаёт битый не-ок ответ (наблюдали: тело с
      // данными, но не-ок статус → supabase-js кидал весь массив постов как
      // ошибку, и падали все блог-страницы сразу). Ретрай с бэкоффом проходит.
      const body = await res.clone().text().catch(() => "");
      const isStatementTimeout =
        body.includes("57014") || body.includes("statement timeout");
      if (isStatementTimeout && !IS_BUILD) return res;
      const isRetryable =
        res.status === 408 ||
        res.status === 429 ||
        res.status >= 500 ||
        isStatementTimeout;
      if (!isRetryable) return res;
      await delay(RETRY_DELAYS_MS[attempt] + Math.floor(Math.random() * 250));
    } catch (e) {
      clearTimeout(tid);
      // AbortError от нашего таймаута → повторяем как сетевой сбой.
      lastErr = e;
      if (attempt === RETRY_DELAYS_MS.length) throw e;
      await delay(RETRY_DELAYS_MS[attempt] + Math.floor(Math.random() * 250));
    }
  }
  // Недостижимо, но для типа: если попытки кончились на сетевой ошибке.
  throw lastErr;
};

export const supabase = createClient(url, anonKey, {
  global: { fetch: fetchWithRetry },
});

// Для generateStaticParams в app/[locale]/{city,country,blog}/[slug] и
// city/[slug]/{budget,prices} — они делают raw fetch к REST API напрямую
// (в обход supabase-js/fetchWithRetry, чтобы не тянуть клиент в билд-фазу
// с сотнями воркеров), но раньше вообще БЕЗ таймаута: подвисший запрос мог
// висеть до 300 сек (дефолт staticPageGenerationTimeout), вместо мгновенного
// фолбэка на [] и следующей попытки. 2026-08-25.
export async function fetchWithHardTimeout(
  url: string,
  headers: Record<string, string>,
  ms = 10_000,
): Promise<Response> {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), ms);
  try {
    return await raceWithHardDeadline(fetch(url, { headers, signal: ctrl.signal }), ms + 3_000);
  } finally {
    clearTimeout(tid);
  }
}

// 2026-09-21: тот же класс бага, что чинили в lib/blog.ts getPostBySlug —
// найден ещё в нескольких местах (city/country/compare страницы). Паттерн:
// `const { data } = await supabase.from(...).maybeSingle(); if (!data)
// notFound();` — `error` из ответа не проверялся вообще, поэтому любой
// транзиентный сбой запроса (таймаут/5xx/перегрузка VPS) молча превращался
// в `data = null` → notFound(). Self-hosted ISR на VPS кэширует notFound()
// как постоянный 404 в файловом кеше, даже когда данные в БД валидны.
// Транспортный fetchWithRetry (см. выше) уже повторяет транзиентные сбои
// НЕСКОЛЬКО РАЗ на уровне HTTP — если ошибка всё равно дошла до вызывающего
// кода, значит все попытки исчерпаны, и это НЕ повод считать сущность
// отсутствующей. unwrapOrThrow бросает исключение в этом случае, чтобы
// страница ушла в app/[locale]/error.tsx (retry на следующем заходе/
// ревалидации) вместо notFound(). Genuine «не найдено» (запрос отработал
// без ошибки, просто нет строки: error === null, data === null) по-прежнему
// возвращает null и корректно ведёт на notFound() — это НЕ меняется.
export async function unwrapOrThrow<T>(
  result: PromiseLike<{ data: T; error: PostgrestError | null }>,
  context: string,
): Promise<T> {
  const { data, error } = await result;
  if (error) throw new Error(`${context}: ${error.message}`);
  return data;
}

export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
