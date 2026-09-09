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
  isForeign,
  steps,
}: {
  slug?: string;
  isForeign: boolean;
  steps: CityContent["visa_steps"];
}) {
  return (
    <section id="visa" className="scroll-mt-[120px] max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Документы</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
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
        {steps.map((s, i) => (
          <StepItem key={i} step={s} index={i} />
        ))}
      </ol>
    </section>
  );
}
