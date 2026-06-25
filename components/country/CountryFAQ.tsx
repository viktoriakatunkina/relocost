import type { CountryContent } from "@/lib/countries-content";
import { typo } from "@/lib/typography";

export function CountryFAQ({
  content,
  eyebrow,
  title,
  questions,
}: {
  content: CountryContent;
  eyebrow: string;
  title: string;
  questions: {
    visa: string;
    climate: string;
    language: string;
    mentality: string;
  };
}) {
  const items = [
    { q: questions.visa, a: content.visa_note },
    { q: questions.climate, a: content.climate },
    { q: questions.language, a: content.language_note },
    { q: questions.mentality, a: content.mentality },
  ];

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
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
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
