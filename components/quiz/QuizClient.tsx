"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { CityCard } from "@/components/CityCard";
import type { CityWithBudget } from "@/lib/types";
import {
  rankCities,
  type ClimatePref,
  type Destination,
  type Priority,
  type QuizAnswers,
  type RankedResult,
} from "@/lib/quiz";

// ── Question icon SVGs ────────────────────────────────────────────────────────

function IconGlobe() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="17" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconPassport() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="11" r="3" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

// ── Question metadata ─────────────────────────────────────────────────────────

type QuestionMeta = {
  Icon: () => React.ReactElement;
  hint: string;
};

const QUESTION_META: Record<string, QuestionMeta> = {
  destination: {
    Icon: IconGlobe,
    hint: "Поможет сузить поиск по направлению",
  },
  budgetMax: {
    Icon: IconWallet,
    hint: "Бюджет на одного человека в месяц, включая аренду жилья",
  },
  climate: {
    Icon: IconSun,
    hint: "Учитываем среднегодовую температуру и сезонность",
  },
  priority: {
    Icon: IconStar,
    hint: "Влияет на итоговый рейтинг подборки — выберите важное для Вас",
  },
  needRussian: {
    Icon: IconUsers,
    hint: "Наличие русскоязычного сообщества в городе",
  },
  visaReady: {
    Icon: IconPassport,
    hint: "Фильтрует направления по сложности оформления документов",
  },
};

// ── Russian plural helper ─────────────────────────────────────────────────────

function cityWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return "городов";
  if (mod10 === 1) return "город";
  if (mod10 >= 2 && mod10 <= 4) return "города";
  return "городов";
}

// ── Types and questions ───────────────────────────────────────────────────────

type Opt<T> = { value: T; label: string; hint?: string };
type Question =
  | { key: "destination"; title: string; multi?: false; options: Opt<Destination>[] }
  | { key: "budgetMax"; title: string; multi?: false; options: Opt<number | null>[] }
  | { key: "climate"; title: string; multi?: false; options: Opt<ClimatePref>[] }
  | { key: "priority"; title: string; multi: true; options: Opt<Priority>[] }
  | { key: "needRussian"; title: string; multi?: false; options: Opt<boolean>[] }
  | { key: "visaReady"; title: string; multi?: false; options: Opt<boolean>[] };

const QUESTIONS: Question[] = [
  {
    key: "destination",
    title: "Куда хотите переехать?",
    options: [
      { value: "foreign", label: "За границу" },
      { value: "russia", label: "По России" },
      { value: "any", label: "Пока не решил(а)" },
    ],
  },
  {
    key: "budgetMax",
    title: "Какой бюджет на месяц на одного человека?",
    options: [
      { value: 40000, label: "До 40 000 ₽" },
      { value: 80000, label: "До 80 000 ₽" },
      { value: 150000, label: "До 150 000 ₽" },
      { value: null, label: "Не важно" },
    ],
  },
  {
    key: "climate",
    title: "Какой климат Вам ближе?",
    options: [
      { value: "warm", label: "Тепло круглый год" },
      { value: "temperate", label: "Умеренный, со сменой сезонов" },
      { value: "any", label: "Не важно" },
    ],
  },
  {
    key: "priority",
    title: "Что для Вас важнее всего?",
    multi: true,
    options: [
      { value: "easy", label: "Простой переезд" },
      { value: "sea", label: "Жизнь у моря" },
      { value: "remote", label: "Удобство для удалённой работы" },
      { value: "bigcity", label: "Большой город" },
      { value: "cheaper", label: "Чтобы было дешевле" },
    ],
  },
  {
    key: "needRussian",
    title: "Важна русскоязычная среда?",
    options: [
      { value: true, label: "Да, важна" },
      { value: false, label: "Не обязательно" },
    ],
  },
  {
    key: "visaReady",
    title: "Готовы оформлять визу или ВНЖ?",
    options: [
      { value: true, label: "Да, готов(а)" },
      { value: false, label: "Хочу попроще, без виз" },
    ],
  },
];

const DEFAULT_ANSWERS: QuizAnswers = {
  destination: "any",
  budgetMax: null,
  climate: "any",
  priority: [],
  needRussian: false,
  visaReady: true,
};

// ── Main component ────────────────────────────────────────────────────────────

