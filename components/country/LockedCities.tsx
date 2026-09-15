"use client";

import { useState } from "react";
import { CityCard } from "@/components/CityCard";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useCountryUnlocked, isCountryUnlocked } from "@/lib/unlocked";
import { CountryPaymentModal } from "@/components/freemium/CountryPaymentModal";
import { cityName } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/routing";
import type { CityWithMinRent } from "@/lib/types";

/** Первые FREE_COUNT городов показываем бесплатно, остальные — за paywall.
 *
 * 2026-09-15, техSEO-аудит: было 3 — города за пейволлом рендерились БЕЗ
 * <a href> вообще (см. LockedCityLinks ниже), краулер их из этой страницы
 * не видел. Подняли до 5 (меньше городов уходит под замок вообще) и для
 * тех, что всё ещё под замком, теперь всегда рендерим настоящие ссылки —
 * без цены/превью, но с href в DOM. */
const FREE_COUNT = 5;

export function LockedCities({
  slug,
  cities,
}: {
  slug: string;
  cities: CityWithMinRent[];
}) {
  const unlocked = useCountryUnlocked(slug);
  const opened = isCountryUnlocked(unlocked, "country_cities");
  const [openModal, setOpenModal] = useState(false);

  const free = cities.slice(0, FREE_COUNT);
  const locked = cities.slice(FREE_COUNT);

  return (
    <>
      {/* Горизонтальный скролл на мобильном */}
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-none pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6 md:hidden">
        {free.map((c, i) => (
          <div key={c.id} className="shrink-0 w-[78vw] max-w-[320px] snap-start">
            <CityCard city={c} index={i} />
          </div>
        ))}
        {!opened && locked.length > 0 && (
          <div className="shrink-0 w-[78vw] max-w-[320px] snap-start">
            <div className="w-full h-full min-h-[280px] rounded-3xl border-2 border-dashed border-copper/30 flex flex-col items-center justify-center gap-3 text-center p-6 hover:border-copper/50 hover:bg-copper/5 transition">
              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="flex flex-col items-center gap-3 hover:opacity-80 transition"
              >
                <span className="text-3xl">🏙</span>
                <p className="text-cream/80 text-sm font-medium">
                  Ещё {locked.length} городов
                </p>
                <span className="px-4 py-2 rounded-pill bg-copper text-pine-tree text-sm font-semibold">
                  Открыть за 49 ₽
                </span>
              </button>
              <LockedCityLinks cities={locked} />
            </div>
          </div>
        )}
      </div>

      {/* Сетка на планшете и десктопе */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {free.map((c, i) => (
          <CityCard key={c.id} city={c} index={i} />
        ))}
        {opened
          ? locked.map((c, i) => (
              <CityCard key={c.id} city={c} index={FREE_COUNT + i} />
            ))
          : locked.length > 0 && (
              <div className="rounded-3xl border-2 border-dashed border-copper/30 flex flex-col items-center justify-center gap-3 text-center p-8 min-h-[300px] col-span-1 hover:border-copper/50 hover:bg-copper/5 transition">
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className="flex flex-col items-center gap-3 hover:opacity-80 transition"
                >
                  <span className="text-4xl">🏙</span>
                  <p className="text-cream font-serif text-2xl">
                    Ещё {locked.length} городов
                  </p>
                  <p className="text-brandy/70 text-sm max-w-xs">
                    Рейтинг городов по критериям переезда — в одном материале.
                  </p>
                  <span className="mt-2 px-5 py-3 rounded-pill bg-copper text-pine-tree font-semibold hover:bg-brandy transition">
                    Открыть за 49 ₽
                  </span>
                </button>
                <LockedCityLinks cities={locked} />
              </div>
            )}
      </div>

      <CountryPaymentModal
        slug={slug}
        pkg={openModal ? "country_cities" : null}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

// Обычные <a href="/city/[slug]"> на города, которые всё ещё под пейволлом —
// без цены/превью (это остаётся платным), но ссылка есть в DOM независимо от
// unlocked-состояния. До этого блока города за FREE_COUNT были видны только
// как счётчик «Ещё N городов» внутри <button> — без единого href, поэтому
// краулер не видел эти города ни на одной странице, которая должна была на
// них ссылаться (техSEO-аудит 2026-09-15). Список компактный и не задизайнен
// как полноценная карточка специально — полное превью с фото/ценой остаётся
// наградой за открытие пакета.
function LockedCityLinks({ cities }: { cities: CityWithMinRent[] }) {
  const locale = useLocale() as Locale;
  if (!cities.length) return null;
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs text-brandy/60 max-w-xs">
      {cities.map((c, i) => (
        <span key={c.id}>
          <Link
            href={`/city/${c.slug}`}
            className="underline decoration-brandy/30 underline-offset-2 hover:text-brandy hover:decoration-brandy/60 transition"
          >
            {cityName(c, locale)}
          </Link>
          {i < cities.length - 1 && <span className="text-brandy/30">,</span>}
        </span>
      ))}
    </p>
  );
}
