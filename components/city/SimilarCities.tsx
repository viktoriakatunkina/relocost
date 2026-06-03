import Link from "next/link";
import type { CityWithMinRent } from "@/lib/types";
import { formatRub } from "@/lib/cities";
import { typo } from "@/lib/typography";

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
      <span className="eyebrow">Сравните</span>
      <h2 className="font-serif text-4xl md:text-5xl text-cream mt-6 mb-3">
        Похожие направления
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-xl text-pretty">
        {typo(
          isForeign
            ? "Другие города за рубежом, которые часто рассматривают вместе."
            : "Другие города России, которые часто рассматривают вместе.",
        )}
      </p>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6">
        {cities.map((c) => (
          <Link
            key={c.id}
            href={`/city/${c.slug}`}
            className="snap-start shrink-0 w-64 md:w-72 p-6 rounded-3xl bg-surface border hairline transition hover:-translate-y-1 hover:border-copper/40 hover:bg-surface-elevated group"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-4xl" aria-hidden>
                {c.flag_emoji}
              </span>
              <span className="chip">
                {c.country_ru}
              </span>
            </div>
            <h3 className="font-serif text-2xl text-cream mb-1.5 group-hover:text-copper transition">
              {c.name_ru}
            </h3>
            {c.min_rent > 0 && (
              <p className="text-brandy/75 text-sm">
                Аренда от <span className="text-cream font-semibold">{formatRub(c.min_rent)}</span>/мес
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
