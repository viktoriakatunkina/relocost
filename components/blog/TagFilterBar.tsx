"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Сколько самых частых тегов держим всегда на виду одной строкой — раньше
// рендерились все ~50 тегов пилюлями и блок фильтров занимал половину экрана
// (см. скриншот от Виктории 2026-09-15). Остальные уходят в выпадающий список
// с поиском, по образцу SearchBar.tsx (тот же bg-surface-elevated/rounded-3xl).
const TOP_N = 8;

export function TagFilterBar({
  tagCounts,
  activeTag,
  onChange,
}: {
  /** [тег, число статей], отсортировано по убыванию частоты */
  tagCounts: [string, number][];
  activeTag: string | null;
  onChange: (tag: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const topTags = useMemo(() => tagCounts.slice(0, TOP_N).map(([t]) => t), [tagCounts]);

  // Активный тег всегда виден пилюлей, даже если он не входит в топ-N
  // (выбран через выпадающий список) — иначе пользователь теряет из виду,
  // что фильтр вообще применён.
  const visibleTags = useMemo(() => {
    if (activeTag && !topTags.includes(activeTag)) return [activeTag, ...topTags];
    return topTags;
  }, [topTags, activeTag]);

  const hiddenCount = tagCounts.length - topTags.length;

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tagCounts;
    return tagCounts.filter(([t]) => t.toLowerCase().includes(q));
  }, [tagCounts, query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function pick(tag: string | null) {
    onChange(tag);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-10">
      <TagPill label="Все" active={activeTag === null} onClick={() => pick(null)} />
      {visibleTags.map((t) => (
        <TagPill key={t} label={t} active={activeTag === t} onClick={() => pick(t)} />
      ))}

      {hiddenCount > 0 && (
        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="listbox"
            className="flex items-center gap-1.5 px-4 py-2 rounded-pill border text-sm transition border-cream/10 text-brandy/80 hover:text-cream hover:border-copper/30"
          >
            Ещё категории
            <span className="text-brandy/50">({hiddenCount})</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open && (
            <div className="absolute top-full left-0 mt-3 w-72 bg-surface-elevated border hairline rounded-3xl shadow-card z-50 overflow-hidden">
              <div className="p-3 border-b hairline">
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск категории…"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface text-cream placeholder-brandy/50 text-sm border hairline focus:border-copper focus:outline-none [color-scheme:dark]"
                />
              </div>
              <ul role="listbox" className="max-h-72 overflow-y-auto overscroll-contain py-1.5">
                {filteredList.length === 0 ? (
                  <li className="px-4 py-3 text-brandy/50 text-sm">Ничего не найдено</li>
                ) : (
                  filteredList.map(([t, count]) => (
                    <li key={t}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={activeTag === t}
                        onClick={() => pick(t)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${
                          activeTag === t ? "bg-copper/15 text-cream" : "text-brandy/85 hover:bg-cream/5 hover:text-cream"
                        }`}
                      >
                        <span>{t}</span>
                        <span className="text-brandy/40 text-xs shrink-0">{count}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TagPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-pill border text-sm transition ${
        active
          ? "bg-copper text-pine-tree border-copper"
          : "border-cream/10 text-brandy/80 hover:text-cream hover:border-copper/30"
      }`}
    >
      {label}
    </button>
  );
}
