"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/Logo";

type IconName =
  | "city"
  | "globe"
  | "sliders"
  | "compass"
  | "star"
  | "book"
  | "check"
  | "info";

interface NavItem {
  href: string;
  label: string;
  icon?: IconName;
}

interface MobileNavProps {
  nav: readonly NavItem[];
  favoritesLabel: string;
  calculateLabel: string;
}

// Популярные города прямо в меню — та же четвёрка, что видна на мобильном
// hero главной страницы (статично, без похода в Supabase — меню рендерится
// на каждой странице, лишний живой запрос тут ни к чему).
const POPULAR_CITIES = [
  { slug: "tbilisi", name: "Тбилиси", flag: "🇬🇪" },
  { slug: "belgrade", name: "Белград", flag: "🇷🇸" },
  { slug: "dubai", name: "Дубай", flag: "🇦🇪" },
  { slug: "bali", name: "Бали", flag: "🇮🇩" },
] as const;

// Простые line-art иконки (24×24, stroke) — без эмодзи (кроме флагов
// стран, они разрешены стайлгайдом): вкус и умеренность, не отдельная
// иконка-эмодзи на каждый пункт меню.
function NavIcon({ name }: { name: IconName }) {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "city":
      return (
        <svg {...common}>
          <path d="M4 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h4v6" />
          <path d="M9 11h.01M13 11h.01M9 15h.01M13 15h.01" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...common}>
          <line x1="5" y1="4" x2="5" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="19" y1="4" x2="19" y2="20" />
          <circle cx="5" cy="9" r="2" fill="currentColor" stroke="none" />
          <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />
          <circle cx="19" cy="7" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-2 6-6 2 2-6 6-2z" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.5 6.3L12 16.9 6.3 20.1l1.5-6.3-4.8-4.3 6.4-.6L12 3z" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z" />
          <path d="M4 5.5V19a2.5 2.5 0 0 0 2.5 2.5H20" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <polyline points="8.5 12.5 11 15 15.5 9.5" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="11" x2="12" y2="16.5" />
          <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export function MobileNav({
  nav,
  favoritesLabel,
  calculateLabel,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const close = useCallback(() => {
    setVisible(false);
    // Дать время анимации завершиться перед удалением из DOM
    setTimeout(() => setOpen(false), 250);
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      close();
    } else {
      setOpen(true);
      // Небольшая задержка чтобы браузер успел добавить элемент в DOM перед анимацией
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }
  }, [open, close]);

  // Закрыть меню при нажатии Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  // Блокировать скролл при открытом меню
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Кнопка-бургер */}
      <button
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={toggle}
        className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl text-brandy hover:text-cream hover:bg-cream/10 transition"
      >
        {open ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Мобильное меню — full-screen overlay через portal (вне header, иначе backdrop-filter клипает fixed) */}
      {open && createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#1A2105",
            transition: "opacity 250ms ease, transform 250ms ease",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-8px)",
            overflowY: "auto",
          }}
          aria-label="Мобильное меню"
        >
          {/* Шапка оверлея: логотип + крестик */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              borderBottom: "1px solid rgba(245,240,232,0.08)",
            }}
          >
            {/* Тот же компонент логотипа, что и в обычном хедере (иконка-пин
                + "Relocost" одним словом) — раньше здесь была отдельная
                самодельная вёрстка "Relo"/"cost" вразнобой, не совпадавшая
                с закрытым состоянием (Виктория, скриншот 2026-08-25). */}
            <Link href="/" onClick={close} aria-label="Relocost — на главную">
              <Logo variant="horizontal" size="sm" />
            </Link>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={close}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "0.75rem",
                background: "rgba(245,240,232,0.06)",
                color: "#DEC59E",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Пункты навигации — с иконками */}
          <nav>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0.75rem 1.25rem 0",
                gap: "0.125rem",
                margin: 0,
                listStyle: "none",
              }}
            >
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 0.75rem",
                      borderRadius: "0.75rem",
                      color: "rgba(222,197,158,0.9)",
                      fontSize: "1.0625rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "background 150ms, color 150ms",
                    }}
                    className="hover:bg-white/5 hover:text-cream active:bg-white/10"
                  >
                    {item.icon && (
                      <span className="text-copper/80 shrink-0">
                        <NavIcon name={item.icon} />
                      </span>
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Популярные направления — быстрый доступ прямо из меню */}
            <div style={{ padding: "0.75rem 1.25rem 0.25rem" }}>
              <p
                style={{
                  color: "rgba(222,197,158,0.45)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 0.5rem 0.25rem",
                }}
              >
                Популярные направления
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {POPULAR_CITIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}`}
                    onClick={close}
                    className="hover:bg-white/10 active:bg-white/15"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.5rem 0.875rem",
                      borderRadius: "100px",
                      background: "rgba(245,240,232,0.06)",
                      border: "1px solid rgba(245,240,232,0.1)",
                      color: "rgba(245,240,232,0.85)",
                      fontSize: "0.9375rem",
                      textDecoration: "none",
                      transition: "background 150ms",
                    }}
                  >
                    <span aria-hidden>{c.flag}</span>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0.75rem 1.25rem 1.5rem",
                gap: "0.25rem",
                margin: 0,
                listStyle: "none",
                borderTop: "1px solid rgba(245,240,232,0.08)",
              }}
            >
              <li>
                <Link
                  href="/favorites"
                  onClick={close}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 0.75rem",
                    borderRadius: "0.75rem",
                    color: "rgba(222,197,158,0.9)",
                    fontSize: "1.0625rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "background 150ms, color 150ms",
                  }}
                  className="hover:bg-white/5 hover:text-cream active:bg-white/10"
                >
                  <span className="text-copper/80 shrink-0" aria-hidden>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2.1 4.5 5.6 4a5 5 0 0 1 6.4 2.1A5 5 0 0 1 18.4 4c3.5.5 5.2 4.2 3.6 7.7C19.5 16.4 12 21 12 21z" />
                    </svg>
                  </span>
                  {favoritesLabel}
                </Link>
              </li>

              <li style={{ paddingTop: "0.75rem" }}>
                <Link
                  href="/search"
                  onClick={close}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "1rem 1.5rem",
                    borderRadius: "100px",
                    background: "#E89B6E",
                    color: "#1A2105",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    minHeight: "3rem",
                    transition: "background 150ms",
                  }}
                  className="hover:bg-brandy active:opacity-90"
                >
                  {calculateLabel}
                </Link>
              </li>
            </ul>
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}
