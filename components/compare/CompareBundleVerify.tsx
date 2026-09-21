"use client";

// Аналог components/freemium/VerifyOnReturn.tsx, но для бандла «Бюджет на 2
// города» (см. CompareBundleCTA.tsx) — одна оплата открывает budget сразу у
// ДВУХ slug'ов. Намеренно отдельный компонент, а не расширение
// VerifyOnReturn: тот параметризован ровно одним slug/pkg, и вплетать туда
// двухгородский сценарий означало бы трогать код, от которого зависит
// разблокировка ВСЕХ обычных одиночных покупок на /city и /country.
//
// Путь 1 (быстрый) — payment_id из sessionStorage, положенный перед уходом
// на оплату (CompareBundleCTA → setPendingBundlePayment).
// Путь 2 (надежный) — по email из localStorage: /api/payment/access уже
// умеет отдавать оплаченные пакеты по city_id+email БЕЗ каких-либо
// изменений (обе строки бандла — обычные budget-покупки), поэтому просто
// вызываем его дважды, для каждого города пары.

import { useEffect, useRef } from "react";
import {
  addUnlocked,
  addManyUnlocked,
  readPendingBundlePayment,
  clearPendingBundlePayment,
  readPurchaseEmail,
  type PackageType,
} from "@/lib/unlocked";
import { reachGoal } from "@/lib/metrika";

export function CompareBundleVerify({ aSlug, bSlug }: { aSlug: string; bSlug: string }) {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    let cancelled = false;

    // --- Путь 1: payment_id из sessionStorage ---
    const pending = readPendingBundlePayment();
    const MAX_TRIES = 6;
    async function checkPayment(attempt: number): Promise<void> {
      if (cancelled || !pending) return;
      try {
        const res = await fetch(
          `/api/payment/verify?payment_id=${encodeURIComponent(pending.payment_id)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (
          data?.ok &&
          data.slug === pending.slugA &&
          data.slug2 === pending.slugB
        ) {
          addUnlocked(pending.slugA, "budget");
          addUnlocked(pending.slugB, "budget");
          clearPendingBundlePayment();
          reachGoal("bundle_payment_success");
          return;
        }
        const transient =
          data?.status === "pending" || data?.status === "waiting_for_capture";
        if (transient && attempt < MAX_TRIES) {
          setTimeout(() => checkPayment(attempt + 1), 2500);
          return;
        }
        if (data?.status === "canceled") clearPendingBundlePayment();
      } catch {
        if (attempt < MAX_TRIES) setTimeout(() => checkPayment(attempt + 1), 2500);
      }
    }
    if (
      pending &&
      ((pending.slugA === aSlug && pending.slugB === bSlug) ||
        (pending.slugA === bSlug && pending.slugB === aSlug))
    ) {
      checkPayment(0);
    }

    // --- Путь 2: восстановление по сохранённому email, по каждому городу ---
    const email = readPurchaseEmail();
    async function recoverSlug(slug: string): Promise<void> {
      if (cancelled || !email) return;
      try {
        const res = await fetch("/api/payment/access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, email }),
          cache: "no-store",
        });
        const data = await res.json();
        const pkgs: PackageType[] = Array.isArray(data?.packages) ? data.packages : [];
        if (!pkgs.length) return;
        addManyUnlocked(slug, pkgs);
      } catch {
        /* тихо: ручное восстановление доступно через RestoreAccess на /city/[slug] */
      }
    }
    recoverSlug(aSlug);
    recoverSlug(bSlug);

    return () => {
      cancelled = true;
    };
  }, [aSlug, bSlug]);

  return null;
}
