"use client";

import { useState, useEffect, useTransition } from "react";
import { submitEmailLead } from "@/app/actions/email-lead";
import { Link } from "@/i18n/navigation";

const LS_KEY = "relocost_email_subscribed";

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

// 2026-10-28 (UI/UX-аудит): был мобильный sticky-баннер EmailSignupSticky —
// появлялся после прокрутки 60% на bottom-[72px], прямо НАД денежным sticky
// CTA статьи блога (app/[locale]/blog/[slug]/page.tsx, fixed bottom-0,
// рендерится БЕЗУСЛОВНО на каждой статье — ведет на /city/<slug> статьи или
// на /search). Вместе это ~140px (≈17% высоты экрана iPhone) и два конкурента
// за один клик пользователя на одном экране. Денежный CTA — прямой платный
// путь (выше приоритет), lead-magnet чек-листа ему не ровня, а раз денежный
// бар на статьях блога никогда не скрыт, второй sticky-бар был лишним всегда.
// Убрали баннер целиком (не просто вызов на странице): он был нужен только
// здесь и у него не было других вызовов (см. git history 2026-10-13). Email
// для лид-магнита по чек-листу всё еще собирается — обычным не-sticky
// блоком EmailSignupInline в потоке статьи (там же, где BlogReportCTA).
// Если понадобится sticky lead-magnet на странице БЕЗ денежного CTA —
// восстанавливать нужно с отдельной проверкой, что денежный бар на той
// странице отсутствует, а не бездумно копировать старую версию.
