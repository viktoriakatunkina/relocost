"use client";

import { Link } from "@/i18n/navigation";
import { useFavorites } from "@/lib/favorites";
import type { CityWithMinRent } from "@/lib/types";
import { CityCard } from "@/components/CityCard";

interface Props {
  cities: CityWithMinRent[];
  dbError?: boolean;
}

export function FavoritesClient({ cities, dbError = false }: Props) {
  const favorites = useFavorites();
  const filtered = cities.filter((c) => favorites.includes(c.slug));

  // Состояние 1: localStorage пустой — нет избранного вообще
  if (favorites.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl bg-surface border hairline p-10 text-center">
          <p className="text-brandy/80 text-lg mb-5">
            Пока нет сохраненных городов. Нажмите на сердечко на карточке
            любого города — и он появится здесь.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy"
          >
            Открыть список городов
          </Link>
        </div>
      </section>
    );
  }

  // Состояние 2: slugs есть в localStorage, но данные из базы не загрузились
  if (dbError || (cities.length === 0 && favorites.length > 0)) {
    return (
      <section className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl bg-surface border hairline p-8">
          <p className="text-brandy/80 text-lg mb-2">
            Не удалось загрузить данные о городах. Попробуйте позже.
          </p>
          <p className="text-brandy/50 text-sm mb-6">
            Ваши сохраненные города ({favorites.length}) никуда не делись — они
            хранятся в браузере. Перейдите в любой из них напрямую:
          </p>
          <ul className="flex flex-wrap gap-3">
            {favorites.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/city/${slug}`}
                  className="inline-block px-4 py-2 rounded-pill border hairline bg-surface/60 text-brandy text-sm hover:border-copper transition"
                >
                  {slug}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-brandy/40 text-xs">
            Если проблема повторяется — попробуйте обновить страницу через несколько минут.
          </p>
        </div>
      </section>
    );
  }

  // Состояние 3: всё загружено, показываем карточки
  return (
    <section className="max-w-6xl mx-auto px-6">
      <p className="text-brandy/60 text-sm mb-6">
        {filtered.length} в избранном
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c, i) => (
          <CityCard key={c.id} city={c} index={i} />
        ))}
      </div>
    </section>
  );
}
