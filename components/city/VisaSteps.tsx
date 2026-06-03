"use client";

import { useUnlocked, isUnlocked } from "@/lib/unlocked";
import { LockedSection } from "@/components/freemium/LockedSection";
import type { CityContent } from "@/lib/cities-content";

function StepItem({
  step,
  index,
}: {
  step: CityContent["visa_steps"][number];
  index: number;
}) {
  return (
    <li className="flex gap-5 p-6 rounded-2xl bg-kombu-green/40 border border-dingley/30">
      <span className="font-serif text-3xl text-pale-copper leading-none w-8 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3 className="font-serif text-xl text-cream mb-1.5">{step.title}</h3>
        <p className="text-brandy/90 leading-relaxed">{step.description}</p>
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
  // Для российских городов "виза" = регистрация, никаких замков
  const useLock = isForeign;
  const free = useLock ? steps.slice(0, 2) : steps;
  const locked = useLock ? steps.slice(2) : [];

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-2">
        {isForeign ? "Виза и документы" : "Регистрация и быт"}
      </h2>
      <p className="text-brandy/70 mb-8">
        {isForeign
          ? "Пошаговый план легализации — от въезда до долгосрочного статуса."
          : "Стандартная процедура для россиян при переезде внутри страны."}
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
              hint={`Ещё ${locked.length} шага: открытие счёта, аренда с регистрацией, путь к ВНЖ.`}
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
