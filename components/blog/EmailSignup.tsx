"use client";

import { useState, useEffect, useTransition } from "react";
import { submitEmailLead } from "@/app/actions/email-lead";

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
        Спасибо! Чек-лист отправим в течение 24 часов.
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

// Инлайн-блок в конце статьи блога.
export function EmailSignupInline({ source = "blog" }: { source?: string }) {
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
        Чек-лист переезда на email
      </h3>
      <p className="text-brandy/80 text-sm mb-5 leading-relaxed">
        Пошаговый план: что сделать до и после переезда, документы, финансы, первые недели на новом месте.
      </p>
      <EmailForm source={source} />
    </div>
  );
}

// Мобильный sticky-баннер — появляется после прокрутки 60%.
// Позиционируется выше существующего sticky-CTA (bottom-[72px] + z-50).
export function EmailSignupSticky({ source = "blog-sticky" }: { source?: string }) {
  const scrollPct = useScrollPercent();
  const [subscribed, setSubscribed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(LS_KEY)) setSubscribed(true);
    } catch { /* ssr-safe */ }
  }, []);

  const visible = scrollPct >= 60 && !dismissed && !subscribed;

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-[72px] inset-x-0 z-50 px-3 fade-up">
      <div className="rounded-2xl bg-surface-elevated/97 backdrop-blur-md border border-copper/30 shadow-2xl p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-cream font-medium text-sm leading-snug">
            Чек-лист переезда — бесплатно на email
          </p>
          <button
            onClick={() => {
              setDismissed(true);
              try { localStorage.setItem(LS_KEY + "_dismissed", "1"); } catch { /* ssr-safe */ }
            }}
            className="shrink-0 text-brandy/50 hover:text-brandy text-xl leading-none transition -mt-0.5"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <EmailForm
          source={source}
          compact
          onSuccess={() => setTimeout(() => setDismissed(true), 2500)}
        />
      </div>
    </div>
  );
}
