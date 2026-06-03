import Link from "next/link";
import type { CityWithMinRent } from "@/lib/types";
import { formatRub } from "@/lib/cities";

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

  return (
    <Link
      href={`/city/${city.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/40 to-transparent" />

      <div className="relative h-full flex flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="text-4xl" aria-hidden>
            {city.flag_emoji}
          </span>
          {city.is_foreign ? (
            <span className="text-xs uppercase tracking-wider text-brandy/80">
              {city.country_ru}
            </span>
          ) : (
            <span className="text-xs uppercase tracking-wider text-brandy/80">
              Россия
            </span>
          )}
        </div>

        <div>
          <h3 className="font-serif text-3xl text-cream mb-1">
            {city.name_ru}
          </h3>
          {city.min_rent > 0 && (
            <p className="text-pale-copper text-sm">
              Аренда от {formatRub(city.min_rent)}/мес
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
