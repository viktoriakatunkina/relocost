"use client";

import { useState } from "react";
import type { CityContent } from "@/lib/cities-content";
import { typo } from "@/lib/typography";

export function CityFAQ({ faq }: { faq: CityContent["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);

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
    <section className="max-w-4xl mx-auto px-6 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <span className="eyebrow">FAQ</span>
      <h2 className="font-serif text-4xl md:text-5xl text-cream mt-6 mb-10">
        Частые вопросы
      </h2>
      <div className="space-y-3">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`rounded-3xl border overflow-hidden transition ${
                isOpen ? "bg-surface-elevated border-copper/30" : "bg-surface hairline hover:border-copper/20"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-cream font-medium text-base md:text-lg text-pretty">
                  {typo(item.question)}
                </span>
                <span
                  className={`text-copper text-2xl leading-none transition-transform shrink-0 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-brandy/90 leading-relaxed text-pretty">
                  {typo(item.answer)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
