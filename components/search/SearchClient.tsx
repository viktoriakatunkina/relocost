"use client";

import { useMemo, useState } from "react";
import type { CityWithBudget } from "@/lib/types";
import { CityCard } from "@/components/CityCard";
import { formatRub } from "@/lib/cities";

type Region = "all" | "ru" | "cis" | "europe" | "asia" | "middle_east";
type Climate = "all" | "tropical" | "temperate" | "cool";
type Difficulty = "all" | "easy" | "medium" | "hard";
type Sort = "budget" | "difficulty" | "name" | "popular";

const REGION_BY_SLUG: Record<string, Exclude<Region, "all">> = {
  moscow: "ru",
  spb: "ru",
  krasnodar: "ru",
  sochi: "ru",
  kaliningrad: "ru",
  yerevan: "cis",
  almaty: "cis",
  tbilisi: "europe",
  belgrade: "europe",
  istanbul: "europe",
  alanya: "europe",
  limassol: "europe",
  budapest: "europe",
  lisbon: "europe",
  bali: "asia",
  bangkok: "asia",
  dubai: "middle_east",
  astana: "cis",
  samarkand: "cis",
  izmir: "europe",
  porto: "europe",
  malaga: "europe",
};

const CLIMATE_BY_SLUG: Record<string, Exclude<Climate, "all">> = {
  bali: "tropical",
  bangkok: "tropical",
  dubai: "tropical",
  alanya: "tropical",
  limassol: "tropical",
  tbilisi: "temperate",
  yerevan: "temperate",
  belgrade: "temperate",
  almaty: "temperate",
  krasnodar: "temperate",
  sochi: "temperate",
  istanbul: "temperate",
  budapest: "temperate",
  lisbon: "temperate",
  kaliningrad: "cool",
  moscow: "cool",
  spb: "cool",
  astana: "cool",
  izmir: "temperate",
  porto: "temperate",
  malaga: "temperate",
  samarkand: "temperate",
};

// Города без визы для россиян (безвиз или visa-on-arrival ≥ 30 дней)
const VISA_FREE_FOR_RU = new Set([
  "tbilisi",
  "yerevan",
  "belgrade",
  "bali",
  "bangkok",
  "almaty",
  "krasnodar",
  "sochi",
  "kaliningrad",
  "moscow",
  "spb",
  "dubai",
  "istanbul",
  "alanya",
  "astana",
  "samarkand",
  "izmir",
]);

const REGION_OPTIONS: [Region, string][] = [
  ["all", "Любой"],
  ["ru", "Россия"],
  ["cis", "СНГ"],
  ["europe", "Европа"],
  ["asia", "Азия"],
  ["middle_east", "Ближний Восток"],
];

const CLIMATE_OPTIONS: [Climate, string][] = [
  ["all", "Любой"],
  ["tropical", "Тропики"],
  ["temperate", "Умеренный"],
  ["cool", "Прохладный"],
];

const DIFFICULTY_OPTIONS: [Difficulty, string][] = [
  ["all", "Любая"],
  ["easy", "Легкий"],
  ["medium", "Средний"],
  ["hard", "Сложный"],
];

const SORT_OPTIONS: [Sort, string][] = [
  ["budget", "Сначала дешевле"],
  ["difficulty", "Проще переезд"],
  ["popular", "Сначала популярные"],
  ["name", "По алфавиту"],
];

function diffBucket(score: number | null): Exclude<Difficulty, "all"> | null {
  if (score == null) return null;
  if (score <= 1) return "easy";
  if (score <= 3) return "medium";
  return "hard";
}

