"use client";

import { useMemo, useState } from "react";
import { formatRub } from "@/lib/cities";
import { typo } from "@/lib/typography";
import { ShareButton } from "@/components/ShareButton";
import {
  HOUSEHOLD_PRESETS,
  householdMultipliers,
  type HouseholdPresetKey,
} from "@/lib/household";

// Калькулятор переезда A→B с составом семьи — best-practice SmartAsset/Livingcost.
// На вход — уже посчитанные на сервере денежные категории сравнения для A и B
// (lib/compare → CompareLine). Здесь только пересчет под состав домохозяйства
// и сборка хука «Чтобы в B жить как на N ₽ в A, нужно ~M ₽/мес».
//
// Множители те же, что у MonthlyBudget (lib/household) — единый движок состава.
// Жилье у семьи растет через множитель аренды (нужна квартира побольше); строки
// «детский сад/школа» НЕ добавляем — таких данных в БД нет.

export type RelocationCategory = "rent" | "food" | "transport" | "utilities";

export type RelocationBudget = Record<RelocationCategory, number>;

function scale(budget: RelocationBudget, key: HouseholdPresetKey): number {
  const preset =
    HOUSEHOLD_PRESETS.find((p) => p.key === key) ?? HOUSEHOLD_PRESETS[0];
  const m = householdMultipliers(preset.household);
  return Math.round(
    budget.rent * m.rent +
      budget.food * m.food +
      budget.transport * m.transport +
      budget.utilities * m.utilities,
  );
}

export function CompareRelocation({
  aName,
  bName,
  budgetA,
  budgetB,
}: {
  aName: string;
  bName: string;
  budgetA: RelocationBudget;
  budgetB: RelocationBudget;
}) {
  const [preset, setPreset] = useState<HouseholdPresetKey>("solo");

  const totalA = useMemo(() => scale(budgetA, preset), [budgetA, preset]);
  const totalB = useMemo(() => scale(budgetB, preset), [budgetB, preset]);

  // Если по A нет данных (0) — хук не строим, блок не имеет смысла.
  if (totalA <= 0 || totalB <= 0) return null;

  const cheaper = totalB < totalA;
  const pct =
    totalA > 0 ? Math.round((Math.abs(totalB - totalA) / totalA) * 100) : 0;
  const verdict =
    pct < 1
      ? "примерно столько же"
      : cheaper
        ? `на ${pct}% меньше`
        : `на ${pct}% больше`;

  // Хук в духе SmartAsset: «Чтобы в B жить как на N ₽ в A, нужно ~M ₽/мес».
  const hook = `Чтобы в городе ${bName} жить как на ${formatRub(totalA)} в ${aName}, нужно ~${formatRub(totalB)}/мес`;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Калькулятор переезда</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Переезд {aName} → {bName} под Ваш состав семьи
      </h2>
      <p className="text-brandy/80 text-lg mb-8 max-w-2xl text-pretty">
        {typo(
          `Выберите состав — базовые бюджеты обоих городов пересчитаются, и Вы увидите, сколько примерно нужно в ${bName} для того же уровня жизни, что в ${aName}.`,
        )}
      </p>

      {/* Сегмент-переключатель состава */}
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

      <div className="rounded-3xl bg-surface border hairline p-6 md:p-9">
        <div className="grid grid-cols-2 gap-6 md:gap-10">
          {[
            { name: aName, total: totalA },
            { name: bName, total: totalB },
          ].map((side, i) => (
            <div key={i} className={i === 1 ? "text-right" : ""}>
              <div className="text-brandy/65 text-sm mb-2">{side.name}</div>
              <div className="font-serif text-3xl md:text-5xl text-cream tabular-nums leading-none">
                {formatRub(side.total)}
              </div>
              <div className="text-brandy/55 text-xs mt-1">в месяц</div>
            </div>
          ))}
        </div>

        <p className="mt-8 pt-7 border-t hairline text-cream/90 text-base md:text-lg text-balance">
          {typo(hook)}
        </p>
        <p className="text-brandy/70 mt-2">
          это {verdict}, чем в {aName}
        </p>

        <div className="mt-5">
          <ShareButton title={hook} text={hook} variant="ghost" />
        </div>

        <p className="mt-7 pt-6 border-t hairline text-xs text-brandy/55 text-pretty">
          {typo(
            "Оценка по базовым расходам (аренда, продукты, транспорт, ЖКХ и связь) на курс начала 2026 года. Для семьи учтена квартира побольше, продукты и транспорт на ребенка; детский сад и школа в расчет не входят. Не учитывает личный образ жизни, налоги и крупные покупки.",
          )}
        </p>
      </div>
    </section>
  );
}
