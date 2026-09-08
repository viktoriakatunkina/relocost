import type { MetadataRoute } from "next";
import { topComparePairs } from "@/lib/compare";
import { countryComparePairSlugs } from "@/lib/compare-countries";
import { getAllListSlugs } from "@/lib/lists";
import { CITY_ROUTES } from "@/lib/city-routes";
import { routing } from "@/i18n/routing";
import { BLOG_TAG_FILTER } from "@/lib/blog-visibility";
import { archivePageCount } from "@/lib/blog-archive";

// force-dynamic: сайтмап генерируется при каждом запросе, не кешируется.
// Supabase-клиент заменён на прямой fetch — кастомный fetchWithRetry
// в lib/supabase.ts возвращал пустой массив в серверном контексте сайтмапа.
export const dynamic = "force-dynamic";

// 2026-08-25: рантайм-доступ VPS к Supabase подтверждённо нестабилен
// (см. коммит фикса generateStaticParams) — без таймаута зависший fetch
// вешал ВЕСЬ /sitemap.xml на 30+ сек до 504 от nginx (у sitemap нет ISR-
// кеша/фолбэка на stale, в отличие от страниц). 8 сек — короче, чем nginx
// proxy timeout, отдаём частичный сайтмап вместо полного 504.
const FETCH_TIMEOUT_MS = 8_000;

// Общий бюджет на постраничную выборку статей. Страниц теперь несколько (см.
// fetchBlogPosts), и без общего дедлайна три подряд подвисших запроса по 8 сек
// дали бы 24 сек и гарантированный 504 от nginx. Набрали сколько успели —
// отдаём частичный сайтмап, это лучше пустого.
const BLOG_FETCH_BUDGET_MS = 12_000;

async function fetchWithTimeout(
  input: string,
  headers: Record<string, string>,
  timeoutMs = FETCH_TIMEOUT_MS,
) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(input, { headers, cache: "no-store", signal: ctrl.signal });
  } finally {
    clearTimeout(tid);
  }
}

// PostgREST режет ЛЮБОЙ ответ по серверному db-max-rows=1000 — параметр
// limit=3000 в запросе он молча игнорирует. Из-за этого в сайтмап попадала
// только первая тысяча статей из ~2650 подходящих (аудит 2026-09-07: 65%
// статей блога вообще не были представлены в сайтмапе). Единственный рабочий
// способ забрать всё — идти страницами по offset, как в scripts/*.mjs.
const BLOG_PAGE_SIZE = 1000;
const BLOG_MAX_PAGES = 8; // страховка от бесконечного цикла: потолок 8000 статей

async function fetchBlogPosts(): Promise<{ slug: string; created_at: string }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const deadline = Date.now() + BLOG_FETCH_BUDGET_MS;
  const out: { slug: string; created_at: string }[] = [];
  try {
    for (let page = 0; page < BLOG_MAX_PAGES; page++) {
      const left = deadline - Date.now();
      if (left <= 0) break;
      // Сортировка обязательно детерминированная (created_at может совпадать
      // у пачки статей одного сева) — иначе постраничная выборка теряет и
      // дублирует строки между страницами.
      const res = await fetchWithTimeout(
        `${url}/rest/v1/blog_posts?select=slug,created_at&published=eq.true` +
          `&${BLOG_TAG_FILTER}&order=created_at.desc,slug.asc` +
          `&offset=${page * BLOG_PAGE_SIZE}&limit=${BLOG_PAGE_SIZE}`,
        headers,
        Math.min(FETCH_TIMEOUT_MS, left),
      );
      if (!res.ok) break;
      const rows: { slug: string; created_at: string }[] = await res.json();
      out.push(...rows);
      if (rows.length < BLOG_PAGE_SIZE) break;
    }
  } catch {
    // Возвращаем то, что успели набрать до сбоя.
  }
  return out;
}

async function fetchCities(): Promise<{ slug: string; country_slug: string; updated_at: string | null }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetchWithTimeout(
      `${url}/rest/v1/cities?select=slug,country_slug,updated_at&limit=1000`,
      { apikey: key, Authorization: `Bearer ${key}` }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
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

// hreflang-альтернаты для пути: все локали + x-default на дефолтную (ru).
function languagesFor(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of routing.locales) out[l] = urlFor(path, l);
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
};

function expand(entries: Entry[]): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const e of entries) {
    const languages = languagesFor(e.path);
    for (const locale of routing.locales) {
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
  const [cityRows, posts] = await Promise.all([
    fetchCities(),
    fetchBlogPosts(),
  ]);

  const now = new Date();
  const countries = Array.from(
    new Set(cityRows.map((c) => c.country_slug).filter(Boolean)),
  );
  // В sitemap кладём только канонические пары топ-городов (те же, что
  // прегенерятся статикой). Полный декартов набор раздувал бы sitemap.
  // topComparePairs() идёт через supabase-js (не raw fetch, см. lib/compare.ts) —
  // на нестабильном рантайм-коннекте к Supabase может тянуться десятки секунд
  // (внутренние ретраи fetchWithRetry). Гоним с внешним таймаутом, чтобы не
  // ронять весь сайтмап из-за одного медленного блока.
  const comparePairs = await Promise.race([
    topComparePairs(),
    new Promise<string[]>((resolve) => setTimeout(() => resolve([]), FETCH_TIMEOUT_MS)),
  ]);

  const entries: Entry[] = [
    { path: "/", lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { path: "/countries", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { path: "/about", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { path: "/blog", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { path: "/search", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { path: "/quiz", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { path: "/rating", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { path: "/checklist", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
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
    })),
    // Подстраницы городов — самостоятельные SEO-URL с уникальными title/description.
    // Индексируются отдельно: «бюджет семьи в X» и «цены в X» — высокочастотные
    // информационные запросы, которые ведут на калькулятор и таблицу цен.
    ...cityRows.map((c) => ({
      path: `/city/${c.slug}/budget`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...cityRows.map((c) => ({
      path: `/city/${c.slug}/prices`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...countries.map((slug) => ({
      path: `/country/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
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

  // «Маршруты на день» — контент только на ru (dynamicParams=false, en/uz
  // не сгенерированы), поэтому НЕ идёт через expand() (размножил бы на все
  // локали и дал битые /en//uz-ссылки на 404). Одна ru-запись на город.
  const tripEntries: MetadataRoute.Sitemap = Object.keys(CITY_ROUTES).map((slug) => ({
    url: urlFor(`/city/${slug}/trip`, routing.defaultLocale),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // /favorites в sitemap не включаем (noindex). /search индексируется — он выше.
  return [...expand(entries), ...tripEntries];
}
