"use client";

import { useState } from "react";
import { useCountryUnlocked, isCountryUnlocked } from "@/lib/unlocked";
import { CountryPaymentModal } from "@/components/freemium/CountryPaymentModal";

interface FactData {
  key: string;
  title: string;
  text: string;
  accent?: boolean;
  wide?: boolean;
}

function FactCard({
  title,
  text,
  accent,
  wide,
}: {
  title: string;
  text: string;
  accent?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border hairline p-5 md:p-7 ${
        accent ? "bg-copper/10 border-copper/30" : "bg-surface"
      } ${wide ? "md:col-span-2" : ""}`}
    >
      <h3 className="font-serif text-xl text-cream mb-3">{title}</h3>
      <p className="text-brandy/85 leading-relaxed">{text}</p>
    </div>
  );
}

export function LockedCountryFacts({
  slug,
  facts,
}: {
  slug: string;
  facts: FactData[];
}) {
  const unlocked = useCountryUnlocked(slug);
  const opened = isCountryUnlocked(unlocked, "country_overview");
  const [openModal, setOpenModal] = useState(false);

  if (facts.length === 0) return null;

  // Первые 2 факта бесплатно, остальные — за paywall
  const free = facts.slice(0, 2);
  const locked = facts.slice(2);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-5">
        {free.map((f) => (
          <FactCard
            key={f.key}
            title={f.title}
            text={f.text}
            accent={f.accent}
            wide={f.wide}
          />
        ))}

        {locked.length > 0 && (
          opened
            ? locked.map((f) => (
                <FactCard
                  key={f.key}
                  title={f.title}
                  text={f.text}
                  accent={f.accent}
                  wide={f.wide}
                />
              ))
            : (
              <div className="relative md:col-span-2">
                {/* размытые карточки */}
                <div
                  aria-hidden
                  className="pointer-events-none select-none grid md:grid-cols-2 gap-5"
                  style={{ filter: "blur(5px)" }}
                >
                  {locked.map((f) => (
                    <FactCard
                      key={f.key}
                      title={f.title}
                      text={f.text}
                      accent={f.accent}
                      wide={f.wide}
                    />
                  ))}
                </div>
                {/* paywall-оверлей */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-surface-elevated/95 backdrop-blur-md border border-copper/30 rounded-2xl px-6 py-5 text-center shadow-xl max-w-sm">
                    <p className="text-cream font-serif text-xl mb-2">
                      🌍 Полный обзор страны
                    </p>
                    <p className="text-brandy/75 text-sm mb-4 leading-snug">
                      Особенности жизни, менталитет, лучшие места и практические советы — в одном материале.
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpenModal(true)}
                      className="inline-block px-5 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
                    >
                      Открыть за 29 ₽
                    </button>
                  </div>
                </div>
              </div>
            )
        )}
      </div>

      <CountryPaymentModal
        slug={slug}
        pkg={openModal ? "country_overview" : null}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
