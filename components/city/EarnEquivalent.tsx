"use client";

import { useState } from "react";
import { formatRub } from "@/lib/cities";
import { typo } from "@/lib/typography";

// «Сколько нужно зарабатывать» — фишка Numbeo/NerdWallet: эквивалент бюджета
// между Москвой и этим городом. avgDiff (средняя относит. разница цен к Москве)
// уже посчитан на сервере в moscowComparison — здесь только пересчёт и UI.
// Бесплатный блок: вовлекает и бьёт в long-tail «сколько нужно на жизнь в X».

const MIN = 30_000;
const MAX = 400_000;
const STEP = 5_000;
const DEFAULT = 100_000;

export function EarnEquivalent({
  cityName,
  avgDiff,
}: {
  cityName: string;
  avgDiff: number;
}) {
  const [budget, setBudget] = useState(DEFAULT);
  const equivalent = Math.max(0, Math.round((budget * (1 + avgDiff)) / 1000) * 1000);
  const pct = Math.round(Math.abs(avgDiff) * 100);
  const cheaper = avgDiff < 0;
  const verdict =
    pct === 0
      ? "примерно столько же"
      : cheaper
        ? `на ${pct}% меньше`
        : `на ${pct}% больше`;

  return (
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Сколько нужно на жизнь</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Сколько денег нужно в {cityName}
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-2xl text-pretty">
        {typo(
          `Сдвиньте ползунок на привычный для Вас бюджет в Москве — и увидите, сколько примерно нужно на такой же образ жизни в ${cityName}.`,
        )}
      </p>

      <div className="rounded-3xl bg-surface border hairline p-6 md:p-9">
        <label className="block">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <span className="text-cream/90">Ваш бюджет в Москве</span>
            <span className="text-cream font-semibold tabular-nums">
              {formatRub(budget)}
              <span className="text-brandy/55 font-normal text-sm"> /мес</span>
            </span>
          </div>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-copper cursor-pointer"
            aria-label="Ваш бюджет в Москве, рублей в месяц"
          />
        </label>

        <div className="mt-8 pt-7 border-t hairline text-center">
          <div className="text-brandy/65 text-sm mb-2">
            В городе {cityName} на тот же уровень жизни нужно примерно
          </div>
          <div className="font-serif text-4xl md:text-6xl text-copper tabular-nums leading-none">
            {formatRub(equivalent)}
          </div>
          <div className="text-brandy/70 mt-3">
            это {verdict}, чем в Москве
          </div>
        </div>

        <p className="mt-7 pt-6 border-t hairline text-xs text-brandy/55 text-pretty">
          {typo(
            "Оценка по средней разнице повседневных трат (аренда, продукты, кафе, транспорт) относительно Москвы — на курс начала 2026 года. Не учитывает личный образ жизни, налоги и крупные покупки. Точный бюджет под Ваш стиль — в калькуляторе выше.",
          )}
        </p>
      </div>
    </section>
  );
}
