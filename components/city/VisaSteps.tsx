"use client";

import { useUnlocked, isUnlocked } from "@/lib/unlocked";
import { LockedSection } from "@/components/freemium/LockedSection";
import type { CityContent } from "@/lib/cities-content";
import { typo } from "@/lib/typography";

function StepItem({
  step,
  index,
}: {
  step: CityContent["visa_steps"][number];
  index: number;
}) {
  return (
    <li className="flex gap-5 p-6 md:p-7 rounded-3xl bg-surface border hairline hover:border-copper/25 transition">
      <span className="font-serif text-3xl md:text-4xl text-copper leading-none w-10 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h3 className="font-serif text-xl md:text-2xl text-cream mb-2 text-pretty">
          {typo(step.title)}
        </h3>
        <p className="text-brandy/85 leading-relaxed text-pretty">
          {typo(step.description)}
        </p>
      </div>
    </li>
  );
}

export function VisaSteps({
  slug,
  isForeign,
  steps,
}: {
  slug: string;
  isForeign: boolean;
  steps: CityContent["visa_steps"];
}) {
  const unlocked = useUnlocked(slug);
  const opened = isUnlocked(unlocked, "guide");
  const useLock = isForeign;
  const free = useLock ? steps.slice(0, 2) : steps;
  const locked = useLock ? steps.slice(2) : [];

  return (
    <section className="max-w-4xl mx-auto px-6 pt-20">
      <span className="eyebrow">Документы</span>
      <h2 className="font-serif text-4xl md:text-5xl text-cream mt-6 mb-3">
        {isForeign ? "Виза и легализация" : "Регистрация и быт"}
      </h2>
      <p className="text-brandy/75 text-lg mb-10 max-w-xl text-pretty">
        {typo(
          isForeign
            ? "Пошаговый план легализации — от въезда до долгосрочного статуса."
            : "Стандартная процедура для россиян при переезде внутри страны.",
        )}
      </p>

      <ol className="space-y-4">
        {free.map((s, i) => (
          <StepItem key={i} step={s} index={i} />
        ))}
      </ol>

      {locked.length > 0 && (
        <div className="mt-5">
          {opened ? (
            <ol className="space-y-4" start={free.length + 1}>
              {locked.map((s, i) => (
                <StepItem key={i} step={s} index={i + free.length} />
              ))}
            </ol>
          ) : (
            <LockedSection
              slug={slug}
              pkg="guide"
              hint={`Еще ${locked.length} шага: открытие счета, аренда с регистрацией, путь к ВНЖ.`}
            >
              <ol className="space-y-4">
                {locked.map((s, i) => (
                  <StepItem key={i} step={s} index={i + free.length} />
                ))}
              </ol>
            </LockedSection>
          )}
        </div>
      )}
    </section>
  );
}
