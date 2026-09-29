"use client";

import { useEffect, useRef, useState } from "react";
import {
  CITY_PACKAGES,
  lockedRemaining,
  useUnlocked,
  type CityPackageType,
} from "@/lib/unlocked";
import { PaymentModal } from "./PaymentModal";
import { PackageComparisonModal } from "./PackageComparisonModal";
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
  // 2026-09-16: раньше тут был инлайн-тоггл «Показать все пакеты», который
  // просто разворачивал ещё одну строку кнопок с ценами — то есть на вопрос
  // «чем пакеты отличаются, кроме цены» так и не отвечал (фидбек: «каша в
  // голове», «нигде не нашла сравнения тарифов»). Теперь тот же вход открывает
  // полноценную таблицу сравнения (PackageComparisonModal) с чек-марками по
  // фичам каждого пакета.
  const [compareOpen, setCompareOpen] = useState(false);

  // 2026-09-29 (продуктовый аудит): бар — position:fixed, из потока
  // документа не занимает места, поэтому на мобильном последний экран
  // футера (реквизиты, копирайт) физически перекрывался баром навсегда —
  // доскроллить до конца страницы было некуда, юр. информация становилась
  // недоступна. StickyBar рендерится в DOM ПОСЛЕ <Footer/> (см. city/[slug]/
  // page.tsx), поэтому обычный spacer-див тут футер не подвинет — вместо
  // этого пишем измеренную высоту бара в CSS-переменную на <html>, а Footer
  // читает её как свой padding-bottom (var(--sticky-bar-height, 0px) —
  // на страницах без бара переменной нет, фолбэк 0). Высоту не хардкодим:
  // контент бара плавает (строка соц-доказательства и "+N ₽ в Комбо" не
  // всегда есть) — ResizeObserver подстраивается сам при любых будущих правках.
  const barRef = useRef<HTMLDivElement | null>(null);
  const [barHeight, setBarHeight] = useState(0);

  useEffect(() => {
    const el = barRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const obs = new ResizeObserver((entries) => {
      const h = entries[0]?.borderBoxSize?.[0]?.blockSize ?? entries[0]?.contentRect.height;
      if (h) setBarHeight(h);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--sticky-bar-height", `${barHeight}px`);
    return () => {
      document.documentElement.style.setProperty("--sticky-bar-height", "0px");
    };
  }, [barHeight]);

  if (remaining.length === 0) return null;

  const bundleSavings =
    remaining.reduce((sum, p) => sum + CITY_PACKAGES[p].price, 0) -
    CITY_PACKAGES.bundle.price;

  // 2026-09-30 (аудит монетизации): раньше primary-кнопкой был "budget"
  // (199 ₽, "Все цены") — сам факт трёх конкурирующих цен (149/199/249)
  // заставлял решать "какой из трёх" прямо перед оплатой, это лишний шаг
  // trения. Теперь при обоих незакрытых пакетах (самый частый случай — новый
  // посетитель) единственный герой-оффер — bundle (249 ₽, "мой полный
  // расчёт"): продаём результат ("сколько нужно лично мне"), а не строчки
  // цен. "budget" отдельно (199 ₽) — только downsell под героем, "places"
  // (149 ₽) как равноправная кнопка больше не показывается — доступен через
  // "Сравнить пакеты". Если один из двух уже куплен — оффер один и тот же,
  // бандл теряет смысл (переплата за уже открытое), просто показываем то,
  // что ещё заперто.
  const hasBundleOffer = remaining.length === 2;
  const heroPkg: CityPackageType = hasBundleOffer ? "bundle" : remaining[0];
  const downsellPkg: CityPackageType | null = hasBundleOffer ? "budget" : null;

  const HERO_LABEL: Record<CityPackageType, string> = {
    bundle: "Мой полный расчёт",
    budget: "Расходы",
    places: "Лучшие места",
  };

  const extraPkgs = remaining.filter((p) => p !== heroPkg && p !== downsellPkg);
  const bundleExtra = CITY_PACKAGES.bundle.price - CITY_PACKAGES[heroPkg].price;
  const extraLabel = extraPkgs.map((p) => CITY_PACKAGES[p].short).join(" и ");

  return (
    <>
      <div ref={barRef} className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-copper/25 shadow-2xl p-3 md:p-4">
          {!!purchaseCount && (
            <PurchaseCount count={purchaseCount} />
          )}

          {/* Мобиль: hero-кнопка (bundle, если оба пакета ещё заперты) +
              downsell outline рядом («Только расходы»). Один герой-оффер,
              а не три равноправные цены перед оплатой. */}
          <div className="flex md:hidden items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => setOpenPkg(heroPkg)}
              className="flex-1 rounded-xl bg-copper text-pine-tree font-semibold text-sm py-2.5 px-3 hover:bg-brandy transition active:scale-95"
            >
              {heroPkg === "bundle" && <span aria-hidden>🎁 </span>}
              {HERO_LABEL[heroPkg]} — {CITY_PACKAGES[heroPkg].price} ₽
            </button>
            {downsellPkg && (
              <button
                type="button"
                onClick={() => setOpenPkg(downsellPkg)}
                className="shrink-0 rounded-xl border border-copper/50 text-copper font-medium text-sm py-2.5 px-3 hover:bg-copper/10 transition active:scale-95"
              >
                Только {CITY_PACKAGES[downsellPkg].short.toLowerCase()} — {CITY_PACKAGES[downsellPkg].price} ₽
              </button>
            )}
          </div>

          {/* Десктоп: та же иерархия — hero-pill выделена копером, downsell рядом приглушённым. */}
          <div className="hidden md:flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="text-brandy/60 text-xs uppercase tracking-wider pl-2 pr-1 whitespace-nowrap">
              Открыть
            </span>
            <button
              type="button"
              onClick={() => setOpenPkg(heroPkg)}
              className="shrink-0 inline-flex flex-col items-center gap-0.5 px-4 md:px-5 py-2 min-h-[44px] justify-center rounded-pill bg-copper text-pine-tree text-sm font-semibold border border-copper transition hover:bg-brandy"
            >
              <span className="inline-flex items-center gap-1.5">
                {heroPkg === "bundle" && <span aria-hidden>🎁</span>}
                <span>{HERO_LABEL[heroPkg]}</span>
                <span className="font-semibold tabular-nums">{CITY_PACKAGES[heroPkg].price} ₽</span>
                {heroPkg === "bundle" && bundleSavings > 0 && (
                  <span className="font-medium text-pine-tree/70 text-xs">
                    −{bundleSavings} ₽
                  </span>
                )}
              </span>
            </button>
            {downsellPkg && (
              <button
                type="button"
                onClick={() => setOpenPkg(downsellPkg)}
                className="shrink-0 inline-flex flex-col items-start gap-0.5 px-3.5 md:px-4 py-2 min-h-[44px] justify-center rounded-pill bg-surface-elevated hover:bg-surface-elevated text-cream text-sm border hairline transition ml-auto"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="hidden sm:inline">Только {CITY_PACKAGES[downsellPkg].short.toLowerCase()}</span>
                  <span className="font-semibold tabular-nums">
                    {CITY_PACKAGES[downsellPkg].price} ₽
                  </span>
                </span>
              </button>
            )}
          </div>

          {/* Сравнение пакетов по фичам (чек-марками) — доступ к "Местам"
              отдельно тоже отсюда, без равноправной кнопки на видном месте. */}
          <p className="text-brandy/45 text-[11px] text-center pt-1.5">
            {hasBundleOffer
              ? `«${HERO_LABEL.bundle}» включает и расходы, и лучшие места`
              : extraPkgs.length > 0
                ? `+${bundleExtra} ₽ — и получите ещё ${extraLabel}`
                : null}
            {(hasBundleOffer || extraPkgs.length > 0) && " · "}
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="underline underline-offset-2 hover:text-brandy transition"
            >
              Сравнить пакеты
            </button>
          </p>

          <p className="text-brandy/50 text-[11px] text-center pt-1.5">
            Открывается сразу после оплаты
          </p>
          <div className="flex justify-end pt-1">
            <RestoreAccess slug={slug} />
          </div>
        </div>
      </div>

      <PaymentModal slug={slug} pkg={openPkg} onClose={() => setOpenPkg(null)} />
      <PackageComparisonModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        onBuy={(pkg) => setOpenPkg(pkg)}
      />
    </>
  );
}
