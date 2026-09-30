"use client";

import { useState } from "react";
import type { Price, PriceCategory } from "@/lib/types";
import { formatRub } from "@/lib/cities";
import { calcStartupCosts } from "@/lib/relocation-costs";
import { CITY_PACKAGES, isUnlocked, useUnlocked } from "@/lib/unlocked";
import { PaymentModal } from "@/components/freemium/PaymentModal";
import { typo } from "@/lib/typography";

function pick(arr: Price[], match: (p: Price) => boolean): Price | undefined {
  return arr.find(match);
}

// Стартовые (разовые) расходы на переезд — перелёт, депозит+первый месяц
// аренды, виза, обустройство на месте. Дополняет MonthlyBudget/Calculator
// (регулярные расходы на месяц) той статьёй, которую человек платит один раз
// перед переездом. Часть пакета «budget» — тот же замок, что у MonthlyBudget,
// без отдельного платного триггера (см. комментарий в app/.../city/page.tsx
// про то, что MonthlyBudget→Calculator→PricesTable — единая денежная зона
// с одной парой CTA, не разрывать другим пейволлом).
export function StartupCosts({
  prices,
  cityName,
  slug,
  countrySlug,
  visaFree,
}: {
  prices: Record<PriceCategory, Price[]>;
  cityName: string;
  slug: string;
  countrySlug: string | null;
  visaFree: boolean;
}) {
  const unlocked = useUnlocked(slug);
  const budgetUnlocked = isUnlocked(unlocked, "budget");
  const budgetPkg = CITY_PACKAGES.budget;
  const [openModal, setOpenModal] = useState(false);

  const rent = prices.rent ?? [];
  const okraina = pick(rent, (p) => p.item_name_ru.includes("окраине"));
  const room = pick(rent, (p) => p.item_name_ru === "Комната");
  const depositSource = okraina
    ? { min: okraina.price_min, max: okraina.price_max }
    : room
      ? { min: room.price_min, max: room.price_max }
      : null;

  const costs = calcStartupCosts({ countrySlug, visaFree, depositSource });

  const rows: Array<{ key: string; icon: string; label: string; min: number; max: number; note: string }> = [
    { key: "flight", icon: "✈️", label: "Перелёт", min: costs.flight.min, max: costs.flight.max, note: costs.flight.note },
    ...(costs.deposit
      ? [{ key: "deposit", icon: "🏠", label: "Депозит + первый месяц аренды", min: costs.deposit.min, max: costs.deposit.max, note: costs.deposit.note }]
      : []),
    { key: "visa", icon: "📄", label: "Виза/оформление", min: costs.visa.min, max: costs.visa.max, note: costs.visa.note },
    { key: "settling", icon: "🧳", label: "Обустройство на месте", min: costs.settlingIn.min, max: costs.settlingIn.max, note: costs.settlingIn.note },
  ];

  return (
    <>
      <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20 overflow-x-hidden">
        <span className="eyebrow">Разово, на старте</span>
        <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
          Стартовые расходы на переезд
        </h2>
        <p className="text-brandy/80 text-lg mb-8 max-w-2xl text-pretty">
          {typo(
            `Сколько нужно один раз, перед тем как жизнь в ${cityName} войдёт в обычный месячный бюджет: перелёт, депозит хозяину, оформление визы, первые дни на месте.`,
          )}
        </p>

        <div className="relative rounded-3xl bg-surface border hairline p-6 md:p-9 overflow-hidden">
          <div
            className="orb w-72 h-72 -top-24 -right-16 opacity-50"
            style={{ background: "rgba(232,155,110,0.20)" }}
            aria-hidden
          />
          <div className="relative">
            <p className="text-copper text-xs uppercase tracking-[0.18em] font-medium mb-2">
              Итого на старте
            </p>
            <div className="relative inline-block">
              <p
                className="font-serif text-4xl md:text-6xl text-cream tabular-nums leading-none"
                style={!budgetUnlocked ? { filter: "blur(8px)" } : undefined}
                aria-hidden={!budgetUnlocked}
              >
                {formatRub(costs.totalMin)} – {formatRub(costs.totalMax)}
              </p>
              {!budgetUnlocked && (
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label={`Открыть «${budgetPkg.label}» за ${budgetPkg.price} ₽`}
                >
                  <span className="bg-surface-elevated/95 backdrop-blur-md border border-copper/30 rounded-2xl px-5 py-2.5 text-copper text-sm font-semibold whitespace-nowrap hover:bg-brandy hover:text-pine-tree transition">
                    Получить мой расчёт — {budgetPkg.price} ₽
                  </span>
                </button>
              )}
            </div>

            <ul className="mt-8 space-y-2.5">
              {rows.map((r) =>
                budgetUnlocked ? (
                  <li
                    key={r.key}
                    className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between gap-y-0.5 rounded-xl bg-surface-elevated/40 px-3.5 py-3"
                  >
                    <span className="flex items-center gap-2.5 text-cream/90 text-sm">
                      <span aria-hidden className="text-lg leading-none">{r.icon}</span>
                      {r.label}
                    </span>
                    <span className="flex flex-col sm:items-end shrink-0 pl-8 sm:pl-0">
                      <span className="text-cream font-semibold tabular-nums">
                        {r.min === r.max ? formatRub(r.min) : `${formatRub(r.min)} – ${formatRub(r.max)}`}
                      </span>
                      <span className="text-brandy/45 text-xs">{r.note}</span>
                    </span>
                  </li>
                ) : (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setOpenModal(true)}
                    className="w-full flex items-center justify-between gap-3 rounded-xl border border-copper/15 bg-copper/[0.04] px-3.5 py-3 text-left hover:border-copper/30 hover:bg-copper/[0.07] transition"
                  >
                    <span className="flex items-center gap-2.5 text-brandy/55 text-sm">
                      <span aria-hidden className="text-lg leading-none opacity-60">{r.icon}</span>
                      {r.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-copper text-xs font-medium shrink-0">
                      <span aria-hidden>🔒</span>
                      <span className="hidden sm:inline">Купить полный список</span>
                      <span className="sm:hidden">Купить</span>
                    </span>
                  </button>
                ),
              )}
            </ul>

            {!budgetUnlocked && (
              <div className="mt-3 bg-surface-elevated/80 border border-copper/25 rounded-2xl px-5 py-4 text-center">
                <p className="text-cream font-serif text-lg mb-1">🧳 Полная раскладка на старт</p>
                <p className="text-brandy/75 text-sm mb-3 leading-snug">
                  Перелёт, депозит, виза и обустройство — точные диапазоны в пакете «{budgetPkg.label}»
                </p>
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className="inline-block px-5 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
                >
                  Получить мой расчёт — {budgetPkg.price} ₽
                </button>
              </div>
            )}

            <p className="mt-8 pt-6 border-t hairline text-brandy/60 text-xs text-pretty">
              {typo(
                "Ориентировочные диапазоны: перелёт и виза — по открытым данным агрегаторов на сентябрь 2026, эконом-класс, одна сторона, без ВНЖ/рабочей визы; депозит и аренда — из базы Relocost для этого города. Реальная сумма зависит от дат, авиакомпании и конкретной визы.",
              )}
            </p>
          </div>
        </div>
      </section>

      <PaymentModal
        slug={slug}
        pkg={openModal ? "budget" : null}
        onClose={() => setOpenModal(false)}
        cityName={cityName}
      />
    </>
  );
}
