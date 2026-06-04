"use client";

import { useEffect, useState } from "react";
import { getLangMeta, useLang } from "@/lib/lang";

/**
 * Тонкая плашка под шапкой: если выбран не русский язык, честно сообщаем,
 * что перевод в работе, а пока показываем русскую версию.
 * Закрывается на сессию. Это часть «задела» — уберется, когда подключим переводы.
 */
export function LanguagePending() {
  const lang = useLang();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (lang === "ru") return;
    try {
      setDismissed(sessionStorage.getItem(`relocost_lang_notice_${lang}`) === "1");
    } catch {
      setDismissed(false);
    }
  }, [lang]);

  if (lang === "ru" || dismissed) return null;

  const meta = getLangMeta(lang);

  function close() {
    try {
      sessionStorage.setItem(`relocost_lang_notice_${lang}`, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  return (
    <div className="bg-copper/15 border-b border-copper/30 text-cream">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-6 py-2.5 text-sm">
        <span className="text-base leading-none">{meta.flag}</span>
        <p className="flex-1">
          Перевод на {meta.ru} язык скоро будет. Пока показываем русскую версию
          сайта.
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Закрыть"
          className="shrink-0 p-1 rounded-pill hover:bg-cream/10 transition"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
