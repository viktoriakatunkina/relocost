import type { CityContent } from "@/lib/cities-content";
import { typo } from "@/lib/typography";
import { movedVerbRu } from "@/lib/gender";

function ReviewCard({
  r,
}: {
  r: CityContent["reviews"][number];
}) {
  return (
    <article className="relative p-6 md:p-8 rounded-3xl bg-surface border hairline">
      <span className="absolute -top-2 left-5 text-5xl md:text-6xl font-serif text-copper/40 leading-none select-none pointer-events-none" aria-hidden>
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
        {r.moved_year ? (
          <span>
            {movedVerbRu(r.author)} в {r.moved_year}
          </span>
        ) : null}
      </footer>
    </article>
  );
}

export function Reviews({
  reviews,
}: {
  slug?: string;
  isForeign?: boolean;
  reviews: CityContent["reviews"];
}) {
  if (!reviews.length) return null;

  return (
    <section id="reviews" className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Опыт</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-10">
        Отзывы переехавших
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {reviews.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>
    </section>
  );
}
