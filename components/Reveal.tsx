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

    const isInView = () => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) - 80 &&
        rect.bottom > 0
      );
    };

    // Элемент уже во вьюпорте на момент монтирования (страница открыта не
    // с самого верха, быстрый скролл ботом/скриншот-инструментом до
    // срабатывания observer, и т.п.) — не ждать скролла, показать сразу.
    // Раньше контент в <Reveal> оставался opacity:0 для инструментов,
    // которые не скроллят (продуктовый аудит 2026-08-25).
    if (isInView()) {
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

    // 2026-09-29 (продуктовый аудит): якорный переход (клик по вкладке
    // sticky-подменю города, href="#calculator") двигает scroll мгновенно,
    // одним синхронным прыжком — если элемент при этом перепрыгивает зону
    // наблюдения целиком (был ниже вьюпорта → сразу оказался выше него, ни
    // разу не пересёкшись с ним), IntersectionObserver вообще не получает
    // событие isIntersecting, и контент остаётся opacity:0 НАВСЕГДА — это
    // ловилось на калькуляторе стоимости жизни на страницах городов, самом
    // конверсионном блоке сайта. Скролл/хэш-переход — сверяем bounding rect
    // руками как страховку поверх observer, а не вместо него.
    const recheck = () => {
      if (isInView()) {
        setVisible(true);
        obs.disconnect();
        window.removeEventListener("scroll", recheck);
        window.removeEventListener("hashchange", recheck);
      }
    };
    window.addEventListener("scroll", recheck, { passive: true });
    window.addEventListener("hashchange", recheck);

    // Абсолютная страховка: что бы ни пошло не так с observer/скроллом,
    // контент не должен оставаться невидимым дольше пары секунд.
    const fallback = window.setTimeout(() => setVisible(true), 2500);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", recheck);
      window.removeEventListener("hashchange", recheck);
      window.clearTimeout(fallback);
    };
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
