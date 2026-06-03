import Image from "next/image";
import type { GalleryPhoto } from "@/lib/types";
import { unsplashSrc, unsplashAuthorUrlWithUtm } from "@/lib/unsplash";

const UNSPLASH_REF =
  "https://unsplash.com/?utm_source=relocost&utm_medium=referral";

export function PhotoGallery({
  cityName,
  gallery,
  unsplashUrl,
  authorName,
  authorUrl,
}: {
  cityName: string;
  gallery: GalleryPhoto[] | null;
  unsplashUrl: string | null;
  authorName: string | null;
  authorUrl: string | null;
}) {
  // Источник — массив gallery (до 6 фото). Если он пуст, аккуратно
  // откатываемся на единственное главное фото города.
  const photos: GalleryPhoto[] =
    gallery && gallery.length > 0
      ? gallery.slice(0, 6)
      : unsplashUrl
        ? [{ u: unsplashUrl, n: authorName ?? "", h: authorUrl ?? "" }]
        : [];

  if (photos.length === 0) return null;

  const single = photos.length === 1;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-16">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <span className="eyebrow">Город в кадрах</span>
          <h2 className="font-serif text-3xl md:text-4xl text-cream mt-4">
            {cityName} вблизи
          </h2>
        </div>
        <p className="text-brandy/55 text-xs hidden md:block shrink-0">
          Фото:{" "}
          <a
            href={UNSPLASH_REF}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-copper underline-offset-2 hover:underline"
          >
            Unsplash
          </a>
        </p>
      </div>

      <div
        className={
          single
            ? "grid grid-cols-1"
            : "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        }
      >
        {photos.map((p, i) => {
          const src = unsplashSrc(p.u, single ? { w: 1800, q: 85 } : { w: 800, q: 80 });
          if (!src) return null;
          const credited = unsplashAuthorUrlWithUtm(p.h || null);
          return (
            <figure
              key={`${p.u}-${i}`}
              className={`relative overflow-hidden rounded-2xl border hairline group ${
                single ? "aspect-[16/9] md:aspect-[21/9] rounded-3xl" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={src}
                alt={`${cityName} — фото ${i + 1}`}
                fill
                sizes={
                  single
                    ? "(max-width: 1280px) 100vw, 1200px"
                    : "(max-width: 768px) 50vw, 380px"
                }
                className="object-cover transition duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-tree/55 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-inset ring-cream/5 pointer-events-none" />
              {p.n && (
                <figcaption className="absolute bottom-2 left-3 right-3 text-[11px] text-cream/0 group-hover:text-cream/80 transition duration-300">
                  {credited ? (
                    <a
                      href={credited}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-copper underline-offset-2 hover:underline pointer-events-auto"
                    >
                      {p.n}
                    </a>
                  ) : (
                    p.n
                  )}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      <p className="text-brandy/55 text-xs mt-4 md:hidden">
        Фото:{" "}
        <a
          href={UNSPLASH_REF}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-copper underline-offset-2 hover:underline"
        >
          Unsplash
        </a>
      </p>
    </section>
  );
}
