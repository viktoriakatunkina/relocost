import type { City } from "@/lib/types";

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
  "Перелет из Москвы": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
  ),
  "Население": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
} as Record<string, JSX.Element>;

export function QuickFacts({ city }: { city: City }) {
  const facts = [
    { label: "Климат", value: city.climate },
    { label: "Язык", value: city.language },
    { label: "Валюта", value: city.currency },
    { label: "Перелет из Москвы", value: city.flight_from_moscow },
    { label: "Население", value: city.population },
  ].filter((f) => f.value);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
