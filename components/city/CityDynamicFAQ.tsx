// Автогенерируемый FAQ для страниц городов на основе данных из prices.
// Дополняет (не заменяет) ручной CityFAQ из cities-content.ts.
// Серверный компонент — schema.org JSON-LD встроен в разметку.

import type { Price, PriceCategory } from "@/lib/types";
import { typo } from "@/lib/typography";

type FaqItem = { q: string; a: string };

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

function getPrice(
  prices: Record<PriceCategory, Price[]>,
  category: PriceCategory,
  needle: string,
): number {
  return (
    prices[category].find((p) => p.item_name_ru.includes(needle))?.price_min ??
    0
  );
}

export function buildCityFaqItems(
  cityName: string,
  isForeign: boolean,
  prices: Record<PriceCategory, Price[]>,
  monthly: number,
  t: {
    faqQ1: string; faqA1: string;
    faqQ2: string; faqA2: string;
    faqQ3: string;
    faqA3Cheap: string; faqA3Avg: string; faqA3Exp: string;
    faqQ4: string; faqA4: string;
    faqQ5: string;
    faqA5Foreign: string; faqA5Russia: string;
  },
): FaqItem[] {
  const rent = getPrice(prices, "rent", "окраине");
  const food = getPrice(prices, "food", "Продукты");
  const transport = getPrice(prices, "transport", "проездной");

  const sub = (tmpl: string) =>
    tmpl
      .replace(/\{city\}/g, cityName)
      .replace(/\{monthly\}/g, fmt(monthly || rent + food + transport))
      .replace(/\{rent\}/g, fmt(rent))
      .replace(/\{food\}/g, fmt(food))
      .replace(/\{transport\}/g, fmt(transport));

  const a5 = isForeign ? t.faqA5Foreign : t.faqA5Russia;

  // 2026-09-09: faqQ1/Q2/Q3 убраны — их ответы прямо называли точный
  // месячный бюджет и цену аренды (те же цифры, что заблюрены в Calculator/
  // MonthlyBudget и заперты под пейволлом в PricesTable), полностью убивая
  // мотивацию платить за «Все цены». Оставлены только вопросы без утечки
  // конкретных сумм — они всё ещё дают SEO-ценность (FAQPage-разметка),
  // просто не палят то, что должно быть платным.
  return [
    { q: sub(t.faqQ4), a: sub(t.faqA4) },
    { q: sub(t.faqQ5), a: sub(a5) },
  ];
}

export function CityDynamicFAQ({
  items,
  eyebrow,
  title,
}: {
  items: FaqItem[];
  eyebrow: string;
  title: string;
}) {
  if (!items.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-[120px] max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-10 text-balance">
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-3xl bg-surface border hairline overflow-hidden open:border-copper/30 open:bg-surface-elevated transition"
          >
            <summary className="cursor-pointer flex items-start justify-between gap-4 px-6 py-5 list-none min-h-[60px]">
              <span className="text-cream font-medium text-base md:text-lg text-pretty">
                {typo(item.q)}
              </span>
              <span
                className="text-copper text-2xl leading-none transition-transform group-open:rotate-45 shrink-0"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="px-6 pb-6 text-brandy/90 leading-relaxed text-pretty">
              {typo(item.a)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
