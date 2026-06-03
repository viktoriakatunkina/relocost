import type { City } from "@/lib/types";

export function QuickFacts({ city }: { city: City }) {
  const facts = [
    { label: "Климат", value: city.climate },
    { label: "Язык", value: city.language },
    { label: "Валюта", value: city.currency },
    { label: "Перелёт из Москвы", value: city.flight_from_moscow },
  ].filter((f) => f.value);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {facts.map((f) => (
          <div
            key={f.label}
            className="p-5 rounded-2xl bg-kombu-green/50 border border-dingley/30"
          >
            <p className="text-brandy/60 text-xs uppercase tracking-wider mb-2">
              {f.label}
            </p>
            <p className="text-cream font-medium">{f.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
