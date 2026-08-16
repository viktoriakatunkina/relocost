// Блок «Плюсы, минусы и для кого подходит» для страницы страны.
// Аналог CityVerdict, адаптированный для агрегатных данных по стране.

import type { CountryVerdictBlock } from "@/lib/city-verdict-block";

const AUDIENCE_ICON: Record<string, string> = {
  budget:      "💰",
  freelancers: "💼",
  pensioners:  "🌴",
  families:    "👨‍👩‍👧",
  nomads:      "🌍",
};

export type CountryVerdictProps = {
  block: CountryVerdictBlock;
  t: {
    eyebrow: string;
    title: string;
    prosTitle: string;
    consTitle: string;
    audienceTitle: string;
  };
};

export function CountryVerdict({ block, t }: CountryVerdictProps) {
  if (!block.hasEnoughData) return null;

  return (
    <section
      id="verdict"
      className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 md:pt-20"
      aria-label={t.title}
    >
      <span className="eyebrow">{t.eyebrow}</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-10">
        {t.title}
      </h2>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <VerdictColumn title={t.prosTitle} items={block.pros} variant="pros" />
        <VerdictColumn title={t.consTitle} items={block.cons} variant="cons" />
      </div>

      {block.audience.length > 0 && (
        <div className="mb-8">
          <p className="text-sm text-brandy/60 mb-3 font-medium uppercase tracking-wide">
            {t.audienceTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {block.audience.map((tag) => (
              <AudienceChip key={tag.key} tag={tag} />
            ))}
          </div>
        </div>
      )}

      {block.phrase && (
        <blockquote className="border-l-2 border-copper/60 pl-5 py-1">
          <p className="text-brandy/85 text-base md:text-lg leading-relaxed italic">
            {block.phrase}
          </p>
        </blockquote>
      )}
    </section>
  );
}

function VerdictColumn({
  title,
  items,
  variant,
}: {
  title: string;
  items: { key: string; label: string }[];
  variant: "pros" | "cons";
}) {
  const isPro = variant === "pros";
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-surface border hairline">
      <div className="flex items-center gap-3 mb-6">
        <span
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold shrink-0 ${
            isPro
              ? "bg-emerald-400/15 text-emerald-300"
              : "bg-copper/15 text-copper"
          }`}
          aria-hidden
        >
          {isPro ? "+" : "−"}
        </span>
        <h3 className="font-serif text-2xl text-cream">{title}</h3>
      </div>
      <ul className="space-y-3.5">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex gap-3 text-cream/90 leading-relaxed text-pretty"
          >
            <span
              className={`mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                isPro ? "bg-emerald-400" : "bg-copper"
              }`}
              aria-hidden
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AudienceChip({ tag }: { tag: { key: string; label: string } }) {
  const icon = AUDIENCE_ICON[tag.key] ?? "✦";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full " +
        "border border-dingley/40 bg-surface text-sm text-brandy/85 " +
        "hover:border-copper/50 hover:text-cream transition-colors"
      }
    >
      <span aria-hidden>{icon}</span>
      {tag.label}
    </span>
  );
}
