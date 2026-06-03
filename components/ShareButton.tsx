"use client";

import { useState } from "react";

export function ShareButton({
  title,
  text,
  variant = "default",
}: {
  title: string;
  text?: string;
  variant?: "default" | "ghost";
}) {
  const [state, setState] = useState<"idle" | "copied" | "shared">("idle");

  async function onClick() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url });
        setState("shared");
        setTimeout(() => setState("idle"), 1500);
        return;
      } catch {
        // User cancelled — пробуем clipboard fallback ниже
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 1500);
    } catch {
      // Если и clipboard не доступен — просто ничего
    }
  }

  const base =
    "inline-flex items-center gap-2 px-4 py-2.5 rounded-pill text-sm transition";
  const styles =
    variant === "ghost"
      ? "border border-cream/10 text-brandy hover:text-cream hover:border-copper/30"
      : "border border-cream/10 text-brandy hover:text-cream hover:border-copper/30";

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
      <ShareIcon />
      <span>
        {state === "copied"
          ? "Ссылка скопирована"
          : state === "shared"
          ? "Отправлено"
          : "Поделиться"}
      </span>
    </button>
  );
}

function ShareIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
