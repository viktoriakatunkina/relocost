import { supabase } from "./supabase";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  city_id: string | null;
  country_slug: string | null;
  tag: string | null;
  read_time: number | null;
  content_md: string;
  seo_title: string | null;
  seo_description: string | null;
  cover_unsplash_id: string | null;
  cover_url: string | null;
  cover_author_name: string | null;
  cover_author_url: string | null;
  published: boolean;
  created_at: string;
};

export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  let q = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as BlogPost | null) ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);
  return (data ?? []).map((p) => p.slug as string);
}

export async function getCityForPost(cityId: string | null) {
  if (!cityId) return null;
  const { data } = await supabase
    .from("cities")
    .select("*")
    .eq("id", cityId)
    .maybeSingle();
  return data ?? null;
}

const COVER_GRADIENTS = [
  "from-rose-900 via-pine-tree to-pine-tree",
  "from-amber-900 via-pine-tree to-pine-tree",
  "from-emerald-900 via-pine-tree to-pine-tree",
  "from-sky-900 via-pine-tree to-pine-tree",
  "from-violet-900 via-pine-tree to-pine-tree",
  "from-orange-900 via-pine-tree to-pine-tree",
];

export function coverGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}
