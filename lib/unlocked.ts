"use client";

import { useEffect, useState } from "react";

export type PackageType = "places" | "guide" | "budget" | "bundle";

export const PACKAGES: Record<
  PackageType,
  { label: string; price: number; emoji: string; short: string }
> = {
  places: { label: "Лучшие места", short: "Места", price: 79, emoji: "📍" },
  guide: { label: "Гайд по жизни", short: "Гайд", price: 149, emoji: "🧭" },
  budget: { label: "Точный бюджет", short: "Бюджет", price: 199, emoji: "📊" },
  bundle: { label: "Все вместе", short: "Все", price: 299, emoji: "🎁" },
};

export const PACKAGE_DESCRIPTIONS: Record<PackageType, string> = {
  places:
    "Топ кафе, рестораны, районы, рынки и коворкинги, которые рекомендуют переехавшие.",
  guide:
    "Менталитет, документы, банки, медицина, язык и расширенные отзывы.",
  budget:
    "Точные цифры по всем категориям + сравнение с другим городом + советы по экономии.",
  bundle:
    "Все доступные пакеты для этого города одним платежом — самый выгодный вариант.",
};

export function availablePackages(isForeign: boolean): PackageType[] {
  return isForeign
    ? ["places", "guide", "budget", "bundle"]
    : ["places", "budget", "bundle"];
}

export function getStorageKey(slug: string) {
  return `relocost_unlocked_${slug}`;
}

const EVENT = "relocost:unlocked-changed";
const VALID: PackageType[] = ["places", "guide", "budget", "bundle"];

export function readUnlocked(slug: string): PackageType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey(slug));
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is PackageType =>
      VALID.includes(x as PackageType),
    );
  } catch {
    return [];
  }
}

export function writeUnlocked(slug: string, packages: PackageType[]) {
  if (typeof window === "undefined") return;
  const dedup = Array.from(new Set(packages));
  window.localStorage.setItem(getStorageKey(slug), JSON.stringify(dedup));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { slug } }));
}

export function addUnlocked(slug: string, pkg: PackageType) {
  const cur = readUnlocked(slug);
  if (cur.includes(pkg)) return;
  writeUnlocked(slug, [...cur, pkg]);
}

export function isUnlocked(unlocked: PackageType[], pkg: PackageType): boolean {
  if (unlocked.includes("bundle")) return true;
  return unlocked.includes(pkg);
}

export function lockedRemaining(
  unlocked: PackageType[],
  isForeign: boolean,
): PackageType[] {
  if (unlocked.includes("bundle")) return [];
  const all = availablePackages(isForeign).filter((p) => p !== "bundle");
  return all.filter((p) => !unlocked.includes(p));
}

export function useUnlocked(slug: string): PackageType[] {
  const [state, setState] = useState<PackageType[]>([]);
  useEffect(() => {
    setState(readUnlocked(slug));
    function onChange(e: Event) {
      const detail = (e as CustomEvent).detail as { slug?: string } | undefined;
      if (!detail?.slug || detail.slug === slug) {
        setState(readUnlocked(slug));
      }
    }
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [slug]);
  return state;
}

// --- Ожидающий платеж (для серверной проверки после возврата с ЮKassa) ---
//
// Перед уходом на оплату сохраняем id платежа в sessionStorage. После возврата
// VerifyOnReturn сверяет его на сервере (реально ли succeeded) и только тогда
// разблокирует контент. URL-параметрам больше НЕ доверяем.

const PENDING_KEY = "relocost_pending_payment";

export type PendingPayment = {
  payment_id: string;
  slug: string;
  pkg: PackageType;
};

export function setPendingPayment(p: PendingPayment) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function readPendingPayment(): PendingPayment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<PendingPayment>;
    if (
      p &&
      typeof p.payment_id === "string" &&
      typeof p.slug === "string" &&
      VALID.includes(p.pkg as PackageType)
    ) {
      return p as PendingPayment;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function clearPendingPayment() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}
