import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog";
import { coverGradient } from "@/lib/blog";
import { unsplashSrc } from "@/lib/unsplash";
import { typo } from "@/lib/typography";

export function BlogCard({ post }: { post: BlogPost }) {
  const cover = unsplashSrc(post.cover_url, { w: 720, q: 80 });
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-3xl overflow-hidden bg-surface border hairline transition hover:-translate-y-1 hover:border-copper/40 hover:bg-surface-elevated"
    >
      <div
        className={`aspect-[16/9] bg-gradient-to-br ${coverGradient(post.slug)} relative overflow-hidden`}
      >
        {cover && (
          <Image
            src={cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        )}
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
