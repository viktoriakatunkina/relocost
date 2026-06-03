"use client";

import { useState } from "react";
import type { Price, PriceCategory } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/prices";
import { formatRub } from "@/lib/cities";

export function PricesTable({
  prices,
}: {
  prices: Record<PriceCategory, Price[]>;
}) {
  const categoriesWithData = CATEGORY_ORDER.filter(
    (c) => prices[c]?.length > 0,
  );
  const [active, setActive] = useState<PriceCategory>(
    categoriesWithData[0] ?? "rent",
  );

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <span className="eyebrow">База цен</span>
      <h2 className="font-serif text-4xl md:text-5xl text-cream mt-6 mb-3">
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

      <div className="rounded-3xl bg-surface border hairline overflow-hidden">
        <ul>
          {prices[active]?.map((p, i, arr) => (
            <li
              key={p.id}
              className={`group flex items-center justify-between px-5 md:px-7 py-4 hover:bg-cream/[0.03] transition ${
                i < arr.length - 1 ? "border-b hairline" : ""
              }`}
            >
              <span className="text-cream/95 flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-copper/50 group-hover:bg-copper transition" aria-hidden />
                {p.item_name_ru}
              </span>
              <span className="tabular-nums flex items-baseline gap-1">
                <span className="text-brandy/70 text-sm">{formatRub(p.price_min)}</span>
                <span className="text-brandy/40">—</span>
                <span className="text-cream font-semibold">{formatRub(p.price_max)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
