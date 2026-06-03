import type { CityContent } from "@/lib/cities-content";

export function VisaSteps({ steps }: { steps: CityContent["visa_steps"] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-2">
        Виза и документы
      </h2>
      <p className="text-brandy/70 mb-8">
        Пошаговый план легализации — от въезда до получения долгосрочного статуса.
      </p>
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li
            key={i}
            className="flex gap-5 p-6 rounded-2xl bg-kombu-green/40 border border-dingley/30"
          >
            <span className="font-serif text-3xl text-pale-copper leading-none w-8 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-serif text-xl text-cream mb-1.5">
                {s.title}
              </h3>
              <p className="text-brandy/90 leading-relaxed">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
