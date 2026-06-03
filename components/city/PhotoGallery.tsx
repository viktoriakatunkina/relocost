import Image from "next/image";
import { unsplashSrc, unsplashAuthorUrlWithUtm } from "@/lib/unsplash";

const ACCENTS = [
  ["#33432B", "#6A784D"],
  ["#202808", "#33432B"],
  ["#C4866D", "#33432B"],
  ["#6A784D", "#DEC59E"],
  ["#33432B", "#202808"],
  ["#5A6A45", "#33432B"],
];

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
  const main = unsplashSrc(unsplashUrl, { w: 900, q: 80 });
  const credited = unsplashAuthorUrlWithUtm(authorUrl);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12">
      <h2 className="font-serif text-3xl text-cream mb-6">{cityName} в кадрах</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {main && (
          <div className="snap-start shrink-0 w-72 md:w-80 aspect-[4/3] rounded-2xl overflow-hidden relative border border-dingley/30">
            <Image
              src={main}
              alt={`${cityName} — главное фото`}
              fill
              sizes="(max-width: 768px) 80vw, 320px"
              className="object-cover"
            />
          </div>
        )}
        {ACCENTS.map(([a, b], i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-72 md:w-80 aspect-[4/3] rounded-2xl border border-dingley/30"
            style={{ background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)` }}
            aria-label="Атмосферный фон"
          />
        ))}
      </div>

      {main && authorName && (
        <p className="text-brandy/50 text-xs mt-3">
          Фото:{" "}
          {credited ? (
            <a
              href={credited}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pale-copper underline-offset-2 hover:underline"
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
            className="hover:text-pale-copper underline-offset-2 hover:underline"
          >
            Unsplash
          </a>
        </p>
      )}
    </section>
  );
}
