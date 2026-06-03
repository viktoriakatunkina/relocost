"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchItem = {
  slug: string;
  name_ru: string;
  country_ru: string;
  flag_emoji: string | null;
};

export function SearchBar({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter(
        (it) =>
          it.name_ru.toLowerCase().includes(q) ||
          it.country_ru.toLowerCase().includes(q),
      )
      .slice(0, 6);
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

  function goTo(slug: string) {
    router.push(`/city/${slug}`);
  }

  function onSubmit() {
    const pick = suggestions[focusedIndex >= 0 ? focusedIndex : 0];
    if (pick) {
      goTo(pick.slug);
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
      if (pick) goTo(pick.slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-copper pointer-events-none" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
        </span>
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
          placeholder="Тбилиси, Бали, Лиссабон..."
          className="w-full pl-14 pr-16 md:pr-36 py-5 rounded-pill bg-surface/90 backdrop-blur text-cream placeholder-brandy/60 text-lg md:text-xl border hairline focus:border-copper focus:bg-surface-elevated focus:outline-none transition shadow-card [color-scheme:dark]"
          aria-label="Поиск города или страны"
        />
        <button
          type="button"
          onClick={onSubmit}
          aria-label="Найти"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-copper text-pine-tree font-semibold rounded-pill px-4 md:px-6 py-3 hover:bg-brandy hover:shadow-glow active:scale-[0.97] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pale-copper focus-visible:ring-offset-2 focus-visible:ring-offset-pine-tree"
        >
          <span className="hidden md:inline">Найти</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="18" y2="12" />
            <polyline points="13 7 18 12 13 17" />
          </svg>
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-3 bg-surface-elevated border hairline rounded-3xl overflow-hidden shadow-card z-20">
          {suggestions.map((s, i) => (
            <li key={s.slug}>
              <button
                type="button"
                onMouseEnter={() => setFocusedIndex(i)}
                onClick={() => goTo(s.slug)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition ${
                  i === focusedIndex
                    ? "bg-copper/15"
                    : "hover:bg-cream/5"
                }`}
              >
                <span className="text-2xl shrink-0" aria-hidden>
                  {s.flag_emoji}
                </span>
                <span className="text-cream font-medium">{s.name_ru}</span>
                <span className="text-brandy/55 text-sm ml-auto">
                  {s.country_ru}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
