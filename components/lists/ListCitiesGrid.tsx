"use client";

import { useMemo, useState } from "react";
import { CityCard } from "@/components/CityCard";
import { getVisa } from "@/lib/visa";
import type { CityWithBudget } from "@/lib/types";

// 2026-09-29: страницы подборок (/list/[slug]) рендерили ВСЕ города одной
// длинной сеткой без пагинации — на подборках с 25-30 городами страница
// становилась очень длинной ("долго листается"). Плюс не было способа
// сузить список самому (по цене/визе/названию). Всё — на клиенте: данные
// уже загружены сервером целиком (максимум ~30 городов на подборку), гонять
// их через API ради фильтра избыточно.

const PAGE_SIZE = 12;

type VisaFilter = "all" | "visa_free" | "visa_required";

export function ListCitiesGrid({ cities }: { cities: CityWithBudget[] }) {
  const [search, setSearch] = useState("");
  const [priceMax, setPriceMax] = useState<number | "">("");
  const [visaFilter, setVisaFilter] = useState<VisaFilter>("all");
  const [page, setPage] = useState(1);

  const priceBounds = useMemo(() => {
    const values = cities.map((c) => c.monthly_from).filter((v) => v > 0);
    if (!values.length) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [cities]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cities.filter((c) => {
      if (q && !`${c.name_ru} ${c.country_ru}`.toLowerCase().includes(q)) return false;
      if (priceMax !== "" && c.monthly_from > 0 && c.monthly_from > priceMax) return false;
      if (visaFilter !== "all" && getVisa(c).status !== visaFilter) return false;
      return true;
    });
  }, [cities, search, priceMax, visaFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetToFirstPage = () => setPage(1);

  const hasActiveFilters = search !== "" || priceMax !== "" || visaFilter !== "all";

  return (
    <div>
      {/* Фильтры */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetToFirstPage();
          }}
          placeholder="Город или страна…"
          className="w-full sm:w-56 px-4 py-2.5 rounded-pill bg-surface border hairline text-cream text-sm placeholder:text-brandy/75 focus:outline-none focus:border-copper/50 transition"
        />

        {priceBounds && (
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-pill bg-surface border hairline text-sm text-brandy/85">
            <span className="whitespace-nowrap">До, ₽</span>
            <input
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              step={5000}
              value={priceMax}
              onChange={(e) => {
                const v = e.target.value;
                setPriceMax(v === "" ? "" : Number(v));
                resetToFirstPage();
              }}
              placeholder={String(priceBounds.max)}
              className="w-24 bg-transparent text-cream focus:outline-none tabular-nums"
            />
          </label>
        )}

        <div className="flex items-center gap-1.5 p-1 rounded-pill bg-surface border hairline">
          {(
            [
              { key: "all", label: "Виза: все" },
              { key: "visa_free", label: "Без визы" },
              { key: "visa_required", label: "Нужна виза" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                setVisaFilter(opt.key);
                resetToFirstPage();
              }}
              className={`px-3 py-1.5 rounded-pill text-xs font-medium transition whitespace-nowrap ${
                visaFilter === opt.key
                  ? "bg-copper text-pine-tree"
                  : "text-brandy/75 hover:text-cream"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPriceMax("");
              setVisaFilter("all");
              resetToFirstPage();
            }}
            className="text-brandy/60 hover:text-copper text-xs underline underline-offset-2 transition"
          >
            Сбросить
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-brandy/70">Ничего не нашлось под такие условия — попробуйте ослабить фильтры.</p>
      ) : (
        <>
          <p className="text-brandy/50 text-xs mb-4">
            {filtered.length} {pluralCities(filtered.length)}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((c, i) => (
              <CityCard key={c.id} city={c} index={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-4 py-2 rounded-pill border hairline text-sm text-brandy/85 hover:text-cream hover:border-copper/40 transition disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Назад
              </button>
              <span className="text-brandy/60 text-sm tabular-nums px-2">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-4 py-2 rounded-pill border hairline text-sm text-brandy/85 hover:text-cream hover:border-copper/40 transition disabled:opacity-30 disabled:pointer-events-none"
              >
                Вперед →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function pluralCities(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "город";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "города";
  return "городов";
}
