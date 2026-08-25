"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    // Если IntersectionObserver не поддерживается — показываем сразу
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    // Элемент уже во вьюпорте на момент монтирования (страница открыта не
    // с самого верха, быстрый скролл ботом/скриншот-инструментом до
    // срабатывания observer, и т.п.) — не ждать скролла, показать сразу.
    // Раньше контент в <Reveal> оставался opacity:0 для инструментов,
    // которые не скроллят (продуктовый аудит 2026-08-25).
    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < (window.innerHeight || document.documentElement.clientHeight) - 80 &&
      rect.bottom > 0;
    if (alreadyVisible) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Component = Tag as unknown as React.ElementType;
  return (
    <Component
      ref={ref as unknown as React.Ref<HTMLElement>}
      className={`${className} ${visible ? "fade-up" : "opacity-0"}`}
      style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
