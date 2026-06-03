import type { CountryContent } from "@/lib/countries-content";

export function CountryFAQ({
  countryName,
  content,
}: {
  countryName: string;
  content: CountryContent;
}) {
  const items = [
    {
      q: `Нужна ли виза в ${countryName} для россиян в 2026 году?`,
      a: content.visa_note,
    },
    {
      q: `Какой климат в ${countryName}?`,
      a: content.climate,
    },
    {
      q: `На каком языке говорят в ${countryName}?`,
      a: content.language_note,
    },
    {
      q: `Какой менталитет в ${countryName}?`,
      a: content.mentality,
    },
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
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Частые вопросы про {countryName}
      </h2>
      <div className="space-y-3">
        {items.map((it, i) => (
          <details
            key={i}
            className="group rounded-2xl bg-kombu-green/40 border border-dingley/30 overflow-hidden"
          >
            <summary className="cursor-pointer flex items-center justify-between gap-4 px-6 py-5 list-none">
              <span className="text-cream font-medium">{it.q}</span>
              <span
                className="text-pale-copper text-2xl leading-none transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="px-6 pb-6 text-brandy/90 leading-relaxed">
              {it.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
