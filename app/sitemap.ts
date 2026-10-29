import type { MetadataRoute } from "next";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { topComparePairs } from "@/lib/compare";
import { countryComparePairSlugs } from "@/lib/compare-countries";
import { getAllListSlugs } from "@/lib/lists";
import { CITY_ROUTES } from "@/lib/city-routes";
import { routing, type Locale } from "@/i18n/routing";
import { BLOG_TAG_FILTER } from "@/lib/blog-visibility";
import { archivePageCount } from "@/lib/blog-archive";
import { translatedLocalesFor } from "@/lib/content-i18n";
import { fetchWithHardTimeout } from "@/lib/supabase";

// 2026-10-21 (найдено при проверке индексации — сайтмап месяцами отдавал
// только ~336 статических URL вместо ~4000+, 0 городов/стран/статей блога):
// долго казалось, что дело в длительности таймаута или в параллельных
// запросах (оба фикса не помогли — см. git history), но КОРНЕВАЯ причина
// была в собственном `fetchWithTimeout` этого файла: он полагался ТОЛЬКО на
// AbortController, а в lib/supabase.ts прямым текстом задокументирован
// известный квирк undici — HTTP/2 keepalive на этом VPS иногда зависает
// (Supabase не шлёт FIN), и `AbortController.abort()` НЕ ВСЕГДА реально
// обрывает такой подвисший сокет. generateStaticParams страниц городов/блога
// уже защищены от этого через `fetchWithHardTimeout` (AbortController +
// независимый Promise.race с жёстким дедлайном) — именно поэтому они
// успешно собираются, а сайтмап с голым AbortController — нет. Переиспользуем
// готовую, уже проверенную функцию вместо местного самопального аналога.
//
// ISR раз в час (вместо прежнего force-dynamic) задумывалась как
// дополнительная подстраховка: даже если когда-нибудь случится реальный сбой
// Supabase, живые краулеры получат последнюю УДАЧНУЮ версию (stale-while-
// revalidate), а не частичный/пустой сайтмап. НА ПРАКТИКЕ это не работало:
// stale-while-revalidate у Next.js защищает только когда регенерация
// ЗАВЕРШАЕТСЯ ОШИБКОЙ (throw) — а функции ниже на любой сбой Supabase тихо
// возвращали [] или частичный массив, то есть для Next.js это была
// ОБЫЧНАЯ УСПЕШНАЯ регенерация, которая немедленно подменяла собой кэш.
// Живьём так 28.10.2026 на ~2 минуты исчезли 2277 статей блога из
// sitemap.xml — краулеры успели забрать пустой/урезанный список, алертов не
// было. Фикс ниже (retryWithFallback) закрывает именно эту дыру: ретрай +
// явный собственный кэш последнего успеха (память процесса + диск, диск —
// потому что процесс на VPS может перезапуститься между деплоями) + громкий
// "ALERT [sitemap]" лог, который можно поймать мониторингом/grep'ом.
export const revalidate = 3600;

const FETCH_TIMEOUT_MS = 10_000;

// Небольшая пауза перед единственным повтором — не лечит системную проблему
// (упор в число одновременных соединений Nano-инстанса Supabase, см. ниже),
// но закрывает подавляющее большинство транзиентных секундных сбоев.
const RETRY_DELAY_MS = 2_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type BlogRow = { slug: string; created_at: string };
type NewsRow = { slug: string; created_at: string };
type CityRow = { slug: string; country_slug: string; updated_at: string | null };

type FallbackEntry<T> = { savedAt: number; data: T };
type FallbackCache = {
  blog?: FallbackEntry<BlogRow[]>;
  news?: FallbackEntry<NewsRow[]>;
  cities?: FallbackEntry<CityRow[]>;
};

// Кэш последнего УСПЕШНОГО результата — на диске (переживает перезапуск
// процесса между деплоями; деплой не трогает корень репозитория на VPS,
// только .next/config/next.config.mjs/public/images — см. deploy.sh) и
// дублируется в памяти процесса, чтобы не читать файл на каждый запрос, если
// в этом же процессе уже был успех. Обновляется ТОЛЬКО при успехе (прямом
// или после ретрая) — см. retryWithFallback.
const FALLBACK_CACHE_FILE = path.join(process.cwd(), ".sitemap-fallback-cache.json");
const memoryFallback: FallbackCache = {};

