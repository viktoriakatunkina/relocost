"use client";

import { useUnlocked, isUnlocked } from "@/lib/unlocked";
import { LockedSection } from "@/components/freemium/LockedSection";
import type { CityContent } from "@/lib/cities-content";

function ReviewCard({
  r,
}: {
  r: CityContent["reviews"][number];
}) {
  return (
    <article className="p-6 md:p-8 rounded-2xl bg-kombu-green/40 border border-dingley/30">
      <blockquote className="text-brandy/90 leading-relaxed mb-5">
        «{r.text}»
      </blockquote>
      <footer className="text-sm text-brandy/70">
        <span className="text-cream font-medium">{r.author}</span>
        {r.age ? `, ${r.age}` : ""}
        {r.profession ? ` · ${r.profession}` : ""}
        {r.moved_year ? ` · переехал(а) в ${r.moved_year}` : ""}
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

  // Замки только для иностранных городов
  const useLock = isForeign;
  const free = useLock ? reviews.slice(0, 1) : reviews;
  const locked = useLock ? reviews.slice(1) : [];

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
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
