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
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Цены по категориям
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {categoriesWithData.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`shrink-0 px-4 py-2 rounded-pill border text-sm transition ${
              active === c
                ? "bg-pale-copper text-pine-tree border-pale-copper"
                : "border-dingley/40 text-brandy/80 hover:text-cream hover:border-dingley/70"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-kombu-green/40 border border-dingley/30 overflow-hidden">
        <ul>
          {prices[active]?.map((p, i, arr) => (
            <li
              key={p.id}
              className={`flex items-center justify-between px-5 md:px-6 py-4 ${
                i < arr.length - 1 ? "border-b border-dingley/20" : ""
              }`}
            >
              <span className="text-cream">{p.item_name_ru}</span>
              <span className="text-brandy/90 tabular-nums">
                {formatRub(p.price_min)} – {formatRub(p.price_max)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
