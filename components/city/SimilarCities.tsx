import Link from "next/link";
import type { CityWithMinRent } from "@/lib/types";
import { formatRub } from "@/lib/cities";

export function SimilarCities({
  cities,
  isForeign,
}: {
  cities: CityWithMinRent[];
  isForeign: boolean;
}) {
  if (!cities.length) return null;
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-2">
        Похожие направления
      </h2>
      <p className="text-brandy/70 mb-8">
        {isForeign
          ? "Другие города за рубежом, которые часто рассматривают вместе."
          : "Другие города России, которые часто рассматривают вместе."}
      </p>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {cities.map((c) => (
          <Link
            key={c.id}
            href={`/city/${c.slug}`}
            className="snap-start shrink-0 w-64 md:w-72 p-6 rounded-2xl bg-kombu-green/40 border border-dingley/30 transition hover:-translate-y-1 hover:border-pale-copper/60"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl" aria-hidden>
                {c.flag_emoji}
              </span>
              <span className="text-brandy/60 text-xs uppercase tracking-wider">
                {c.country_ru}
              </span>
            </div>
            <h3 className="font-serif text-2xl text-cream mb-1">{c.name_ru}</h3>
            {c.min_rent > 0 && (
              <p className="text-pale-copper text-sm">
                Аренда от {formatRub(c.min_rent)}/мес
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
