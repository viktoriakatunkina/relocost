"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export type SearchItem = {
  type: "city" | "country";
  href: string;
  /** Основное название (город или страна), RU */
  name_ru: string;
  /** Подпись справа для городов — название страны RU. Для стран не используется. */
  country_ru: string;
  /** Английское название для фаззи-поиска (turkey, georgia...). */
  name_en: string;
  flag_emoji: string | null;
};

export function SearchBar({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const router = useRouter();
  const t = useTranslations("search");
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matched = items.filter(
      (it) =>
        it.name_ru.toLowerCase().includes(q) ||
        it.country_ru.toLowerCase().includes(q) ||
        it.name_en.toLowerCase().includes(q),
    );
    // Страны — вверх списка, затем города. Внутри групп — исходный порядок.
    matched.sort((a, b) => {
      if (a.type !== b.type) return a.type === "country" ? -1 : 1;
      return 0;
    });
    return matched.slice(0, 7);
  }, [items, query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function goTo(href: string) {
    router.push(href);
  }

  function onSubmit() {
    const pick = suggestions[focusedIndex >= 0 ? focusedIndex : 0];
    if (pick) {
      goTo(pick.href);
    } else if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = suggestions[focusedIndex >= 0 ? focusedIndex : 0];
      if (pick) goTo(pick.href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Пилюля смещена влево на -ml-6, чтобы её левый внутренний паддинг (pl-6)
          «съел» сдвиг, и левый край ТЕКСТА инпута лёг ровно на вертикаль
          заголовка/подзаголовка. Иконка-лупа убрана слева, чтобы не отодвигать текст. */}
      <div className="relative -ml-6">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t("placeholder")}
          className="w-full text-left pl-6 pr-16 md:pr-36 py-5 rounded-pill focus-visible:rounded-pill bg-surface/90 backdrop-blur text-cream placeholder-brandy/60 text-lg md:text-xl border hairline focus:border-copper focus:bg-surface-elevated focus:outline-none transition shadow-card [color-scheme:dark]"
          aria-label={t("ariaInput")}
        />
        <button
          type="button"
          onClick={onSubmit}
          aria-label={t("ariaSubmit")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-copper text-pine-tree font-semibold rounded-pill px-4 md:px-6 py-3 hover:bg-brandy hover:shadow-glow active:scale-[0.97] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pale-copper focus-visible:ring-offset-2 focus-visible:ring-offset-pine-tree"
        >
          <span className="hidden md:inline">{t("submit")}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="18" y2="12" />
            <polyline points="13 7 18 12 13 17" />
          </svg>
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 -ml-6 mt-3 bg-surface-elevated border hairline rounded-3xl overflow-hidden shadow-card z-50">
          {suggestions.map((s, i) => (
            <li key={`${s.type}-${s.href}`}>
              <button
                type="button"
                onMouseEnter={() => setFocusedIndex(i)}
                onClick={() => goTo(s.href)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition ${
                  i === focusedIndex ? "bg-copper/15" : "hover:bg-cream/5"
                }`}
              >
                <span className="text-2xl shrink-0" aria-hidden>
                  {s.flag_emoji}
                </span>
                <span className="text-cream font-medium">{s.name_ru}</span>
                {s.type === "country" ? (
                  <span className="ml-auto inline-flex items-center rounded-pill border hairline px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-copper">
                    {t("labelCountry")}
                  </span>
                ) : (
                  <span className="text-brandy/55 text-sm ml-auto">
                    {s.country_ru}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
