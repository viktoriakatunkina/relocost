"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { CityWithBudget } from "@/lib/types";
import { climateTemp, isCoastal } from "@/lib/city-signals";
import { getVisa } from "@/lib/visa";
import { formatRub } from "@/lib/cities";

// Города с быстрым интернетом (аналог SearchClient — выделено в одном месте).
const FAST_INTERNET = new Set([
  "tbilisi", "yerevan", "almaty", "istanbul", "belgrade", "budapest",
  "lisbon", "porto", "riga", "tallinn", "vilnius", "warsaw", "prague",
  "bali", "chiang-mai", "kuala-lumpur", "bangkok", "singapore", "seoul",
  "dubai", "abu-dhabi", "astana", "tashkent", "ho-chi-minh", "hanoi",
  "cebu", "penang", "jakarta", "malaga", "alicante",
]);

type Weight = 0 | 1 | 2;
type ClimatePref = "warm" | "mild";

interface Prefs {
  maxBudget: number;
  budgetWeight: Weight;
  climateWeight: Weight;
  climatePref: ClimatePref;
  safetyWeight: Weight;
  visaWeight: Weight;
  seaWeight: Weight;
  internetWeight: Weight;
}

const DEFAULT_PREFS: Prefs = {
  maxBudget: 100000,
  budgetWeight: 2,
  climateWeight: 1,
  climatePref: "warm",
  safetyWeight: 1,
  visaWeight: 1,
  seaWeight: 0,
  internetWeight: 0,
};

// --- Функции оценки (0–100) ---

function scoreBudget(monthly_from: number, maxBudget: number): number {
  if (monthly_from <= 0) return 60;
  if (monthly_from <= maxBudget) return 100;
  // Линейно падает до 0 при 2× бюджета
  return Math.max(0, Math.round((2 * maxBudget - monthly_from) / maxBudget * 100));
}

function scoreClimate(city: CityWithBudget, pref: ClimatePref): number {
  const t = climateTemp(city);
  if (t === null) return 55;
  if (pref === "warm") {
    if (t >= 22) return 100;
    if (t >= 16) return 72;
    if (t >= 10) return 38;
    return 10;
  }
  // mild: 12–22°C оптимально
  if (t >= 12 && t <= 22) return 100;
  if (t >= 8 && t <= 27) return 68;
  return 28;
}

function scoreSafety(city: CityWithBudget): number {
  const d = city.difficulty_score;
  if (d === null) return 55;
  return Math.max(0, Math.round((10 - d) / 9 * 100));
}

function scoreVisa(city: CityWithBudget): number {
  return getVisa(city).status === "visa_free" ? 100 : 0;
}

function scoreSea(slug: string): number {
  return isCoastal(slug) ? 100 : 0;
}

function scoreInternet(slug: string): number {
  return FAST_INTERNET.has(slug) ? 100 : 0;
}

function computeMatch(city: CityWithBudget, p: Prefs): number {
  const dims = [
    { score: scoreBudget(city.monthly_from, p.maxBudget), w: p.budgetWeight },
    { score: scoreClimate(city, p.climatePref), w: p.climateWeight },
    { score: scoreSafety(city), w: p.safetyWeight },
    { score: scoreVisa(city), w: p.visaWeight },
    { score: scoreSea(city.slug), w: p.seaWeight },
    { score: scoreInternet(city.slug), w: p.internetWeight },
  ].filter(d => d.w > 0);
  if (dims.length === 0) return 65;
  const tw = dims.reduce((s, d) => s + d.w, 0);
  return Math.round(dims.reduce((s, d) => s + d.score * d.w, 0) / tw);
}

// --- Цвет по проценту ---

function barColor(pct: number): string {
  if (pct >= 80) return "bg-dingley";
  if (pct >= 65) return "bg-copper";
  if (pct >= 50) return "bg-pale-copper/70";
  return "bg-brandy/40";
}

function scoreColor(pct: number): string {
  if (pct >= 80) return "text-dingley";
  if (pct >= 65) return "text-copper";
  if (pct >= 50) return "text-pale-copper";
  return "text-brandy/55";
}

// --- Суб-компоненты ---

