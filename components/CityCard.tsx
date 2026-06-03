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

export function CityCard({
  city,
  index,
}: {
  city: CityWithMinRent;
  index: number;
}) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const photo = unsplashSrc(city.unsplash_url, { w: 600, q: 75 });

  return (
    <div className="group relative block aspect-[4/5] overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1">
      <FavoriteButton slug={city.slug} cityName={city.name_ru} variant="card" />
      <Link href={`/city/${city.slug}`} className="absolute inset-0 block">
        {photo ? (
          <Image
            src={photo}
            alt={`${city.name_ru} — фото города`}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/30 to-transparent" />

        <div className="relative h-full flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <span className="text-4xl drop-shadow-lg" aria-hidden>
              {city.flag_emoji}
            </span>
            <span className="text-xs uppercase tracking-wider text-cream/90 bg-pine-tree/50 backdrop-blur px-2 py-1 rounded">
              {city.country_ru}
            </span>
          </div>

          <div>
            <h3 className="font-serif text-3xl text-cream mb-1 drop-shadow-lg">
              {city.name_ru}
            </h3>
            {city.min_rent > 0 && (
              <p className="text-pale-copper text-sm drop-shadow">
                Аренда от {formatRub(city.min_rent)}/мес
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
