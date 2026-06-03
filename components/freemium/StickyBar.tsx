"use client";

import { useState } from "react";
import {
  PACKAGES,
  lockedRemaining,
  useUnlocked,
  type PackageType,
} from "@/lib/unlocked";
import { PaymentModal } from "./PaymentModal";

export function StickyBar({
  slug,
  isForeign,
}: {
  slug: string;
  isForeign: boolean;
}) {
  const unlocked = useUnlocked(slug);
  const remaining = lockedRemaining(unlocked, isForeign);
  const [openPkg, setOpenPkg] = useState<PackageType | null>(null);

  if (remaining.length === 0) return null;

  const bundleSavings =
    remaining.reduce((sum, p) => sum + PACKAGES[p].price, 0) -
    PACKAGES.bundle.price;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-pine-tree/85 backdrop-blur-md border border-dingley/40 shadow-2xl p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto">
            <span className="hidden md:inline text-brandy/60 text-xs uppercase tracking-wider pl-2 pr-1 whitespace-nowrap">
              Открыть
            </span>
            {remaining.map((p) => {
              const meta = PACKAGES[p];
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setOpenPkg(p)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 md:px-4 py-2 rounded-pill bg-kombu-green/70 hover:bg-kombu-green text-cream text-sm border border-dingley/30 transition"
                >
                  <span>{meta.emoji}</span>
                  <span className="hidden sm:inline">{meta.short}</span>
                  <span className="font-semibold tabular-nums">
                    {meta.price} ₽
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setOpenPkg("bundle")}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-pill bg-pale-copper text-pine-tree text-sm font-semibold border border-pale-copper transition hover:bg-brandy ml-auto"
            >
              <span>🎁</span>
              <span>Всё {PACKAGES.bundle.price} ₽</span>
              {bundleSavings > 0 && (
                <span className="hidden md:inline text-pine-tree/70 text-xs font-medium">
                  −{bundleSavings} ₽
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <PaymentModal slug={slug} pkg={openPkg} onClose={() => setOpenPkg(null)} />
    </>
  );
}
