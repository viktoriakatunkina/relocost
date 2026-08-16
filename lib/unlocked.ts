"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Пакеты для страниц ГОРОДОВ
// ---------------------------------------------------------------------------

export type CityPackageType = "places" | "budget" | "bundle";

export const CITY_PACKAGES: Record<
  CityPackageType,
  { label: string; price: number; emoji: string; short: string }
> = {
  places: { label: "Лучшие места", short: "Места", price: 19, emoji: "📍" },
  budget: { label: "Все расходы", short: "Расходы", price: 49, emoji: "📊" },
  bundle: { label: "Расходы + Места", short: "Комбо", price: 59, emoji: "🎁" },
};

export const CITY_PACKAGE_DESCRIPTIONS: Record<CityPackageType, string> = {
  places: "Лучшие места для посещения в этом городе: кафе, рестораны, районы, рынки и коворкинги.",
  budget: "Полный список статей расходов с реальными ценами по всем категориям.",
  bundle: "Полный список статей расходов + лучшие места — всё в одном платеже.",
};

// ---------------------------------------------------------------------------
// Пакеты для страниц СТРАН
// ---------------------------------------------------------------------------

export type CountryPackageType = "country_cities" | "country_overview";

export const COUNTRY_PACKAGES: Record<
  CountryPackageType,
  { label: string; price: number; emoji: string; short: string }
> = {
  country_cities: { label: "Рейтинг городов", short: "Города", price: 49, emoji: "🏙" },
  country_overview: { label: "О стране", short: "Обзор", price: 29, emoji: "🌍" },
};

export const COUNTRY_PACKAGE_DESCRIPTIONS: Record<CountryPackageType, string> = {
  country_cities: "Список лучших городов по нескольким критериям с основными факторами переезда.",
  country_overview: "Все самое важное о стране: особенности жизни, лучшие места, практические советы.",
};

// ---------------------------------------------------------------------------
// Единый тип для обратной совместимости с PaymentModal / API
// ---------------------------------------------------------------------------

export type PackageType = CityPackageType | CountryPackageType;

/** @deprecated Используй CITY_PACKAGES или COUNTRY_PACKAGES */
export const PACKAGES: Record<
  PackageType,
  { label: string; price: number; emoji: string; short: string }
> = {
  ...CITY_PACKAGES,
  ...COUNTRY_PACKAGES,
};

/** @deprecated Используй CITY_PACKAGE_DESCRIPTIONS или COUNTRY_PACKAGE_DESCRIPTIONS */
export const PACKAGE_DESCRIPTIONS: Record<PackageType, string> = {
  ...CITY_PACKAGE_DESCRIPTIONS,
  ...COUNTRY_PACKAGE_DESCRIPTIONS,
};

// ---------------------------------------------------------------------------
// Хелперы — ГОРОДА
// ---------------------------------------------------------------------------

export function availablePackages(isForeign: boolean): CityPackageType[] {
  void isForeign; // guide-пакет убран, все три продукта одинаковы для любого города
  // "guide" убран из новой модели — все три продукта одинаковы для любого города.
  return ["places", "budget", "bundle"];
}

export function getStorageKey(slug: string) {
  return `relocost_unlocked_${slug}`;
}

const CITY_VALID: CityPackageType[] = ["places", "budget", "bundle"];
const COUNTRY_VALID: CountryPackageType[] = ["country_cities", "country_overview"];
const ALL_VALID: PackageType[] = [...CITY_VALID, ...COUNTRY_VALID];

const EVENT = "relocost:unlocked-changed";

export function readUnlocked(slug: string): CityPackageType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey(slug));
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is CityPackageType =>
      CITY_VALID.includes(x as CityPackageType),
    );
  } catch {
    return [];
  }
}

export function writeUnlocked(slug: string, packages: CityPackageType[]) {
  if (typeof window === "undefined") return;
  const dedup = Array.from(new Set(packages));
  window.localStorage.setItem(getStorageKey(slug), JSON.stringify(dedup));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { slug } }));
}

