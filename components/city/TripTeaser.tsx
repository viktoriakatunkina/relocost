import { Link } from "@/i18n/navigation";
import { CITY_ROUTES } from "@/lib/city-routes";
import { totalStopsCount, pluralPoints, pluralRoutes } from "@/lib/trip-format";

// Компактная карточка-полоска со ссылкой на /city/[slug]/trip — только для
// городов, у которых есть контент маршрутов (lib/city-routes.ts, сейчас 6 из
// 175). Никакого туристического текста/schema.org здесь и на самой странице
// города — это осознанное ограничение (весь контент только на /trip).
export function TripTeaser({ slug, cityName }: { slug: string; cityName: string }) {
  const routes = CITY_ROUTES[slug];
  if (!routes || routes.length === 0) return null;

  const totalStops = totalStopsCount(routes);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-8">
      <Link
        href={`/city/${slug}/trip`}
        className="group flex items-center justify-between gap-4 rounded-2xl border hairline bg-surface px-6 py-5 hover:border-copper/35 hover:bg-surface-elevated transition"
      >
        <div className="min-w-0">
          <span className="block text-cream font-serif text-lg md:text-xl leading-tight text-pretty">
            Маршруты на день по {cityName}
          </span>
          <span className="block text-brandy/65 text-sm mt-1">
            {routes.length} {pluralRoutes(routes.length)}, {totalStops}{" "}
            {pluralPoints(totalStops)} с таймингом и ценами — первый день бесплатно
          </span>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 text-copper text-sm font-medium">
          Смотреть
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </Link>
    </section>
  );
}
