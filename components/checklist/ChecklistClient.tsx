"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  CHECKLIST_STEPS,
  GROUP_LABELS,
  VARIANT_LABELS,
  toggleStep,
  useChecklist,
  writeChecked,
  type ChecklistGroupKey,
  type ChecklistVariant,
} from "@/lib/checklist";

const GROUP_ORDER: ChecklistGroupKey[] = ["before", "arrival", "month"];

// Небольшой набор тематических иконок для пунктов чек-листа — заменяют
// обычный чекбокс в невыполненном состоянии (при отметке становится галочкой
// на медном фоне). Держим набор компактным и переиспользуем формы между
// смысловыми группами (документы/деньги/жильё и т.д.), а не рисуем 21 иконку.
const STEP_ICON_SVGS: Record<string, React.ReactNode> = {
  document: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  ),
  target: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  wallet: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="7" width="20" height="11" rx="2" />
      <circle cx="7.5" cy="12.5" r="1.4" />
      <circle cx="16.5" cy="12.5" r="1.4" />
    </svg>
  ),
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  ),
  card: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  health: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 5 6v6c0 5 3 8 7 9 4-1 7-4 7-9V6z" />
    </svg>
  ),
  percent: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.3" />
      <circle cx="17.5" cy="17.5" r="2.3" />
    </svg>
  ),
  pin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  briefcase: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  family: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
      <path d="M16 14.2a3.6 3.6 0 0 1 5 3.3V20" />
    </svg>
  ),
  truck: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="6" width="14" height="11" rx="1" />
      <path d="M15 10h4l3 3v4h-7z" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="17.5" cy="18.5" r="2" />
    </svg>
  ),
  compass: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5" />
    </svg>
  ),
};

const STEP_ICON_KEY: Record<string, keyof typeof STEP_ICON_SVGS> = {
  // foreign
  passport: "document",
  basis: "target",
  apostille: "document",
  money: "wallet",
  "home-ru": "home",
  bank: "card",
  sim: "phone",
  insurance: "health",
  rent: "home",
  residence: "shield",
  tax: "percent",
  // russia
  city: "pin",
  work: "briefcase",
  "money-ru": "wallet",
  kids: "family",
  lease: "home",
  registration: "shield",
  "move-things": "truck",
  clinic: "health",
  "docs-ru": "document",
  settle: "compass",
};

function StepIcon({ id }: { id: string }) {
  const key = STEP_ICON_KEY[id] ?? "document";
  return STEP_ICON_SVGS[key];
}

