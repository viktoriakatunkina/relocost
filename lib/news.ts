import { supabase, unwrapOrThrow } from "./supabase";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content_md: string;
  category: string | null;
  source_name: string | null;
  source_url: string | null;
  event_date: string | null;
  published: boolean;
  created_at: string;
};

// Лёгкая карточка для списка /news — без content_md (тело статьи там не нужно,
// см. тот же принцип в lib/blog.ts BlogPostCard).
export type NewsItemCard = Pick<
  NewsItem,
  "id" | "slug" | "title" | "summary" | "category" | "source_name" | "event_date" | "created_at"
>;

const CARD_COLUMNS =
  "id,slug,title,summary,category,source_name,event_date,created_at";

// unwrapOrThrow ВЕЗДЕ: молчаливое проглатывание ошибки Supabase здесь
// превращалось бы в пустой список/notFound() на self-hosted ISR — см.
// комментарий у unwrapOrThrow в lib/supabase.ts и getPostBySlug в lib/blog.ts.
export async function getNewsList(
  limit = 200,
  offset = 0,
): Promise<NewsItemCard[]> {
  const data = await unwrapOrThrow(
    supabase
      .from("news_items")
      .select(CARD_COLUMNS)
      .eq("published", true)
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1),
    "getNewsList",
  );
  return (data ?? []) as unknown as NewsItemCard[];
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const data = await unwrapOrThrow(
    supabase
      .from("news_items")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle(),
    `getNewsBySlug(${slug})`,
  );
  return (data as NewsItem | null) ?? null;
}

export async function getAllNewsSlugs(limit = 500): Promise<string[]> {
  const data = await unwrapOrThrow(
    supabase
      .from("news_items")
      .select("slug")
      .eq("published", true)
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit),
    "getAllNewsSlugs",
  );
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
}
