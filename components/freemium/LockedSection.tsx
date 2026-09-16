"use client";

import { useState } from "react";
import { CITY_PACKAGES, type CityPackageType } from "@/lib/unlocked";
import { PaymentModal } from "./PaymentModal";
import { PurchaseCount } from "@/components/PurchaseCount";

export function LockedSection({
  slug,
  pkg,
  hint,
  purchaseCount,
  onOpen,
  children,
}: {
  slug: string;
  pkg: CityPackageType;
  hint?: string;
  /** Сколько человек уже купили этот пакет — соцдоказательство у CTA.
   *  Не передан/0 — просто не рендерится. */
  purchaseCount?: number;
  /** Доп. коллбэк при клике «Открыть за N ₽» — например, своя цель Метрики
   *  для конкретного места использования (PaymentModal уже шлёт общий
   *  "package_click" сам, это для контекстных целей поверх него). */
  onOpen?: () => void;
  children: React.ReactNode;
}) {
  const [openPkg, setOpenPkg] = useState<CityPackageType | null>(null);
  const meta = CITY_PACKAGES[pkg];
  const bundle = CITY_PACKAGES.bundle;

  // 2026-09-14: «Места» почти никогда не покупают отдельно (см. комментарий
  // в StickyBar.tsx — 5 из 7 оплат за всё время это «Расходы», «Места» —
  // почти никогда). Поэтому здесь, где замок стоит именно на пакете
  // "places" (BestPlaces, RouteTimeline), первичная кнопка ведёт на Bundle
  // — он всё равно открывает те же места, только + разбивка расходов.
  // Разовая покупка одних мест остаётся доступна отдельной ссылкой пониже,
  // просто не как основной CTA.
  const upsellBundle = pkg !== "bundle" && pkg === "places";
  const primaryPkg: CityPackageType = upsellBundle ? "bundle" : pkg;
  const primaryMeta = CITY_PACKAGES[primaryPkg];
  const extra = bundle.price - meta.price;

  return (
    <>
      <div className="relative">
        <div
          aria-hidden
          style={{ filter: "blur(6px)" }}
          className="pointer-events-none select-none"
        >
          {children}
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-surface-elevated/95 backdrop-blur-md border border-copper/25 rounded-3xl p-6 md:p-7 text-center shadow-2xl">
            <div className="text-3xl mb-3" aria-hidden>
              {meta.emoji}
            </div>
            <h3 className="font-serif text-xl text-cream mb-2">
              {meta.label}
            </h3>
            {hint && (
              <p className="text-brandy/80 text-sm mb-5 leading-relaxed">
                {hint}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                onOpen?.();
                setOpenPkg(primaryPkg);
              }}
              className="inline-block px-6 py-3 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy"
            >
              Открыть за {primaryMeta.price} ₽
            </button>
            {upsellBundle && extra > 0 && (
              <p className="mt-2 text-brandy/50 text-xs leading-snug">
                +{extra} ₽ и получи еще все цены ·{" "}
                <button
                  type="button"
                  onClick={() => {
                    onOpen?.();
                    setOpenPkg(pkg);
                  }}
                  className="underline underline-offset-2 hover:text-brandy transition"
                >
                  только места — {meta.price} ₽
                </button>
              </p>
            )}
            <p className="mt-2 text-brandy/45 text-[11px] leading-snug">
              Не откроется — не переживайте, вернем деньги
            </p>
            <PurchaseCount count={purchaseCount ?? 0} />
          </div>
        </div>
      </div>

      <PaymentModal
        slug={slug}
        pkg={openPkg}
        onClose={() => setOpenPkg(null)}
      />
    </>
  );
}
