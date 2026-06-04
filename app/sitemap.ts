import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

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
  const slugs = cityRows.map((c) => c.slug as string).sort();
  // Канонические пары (a < b) — не плодим дубли для крaul-бюджета.
  const comparePairs: string[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      comparePairs.push(`${slugs[i]}-vs-${slugs[j]}`);
    }
  }

  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/search`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/countries`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...cityRows.map((c) => ({
      url: `${BASE}/city/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...countries.map((slug) => ({
      url: `${BASE}/country/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...comparePairs.map((pair) => ({
      url: `${BASE}/compare/${pair}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...(posts ?? []).map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
