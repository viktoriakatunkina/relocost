"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface MobileCarouselProps {
  children: ReactNode[];
  className?: string;
}

export function MobileCarousel({ children, className = "" }: MobileCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const count = children.length;

  // Обновляем активную точку при скролле через IntersectionObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.children) as HTMLElement[];
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = items.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setCurrent(idx);
          }
        }
      },
      {
        root: track,
        threshold: 0.6,
      }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const scrollTo = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const target = items[idx];
    if (!target) return;
    const trackLeft = track.getBoundingClientRect().left;
    const itemLeft = target.getBoundingClientRect().left;
    track.scrollBy({ left: itemLeft - trackLeft, behavior: "smooth" });
  }, []);

  const prev = useCallback(() => scrollTo(Math.max(0, current - 1)), [current, scrollTo]);
  const next = useCallback(() => scrollTo(Math.min(count - 1, current + 1)), [current, count, scrollTo]);

  return (
    <div className={`relative ${className}`}>
      {/* Стрелки — только на десктопе */}
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Предыдущий"
            onClick={prev}
            disabled={current === 0}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-pine-tree/90 border hairline items-center justify-center text-cream disabled:opacity-30 hover:border-copper/60 hover:text-copper transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 5 5 12 12 19" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Следующий"
            onClick={next}
            disabled={current === count - 1}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-pine-tree/90 border hairline items-center justify-center text-cream disabled:opacity-30 hover:border-copper/60 hover:text-copper transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </>
      )}

      {/* Трек скролла */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-none pb-2 -mx-6 px-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="shrink-0 snap-start"
            style={{ width: "82vw", maxWidth: "320px" }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Точки-индикаторы */}
      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-3" role="tablist" aria-label="Слайды">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={`Слайд ${i + 1}`}
              aria-selected={i === current}
              onClick={() => scrollTo(i)}
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                borderRadius: "100px",
                background: i === current ? "#E89B6E" : "rgba(245,240,232,0.25)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 250ms ease, background 250ms ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
