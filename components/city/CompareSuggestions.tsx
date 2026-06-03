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
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-2">
        Сравни {current.name_ru} с другим городом
      </h2>
      <p className="text-brandy/70 mb-8">
        Прямое сравнение по аренде, продуктам, транспорту, ЖКХ и сложности
        переезда.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pairs.map(({ target, pairSlug }) => (
          <Link
            key={target.id}
            href={`/compare/${pairSlug}`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-kombu-green/40 border border-dingley/30 transition hover:border-pale-copper/60"
          >
            <span className="text-2xl" aria-hidden>
              {target.flag_emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-cream font-medium truncate">
                {current.name_ru} vs {target.name_ru}
              </p>
              <p className="text-brandy/60 text-xs">{target.country_ru}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
