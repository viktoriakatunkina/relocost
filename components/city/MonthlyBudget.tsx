"use client";

import { useEffect, useRef, useState } from "react";
import type { Price, PriceCategory } from "@/lib/types";
import { budgetBreakdown } from "@/lib/budget-breakdown";
import { formatRub } from "@/lib/cities";
import { CountUp } from "@/components/CountUp";
import { typo } from "@/lib/typography";

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
}: {
  prices: Record<PriceCategory, Price[]>;
  cityName: string;
}) {
  const data = budgetBreakdown(prices);
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

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
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Бюджет от</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Сколько нужно на месяц
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-2xl text-pretty">
        {typo(
          `Самый экономичный сценарий жизни в ${cityName} на одного человека: аренда на окраине, продукты, проездной и коммуналка с интернетом и связью. Без кафе, такси и развлечений — это считает калькулятор ниже.`,
        )}
      </p>

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
            Бюджет «от» в месяц
          </p>
          <p className="font-serif text-4xl md:text-6xl text-cream tabular-nums leading-none">
            <CountUp value={total} format={(n) => formatRub(Math.round(n))} />
          </p>

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

          {/* строки категорий с растущими барами и долей */}
          <ul className="mt-8 space-y-5">
            {slices.map((s, i) => (
              <li key={s.key} className="grid grid-cols-12 items-center gap-3">
                <span className="col-span-12 sm:col-span-4 flex items-center gap-2.5 text-cream/90">
                  <span aria-hidden className="text-lg leading-none">
                    {s.icon}
                  </span>
                  {s.label}
                </span>
                <div className="col-span-8 sm:col-span-6">
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
                <span className="col-span-4 sm:col-span-2 text-right tabular-nums">
                  <span className="text-cream font-semibold block leading-tight">
                    {formatRub(s.amount)}
                  </span>
                  <span className="text-brandy/45 text-xs">
                    {Math.round(s.pct * 100)}%
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 pt-6 border-t hairline text-brandy/65 text-sm text-pretty">
            {typo(
              "Цифры ориентировочные, по курсу начала 2026 года — реальный минимум на старте. Точный бюджет с медициной, кафе и развлечениями — в калькуляторе ниже.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