function WeightSegment({
  value,
  onChange,
}: {
  value: Weight;
  onChange: (v: Weight) => void;
}) {
  const opts: { v: Weight; label: string }[] = [
    { v: 0, label: "нет" },
    { v: 1, label: "важно" },
    { v: 2, label: "очень" },
  ];
  return (
    <div className="flex shrink-0 rounded-xl overflow-hidden border border-cream/10">
      {opts.map(({ v, label }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={[
            "px-2.5 py-1.5 text-[11px] transition border-r border-cream/10 last:border-r-0",
            value === v
              ? v === 0
                ? "bg-cream/8 text-brandy/60 font-medium"
                : v === 1
                ? "bg-copper/20 text-copper font-medium"
                : "bg-copper text-pine-tree font-semibold"
              : "bg-transparent text-brandy/30 hover:text-brandy/65 hover:bg-cream/5",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function DimRow({
  emoji,
  label,
  value,
  onChange,
  children,
}: {
  emoji: string;
  label: string;
  value: Weight;
  onChange: (v: Weight) => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm text-brandy/75 min-w-0">
          <span aria-hidden>{emoji}</span>
          <span>{label}</span>
        </span>
        <WeightSegment value={value} onChange={onChange} />
      </div>
      {children}
    </div>
  );
}

function MatchRow({
  rank,
  city,
  score,
}: {
  rank: number;
  city: CityWithBudget;
  score: number;
}) {
  const temp = climateTemp(city);
  const tags: string[] = [];
  if (temp !== null && temp >= 18) tags.push("☀️ Тепло");
  if (isCoastal(city.slug)) tags.push("🌊 Море");
  if (getVisa(city).status === "visa_free") tags.push("✈️ Без визы");
  if ((city.difficulty_score ?? 10) <= 4) tags.push("🛡️ Безопасно");
  if (FAST_INTERNET.has(city.slug)) tags.push("⚡ Интернет");

  return (
    <Link
      href={`/city/${city.slug}`}
      className="group flex items-start gap-3 bg-surface border hairline rounded-2xl p-4 hover:border-copper/35 transition-colors"
    >
      <span className="w-6 text-center text-brandy/30 text-sm font-mono shrink-0 mt-0.5">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="text-cream font-medium text-sm leading-snug truncate group-hover:text-copper transition-colors">
              {city.flag_emoji && <span className="mr-1">{city.flag_emoji}</span>}
              {city.name_ru}
            </p>
            <p className="text-brandy/45 text-xs mt-0.5 truncate">
              {city.country_ru}
              {city.monthly_from > 0 && ` · от ${formatRub(city.monthly_from)}/мес`}
            </p>
          </div>
          <p className={["text-xl font-bold tabular-nums leading-none shrink-0", scoreColor(score)].join(" ")}>
            {score}
            <span className="text-xs font-normal ml-px">%</span>
          </p>
        </div>
        <div className="h-1 rounded-full bg-cream/8 overflow-hidden">
          <div
            className={["h-full rounded-full transition-all duration-500", barColor(score)].join(" ")}
            style={{ width: `${score}%` }}
          />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {tags.map(t => (
              <span key={t} className="text-[10px] text-brandy/45">{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// --- Главный компонент ---

export function MatchClient({ cities }: { cities: CityWithBudget[] }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  function set<K extends keyof Prefs>(key: K, val: Prefs[K]) {
    setPrefs(p => ({ ...p, [key]: val }));
  }

  const ranked = useMemo(() => {
    return [...cities]
      .map(c => ({ city: c, score: computeMatch(c, prefs) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
  }, [cities, prefs]);

  const budgetFormatted = new Intl.NumberFormat("ru-RU").format(prefs.maxBudget);

  return (
    <div className="max-w-6xl mx-auto px-6 pb-12">
      <div className="grid md:grid-cols-[360px_1fr] gap-8 md:gap-12 items-start">

        {/* Панель приоритетов */}
        <div className="md:sticky md:top-6">
          <div className="bg-surface border hairline rounded-3xl p-6 md:p-7">
            <h2 className="font-serif text-2xl text-cream mb-6">Что важно</h2>

            {/* Бюджет */}
            <div className="mb-6 pb-6 border-b border-cream/8">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm text-brandy/75">
                  <span aria-hidden>💰</span>
                  <span>Бюджет в месяц</span>
                </span>
                <WeightSegment
                  value={prefs.budgetWeight}
                  onChange={v => set("budgetWeight", v)}
                />
              </div>
              <input
                type="range"
                min={30000}
                max={300000}
                step={5000}
                value={prefs.maxBudget}
                onChange={e => set("maxBudget", Number(e.target.value))}
                disabled={prefs.budgetWeight === 0}
                className="w-full accent-copper mb-1.5 disabled:opacity-40"
              />
              <div className="flex justify-between text-[11px] text-brandy/35">
                <span>30 000 ₽</span>
                <span className="text-cream text-xs font-medium">до {budgetFormatted} ₽</span>
                <span>300 000 ₽</span>
              </div>
            </div>

            {/* Остальные параметры */}
            <div className="flex flex-col gap-5">
              <DimRow
                emoji="☀️"
                label="Теплый климат"
                value={prefs.climateWeight}
                onChange={v => set("climateWeight", v)}
              >
                {prefs.climateWeight > 0 && (
                  <div className="flex gap-2 mt-2.5 ml-6">
                    {(["warm", "mild"] as ClimatePref[]).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => set("climatePref", p)}
                        className={[
                          "px-3 py-1.5 rounded-full text-xs border transition",
                          prefs.climatePref === p
                            ? "border-copper/50 bg-copper/12 text-cream"
                            : "border-cream/10 text-brandy/45 hover:border-cream/25 hover:text-cream/70",
                        ].join(" ")}
                      >
                        {p === "warm" ? "🌴 Тропики / жарко" : "🍃 Умеренно"}
                      </button>
                    ))}
                  </div>
                )}
              </DimRow>

              <DimRow emoji="🛡️" label="Безопасность" value={prefs.safetyWeight} onChange={v => set("safetyWeight", v)} />
              <DimRow emoji="✈️" label="Без визы" value={prefs.visaWeight} onChange={v => set("visaWeight", v)} />
              <DimRow emoji="🌊" label="У моря" value={prefs.seaWeight} onChange={v => set("seaWeight", v)} />
              <DimRow emoji="⚡" label="Быстрый интернет" value={prefs.internetWeight} onChange={v => set("internetWeight", v)} />
            </div>

            <p className="text-brandy/30 text-[11px] mt-6 leading-relaxed">
              Оценка рассчитывается по реальным ценам и публичным данным. Кликните на город — откроется полная карточка.
            </p>
          </div>
        </div>

        {/* Результаты */}
        <div>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-serif text-2xl text-cream">Топ совпадений</h2>
            <span className="text-brandy/40 text-sm">{cities.length} городов</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {ranked.map(({ city, score }, i) => (
              <MatchRow
                key={city.slug}
                rank={i + 1}
                city={city}
                score={score}
              />
            ))}
          </div>

          <p className="text-brandy/28 text-[11px] text-center mt-8">
            Топ-15 из {cities.length} направлений. Меняйте приоритеты — список обновляется мгновенно.
          </p>
        </div>
      </div>
    </div>
  );
}
