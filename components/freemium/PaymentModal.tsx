"use client";

import { useEffect, useState } from "react";
import {
  PACKAGES,
  PACKAGE_DESCRIPTIONS,
  addUnlocked,
  type PackageType,
} from "@/lib/unlocked";

export function PaymentModal({
  slug,
  pkg,
  onClose,
}: {
  slug: string;
  pkg: PackageType | null;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pkg) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pkg, onClose]);

  if (!pkg) return null;
  const meta = PACKAGES[pkg];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, pkg, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Не удалось создать платеж. Попробуйте ещё раз.");
        setSubmitting(false);
        return;
      }

      // Demo-режим: ключи ЮKassa ещё не подключены — открываем локально.
      if (data?.demo) {
        addUnlocked(slug, pkg!);
        setSubmitting(false);
        onClose();
        alert(
          `Оплата ЮKassa скоро будет подключена. Сейчас «${meta.label}» открыт для демонстрации.`,
        );
        return;
      }

      // Боевой режим: уходим на страницу оплаты ЮKassa.
      if (data?.confirmation_url) {
        window.location.href = data.confirmation_url;
        return;
      }

      setError("ЮKassa не вернула ссылку на оплату. Попробуйте ещё раз.");
      setSubmitting(false);
    } catch {
      setError("Сеть недоступна. Проверьте подключение и попробуйте ещё раз.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-tree/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface-elevated border-cream/15 p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-copper uppercase text-xs tracking-wider mb-2">
              <span>{meta.emoji}</span>
              <span>Пакет</span>
            </div>
            <h3 className="font-serif text-2xl text-cream">{meta.label}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brandy/60 hover:text-cream text-2xl leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <p className="text-brandy/80 mb-6 leading-relaxed">
          {PACKAGE_DESCRIPTIONS[pkg]}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-brandy/70 text-sm mb-2">
              Email для отправки отчета
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-pill bg-pine-tree/60 border border-cream/10 text-cream placeholder-brandy/40 focus:border-copper focus:outline-none"
              autoFocus
            />
          </label>
          {error && (
            <p className="text-pale-copper text-sm bg-pale-copper/10 border border-pale-copper/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3.5 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy disabled:opacity-60"
          >
            {submitting ? "Переходим к оплате…" : `Оплатить ${meta.price} ₽`}
          </button>
        </form>

        <p className="text-brandy/50 text-xs mt-4 text-center">
          Оплата картой через ЮKassa. Доступ откроется сразу после оплаты.
        </p>
      </div>
    </div>
  );
}
