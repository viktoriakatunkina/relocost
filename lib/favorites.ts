"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "relocost_favorites";
const EVENT = "relocost:favorites-changed";
export const LIMIT_EVENT = "relocost:favorites-limit";
export const MAX_FAVORITES = 20;

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    return Array.isArray(arr) ? (arr.filter((x) => typeof x === "string") as string[]) : [];
  } catch {
    return [];
  }
}

export function writeFavorites(slugs: string[]) {
  if (typeof window === "undefined") return;
  const dedup = Array.from(new Set(slugs));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dedup));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export type ToggleResult = { favorites: string[]; limitReached: boolean };

export function toggleFavorite(slug: string): ToggleResult {
  const cur = readFavorites();
  // Удаление из избранного — всегда разрешено.
  if (cur.includes(slug)) {
    const next = cur.filter((s) => s !== slug);
    writeFavorites(next);
    return { favorites: next, limitReached: false };
  }
  // Добавление — упираемся в лимит: ничего не пишем, сигналим модалке.
  if (cur.length >= MAX_FAVORITES) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(LIMIT_EVENT));
    }
    return { favorites: cur, limitReached: true };
  }
  const next = [...cur, slug];
  writeFavorites(next);
  return { favorites: next, limitReached: false };
}

export function useFavorites(): string[] {
  const [state, setState] = useState<string[]>([]);
  useEffect(() => {
    setState(readFavorites());
    function onChange() {
      setState(readFavorites());
    }
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return state;
}
