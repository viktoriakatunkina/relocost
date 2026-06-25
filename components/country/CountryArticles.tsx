import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

// «Статьи о стране» на странице /country/* — внутренняя перелинковка страна → блог.
// Подбор по country_slug или городам страны (см. getPostsForCountry).
// Если статей нет — секция не рендерится.
export function CountryArticles({
  posts,
  title,
}: {
  posts: BlogPost[];
  title: string;
}) {
  if (!posts.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Полезное</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-10">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