export function SearchClient({ cities }: { cities: CityWithBudget[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region>("all");
  const [climate, setClimate] = useState<Climate>("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [visaFree, setVisaFree] = useState(false);
  const [sort, setSort] = useState<Sort>("budget");

  // Границы бюджета считаем по данным, округляя до 5 000 ₽.
  const { lo, hi } = useMemo(() => {
    const vals = cities.map((c) => c.monthly_from).filter((v) => v > 0);
    if (!vals.length) return { lo: 20000, hi: 200000 };
    const min = Math.floor(Math.min(...vals) / 5000) * 5000;
    const max = Math.ceil(Math.max(...vals) / 5000) * 5000;
    return { lo: min, hi: max };
  }, [cities]);

  // null = «любой» (ползунок в крайнем правом положении)
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const sliderValue = budgetMax ?? hi;
  const pct = hi > lo ? ((sliderValue - lo) / (hi - lo)) * 100 : 100;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const max = budgetMax ?? Infinity;
    const list = cities.filter((c) => {
      if (
        q &&
        !c.name_ru.toLowerCase().includes(q) &&
        !c.country_ru.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (region !== "all" && REGION_BY_SLUG[c.slug] !== region) return false;
      if (climate !== "all" && CLIMATE_BY_SLUG[c.slug] !== climate) return false;
      if (difficulty !== "all" && diffBucket(c.difficulty_score) !== difficulty)
        return false;
      if (c.monthly_from > 0 && c.monthly_from > max) return false;
      if (visaFree && !VISA_FREE_FOR_RU.has(c.slug)) return false;
      return true;
    });

    const byName = (a: CityWithBudget, b: CityWithBudget) =>
      a.name_ru.localeCompare(b.name_ru, "ru");

    return list.sort((a, b) => {
      if (sort === "budget") {
        const av = a.monthly_from || Infinity;
        const bv = b.monthly_from || Infinity;
        return av - bv || byName(a, b);
      }
      if (sort === "difficulty") {
        return (a.difficulty_score ?? 99) - (b.difficulty_score ?? 99) || byName(a, b);
      }
      if (sort === "popular") {
        return Number(b.is_popular) - Number(a.is_popular) || byName(a, b);
      }
      return byName(a, b);
    });
  }, [cities, query, region, climate, difficulty, budgetMax, visaFree, sort]);

  const activeFilters =
    (region !== "all" ? 1 : 0) +
    (climate !== "all" ? 1 : 0) +
    (difficulty !== "all" ? 1 : 0) +
    (budgetMax !== null ? 1 : 0) +
    (visaFree ? 1 : 0);

  function reset() {
    setQuery("");
    setRegion("all");
    setClimate("all");
    setDifficulty("all");
    setBudgetMax(null);
    setVisaFree(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="rounded-3xl bg-surface/80 backdrop-blur border hairline shadow-card p-5 md:p-7 mb-8">
        {/* Строка поиска */}
        <div className="relative mb-7">
          <span
            className="absolute left-5 top-1/2 -translate-y-1/2 text-copper pointer-events-none"
            aria-hidden
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Город или страна"
            className="w-full pr-5 py-4 rounded-pill bg-pine-tree/60 text-cream placeholder-brandy/45 text-lg border hairline focus:border-copper focus:outline-none transition [color-scheme:dark]"
            style={{ paddingLeft: "3.25rem" }}
            aria-label="Поиск города или страны"
          />
        </div>

        {/* Чип-группы */}
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          <ChipGroup label="Регион" value={region} options={REGION_OPTIONS} onChange={setRegion} />
          <ChipGroup label="Климат" value={climate} options={CLIMATE_OPTIONS} onChange={setClimate} />
          <ChipGroup label="Сложность переезда" value={difficulty} options={DIFFICULTY_OPTIONS} onChange={setDifficulty} />

          {/* Бюджет */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-brandy/55 text-[11px] uppercase tracking-[0.15em]">
                Бюджет в месяц
              </span>
              <span className="text-copper font-semibold text-sm tabular-nums">
                {budgetMax === null ? "Любой" : `до ${formatRub(budgetMax)}`}
              </span>
            </div>
            <input
              type="range"
              min={lo}
              max={hi}
              step={5000}
              value={sliderValue}
              onChange={(e) => {
                const v = Number(e.target.value);
                setBudgetMax(v >= hi ? null : v);
              }}
              className="range-copper w-full"
              style={{
                background: `linear-gradient(to right, var(--copper) 0%, var(--copper) ${pct}%, rgba(222,197,158,0.16) ${pct}%, rgba(222,197,158,0.16) 100%)`,
              }}
              aria-label="Максимальный месячный бюджет"
            />
            <div className="flex justify-between text-brandy/40 text-[11px] mt-2 tabular-nums">
              <span>{formatRub(lo)}</span>
              <span>{formatRub(hi)}+</span>
            </div>
          </div>
        </div>

        {/* Нижняя панель: виза + сортировка + сброс */}
        <div className="flex flex-wrap items-center gap-4 mt-7 pt-6 border-t hairline">
          <button
            type="button"
            onClick={() => setVisaFree((v) => !v)}
            className={`inline-flex items-center gap-2.5 rounded-pill border px-4 py-2 text-sm transition ${
              visaFree
                ? "bg-copper/15 border-copper/50 text-cream"
                : "hairline text-brandy/85 hover:border-copper/50"
            }`}
            aria-pressed={visaFree}
          >
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                visaFree ? "bg-copper" : "bg-cream/15"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-cream shadow transition-transform ${
                  visaFree ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
            Без визы для россиян
          </button>

          <label className="inline-flex items-center gap-2 ml-auto text-brandy/70 text-sm">
            <span className="hidden sm:inline">Сортировка</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="appearance-none rounded-pill bg-pine-tree/60 border hairline text-cream pl-4 pr-9 py-2 text-sm focus:border-copper focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(([v, lbl]) => (
                  <option key={v} value={v} className="bg-pine-tree">
                    {lbl}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-copper pointer-events-none"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </label>
        </div>
      </div>

      {/* Счетчик + сброс */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-cream font-medium">
          {filtered.length}{" "}
          <span className="text-brandy/55 font-normal">
            {plural(filtered.length, "город", "города", "городов")}
          </span>
        </span>
        {(activeFilters > 0 || query) && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-copper text-sm hover:text-brandy transition"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Сбросить{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brandy/80 text-lg mb-4">
            Под такие условия ничего не нашли.
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-copper hover:underline"
          >
            Ослабить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <CityCard key={c.id} city={c} index={i} />
          ))}
        </div>
      )}

      <style jsx>{`
        .range-copper {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }
        .range-copper::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background: var(--cream);
          border: 4px solid var(--copper);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
          cursor: pointer;
        }
        .range-copper::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: var(--cream);
          border: 4px solid var(--copper);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
          cursor: pointer;
        }
        .range-copper::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="block text-brandy/55 text-[11px] uppercase tracking-[0.15em] mb-2.5">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, lbl]) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={active}
              className={`rounded-pill border px-3.5 py-2 text-sm transition ${
                active
                  ? "bg-copper text-pine-tree border-transparent font-semibold"
                  : "hairline text-brandy/85 hover:border-copper/60 hover:text-cream"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function plural(n: number, one: string, two: string, many: string): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return two;
  return many;
}
