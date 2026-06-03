"use client";

import { useEffect, useState } from "react";
import { readFavorites, toggleFavorite } from "@/lib/favorites";

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

  useEffect(() => {
    setActive(readFavorites().includes(slug));
    setMounted(true);
  }, [slug]);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(slug);
    setActive(next.includes(slug));
  }

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={active ? `Убрать ${cityName} из избранного` : `Добавить ${cityName} в избранное`}
        aria-pressed={active}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border text-sm transition ${
          active
            ? "bg-copper/20 border-copper text-copper"
            : "border-cream/10 text-brandy hover:text-cream hover:border-copper/30"
        }`}
      >
        <Heart filled={active} />
        <span>{active ? "В избранном" : "В избранное"}</span>
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
          ? "bg-copper/90 text-pine-tree"
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
