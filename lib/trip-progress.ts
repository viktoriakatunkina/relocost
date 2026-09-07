"use client";

import { useEffect, useState } from "react";

// localStorage-прогресс фичи «Маршруты на день» — по паттерну lib/checklist.ts
// (CustomEvent + storage-слушатель + SSR-guard). Контент маршрутов — в
// lib/city-routes.ts, здесь только состояние «какие точки отмечены».
//
// Ключ: relocost_trip_${citySlug}. Значение: массив отметок вида
// "routeSlug:stopIndex" (например "gourmet:2") — индекс уникален в пределах
// города, так как маршруты одного города имеют разные slug.

function storageKey(citySlug: string): string {
  return `relocost_trip_${citySlug}`;
}
const EVENT = "relocost:trip-changed";

export function stopId(routeSlug: string, stopIndex: number): string {
  return `${routeSlug}:${stopIndex}`;
}

export function readChecked(citySlug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(citySlug));
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    return Array.isArray(arr)
      ? (arr.filter((x) => typeof x === "string") as string[])
      : [];
  } catch {
    return [];
  }
}

export function writeChecked(citySlug: string, ids: string[]) {
  if (typeof window === "undefined") return;
  const dedup = Array.from(new Set(ids));
  window.localStorage.setItem(storageKey(citySlug), JSON.stringify(dedup));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { citySlug } }));
}

export function toggleStop(
  citySlug: string,
  routeSlug: string,
  stopIndex: number,
): string[] {
  const id = stopId(routeSlug, stopIndex);
  const cur = readChecked(citySlug);
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  writeChecked(citySlug, next);
  return next;
}

export function useTripProgress(citySlug: string): string[] {
  const [state, setState] = useState<string[]>([]);
  useEffect(() => {
    setState(readChecked(citySlug));
    function onChange(e: Event) {
      const detail = (e as CustomEvent).detail as { citySlug?: string } | undefined;
      if (!detail?.citySlug || detail.citySlug === citySlug) {
        setState(readChecked(citySlug));
      }
    }
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [citySlug]);
  return state;
}

/** Сколько точек конкретного маршрута отмечено выполненными. */
export function routeStopsChecked(checked: string[], routeSlug: string): number {
  const prefix = `${routeSlug}:`;
  return checked.filter((id) => id.startsWith(prefix)).length;
}

export function isRouteComplete(
  checked: string[],
  routeSlug: string,
  totalStops: number,
): boolean {
  return totalStops > 0 && routeStopsChecked(checked, routeSlug) >= totalStops;
}
