"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { LIMIT_EVENT, MAX_FAVORITES } from "@/lib/favorites";

export function FavoritesLimitModal() {
  const [open, setOpen] = useState(false);

  // Открываемся по глобальному событию из toggleFavorite при попытке добавить 21-е.
  useEffect(() => {
    function onLimit() {
      setOpen(true);
    }
    window.addEventListener(LIMIT_EVENT, onLimit);
    return () => window.removeEventListener(LIMIT_EVENT, onLimit);
  }, []);

  // Закрытие по Esc.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fav-limit-title"
    >
      {/* Фон-затемнение — клик закрывает */}
      <button
        type="button"
        aria-label="Закрыть"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-pine-tree/70 backdrop-blur-sm"
      />

      {/* Окно */}
      <div className="relative w-full max-w-md rounded-2xl border border-cream/10 bg-pine-tree shadow-2xl px-6 py-8 text-center fade-up">
        <button
          type="button"
          aria-label="Закрыть"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-brandy hover:text-cream hover:bg-cream/5 transition"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-copper/15 text-copper flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>

        <h2 id="fav-limit-title" className="font-serif text-2xl text-cream mb-2.5">
          Добавить в избранное не получится
        </h2>
        <p className="text-brandy/85 text-sm leading-relaxed mb-6">
          Вы уже добавили {MAX_FAVORITES} направлений. Перейдите в раздел, чтобы
          ознакомиться.
        </p>

        <Link
          href="/favorites"
          onClick={() => setOpen(false)}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-pill bg-copper text-pine-tree text-sm font-semibold hover:bg-brandy transition"
        >
          Перейти в избранное
        </Link>
      </div>
    </div>
  );
}