function readDiskFallback(): FallbackCache {
  try {
    if (!existsSync(FALLBACK_CACHE_FILE)) return {};
    return JSON.parse(readFileSync(FALLBACK_CACHE_FILE, "utf-8")) as FallbackCache;
  } catch (e) {
    console.error("[sitemap] не удалось прочитать fallback-кэш с диска", e instanceof Error ? e.message : e);
    return {};
  }
}

function getFallback<K extends keyof FallbackCache>(key: K): FallbackCache[K] | undefined {
  if (memoryFallback[key]) return memoryFallback[key];
  const disk = readDiskFallback()[key];
  if (disk) memoryFallback[key] = disk as never;
  return disk;
}

function saveFallback<K extends keyof FallbackCache>(key: K, data: NonNullable<FallbackCache[K]>["data"]): void {
  const entry = { savedAt: Date.now(), data } as NonNullable<FallbackCache[K]>;
  memoryFallback[key] = entry as never;
  try {
    const current = readDiskFallback();
    current[key] = entry as never;
    writeFileSync(FALLBACK_CACHE_FILE, JSON.stringify(current));
  } catch (e) {
    // Диск недоступен (readonly fs, нет прав) — не фатально, в памяти процесса
    // кэш всё равно сохранён, на диск попробуем снова при следующем успехе.
    console.error("[sitemap] не удалось сохранить fallback-кэш на диск", e instanceof Error ? e.message : e);
  }
}

// Один retry с небольшой задержкой, а при повторном провале — не [], а
// последний успешный снимок вместо тихой пустоты. attempt() должен ПАДАТЬ
// (throw) на любом сбое — частичный результат (например, обрыв на середине
// постраничной выборки блога) тоже считается сбоем для этой обёртки.
async function retryWithFallback<K extends keyof FallbackCache>(
  key: K,
  label: string,
  attempt: () => Promise<NonNullable<FallbackCache[K]>["data"]>,
): Promise<NonNullable<FallbackCache[K]>["data"]> {
  let lastErr: unknown;
  for (let i = 0; i < 2; i++) {
    try {
      const data = await attempt();
      saveFallback(key, data);
      return data;
    } catch (e) {
      lastErr = e;
      console.error(`[sitemap] ${label}: попытка ${i + 1}/2 провалилась`, e instanceof Error ? e.message : e);
      if (i === 0) await delay(RETRY_DELAY_MS);
    }
  }
  const fallback = getFallback(key);
  if (fallback) {
    const ageMin = Math.round((Date.now() - fallback.savedAt) / 60_000);
    console.error(
      `ALERT [sitemap] ${label}: Supabase недоступна после ретрая (${lastErr instanceof Error ? lastErr.message : lastErr}), ` +
        `отдаю последний успешный снимок вместо пустого/урезанного сайтмапа (возраст ${ageMin} мин, ${fallback.data.length} строк)`,
    );
    return fallback.data as never;
  }
  // 2026-10-29: раньше здесь был `return [] as never`. Для Next.js ISR это
  // выглядит как ОБЫЧНАЯ УСПЕШНАЯ регенерация — она немедленно заменяла
  // прошлый (хороший) кэш пустым/урезанным sitemap.xml. Именно этот путь
  // живьём сработал 29.10.2026 на первом запуске процесса после рестарта
  // (диск/память ещё не прогреты, fallback-кэша нет): curl показал 0 из 2280
  // статей блога. throw вместо [] заставляет Next.js трактовать регенерацию
  // как провалившуюся и продолжать отдавать последний закэшированный (пусть
  // и устаревший) sitemap.xml вместо его подмены пустым — см. комментарий в
  // начале файла про stale-while-revalidate.
  console.error(
    `ALERT [sitemap] ${label}: Supabase недоступна после ретрая, fallback-кэш пуст (вероятно первый запуск процесса) — проваливаю регенерацию, чтобы Next.js не подменил кэш пустым sitemap`,
  );
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

// PostgREST режет ЛЮБОЙ ответ по серверному db-max-rows=1000 — параметр
// limit=3000 в запросе он молча игнорирует. Из-за этого в сайтмап попадала
// только первая тысяча статей из ~2650 подходящих (аудит 2026-09-07: 65%
// статей блога вообще не были представлены в сайтмапе). Единственный рабочий
// способ забрать всё — идти страницами по offset, как в scripts/*.mjs.
const BLOG_FETCH_BUDGET_MS = 30_000;
const BLOG_PAGE_SIZE = 1000;
const BLOG_MAX_PAGES = 8; // страховка от бесконечного цикла: потолок 8000 статей

// Один заход постраничной выборки. ПАДАЕТ (throw), если не дошли до
// естественного конца (не-ok ответ ИЛИ исчерпан временной бюджет на середине) —
// retryWithFallback трактует это как сбой всей попытки, а не как "частично
// насобирали и ладно": раньше именно тихий partial-результат на обрыве
// бюджета/страницы был неотличим от честного конца списка.
async function fetchBlogPostsOnce(url: string, key: string): Promise<BlogRow[]> {
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const deadline = Date.now() + BLOG_FETCH_BUDGET_MS;
  const out: BlogRow[] = [];
  for (let page = 0; page < BLOG_MAX_PAGES; page++) {
    const left = deadline - Date.now();
    if (left <= 0) {
      throw new Error(`исчерпан бюджет времени ${BLOG_FETCH_BUDGET_MS}мс на странице ${page}, собрано ${out.length} строк`);
    }
    // Сортировка обязательно детерминированная (created_at может совпадать
    // у пачки статей одного сева) — иначе постраничная выборка теряет и
    // дублирует строки между страницами.
    const res = await fetchWithHardTimeout(
      `${url}/rest/v1/blog_posts?select=slug,created_at&published=eq.true` +
        `&${BLOG_TAG_FILTER}&order=created_at.desc,slug.asc` +
        `&offset=${page * BLOG_PAGE_SIZE}&limit=${BLOG_PAGE_SIZE}`,
      headers,
      Math.min(FETCH_TIMEOUT_MS, left),
    );
    if (!res.ok) {
      // 2026-10-21: раньше молча break — не было видно, РАЗВАЛИЛСЯ ли
      // запрос (таймаут/сеть) или Supabase вернул ошибку (4xx/5xx) с
      // телом, объясняющим причину. Временная диагностика после находки
      // "сайтмап стабильно теряет контент" — см. memory.
      const body = await res.text().catch(() => "");
      throw new Error(`не-ok ответ на странице ${page}: status=${res.status} body=${body.slice(0, 300)}`);
    }
    const rows: BlogRow[] = await res.json();
    out.push(...rows);
    if (rows.length < BLOG_PAGE_SIZE) return out; // дошли до честного конца списка
  }
  // Упёрлись в потолок BLOG_MAX_PAGES (8000 строк) — это страховка от
  // бесконечного цикла, не сбой: при текущих ~2300 статьях блога недостижимо
  // на практике, но если когда-нибудь будет достигнуто — отдаём набранное.
  return out;
}

async function fetchBlogPosts(): Promise<BlogRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("ALERT [sitemap] fetchBlogPosts: не заданы переменные окружения Supabase");
    return getFallback("blog")?.data ?? [];
  }
  return retryWithFallback("blog", "fetchBlogPosts", () => fetchBlogPostsOnce(url, key));
}

