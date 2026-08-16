// Индекс качества жизни — большая карточка с круговым баллом и 6 категориями.
// Аналог блока AreaVibes: итоговый балл 0–100, грейды A–F, прогресс-бары.
// Серверный компонент — i18n через getTranslations на уровне страницы,
// передаём локализованные строки через пропсы.

import type { LivingScoreResult, ScoreGrade } from "@/lib/livingScore";

// ─── Стили по грейду ───────────────────────────────────────────────────────

const GRADE_STYLES: Record<
  ScoreGrade,
  { ring: string; text: string; bg: string; border: string; bar: string }
> = {
  A: {
    ring: "stroke-emerald-400",
    text: "text-emerald-300",
    bg: "bg-emerald-400/15",
    border: "border-emerald-400/40",
    bar: "bg-emerald-400",
  },
  B: {
    ring: "stroke-lime-400",
    text: "text-lime-300",
    bg: "bg-lime-400/15",
    border: "border-lime-400/40",
    bar: "bg-lime-400",
  },
  C: {
    ring: "stroke-amber-400",
    text: "text-amber-300",
    bg: "bg-amber-400/15",
    border: "border-amber-400/40",
    bar: "bg-amber-400",
  },
  D: {
    ring: "stroke-orange-400",
    text: "text-orange-300",
    bg: "bg-orange-400/15",
    border: "border-orange-400/40",
    bar: "bg-orange-400",
  },
  F: {
    ring: "stroke-red-500",
    text: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    bar: "bg-red-500",
  },
};

// ─── Круговой индикатор ────────────────────────────────────────────────────

function CircleScore({
  score,
  grade,
}: {
  score: number;
  grade: ScoreGrade;
}) {
  const s = GRADE_STYLES[grade];
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative shrink-0 w-28 h-28">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full -rotate-90"
        aria-hidden
      >
        {/* Трек */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-cream/10"
        />
        {/* Прогресс */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className={s.ring}
        />
      </svg>
      {/* Числа в центре */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-serif text-2xl leading-none tabular-nums ${s.text}`}>
          {score}
        </span>
        <span className="text-[10px] text-brandy/50 mt-0.5">{grade}</span>
      </div>
    </div>
  );
}

// ─── Строка категории ──────────────────────────────────────────────────────

function CategoryRow({
  icon,
  label,
  score,
  grade,
  available,
  noDataLabel,
}: {
  icon: string;
  label: string;
  score: number;
  grade: ScoreGrade;
  available: boolean;
  noDataLabel: string;
}) {
  const s = GRADE_STYLES[grade];
  return (
    <li className="flex items-center gap-3 sm:gap-4">
      {/* Иконка */}
      <span className="text-xl leading-none w-7 shrink-0 text-center" aria-hidden>
        {icon}
      </span>

      {/* Название + бар + грейд */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <span className="text-sm text-cream/90 truncate">{label}</span>
          {available ? (
            <span className={`text-xs font-bold tabular-nums shrink-0 ${s.text}`}>
              {grade} · {score}
            </span>
          ) : (
            <span className="text-xs text-brandy/40 shrink-0">{noDataLabel}</span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-cream/8 overflow-hidden">
          {available && (
            <div
              className={`h-full ${s.bar} rounded-full`}
              style={{ width: `${score}%` }}
              aria-hidden
            />
          )}
        </div>
      </div>
    </li>
  );
}

// ─── Пропсы компонента ─────────────────────────────────────────────────────

export type LivingScoreCardProps = {
  result: LivingScoreResult;
  cityName: string;
  /** Локализованные строки — передаются со страницы города */
  t: {
    eyebrow: string;
    title: string;
    subtitle: string;
    totalLabel: string;
    /** Подпись «X категорий» */
    availableCategories: string;
    noData: string;
    footer: string;
    ratingLink: string;
    /** Метки категорий: housing, cost, safety, life, transport, climate */
    categories: Record<string, string>;
    /** Подписи под баллом: gradeA, gradeB, gradeC, gradeD, gradeF */
    grades: Record<string, string>;
  };
};

// ─── Основной компонент ────────────────────────────────────────────────────

export function LivingScoreCard({ result, cityName, t }: LivingScoreCardProps) {
  // Не рендерим если данных совсем нет (availableCount = 0).
  if (result.availableCount === 0) return null;

  const overall = GRADE_STYLES[result.grade];
  const gradeLabel = t.grades[result.labelKey] ?? "";

  return (
    <section
      id="living-score"
      className="max-w-4xl mx-auto px-6 pt-14 md:pt-20"
    >
      <span className="eyebrow">{t.eyebrow}</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        {t.title.replace("{city}", cityName)}
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-2xl text-pretty">
        {t.subtitle}
      </p>

      <div
        className={`rounded-3xl border p-6 md:p-9 ${overall.bg} ${overall.border}`}
      >
        {/* Шапка: круговой балл + общая подпись */}
        <div className="flex items-center gap-6 mb-8 pb-7 border-b hairline">
          <CircleScore score={result.total} grade={result.grade} />

          <div>
            <div className="text-cream font-semibold text-lg">
              {t.totalLabel}: {result.total}/100
            </div>
            <div className={`text-sm font-medium mt-0.5 ${overall.text}`}>
              {gradeLabel}
            </div>
            <div className="text-brandy/55 text-xs mt-2">
              {t.availableCategories.replace(
                "{count}",
                String(result.availableCount),
              )}
            </div>
          </div>
        </div>

        {/* Категории */}
        <ul className="space-y-5">
          {result.categories.map((cat) => (
            <CategoryRow
              key={cat.key}
              icon={cat.icon}
              label={t.categories[cat.labelKey] ?? cat.labelKey}
              score={cat.score}
              grade={cat.grade}
              available={cat.available}
              noDataLabel={t.noData}
            />
          ))}
        </ul>

        {/* Сноска */}
        <p className="mt-8 pt-6 border-t hairline text-xs text-brandy/50 text-pretty">
          {t.footer}
        </p>
      </div>
    </section>
  );
}
