"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { CityWithBudget } from "@/lib/types";
import { climateTemp, isCoastal } from "@/lib/city-signals";
import { getVisa } from "@/lib/visa";
import { formatRub } from "@/lib/cities";
import { getCityQuality } from "@/lib/city-quality";
import { ShareButton } from "@/components/ShareButton";

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

// ВАЖНО: раньше эта функция считала «Безопасность» из difficulty_score
// (сложность переезда — виза/язык/адаптация), что было мисклассификацией —
// тот же показатель, что двигает ось «Простота переезда» в /rating, просто
// под другим названием. Реальные данные по безопасности (инверсия индекса
// преступности) есть в lib/city-quality.ts — используем их.
function scoreSafety(city: CityWithBudget): number {
  const q = getCityQuality(city.slug);
  if (!q) return 55;
  return Math.round(((q.safety - 1) / 4) * 100);
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
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={[
            "px-2.5 py-1.5 text-[11px] transition border-r border-cream/10 last:border-r-0",
            value === v
              ? v === 0
                ? "bg-brandy/25 text-pine-tree font-semibold"
                : v === 1
                ? "bg-copper/25 text-copper font-semibold"
                : "bg-copper text-pine-tree font-semibold"
              : "bg-transparent text-brandy/75 hover:text-cream hover:bg-cream/5",
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
  compareSelected,
  onToggleCompare,
  shared,
}: {
  rank: number;
  city: CityWithBudget;
  score: number;
  /** Отмечен ли этот город для сравнения (см. compareSelection в
   *  MatchClient) — до 2 городов, ведет на /compare/[a]-vs-[b] с готовым
   *  бандл-предложением там (не встраиваем логику сравнения сюда). */
  compareSelected: boolean;
  onToggleCompare: () => void;
  /** Город есть в ?r= из пересланной ссылки — подсвечиваем и к нему же
   *  скроллим при открытии (см. MatchClient). */
  shared?: boolean;
}) {
  const temp = climateTemp(city);
  const tags: string[] = [];
  if (temp !== null && temp >= 18) tags.push("☀️ Тепло");
  if (isCoastal(city.slug)) tags.push("🌊 Море");
  if (getVisa(city).status === "visa_free") tags.push("✈️ Без визы");
  if ((getCityQuality(city.slug)?.safety ?? 0) >= 4) tags.push("🛡️ Безопасно");
  if (FAST_INTERNET.has(city.slug)) tags.push("⚡ Интернет");
  if (shared) tags.push("🔗 Из ссылки");

  return (
    <div
      id={`match-${city.slug}`}
      className={[
        "group relative flex items-start gap-3 bg-surface border rounded-2xl p-4 transition-colors",
        shared
          ? "border-copper ring-2 ring-copper/40"
          : compareSelected
          ? "border-copper/60"
          : "hairline hover:border-copper/35",
      ].join(" ")}
    >
      <Link href={`/city/${city.slug}`} className="absolute inset-0 rounded-2xl" aria-label={city.name_ru} />
      <span className="relative w-6 text-center text-brandy/75 text-sm font-mono shrink-0 mt-0.5">
        {rank}
      </span>
      <div className="relative flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="text-cream font-medium text-sm leading-snug truncate group-hover:text-copper transition-colors">
              {city.flag_emoji && <span className="mr-1">{city.flag_emoji}</span>}
              {city.name_ru}
            </p>
            <p className="text-brandy/75 text-xs mt-0.5 truncate">
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
        <div className="flex items-center justify-between gap-3 mt-2">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {tags.map(t => (
                <span key={t} className="text-[10px] text-brandy/75">{t}</span>
              ))}
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleCompare();
            }}
            className={[
              "relative z-10 shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border transition",
              compareSelected
                ? "bg-copper text-pine-tree border-copper"
                : "border-cream/15 text-brandy/50 hover:text-cream hover:border-cream/30",
            ].join(" ")}
          >
            {compareSelected ? "✓ В сравнении" : "+ Сравнить"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Главный компонент ---

export function MatchClient({ cities }: { cities: CityWithBudget[] }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  // До 2 городов для сравнения — простой выбор прямо в результатах (не
  // отдельная страница/логика): ведет на /compare/[a]-vs-[b], где уже готово
  // предложение купить бюджет по обоим сразу дешевле (CompareBundleCTA).
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  // ── Шерабельный результат ──────────────────────────────────────────────
  // Топ-2 совпадения кодируем в ?r=slug,slug (router.replace без релоада),
  // чтобы подборку можно было переслать. Если страница открыта по такой
  // ссылке — подсвечиваем эти города в списке и скроллим к первому
  // (упрощённо: веса/приоритеты не восстанавливаем). Скоринг (computeMatch
  // выше) не трогаем.
  //
  // Читаем query-параметр вручную через window.location (не useSearchParams)
  // и только внутри useEffect — чтобы не требовать Suspense-границу и не
  // ломать статическую генерацию страницы (первый рендер у всех посетителей
  // остаётся прежним).
  const router = useRouter();
  const pathname = usePathname();
  const [sharedSlugs, setSharedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("r");
    if (!raw) return;
    const slugs = new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
    if (slugs.size === 0) return;
    setSharedSlugs(slugs);
    // Город уже в списке (рендерится до 15 позиций) — скроллим к первому совпавшему.
    const firstSlug = Array.from(slugs)[0];
    requestAnimationFrame(() => {
      document.getElementById(`match-${firstSlug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- читаем URL только при монтировании
  }, []);

  function set<K extends keyof Prefs>(key: K, val: Prefs[K]) {
    setPrefs(p => ({ ...p, [key]: val }));
  }

  function toggleCompare(slug: string) {
    setCompareSelection(sel => {
      if (sel.includes(slug)) return sel.filter(s => s !== slug);
      if (sel.length < 2) return [...sel, slug];
      // Уже выбраны 2 — новый выбор вытесняет самый старый (FIFO), чтобы не
      // заставлять сначала явно снимать выбор.
      return [sel[1], slug];
    });
  }

  const ranked = useMemo(() => {
    return [...cities]
      .map(c => ({ city: c, score: computeMatch(c, prefs) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
  }, [cities, prefs]);

  const budgetFormatted = new Intl.NumberFormat("ru-RU").format(prefs.maxBudget);
  const compareCities = compareSelection
    .map(slug => cities.find(c => c.slug === slug))
    .filter((c): c is CityWithBudget => Boolean(c));

  // Пишем топ-2 совпадения в URL — с debounce, чтобы не дёргать replace на
  // каждое мгновенное изменение слайдера, только когда веса устоялись.
  useEffect(() => {
    if (ranked.length === 0) return;
    const next = ranked.slice(0, 2).map(r => r.city.slug).join(",");
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("r") === next) return;
      params.set("r", next);
      router.replace({ pathname, query: Object.fromEntries(params.entries()) }, { scroll: false });
    }, 500);
    return () => clearTimeout(timer);
  }, [ranked, pathname, router]);

  const topMatch = ranked[0];
  const shareText = topMatch
    ? `Мне подобрали ${topMatch.city.name_ru} с совпадением ${topMatch.score}%, попробуй и ты`
    : "Подбери свой идеальный город для переезда — тест на Relocost";

  return (
    <div className="max-w-6xl mx-auto px-6 pb-12">
      <div className="grid md:grid-cols-[360px_1fr] gap-8 md:gap-12 items-start">

        {/* Панель приоритетов */}
        <div className="md:sticky md:top-6">
          <div className="bg-surface border hairline rounded-3xl p-6 md:p-7">
            <h2 className="font-serif text-2xl text-cream mb-2">Что важно</h2>
            <p className="text-brandy/50 text-xs mb-6 leading-relaxed">
              нет — критерий не учитывается при подборе · важно — учитывается
              при расчете совпадения · очень — учитывается с двойным весом,
              сильнее влияет на итоговый %
            </p>

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
              <div className="flex items-center gap-2 mb-2">
                <span className="text-brandy/50 text-xs shrink-0">до</span>
                <input
                  type="number"
                  min={30000}
                  max={300000}
                  step={5000}
                  value={prefs.maxBudget}
                  disabled={prefs.budgetWeight === 0}
                  onChange={e => {
                    const raw = Number(e.target.value);
                    if (Number.isNaN(raw)) return;
                    const clamped = Math.min(300000, Math.max(30000, raw));
                    set("maxBudget", clamped);
                  }}
                  className="w-28 px-2.5 py-1 rounded-lg bg-pine-tree/60 border border-cream/15 text-cream text-sm font-medium tabular-nums focus:border-copper focus:outline-none disabled:opacity-40"
                />
                <span className="text-brandy/50 text-xs">₽ / мес</span>
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
              <div className="flex justify-between text-[11px] text-brandy/75">
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
                        aria-pressed={prefs.climatePref === p}
                        onClick={() => set("climatePref", p)}
                        className={[
                          "px-3 py-1.5 rounded-full text-xs border transition",
                          prefs.climatePref === p
                            ? "border-copper bg-copper text-pine-tree font-semibold"
                            : "border-cream/10 bg-transparent text-brandy/75 hover:border-cream/25 hover:text-cream/70",
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

            <p className="text-brandy/75 text-[11px] mt-6 leading-relaxed">
              Оценка рассчитывается по реальным ценам и публичным данным. Кликните на город — откроется полная карточка.
            </p>
          </div>
        </div>

        {/* Результаты */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5 gap-3">
            <h2 className="font-serif text-2xl text-cream">Топ совпадений</h2>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-brandy/75 text-sm">{cities.length} городов</span>
              <ShareButton
                title="Подбор города для переезда — Relocost"
                text={shareText}
                variant="ghost"
              />
            </div>
          </div>
          <p className="text-brandy/75 text-xs mb-5">
            Топ-15 из {cities.length} направлений. Меняйте приоритеты — список обновляется мгновенно.
            Отметьте до двух городов «+ Сравнить», чтобы посмотреть разницу и
            открыть бюджет по обоим дешевле.
          </p>

          <div className="flex flex-col gap-2.5 pb-16">
            {ranked.map(({ city, score }, i) => (
              <MatchRow
                key={city.slug}
                rank={i + 1}
                city={city}
                score={score}
                compareSelected={compareSelection.includes(city.slug)}
                onToggleCompare={() => toggleCompare(city.slug)}
                shared={sharedSlugs.has(city.slug)}
              />
            ))}
          </div>
        </div>
      </div>

      {compareCities.length === 2 && (
        <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
          <div className="max-w-lg mx-auto rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-copper/30 shadow-2xl px-4 py-3 flex items-center gap-3">
            <p className="flex-1 min-w-0 text-cream text-sm truncate">
              <span aria-hidden>⚖️</span>{" "}
              {compareCities[0].name_ru} и {compareCities[1].name_ru}
            </p>
            <button
              type="button"
              onClick={() => setCompareSelection([])}
              className="shrink-0 text-brandy/50 hover:text-cream text-xs underline underline-offset-2 transition"
            >
              Сбросить
            </button>
            <Link
              href={`/compare/${compareCities[0].slug}-vs-${compareCities[1].slug}`}
              className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
            >
              Сравнить
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
