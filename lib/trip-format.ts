// Чистые хелперы форматирования/расчётов для фичи «Маршруты на день» —
// без "use client", чтобы одинаково работать и в серверном
// app/[locale]/city/[slug]/trip/page.tsx (факт-строка, метаданные), и в
// клиентских components/trip/*.

import type { CityRoute, RouteStop } from "@/lib/city-routes";
import { formatRub } from "@/lib/cities";

const nf = new Intl.NumberFormat("ru-RU");

export function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export function pluralPoints(n: number): string {
  return pluralRu(n, "точка", "точки", "точек");
}

export function pluralRoutes(n: number): string {
  return pluralRu(n, "маршрут", "маршрута", "маршрутов");
}

export function formatDurationRange([min, max]: [number, number]): string {
  return min === max ? `${min} мин` : `${min}–${max} мин`;
}

export function formatCostRange([min, max]: [number, number]): string {
  if (min === 0 && max === 0) return "бесплатно";
  if (min === max) return `${nf.format(min)} ₽`;
  if (min === 0) return `до ${nf.format(max)} ₽`;
  return `${nf.format(min)}–${nf.format(max)} ₽`;
}

export function formatHoursRange([min, max]: [number, number]): string {
  const hourWord = (n: number) => pluralRu(n, "час", "часа", "часов");
  return min === max ? `${min} ${hourWord(min)}` : `${min}–${max} ${hourWord(max)}`;
}

export const TRANSFER_MODE_LABELS: Record<"walk" | "transit" | "taxi", string> = {
  walk: "пешком",
  transit: "на транспорте",
  taxi: "на такси",
};

/** Суммарная стоимость всего маршрута (точки + платные переезды), мин/макс. */
export function routeCostTotal(route: CityRoute): [number, number] {
  const min = route.stops.reduce(
    (s, st) => s + st.cost_rub[0] + (st.transfer?.cost_rub ?? 0),
    0,
  );
  const max = route.stops.reduce(
    (s, st) => s + st.cost_rub[1] + (st.transfer?.cost_rub ?? 0),
    0,
  );
  return [min, max];
}

/** Минимальная стоимость самого дешёвого из маршрутов (нижняя граница). */
export function cheapestRouteFrom(routes: CityRoute[]): number {
  if (routes.length === 0) return 0;
  return Math.min(...routes.map((r) => routeCostTotal(r)[0]));
}

export function totalStopsCount(routes: CityRoute[]): number {
  return routes.reduce((s, r) => s + r.stops.length, 0);
}

export function formatTransfer(t: NonNullable<RouteStop["transfer"]>): string {
  const base = `${t.minutes} мин ${TRANSFER_MODE_LABELS[t.mode]}`;
  return t.cost_rub ? `${base}, ${formatRub(t.cost_rub)}` : base;
}
