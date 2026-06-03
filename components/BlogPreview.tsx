import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12 gap-6">
          <div>
            <span className="eyebrow">Журнал</span>
            <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 mb-3 text-balance">
              Гайды и подборки
            </h2>
            <p className="text-brandy/75 text-lg max-w-xl text-pretty">
              Свежие материалы для тех, кто планирует переезд.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-pill border hairline text-cream/85 text-sm hover:border-copper hover:text-cream transition shrink-0"
          >
            Все статьи
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
