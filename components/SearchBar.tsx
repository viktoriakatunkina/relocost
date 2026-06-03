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
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
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
        placeholder="Выбери город или страну — Тбилиси, Грузия, Бали…"
        className="w-full px-6 py-4 rounded-pill bg-kombu-green/60 backdrop-blur text-cream placeholder-brandy/50 text-lg border border-dingley/40 focus:border-pale-copper focus:outline-none transition"
        aria-label="Поиск города или страны"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-kombu-green border border-dingley/40 rounded-2xl overflow-hidden shadow-2xl z-20">
          {suggestions.map((s, i) => (
            <li key={s.slug}>
              <button
                type="button"
                onMouseEnter={() => setFocusedIndex(i)}
                onClick={() => goTo(s.slug)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                  i === focusedIndex
                    ? "bg-dingley/30"
                    : "hover:bg-dingley/20"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {s.flag_emoji}
                </span>
                <span className="text-cream">{s.name_ru}</span>
                <span className="text-brandy/60 text-sm ml-auto">
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
