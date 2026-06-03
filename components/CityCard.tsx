import Link from "next/link";
import Image from "next/image";
import type { CityWithMinRent } from "@/lib/types";
import { formatRub } from "@/lib/cities";
import { unsplashSrc } from "@/lib/unsplash";
import { FavoriteButton } from "@/components/FavoriteButton";

const GRADIENTS = [
  "from-emerald-900 via-kombu-green to-pine-tree",
  "from-amber-900 via-kombu-green to-pine-tree",
  "from-rose-900 via-kombu-green to-pine-tree",
  "from-sky-900 via-kombu-green to-pine-tree",
  "from-violet-900 via-kombu-green to-pine-tree",
  "from-orange-900 via-kombu-green to-pine-tree",
];

const DIFFICULTY = ["", "Легкий", "Средний", "Средний+", "Сложный", "Сложный+"];

export function CityCard({
  city,
  index,
}: {
  city: CityWithMinRent;
  index: number;
}) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const photo = unsplashSrc(city.unsplash_url, { w: 720, q: 80 });
  const diffLabel = city.difficulty_score
    ? DIFFICULTY[Math.min(city.difficulty_score, 5)] || ""
    : null;

  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
      <FavoriteButton slug={city.slug} cityName={city.name_ru} variant="card" />
      <Link href={`/city/${city.slug}`} className="absolute inset-0 block">
        {photo ? (
          <Image
            src={photo}
            alt={`${city.name_ru} — фото города`}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} aria-hidden />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/40 to-pine-tree/0" />
        <div className="absolute inset-0 ring-1 ring-inset ring-cream/5 rounded-3xl" />

        <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-pine-tree/70 backdrop-blur-md text-xs uppercase tracking-[0.15em] text-cream font-medium mr-12 max-w-[70%]"
            >
              <span className="text-base leading-none" aria-hidden>{city.flag_emoji}</span>
              <span className="truncate">{city.country_ru}</span>
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-serif text-[2.2rem] md:text-[2.6rem] leading-[1] text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]">
                {city.name_ru}
              </h3>
              {city.min_rent > 0 && (
                <p className="mt-2 text-copper text-sm font-medium tracking-wide">
                  Аренда от <span className="text-cream font-semibold">{formatRub(city.min_rent)}</span>/мес
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {diffLabel && (
                <span className="chip">
                  <DotIcon score={city.difficulty_score} />
                  {diffLabel}
                </span>
              )}
              {city.flight_from_moscow && (
                <span className="chip">
                  <PlaneIcon />
                  {city.flight_from_moscow}
                </span>
              )}
              {city.currency && (
                <span className="chip hidden md:inline-flex">
                  {city.currency.split(",")[0]}
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

function DotIcon({ score }: { score: number | null }) {
  const color =
    !score ? "bg-muted-green" :
    score <= 2 ? "bg-emerald-400" :
    score === 3 ? "bg-amber-400" :
    "bg-rose-400";
  return <span className={`w-2 h-2 rounded-full ${color}`} aria-hidden />;
}

function PlaneIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
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
