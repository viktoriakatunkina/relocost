import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mb-2">
              Гайды и подборки
            </h2>
            <p className="text-brandy/70">
              Свежие материалы для тех, кто планирует переезд.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-block px-5 py-2.5 rounded-pill border border-dingley/40 text-brandy/90 text-sm hover:border-pale-copper hover:text-cream transition"
          >
            Все статьи →
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
