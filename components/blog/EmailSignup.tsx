"use client";

import { useState, useEffect, useTransition } from "react";
import { submitEmailLead } from "@/app/actions/email-lead";
import { Link } from "@/i18n/navigation";

const LS_KEY = "relocost_email_subscribed";

// Отслеживаем процент прокрутки страницы (0–100).
function useScrollPercent() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const handler = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      if (total <= 0) { setPct(100); return; }
      setPct(Math.round((el.scrollTop / total) * 100));
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return pct;
}

// Форма подписки — общая логика
function EmailForm({
  source,
  compact = false,
  onSuccess,
}: {
  source: string;
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("source", source);
    startTransition(async () => {
      const result = await submitEmailLead(fd);
      if (result.ok) {
        setStatus("ok");
        try { localStorage.setItem(LS_KEY, "1"); } catch { /* игнорируем */ }
        onSuccess?.();
      } else {
        setStatus("error");
      }
    });
  }

  if (status === "ok") {
    return (
      <p className={compact ? "text-dingley text-sm font-medium" : "text-dingley font-medium"}>
        Спасибо! Email сохранён.
      </p>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={compact ? "flex gap-2" : "flex flex-col sm:flex-row gap-3"}
      >
        <input
          name="email"
          type="email"
          required
          placeholder="Ваш email"
          className={
            compact
              ? "flex-1 px-3 py-2.5 rounded-xl bg-surface border border-dingley/30 text-cream placeholder:text-dim focus:outline-none focus:border-copper/60 transition text-sm min-w-0"
              : "flex-1 px-4 py-3 rounded-xl bg-surface-elevated border border-dingley/30 text-cream placeholder:text-dim focus:outline-none focus:border-copper/60 transition text-sm"
          }
        />
        <button
          type="submit"
          disabled={isPending}
          className={
            compact
              ? "shrink-0 px-4 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition disabled:opacity-50 min-h-[44px]"
              : "px-6 py-3 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition disabled:opacity-50 whitespace-nowrap min-h-[44px]"
          }
        >
          {isPending ? "Отправляем..." : "Получить"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">
          Что-то пошло не так — попробуйте ещё раз.
        </p>
      )}
    </>
  );
}

// Инлайн-блок — в конце статьи блога, а также (с кастомным заголовком/
// описанием под конкретный город или страну) на страницах /city и /country.
//
// 2026-10-13 (маркетинговый аудит): раньше блок обещал «пришлём чек-лист на
// email», хотя реальной отправки писем в кодовой базе нет (submitEmailLead
// только пишет в email_leads) — чек-лист физически никогда не приходил.
// Честный фикс: чек-лист уже есть на сайте бесплатно (/checklist) — даём на
// него прямую ссылку как основной CTA, а email оставляем отдельным,
// не привязанным к конкретному обещанию, опциональным действием.
export function EmailSignupInline({
  source = "blog",
  title = "Чек-лист переезда — бесплатно",
  description = "Пошаговый план: что сделать до и после переезда, документы, финансы, первые недели на новом месте.",
}: {
  source?: string;
  title?: string;
  description?: string;
}) {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(LS_KEY)) setSubscribed(true);
    } catch { /* ssr-safe */ }
  }, []);

  if (subscribed) return null;

  return (
    <div className="mt-10 rounded-3xl border border-dingley/35 bg-surface p-6 md:p-8">
      <p className="text-brandy/60 text-xs uppercase tracking-wider mb-2">
        Бесплатно
      </p>
      <h3 className="font-serif text-2xl text-cream mb-2">
        {title}
      </h3>
      <p className="text-brandy/80 text-sm mb-5 leading-relaxed">
        {description}
      </p>
      <Link
        href="/checklist"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-copper text-pine-tree font-bold text-sm hover:bg-pale-copper hover:shadow-glow transition whitespace-nowrap"
      >
        Открыть чек-лист
        <span aria-hidden>→</span>
      </Link>
      <p className="mt-5 mb-2 text-xs text-brandy/60">
        Или оставьте email, если хотите узнавать о новых материалах по теме переезда:
      </p>
      <EmailForm source={source} />
    </div>
  );
}

// Мобильный sticky-баннер — появляется после прокрутки 60%.
// Позиционируется выше существующего sticky-CTA (bottom-[72px] + z-50).
//
// 2026-10-13 (маркетинговый аудит): раньше здесь была форма email с текстом
// «пришлём чек-лист на email» — реальной отправки нет (см. EmailSignupInline
// выше), а в тесном мобильном баннере нет места честно развести «уже готовый
// чек-лист» и «опциональная подписка на email» на два равноценных действия.
// Чек-лист и так бесплатен и уже открыт на сайте (/checklist) — здесь прямая
// ссылка на него честнее и быстрее для пользователя, чем форма без
// гарантированного результата. source оставлен в сигнатуре для обратной
// совместимости вызовов, хотя сейчас не используется (email тут не собираем).
export function EmailSignupSticky() {
  const scrollPct = useScrollPercent();
  const [dismissed, setDismissed] = useState(false);

  const visible = scrollPct >= 60 && !dismissed;

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-[72px] inset-x-0 z-50 px-3 fade-up">
      <div className="rounded-2xl bg-surface-elevated/97 backdrop-blur-md border border-copper/30 shadow-2xl p-4 flex items-center gap-3">
        <p className="flex-1 text-cream font-medium text-sm leading-snug">
          Чек-лист переезда — бесплатно на сайте
        </p>
        <Link
          href="/checklist"
          onClick={() => setDismissed(true)}
          className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition whitespace-nowrap"
        >
          Открыть
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-brandy/50 hover:text-brandy text-xl leading-none transition"
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
    </div>
  );
}
