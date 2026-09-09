"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  PACKAGES,
  PACKAGE_DESCRIPTIONS,
  addUnlocked,
  setPendingPayment,
  markCheckoutStarted,
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
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
    // Email обязателен — сервер (app/api/payment/create) всё равно жёстко
    // требует его и вернёт 400, если пусто. Раньше здесь трактовалось как
    // необязательное (подпись "необязательно" + эта проверка пропускала
    // пустое значение) — пользователь оставлял поле пустым, жал "Оплатить"
    // и упирался в серверную ошибку про то же поле. 2026-09-01: приведено
    // к тому же паттерну, что уже работает в CountryPaymentModal.tsx.
    if (!email || !email.includes("@")) {
      setError("Укажите email — по нему восстановите доступ на другом устройстве.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, pkg, email, locale }),
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
        // Метка «ушли на оплату» живёт в localStorage: sessionStorage часто
        // теряется при возврате через СБП/банковское приложение, и тогда
        // цель "payment_success" не срабатывала вовсе (в Метрике было 0
        // достижений при реальных оплатах). См. VerifyOnReturn.
        markCheckoutStarted(slug, pkg!);
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

  // ВАЖНО: модалку рендерим порталом в document.body.
  //
  // Баг, найденный боем на проде 2026-09-09 (mobile, iPhone 12): клик по
  // «📊 Открыть все цены — 49 ₽» в таблице цен НЕ показывал ничего. Замер в
  // браузере: заголовок модалки y = -608, поле email y = -203, кнопка
  // «Оплатить» y = -89 — вся модалка целиком ВЫШЕ вьюпорта.
  //
  // Причина: PricesTable, Calculator и BestPlaces обёрнуты в <Reveal>, а он
  // вешает класс .fade-up с `animation: fadeUp ... both`. Анимация трансформа
  // создаёт containing block для position:fixed потомков — и `fixed inset-0`
  // считается уже не от вьюпорта, а от обёртки Reveal, которая находится
  // высоко над экраном. Плюс тот же стековый контекст роняет z-50 модалки
  // ниже корневых fixed-элементов (шапка, якорная навигация, StickyBar).
  //
  // Портал в body выносит модалку из-под любых Reveal/transform-обёрток —
  // и чинит сразу все точки вызова (StickyBar, LockedSection, Calculator,
  // MonthlyBudget, PricesTable, RouteTimeline).
  // Раскладка модалки рассчитана на мобильный (67% трафика).
  //
  // Было (до 2026-09-09): overlay `flex items-center` + карточка без
  // ограничения высоты и без прокрутки. На iPhone карточка (690-720px)
  // не влезала в вьюпорт (664px): заголовок пакета обрезался сверху, строка
  // «Оплата картой или СБП» — снизу, прокрутить было нельзя (overflow не
  // задан). А при открытии клавиатуры вьюпорт падает до ~380px, и кнопка
  // «Оплатить» уезжала на y≈430 — то есть в момент максимального намерения
  // пользователь видел поле email и НЕ видел кнопки оплаты вообще.
  //
  // Стало: на мобильном — bottom sheet во всю ширину; карточка = flex-колонка
  // с max-h 92dvh, где прокручивается только описание, а поле email + кнопка
  // «Оплатить» закреплены в нижней нескроллящейся части и видны всегда.
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-pine-tree/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md max-h-full flex flex-col rounded-t-3xl sm:rounded-2xl bg-surface-elevated border-cream/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка — не прокручивается: пользователь всегда видит, за что платит */}
        <div className="shrink-0 flex items-start justify-between gap-3 px-5 pt-5 pb-3 md:px-8 md:pt-7">
          <div>
            <div className="flex items-center gap-2 text-copper uppercase text-xs tracking-wider mb-1.5">
              <span>{meta.emoji}</span>
              <span>Пакет</span>
            </div>
            <h3 className="font-serif text-xl md:text-2xl text-cream leading-tight">
              {meta.label}
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

        {/* Прокручиваемая середина */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 md:px-8 pb-4">
          <p className="text-brandy/80 mb-4 leading-relaxed text-sm md:text-base">
            {PACKAGE_DESCRIPTIONS[pkg]}
          </p>

          {bullets.length > 0 && (
            <div className="rounded-xl bg-pine-tree/40 border border-cream/8 px-4 py-3.5 space-y-1.5">
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

          {/* Снятие страха «заплачу и ничего не получу» — ровно то, что
              закреплено в оферте (п. 6), без обещаний сверх неё. */}
          <div className="mt-3 space-y-1.5">
            <p className="text-brandy/70 text-xs leading-snug flex gap-2">
              <span className="text-copper shrink-0" aria-hidden>✓</span>
              Разовый платёж без подписки — доступ к материалу остаётся у Вас
            </p>
            <p className="text-brandy/70 text-xs leading-snug flex gap-2">
              <span className="text-copper shrink-0" aria-hidden>✓</span>
              Если доступ не откроется — вернём деньги, напишите нам
            </p>
          </div>
        </div>

        {/* Нижняя часть — всегда на экране, даже с открытой клавиатурой */}
        <form
          onSubmit={onSubmit}
          className="shrink-0 border-t border-cream/10 bg-surface-elevated px-5 md:px-8 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3"
        >
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
            {submitting ? "Переходим к оплате…" : `Оплатить ${meta.price} ₽`}
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
