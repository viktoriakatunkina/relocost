import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

// «Читайте также» на странице города — внутренняя перелинковка город → блог.
// Статьи подбираются по привязке к городу/стране (см. getPostsForCity).
// Если статей нет — секция не рендерится.
export function CityArticles({
  posts,
  cityName,
}: {
  posts: BlogPost[];
  cityName: string;
}) {
  if (!posts.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Полезное</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-10">
        Читайте также · {cityName}
      </h2>
      <div className={`grid gap-6 ${
        posts.length === 1
          ? "md:grid-cols-1 max-w-xl"
          : posts.length === 2
          ? "md:grid-cols-2"
          : "md:grid-cols-2 lg:grid-cols-3"
      }`}>
        {posts.map((p) => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
