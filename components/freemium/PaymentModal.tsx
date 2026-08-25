"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  PACKAGES,
  PACKAGE_DESCRIPTIONS,
  addUnlocked,
  setPendingPayment,
  savePurchaseEmail,
  type PackageType,
} from "@/lib/unlocked";
import { reachGoal } from "@/lib/metrika";

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

  // Цель Метрики "Клик по кнопке покупки пакета" — модалка открывается
  // ТОЛЬКО как прямой результат клика по одной из кнопок "Купить"/"Открыть
  // за N ₽" (StickyBar, LockedSection, Calculator, MonthlyBudget,
  // PricesTable и т.д.) — единая точка, чтобы не дублировать вызов в
  // каждом месте вызова модалки.
  useEffect(() => {
    if (pkg) reachGoal("package_click");
  }, [pkg]);

  if (!pkg) return null;
  const meta = PACKAGES[pkg];

  const PACKAGE_BULLETS: Record<string, string[]> = {
    places: [
      "Конкретные названия, адреса и советы по каждому месту",
      "Кафе, рестораны, рынки, коворкинги и лучшие районы",
      "Проверено переехавшими — не туристические ловушки",
    ],
    budget: [
      "Полный прайс по всем статьям расходов — 40+ позиций",
      "Аренда, еда, транспорт, коммуналка, связь, медицина",
      "Реальные диапазоны цен, не усреднённые данные",
    ],
    bundle: [
      "Все цены по 40+ статьям расходов — полная картина",
      "Лучшие места с адресами — кафе, рынки, коворкинги",
      "Всё в одном платеже — не нужно выбирать по отдельности",
    ],
    country_cities: [
      "Список лучших городов страны по ключевым критериям",
      "Сравнение бюджета, климата и сложности переезда",
      "Основные факторы для выбора направления",
    ],
    country_overview: [
      "Особенности жизни в стране для переехавших",
      "Практические советы и лучшие места",
      "Актуально на 2026 год",
    ],
  };
  const bullets = PACKAGE_BULLETS[pkg] ?? [];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email && !email.includes("@")) {
      setError("Проверьте формат email — похоже, опечатка.");
      return;
    }
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
        setError(data?.error || "Не удалось создать платеж. Попробуйте еще раз.");
        setSubmitting(false);
        return;
      }

      // Demo-режим: ключи ЮKassa еще не подключены — открываем локально.
      if (data?.demo) {
        addUnlocked(slug, pkg!);
        setSubmitting(false);
        onClose();
        alert(
          `Оплата ЮKassa скоро будет подключена. Сейчас «${meta.label}» открыт для демонстрации.`,
        );
        return;
      }

      // Боевой режим: запоминаем платеж для серверной проверки после возврата
      // и уходим на страницу оплаты ЮKassa. Email кладём в localStorage —
      // по нему восстановим доступ, даже если sessionStorage потеряется.
      if (data?.confirmation_url) {
        savePurchaseEmail(email);
        if (data?.payment_id) {
          setPendingPayment({ payment_id: data.payment_id, slug, pkg: pkg! });
        }
        window.location.href = data.confirmation_url;
        return;
      }

      setError("ЮKassa не вернула ссылку на оплату. Попробуйте еще раз.");
      setSubmitting(false);
    } catch {
      setError("Сеть недоступна. Проверьте подключение и попробуйте еще раз.");
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

        <p className="text-brandy/80 mb-4 leading-relaxed">
          {PACKAGE_DESCRIPTIONS[pkg]}
        </p>

        {bullets.length > 0 && (
          <div className="mb-6 rounded-xl bg-pine-tree/40 border border-cream/8 px-4 py-3.5 space-y-1.5">
            <p className="text-brandy/60 text-xs uppercase tracking-wider mb-2">
              Что Вы получите
            </p>
            {bullets.map((b) => (
              <p key={b} className="text-brandy/90 text-sm leading-snug flex gap-2">
                <span className="text-copper shrink-0" aria-hidden>•</span>
                {b}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-brandy/70 text-sm mb-2">
              Email
              <span className="text-brandy/50 ml-1 text-xs">— необязательно, пришлём чек и ссылку восстановления</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com (необязательно)"
              className="w-full px-4 py-3 rounded-pill bg-pine-tree/60 border border-cream/10 text-cream placeholder-brandy/40 focus:border-copper focus:outline-none"
              autoFocus
            />
          </label>
          {error && (
            <p className="text-pale-copper text-sm bg-pale-copper/10 border border-pale-copper/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}
          <p className="text-xs text-cream/50 mt-2 text-center">
            Нажимая «Оплатить», Вы соглашаетесь с{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-cream/80 transition-colors">
              обработкой персональных данных
            </Link>{" "}
            и{" "}
            <Link href="/offer" className="underline underline-offset-2 hover:text-cream/80 transition-colors">
              публичной офертой
            </Link>
            .
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3.5 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy disabled:opacity-60"
          >
            {submitting ? "Переходим к оплате…" : `Оплатить ${meta.price} ₽`}
          </button>
        </form>

        <p className="text-brandy/50 text-xs mt-4 text-center">
          Оплата картой или СБП через ЮKassa. Доступ откроется сразу после
          оплаты. Если укажете email — отправим чек и ссылку для восстановления.
        </p>
      </div>
    </div>
  );
}
