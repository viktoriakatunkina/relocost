import type { BlogPostCard } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

// Подбор и скоринг (тег +3, страна +2, город +2) — в getRelatedPostCards
// (lib/blog.ts): 2026-10-26 вынесен на сервер узкими запросами вместо
// скоринга по 1000 полным статьям прямо здесь.
export function RelatedPosts({ posts }: { posts: BlogPostCard[] }) {
  const scored = posts;

  if (scored.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
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
