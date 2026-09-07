// Автогенерируемый FAQ для страниц стран (из реальных данных о городах).
//
// JSON-LD здесь НЕ рендерится: на странице страны есть вторая FAQ-секция
// (CountryFAQ), а Google учитывает только один блок FAQPage на страницу.
// Разметку собирает страница один раз через <FaqSchema> из объединённого
// списка вопросов обеих секций.

import type { CityWithMinRent } from "@/lib/types";
import type { FaqItem } from "@/components/FaqSchema";
import { typo } from "@/lib/typography";

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

export type CountryDynamicFaqStrings = {
  dynFaqQ1: string; dynFaqA1: string;
  dynFaqQ2: string; dynFaqA2: string;
  dynFaqQ3: string; dynFaqA3: string;
  dynFaqQ4: string; dynFaqA4: string;
  dynFaqQ5: string; dynFaqA5: string;
};

export function buildCountryDynamicFaqItems(
  countryName: string,
  cities: CityWithMinRent[],
  t: CountryDynamicFaqStrings,
): FaqItem[] {
  if (!cities.length) return [];

  // Находим город с наименьшим min_rent как «самый дешёвый».
  const cheapest = cities.reduce((prev, cur) =>
    cur.min_rent > 0 && (prev.min_rent === 0 || cur.min_rent < prev.min_rent)
      ? cur
      : prev,
  );

  const sub = (tmpl: string) =>
    tmpl
      .replace(/\{country\}/g, countryName)
      .replace(/\{count\}/g, String(cities.length))
      .replace(/\{cheapestCity\}/g, cheapest.name_ru)
      .replace(/\{cheapestBudget\}/g, fmt(cheapest.min_rent));

  return [
    { q: sub(t.dynFaqQ1), a: sub(t.dynFaqA1) },
    { q: sub(t.dynFaqQ2), a: sub(t.dynFaqA2) },
    { q: sub(t.dynFaqQ3), a: sub(t.dynFaqA3) },
    { q: sub(t.dynFaqQ4), a: sub(t.dynFaqA4) },
    { q: sub(t.dynFaqQ5), a: sub(t.dynFaqA5) },
  ];
}

export function CountryDynamicFAQ({
  items,
  eyebrow,
  title,
}: {
  items: FaqItem[];
  eyebrow: string;
  title: string;
}) {
  if (!items.length) return null;

  return (
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
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
            <summary className="cursor-pointer flex items-center justify-between gap-4 px-6 py-5 list-none">
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
