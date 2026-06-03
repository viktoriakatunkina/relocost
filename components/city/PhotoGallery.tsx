import Image from "next/image";
import { unsplashSrc, unsplashAuthorUrlWithUtm } from "@/lib/unsplash";

export function PhotoGallery({
  cityName,
  unsplashUrl,
  authorName,
  authorUrl,
}: {
  cityName: string;
  unsplashUrl: string | null;
  authorName: string | null;
  authorUrl: string | null;
}) {
  const main = unsplashSrc(unsplashUrl, { w: 1800, q: 85 });
  const credited = unsplashAuthorUrlWithUtm(authorUrl);

  if (!main) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-16">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <span className="eyebrow">Город в кадрах</span>
          <h2 className="font-serif text-3xl md:text-4xl text-cream mt-4">
            {cityName} вблизи
          </h2>
        </div>
        {authorName && (
          <p className="text-brandy/55 text-xs hidden md:block shrink-0">
            Фото:{" "}
            {credited ? (
              <a
                href={credited}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copper underline-offset-2 hover:underline"
              >
                {authorName}
              </a>
            ) : (
              authorName
            )}{" "}
            ·{" "}
            <a
              href="https://unsplash.com/?utm_source=relocost&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-copper underline-offset-2 hover:underline"
            >
              Unsplash
            </a>
          </p>
        )}
      </div>

      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border hairline group">
        <Image
          src={main}
          alt={`${cityName} — главное фото`}
          fill
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover transition duration-1000 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-tree/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-cream/5 rounded-3xl pointer-events-none" />
      </div>

      {authorName && (
        <p className="text-brandy/55 text-xs mt-4 md:hidden">
          Фото:{" "}
          {credited ? (
            <a
              href={credited}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-copper underline-offset-2 hover:underline"
            >
              {authorName}
            </a>
          ) : (
            authorName
          )}{" "}
          на{" "}
          <a
            href="https://unsplash.com/?utm_source=relocost&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-copper underline-offset-2 hover:underline"
          >
            Unsplash
          </a>
        </p>
      )}
    </section>
  );
}
