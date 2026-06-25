import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ретрай на statement_timeout (Postgres 57014). При сборке сотен страниц 16
// воркеров одновременно бьют в Supabase, и часть запросов БД рубит по таймауту —
// сборка падала на случайных блог-страницах. Таймаут нагрузочно-зависимый и
// транзиентный, поэтому повтор с небольшим бэкоффом почти всегда проходит.
// Применяем ТОЛЬКО к read-клиенту (anon) — он используется для SSG-чтений;
// write-клиент (supabaseAdmin, оплаты) оставляем без авто-повторов.
const RETRY_DELAYS_MS = [300, 800, 1600, 2600];

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const fetchWithRetry: typeof fetch = async (input, init) => {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(input, init);
      if (res.ok || attempt === RETRY_DELAYS_MS.length) return res;
      // Не-ок: повторяем на транзиентных сбоях под нагрузкой сборки. Кроме
      // statement_timeout (57014) сюда попадают любые 5xx и 429 — под нагрузкой
      // Supabase/прокси иногда отдаёт битый не-ок ответ (наблюдали: тело с
      // данными, но не-ок статус → supabase-js кидал весь массив постов как
      // ошибку, и падали все блог-страницы сразу). Ретрай с бэкоффом проходит.
      const body = await res.clone().text().catch(() => "");
      const isRetryable =
        res.status === 408 ||
        res.status === 429 ||
        res.status >= 500 ||
        body.includes("57014") ||
        body.includes("statement timeout");
      if (!isRetryable) return res;
      await delay(RETRY_DELAYS_MS[attempt] + Math.floor(Math.random() * 250));
    } catch (e) {
      // Сетевой сбой — тоже повторяем (до исчерпания попыток).
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

export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
