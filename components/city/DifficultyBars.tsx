import {
  DIFFICULTY_LABELS,
  type CityContent,
} from "@/lib/cities-content";

export function DifficultyBars({
  breakdown,
}: {
  breakdown: CityContent["difficulty_breakdown"];
}) {
  const items = (
    Object.keys(breakdown) as Array<keyof typeof breakdown>
  ).map((k) => ({
    key: k,
    label: DIFFICULTY_LABELS[k],
    value: breakdown[k],
  }));

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-2">
        Сложность переезда
      </h2>
      <p className="text-brandy/70 mb-8">
        Оценка от 1 (легко) до 5 (трудно) по пяти параметрам.
      </p>
      <div className="space-y-5">
        {items.map((it) => (
          <div key={it.key} className="grid grid-cols-12 items-center gap-4">
            <span className="col-span-12 sm:col-span-4 text-brandy/90">
              {it.label}
            </span>
            <div className="col-span-10 sm:col-span-7 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`h-2 flex-1 rounded-full transition ${
                    n <= it.value
                      ? n <= 2
                        ? "bg-emerald-400/80"
                        : n === 3
                        ? "bg-amber-400/80"
                        : "bg-pale-copper"
                      : "bg-kombu-green/60"
                  }`}
                />
              ))}
            </div>
            <span className="col-span-2 sm:col-span-1 text-cream tabular-nums text-right">
              {it.value}/5
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
