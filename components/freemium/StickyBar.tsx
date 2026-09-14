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
import { PurchaseCount } from "@/components/PurchaseCount";

export function StickyBar({
  slug,
  isForeign,
  purchaseCount,
}: {
  slug: string;
  isForeign: boolean;
  /** Сайт-вайд число оплаченных заказов за последние 30 дней (см.
   *  lib/purchase-counts.ts) — соцдоказательство у постоянного CTA.
   *  Не передан/0 — просто не рендерится. */
  purchaseCount?: number;
}) {
  const unlocked = useUnlocked(slug);
  const remaining = lockedRemaining(unlocked, isForeign);
  const [openPkg, setOpenPkg] = useState<CityPackageType | null>(null);
  // 2026-09-14: по умолчанию скрываем «Места» из списка вариантов (см.
  // причину ниже) — этот тоггл открывает полный набор из 3 пакетов для тех,
  // кому правда нужны только места без остального.
  const [showAll, setShowAll] = useState(false);

  if (remaining.length === 0) return null;

  const bundleSavings =
    remaining.reduce((sum, p) => sum + CITY_PACKAGES[p].price, 0) -
    CITY_PACKAGES.bundle.price;

  // Точка входа на мобиле.
  //
  // Было: самый дешёвый незакрытый пакет, то есть всегда «Места» 19 ₽. На
  // мобильном (67% трафика) в панели помещаются ровно две кнопки — «Места»
  // и «Комбо», — и «Расходы» 49 ₽ не было видно нигде в постоянном CTA.
  // При этом по фактическим оплатам именно «Расходы» — единственный пакет,
  // который реально покупают (5 из 7 оплат за всё время; «Места» — почти
  // никогда). Плюс сам по себе рассинхрон: пользователь только что видел
  // в блоке цен кнопку «Открыть за 49 ₽», а закреплённая панель предлагала
  // 19 и 59 ₽. Теперь primary — «Расходы», если он ещё не куплен.
  const primaryPkg: CityPackageType = remaining.includes("budget")
    ? "budget"
    : remaining.reduce<CityPackageType>(
        (min, p) =>
          CITY_PACKAGES[p].price < CITY_PACKAGES[min].price ? p : min,
        remaining[0],
      );

  // Подпись, объясняющая ценность, вместо служебного названия пакета.
  const PRIMARY_LABEL: Record<CityPackageType, string> = {
    budget: "Все цены",
    places: "Лучшие места",
    bundle: "Все включено",
  };

  // 2026-09-14 (продуктовый аудит воронки): по факту продаж покупают почти
  // всегда «Расходы» или «Все включено» — «Места» отдельной покупкой берут
  // почти никогда (см. комментарий выше). Раньше desktop-версия панели
  // рендерила ВСЕ незакрытые пакеты как равнозначные кнопки, из-за чего
  // «Места» выглядели таким же основным выбором, как «Расходы» — хотя
  // реальный выбор почти всегда между двумя. Теперь по умолчанию видно
  // только primary ("Расходы") + Bundle; остальные пакеты (по факту — только
  // "Места") скрыты за тогглом «Показать все пакеты», а рядом с Bundle —
  // явная подсказка, сколько стоит доплатить, чтобы получить их тоже.
  const extraPkgs = remaining.filter((p) => p !== primaryPkg);
  const bundleExtra = CITY_PACKAGES.bundle.price - CITY_PACKAGES[primaryPkg].price;
  const extraLabel =
    extraPkgs.length === 1
      ? CITY_PACKAGES[extraPkgs[0]].short
      : extraPkgs.map((p) => CITY_PACKAGES[p].short).join(" и ");

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-copper/25 shadow-2xl p-3 md:p-4">
          {!!purchaseCount && (
            <PurchaseCount count={purchaseCount} />
          )}

          {/* Мобиль: primary-кнопка самого востребованного пакета + outline «Все — N ₽» (bundle) */}
          <div className="flex md:hidden items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => setOpenPkg(primaryPkg)}
              className="flex-1 rounded-xl bg-copper text-pine-tree font-semibold text-sm py-2.5 px-3 hover:bg-brandy transition active:scale-95"
            >
              {PRIMARY_LABEL[primaryPkg]} — {CITY_PACKAGES[primaryPkg].price} ₽
            </button>
            <button
              type="button"
              onClick={() => setOpenPkg("bundle")}
              className="shrink-0 rounded-xl border border-copper/50 text-copper font-medium text-sm py-2.5 px-3 hover:bg-copper/10 transition active:scale-95"
            >
              Все — {CITY_PACKAGES.bundle.price} ₽
            </button>
          </div>

          {/* Десктоп: primary pill + bundle CTA (по умолчанию — 2 варианта) */}
          <div className="hidden md:flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="text-brandy/60 text-xs uppercase tracking-wider pl-2 pr-1 whitespace-nowrap">
              Открыть
            </span>
            <button
              type="button"
              onClick={() => setOpenPkg(primaryPkg)}
              className="shrink-0 inline-flex flex-col items-start gap-0.5 px-3.5 md:px-4 py-2 min-h-[44px] justify-center rounded-pill bg-surface-elevated hover:bg-surface-elevated text-cream text-sm border hairline transition"
            >
              <span className="inline-flex items-center gap-1.5">
                <span>{CITY_PACKAGES[primaryPkg].emoji}</span>
                <span className="hidden sm:inline">{CITY_PACKAGES[primaryPkg].short}</span>
                <span className="font-semibold tabular-nums">
                  {CITY_PACKAGES[primaryPkg].price} ₽
                </span>
              </span>
            </button>
            {showAll &&
              extraPkgs.map((p) => {
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

          {/* Полный набор из 3 пакетов доступен глубже: тоггл, а не всегда
              на виду (см. комментарий про extraPkgs выше). */}
          {extraPkgs.length > 0 && (
            <p className="text-brandy/45 text-[11px] text-center pt-1.5">
              +{bundleExtra} ₽ в «Все включено» — и получите еще {extraLabel}
              {" · "}
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="underline underline-offset-2 hover:text-brandy transition"
              >
                {showAll ? "Скрыть" : "Показать все пакеты"}
              </button>
            </p>
          )}
          {showAll && extraPkgs.length > 0 && (
            <div className="flex md:hidden flex-wrap gap-2 pt-2">
              {extraPkgs.map((p) => {
                const meta = CITY_PACKAGES[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setOpenPkg(p)}
                    className="flex-1 min-w-[45%] rounded-xl border border-copper/40 text-copper text-sm font-medium py-2 px-3 hover:bg-copper/10 transition"
                  >
                    {meta.emoji} {meta.short} — {meta.price} ₽
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-brandy/50 text-[11px] text-center pt-1.5">
            Открывается сразу после оплаты · единоразовый платеж · доступ навсегда
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
