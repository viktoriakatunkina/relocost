"use client";

import { useState } from "react";
import type { CityContent } from "@/lib/cities-content";

export function CityFAQ({ faq }: { faq: CityContent["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);

  // Schema.org FAQPage разметка для SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Частые вопросы
      </h2>
      <div className="space-y-3">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-kombu-green/40 border border-dingley/30 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-kombu-green/60"
                aria-expanded={isOpen}
              >
                <span className="text-cream font-medium">{item.question}</span>
                <span
                  className={`text-pale-copper text-2xl leading-none transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-brandy/90 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
