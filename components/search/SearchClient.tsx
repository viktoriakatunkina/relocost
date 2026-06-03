"use client";

import { useMemo, useState } from "react";
import type { CityWithMinRent } from "@/lib/types";
import { CityCard } from "@/components/CityCard";

type Region = "all" | "ru" | "cis" | "europe" | "asia" | "middle_east";
type Climate = "all" | "tropical" | "temperate" | "cool";
type Budget = "all" | "30000" | "50000" | "80000" | "120000";

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
]);

const REGION_LABELS: Record<Region, string> = {
  all: "Любой",
  ru: "Россия",
  cis: "СНГ",
  europe: "Европа",
  asia: "Азия",
  middle_east: "Ближний Восток",
};

const CLIMATE_LABELS: Record<Climate, string> = {
  all: "Любой",
  tropical: "Тропики (+27 и выше)",
  temperate: "Умеренный (+10…+15)",
  cool: "Прохладный (ниже +10)",
};

const BUDGET_LABELS: Record<Budget, string> = {
  all: "Любой",
  "30000": "до 30 000 ₽",
  "50000": "до 50 000 ₽",
  "80000": "до 80 000 ₽",
  "120000": "до 120 000 ₽",
};

export function SearchClient({ cities }: { cities: CityWithMinRent[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region>("all");
  const [climate, setClimate] = useState<Climate>("all");
  const [budget, setBudget] = useState<Budget>("all");
  const [visaFree, setVisaFree] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const max = budget === "all" ? Infinity : parseInt(budget, 10);
    return cities.filter((c) => {
      if (
        q &&
        !c.name_ru.toLowerCase().includes(q) &&
        !c.country_ru.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (region !== "all" && REGION_BY_SLUG[c.slug] !== region) return false;
      if (climate !== "all" && CLIMATE_BY_SLUG[c.slug] !== climate) return false;
      if (c.min_rent > 0 && c.min_rent > max) return false;
      if (visaFree && !VISA_FREE_FOR_RU.has(c.slug)) return false;
      return true;
    });
  }, [cities, query, region, climate, budget, visaFree]);

  const activeFilters =
    (region !== "all" ? 1 : 0) +
    (climate !== "all" ? 1 : 0) +
    (budget !== "all" ? 1 : 0) +
    (visaFree ? 1 : 0);

  function reset() {
    setQuery("");
    setRegion("all");
    setClimate("all");
    setBudget("all");
    setVisaFree(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Город или страна"
        className="w-full px-6 py-4 rounded-pill bg-kombu-green/60 backdrop-blur text-cream placeholder-brandy/50 text-lg border border-dingley/40 focus:border-pale-copper focus:outline-none transition mb-6"
        aria-label="Поиск города или страны"
      />

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <FilterSelect
          label="Регион"
          value={region}
          onChange={(v) => setRegion(v as Region)}
          options={REGION_LABELS}
        />
        <FilterSelect
          label="Климат"
          value={climate}
          onChange={(v) => setClimate(v as Climate)}
          options={CLIMATE_LABELS}
        />
        <FilterSelect
          label="Бюджет на аренду"
          value={budget}
          onChange={(v) => setBudget(v as Budget)}
          options={BUDGET_LABELS}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-pill border border-dingley/40 text-brandy/90 cursor-pointer hover:border-pale-copper transition">
          <input
            type="checkbox"
            checked={visaFree}
            onChange={(e) => setVisaFree(e.target.checked)}
            className="accent-pale-copper"
          />
          <span>Без визы для россиян</span>
        </label>

        <div className="flex items-center gap-3">
          <span className="text-brandy/60 text-sm">
            {filtered.length} {plural(filtered.length, "город", "города", "городов")}
          </span>
          {(activeFilters > 0 || query) && (
            <button
              type="button"
              onClick={reset}
              className="text-pale-copper text-sm hover:underline"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-brandy/70 text-center py-16">
          Под такие условия ничего не нашли. Попробуй ослабить фильтры.
        </p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <CityCard key={c.id} city={c} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Record<string, string>;
}) {
  return (
    <label className="block">
      <span className="block text-brandy/60 text-xs uppercase tracking-wider mb-2">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-kombu-green/60 border border-dingley/40 text-cream focus:border-pale-copper focus:outline-none"
      >
        {Object.entries(options).map(([v, lbl]) => (
          <option key={v} value={v} className="bg-pine-tree">
            {lbl}
          </option>
        ))}
      </select>
    </label>
  );
}

function plural(n: number, one: string, two: string, many: string): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return two;
  return many;
}
