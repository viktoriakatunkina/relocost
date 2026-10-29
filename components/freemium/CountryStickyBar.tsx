"use client";

import { useEffect, useRef, useState } from "react";
import {
  COUNTRY_PACKAGES,
  lockedCountryRemaining,
  useCountryUnlocked,
  type CountryPackageType,
} from "@/lib/unlocked";
import { CountryPaymentModal } from "./CountryPaymentModal";
import { PackageIcon } from "@/components/icons/PackageIcons";

export function CountryStickyBar({
  slug,
  packages,
  countryName,
}: {
  slug: string;
  /** Какие пакеты реально продаются на этой странице. По умолчанию — оба.
   *  На странах с ≤3 городами скрытых городов нет, значит country_cities
   *  предлагать нечестно — остаётся только «Обзор». */
  packages?: CountryPackageType[];
  countryName?: string;
}) {
  const unlocked = useCountryUnlocked(slug);
  const allowed = packages ?? ["country_cities", "country_overview"];
  const remaining = lockedCountryRemaining(unlocked).filter((p) =>
    allowed.includes(p),
  );
  const [openPkg, setOpenPkg] = useState<CountryPackageType | null>(null);

  // Тот же баг и фикс, что в components/freemium/StickyBar.tsx (2026-09-29,
  // продуктовый аудит) — общая CSS-переменная --sticky-bar-height, страницы
  // города и страны используют её взаимоисключающе.
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

  return (
    <>
      <div ref={barRef} className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 md:px-6 md:pb-6">
        <div className="max-w-5xl mx-auto rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-copper/25 shadow-2xl p-3 md:p-4">
          {/* Мобиль: самый дешевый пакет + короткая кнопка */}
          {/* Мобиль: было «от 29 ₽» — цена без предмета покупки. Теперь
              подписываем, что именно открывается. */}
          <div className="flex md:hidden items-center gap-2 w-full">
            {remaining.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setOpenPkg(p)}
                className="flex-1 rounded-xl bg-copper text-pine-tree font-semibold text-sm py-2.5 px-3 hover:bg-brandy transition active:scale-95"
              >
                {p === "country_overview" ? "Все о стране" : "Города"} —{" "}
                {COUNTRY_PACKAGES[p].price} ₽
              </button>
            ))}
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
                    <PackageIcon pkg={p} size={14} />
                    <span className="hidden sm:inline">{meta.short}</span>
                    <span className="font-semibold tabular-nums">{meta.price} ₽</span>
                  </span>
                </button>
              );
            })}
          </div>
          {/* 2026-10-28: строка "Открывается сразу после оплаты" убрана —
              тот же текст уже есть в CountryPaymentModal.tsx:249 ("Картой
              или СБП через ЮKassa · доступ откроется сразу после оплаты"),
              показывается прямо перед кнопкой "Оплатить". На самой плашке
              дублировал и просто добавлял лишнюю строку высоты (см. ту же
              правку в components/freemium/StickyBar.tsx). */}
        </div>
      </div>

      <CountryPaymentModal
        slug={slug}
        pkg={openPkg}
        onClose={() => setOpenPkg(null)}
        countryName={countryName}
      />
    </>
  );
}
