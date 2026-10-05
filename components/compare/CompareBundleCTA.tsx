"use client";

// Бандл «Бюджет» сразу на ДВА города, со скидкой 25% от суммы двух отдельных
// покупок (см. lib/packages.ts CITY_PAIR_BUDGET_BUNDLE — цена считается от
// текущего CITY_PACKAGES.budget.price, а не захардкожена).
//
// НЕ переиспользует components/freemium/PaymentModal.tsx: тот завязан на
// единый тип PackageType (один город + один пакет), и подмешивать туда
// двухгородскую покупку означало бы трогать общий для ВСЕХ платежей на
// сайте тип/компонент ради одного нового сценария — риск для единственной
// сейчас работающей монетизации. Модалка ниже полностью самостоятельная,
// использует свой роут /api/payment/create-bundle.
//
// Показывается только пока НИ один из двух городов еще не имеет открытого
// budget (или bundle, который его перекрывает) — как только один открыт по
// отдельности, расчётная экономия больше не соответствует действительности,
// и предложение теряет смысл.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  CITY_PAIR_BUDGET_BUNDLE,
  isUnlocked,
  useUnlocked,
  addUnlocked,
  savePurchaseEmail,
  setPendingBundlePayment,
} from "@/lib/unlocked";
import { reachGoal } from "@/lib/metrika";

type CityTarget = { slug: string; name: string };

