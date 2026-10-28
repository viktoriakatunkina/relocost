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

export function StickyBar({
  slug,
  isForeign,
  purchaseCount,
}: {
  slug: string;
  isForeign: boolean;
  /** Сайт-вайд число оплаченных заказов за последние 30 дней (см.
   *  lib/purchase-counts.ts). 2026-10-28: сам счётчик больше не выводится
   *  текстом (см. PurchaseCount.tsx — там это уже заменено на
   *  trust-бейджи), но проп остался как переключатель: показывать ли вообще
   *  строку доверия над кнопками (не показываем, если сайт только что
   *  запущен и подтверждённых оплат ещё 0 — см. исходный комментарий в
   *  PurchaseCount.tsx). Не передан/0 — строка не рендерится. */
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

  // 2026-10-28 (UI/UX-редизайн плашки, по правке Виктории с прод-скриншота
  // /city/tbilisi): "bundle" short-имя из lib/packages.ts уже каноническое —
  // "Все включено" (см. комментарий там же, 2026-09-21: единственное
  // каноническое название бандла, не плодить варианты по компонентам).
  // Здесь раньше было отдельное хардкодженное "Мой полный расчёт" — длиннее
  // на 5 символов и ломало кнопку на мобиле в 2 строки (flex-1 на узком
  // экране физически не вмещал текст в одну строку — сама по себе причина
  // лишней высоты бара, независимо от количества строк текста вокруг).
  // Используем short напрямую, не держим вторую копию имени пакета.
  const heroLabel =
    heroPkg === "bundle" ? CITY_PACKAGES.bundle.short : CITY_PACKAGES[heroPkg].short;

  return (
    <>
      <div ref={barRef} className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-copper/25 shadow-2xl p-2.5 md:p-3">
          {/* Строка доверия — одна строка, без переноса, короче прежней
              (была "Безопасная оплата через ЮKassa" — 32 символа отдельно от
              остальных двух пунктов; тут же всё дублирует текст, который
              пользователь и так увидит в PaymentModal/CountryPaymentModal
              прямо перед кнопкой "Оплатить" — см. components/freemium/
              PaymentModal.tsx:312-313). Оставляем как краткий якорь доверия
              на самой плашке, не повторяем длинно дважды. */}
          {!!purchaseCount && (
            <p className="text-brandy/55 text-[10.5px] text-center pb-1.5 whitespace-nowrap overflow-x-auto scrollbar-none">
              <span aria-hidden>✓</span> Разовая оплата
              <span aria-hidden className="text-brandy/30 mx-1.5">·</span>
              <span aria-hidden>✓</span> Доступ навсегда
              <span aria-hidden className="text-brandy/30 mx-1.5">·</span>
              <span aria-hidden>🔒</span> ЮKassa
            </p>
          )}

          {/* Мобиль: hero-кнопка (bundle, если оба пакета ещё заперты) +
              downsell outline рядом. Один герой-оффер, а не три равноправные
              цены перед оплатой. whitespace-nowrap — обе кнопки раньше могли
              перенести текст на вторую строку на узких экранах (сама по себе
              причина лишней высоты бара), короткие label из lib/packages.ts
              это гарантированно убирают. */}
          <div className="flex md:hidden items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => setOpenPkg(heroPkg)}
              className="flex-1 rounded-xl bg-copper text-pine-tree font-semibold text-[13px] py-2.5 px-3 whitespace-nowrap hover:bg-brandy transition active:scale-95"
            >
              {heroPkg === "bundle" && <span aria-hidden>🎁 </span>}
              {heroLabel} — {CITY_PACKAGES[heroPkg].price} ₽
            </button>
            {downsellPkg && (
              <button
                type="button"
                onClick={() => setOpenPkg(downsellPkg)}
                className="shrink-0 rounded-xl border border-copper/50 text-copper font-medium text-[13px] py-2.5 px-3 whitespace-nowrap hover:bg-copper/10 transition active:scale-95"
              >
                {CITY_PACKAGES[downsellPkg].short} — {CITY_PACKAGES[downsellPkg].price} ₽
              </button>
            )}
          </div>

          {/* Десктоп: та же иерархия — hero-pill выделена копером, downsell
              рядом приглушённым. Было 2 отдельных ряда (кнопки отдельно,
              потом "Сравнить"/"Открывается сразу"/"Уже оплатили" тремя
              строками ниже) — теперь всё в одном ряду: левый кластер
              (flex-1) против "Уже оплатили?", прижатого к правому краю. */}
          <div className="hidden md:flex items-center gap-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-brandy/60 text-xs uppercase tracking-wider pl-2 pr-1 whitespace-nowrap">
                Открыть
              </span>
              <button
                type="button"
                onClick={() => setOpenPkg(heroPkg)}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 md:px-5 py-2 min-h-[40px] rounded-pill bg-copper text-pine-tree text-sm font-semibold border border-copper transition hover:bg-brandy whitespace-nowrap"
              >
                {heroPkg === "bundle" && <span aria-hidden>🎁</span>}
                <span>{heroLabel}</span>
                <span className="font-semibold tabular-nums">{CITY_PACKAGES[heroPkg].price} ₽</span>
                {heroPkg === "bundle" && bundleSavings > 0 && (
                  <span className="font-medium text-pine-tree/70 text-xs">−{bundleSavings} ₽</span>
                )}
              </button>
              {downsellPkg && (
                <button
                  type="button"
                  onClick={() => setOpenPkg(downsellPkg)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 md:px-4 py-2 min-h-[40px] rounded-pill bg-surface-elevated hover:bg-surface-elevated text-cream text-sm border hairline transition whitespace-nowrap"
                >
                  <span>{CITY_PACKAGES[downsellPkg].short}</span>
                  <span className="font-semibold tabular-nums">{CITY_PACKAGES[downsellPkg].price} ₽</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="text-brandy/70 text-xs underline underline-offset-2 hover:text-brandy transition whitespace-nowrap"
              >
                Сравнить пакеты
              </button>
            </div>
            <RestoreAccess slug={slug} />
          </div>

          {/* Мобиль: было 3 отдельных строки — объяснение бандла текстом
              ("«Мой полный расчёт» включает и расходы, и лучшие места"),
              "Открывается сразу после оплаты" (дублирует PaymentModal) и
              "Уже оплатили?". "Открывается сразу" убрана как чистый дубль;
              выгода бандла теперь конкретным числом (не абзацем), сравнение
              и восстановление доступа — одна строка слева/справа. */}
          <div className="flex md:hidden items-center justify-between gap-2 pt-1.5 px-0.5">
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="text-brandy/70 text-[11px] underline underline-offset-2 hover:text-brandy transition whitespace-nowrap"
            >
              {hasBundleOffer && bundleSavings > 0 ? `Выгоднее на ${bundleSavings} ₽ · ` : ""}
              Сравнить пакеты
            </button>
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
