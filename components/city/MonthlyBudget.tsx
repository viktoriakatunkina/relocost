"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Price, PriceCategory } from "@/lib/types";
import { applyHousehold, budgetBreakdown } from "@/lib/budget-breakdown";
import { formatRub } from "@/lib/cities";
import { CountUp } from "@/components/CountUp";
import { typo } from "@/lib/typography";
import {
  HOUSEHOLD_PRESETS,
  type HouseholdPresetKey,
} from "@/lib/household";
import { isUnlocked, useUnlocked } from "@/lib/unlocked";
import { PaymentModal } from "@/components/freemium/PaymentModal";

// Цвета сегментов бюджета — в теплой палитре сайта, но различимые между собой.
const SLICE_COLOR: Record<string, string> = {
  rent: "bg-copper",
  food: "bg-emerald-400",
  transport: "bg-amber-400",
  utilities: "bg-dingley",
};

// Визуальный блок «Сколько нужно на месяц»: бесплатная выжимка экономичного
// бюджета (в отличие от freemium-калькулятора) с анимированной суммой и
// растущими долевыми барами. Считается из тех же цен, что уже на странице.
export function MonthlyBudget({
  prices,
  cityName,
  slug,
}: {
  prices: Record<PriceCategory, Price[]>;
  cityName: string;
  slug: string;
}) {
  const unlocked = useUnlocked(slug);
  const budgetUnlocked = isUnlocked(unlocked, "budget");
  const [openModal, setOpenModal] = useState(false);

  const base = budgetBreakdown(prices);
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  // Выбранный состав домохозяйства (по умолчанию — 1 человек, как раньше).
  const [preset, setPreset] = useState<HouseholdPresetKey>("solo");

  // Пересчет бюджета под состав — поверх уже посчитанного «на одного».
  const activePreset =
    HOUSEHOLD_PRESETS.find((p) => p.key === preset) ?? HOUSEHOLD_PRESETS[0];
  const data = useMemo(
    () => (base ? applyHousehold(base, activePreset.household) : null),
    [base, activePreset.household],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!data) return null;
  const { total, slices } = data;

  return (
  <>
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20 overflow-x-hidden">
      <span className="eyebrow">Бюджет от</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Сколько нужно на месяц
      </h2>
      <p className="text-brandy/80 text-lg mb-8 max-w-2xl text-pretty">
        {typo(
          `Самый экономичный сценарий жизни в ${cityName}: аренда на окраине, продукты, проездной и коммуналка с интернетом и связью. Без кафе, такси и развлечений — это считает калькулятор ниже. Выберите состав — цифры пересчитаются.`,
        )}
      </p>

      {/* Сегмент-переключатель состава: 1 человек · Пара · Семья с ребенком */}
      <div
        role="tablist"
        aria-label="Состав домохозяйства"
        className="inline-flex flex-wrap gap-1.5 rounded-pill bg-cream/5 border hairline p-1.5 mb-10"
      >
        {HOUSEHOLD_PRESETS.map((p) => {
          const active = p.key === preset;
          return (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setPreset(p.key)}
              className={`px-4 py-2 rounded-pill text-sm font-medium transition min-h-[44px] sm:min-h-0 ${
                active
                  ? "bg-copper text-pine-tree shadow-card"
                  : "text-brandy hover:text-cream"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div
        ref={ref}
        className="relative rounded-3xl bg-surface border hairline p-6 md:p-9 overflow-hidden"
      >
        {/* мягкое теплое свечение в углу */}
        <div
          className="orb w-72 h-72 -top-24 -right-16 opacity-50"
          style={{ background: "rgba(232,155,110,0.20)" }}
          aria-hidden
        />

        <div className="relative">
          <p className="text-copper text-xs uppercase tracking-[0.18em] mb-2 font-medium">
            Бюджет «от» в месяц · {activePreset.label}
          </p>
          <div className="relative inline-block">
            <p
              className="font-serif text-4xl md:text-6xl text-cream tabular-nums leading-none"
              style={!budgetUnlocked ? { filter: "blur(8px)", userSelect: "none" } : undefined}
              aria-hidden={!budgetUnlocked}
            >
              <CountUp
                key={preset}
                value={total}
                format={(n) => formatRub(Math.round(n))}
              />
            </p>
            {!budgetUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className="px-4 py-2 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition whitespace-nowrap shadow-card"
                >
                  Открыть за 49 ₽
                </button>
              </div>
            )}
          </div>

          {/* единый долевой бар — сегменты «вырастают» по ширине при появлении */}
          <div className="mt-7 flex h-3.5 w-full overflow-hidden rounded-pill bg-cream/5">
            {slices.map((s, i) => (
              <div
                key={s.key}
                className={`h-full ${SLICE_COLOR[s.key]} ${
                  i > 0 ? "border-l-2 border-surface" : ""
                } transition-[width] duration-[900ms] ease-out`}
                style={{
                  width: inView ? `${(s.pct * 100).toFixed(1)}%` : "0%",
                  transitionDelay: `${i * 120}ms`,
                }}
                aria-hidden
              />
            ))}
          </div>

          {/* строки категорий: первые 2 — бесплатно, остальные — paywall */}
          {(() => {
            const FREE_ROWS = 2;
            const freeSlices = slices.slice(0, FREE_ROWS);
            const lockedSlices = slices.slice(FREE_ROWS);

            const renderSlice = (s: typeof slices[0], i: number) => (
              <li key={s.key} className="flex flex-col gap-1 sm:grid sm:grid-cols-12 sm:items-center sm:gap-3">
                <span className="flex items-center gap-2.5 sm:col-span-4 text-cream/90">
                  <span aria-hidden className="text-lg leading-none">
                    {s.icon}
                  </span>
                  {s.label}
                </span>
                <div className="flex items-center gap-2 sm:contents">
                  <div className="flex-1 sm:col-span-6">
                    <div className="h-2.5 w-full rounded-full bg-cream/8 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${SLICE_COLOR[s.key]} transition-[width] duration-[1000ms] ease-out`}
                        style={{
                          width: inView ? `${(s.pct * 100).toFixed(1)}%` : "0%",
                          transitionDelay: `${i * 120 + 150}ms`,
                        }}
                        aria-hidden
                      />
                    </div>
                  </div>
                  <span className="shrink-0 sm:col-span-2 text-right tabular-nums">
                    <span className="text-cream font-semibold block leading-tight">
                      {formatRub(s.amount)}
                    </span>
                    <span className="text-brandy/45 text-xs">
                      {Math.round(s.pct * 100)}%
                    </span>
                  </span>
                </div>
              </li>
            );

            return (
              <ul className="mt-8 space-y-5">
                {freeSlices.map((s, i) => renderSlice(s, i))}
                {lockedSlices.length > 0 && (
                  budgetUnlocked ? (
                    lockedSlices.map((s, i) => renderSlice(s, FREE_ROWS + i))
                  ) : (
                    <li className="relative">
                      {/* размытые строки под оверлеем */}
                      <ul
                        aria-hidden
                        className="space-y-5 pointer-events-none select-none"
                        style={{ filter: "blur(5px)" }}
                      >
                        {lockedSlices.map((s, i) => renderSlice(s, FREE_ROWS + i))}
                      </ul>
                      {/* paywall-оверлей */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-surface-elevated/95 backdrop-blur-md border border-copper/30 rounded-2xl px-5 py-4 text-center shadow-xl">
                          <p className="text-cream font-serif text-lg mb-1">📊 Детальная разбивка</p>
                          <p className="text-brandy/75 text-sm mb-3 leading-snug">
                            Расходы по всем категориям — в пакете «Точный бюджет»
                          </p>
                          <button
                            type="button"
                            onClick={() => setOpenModal(true)}
                            className="inline-block px-5 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
                          >
                            Открыть за 49 ₽
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                )}
              </ul>
            );
          })()}

          <p className="mt-8 pt-6 border-t hairline text-brandy/65 text-sm text-pretty">
            {typo(
              `Оценка для состава «${activePreset.label.toLowerCase()}»: цифры ориентировочные, по курсу начала 2026 года — реальный минимум на старте. Для семьи учтена квартира побольше, продукты и транспорт на ребенка; детский сад и школа не входят. Точный бюджет с медициной, кафе и развлечениями — в калькуляторе ниже.`,
            )}
          </p>
        </div>
      </div>
    </section>

    <PaymentModal
      slug={slug}
      pkg={openModal ? "budget" : null}
      onClose={() => setOpenModal(false)}
    />
  </>
  );
}
