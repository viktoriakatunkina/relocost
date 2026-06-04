"use client";

import { useEffect, useRef, useState } from "react";
import {
  LANGUAGES,
  getLangMeta,
  useLang,
  writeLang,
  type LangCode,
} from "@/lib/lang";

/**
 * Переключатель языка в шапке. Пока это задел: выбор сохраняется,
 * но контент остается русским (плашку «перевод скоро» показывает
 * LanguagePending). Переводы подключим отдельной фазой.
 */
export function LanguageSwitcher() {
  const current = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = getLangMeta(current);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function pick(code: LangCode) {
    writeLang(code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Выбор языка"
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-pill text-brandy/85 hover:text-cream hover:bg-cream/5 transition text-sm"
      >
        <span className="text-base leading-none">{meta.flag}</span>
        <span className="font-medium tracking-wide">{meta.short}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-48 rounded-2xl border hairline bg-pine-tree/95 backdrop-blur-xl shadow-xl overflow-hidden z-50"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === current;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(l.code)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left transition ${
                  active
                    ? "bg-copper/15 text-cream"
                    : "text-brandy/85 hover:text-cream hover:bg-cream/5"
                }`}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="flex-1">{l.native}</span>
                {active && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
