import Link from "next/link";
import type { CountryAggregate } from "@/lib/countries";
import { formatRub } from "@/lib/cities";

const DIFF_LABEL: Record<number, string> = {
  1: "Легкий",
  2: "Средний",
  3: "Средний+",
  4: "Сложный",
  5: "Сложный+",
};

export function CountryCard({ country }: { country: CountryAggregate }) {
  return (
    <Link
      href={`/country/${country.slug}`}
      className="group relative flex flex-col gap-5 p-6 md:p-7 rounded-3xl bg-surface border hairline transition hover:-translate-y-1 hover:border-copper/40 hover:bg-surface-elevated min-h-[16rem]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-5xl md:text-6xl leading-none drop-shadow-lg" aria-hidden>
          {country.flag_emoji}
        </span>
        <span className="chip shrink-0">
          {country.city_count} {pluralize(country.city_count, ["город", "города", "городов"])}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-serif text-3xl md:text-[2rem] text-cream leading-tight mb-2 group-hover:text-copper transition">
          {country.country_ru}
        </h3>
        {country.cities_preview.length > 0 && (
          <p className="text-brandy/70 text-sm leading-relaxed">
            {country.cities_preview.join(", ")}
            {country.city_count > country.cities_preview.length && " и др."}
          </p>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 pt-2 border-t hairline">
        <div>
          <p className="text-brandy/55 text-[11px] uppercase tracking-[0.15em] mb-1">
            Аренда от
          </p>
          <p className="text-cream font-semibold tabular-nums">
            {country.min_rent > 0 ? `${formatRub(country.min_rent)}/мес` : "—"}
          </p>
        </div>
        {country.avg_difficulty > 0 && (
          <div className="text-right">
            <p className="text-brandy/55 text-[11px] uppercase tracking-[0.15em] mb-1">
              Сложность
            </p>
            <span className="inline-flex items-center gap-1.5 text-cream text-sm">
              <DotIcon score={country.avg_difficulty} />
              {DIFF_LABEL[country.avg_difficulty] ?? "—"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

function DotIcon({ score }: { score: number }) {
  const color =
    score <= 2 ? "bg-emerald-400" : score === 3 ? "bg-amber-400" : "bg-copper";
  return <span className={`w-2 h-2 rounded-full ${color}`} aria-hidden />;
}

function pluralize(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}
