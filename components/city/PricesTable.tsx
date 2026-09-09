"use client";

import { useState } from "react";
import type { Price, PriceCategory } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/prices";
import { formatRub } from "@/lib/cities";
import { isUnlocked, useUnlocked } from "@/lib/unlocked";
import { PaymentModal } from "@/components/freemium/PaymentModal";

export function PricesTable({
  prices,
  slug,
}: {
  prices: Record<PriceCategory, Price[]>;
  slug: string;
}) {
  const unlocked = useUnlocked(slug);
  const budgetUnlocked = isUnlocked(unlocked, "budget");
  const [openModal, setOpenModal] = useState(false);

  const categoriesWithData = CATEGORY_ORDER.filter(
    (c) => prices[c]?.length > 0,
  );
  const [active, setActive] = useState<PriceCategory>(
    categoriesWithData[0] ?? "rent",
  );

  return (
    <>
    <section id="prices" className="scroll-mt-[120px] max-w-6xl mx-auto px-6 pt-14 md:pt-20 overflow-x-hidden">
      <span className="eyebrow">База цен</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Цены по категориям
      </h2>
      <p className="text-brandy/75 text-lg mb-10 max-w-xl text-pretty">
        Цены в рублях, обновляются ежеквартально. Диапазон — типичный минимум и максимум.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-6 px-6 md:mx-0 md:px-0">
        {categoriesWithData.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`shrink-0 px-4 py-2 rounded-pill border text-sm font-medium transition ${
              active === c
                ? "bg-copper text-pine-tree border-copper shadow-glow"
                : "bg-surface/50 border-cream/10 text-brandy/85 hover:text-cream hover:border-copper/40"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="relative rounded-3xl bg-surface border hairline overflow-hidden">
        {(() => {
          const rows = prices[active] ?? [];
          const FREE_ROWS = 3;
          const freeRows = rows.slice(0, FREE_ROWS);
          const lockedRows = rows.slice(FREE_ROWS);

          return (
            <>
              {/* Бесплатные строки — реальные цены */}
              <ul>
                {freeRows.map((p, i) => (
                  <li
                    key={p.id}
                    className={`group flex items-center justify-between px-5 md:px-7 py-4 hover:bg-cream/[0.03] transition ${
                      i < freeRows.length - 1 || (lockedRows.length > 0 && !budgetUnlocked) ? "border-b hairline" : ""
                    }`}
                  >
                    <span className="text-cream/95 flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-1 h-1 rounded-full bg-copper/50 group-hover:bg-copper transition shrink-0" aria-hidden />
                      <span className="truncate">{p.item_name_ru}</span>
                    </span>
                    <span className="tabular-nums flex items-baseline gap-1 shrink-0 ml-3 whitespace-nowrap">
                      <span className="text-brandy/70 text-sm">{formatRub(p.price_min)}</span>
                      <span className="text-brandy/40">—</span>
                      <span className="text-cream font-semibold">{formatRub(p.price_max)}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* Закрытые строки */}
              {lockedRows.length > 0 && (
                budgetUnlocked ? (
                  <ul>
                    {lockedRows.map((p, i) => (
                      <li
                        key={p.id}
                        className={`group flex items-center justify-between px-5 md:px-7 py-4 hover:bg-cream/[0.03] transition ${
                          i < lockedRows.length - 1 ? "border-b hairline" : ""
                        }`}
                      >
                        <span className="text-cream/95 flex items-center gap-3 min-w-0 flex-1">
                          <span className="w-1 h-1 rounded-full bg-copper/50 group-hover:bg-copper transition shrink-0" aria-hidden />
                          <span className="truncate">{p.item_name_ru}</span>
                        </span>
                        <span className="tabular-nums flex items-baseline gap-1 shrink-0 ml-3 whitespace-nowrap">
                          <span className="text-brandy/70 text-sm">{formatRub(p.price_min)}</span>
                          <span className="text-brandy/40">—</span>
                          <span className="text-cream font-semibold">{formatRub(p.price_max)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="relative">
                    {/* Превью заблюренных строк */}
                    <ul className="pointer-events-none select-none" style={{ filter: "blur(4px)" }} aria-hidden>
                      {lockedRows.slice(0, 5).map((p, i) => (
                        <li
                          key={p.id}
                          className={`flex items-center justify-between px-5 md:px-7 py-4 ${
                            i < Math.min(lockedRows.length, 5) - 1 ? "border-b hairline" : ""
                          }`}
                        >
                          <span className="text-cream/95 flex items-center gap-3 min-w-0 flex-1">
                            <span className="w-1 h-1 rounded-full bg-copper/50 shrink-0" aria-hidden />
                            <span className="truncate">{p.item_name_ru}</span>
                          </span>
                          <span className="tabular-nums flex items-baseline gap-1 shrink-0 ml-3 whitespace-nowrap">
                            <span className="text-brandy/70 text-sm">{formatRub(p.price_min)}</span>
                            <span className="text-brandy/40">—</span>
                            <span className="text-cream font-semibold">{formatRub(p.price_max)}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    {/* Градиент + кнопка */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent flex flex-col items-center justify-end pb-5 px-4">
                      <p className="text-brandy/70 text-xs mb-3 text-center">
                        + ещё {lockedRows.length} позиций в этой категории
                      </p>
                      <button
                        type="button"
                        onClick={() => setOpenModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
                      >
                        📊 Открыть все цены — 49 ₽
                      </button>
                    </div>
                  </div>
                )
              )}
            </>
          );
        })()}
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
