// Блок «Плюсы, минусы и для кого подходит» — аналог BestPlaces / Nomad List.
// Серверный компонент: данные + i18n-строки получает со страницы через пропсы.
// Показывается только если buildCityVerdictBlock вернул hasEnoughData = true.

import type { CityVerdictBlock } from "@/lib/city-verdict-block";

// ── Маппинг иконок аудитории (статичный, без Emoji в логике) ─────────────────

const AUDIENCE_ICON: Record<string, string> = {
  budget:      "💰",
  freelancers: "💼",
  pensioners:  "🌴",
  families:    "👨‍👩‍👧",
  students:    "🎓",
  nomads:      "🌍",
  safety:      "🛡️",
};

// ── Компонент ─────────────────────────────────────────────────────────────────

export type CityVerdictProps = {
  block: CityVerdictBlock;
  /** Локализованные заголовки */
  t: {
    eyebrow: string;
    title: string;
    prosTitle: string;
    consTitle: string;
    audienceTitle: string;
  };
};

export function CityVerdict({ block, t }: CityVerdictProps) {
  if (!block.hasEnoughData) return null;

  return (
    <section
      id="verdict"
      className="max-w-6xl mx-auto px-6 pt-14 md:pt-20"
      aria-label={t.title}
    >
      <span className="eyebrow">{t.eyebrow}</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-10">
        {t.title}
      </h2>

      {/* Сетка плюсы + минусы */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <VerdictColumn
          title={t.prosTitle}
          items={block.pros}
          variant="pros"
        />
        <VerdictColumn
          title={t.consTitle}
          items={block.cons}
          variant="cons"
        />
      </div>

      {/* Теги аудитории */}
      {block.audience.length > 0 && (
        <div className="mb-8 p-6 md:p-8 rounded-3xl bg-surface border hairline">
          <p className="text-xs text-brandy/60 mb-5 font-semibold uppercase tracking-[0.18em]">
            {t.audienceTitle}
          </p>
          <div className="flex flex-wrap gap-3">
            {block.audience.map((tag) => (
              <AudienceChip key={tag.key} tag={tag} />
            ))}
          </div>
        </div>
      )}

      {/* Фраза-вердикт */}
      {block.phrase && (
        <blockquote
          className="pl-6 py-4 rounded-r-2xl"
          style={{ borderLeft: "3px solid rgba(232,155,110,0.7)", background: "rgba(232,155,110,0.05)" }}
        >
          <p className="text-cream/90 text-base md:text-xl leading-relaxed italic">
            {block.phrase}
          </p>
        </blockquote>
      )}
    </section>
  );
}

// ── Колонка плюсов или минусов ────────────────────────────────────────────────

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

// ── Чип аудитории ─────────────────────────────────────────────────────────────

function AudienceChip({ tag }: { tag: { key: string; label: string } }) {
  const icon = AUDIENCE_ICON[tag.key] ?? "✦";
  return (
    <span
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
      style={{
        background: "rgba(232,155,110,0.1)",
        border: "1px solid rgba(232,155,110,0.3)",
        color: "#F6F1E8",
      }}
    >
      <span className="text-base" aria-hidden>{icon}</span>
      {tag.label}
    </span>
  );
}