export function CompareBundleCTA({ a, b }: { a: CityTarget; b: CityTarget }) {
  const unlockedA = useUnlocked(a.slug);
  const unlockedB = useUnlocked(b.slug);
  const [open, setOpen] = useState(false);

  const aOpen = isUnlocked(unlockedA, "budget");
  const bOpen = isUnlocked(unlockedB, "budget");

  // Один из городов уже открыт (по отдельности или через комбо) — бандл
  // больше не экономит 99 ₽, предложение снимается.
  if (aOpen || bOpen) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-8 md:pt-10">
      <div className="rounded-3xl border-2 border-copper bg-copper/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 md:gap-8">
        <div className="flex-1 min-w-0 text-center md:text-left">
          <p className="text-copper text-xs uppercase tracking-wider font-semibold mb-2">
            Выгоднее вместе
          </p>
          <h3 className="font-serif text-xl md:text-2xl text-cream leading-tight mb-2 text-balance">
            Оба профиля бюджета — {CITY_PAIR_BUDGET_BUNDLE.price} ₽ вместо{" "}
            {CITY_PAIR_BUDGET_BUNDLE.fullPrice} ₽
          </h3>
          <p className="text-brandy/80 text-sm leading-relaxed">
            40+ статей расходов по {a.name} и {b.name} одним платежом —
            экономия {CITY_PAIR_BUDGET_BUNDLE.savings} ₽ по сравнению с
            покупкой каждого города отдельно.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            reachGoal("bundle_package_click");
          }}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[44px] rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
        >
          🎁 Купить оба — {CITY_PAIR_BUDGET_BUNDLE.price} ₽
        </button>
      </div>

      <CompareBundleModal a={a} b={b} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function CompareBundleModal({
  a,
  b,
  open,
  onClose,
}: {
  a: CityTarget;
  b: CityTarget;
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Укажите email — по нему восстановите доступ на другом устройстве.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/create-bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugA: a.slug, slugB: b.slug, email, locale }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Не удалось создать платеж. Попробуйте еще раз.");
        setSubmitting(false);
        return;
      }

      // Demo-режим: ключи ЮKassa еще не подключены — открываем локально.
      if (data?.demo) {
        addUnlocked(a.slug, "budget");
        addUnlocked(b.slug, "budget");
        setSubmitting(false);
        onClose();
        alert(
          `Оплата ЮKassa скоро будет подключена. Сейчас «Бюджет» открыт для ${a.name} и ${b.name} для демонстрации.`,
        );
        return;
      }

      if (data?.confirmation_url) {
        savePurchaseEmail(email);
        if (data?.payment_id) {
          setPendingBundlePayment({
            payment_id: data.payment_id,
            slugA: a.slug,
            slugB: b.slug,
          });
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

  // Портал в body — та же причина, что у PaymentModal.tsx (см. комментарий
  // там про Reveal/transform-обёртки и z-index): без него модалка может
  // оказаться вне вьюпорта или под другими fixed-элементами.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-pine-tree/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md max-h-full flex flex-col rounded-t-3xl sm:rounded-2xl bg-surface-elevated border-cream/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex items-start justify-between gap-3 px-5 pt-5 pb-3 md:px-8 md:pt-7">
          <div>
            <div className="flex items-center gap-2 text-copper uppercase text-xs tracking-wider mb-1.5">
              <span>🎁</span>
              <span>Бандл на 2 города</span>
            </div>
            <h3 className="font-serif text-xl md:text-2xl text-cream leading-tight">
              Бюджет — {a.name} и {b.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brandy/60 hover:text-cream text-3xl leading-none -mt-1 p-1"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 md:px-8 pb-4">
          <p className="text-brandy/80 mb-4 leading-relaxed text-sm md:text-base">
            Полный список расходов с реальными ценами по обоим городам сразу —
            40+ позиций на каждый: аренда, еда, транспорт, коммуналка, связь,
            медицина.
          </p>
          <div className="rounded-xl bg-pine-tree/40 border border-cream/8 px-4 py-3.5 space-y-1.5">
            <p className="text-brandy/60 text-xs uppercase tracking-wider mb-2">
              Что Вы получите
            </p>
            <p className="text-brandy/90 text-sm leading-snug flex gap-2">
              <span className="text-copper shrink-0" aria-hidden>•</span>
              Полный прайс по {a.name} — 40+ статей расходов
            </p>
            <p className="text-brandy/90 text-sm leading-snug flex gap-2">
              <span className="text-copper shrink-0" aria-hidden>•</span>
              Полный прайс по {b.name} — 40+ статей расходов
            </p>
            <p className="text-brandy/90 text-sm leading-snug flex gap-2">
              <span className="text-copper shrink-0" aria-hidden>•</span>
              Одним платежом, дешевле на {CITY_PAIR_BUDGET_BUNDLE.savings} ₽
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="shrink-0 border-t border-cream/10 bg-surface-elevated px-5 md:px-8 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3"
        >
          <div className="rounded-xl border border-copper/25 bg-pine-tree/40 px-4 py-3">
            <p className="text-brandy/55 text-[10px] uppercase tracking-wider mb-1">
              Ваш заказ
            </p>
            <p className="text-cream text-sm font-semibold leading-snug">
              🎁 Бюджет — {a.name} + {b.name}
            </p>
            <p className="text-copper text-sm font-bold mt-1.5">
              {CITY_PAIR_BUDGET_BUNDLE.price} ₽{" "}
              <span className="text-brandy/50 text-xs font-normal line-through">
                {CITY_PAIR_BUDGET_BUNDLE.fullPrice} ₽
              </span>
            </p>
          </div>
          <label className="block">
            <span className="block text-brandy/70 text-sm mb-2">
              Email <span className="text-copper">*</span>
              <span className="text-brandy/50 ml-1 text-xs">
                — по нему восстановите доступ на другом устройстве
              </span>
            </span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-pill bg-pine-tree/60 border border-cream/10 text-cream placeholder-brandy/40 focus:border-copper focus:outline-none"
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
            {submitting
              ? "Переходим к оплате…"
              : `Оплатить ${CITY_PAIR_BUDGET_BUNDLE.price} ₽`}
          </button>
          <p className="text-brandy/50 text-[11px] leading-snug text-center">
            Картой или СБП через ЮKassa · доступ откроется сразу после оплаты
          </p>
          <p className="text-[11px] text-cream/40 text-center leading-snug">
            Нажимая «Оплатить», Вы соглашаетесь с{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-cream/70 transition-colors">
              обработкой персональных данных
            </Link>{" "}
            и{" "}
            <Link href="/offer" className="underline underline-offset-2 hover:text-cream/70 transition-colors">
              офертой
            </Link>
            .
          </p>
        </form>
      </div>
    </div>,
    document.body,
  );
}
