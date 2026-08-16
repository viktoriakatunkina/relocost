import type { AnchorItem } from "@/lib/anchor-prices";
import { fmtAnchorPrice } from "@/lib/anchor-prices";

// Товары-якоря — быстрый визуальный ориентир цен на странице города.
// Конкретика вместо абстрактного индекса: сколько стоит кофе, молоко, хлеб,
// бензин, билет в кино. Паттерн NerdWallet / Numbeo «everyday costs».

const ICONS: Record<string, JSX.Element> = {
  coffee: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  milk: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8"/><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"/>
    </svg>
  ),
  bread: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.535A7.5 7.5 0 0 1 10.5 4a7.5 7.5 0 0 1 7.5 7.535V20H3z"/><path d="M18 20a2 2 0 0 0 2-2v-6.5a5 5 0 0 0-2-4"/>
    </svg>
  ),
  petrol: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14"/><line x1="2" y1="22" x2="14" y2="22"/>
      <path d="M15 4h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2V6a4 4 0 0 0-4-4h-2"/>
      <line x1="7" y1="10" x2="9" y2="10"/>
    </svg>
  ),
  cinema: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
      <polyline points="17 2 12 7 7 2"/>
    </svg>
  ),
  transit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6"/>
      <line x1="12" y1="3" x2="12" y2="11"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
    </svg>
  ),
};

export function AnchorPrices({ items }: { items: AnchorItem[] }) {
  const visible = items.filter((i) => i.price !== null);
  if (visible.length < 2) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-6 overflow-hidden md:overflow-visible">
      <p className="text-brandy/45 text-[11px] uppercase tracking-[0.15em] mb-3">
        Цены на продукты и услуги
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
        {visible.map((item) => (
          <div
            key={item.key}
            className="shrink-0 snap-start flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border hairline"
          >
            <span className="text-copper/75 shrink-0" aria-hidden>
              {ICONS[item.key]}
            </span>
            <div className="min-w-0">
              <p className="text-brandy/55 text-[11px] leading-none mb-0.5">
                {item.label}
                <span className="text-brandy/35"> · {item.sublabel}</span>
              </p>
              <p className="text-cream font-medium text-sm tabular-nums leading-tight">
                {fmtAnchorPrice(item.price!)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
