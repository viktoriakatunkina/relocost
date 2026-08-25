import type { MetadataRoute } from "next";
import { topComparePairs } from "@/lib/compare";
import { getAllListSlugs } from "@/lib/lists";
import { routing } from "@/i18n/routing";

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

async function fetchWithTimeout(input: string, headers: Record<string, string>) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(input, { headers, cache: "no-store", signal: ctrl.signal });
  } finally {
    clearTimeout(tid);
  }
}

async function fetchBlogPosts(): Promise<{ slug: string; created_at: string }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const tag = encodeURIComponent("города");
    const res = await fetchWithTimeout(
      `${url}/rest/v1/blog_posts?select=slug,created_at&published=eq.true&tag=neq.${tag}&limit=3000&order=created_at.desc`,
      { apikey: key, Authorization: `Bearer ${key}` }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
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
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // /favorites в sitemap не включаем (noindex). /search индексируется — он выше.
  return expand(entries);
}
