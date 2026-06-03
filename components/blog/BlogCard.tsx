import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { coverGradient } from "@/lib/blog";
import { typo } from "@/lib/typography";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-3xl overflow-hidden bg-surface border hairline transition hover:-translate-y-1 hover:border-copper/40 hover:bg-surface-elevated"
    >
      <div
        className={`aspect-[16/9] bg-gradient-to-br ${coverGradient(post.slug)} relative`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-t from-pine-tree/80 via-transparent to-transparent" />
        {post.tag && (
          <span className="absolute top-4 left-4 chip chip-accent">
            {post.tag}
          </span>
        )}
      </div>
      <div className="p-6">
        {post.read_time && (
          <div className="text-brandy/55 text-[11px] uppercase tracking-[0.15em] mb-3">
            {post.read_time} мин чтения
          </div>
        )}
        <h3 className="font-serif text-2xl md:text-[1.6rem] text-cream leading-tight text-pretty group-hover:text-copper transition">
          {typo(post.title)}
        </h3>
      </div>
    </Link>
  );
}