// Новости — небольшая таблица (десятки-сотни записей), в отличие от блога не
// нужна постраничная выборка через .range(): одного запроса с лимитом с
// запасом достаточно.
async function fetchNewsItemsOnce(url: string, key: string): Promise<NewsRow[]> {
  const res = await fetchWithHardTimeout(
    `${url}/rest/v1/news_items?select=slug,created_at&published=eq.true&order=created_at.desc&limit=1000`,
    { apikey: key, Authorization: `Bearer ${key}` },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`не-ok ответ: status=${res.status} body=${body.slice(0, 300)}`);
  }
  return res.json();
}

async function fetchNewsItems(): Promise<NewsRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("ALERT [sitemap] fetchNewsItems: не заданы переменные окружения Supabase");
    return getFallback("news")?.data ?? [];
  }
  return retryWithFallback("news", "fetchNewsItems", () => fetchNewsItemsOnce(url, key));
}

async function fetchCitiesOnce(url: string, key: string): Promise<CityRow[]> {
  const res = await fetchWithHardTimeout(
    `${url}/rest/v1/cities?select=slug,country_slug,updated_at&limit=1000`,
    { apikey: key, Authorization: `Bearer ${key}` }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`не-ok ответ: status=${res.status} body=${body.slice(0, 300)}`);
  }
  return res.json();
}

