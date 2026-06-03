import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

export function RelatedPosts({
  current,
  all,
  limit = 3,
}: {
  current: BlogPost;
  all: BlogPost[];
  limit?: number;
}) {
  // Скор: совпадение тега +3, совпадение страны +2, та же привязка к городу +2
  const scored = all
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      if (current.tag && p.tag === current.tag) score += 3;
      if (current.country_slug && p.country_slug === current.country_slug) score += 2;
      if (current.city_id && p.city_id === current.city_id) score += 2;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || a.p.created_at < b.p.created_at ? 1 : -1)
    .slice(0, limit)
    .map((x) => x.p);

  if (scored.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Похожие материалы
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scored.map((p) => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
