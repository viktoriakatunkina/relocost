"use client";

import { useMemo, useState } from "react";
import { badgeImageSrc, buildBadgeSnippet } from "@/lib/badge";

export type EmbedCity = {
  slug: string;
  name_ru: string;
  country_ru: string;
  flag_emoji: string | null;
  is_popular: boolean;
};

const DEFAULT_COUNT = 20;

// Поиск + список городов с готовым кодом бейджа для копирования.
// Без запроса — топ-20 популярных городов, с запросом — поиск по всем
// переданным городам (name_ru/country_ru, регистронезависимо).
export function EmbedCityPicker({ cities }: { cities: EmbedCity[] }) {
  const [query, setQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const popular = useMemo(() => {
    const pop = cities.filter((c) => c.is_popular);
    const base = pop.length >= DEFAULT_COUNT ? pop : cities;
    return base.slice(0, DEFAULT_COUNT);
  }, [cities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return popular;
    return cities
      .filter(
        (c) =>
          c.name_ru.toLowerCase().includes(q) ||
          c.country_ru.toLowerCase().includes(q),
      )
      .slice(0, 40);
  }, [cities, query, popular]);

  async function copy(slug: string, cityName: string) {
    try {
      await navigator.clipboard.writeText(buildBadgeSnippet(slug, cityName));
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 2000);
    } catch {
      // clipboard недоступен (например, без HTTPS в dev) — молча игнорируем.
    }
  }

  return (
    <div>
      <div className="relative mb-6">
        <span
          className="absolute left-5 top-1/2 -translate-y-1/2 text-copper pointer-events-none"
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти город — например, Тбилиси или Бали"
          className="w-full pl-12 pr-5 py-4 rounded-pill bg-surface/90 backdrop-blur text-cream placeholder-brandy/50 text-base border hairline focus:border-copper focus:outline-none transition [color-scheme:dark]"
          aria-label="Поиск города для бейджа"
        />
      </div>

      {!query.trim() && (
        <p className="text-brandy/55 text-xs uppercase tracking-[0.15em] mb-4">
          Популярные города · {cities.length} всего доступно
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-brandy/70 py-10 text-center">
          Ничего не нашлось. Проверьте написание — у нас {cities.length}{" "}
          городов.
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {filtered.map((c) => (
            <li
              key={c.slug}
              className="rounded-2xl bg-surface border hairline p-4 flex items-center gap-3 hover:border-copper/30 transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={badgeImageSrc(c.slug)}
                alt={`Бейдж стоимости жизни в ${c.name_ru}`}
                width={120}
                height={30}
                loading="lazy"
                className="rounded-md shrink-0"
                style={{ width: 120, height: 30 }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-cream font-medium text-sm truncate">
                  <span aria-hidden>{c.flag_emoji}</span> {c.name_ru}
                </p>
                <p className="text-brandy/55 text-xs truncate">{c.country_ru}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(c.slug, c.name_ru)}
                className="shrink-0 text-xs px-3 py-2 rounded-pill bg-copper/15 text-copper hover:bg-copper/25 transition whitespace-nowrap min-h-[36px]"
              >
                {copiedSlug === c.slug ? "Скопировано ✓" : "Скопировать код"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
