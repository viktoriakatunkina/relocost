import { Link } from "@/i18n/navigation";
import { CITY_ROUTES } from "@/lib/city-routes";
import { totalStopsCount, pluralPoints, pluralRoutes } from "@/lib/trip-format";

// Карточка со ссылкой на /city/[slug]/trip — только для городов, у которых
// есть контент маршрутов (lib/city-routes.ts; список читается динамически,
// новые города подхватываются сами). Никакого туристического
// текста/schema.org здесь и на самой странице города — это осознанное
// ограничение (весь контент только на /trip).
//
// 2026-09-09: блок был тонкой полоской-ссылкой в самом низу страницы и за 30
// дней собрал 0 переходов. Поднят в денежную зону (сразу после PricesTable) и
// усилен визуально: копперовая рамка + бейдж + кнопка вместо текстовой ссылки,
// чтобы не читаться как рядовой пункт перелинковки.
export function TripTeaser({ slug, cityName }: { slug: string; cityName: string }) {
  const routes = CITY_ROUTES[slug];
  if (!routes || routes.length === 0) return null;

  const totalStops = totalStopsCount(routes);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-16">
      <Link
        href={`/city/${slug}/trip`}
        className="group block rounded-3xl border-2 border-copper/35 bg-surface px-6 py-6 md:px-8 md:py-7 hover:border-copper/60 hover:bg-surface-elevated transition"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-pill bg-copper/15 border border-copper/30 px-3 py-1 text-copper text-[11px] uppercase tracking-wider font-semibold mb-3">
              Первый маршрут бесплатно
            </span>
            <span className="block text-cream font-serif text-2xl md:text-3xl leading-tight text-pretty">
              Маршруты на день по {cityName}
            </span>
            <span className="block text-brandy/75 text-sm md:text-base mt-2 leading-relaxed">
              {routes.length} {pluralRoutes(routes.length)}, {totalStops}{" "}
              {pluralPoints(totalStops)} — с таймингом, дорогой между точками и
              ценой каждого шага. Готовый план, а не список достопримечательностей.
            </span>
          </div>
          <span className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm group-hover:bg-brandy transition">
            Смотреть маршруты
            <svg
              width="15"
              height="15"
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
        </div>
      </Link>
    </section>
  );
}
