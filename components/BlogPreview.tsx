import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCarouselMobile } from "@/components/blog/BlogCarouselMobile";
import { typo } from "@/lib/typography";

const BLOG_PREVIEW_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop&q=80",
    alt: "горы и переезд",
  },
  {
    src: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=120&h=120&fit=crop&q=80",
    alt: "городская улица",
  },
  {
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&h=120&fit=crop&q=80",
    alt: "жилье за рубежом",
  },
];

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-6 gap-6">
          <div>
            <span className="eyebrow">Журнал</span>
            <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 mb-3 text-balance text-pretty">
              Гайды и подборки
            </h2>
            {/* Декоративные миниатюры — загружаются в браузере пользователя */}
            <div className="flex items-center gap-2 mb-4">
              {BLOG_PREVIEW_PHOTOS.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border-2 border-pine-tree ring-1 ring-cream/15"
                  loading="lazy"
                />
              ))}
              <span className="text-brandy/55 text-xs ml-1">
                реальный опыт переехавших
              </span>
            </div>
            <p className="text-brandy/75 text-lg max-w-xl text-pretty">
              {typo(
                "Практические советы по переезду, визам, аренде жилья и жизни за рубежом — от тех, кто уже прошел этот путь.",
              )}
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

        {/* Карусель на мобиле */}
        <div className="md:hidden -mx-6">
          <BlogCarouselMobile posts={posts} />
        </div>

        {/* Сетка на планшете и десктопе */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>

        {/* Ссылка «Все статьи» на мобиле под каруселью */}
        <div className="mt-4 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill border hairline text-cream/85 text-sm hover:border-copper hover:text-cream transition"
          >
            Все статьи
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
