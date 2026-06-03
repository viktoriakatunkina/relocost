"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "relocost_favorites";
const EVENT = "relocost:favorites-changed";

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

export function toggleFavorite(slug: string): string[] {
  const cur = readFavorites();
  const next = cur.includes(slug)
    ? cur.filter((s) => s !== slug)
    : [...cur, slug];
  writeFavorites(next);
  return next;
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
