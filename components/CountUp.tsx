"use client";

import { useEffect, useRef, useState } from "react";

// Число, которое «накручивается» от 0 до целевого при попадании в зону
// видимости. Важно для SEO/no-JS: первый рендер (SSR и первый клиентский) =
// уже финальное значение, поэтому контент виден без JS и нет hydration-mismatch.
// Анимация запускается только в эффекте: сбрасываем в 0 и считаем вверх.
// Уважает prefers-reduced-motion — тогда просто остается финальное число.
export function CountUp({
  value,
  format,
  duration = 1100,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const fmt = format ?? ((n: number) => String(Math.round(n)));
  const [display, setDisplay] = useState(value); // SSR = финальное значение
  const ref = useRef<HTMLSpanElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setDisplay(value);
      done.current = true;
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || done.current) continue;
          done.current = true;
          obs.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // easeOutCubic — быстрый старт, мягкое торможение
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(value * eased);
            if (t < 1) requestAnimationFrame(tick);
            else setDisplay(value);
          };
          // стартуем с нуля для эффекта «накрутки»
          setDisplay(0);
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {fmt(display)}
    </span>
  );
}
