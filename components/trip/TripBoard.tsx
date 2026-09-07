"use client";

import type { CityRoute } from "@/lib/city-routes";
import { useUnlocked, isUnlocked, CITY_PACKAGES } from "@/lib/unlocked";
import { useTripProgress, isRouteComplete } from "@/lib/trip-progress";
import { pluralPoints, pluralRoutes } from "@/lib/trip-format";
import { RouteTimeline } from "./RouteTimeline";

const THEME_LABELS: Record<CityRoute["theme"], string> = {
  "first-day": "Бесплатно",
  gourmet: "Гастрономия",
  budget: "Бюджетно",
};

export function TripBoard({
  citySlug,
  cityName,
  routes,
}: {
  citySlug: string;
  cityName: string;
  routes: CityRoute[];
}) {
  const unlocked = useUnlocked(citySlug);
  const placesOpen = isUnlocked(unlocked, "places");
  const checked = useTripProgress(citySlug);

  const totalStops = routes.reduce((s, r) => s + r.stops.length, 0);
  const doneStops = checked.length;
  const pct = totalStops > 0 ? Math.round((doneStops / totalStops) * 100) : 0;

  const routeDone = routes.map((r) => isRouteComplete(checked, r.slug, r.stops.length));
  const allDone = routeDone.every(Boolean);

  const paidRoutes = routes.filter((r) => !r.free);
  const paidStops = paidRoutes.reduce((s, r) => s + r.stops.length, 0);
  const lockHint =
    paidRoutes.length > 0
      ? `Ещё ${paidRoutes.length} ${pluralRoutes(paidRoutes.length)}, ${paidStops} ${pluralPoints(paidStops)} с таймингом и ценами — ${CITY_PACKAGES.places.price} ₽`
      : undefined;

  return (
    <section className="max-w-4xl mx-auto px-6 pt-6">
      {/* Кольцо прогресса */}
      <div className="rounded-2xl bg-surface border hairline p-5 mb-8 flex items-center gap-4">
        <div className="relative shrink-0 w-14 h-14" aria-hidden>
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
            <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-cream/8" />
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 24}
              strokeDashoffset={2 * Math.PI * 24 * (1 - pct / 100)}
              className="text-copper transition-[stroke-dashoffset] duration-500 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-copper font-bold tabular-nums text-sm">
            {pct}%
          </span>
        </div>
        <div className="min-w-0">
          <span className="block text-cream font-medium">
            {doneStops} из {totalStops} {pluralPoints(totalStops)} пройдено
          </span>
          <span className="block text-brandy/55 text-sm mt-0.5">
            Отметки сохраняются в этом браузере — можно закрыть страницу и вернуться позже.
          </span>
        </div>
      </div>

      {allDone && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-copper/25 bg-copper/10 px-5 py-4 fade-in">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-copper shrink-0"
            aria-hidden
          >
            <path d="M12 3 5 6v6c0 5 3 8 7 9 4-1 7-4 7-9V6z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <div>
            <p className="text-copper font-serif text-lg leading-tight">
              Исследователь {cityName}
            </p>
            <p className="text-brandy/60 text-sm mt-0.5">
              Вы прошли все маршруты — знаете город лучше многих, кто здесь живёт.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {routes.map((route, i) => {
          const locked = !route.free && !placesOpen;
          return (
            <div key={route.slug} className="rounded-3xl border hairline bg-surface p-6 md:p-8">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <span className="chip chip-accent mb-2 inline-block">
                    {THEME_LABELS[route.theme]}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-cream leading-tight text-pretty">
                    {route.title}
                  </h2>
                </div>
                {routeDone[i] && (
                  <span className="shrink-0 text-xs font-medium text-copper bg-copper/12 px-2.5 py-1 rounded-pill">
                    Пройдено
                  </span>
                )}
              </div>
              <p className="text-brandy/75 mb-6 text-pretty">{route.summary}</p>
              <RouteTimeline
                citySlug={citySlug}
                route={route}
                locked={locked}
                lockHint={lockHint}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
