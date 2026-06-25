"use client";

import { useEffect, useRef, useState } from "react";
import type { MoscowComparison } from "@/lib/moscow-baseline";
import { formatRub } from "@/lib/cities";
import { typo } from "@/lib/typography";

// Насколько шкала бара заполняется при |разнице| = 100%. Дальше — обрезаем,
// иначе экстремальные позиции (аренда в 4 раза дешевле) ломают верстку.
const FULL_AT = 0.7;

function pctLabel(diff: number): string {
  const v = Math.round(Math.abs(diff) * 100);
  if (v === 0) return "так же, как в Москве";
  return `${v}% ${diff < 0 ? "дешевле" : "дороже"}`;
}

// Блок «Дешевле Москвы»: сравнение повседневных цен города с Москвой
// расходящимися барами от центральной оси. Бьет в интент «насколько X дешевле
// Москвы». Данные считаются на сервере, здесь — только визуализация и анимация.
export function CostVsMoscow({
  cityName,
  comparison,
}: {
  cityName: string;
  comparison: MoscowComparison;
}) {
  const { rows, avgDiff } = comparison;
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
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const avgPct = Math.round(Math.abs(avgDiff) * 100);
  const cheaper = avgDiff < 0;
  const headline = cheaper
    ? `В среднем на ${avgPct}% дешевле Москвы`
    : avgPct === 0
      ? "Примерно как в Москве"
      : `В среднем на ${avgPct}% дороже Москвы`;

  return (
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Сравнение с Москвой</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        {cityName} против Москвы
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-2xl text-pretty">
        {typo(
          `Те же повседневные траты — аренда, продукты, кафе и транспорт — рядом с московскими ценами. ${headline}.`,
        )}
      </p>

      <div
        ref={ref}
        className="rounded-3xl bg-surface border hairline p-6 md:p-9"
      >
        <ul className="space-y-7">
          {rows.map((r, i) => {
            const cheaperRow = r.diff < 0;
            const fill = Math.min(1, Math.abs(r.diff) / FULL_AT);
            const width = inView ? `${(fill * 100).toFixed(1)}%` : "0%";
            return (
              <li key={r.key}>
                <div className="flex items-baseline justify-between gap-3 mb-2.5">
                  <span className="text-cream/90">{r.label}</span>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      cheaperRow ? "text-emerald-300" : "text-copper"
                    }`}
                  >
                    {pctLabel(r.diff)}
                  </span>
                </div>

                {/* ось по центру: дешевле — влево (emerald), дороже — вправо (copper) */}
                <div className="relative h-3 rounded-full bg-cream/8">
                  <div
                    className="absolute top-[-3px] bottom-[-3px] left-1/2 w-px bg-cream/25"
                    aria-hidden
                  />
                  <div
                    className={`absolute top-0 h-full ${
                      cheaperRow
                        ? "right-1/2 rounded-l-full bg-emerald-400"
                        : "left-1/2 rounded-r-full bg-copper"
                    } transition-[width] duration-[1000ms] ease-out`}
                    style={{ width, transitionDelay: `${i * 110}ms` }}
                    aria-hidden
                  />
                </div>

                <div className="flex justify-between mt-2 text-xs tabular-nums text-brandy/55">
                  <span>
                    {cityName}: <span className="text-cream/80">{formatRub(r.city)}</span>
                  </span>
                  <span>Москва: {formatRub(r.moscow)}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-5 mt-8 pt-6 border-t hairline text-xs text-brandy/55">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" aria-hidden />
            дешевле
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-copper" aria-hidden />
            дороже
          </span>
          <span className="ml-auto text-right text-pretty">
            Москва — точка отсчета, цены начала 2026 года
          </span>
        </div>
      </div>
    </section>
  );
}
