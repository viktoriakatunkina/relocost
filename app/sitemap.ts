import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { topComparePairs } from "@/lib/compare";
import { getAllListSlugs } from "@/lib/lists";
import { routing } from "@/i18n/routing";

// ISR: sitemap пересобирается раз в сутки, подхватывая новые города/статьи без
// ручного ребилда (иначе оставался статичным и устаревал при добавлении контента).
export const revalidate = 86400;

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
  const [{ data: cities }, { data: posts }] = await Promise.all([
    supabase.from("cities").select("slug, country_slug, updated_at"),
    supabase
      .from("blog_posts")
      .select("slug, created_at")
      .eq("published", true),
  ]);

  const now = new Date();
  const cityRows = cities ?? [];
  const countries = Array.from(
    new Set(cityRows.map((c) => c.country_slug).filter(Boolean)),
  );
  // В sitemap кладём только канонические пары топ-городов (те же, что
  // прегенерятся статикой). Полный декартов набор раздувал бы sitemap.
  const comparePairs = await topComparePairs();

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
    ...(posts ?? []).map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // /favorites в sitemap не включаем (noindex). /search индексируется — он выше.
  return expand(entries);
}
