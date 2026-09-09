"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { CountryPaymentModal } from "@/components/freemium/CountryPaymentModal";
import {
  COUNTRY_PACKAGES,
  isCountryUnlocked,
  useCountryUnlocked,
  type CountryPackageType,
} from "@/lib/unlocked";
import { pluralRu } from "@/lib/trip-format";

// Монетизация /compare/<страна>-vs-<страна>.
//
// Тот же принцип, что и в CompareUnlockCTA для городов: никакого нового
// «пакета сравнения» — переиспользуем страновые пакеты, которые уже продаются
// на /country/<slug>: country_overview (29 ₽) и country_cities (49 ₽), по
// каждой из двух стран отдельно.
//
// ВАЖНО про страновые пакеты: на бэке (app/api/payment/create) оплата
// country_* пока отдаёт «Оплата материалов о стране временно недоступна» —
// ждёт миграцию Supabase, которую Виктория ещё не применила. Это не ломает
// страницу: пользователь увидит сообщение внутри модалки, а как только
// миграция пройдёт, кнопки заработают сами, без правок фронта.

type CountryTarget = {
  slug: string;
  name: string;
  flag: string | null;
  cityCount: number;
  /** Есть ли текстовый блок «о стране» — иначе country_overview продавать нечего. */
  hasOverview: boolean;
};

// Сколько городов страны видно бесплатно ПРЯМО ЗДЕСЬ — CountryCompareCities
// показывает по пятерке самых доступных на каждую страну. На /country/<slug>
// порог другой (LockedCities, FREE_COUNT = 3), но обещать «остальные города»
// нужно относительно того, что человек уже видит на этой странице, иначе
// получится продажа того, что и так открыто.
const SHOWN_HERE = 5;

// Карточки двух стран равнозначны. Иерархия есть только ВНУТРИ карточки:
// первый доступный пакет — залитой кнопкой, второй — контурной.
function CountryUnlockCard({
  country,
  onBuy,
}: {
  country: CountryTarget;
  onBuy: (slug: string, pkg: CountryPackageType) => void;
}) {
  const unlocked = useCountryUnlocked(country.slug);

  // Продаём только то, что на этой стране реально есть — ровно по правилам
  // страницы страны (см. CountryStickyBar в app/[locale]/country/[slug]).
  const hiddenCities = Math.max(country.cityCount - SHOWN_HERE, 0);

  const offers: CountryPackageType[] = [];
  if (hiddenCities > 0 && !isCountryUnlocked(unlocked, "country_cities")) {
    offers.push("country_cities");
  }
  if (country.hasOverview && !isCountryUnlocked(unlocked, "country_overview")) {
    offers.push("country_overview");
  }

  return (
    <div className="flex-1 min-w-0 rounded-2xl border hairline bg-pine-tree/35 p-5 flex flex-col gap-3">
      <p className="text-cream font-serif text-lg md:text-xl leading-tight text-pretty">
        {country.flag ? <span aria-hidden>{country.flag} </span> : null}
        {country.name}
      </p>

      {offers.length === 0 ? (
        <>
          <p className="text-brandy/70 text-sm leading-snug">
            Все материалы по стране уже открыты на этом устройстве.
          </p>
          <Link
            href={`/country/${country.slug}`}
            className="mt-auto inline-flex items-center justify-center px-5 py-3 min-h-[44px] rounded-pill border border-copper/50 text-copper font-semibold text-sm hover:bg-copper/10 transition"
          >
            Перейти к стране
          </Link>
        </>
      ) : (
        <>
          <p className="text-brandy/70 text-sm leading-snug">
            {offers[0] === "country_cities"
              ? `Еще ${hiddenCities} ${pluralRu(hiddenCities, "город", "города", "городов")} с бюджетом, климатом и сложностью переезда — выше только пятерка самых доступных.`
              : "Особенности жизни, практические советы и лучшие места — все, что нужно знать до переезда."}
          </p>
          <div className="mt-auto flex flex-col gap-2">
            {offers.map((p, i) => {
              const meta = COUNTRY_PACKAGES[p];
              const filled = i === 0;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onBuy(country.slug, p)}
                  className={
                    filled
                      ? "inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
                      : "inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-pill border border-copper/50 text-copper font-semibold text-sm hover:bg-copper/10 transition"
                  }
                >
                  {meta.emoji} {meta.label} — {meta.price} ₽
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function CountryCompareUnlockCTA({
  a,
  b,
  pct,
}: {
  a: CountryTarget;
  b: CountryTarget;
  pct?: number;
}) {
  const [modal, setModal] = useState<{
    slug: string;
    pkg: CountryPackageType;
  } | null>(null);

  // Есть ли вообще что продавать. Проверяем по статике (число городов /
  // наличие блока «о стране»), без учёта localStorage: заголовок не должен
  // прыгать между SSR и гидратацией.
  const anyCities = a.cityCount > SHOWN_HERE || b.cityCount > SHOWN_HERE;
  const anyOverview = a.hasOverview || b.hasOverview;
  if (!anyCities && !anyOverview) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 md:pt-20">
      <div
        className="rounded-3xl border-2 border-copper/45 p-6 md:p-8"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(232,155,110,0.18) 0%, transparent 60%), linear-gradient(135deg, #2A3618 0%, #1A2105 100%)",
        }}
      >
        <div className="text-center mb-6">
          <p className="text-copper text-xs uppercase tracking-wider font-semibold mb-3">
            Полные данные по каждой стране
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-cream mb-3 leading-tight text-pretty">
            {anyCities
              ? pct
                ? `Разница в ${pct}% — среднее по стране. Решает конкретный город`
                : "Среднее по стране мало что решает — решает конкретный город"
              : pct
                ? `Разница в ${pct}% — только про деньги. Остальное решает быт`
                : "Цифры сравнили. Осталось понять, каково там жить"}
          </h3>
          <p className="text-brandy/80 max-w-2xl mx-auto text-sm leading-relaxed">
            {anyCities
              ? "Разброс цен внутри одной страны обычно больше, чем разница между странами. Откройте полный список городов с бюджетом и разбор особенностей жизни — по той стране, к которой склоняетесь."
              : "Виза, банки, аренда, медицина, языковой барьер — то, из-за чего переезд идет не по плану. Откройте разбор по той стране, к которой склоняетесь."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <CountryUnlockCard country={a} onBuy={(slug, pkg) => setModal({ slug, pkg })} />
          <CountryUnlockCard country={b} onBuy={(slug, pkg) => setModal({ slug, pkg })} />
        </div>

        <p className="text-brandy/40 text-xs mt-5 text-center">
          Единоразовая оплата · доступ навсегда · ЮKassa
        </p>
      </div>

      <CountryPaymentModal
        slug={modal?.slug ?? ""}
        pkg={modal?.pkg ?? null}
        onClose={() => setModal(null)}
      />
    </section>
  );
}
