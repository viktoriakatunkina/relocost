import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog";
import { coverGradient } from "@/lib/blog";
import { photoSrc } from "@/lib/photo";
import { typo } from "@/lib/typography";

function shortTitle(title: string): string {
  let t = title.replace(/ DN 20\d\d/g, "");
  const semi = t.indexOf(";");
  if (semi > 0) t = t.slice(0, semi).trim();
  if (t.length > 90) t = t.slice(0, 87) + "…";
  return t;
}

export function BlogCard({ post }: { post: BlogPost }) {
  const cover = photoSrc(post.cover_image_url, post.cover_url, { w: 720, q: 80 });
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
        {!cover && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-copper/60"
              aria-hidden
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            <p className="text-cream/80 text-sm font-medium leading-snug line-clamp-2 text-center max-w-[80%]">
              {shortTitle(post.title)}
            </p>
          </div>
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