async function fetchCities(): Promise<CityRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("ALERT [sitemap] fetchCities: не заданы переменные окружения Supabase");
    return getFallback("cities")?.data ?? [];
  }
  return retryWithFallback("cities", "fetchCities", () => fetchCitiesOnce(url, key));
}

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

// URL пути для локали с учётом as-needed: ru без префикса, en/uz с префиксом.
function urlFor(path: string, locale: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return `${BASE}${clean || "/"}`;
  return `${BASE}/${locale}${clean}`;
}

// hreflang-альтернаты для пути. По умолчанию — все локали, но если у записи
// указан список реально переведённых локалей, в hreflang попадают только они
// (+ ru как источник и x-default). Иначе сайтмап заявлял бы поисковику
// языковые версии, которых нет: см. lib/i18n-seo.ts — то же правило
// применяется в мета-тегах страниц, и расходиться они не должны.
function languagesFor(
  path: string,
  translated?: readonly string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of routing.locales) {
    if (l === routing.defaultLocale || !translated || translated.includes(l)) {
      out[l] = urlFor(path, l);
    }
  }
  out["x-default"] = urlFor(path, routing.defaultLocale);
  return out;
}

// Один логический URL = одна запись sitemap на каждую локаль, с общими
// hreflang-альтернатами (так Google понимает языковые версии одной страницы).
type Entry = {
  path: string;
  lastModified: Date;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  // Локали, на которые страница реально переведена (ru подразумевается).
  // Не задано — считаем переведёнными все (служебные страницы вроде /quiz,
  // /search: там весь текст интерфейсный и он переведён по-настоящему).
  translatedLocales?: readonly Locale[];
};

