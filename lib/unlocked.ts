"use client";

import { useEffect, useState } from "react";

// Чистые данные/типы/хелперы (цены, лейблы, isUnlocked, lockedRemaining и
// т.п.) вынесены в lib/packages.ts — файл без "use client", безопасный для
// импорта из серверных компонентов. Здесь — реэкспорт для обратной
// совместимости со всеми клиентскими компонентами, которые уже импортируют
// их из "@/lib/unlocked", плюс хуки/localStorage, которым нужен клиент.
export {
  CITY_PACKAGES,
  CITY_PACKAGE_DESCRIPTIONS,
  COUNTRY_PACKAGES,
  COUNTRY_PACKAGE_DESCRIPTIONS,
  PACKAGES,
  PACKAGE_DESCRIPTIONS,
  CITY_COMPARISON_FEATURES,
  availablePackages,
  isUnlocked,
  lockedRemaining,
  isCountryUnlocked,
  lockedCountryRemaining,
} from "./packages";
export type {
  CityPackageType,
  CountryPackageType,
  PackageType,
  ComparisonFeature,
} from "./packages";

import {
  CITY_VALID,
  COUNTRY_VALID,
  ALL_VALID,
  type CityPackageType,
  type CountryPackageType,
  type PackageType,
} from "./packages";

export function getStorageKey(slug: string) {
  return `relocost_unlocked_${slug}`;
}

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

// ---------------------------------------------------------------------------
// Метка «ушли на оплату» — durable-дубль pending-платежа
// ---------------------------------------------------------------------------
//
// Зачем: setPendingPayment пишет в sessionStorage, а он теряется, когда
// возврат с ЮKassa приходит через СБП / банковское приложение / новую вкладку.
// В этом случае разблокировка всё равно происходит — по email через
// /api/payment/access — но цель Метрики "payment_success" НЕ отправлялась,
// потому что висела только на быстром пути с payment_id. Результат: в Метрике
// 0 достижений цели «Успешная оплата» при реальных оплатах в БД (проверено
// 2026-09-09: 3 оплаченных заказа за 30 дней против 0 достижений цели).
//
// Метка живёт в localStorage и ограничена по времени, чтобы цель не
// срабатывала на обычном визите покупателя спустя недели.

const CHECKOUT_KEY = "relocost_checkout_started";
/** Окно, внутри которого возврат считаем возвратом с оплаты. */
const CHECKOUT_TTL_MS = 3 * 60 * 60 * 1000;

export function markCheckoutStarted(slug: string, pkg: PackageType) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CHECKOUT_KEY,
      JSON.stringify({ slug, pkg, ts: Date.now() }),
    );
  } catch {
    /* ignore */
  }
}

/** Был ли для этого slug недавно начат чекаут (и не истёк ли он). */
export function hasFreshCheckout(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_KEY);
    if (!raw) return false;
    const p = JSON.parse(raw) as { slug?: string; ts?: number };
    if (p?.slug !== slug || typeof p.ts !== "number") return false;
    return Date.now() - p.ts < CHECKOUT_TTL_MS;
  } catch {
    return false;
  }
}

export function clearCheckoutStarted() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHECKOUT_KEY);
  } catch {
    /* ignore */
  }
}
