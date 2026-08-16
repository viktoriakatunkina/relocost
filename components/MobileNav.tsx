"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/navigation";

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  nav: readonly NavItem[];
  favoritesLabel: string;
  calculateLabel: string;
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
            <Link href="/" onClick={close} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-cormorant, Georgia, serif)",
                  fontSize: "1.5rem",
                  fontStyle: "italic",
                  color: "#E89B6E",
                  letterSpacing: "-0.01em",
                }}
              >
                Relo
              </span>
              <span
                style={{
                  fontFamily: "var(--font-manrope, system-ui, sans-serif)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#F5F0E8",
                  letterSpacing: "-0.03em",
                }}
              >
                cost
              </span>
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

          {/* Пункты навигации */}
          <nav>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1rem 1.25rem",
                gap: "0.25rem",
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
                      padding: "0.875rem 1rem",
                      borderRadius: "0.75rem",
                      color: "rgba(222,197,158,0.9)",
                      fontSize: "1.125rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "background 150ms, color 150ms",
                    }}
                    className="hover:bg-white/5 hover:text-cream active:bg-white/10"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/favorites"
                  onClick={close}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.875rem 1rem",
                    borderRadius: "0.75rem",
                    color: "rgba(222,197,158,0.9)",
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "background 150ms, color 150ms",
                  }}
                  className="hover:bg-white/5 hover:text-cream active:bg-white/10"
                >
                  {favoritesLabel}
                </Link>
              </li>

              <li style={{ paddingTop: "0.75rem", paddingBottom: "0.25rem" }}>
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
