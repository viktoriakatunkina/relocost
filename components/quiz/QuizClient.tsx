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
} from "@/lib/quiz";

// Описание вопросов квиза. Значения ответов маппятся на поля QuizAnswers.
type Opt<T> = { value: T; label: string; hint?: string };
type Question =
  | { key: "destination"; title: string; options: Opt<Destination>[] }
  | { key: "budgetMax"; title: string; options: Opt<number | null>[] }
  | { key: "climate"; title: string; options: Opt<ClimatePref>[] }
  | { key: "priority"; title: string; options: Opt<Priority>[] }
  | { key: "needRussian"; title: string; options: Opt<boolean>[] }
  | { key: "visaReady"; title: string; options: Opt<boolean>[] };

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
  priority: "easy",
  needRussian: false,
  visaReady: true,
};

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

  const results = useMemo(
    () => (finished ? rankCities(cities, answers, communityMap, 8) : []),
    [finished, cities, answers, communityMap],
  );

  function choose(value: unknown) {
    const q = QUESTIONS[step];
    setAnswers((a) => ({ ...a, [q.key]: value }));
    setStep((s) => s + 1);
  }

  function restart() {
    setAnswers(DEFAULT_ANSWERS);
    setStep(0);
  }

  if (finished) {
    return (
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="text-center mb-10">
          <span className="eyebrow justify-center">Ваш результат</span>
          <h2 className="font-serif text-3xl md:text-5xl text-cream mt-5 mb-3">
            Города, которые Вам подойдут
          </h2>
          <p className="text-brandy/75 max-w-2xl mx-auto text-pretty">
            Подобрали по Вашим ответам из нашей базы. Откройте город, чтобы
            увидеть цены, бюджет и детали переезда.
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-pill border hairline text-brandy/85 hover:text-cream hover:border-copper/30 transition text-sm"
          >
            Пройти заново
          </button>
        </div>

        {results.length === 0 ? (
          <p className="text-center text-brandy/70">
            По таким условиям ничего не нашлось. Попробуйте{" "}
            <button onClick={restart} className="text-copper hover:underline">
              изменить ответы
            </button>
            .
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {results.map((r, i) => (
              <div key={r.city.slug} className="flex flex-col gap-3">
                <CityCard city={r.city} index={i} />
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
        )}

        <div className="mt-12 text-center">
          <Link
            href="/search"
            className="text-brandy/80 hover:text-copper transition"
          >
            Посмотреть все города с фильтрами →
          </Link>
        </div>
      </section>
    );
  }

  const q = QUESTIONS[step];
  const progress = Math.round((step / total) * 100);

  return (
    <section className="max-w-2xl mx-auto px-6 pb-12">
      {/* Прогресс */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-brandy/60 mb-2.5">
          <span>
            Вопрос {step + 1} из {total}
          </span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-cream/8 overflow-hidden">
          <div
            className="h-full bg-copper rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>
      </div>

      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-7 text-balance">
        {q.title}
      </h2>

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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="mt-7 text-sm text-brandy/55 hover:text-copper transition"
        >
          ← Назад
        </button>
      )}
    </section>
  );
}
