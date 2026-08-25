"use client";

import { useState } from "react";
import {
  CITY_PACKAGES,
  lockedRemaining,
  useUnlocked,
  type CityPackageType,
} from "@/lib/unlocked";
import { PaymentModal } from "./PaymentModal";
import { RestoreAccess } from "./RestoreAccess";

export function StickyBar({
  slug,
  isForeign,
}: {
  slug: string;
  isForeign: boolean;
}) {
  const unlocked = useUnlocked(slug);
  const remaining = lockedRemaining(unlocked, isForeign);
  const [openPkg, setOpenPkg] = useState<CityPackageType | null>(null);

  if (remaining.length === 0) return null;

  const bundleSavings =
    remaining.reduce((sum, p) => sum + CITY_PACKAGES[p].price, 0) -
    CITY_PACKAGES.bundle.price;

  // Самый дешевый из незакрытых пакетов (не bundle) — точка входа на мобиле.
  const cheapestPkg = remaining.reduce<CityPackageType>(
    (min, p) => (CITY_PACKAGES[p].price < CITY_PACKAGES[min].price ? p : min),
    remaining[0],
  );

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-copper/25 shadow-2xl p-3 md:p-4">
          {/* Мобиль: кнопка «от 79 ₽» (primary) + «Все за 299 ₽» (outline) */}
          <div className="flex md:hidden items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => setOpenPkg(cheapestPkg)}
              className="flex-1 rounded-xl bg-copper text-pine-tree font-semibold text-sm py-2.5 px-3 hover:bg-brandy transition active:scale-95"
            >
              {CITY_PACKAGES[cheapestPkg].short} — {CITY_PACKAGES[cheapestPkg].price} ₽
            </button>
            <button
              type="button"
              onClick={() => setOpenPkg("bundle")}
              className="shrink-0 rounded-xl border border-copper/50 text-copper font-medium text-sm py-2.5 px-3 hover:bg-copper/10 transition active:scale-95"
            >
              Комбо — {CITY_PACKAGES.bundle.price} ₽
            </button>
          </div>

          {/* Десктоп: все пакеты + кнопка bundle */}
          <div className="hidden md:flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="text-brandy/60 text-xs uppercase tracking-wider pl-2 pr-1 whitespace-nowrap">
              Открыть
            </span>
            {remaining.map((p) => {
              const meta = CITY_PACKAGES[p];
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
                    <span className="font-semibold tabular-nums">
                      {meta.price} ₽
                    </span>
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setOpenPkg("bundle")}
              className="shrink-0 inline-flex flex-col items-center gap-0.5 px-4 md:px-5 py-2 min-h-[44px] justify-center rounded-pill bg-copper text-pine-tree text-sm font-semibold border border-copper transition hover:bg-brandy ml-auto"
            >
              <span className="inline-flex items-center gap-1.5">
                <span>🎁</span>
                <span>
                  Все включено {CITY_PACKAGES.bundle.price} ₽
                  {bundleSavings > 0 && (
                    <span className="font-medium text-pine-tree/70 text-xs ml-1">
                      −{bundleSavings} ₽
                    </span>
                  )}
                </span>
              </span>
            </button>
          </div>
          <p className="text-brandy/50 text-[11px] text-center pt-1.5">
            Открывается сразу после оплаты · единоразовый платёж · доступ навсегда
          </p>
          <div className="flex justify-end pt-1">
            <RestoreAccess slug={slug} />
          </div>
        </div>
      </div>

      <PaymentModal slug={slug} pkg={openPkg} onClose={() => setOpenPkg(null)} />
    </>
  );
}
