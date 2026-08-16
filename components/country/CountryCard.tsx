import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CountryAggregate } from "@/lib/countries";
import { formatMinRent } from "@/lib/cities";
import { cityPhotoSrc } from "@/lib/photo";
import { getDifficulty } from "@/lib/difficulty";
import { countryName } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/routing";

const DIFFICULTY_KEY = { green: "easy", yellow: "medium", red: "hard" } as const;

export function CountryCard({ country }: { country: CountryAggregate }) {
  const locale = useLocale() as Locale;
  const td = useTranslations("difficulty");
  const tc = useTranslations("common");

  const name = countryName(country, locale);
  // Фон карточки — фото репрезентативного города страны через R2 (если доступен)
  // или Supabase Storage как fallback.
  const photo = cityPhotoSrc(
    country.photo_city_slug ?? country.slug,
    null,
    country.photo_url,
    { w: 720, q: 80 },
  );
  // Сложность страны сводим к тем же 3 уровням, что у городов.
  const difficulty = getDifficulty({
    difficulty_score: country.avg_difficulty > 0 ? country.avg_difficulty : null,
  });

  return (
    <Link
      href={`/country/${country.slug}`}
      className="group relative flex h-full min-h-[16rem] flex-col overflow-hidden rounded-3xl border hairline bg-surface transition hover:-translate-y-1 hover:border-copper/40 hover:shadow-card"
    >
      {photo ? (
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-kombu-green via-kombu-green to-pine-tree"
          aria-hidden
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/55 to-pine-tree/20" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-cream/5 rounded-3xl" />

      <div className="relative flex h-full flex-col justify-between gap-5 p-6 md:p-7">
        <div className="flex items-start justify-between gap-3">
          <span
            className="text-5xl md:text-6xl leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
            aria-hidden
          >
            {country.flag_emoji}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-pill text-[11px] font-medium bg-black/55 backdrop-blur-md border border-white/20 text-white">
            {tc("cityCount", { count: country.city_count })}
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="font-serif text-3xl md:text-[2rem] text-cream leading-tight mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] group-hover:text-copper transition">
            {name}
          </h3>
          {country.cities_preview.length > 0 && (
            <p className="text-cream/80 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem] drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
              {country.cities_preview.join(", ")}
              {country.city_count > country.cities_preview.length &&
                ` ${tc("more")}`}
            </p>
          )}

          <div className="flex items-end justify-between gap-3 pt-4 border-t border-white/15">
            {difficulty && (
              <span className="inline-flex items-center gap-1.5 text-cream text-sm drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                <span
                  className={`w-2 h-2 rounded-full ${difficulty.dotClass}`}
                  aria-hidden
                />
                {td(DIFFICULTY_KEY[difficulty.color])}
              </span>
            )}
            <div className="text-right">
              <p className="text-cream/60 text-xs drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                {tc("rentFrom")}
              </p>
              <p className="text-cream font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                {country.min_rent > 0
                  ? `${formatMinRent(country.min_rent, country.min_rent_currency)}${tc("perMonth")}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
