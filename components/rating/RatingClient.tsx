"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { AxisKey } from "@/lib/rating";

// ── Types ─────────────────────────────────────────────────────────────────────

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
type ViewMode = "grid" | "list";

// ── Constants ─────────────────────────────────────────────────────────────────

const SORTS: { key: SortKey; label: string }[] = [
  { key: "total", label: "Общий балл" },
  { key: "cost", label: "Доступность" },
  { key: "climate", label: "Климат" },
  { key: "move", label: "Простота переезда" },
  { key: "infra", label: "Инфраструктура" },
];

const AXIS_LABELS: Record<string, string> = {
  cost: "Доступность",
  climate: "Климат",
  move: "Переезд",
  infra: "Инфраструктура",
};

const AXES_ORDER: AxisKey[] = ["cost", "climate", "move", "infra"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function metric(c: RatedCity, key: SortKey): { value: number; available: boolean } {
  if (key === "total") return { value: c.total, available: true };
  return c.axes[key];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreBar({ value, available }: { value: number; available: boolean }) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-cream/8 overflow-hidden">
      {available && (
        <div
          className="h-full bg-copper/65 rounded-full"
          style={{ width: `${value * 10}%` }}
          aria-hidden
        />
      )}
    </div>
  );
}

function RankMedal({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="text-brandy/40 font-serif text-sm sm:text-lg tabular-nums">{rank}</span>
    );
  }
  const configs = [
    { bg: "bg-amber-400", text: "text-amber-900", border: "border-amber-300", label: "Место 1" },
    { bg: "bg-slate-300", text: "text-slate-700", border: "border-slate-200", label: "Место 2" },
    { bg: "bg-orange-600", text: "text-orange-50", border: "border-orange-500", label: "Место 3" },
  ];
  const cfg = configs[rank - 1];
  return (
    <span
      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 shadow-sm shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
      aria-label={cfg.label}
    >
      {rank}
    </span>
  );
}

function GridIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Card component ────────────────────────────────────────────────────────────

