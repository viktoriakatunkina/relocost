"use client";

import { useEffect, useState } from "react";
import { readFavorites, toggleFavorite } from "@/lib/favorites";

const EVENT = "relocost:favorites-changed";

export function FavoriteButton({
  slug,
  cityName,
  variant = "card",
}: {
  slug: string;
  cityName: string;
  variant?: "card" | "hero";
}) {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Читаем актуальное состояние при монтировании и подписываемся на изменения,
  // чтобы все карточки оставались синхронными: добавление/удаление в любом месте
  // (другая карточка, hero города, страница «Избранное», другая вкладка) сразу
  // отражается на этой кнопке. Это чинит рассинхрон, когда город уже в избранном,
  // но сердечко на карточке оставалось контурным.
  useEffect(() => {
    function sync() {
      setActive(readFavorites().includes(slug));
    }
    sync();
    setMounted(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const { favorites } = toggleFavorite(slug);
    setActive(favorites.includes(slug));
  }

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={active ? `Убрать ${cityName} из избранного` : `Добавить ${cityName} в избранное`}
        aria-pressed={active}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border text-sm transition ${
          mounted && active
            ? "bg-red-500/15 border-red-500/50 text-red-500"
            : "border-cream/10 text-brandy hover:text-cream hover:border-copper/30"
        }`}
      >
        <Heart filled={mounted && active} />
        <span>{mounted && active ? "В избранном" : "В избранное"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? `Убрать ${cityName} из избранного` : `Добавить ${cityName} в избранное`}
      aria-pressed={active}
      className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur flex items-center justify-center transition z-10 ${
        mounted && active
          ? "bg-black/40 text-red-500"
          : "bg-pine-tree/50 text-brandy hover:bg-pine-tree/70 hover:text-copper"
      }`}
    >
      <Heart filled={mounted && active} small />
    </button>
  );
}

function Heart({ filled, small }: { filled: boolean; small?: boolean }) {
  const size = small ? 16 : 18;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
