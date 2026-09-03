"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "cookie_consent";

export function CookieBanner() {
  const t = useTranslations("common");
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
      aria-label={t("cookieAriaLabel")}
      // Обычный поток (не fixed) сразу под header — раньше было
      // fixed bottom-0, как и StickyBar/CountryStickyBar (freemium-CTA
      // «Открыть за N ₽»), и баннер полностью накрывал кнопку покупки на
      // каждом первом визите (P1 продуктового аудита: на мобильном 375×812
      // StickyBar был перекрыт целиком). В обычном потоке под header баннер
      // никогда не конфликтует с нижними CTA — они в разных частях экрана.
      className="relative z-40 p-4"
    >
      <div className="mx-auto max-w-2xl flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-pine-tree/95 backdrop-blur-md border border-cream/10 px-5 py-4 shadow-card">
        <p className="text-brandy/80 text-sm leading-relaxed flex-1 text-center sm:text-left">
          {t("cookieText")}{" "}
          <Link
            href="/privacy"
            className="text-cream/70 underline underline-offset-2 hover:text-cream transition-colors"
          >
            {t("cookiePrivacyLink")}
          </Link>
          {t("cookieSuffix")}.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 px-5 py-2.5 rounded-pill bg-copper text-pine-tree text-sm font-semibold hover:bg-brandy transition-colors min-h-[44px]"
        >
          {t("cookieAccept")}
        </button>
      </div>
    </div>
  );
}
