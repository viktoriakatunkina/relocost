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

export function ChecklistClient({
  initialVariant = "foreign",
}: {
  initialVariant?: ChecklistVariant;
}) {
  const [variant, setVariant] = useState<ChecklistVariant>(initialVariant);
  const checked = useChecklist(variant);
  const steps = CHECKLIST_STEPS[variant];
  const done = steps.filter((s) => checked.includes(s.id)).length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <section className="max-w-3xl mx-auto px-6 pb-8">
      {/* Переключатель: заграница / Россия */}
      <div className="inline-flex rounded-pill border hairline bg-surface/60 p-1 mb-8">
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

      {/* Прогресс */}
      <div className="rounded-2xl bg-surface border hairline p-5 mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-cream font-medium">
            Готово {done} из {steps.length}
          </span>
          <span className="text-copper font-semibold tabular-nums">{pct}%</span>
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
            className="mt-4 text-xs text-brandy/55 hover:text-copper transition"
          >
            Сбросить отметки
          </button>
        )}
      </div>

      {/* Группы шагов */}
      <div className="space-y-10">
        {GROUP_ORDER.map((group) => {
          const groupSteps = steps.filter((s) => s.group === group);
          if (!groupSteps.length) return null;
          return (
            <div key={group}>
              <h2 className="font-serif text-2xl text-cream mb-4">
                {GROUP_LABELS[group]}
              </h2>
              <ul className="space-y-3">
                {groupSteps.map((step) => {
                  const isDone = checked.includes(step.id);
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => toggleStep(variant, step.id)}
                        aria-pressed={isDone}
                        className={`w-full text-left flex gap-4 rounded-2xl border p-4 md:p-5 transition ${
                          isDone
                            ? "bg-surface/40 border-copper/25"
                            : "bg-surface border-hairline hover:border-copper/25"
                        }`}
                      >
                        <span
                          className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                            isDone
                              ? "bg-copper border-copper text-pine-tree"
                              : "border-brandy/35"
                          }`}
                          aria-hidden
                        >
                          {isDone && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block font-medium ${
                              isDone ? "text-brandy/55 line-through" : "text-cream"
                            }`}
                          >
                            {step.title}
                          </span>
                          <span className="block text-sm text-brandy/70 mt-1 text-pretty">
                            {step.description}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-10 inline-flex items-center gap-2 rounded-pill border hairline bg-surface/60 px-4 py-2 text-sm text-brandy/65">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Отметки хранятся в этом браузере и не передаются на сервер.
      </p>
    </section>
  );
}