const GROUP_ICONS: Record<ChecklistGroupKey, React.ReactNode> = {
  before: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  arrival: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  month: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// iOS Safari, если сайт открыт как значок с домашнего экрана (standalone
// web-app — у нас в manifest.ts display: "standalone"), не поддерживает
// window.print(): вызов проходит без ошибки, но ничего не происходит —
// снаружи выглядит как «кнопка не работает». navigator.standalone — это
// iOS-специфичный флаг, true только в этом режиме, поэтому детект точный.
function isIOSStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function PrintButton() {
  const [hint, setHint] = useState(false);

  function handleClick() {
    if (isIOSStandalone()) {
      // В самом webview печать недоступна — открываем страницу в обычном
      // Safari, где window.print() работает штатно.
      window.open(window.location.href, "_blank", "noopener");
      setHint(true);
      return;
    }
    window.print();
  }

  return (
    <div className="no-print flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border hairline text-brandy/80 hover:text-cream hover:border-copper/40 transition text-sm"
        title="Распечатать или сохранить как PDF"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Скачать PDF
      </button>
      {hint && (
        <p className="text-xs text-brandy/50 max-w-[220px] text-right leading-snug">
          Открыли страницу в браузере — там нажмите «Скачать PDF» ещё раз и выберите «Сохранить в PDF».
        </p>
      )}
    </div>
  );
}

export function ChecklistClient({
  initialVariant = "foreign",
}: {
  initialVariant?: ChecklistVariant;
}) {
  const [variant, setVariant] = useState<ChecklistVariant>(initialVariant);
  const [openGroups, setOpenGroups] = useState<Record<ChecklistGroupKey, boolean>>({
    before: true,
    arrival: true,
    month: true,
  });

  const checked = useChecklist(variant);
  const steps = CHECKLIST_STEPS[variant];
  const done = steps.filter((s) => checked.includes(s.id)).length;
  const pct = Math.round((done / steps.length) * 100);
  const allDone = done === steps.length;

  // Границы групп на прогресс-баре (в %) — показывают три этапа переезда
  // визуально, не только как отдельные аккордеоны.
  const groupBoundaries = GROUP_ORDER.slice(0, -1).reduce<number[]>((acc, group, i) => {
    const upTo = GROUP_ORDER.slice(0, i + 1).reduce(
      (sum, g) => sum + steps.filter((s) => s.group === g).length,
      0,
    );
    acc.push((upTo / steps.length) * 100);
    return acc;
  }, []);

  function toggleGroup(group: ChecklistGroupKey) {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }

  return (
    <section className="max-w-3xl mx-auto px-6 pb-8">
      {/* Шапка с переключателем и кнопкой скачать */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 no-print">
        <div className="inline-flex rounded-pill border hairline bg-surface/60 p-1">
          {(Object.keys(VARIANT_LABELS) as ChecklistVariant[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`px-5 py-2 rounded-pill text-sm font-medium transition ${
                variant === v
                  ? "bg-copper text-pine-tree"
                  : "text-brandy/75 hover:text-cream"
              }`}
            >
              {VARIANT_LABELS[v]}
            </button>
          ))}
        </div>
        <PrintButton />
      </div>

      {/* Прогресс-бар */}
      <div className="rounded-2xl bg-surface border hairline p-5 mb-8 no-print">
        <div className="flex items-center gap-4 mb-3">
          {/* Кольцо прогресса — заметнее сухого процента текстом */}
          <div className="relative shrink-0 w-14 h-14" aria-hidden>
            <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-cream/8" />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 24}
                strokeDashoffset={2 * Math.PI * 24 * (1 - pct / 100)}
                className="text-copper transition-[stroke-dashoffset] duration-500 ease-out"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-copper font-bold tabular-nums text-sm">
              {pct}%
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-cream font-medium">
              Выполнено {done} из {steps.length}
            </span>
            {done === 0 && (
              <span className="block text-brandy/55 text-sm mt-0.5">Начните с первого пункта — дальше пойдёт легче</span>
            )}
            {done > 0 && !allDone && (
              <span className="block text-brandy/55 text-sm mt-0.5">Продолжайте, Вы справляетесь</span>
            )}
            {allDone && (
              <span className="block text-copper text-sm mt-0.5">Всё готово — можно выдыхать</span>
            )}
          </div>
        </div>
        <div className="relative h-2.5 rounded-full bg-cream/8 overflow-hidden">
          <div
            className="h-full bg-copper rounded-full transition-[width] duration-500 ease-out shadow-[0_0_10px_1px_rgba(232,155,110,0.5)]"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
          {groupBoundaries.map((b) => (
            <div
              key={b}
              className="absolute top-0 bottom-0 w-px bg-pine-tree/50"
              style={{ left: `${b}%` }}
              aria-hidden
            />
          ))}
        </div>
        {allDone && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-copper/25 bg-copper/10 px-4 py-3 fade-in">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-copper shrink-0" aria-hidden>
              <path d="M12 3v2M12 19v2M5 5l1.4 1.4M17.6 17.6 19 19M3 12h2M19 12h2M5 19l1.4-1.4M17.6 6.4 19 5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <div>
              <p className="text-copper font-serif text-base leading-tight">Чек-лист готов!</p>
              <p className="text-brandy/60 text-xs mt-0.5">Вы учли всё по плану — осталось только собрать чемодан.</p>
            </div>
          </div>
        )}
        {done > 0 && (
          <button
            type="button"
            onClick={() => writeChecked(variant, [])}
            className="mt-4 text-xs text-brandy/45 hover:text-copper/80 transition"
          >
            Сбросить все отметки
          </button>
        )}
      </div>

      {/* Группы-аккордеоны */}
      <div className="space-y-4">
        {GROUP_ORDER.map((group) => {
          const groupSteps = steps.filter((s) => s.group === group);
          if (!groupSteps.length) return null;
          const groupDone = groupSteps.filter((s) => checked.includes(s.id)).length;
          const isOpen = openGroups[group];

          return (
            <div
              key={group}
              className="rounded-2xl border hairline bg-surface overflow-hidden"
            >
              {/* Заголовок группы — кнопка аккордеона */}
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="no-print w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface-elevated/50 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-dingley/20 flex items-center justify-center text-muted shrink-0">
                  {GROUP_ICONS[group]}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-cream font-serif text-lg leading-tight">
                    {GROUP_LABELS[group]}
                  </span>
                  <span className="block text-brandy/55 text-sm mt-0.5">
                    {groupDone} из {groupSteps.length} выполнено
                  </span>
                </span>
                {groupDone === groupSteps.length && groupDone > 0 && (
                  <span className="shrink-0 text-xs font-medium text-copper bg-copper/12 px-2.5 py-1 rounded-pill">
                    Готово
                  </span>
                )}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className={`shrink-0 text-brandy/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Печатный заголовок группы (только при печати) */}
              <div className="print-only hidden px-5 pt-4 pb-2">
                <h2 className="font-bold text-base border-b border-gray-300 pb-2 mb-2">
                  {GROUP_LABELS[group]}
                </h2>
              </div>

              {/* Шаги */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0 no-print"
                }`}
              >
                <ul className="px-4 pb-4 space-y-2 print-visible">
                  {groupSteps.map((step) => {
                    const isDone = checked.includes(step.id);
                    return (
                      <li key={step.id}>
                        <div
                          className={`rounded-xl border transition-all duration-200 no-print ${
                            isDone
                              ? "bg-copper/8 border-copper/20"
                              : "bg-surface-elevated/40 border-hairline hover:border-copper/25 hover:bg-surface-elevated/70"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleStep(variant, step.id)}
                            aria-pressed={isDone}
                            className="w-full text-left flex gap-3 px-4 py-4"
                          >
                            {/* Иконка темы / галочка выполнения */}
                            <span
                              key={isDone ? "done" : "todo"}
                              className={`mt-0.5 shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                                isDone
                                  ? "bg-copper border-copper text-pine-tree animate-check-pop"
                                  : "border-brandy/25 text-brandy/50"
                              }`}
                              aria-hidden
                            >
                              {isDone ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <StepIcon id={step.id} />
                              )}
                            </span>
                            {/* Текст */}
                            <span className="min-w-0">
                              <span
                                className={`block font-medium text-sm md:text-base leading-snug transition-colors ${
                                  isDone ? "text-brandy/45 line-through" : "text-cream"
                                }`}
                              >
                                {step.title}
                              </span>
                              <span className={`block text-sm mt-1 text-pretty leading-relaxed ${isDone ? "text-brandy/35" : "text-brandy/65"}`}>
                                {step.description}
                              </span>
                            </span>
                          </button>

                          {/* Ссылка на статью блога/инструмент по теме шага —
                              вне кнопки, чтобы не было вложенных интерактивных
                              элементов и клик по ссылке не переключал чекбокс. */}
                          {step.link && (
                            <div className="pl-16 pr-4 pb-3.5 -mt-1">
                              <Link
                                href={step.link.href}
                                className="inline-flex items-center gap-1 text-xs font-medium text-copper/85 hover:text-copper transition"
                              >
                                {step.link.label}
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                  <polyline points="12 5 19 12 12 19" />
                                </svg>
                              </Link>
                            </div>
                          )}
                        </div>

                        {/* Печатный вариант шага */}
                        <div className="print-only hidden flex gap-3 py-2 border-b border-gray-100 last:border-0">
                          <span className="shrink-0 w-5 h-5 border border-gray-400 rounded flex items-center justify-center text-xs mt-0.5">
                            {isDone ? "✓" : ""}
                          </span>
                          <div>
                            <p className="font-medium text-sm text-black">{step.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 no-print inline-flex items-center gap-2 rounded-pill border hairline bg-surface/60 px-4 py-2 text-sm text-brandy/55">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Отметки хранятся в этом браузере и не передаются на сервер.
      </p>
    </section>
  );
}
