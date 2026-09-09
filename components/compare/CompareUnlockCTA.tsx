"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { PaymentModal } from "@/components/freemium/PaymentModal";
import {
  CITY_PACKAGES,
  isUnlocked,
  useUnlocked,
  type CityPackageType,
} from "@/lib/unlocked";

// Монетизация /compare/<город>-vs-<город>.
//
// Контекст (2026-09-09): страницы сравнения городов — второй по трафику
// денежный кластер (~285 визитов/мес), но единственной точкой покупки была
// статическая ссылка на /city/<slug>/prices в самом низу страницы — то есть
// лишний переход между «захотел» и «купил», и уже за пределами зоны внимания.
//
// Здесь НЕ вводится никакой отдельный «пакет сравнения» с новой ценой: это
// ровно те же городские пакеты, что уже продаются на страницах городов —
// budget (49 ₽) и bundle (59 ₽), просто по каждому из двух городов отдельно.
// Модалка та же самая (PaymentModal, портал в document.body), значит и
// цель Метрики package_click, и demo-режим, и восстановление по email
// работают без единой строчки нового кода.

type CityTarget = { slug: string; name: string };

// Обе карточки равнозначны: пакет и цена одинаковые, а какой из двух городов
// «главный» — знает только пользователь. Поэтому никакой primary/secondary
// иерархии: контурная кнопка рядом с залитой читалась бы как «этот вариант
// хуже» или вовсе как неактивный.
function CityUnlockCard({
  city,
  onBuy,
}: {
  city: CityTarget;
  onBuy: (slug: string, pkg: CityPackageType) => void;
}) {
  const unlocked = useUnlocked(city.slug);
  const budgetOpen = isUnlocked(unlocked, "budget");
  const placesOpen = isUnlocked(unlocked, "places");
  const allOpen = budgetOpen && placesOpen;

  return (
    <div className="flex-1 min-w-0 rounded-2xl border hairline bg-pine-tree/35 p-5 flex flex-col gap-3">
      <p className="text-cream font-serif text-lg md:text-xl leading-tight text-pretty">
        {city.name}
      </p>

      {allOpen ? (
        <>
          <p className="text-brandy/70 text-sm leading-snug">
            Полный профиль уже открыт на этом устройстве.
          </p>
          <Link
            href={`/city/${city.slug}/prices`}
            className="mt-auto inline-flex items-center justify-center px-5 py-3 min-h-[44px] rounded-pill border border-copper/50 text-copper font-semibold text-sm hover:bg-copper/10 transition"
          >
            Смотреть все цены
          </Link>
        </>
      ) : budgetOpen ? (
        <>
          <p className="text-brandy/70 text-sm leading-snug">
            Цены открыты. Осталось добавить лучшие места — кафе, рынки,
            коворкинги, районы.
          </p>
          <button
            type="button"
            onClick={() => onBuy(city.slug, "places")}
            className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-pill border border-copper/50 text-copper font-semibold text-sm hover:bg-copper/10 transition"
          >
            {CITY_PACKAGES.places.emoji} Лучшие места — {CITY_PACKAGES.places.price} ₽
          </button>
        </>
      ) : (
        <>
          <p className="text-brandy/70 text-sm leading-snug">
            40+ статей расходов с реальными диапазонами: аренда по районам,
            продукты, транспорт, коммуналка, связь, медицина.
          </p>
          <button
            type="button"
            onClick={() => onBuy(city.slug, "budget")}
            className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
          >
            {CITY_PACKAGES.budget.emoji} Полный профиль — {CITY_PACKAGES.budget.price} ₽
          </button>
          <button
            type="button"
            onClick={() => onBuy(city.slug, "bundle")}
            className="text-brandy/60 hover:text-copper text-xs underline underline-offset-2 transition"
          >
            {CITY_PACKAGES.bundle.emoji} + лучшие места, всё вместе —{" "}
            {CITY_PACKAGES.bundle.price} ₽
          </button>
        </>
      )}
    </div>
  );
}

export function CompareUnlockCTA({
  a,
  b,
  /** Разница в % из таблицы сравнения — чтобы заголовок продолжал уже
   *  показанную мысль, а не начинал новую тему с нуля. */
  pct,
}: {
  a: CityTarget;
  b: CityTarget;
  pct?: number;
}) {
  const [modal, setModal] = useState<{ slug: string; pkg: CityPackageType } | null>(
    null,
  );

  const headline = pct
    ? `Разница в ${pct}% — это среднее. Посмотрите, из чего она складывается`
    : "Посмотрите, из чего складывается разница";

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <div
        className="rounded-3xl border-2 border-copper/45 p-6 md:p-8"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(232,155,110,0.18) 0%, transparent 60%), linear-gradient(135deg, #2A3618 0%, #1A2105 100%)",
        }}
      >
        <div className="text-center mb-6">
          <p className="text-copper text-xs uppercase tracking-wider font-semibold mb-3">
            Полные данные по каждому городу
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-cream mb-3 leading-tight text-pretty">
            {headline}
          </h3>
          <p className="text-brandy/80 max-w-2xl mx-auto text-sm leading-relaxed">
            В таблице выше — базовые статьи. Полный профиль города открывает 40+
            позиций с реальными диапазонами цен, а не усредненными. Выберите
            город — или откройте оба.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <CityUnlockCard city={a} onBuy={(slug, pkg) => setModal({ slug, pkg })} />
          <CityUnlockCard city={b} onBuy={(slug, pkg) => setModal({ slug, pkg })} />
        </div>

        <p className="text-brandy/40 text-xs mt-5 text-center">
          Единоразовая оплата · доступ навсегда · ЮKassa
        </p>
      </div>

      <PaymentModal
        slug={modal?.slug ?? ""}
        pkg={modal?.pkg ?? null}
        onClose={() => setModal(null)}
      />
    </section>
  );
}