export function addUnlocked(slug: string, pkg: PackageType) {
  if (!CITY_VALID.includes(pkg as CityPackageType)) {
    // country package — delegated to country helper
    addCountryUnlocked(slug, pkg as CountryPackageType);
    return;
  }
  const cur = readUnlocked(slug);
  if (cur.includes(pkg as CityPackageType)) return;
  writeUnlocked(slug, [...cur, pkg as CityPackageType]);
}

export function addManyUnlocked(slug: string, pkgs: PackageType[]) {
  const cityPkgs = pkgs.filter((p): p is CityPackageType => CITY_VALID.includes(p as CityPackageType));
  const cur = readUnlocked(slug);
  const merged = [...cur];
  for (const p of cityPkgs) if (!merged.includes(p)) merged.push(p);
  if (merged.length !== cur.length) writeUnlocked(slug, merged);
}

const EMAIL_KEY = "relocost_purchase_email";

export function savePurchaseEmail(email: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EMAIL_KEY, email.trim());
  } catch {
    /* ignore */
  }
}

export function readPurchaseEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(EMAIL_KEY);
  } catch {
    return null;
  }
}

export function isUnlocked(unlocked: CityPackageType[], pkg: CityPackageType): boolean {
  if (unlocked.includes("bundle")) return true;
  return unlocked.includes(pkg);
}

export function lockedRemaining(
  unlocked: CityPackageType[],
  isForeign: boolean,
): CityPackageType[] {
  void isForeign;
  if (unlocked.includes("bundle")) return [];
  const all = availablePackages(isForeign).filter((p) => p !== "bundle");
  return all.filter((p) => !unlocked.includes(p));
}

export function useUnlocked(slug: string): CityPackageType[] {
  const [state, setState] = useState<CityPackageType[]>([]);
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

// ---------------------------------------------------------------------------
// Хелперы — СТРАНЫ
// ---------------------------------------------------------------------------

const COUNTRY_EVENT = "relocost:country-unlocked-changed";

export function getCountryStorageKey(slug: string) {
  return `relocost_unlocked_country_${slug}`;
}

export function readCountryUnlocked(slug: string): CountryPackageType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getCountryStorageKey(slug));
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is CountryPackageType =>
      COUNTRY_VALID.includes(x as CountryPackageType),
    );
  } catch {
    return [];
  }
}

export function writeCountryUnlocked(slug: string, packages: CountryPackageType[]) {
  if (typeof window === "undefined") return;
  const dedup = Array.from(new Set(packages));
  window.localStorage.setItem(getCountryStorageKey(slug), JSON.stringify(dedup));
  window.dispatchEvent(new CustomEvent(COUNTRY_EVENT, { detail: { slug } }));
}

export function addCountryUnlocked(slug: string, pkg: CountryPackageType) {
  const cur = readCountryUnlocked(slug);
  if (cur.includes(pkg)) return;
  writeCountryUnlocked(slug, [...cur, pkg]);
}

export function isCountryUnlocked(
  unlocked: CountryPackageType[],
  pkg: CountryPackageType,
): boolean {
  return unlocked.includes(pkg);
}

export function lockedCountryRemaining(unlocked: CountryPackageType[]): CountryPackageType[] {
  return COUNTRY_VALID.filter((p) => !unlocked.includes(p));
}

export function useCountryUnlocked(slug: string): CountryPackageType[] {
  const [state, setState] = useState<CountryPackageType[]>([]);
  useEffect(() => {
    setState(readCountryUnlocked(slug));
    function onChange(e: Event) {
      const detail = (e as CustomEvent).detail as { slug?: string } | undefined;
      if (!detail?.slug || detail.slug === slug) {
        setState(readCountryUnlocked(slug));
      }
    }
    window.addEventListener(COUNTRY_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(COUNTRY_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [slug]);
  return state;
}

// ---------------------------------------------------------------------------
// Ожидающий платеж (ЮKassa)
// ---------------------------------------------------------------------------

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
      ALL_VALID.includes(p.pkg as PackageType)
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
