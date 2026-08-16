"use client";

import { useState } from "react";
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

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border hairline text-brandy/80 hover:text-cream hover:border-copper/40 transition text-sm"
      title="Распечатать или сохранить как PDF"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      Скачать PDF
    </button>
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
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-cream font-medium">
              Выполнено {done} из {steps.length}
            </span>
            {done > 0 && done < steps.length && (
              <span className="text-brandy/55 text-sm ml-2">— продолжайте, Вы справляетесь</span>
            )}
            {done === steps.length && (
              <span className="text-copper text-sm ml-2">— чек-лист завершен!</span>
            )}
          </div>
          <span className="text-copper font-bold tabular-nums text-lg leading-none">{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-cream/8 overflow-hidden">
          <div
            className="h-full bg-copper rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
        </div>
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
                        <button
                          type="button"
                          onClick={() => toggleStep(variant, step.id)}
                          aria-pressed={isDone}
                          className={`w-full text-left flex gap-4 rounded-xl border px-4 py-4 transition-all duration-200 no-print ${
                            isDone
                              ? "bg-copper/8 border-copper/20"
                              : "bg-surface-elevated/40 border-hairline hover:border-copper/25 hover:bg-surface-elevated/70"
                          }`}
                        >
                          {/* Чекбокс */}
                          <span
                            className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                              isDone
                                ? "bg-copper border-copper text-pine-tree"
                                : "border-brandy/30"
                            }`}
                            aria-hidden
                          >
                            {isDone && (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
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
