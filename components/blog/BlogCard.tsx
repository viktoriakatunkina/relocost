import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { BlogPostCard } from "@/lib/blog";
import { coverGradient, defaultCoverUrl } from "@/lib/blog";
import { photoSrc } from "@/lib/photo";
import { typo } from "@/lib/typography";

function shortTitle(title: string): string {
  let t = title.replace(/ DN 20\d\d/g, "");
  const semi = t.indexOf(";");
  if (semi > 0) t = t.slice(0, semi).trim();
  if (t.length > 90) t = t.slice(0, 87) + "…";
  return t;
}

export function BlogCard({
  post,
  fallbackCover,
}: {
  post: BlogPostCard;
  fallbackCover?: string | null;
}) {
  const ownCover = photoSrc(post.cover_image_url, post.cover_url, { w: 720, q: 80 });
  const cover = ownCover ?? fallbackCover ?? defaultCoverUrl(post.slug);
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
        <h3 className="font-serif text-2xl md:text-[1.6rem] text-cream leading-tight text-pretty group-hover:text-copper transition line-clamp-3">
          {typo(shortTitle(post.title))}
        </h3>
      </div>
    </Link>
  );
}
