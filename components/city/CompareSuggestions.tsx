import Link from "next/link";
import type { CityWithMinRent, City } from "@/lib/types";

export function CompareSuggestions({
  current,
  candidates,
}: {
  current: City;
  candidates: CityWithMinRent[];
}) {
  // Берем первые 4 похожих города и собираем алфавитные canonical-пары.
  const pairs = candidates.slice(0, 4).map((c) => {
    const [a, b] = [current.slug, c.slug].sort();
    return {
      target: c,
      pairSlug: `${a}-vs-${b}`,
    };
  });

  if (pairs.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <span className="eyebrow">Сравнение</span>
      <h2 className="font-serif text-4xl md:text-5xl text-cream mt-6 mb-3 text-balance">
        {current.name_ru} рядом с другим городом
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-xl text-pretty">
        Прямое сравнение по аренде, продуктам, транспорту, ЖКХ и сложности переезда.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pairs.map(({ target, pairSlug }) => (
          <Link
            key={target.id}
            href={`/compare/${pairSlug}`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface border hairline transition hover:border-copper/40 hover:bg-surface-elevated group"
          >
            <span className="text-2xl shrink-0" aria-hidden>
              {target.flag_emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-cream font-medium truncate group-hover:text-copper transition">
                {current.name_ru} <span className="text-brandy/55">vs</span> {target.name_ru}
              </p>
              <p className="text-brandy/65 text-xs">{target.country_ru}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