export function QuizClient({
  cities,
  community,
}: {
  cities: CityWithBudget[];
  community: Record<string, number>;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_ANSWERS);
  const communityMap = useMemo(
    () => new Map(Object.entries(community)),
    [community],
  );

  const total = QUESTIONS.length;
  const finished = step >= total;

  const result = useMemo<RankedResult>(
    () =>
      finished
        ? rankCities(cities, answers, communityMap, 8)
        : { cities: [], isFallback: false },
    [finished, cities, answers, communityMap],
  );
  const results = result.cities;
  const isFallback = result.isFallback;

  function choose(value: unknown) {
    const q = QUESTIONS[step];
    setAnswers((a) => ({ ...a, [q.key]: value }));
    setStep((s) => s + 1);
  }

  function togglePriority(value: Priority) {
    setAnswers((a) => {
      const current = a.priority;
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...a, priority: next };
    });
  }

  function confirmMulti() {
    setStep((s) => s + 1);
  }

  function restart() {
    setAnswers(DEFAULT_ANSWERS);
    setStep(0);
  }

  // ── Results screen ──────────────────────────────────────────────────────────

  if (finished) {
    return (
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="text-center mb-10">
          {/* Completion badge */}
          <div className="inline-flex items-center gap-2 rounded-pill bg-copper/10 border border-copper/25 px-4 py-2 text-sm text-copper font-medium mb-6">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Тест пройден
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-cream mt-2 mb-4">
            {isFallback
              ? "Возможно, Вам подойдут эти города"
              : `Нашли ${results.length} ${cityWord(results.length)} для Вас`}
          </h2>
          <p className="text-brandy/75 max-w-2xl mx-auto text-pretty">
            {isFallback
              ? "Идеального совпадения не нашлось — но вот направления, которые стоит рассмотреть. Попробуйте изменить ответы или выберите «Пока не решил(а)» в первом вопросе."
              : "Города отобраны по Вашим ответам. Откройте любой, чтобы увидеть цены, бюджет и детали переезда."}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-pill border hairline text-brandy/85 hover:text-cream hover:border-copper/30 transition text-sm"
          >
            Пройти заново
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {results.map((r, i) => (
            <div key={r.city.slug} className="flex flex-col gap-3">
              {/* Rank badge overlay for top-3 */}
              <div className="relative">
                {i < 3 && (
                  <div
                    className={[
                      "absolute top-3 left-3 z-20 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 shadow-lg",
                      i === 0
                        ? "bg-amber-400 text-amber-900 border-amber-300"
                        : i === 1
                        ? "bg-slate-300 text-slate-700 border-slate-200"
                        : "bg-orange-600 text-orange-50 border-orange-500",
                    ].join(" ")}
                    aria-label={`Место ${i + 1}`}
                  >
                    {i + 1}
                  </div>
                )}
                <CityCard city={r.city} index={i} />
              </div>
              {r.reasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {r.reasons.map((reason) => (
                    <span key={reason} className="chip">
                      {reason}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/search"
            className="text-brandy/80 hover:text-copper transition"
          >
            Посмотреть все города с фильтрами &rarr;
          </Link>
        </div>
      </section>
    );
  }

  // ── Question screen ─────────────────────────────────────────────────────────

  const q = QUESTIONS[step];
  const progress = Math.round((step / total) * 100);
  const meta = QUESTION_META[q.key];

  return (
    <section className="max-w-2xl mx-auto px-6 pb-12">
      {/* Progress bar + step dots */}
      <div className="mb-9">
        <div className="flex items-center justify-between text-sm text-brandy/60 mb-3">
          <span>
            Вопрос {step + 1} из {total}
          </span>
          <span className="tabular-nums text-copper font-medium">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-cream/8 overflow-hidden">
          <div
            className="h-full bg-copper rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-center items-center gap-1.5 mt-3" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={[
                "rounded-full transition-all duration-300",
                i < step
                  ? "w-2 h-2 bg-copper"
                  : i === step
                  ? "w-5 h-2 bg-copper/60"
                  : "w-2 h-2 bg-cream/15",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Question header: icon + title + hint */}
      <div className="mb-7">
        {meta && (
          <div className="w-14 h-14 rounded-2xl bg-copper/10 border border-copper/20 flex items-center justify-center text-copper mb-5">
            <meta.Icon />
          </div>
        )}
        <h2 className="font-serif text-3xl md:text-4xl text-cream mb-2 text-balance">
          {q.title}
        </h2>
        <p className="text-brandy/50 text-sm">
          {q.multi
            ? meta?.hint ?? "Можно выбрать несколько вариантов"
            : meta?.hint}
        </p>
      </div>

      {/* Options */}
      {q.multi ? (
        // Multi-select
        <>
          <div className="space-y-3">
            {q.options.map((opt) => {
              const isSelected = answers.priority.includes(opt.value as Priority);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => togglePriority(opt.value as Priority)}
                  className={[
                    "w-full text-left flex items-center justify-between gap-4 rounded-2xl px-5 py-4 md:py-5 transition",
                    isSelected
                      ? "bg-surface-elevated border-2 border-copper text-cream"
                      : "bg-surface border hairline text-cream hover:border-copper/40 hover:bg-surface-elevated",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span
                    className={[
                      "w-7 h-7 rounded-md border-2 flex items-center justify-center shrink-0 transition",
                      isSelected
                        ? "bg-copper border-copper text-[#202808]"
                        : "border-brandy/30 text-transparent",
                    ].join(" ")}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>

          {answers.priority.length > 0 && (
            <button
              type="button"
              onClick={confirmMulti}
              className="mt-6 w-full rounded-2xl bg-copper px-5 py-4 font-medium text-[#202808] hover:opacity-90 transition text-center"
            >
              Далее &rarr;
            </button>
          )}
        </>
      ) : (
        // Single select with auto-advance
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => choose(opt.value)}
              className="w-full text-left flex items-center justify-between gap-4 rounded-2xl bg-surface border hairline px-5 py-4 md:py-5 text-cream hover:border-copper/40 hover:bg-surface-elevated transition group"
            >
              <span className="font-medium">{opt.label}</span>
              <span className="w-7 h-7 rounded-full border border-brandy/30 flex items-center justify-center text-brandy/50 group-hover:border-copper group-hover:text-copper transition shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      )}

      {step > 0 && (
        <button
          type="button"
          onClick={() => {
            const prevStep = step - 1;
            if (QUESTIONS[prevStep]?.key === "priority") {
              setAnswers((a) => ({ ...a, priority: [] }));
            }
            setStep(prevStep);
          }}
          className="mt-7 text-sm text-brandy/55 hover:text-copper transition"
        >
          &larr; Назад
        </button>
      )}
    </section>
  );
}
