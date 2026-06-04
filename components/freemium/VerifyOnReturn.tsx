"use client";

import { useEffect, useRef } from "react";
import {
  addUnlocked,
  readPendingPayment,
  clearPendingPayment,
} from "@/lib/unlocked";

/**
 * После возврата с оплаты ЮKassa проверяет платеж на сервере и только при
 * реальном succeeded разблокирует пакет. id платежа берется из sessionStorage
 * (положен перед уходом на оплату) — URL-параметрам не доверяем.
 *
 * Если платеж еще обрабатывается (pending/waiting_for_capture) — несколько
 * повторов с паузой (например, для СБП). При отмене/неуспехе — ничего не открываем.
 */
export function VerifyOnReturn({ slug }: { slug: string }) {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const pending = readPendingPayment();
    if (!pending || pending.slug !== slug) return;
    done.current = true;

    let cancelled = false;
    const MAX_TRIES = 6;

    async function check(attempt: number): Promise<void> {
      if (cancelled || !pending) return;
      try {
        const res = await fetch(
          `/api/payment/verify?payment_id=${encodeURIComponent(pending.payment_id)}`,
          { cache: "no-store" },
        );
        const data = await res.json();

        if (data?.ok && data.slug === slug) {
          addUnlocked(slug, pending.pkg);
          clearPendingPayment();
          return;
        }

        // Платеж в обработке — повторяем; иначе прекращаем.
        const transient =
          data?.status === "pending" || data?.status === "waiting_for_capture";
        if (transient && attempt < MAX_TRIES) {
          setTimeout(() => check(attempt + 1), 2500);
          return;
        }

        // Терминальный неуспех (canceled и т.п.) — убираем ожидание.
        if (data?.status === "canceled") clearPendingPayment();
      } catch {
        if (attempt < MAX_TRIES) setTimeout(() => check(attempt + 1), 2500);
      }
    }

    check(0);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return null;
}
