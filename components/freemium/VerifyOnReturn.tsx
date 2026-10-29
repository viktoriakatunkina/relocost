"use client";

import { useEffect, useRef, useState } from "react";
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
  savePurchaseEmail,
  type PackageType,
} from "@/lib/unlocked";
import { reachGoal } from "@/lib/metrika";

/**
 * Разблокирует оплаченный контент. 0) Ссылка из письма (?access=…) — см. ниже.
 *
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
  // 2026-10-28 (аудит воронки): раньше компонент всегда return null — после
  // возврата с ЮKassa человек до 15 сек (6 попыток × 2.5с) смотрел на ту же
  // заблюренную страницу без единого сигнала, что что-то вообще происходит.
  // В момент максимальной тревоги «списали ли деньги» это реальный риск ухода
  // со страницы до того, как контент откроется. Статус — только для пути 1
  // (payment_id), это единственный момент, где пользователь только что САМ
  // инициировал оплату и ждёт прямо сейчас; пути 0/2 — фоновое тихое
  // восстановление доступа на произвольном визите, там баннер неуместен.
  const [status, setStatus] = useState<
    "idle" | "checking" | "success" | "timeout" | "canceled"
  >("idle");
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          if (!cancelled) {
            setStatus("success");
            dismissTimer.current = setTimeout(() => {
              if (!cancelled) setStatus("idle");
            }, 4000);
          }
          return;
        }
        const transient =
          data?.status === "pending" || data?.status === "waiting_for_capture";
        if (transient && attempt < MAX_TRIES) {
          setTimeout(() => checkPayment(attempt + 1), 2500);
          return;
        }
        if (data?.status === "canceled") {
          clearPendingPayment();
          // Цель "payment_canceled" — слепая зона воронки (2026-10-29): эта
          // ветка уже отличала canceled от timeout визуально, но ни одна
          // из них не слалась в Метрику.
          reachGoal("payment_canceled");
          if (!cancelled) {
            setStatus("canceled");
            dismissTimer.current = setTimeout(() => {
              if (!cancelled) setStatus("idle");
            }, 5000);
          }
        } else if (!cancelled) {
          reachGoal("payment_timeout");
          setStatus("timeout");
          dismissTimer.current = setTimeout(() => {
            if (!cancelled) setStatus("idle");
          }, 8000);
        }
      } catch {
        if (attempt < MAX_TRIES) {
          setTimeout(() => checkPayment(attempt + 1), 2500);
        } else if (!cancelled) {
          reachGoal("payment_timeout");
          setStatus("timeout");
          dismissTimer.current = setTimeout(() => {
            if (!cancelled) setStatus("idle");
          }, 8000);
        }
      }
    }
    if (pending && pending.slug === slug) {
      setStatus("checking");
      checkPayment(0);
    }

    // --- Путь 0: ссылка из письма после оплаты (?access=…) ---
    // Работает на любом устройстве: токен подписан сервером
    // (lib/access-link.ts). После входа сохраняем email, чтобы на этом
    // устройстве дальше срабатывал путь 2, и убираем токен из адреса —
    // чтобы его не скопировали вместе со ссылкой на страницу.
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access");
    if (accessToken) {
      params.delete("access");
      const qs = params.toString();
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash,
      );
      fetch("/api/payment/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token: accessToken, kind }),
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          const pkgs: PackageType[] = Array.isArray(data?.packages)
            ? data.packages
            : [];
          if (!pkgs.length) return;
          if (kind === "country") {
            for (const p of pkgs) addUnlocked(slug, p);
          } else {
            addManyUnlocked(slug, pkgs);
          }
          if (typeof data.email === "string") savePurchaseEmail(data.email);
        })
        .catch(() => {
          /* тихо: ручное восстановление доступно через RestoreAccess */
        });
    }

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
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [slug]);

  if (status === "idle") return null;

  const copy: Record<Exclude<typeof status, "idle">, string> = {
    checking: "Проверяем оплату…",
    success: "Оплата прошла — контент открыт",
    timeout:
      "Оплата обрабатывается дольше обычного. Если деньги списались — доступ откроется автоматически в течение пары минут, ссылку также пришлём на почту.",
    canceled: "Оплата отменена",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-3 inset-x-3 z-50 flex justify-center md:top-4"
    >
      <div className="max-w-md rounded-xl bg-surface-elevated/95 backdrop-blur-md border border-copper/25 shadow-2xl px-4 py-2.5 flex items-center gap-2.5 text-sm text-cream">
        {status === "checking" && (
          <span
            className="size-3.5 shrink-0 rounded-full border-2 border-copper/40 border-t-copper animate-spin"
            aria-hidden
          />
        )}
        {status === "success" && (
          <span className="shrink-0 text-copper" aria-hidden>
            ✓
          </span>
        )}
        <span>{copy[status]}</span>
      </div>
    </div>
  );
}
