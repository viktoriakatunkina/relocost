"use client";

import { useEffect, useState } from "react";
import type { ChecklistVariant } from "./checklist-data";

// localStorage-логика чек-листа переезда (хук + хранилище) — по паттерну
// lib/favorites.ts (CustomEvent + storage-слушатель + SSR-guard). Статичные
// шаги/лейблы — в lib/checklist-data.ts (импортируются и серверными страницами).
export * from "./checklist-data";

function storageKey(variant: ChecklistVariant): string {
  return `relocost_checklist_${variant}`;
}
const EVENT = "relocost:checklist-changed";

export function readChecked(variant: ChecklistVariant): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(variant));
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    return Array.isArray(arr)
      ? (arr.filter((x) => typeof x === "string") as string[])
      : [];
  } catch {
    return [];
  }
}

export function writeChecked(variant: ChecklistVariant, ids: string[]) {
  if (typeof window === "undefined") return;
  const dedup = Array.from(new Set(ids));
  window.localStorage.setItem(storageKey(variant), JSON.stringify(dedup));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function toggleStep(variant: ChecklistVariant, id: string): string[] {
  const cur = readChecked(variant);
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  writeChecked(variant, next);
  return next;
}

export function useChecklist(variant: ChecklistVariant): string[] {
  const [state, setState] = useState<string[]>([]);
  useEffect(() => {
    setState(readChecked(variant));
    function onChange() {
      setState(readChecked(variant));
    }
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [variant]);
  return state;
}
