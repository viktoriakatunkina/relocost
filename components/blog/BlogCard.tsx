import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { coverGradient } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl overflow-hidden bg-kombu-green/40 border border-dingley/30 transition hover:-translate-y-1 hover:border-pale-copper/60"
    >
      <div
        className={`aspect-[16/9] bg-gradient-to-br ${coverGradient(post.slug)} relative`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-t from-pine-tree/80 via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-brandy/60 text-xs uppercase tracking-wider mb-3">
          {post.tag && <span className="text-pale-copper">{post.tag}</span>}
          {post.tag && post.read_time && <span>·</span>}
          {post.read_time && <span>{post.read_time} мин</span>}
        </div>
        <h3 className="font-serif text-2xl text-cream leading-snug group-hover:text-pale-copper transition">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
