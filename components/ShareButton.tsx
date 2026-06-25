"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export function ShareButton({
  title,
  text,
  variant = "default",
}: {
  title: string;
  text?: string;
  variant?: "default" | "ghost";
}) {
  const t = useTranslations("city");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Закрытие меню по клику вне и по Esc.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const url = typeof window !== "undefined" ? window.location.href : "";

  async function onMainClick() {
    // Телефоны / браузеры с нативным «Поделиться» — системный лист, как везде.
    const canNativeShare =
      typeof navigator !== "undefined" && typeof navigator.share === "function";
    if (canNativeShare) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // Пользователь закрыл системный лист — просто выходим.
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Иначе — открываем своё меню (фолбэк).
      }
    }
    // Десктоп — выпадающее меню соцсетей + «скопировать ссылку».
    setOpen((v) => !v);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* старый браузер / http — без тоста */
    }
    setOpen(false);
  }

  const shareText = text || title;
  const targets: { key: string; label: string; href: string; icon: React.ReactNode }[] =
    [
      {
        key: "telegram",
        label: "Telegram",
        href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
        icon: <TelegramIcon />,
      },
      {
        key: "whatsapp",
        label: "WhatsApp",
        href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
        icon: <WhatsAppIcon />,
      },
      {
        key: "vk",
        label: "ВКонтакте",
        href: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
        icon: <VkIcon />,
      },
    ];

  const base =
    "inline-flex items-center gap-2 px-4 py-2.5 rounded-pill text-sm transition";
  const styles =
    variant === "ghost"
      ? "border border-cream/10 text-brandy hover:text-cream hover:border-copper/30"
      : "border border-cream/10 text-brandy hover:text-cream hover:border-copper/30";

  return (
    <div ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        onClick={onMainClick}
        aria-label={t("share")}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`${base} ${styles} ${open ? "border-copper/40 text-cream" : ""}`}
      >
        {copied ? <CheckIcon /> : <ShareIcon />}
        <span>{copied ? t("copied") : t("share")}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 w-56 rounded-2xl border border-cream/15 bg-pine-tree/95 backdrop-blur-md p-1.5 shadow-card animate-[fadeUp_0.18s_ease-out]"
        >
          <p className="px-3 pt-2 pb-1.5 text-[11px] uppercase tracking-[0.16em] text-brandy/55">
            {t("shareVia")}
          </p>
          {targets.map((target) => (
            <a
              key={target.key}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/90 hover:bg-cream/10 transition"
            >
              <span className="text-copper">{target.icon}</span>
              {target.label}
            </a>
          ))}
          <button
            type="button"
            onClick={copyLink}
            role="menuitem"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/90 hover:bg-cream/10 transition"
          >
            <span className="text-copper">
              {copied ? <CheckIcon /> : <LinkIcon />}
            </span>
            {copied ? t("copied") : t("copyLink")}
          </button>
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.94 4.6 18.7 19.9c-.24 1.08-.88 1.34-1.78.84l-4.92-3.63-2.37 2.28c-.26.26-.48.48-.99.48l.35-5 9.1-8.22c.4-.35-.09-.55-.62-.2L4.21 13.1l-4.85-1.52c-1.05-.33-1.07-1.05.22-1.55l18.96-7.3c.88-.32 1.65.2 1.4 1.47z" transform="translate(2 0)" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.13c-.25.69-1.45 1.32-1.99 1.4-.53.08-1.18.11-1.9-.12-.44-.14-1-.32-1.72-.63-3.02-1.3-4.99-4.35-5.14-4.55-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.52c.28-.3.61-.38.81-.38.2 0 .41 0 .58.01.19.01.44-.07.69.53.25.6.86 2.09.94 2.24.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.18-.32.4-.45.53-.15.15-.31.31-.13.61.18.3.8 1.32 1.71 2.14 1.18 1.05 2.17 1.37 2.47 1.52.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.4-.25.69-.15.28.1 1.77.84 2.07.99.3.15.5.22.58.35.07.12.07.72-.18 1.41z" />
    </svg>
  );
}

function VkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.16 17.34c-5.42 0-8.78-3.78-8.92-10.06h2.74c.1 4.62 2.18 6.58 3.8 6.98V7.28h2.6v3.92c1.58-.17 3.24-2 3.8-3.92h2.56c-.43 2.36-2.23 4.19-3.5 4.94 1.27.61 3.32 2.2 4.1 5.12h-2.84c-.6-1.92-2.12-3.4-4.12-3.6v3.6h-.32z" />
    </svg>
  );
}
