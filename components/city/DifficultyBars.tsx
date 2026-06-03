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
    <section className="max-w-4xl mx-auto px-6 pt-20">
      <span className="eyebrow">Оценка</span>
      <h2 className="font-serif text-4xl md:text-5xl text-cream mt-6 mb-3">
        Сложность переезда
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-xl text-pretty">
        Оценка от 1 (легко) до 5 (трудно) по пяти параметрам.
      </p>
      <div className="p-6 md:p-8 rounded-3xl bg-surface border hairline space-y-5">
        {items.map((it) => (
          <div key={it.key} className="grid grid-cols-12 items-center gap-4">
            <span className="col-span-12 sm:col-span-5 text-cream/90">
              {it.label}
            </span>
            <div className="col-span-10 sm:col-span-6 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`h-2 flex-1 rounded-full transition ${
                    n <= it.value
                      ? n <= 2
                        ? "bg-emerald-400"
                        : n === 3
                        ? "bg-amber-400"
                        : "bg-copper"
                      : "bg-cream/8"
                  }`}
                />
              ))}
            </div>
            <span className="col-span-2 sm:col-span-1 text-cream tabular-nums text-right font-semibold">
              {it.value}<span className="text-brandy/40">/5</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
