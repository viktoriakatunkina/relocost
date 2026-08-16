"use client";

// Горизонтальная якорная навигация под QuickFacts.
// Sticky при скролле; на мобиле — горизонтальный скролл без стрелок.

const ALL_ANCHORS = [
  { id: "calculator", label: "Калькулятор", always: true },
  { id: "prices", label: "Цены", always: true },
  { id: "visa", label: "Виза", always: false, foreignOnly: true },
  { id: "pros-cons", label: "За и против", always: true },
  { id: "reviews", label: "Отзывы", always: true },
  { id: "faq", label: "FAQ", always: true },
] as const;

export function CityAnchorNav({ isForeign }: { isForeign: boolean }) {
  const anchors = ALL_ANCHORS.filter(
    (a) => a.always || (a.foreignOnly && isForeign),
  );

  return (
    <nav
      aria-label="Навигация по разделам"
      className="sticky top-[65px] z-30 bg-pine-tree/90 backdrop-blur-md border-b border-cream/8"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {anchors.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="shrink-0 px-4 py-1.5 rounded-pill border border-cream/20 text-brandy/75 text-sm whitespace-nowrap hover:text-cream hover:border-cream/50 hover:bg-cream/5 transition-all duration-200"
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
