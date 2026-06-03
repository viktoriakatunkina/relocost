import type { City } from "@/lib/types";
import type { CityContent } from "@/lib/cities-content";
import { cityIn } from "@/lib/city-prepositional";
import { typo } from "@/lib/typography";

// SEO-блок-выжимка: бьёт в топ-запросы «стоит ли переезжать в X», «виза в X
// для россиян», «стоимость жизни в X». Собран из уже имеющихся полей города и
// контента — без новых непроверенных фактов.
export function CitySummary({
  city,
  content,
}: {
  city: City;
  content?: CityContent;
}) {
  const phrase = cityIn(city.slug, city.name_ru); // «в Тбилиси» / «на Бали»

  const visaValue = city.is_foreign
    ? content?.visa_steps?.[0]?.title ?? "Зависит от страны — см. раздел «Виза»"
    : "Не нужна — переезд внутри России";

  const DIFFICULTY = ["", "Легкий", "Средний", "Средний", "Сложный", "Сложный"];
  const difficultyValue = city.difficulty_score
    ? DIFFICULTY[Math.min(city.difficulty_score, 5)] || "—"
    : "—";

  const tiles: Array<{ icon: string; label: string; value: string }> = [
    {
      icon: "💰",
      label: "Стоимость жизни",
      value: "Реальный месячный бюджет — в калькуляторе ниже",
    },
    {
      icon: "🛂",
      label: city.is_foreign ? "Виза для россиян" : "Документы",
      value: visaValue,
    },
    { icon: "🗣", label: "Язык", value: city.language ?? "—" },
    { icon: "📊", label: "Сложность переезда", value: difficultyValue },
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 pt-16">
      <span className="eyebrow">Коротко о переезде</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-5 text-balance">
        {typo(`Стоит ли переезжать ${phrase}?`)}
      </h2>
      {city.intro_text && (
        <p className="text-brandy/90 text-lg leading-relaxed text-pretty max-w-3xl">
          {typo(city.intro_text)}
        </p>
      )}

      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-2xl bg-surface border hairline p-4 flex flex-col gap-1.5"
          >
            <dt className="flex items-center gap-2 text-brandy/55 text-[11px] uppercase tracking-[0.14em]">
              <span aria-hidden className="text-base leading-none">
                {t.icon}
              </span>
              {t.label}
            </dt>
            <dd className="text-cream text-sm leading-snug text-pretty">
              {typo(t.value)}
            </dd>
          </div>
        ))}
      </dl>

      {content && (content.pros.length > 0 || content.cons.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {content.pros[0] && (
            <p className="text-sm text-brandy/80 rounded-2xl bg-surface/60 border hairline p-4">
              <span className="text-emerald-300 font-semibold">Почему едут: </span>
              {typo([content.pros[0], content.pros[1]].filter(Boolean).join("; "))}.
            </p>
          )}
          {content.cons[0] && (
            <p className="text-sm text-brandy/80 rounded-2xl bg-surface/60 border hairline p-4">
              <span className="text-copper font-semibold">На что обратить внимание: </span>
              {typo([content.cons[0], content.cons[1]].filter(Boolean).join("; "))}.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
