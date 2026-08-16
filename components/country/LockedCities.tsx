"use client";

import { useState } from "react";
import { CityCard } from "@/components/CityCard";
import { useCountryUnlocked, isCountryUnlocked } from "@/lib/unlocked";
import { CountryPaymentModal } from "@/components/freemium/CountryPaymentModal";
import type { CityWithMinRent } from "@/lib/types";

/** Первые FREE_COUNT городов показываем бесплатно, остальные — за paywall. */
const FREE_COUNT = 3;

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
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="w-full h-full min-h-[280px] rounded-3xl border-2 border-dashed border-copper/30 flex flex-col items-center justify-center gap-3 text-center p-6 hover:border-copper/50 hover:bg-copper/5 transition"
            >
              <span className="text-3xl">🏙</span>
              <p className="text-cream/80 text-sm font-medium">
                Ещё {locked.length} городов
              </p>
              <span className="px-4 py-2 rounded-pill bg-copper text-pine-tree text-sm font-semibold">
                Открыть за 49 ₽
              </span>
            </button>
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
              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="rounded-3xl border-2 border-dashed border-copper/30 flex flex-col items-center justify-center gap-3 text-center p-8 min-h-[300px] hover:border-copper/50 hover:bg-copper/5 transition col-span-1"
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
