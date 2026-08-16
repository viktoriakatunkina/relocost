"use client";

import { useState } from "react";
import {
  COUNTRY_PACKAGES,
  lockedCountryRemaining,
  useCountryUnlocked,
  type CountryPackageType,
} from "@/lib/unlocked";
import { CountryPaymentModal } from "./CountryPaymentModal";

export function CountryStickyBar({ slug }: { slug: string }) {
  const unlocked = useCountryUnlocked(slug);
  const remaining = lockedCountryRemaining(unlocked);
  const [openPkg, setOpenPkg] = useState<CountryPackageType | null>(null);

  if (remaining.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-copper/25 shadow-2xl p-3 md:p-4">
          {/* Мобиль: самый дешевый пакет + короткая кнопка */}
          <div className="flex md:hidden items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => setOpenPkg(remaining[remaining.length - 1])}
              className="flex-1 rounded-xl bg-copper text-pine-tree font-semibold text-sm py-2.5 px-3 hover:bg-brandy transition active:scale-95"
            >
              от {Math.min(...remaining.map((p) => COUNTRY_PACKAGES[p].price))} ₽
            </button>
          </div>

          {/* Десктоп: все пакеты */}
          <div className="hidden md:flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="text-brandy/60 text-xs uppercase tracking-wider pl-2 pr-1 whitespace-nowrap">
              Открыть
            </span>
            {remaining.map((p) => {
              const meta = COUNTRY_PACKAGES[p];
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setOpenPkg(p)}
                  className="shrink-0 inline-flex flex-col items-start gap-0.5 px-3.5 md:px-4 py-2 min-h-[44px] justify-center rounded-pill bg-surface-elevated hover:bg-surface-elevated text-cream text-sm border hairline transition"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>{meta.emoji}</span>
                    <span className="hidden sm:inline">{meta.short}</span>
                    <span className="font-semibold tabular-nums">{meta.price} ₽</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-brandy/50 text-[11px] text-center pt-1.5">
            Открывается сразу после оплаты
          </p>
        </div>
      </div>

      <CountryPaymentModal
        slug={slug}
        pkg={openPkg}
        onClose={() => setOpenPkg(null)}
      />
    </>
  );
}
