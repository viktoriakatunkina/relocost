import type { CountryContent } from "@/lib/countries-content";
import type { FaqItem } from "@/components/FaqSchema";
import { typo } from "@/lib/typography";

// Ручной FAQ страны из COUNTRY_CONTENT (виза, климат, язык, менталитет).
// JSON-LD здесь НЕ рендерится: на странице страны есть вторая FAQ-секция
// (CountryDynamicFAQ), а Google учитывает только один блок FAQPage. Разметку
// собирает страница один раз через <FaqSchema> из объединённого списка.

export function buildCountryFaqItems(
  content: CountryContent,
  questions: {
    visa: string;
    climate: string;
    language: string;
    mentality: string;
  },
): FaqItem[] {
  return [
    { q: questions.visa, a: content.visa_note },
    { q: questions.climate, a: content.climate },
    { q: questions.language, a: content.language_note },
    { q: questions.mentality, a: content.mentality },
  ];
}

export function CountryFAQ({
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
        {items.map((it, i) => (
          <details
            key={i}
            className="group rounded-3xl bg-surface border hairline overflow-hidden open:border-copper/30 open:bg-surface-elevated transition"
          >
            <summary className="cursor-pointer flex items-center justify-between gap-4 px-6 py-5 list-none">
              <span className="text-cream font-medium text-base md:text-lg text-pretty">
                {typo(it.q)}
              </span>
              <span
                className="text-copper text-2xl leading-none transition-transform group-open:rotate-45 shrink-0"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="px-6 pb-6 text-brandy/90 leading-relaxed text-pretty">
              {typo(it.a)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
