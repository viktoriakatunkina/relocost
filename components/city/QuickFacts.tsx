import type { City } from "@/lib/types";
import { getVisa } from "@/lib/visa";
import { currencyLabel } from "@/lib/currency";

const ICONS = {
  "Климат": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
  ),
  "Язык": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
  ),
  "Валюта": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
  ),
  "Виза для россиян": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
  ),
  "Население": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  "Индекс цен": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="10"/></svg>
  ),
} as Record<string, JSX.Element>;

export function QuickFacts({
  city,
  costIndex,
}: {
  city: City;
  costIndex?: number | null;
}) {
  const visa = getVisa(city);
  const facts = [
    {
      label: "Индекс цен",
      value: costIndex != null ? `${costIndex} (Москва 100)` : null,
    },
    { label: "Климат", value: city.climate },
    { label: "Язык", value: city.language },
    { label: "Валюта", value: city.currency ? currencyLabel(city.currency) : null },
    { label: "Виза для россиян", value: visa.label },
    { label: "Население", value: city.population },
  ].filter((f) => f.value);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {facts.map((f) => (
          <div
            key={f.label}
            className="p-5 rounded-2xl bg-surface border hairline hover:bg-surface-elevated hover:border-copper/30 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-brandy/60 text-[11px] uppercase tracking-[0.15em]">
                {f.label}
              </p>
              <span className="text-copper/70 group-hover:text-copper transition" aria-hidden>
                {ICONS[f.label]}
              </span>
            </div>
            <p className="text-cream font-medium text-sm md:text-base">{f.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
