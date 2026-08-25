"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      // localStorage недоступен — не показываем баннер
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Уведомление об использовании cookie"
      className="fixed bottom-0 inset-x-0 z-50 p-4"
    >
      <div className="mx-auto max-w-2xl flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-pine-tree/95 backdrop-blur-md border border-cream/10 px-5 py-4 shadow-card">
        <p className="text-brandy/80 text-sm leading-relaxed flex-1 text-center sm:text-left">
          Мы используем файлы cookie для аналитики. Продолжая пользоваться
          сайтом, Вы соглашаетесь с нашей{" "}
          <Link
            href="/privacy"
            className="text-cream/70 underline underline-offset-2 hover:text-cream transition-colors"
          >
            Политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 px-5 py-2.5 rounded-pill bg-copper text-pine-tree text-sm font-semibold hover:bg-brandy transition-colors min-h-[44px]"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