function RatingCard({ city, rank }: { city: RatedCity; rank: number }) {
  const cardBorder =
    rank === 1
      ? "border-amber-400/35 bg-amber-400/4"
      : rank === 2
      ? "border-slate-400/25 bg-slate-400/4"
      : rank === 3
      ? "border-orange-600/25 bg-orange-600/4"
      : "border-hairline bg-surface";

  return (
    <div
      className={`rounded-xl sm:rounded-2xl border ${cardBorder} overflow-hidden flex flex-col hover:border-copper/35 transition-colors group`}
    >
      {/* Card header */}
      <div className="px-2.5 pt-2.5 pb-2 sm:px-5 sm:pt-5 sm:pb-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1.5 sm:mb-4">
          <RankMedal rank={rank} />
          <div className="text-right">
            <span className="text-copper font-bold text-base sm:text-2xl tabular-nums leading-none">
              {city.total.toFixed(1)}
            </span>
            <span className="text-brandy/45 text-[9px] sm:text-xs block mt-0.5">из 10</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 mb-0.5 sm:mb-1">
          <span className="text-2xl sm:text-5xl leading-none shrink-0" aria-hidden>
            {city.flag}
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-sm sm:text-xl text-cream leading-tight group-hover:text-copper transition-colors truncate">
              {city.name}
            </h3>
            <p className="text-brandy/55 text-[11px] sm:text-sm truncate">{city.country}</p>
          </div>
        </div>

        {city.coverage === "partial" && (
          <p className="hidden sm:block text-brandy/40 text-xs mt-2">оценка по 3 параметрам</p>
        )}
      </div>

      {/* Axes: компактная 2×2 сетка на мобильном (вместо 4 строк на всю ширину —
          иначе карточка растягивается по высоте), обычные строки от sm и шире */}
      <div className="px-2.5 pb-2 sm:px-5 sm:pb-4 flex-1">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:hidden">
          {AXES_ORDER.map((key) => {
            const ax = city.axes[key];
            return (
              <div key={key} className="flex items-center justify-between gap-1 min-w-0">
                <span className="text-brandy/55 text-[10px] truncate">
                  {AXIS_LABELS[key]}
                </span>
                <span
                  className={`text-[10px] tabular-nums shrink-0 font-medium ${
                    ax.available ? "text-brandy/70" : "text-brandy/30"
                  }`}
                >
                  {ax.available ? ax.value.toFixed(1) : "н/д"}
                </span>
              </div>
            );
          })}
        </div>
        <div className="hidden sm:block space-y-2.5">
          {AXES_ORDER.map((key) => {
            const ax = city.axes[key];
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-brandy/55 text-xs w-24 shrink-0 truncate">
                  {AXIS_LABELS[key]}
                </span>
                <ScoreBar value={ax.value} available={ax.available} />
                <span
                  className={`text-xs tabular-nums w-7 text-right shrink-0 font-medium ${
                    ax.available ? "text-brandy/70" : "text-brandy/30"
                  }`}
                >
                  {ax.available ? ax.value.toFixed(1) : "н/д"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="px-2.5 pb-2.5 pt-0.5 sm:px-5 sm:pb-5 sm:pt-1">
        <Link
          href={`/city/${city.slug}`}
          className="flex items-center justify-between w-full rounded-lg sm:rounded-xl bg-surface-elevated border hairline px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-brandy/80 hover:text-cream hover:border-copper/40 transition group/btn"
        >
          <span>Открыть город</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brandy/40 group-hover/btn:text-copper transition-colors"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function RatingClient({ cities }: { cities: RatedCity[] }) {
  const [sort, setSort] = useState<SortKey>("total");
  // Список по умолчанию: 175+ городов гигантскими карточками — это
  // бесконечный вертикальный скролл на мобильном (и просто менее сканируемо
  // на десктопе для сортируемого рейтинга). Компактные карточки остаются
  // доступны через переключатель.
  const [view, setView] = useState<ViewMode>("list");

  const sorted = useMemo(() => {
    return [...cities].sort((a, b) => {
      const ma = metric(a, sort);
      const mb = metric(b, sort);
      // Cities without data for selected axis — push to bottom.
      if (ma.available !== mb.available) return ma.available ? -1 : 1;
      return mb.value - ma.value || b.total - a.total;
    });
  }, [cities, sort]);

  return (
    <section className="max-w-5xl mx-auto px-6 pb-8">
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* Sort buttons */}
        <div className="flex flex-wrap gap-2">
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

        {/* View toggle */}
        <div className="flex items-center gap-0.5 rounded-xl border hairline p-1 shrink-0">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 rounded-lg transition ${
              view === "grid"
                ? "bg-surface-elevated text-cream"
                : "text-brandy/50 hover:text-cream"
            }`}
            title="Карточки"
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-lg transition ${
              view === "list"
                ? "bg-surface-elevated text-cream"
                : "text-brandy/50 hover:text-cream"
            }`}
            title="Список"
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {sorted.map((c, i) => (
            <RatingCard key={c.slug} city={c} rank={i + 1} />
          ))}
        </div>
      ) : (
        /* List view */
        <ol className="space-y-1.5 sm:space-y-2.5">
          {sorted.map((c, i) => {
            const m = metric(c, sort);
            return (
              <li key={c.slug}>
                <Link
                  href={`/city/${c.slug}`}
                  className="flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl bg-surface border hairline px-3 py-2.5 sm:px-4 sm:py-3.5 md:px-5 hover:border-copper/30 transition group"
                >
                  {/* Rank */}
                  <span className="w-7 sm:w-8 shrink-0 flex justify-center">
                    <RankMedal rank={i + 1} />
                  </span>

                  {/* Flag */}
                  <span className="text-xl sm:text-2xl leading-none shrink-0" aria-hidden>
                    {c.flag}
                  </span>

                  {/* Name + country */}
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

                  {/* Score bar */}
                  <span className="hidden sm:flex items-center gap-3 w-36 shrink-0">
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

                  {/* Numeric score */}
                  <span className="w-12 text-right font-semibold tabular-nums shrink-0">
                    {m.available ? (
                      <span className="text-copper">{m.value.toFixed(1)}</span>
                    ) : (
                      <span className="text-brandy/35 text-xs">н/д</span>
                    )}
                  </span>

                  {/* Arrow indicator */}
                  <span className="ml-1 w-8 h-8 rounded-full border hairline flex items-center justify-center text-brandy/35 group-hover:text-copper group-hover:border-copper/40 transition shrink-0" aria-hidden>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
