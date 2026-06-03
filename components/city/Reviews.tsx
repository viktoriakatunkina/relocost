"use client";

import { useUnlocked, isUnlocked } from "@/lib/unlocked";
import { LockedSection } from "@/components/freemium/LockedSection";
import type { CityContent } from "@/lib/cities-content";
import { typo } from "@/lib/typography";

function ReviewCard({
  r,
}: {
  r: CityContent["reviews"][number];
}) {
  return (
    <article className="relative p-6 md:p-8 rounded-3xl bg-surface border hairline">
      <span className="absolute -top-2 left-7 text-6xl font-serif text-copper/40 leading-none select-none pointer-events-none" aria-hidden>
        ”
      </span>
      <blockquote className="text-cream/90 leading-relaxed text-pretty mb-5 text-base md:text-lg">
        {typo(r.text)}
      </blockquote>
      <footer className="text-sm text-brandy/70 flex items-center gap-2 flex-wrap">
        <span className="text-cream font-semibold">{r.author}</span>
        {r.age ? <span className="text-brandy/50">·</span> : null}
        {r.age ? <span>{r.age} лет</span> : null}
        {r.profession ? <span className="text-brandy/50">·</span> : null}
        {r.profession ? <span>{r.profession}</span> : null}
        {r.moved_year ? <span className="text-brandy/50">·</span> : null}
        {r.moved_year ? <span>переехал(а) в {r.moved_year}</span> : null}
      </footer>
    </article>
  );
}

export function Reviews({
  slug,
  isForeign,
  reviews,
}: {
  slug: string;
  isForeign: boolean;
  reviews: CityContent["reviews"];
}) {
  const unlocked = useUnlocked(slug);
  const opened = isUnlocked(unlocked, "guide");
  if (!reviews.length) return null;

  const useLock = isForeign;
  const free = useLock ? reviews.slice(0, 1) : reviews;
  const locked = useLock ? reviews.slice(1) : [];

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <span className="eyebrow">Опыт</span>
      <h2 className="font-serif text-4xl md:text-5xl text-cream mt-6 mb-10">
        Отзывы переехавших
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {free.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>

      {locked.length > 0 && (
        <div className="mt-5">
          {opened ? (
            <div className="grid md:grid-cols-2 gap-5">
              {locked.map((r, i) => (
                <ReviewCard key={i} r={r} />
              ))}
            </div>
          ) : (
            <LockedSection
              slug={slug}
              pkg="guide"
              hint="Полные истории переезда с подводными камнями и неочевидными выводами."
            >
              <div className="grid md:grid-cols-2 gap-5">
                {locked.map((r, i) => (
                  <ReviewCard key={i} r={r} />
                ))}
              </div>
            </LockedSection>
          )}
        </div>
      )}
    </section>
  );
}
