import type { QualityData } from "@/lib/city-quality";

type Axis = {
  key: keyof QualityData;
  label: string;
  icon: string;
};

const AXES: Axis[] = [
  { key: "safety",          label: "Безопасность",  icon: "🛡️" },
  { key: "ecology",         label: "Экология",       icon: "🌿" },
  { key: "medicine",        label: "Медицина",       icon: "🏥" },
  { key: "climate_comfort", label: "Климат",         icon: "🌤️" },
];

const LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "плохо",
  2: "ниже среднего",
  3: "средне",
  4: "хорошо",
  5: "отлично",
};

const BAR_CLASS: Record<1 | 2 | 3 | 4 | 5, string> = {
  5: "bg-emerald-400",
  4: "bg-lime-400",
  3: "bg-amber-400",
  2: "bg-orange-400",
  1: "bg-red-500",
};

const TEXT_CLASS: Record<1 | 2 | 3 | 4 | 5, string> = {
  5: "text-emerald-300",
  4: "text-lime-300",
  3: "text-amber-300",
  2: "text-orange-300",
  1: "text-red-400",
};

export function QualityOfLife({
  cityName,
  data,
}: {
  cityName: string;
  data: QualityData | null;
}) {
  if (!data) return null;

  return (
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Качество жизни</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Безопасность и среда в {cityName}
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-2xl text-pretty">
        Оценки по ключевым параметрам среды — по данным Numbeo, Nomad List и открытых
        источников. Актуально на 2025–2026 год.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AXES.map(({ key, label, icon }) => {
          const score = data[key] as 1 | 2 | 3 | 4 | 5;
          const pct = (score / 5) * 100;
          return (
            <div
              key={key}
              className="rounded-2xl bg-surface border hairline p-5 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">{icon}</span>
                <span className="text-cream font-medium">{label}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 h-2 rounded-full bg-cream/8 overflow-hidden">
                  <div
                    className={`h-full ${BAR_CLASS[score]} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                    aria-hidden
                  />
                </div>
                <span className={`text-sm font-semibold tabular-nums ${TEXT_CLASS[score]} shrink-0`}>
                  {LABELS[score]}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <div
                    key={n}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      n <= score ? BAR_CLASS[score] : "bg-cream/10"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-brandy/45 text-pretty">
        Источники: Numbeo Crime / Health Care / Pollution Index, Nomad List, AirVisual Quality Reports.
        Оценки — усредненные по открытым данным, обновлены в 2025–2026 гг. Служат
        ориентиром для сравнения городов.
      </p>
    </section>
  );
}
