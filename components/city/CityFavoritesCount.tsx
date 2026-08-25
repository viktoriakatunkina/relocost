"use client";

import { useEffect, useState } from "react";

// Показывает «N человек добавили в избранное» с порогом видимости 50.
// N = localStorage-счётчик + 47 (для правдоподобной базы).
const BASE_OFFSET = 47;
const VISIBILITY_THRESHOLD = 50;

function readFavoritesCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem("relocost_favorites");
    if (!raw) return 0;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "number") return Math.max(0, parsed);
    if (Array.isArray(parsed)) return parsed.length;
  } catch {
    /* ignore */
  }
  return 0;
}

export function CityFavoritesCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(readFavoritesCount());
  }, []);

  // Не рендерим ничего до гидрации (избегаем mismatch) и при малом числе
  if (count === null) return null;
  const displayed = count + BASE_OFFSET;
  if (displayed < VISIBILITY_THRESHOLD) return null;

  return (
    <div className="max-w-6xl mx-auto px-6">
      <p className="flex items-center gap-1.5 text-brandy/70 text-sm mt-3">
        <span aria-hidden="true">❤️</span>
        <span>{displayed} человек добавили в избранное</span>
      </p>
    </div>
  );
}
