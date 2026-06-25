"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { AxisKey } from "@/lib/rating";

export type RatedCity = {
  slug: string;
  name: string;
  country: string;
  flag: string;
  total: number;
  coverage: "full" | "partial";
  axes: Record<AxisKey, { value: number; available: boolean }>;
};

type SortKey = "total" | AxisKey;

const SORTS: { key: SortKey; label: string }[] = [
  { key: "total", label: "Общий балл" },
  { key: "cost", label: "Доступность" },
  { key: "climate", label: "Климат" },
  { key: "move", label: "Простота переезда" },
  { key: "infra", label: "Инфраструктура" },
];

function metric(c: RatedCity, key: SortKey): { value: number; available: boolean } {
  if (key === "total") return { value: c.total, available: true };
  return c.axes[key];
}

export function RatingClient({ cities }: { cities: RatedCity[] }) {
  const [sort, setSort] = useState<SortKey>("total");

  const sorted = useMemo(() => {
    return [...cities].sort((a, b) => {
      const ma = metric(a, sort);
      const mb = metric(b, sort);
      // Города без данных по выбранной оси — вниз.
      if (ma.available !== mb.available) return ma.available ? -1 : 1;
      return mb.value - ma.value || b.total - a.total;
    });
  }, [cities, sort]);

  return (
    <section className="max-w-4xl mx-auto px-6 pb-8">
      {/* Сортировка */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSort(s.key)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition border ${
              sort === s.key
                ? "bg-copper text-pine-tree border-copper"
                : "border-hairline text-brandy/80 hover:text-cream hover:border-copper/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ol className="space-y-2.5">
        {sorted.map((c, i) => {
          const m = metric(c, sort);
          return (
            <li key={c.slug}>
              <Link
                href={`/city/${c.slug}`}
                className="flex items-center gap-4 rounded-2xl bg-surface border hairline px-4 py-3.5 md:px-5 hover:border-copper/30 transition group"
              >
                <span className="w-7 text-center font-serif text-xl text-brandy/45 tabular-nums shrink-0">
                  {i + 1}
                </span>
                <span className="text-2xl leading-none shrink-0" aria-hidden>
                  {c.flag}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-cream font-medium group-hover:text-copper transition truncate">
                    {c.name}
                  </span>
                  <span className="block text-brandy/55 text-sm truncate">
                    {c.country}
                    {c.coverage === "partial" && (
                      <span className="text-brandy/40"> · оценка по 3 параметрам</span>
                    )}
                  </span>
                </span>

                {/* Значение выбранной метрики */}
                <span className="hidden sm:flex items-center gap-3 w-40 shrink-0">
                  <span className="flex-1 h-2 rounded-full bg-cream/8 overflow-hidden">
                    {m.available && (
                      <span
                        className="block h-full bg-copper rounded-full"
                        style={{ width: `${m.value * 10}%` }}
                        aria-hidden
                      />
                    )}
                  </span>
                </span>
                <span className="w-12 text-right font-semibold tabular-nums shrink-0">
                  {m.available ? (
                    <span className="text-copper">{m.value.toFixed(1)}</span>
                  ) : (
                    <span className="text-brandy/35 text-xs">н/д</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
