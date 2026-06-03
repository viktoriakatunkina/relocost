"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";
import type { CityWithMinRent } from "@/lib/types";
import { CityCard } from "@/components/CityCard";

export function FavoritesClient({ cities }: { cities: CityWithMinRent[] }) {
  const favorites = useFavorites();
  const filtered = cities.filter((c) => favorites.includes(c.slug));

  return (
    <section className="max-w-6xl mx-auto px-6">
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-kombu-green/40 border border-dingley/30 p-10 text-center">
          <p className="text-brandy/80 text-lg mb-5">
            Пока нет сохраненных городов. Нажмите на сердечко на карточке
            любого города — и он появится здесь.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-pill bg-pale-copper text-pine-tree font-semibold transition hover:bg-brandy"
          >
            Открыть список городов
          </Link>
        </div>
      ) : (
        <>
          <p className="text-brandy/60 text-sm mb-6">
            {filtered.length} в избранном
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, i) => (
              <CityCard key={c.id} city={c} index={i} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
