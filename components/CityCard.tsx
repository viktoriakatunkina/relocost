import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CityWithMinRent } from "@/lib/types";
import { formatMinRent } from "@/lib/cities";
import { cityPhotoSrc } from "@/lib/photo";
import { getDifficulty } from "@/lib/difficulty";
import { getVisa } from "@/lib/visa";
import { currencyLabel } from "@/lib/currency";
import { cityName, countryName } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/routing";
import { FavoriteButton } from "@/components/FavoriteButton";

const GRADIENTS = [
  "from-emerald-900 via-kombu-green to-pine-tree",
  "from-amber-900 via-kombu-green to-pine-tree",
  "from-rose-900 via-kombu-green to-pine-tree",
  "from-sky-900 via-kombu-green to-pine-tree",
  "from-violet-900 via-kombu-green to-pine-tree",
  "from-orange-900 via-kombu-green to-pine-tree",
];

const DIFFICULTY_KEY = { green: "easy", yellow: "medium", red: "hard" } as const;

export function CityCard({
  city,
  index,
}: {
  city: CityWithMinRent;
  index: number;
}) {
  const locale = useLocale() as Locale;
  const td = useTranslations("difficulty");
  const tv = useTranslations("visa");
  const tc = useTranslations("common");

  const gradient = GRADIENTS[index % GRADIENTS.length];
  const photo = cityPhotoSrc(city.slug, city.image_url, city.unsplash_url, { w: 720, q: 80 });
  const difficulty = getDifficulty(city);
  const visa = getVisa(city);
  const name = cityName(city, locale);
  const country = countryName(city, locale);

  return (
    <div className="group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
      <FavoriteButton slug={city.slug} cityName={name} variant="card" />
      <Link href={`/city/${city.slug}`} className="absolute inset-0 block">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} aria-hidden />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/65 to-pine-tree/25" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 ring-1 ring-inset ring-cream/5 rounded-3xl" />

        <div className="relative h-full flex flex-col justify-between p-4 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-black/45 backdrop-blur-md text-xs uppercase tracking-[0.15em] text-white font-semibold mr-12 max-w-[70%] border border-white/15 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
            >
              <span className="text-base leading-none" aria-hidden>{city.flag_emoji}</span>
              <span className="truncate">{country}</span>
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-serif text-[1.8rem] md:text-[2.6rem] leading-[1.05] text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                {name}
              </h3>
              {city.min_rent > 0 && (
                <p className="mt-2 text-copper text-sm font-medium tracking-wide drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
                  {tc("rentFrom")}{" "}
                  <span className="text-cream font-semibold">{formatMinRent(city.min_rent, city.currency)}</span>
                  {tc("perMonth")}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {difficulty && (
                <span className="chip">
                  <span className={`w-2 h-2 rounded-full ${difficulty.dotClass}`} aria-hidden />
                  {td(DIFFICULTY_KEY[difficulty.color])}
                </span>
              )}
              <span className="chip">
                {visa.status === "visa_free" ? <VisaFreeIcon /> : <VisaRequiredIcon />}
                {visa.status === "visa_free" ? tv("free") : tv("required")}
              </span>
              {city.currency && (
                <span className="chip hidden md:inline-flex">
                  {currencyLabel(city.currency)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="absolute right-5 bottom-5 w-9 h-9 rounded-full bg-copper text-pine-tree flex items-center justify-center opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <ArrowIcon />
        </div>
      </Link>
    </div>
  );
}

function VisaFreeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-emerald-300">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function VisaRequiredIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-copper">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
