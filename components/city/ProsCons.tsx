import { typo } from "@/lib/typography";

export function ProsCons({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <span className="eyebrow">За и против</span>
      <h2 className="font-serif text-4xl md:text-5xl text-cream mt-6 mb-10">
        Плюсы и минусы
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        <Column title="Сильные стороны" items={pros} variant="pros" />
        <Column title="Что учитывать" items={cons} variant="cons" />
      </div>
    </section>
  );
}

function Column({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "pros" | "cons";
}) {
  const isPro = variant === "pros";
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-surface border hairline">
      <div className="flex items-center gap-3 mb-6">
        <span
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold ${
            isPro
              ? "bg-emerald-400/15 text-emerald-300"
              : "bg-copper/15 text-copper"
          }`}
          aria-hidden
        >
          {isPro ? "+" : "−"}
        </span>
        <h3 className="font-serif text-2xl text-cream">{title}</h3>
      </div>
      <ul className="space-y-3.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-cream/90 leading-relaxed text-pretty">
            <span
              className={`mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                isPro ? "bg-emerald-400" : "bg-copper"
              }`}
              aria-hidden
            />
            <span>{typo(it)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