function expand(entries: Entry[]): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const e of entries) {
    const languages = languagesFor(e.path, e.translatedLocales);
    // URL в сайтмап кладём только для тех локалей, что попали в hreflang:
    // непереведённая /uz-версия — не отдельная страница, а дубль русской
    // (её canonical и так указывает на ru), в индексе ей делать нечего.
    for (const locale of routing.locales) {
      if (!(locale in languages)) continue;
      out.push({
        url: urlFor(e.path, locale),
        lastModified: e.lastModified,
        changeFrequency: e.changeFrequency,
        priority: e.priority,
        alternates: { languages },
      });
    }
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 2026-10-21: было Promise.all([fetchCities(), fetchBlogPosts(),
  // fetchNewsItems()]) + comparePairs параллельно — все запросы стартовали
  // одновременно. Диагностика (console.error в catch, см. соседний коммит)
  // показала: все три валятся с одним и тем же "This operation was aborted"
  // ОДНОВРЕМЕННО, в одну и ту же секунду — не похоже на независимые таймауты
  // по 20с каждый, похоже на то, что Nano-инстанс Supabase не вытягивает
  // ВСПЛЕСК из нескольких параллельных подключений разом (сайтмап одним
  // залпом открывал: города + до 8 страниц блога + новости + сравнения).
  // Поднятие таймаута это не лечит — упирается не время, а число одновременных
  // соединений. Фикс — бить Supabase СТРОГО ПО ОДНОМУ запросу за раз. Это
  // медленнее при хорошей связи, но при хорошей связи и так всё укладывалось
  // в секунды; при плохой — последовательные запросы хотя бы не толкаются
  // друг с другом за один и тот же пул соединений.
  const cityRows = await fetchCities();
  const posts = await fetchBlogPosts();
  const newsItems = await fetchNewsItems();
  const comparePairs = await Promise.race([
    topComparePairs(),
    new Promise<string[]>((resolve) => setTimeout(() => resolve([]), FETCH_TIMEOUT_MS)),
  ]);

  const now = new Date();
  const countries = Array.from(
    new Set(cityRows.map((c) => c.country_slug).filter(Boolean)),
  );

  // Какие города/страны реально переведены на en/uz. Читает те же JSON из
  // content/i18n, что и страницы, с общим кешем в пределах процесса — то есть
  // диск дёргается один раз за жизнь процесса, а не на каждый /sitemap.xml
  // (маршрут force-dynamic).
  const cityLocales = new Map<string, Locale[]>();
  const countryLocales = new Map<string, Locale[]>();
  await Promise.all([
    ...cityRows.map(async (c) => {
      cityLocales.set(c.slug, await translatedLocalesFor("cities", c.slug));
    }),
    ...countries.map(async (slug) => {
      countryLocales.set(slug, await translatedLocalesFor("countries", slug));
    }),
  ]);
  const cityL = (slug: string) => cityLocales.get(slug) ?? [routing.defaultLocale];
  const countryL = (slug: string) =>
    countryLocales.get(slug) ?? [routing.defaultLocale];
  // В sitemap кладём только канонические пары топ-городов (те же, что
  // прегенерятся статикой). Полный декартов набор раздувал бы sitemap.
  // comparePairs уже посчитан выше (последовательно, после городов/блога/
  // новостей — см. комментарий в начале функции).

  const entries: Entry[] = [
    { path: "/", lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { path: "/countries", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { path: "/about", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { path: "/search", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { path: "/quiz", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { path: "/rating", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { path: "/checklist", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { path: "/embed", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...getAllListSlugs().map((slug) => ({
      path: `/list/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...cityRows.map((c) => ({
      path: `/city/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      translatedLocales: cityL(c.slug),
    })),
    // Подстраницы городов — самостоятельные SEO-URL с уникальными title/description.
    // Индексируются отдельно: «бюджет семьи в X» и «цены в X» — высокочастотные
    // информационные запросы, которые ведут на калькулятор и таблицу цен.
    ...cityRows.map((c) => ({
      path: `/city/${c.slug}/budget`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      translatedLocales: cityL(c.slug),
    })),
    ...cityRows.map((c) => ({
      path: `/city/${c.slug}/prices`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      translatedLocales: cityL(c.slug),
    })),
    ...countries.map((slug) => ({
      path: `/country/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      translatedLocales: countryL(slug),
    })),
    ...comparePairs.map((pair) => ({
      path: `/compare/${pair}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Сравнения СТРАН (/compare/georgia-vs-armenia). Список статический —
    // пары отобраны по Яндекс.Suggest, запроса в Supabase не требуют, поэтому
    // попадают в sitemap даже если блок с городами отвалился по таймауту.
    // Приоритет выше городских пар: страновых сравнений на сайте не было, а
    // спрос на «X или Y» на уровне стран подтверждён подсказками.
    ...countryComparePairSlugs().map((pair) => ({
      path: `/compare/${pair}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // ── Блог: только ru, без en/uz и без hreflang ────────────────────────────
  // Блог не переведён ни на одну локаль (0 статей из ~4258), поэтому НЕ идёт
  // через expand(): раньше он размножался на три локали и сайтмап заявлял
  // поисковику примерно вдвое больше URL, чем есть страниц, — все /en/blog/*
  // и /uz/blog/* были тем же русским текстом. С 09.09.2026 middleware отдаёт
  // по этим адресам русскую версию rewrite'ом, а canonical у них указывает на
  // бесперфиксный /blog/... — в сайтмапе им делать нечего.
  const blogEntries: Entry[] = [
    { path: "/blog", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    // Страницы архива блога — транзитные списки, через них краулер доходит
    // до статей, на которые с /blog нет серверных ссылок (список листается
    // на клиенте). Приоритет низкий: ценность в ссылках, не в самих списках.
    ...Array.from({ length: archivePageCount(posts.length) }, (_, i) => i + 1).map((n) => ({
      path: `/blog/page/${n}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
  const blogSitemap: MetadataRoute.Sitemap = blogEntries.map((e) => ({
    url: urlFor(e.path, routing.defaultLocale),
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));

  // «Маршруты на день» — контент только на ru (dynamicParams=false, en/uz
  // не сгенерированы), поэтому НЕ идёт через expand() (размножил бы на все
  // локали и дал битые /en//uz-ссылки на 404). Одна ru-запись на город.
  const tripEntries: MetadataRoute.Sitemap = Object.keys(CITY_ROUTES).map((slug) => ({
    url: urlFor(`/city/${slug}/trip`, routing.defaultLocale),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // ── Новости: только ru, тот же принцип, что у блога (не переведены). ────
  const newsEntries: Entry[] = [
    { path: "/news", lastModified: now, changeFrequency: "daily", priority: 0.7 },
    ...newsItems.map((n) => ({
      path: `/news/${n.slug}`,
      lastModified: n.created_at ? new Date(n.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
  const newsSitemap: MetadataRoute.Sitemap = newsEntries.map((e) => ({
    url: urlFor(e.path, routing.defaultLocale),
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));

  // /favorites в sitemap не включаем (noindex). /search индексируется — он выше.
  return [...expand(entries), ...blogSitemap, ...newsSitemap, ...tripEntries];
}
