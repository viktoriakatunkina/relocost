"use client";

import { useEffect, useRef } from "react";
import {
  addUnlocked,
  addManyUnlocked,
  readPendingPayment,
  clearPendingPayment,
  clearCheckoutStarted,
  hasFreshCheckout,
  readUnlocked,
  readCountryUnlocked,
  readPurchaseEmail,
  type PackageType,
} from "@/lib/unlocked";
import { reachGoal } from "@/lib/metrika";

/**
 * После возврата с оплаты ЮKassa разблокирует контент ДВУМЯ путями:
 *
 * 1) Быстрый путь — по payment_id из sessionStorage (положен перед уходом на
 *    оплату): сервер сверяет реальный статус платежа (succeeded) и открывает.
 *
 * 2) Надёжный путь — по email из localStorage. sessionStorage часто теряется
 *    при возврате через СБП / на телефоне / в новой вкладке; email durable, и
 *    по нему /api/payment/access находит оплаченные пакеты в БД и открывает их.
 *    Так доступ восстанавливается автоматически на том же устройстве.
 */
export function VerifyOnReturn({
  slug,
  kind = "city",
}: {
  slug: string;
  /** "country" — страница страны: покупки привязаны к country_slug, а не к городу. */
  kind?: "city" | "country";
}) {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    let cancelled = false;

    // --- Путь 1: payment_id из sessionStorage ---
    const pending = readPendingPayment();
    const MAX_TRIES = 6;
    async function checkPayment(attempt: number): Promise<void> {
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
          clearCheckoutStarted();
          // Цель Метрики "Успешная оплата" — именно здесь, а не на редиректе
          // с ЮKassa: /api/payment/verify уже спросил реальный статус
          // платежа (succeeded && paid) и контент реально разблокирован.
          reachGoal("payment_success");
          return;
        }
        const transient =
          data?.status === "pending" || data?.status === "waiting_for_capture";
        if (transient && attempt < MAX_TRIES) {
          setTimeout(() => checkPayment(attempt + 1), 2500);
          return;
        }
        if (data?.status === "canceled") clearPendingPayment();
      } catch {
        if (attempt < MAX_TRIES) setTimeout(() => checkPayment(attempt + 1), 2500);
      }
    }
    if (pending && pending.slug === slug) checkPayment(0);

    // --- Путь 2: восстановление по сохранённому email ---
    const email = readPurchaseEmail();
    async function recoverByEmail(): Promise<void> {
      if (cancelled || !email) return;
      try {
        const res = await fetch("/api/payment/access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, email, kind }),
          cache: "no-store",
        });
        const data = await res.json();
        const pkgs: PackageType[] = Array.isArray(data?.packages)
          ? data.packages
          : [];
        if (!pkgs.length) return;

        // Была ли разблокировка новой именно сейчас: сравниваем то, что уже
        // лежало в localStorage, с тем, что вернул сервер.
        const before: string[] =
          kind === "country" ? readCountryUnlocked(slug) : readUnlocked(slug);
        if (kind === "country") {
          for (const p of pkgs) addUnlocked(slug, p);
        } else {
          addManyUnlocked(slug, pkgs);
        }
        const opened = pkgs.some((p) => !before.includes(p));

        // Цель "payment_success" на медленном пути. Отправляем ТОЛЬКО если
        // (а) чекаут по этому городу был начат недавно (метка в localStorage)
        // и (б) доступ реально открылся впервые. Иначе цель срабатывала бы
        // на каждом визите вернувшегося покупателя.
        if (opened && hasFreshCheckout(slug)) {
          clearCheckoutStarted();
          reachGoal("payment_success");
        }
      } catch {
        /* тихо: ручное восстановление доступно через RestoreAccess */
      }
    }
    recoverByEmail();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return null;
}
