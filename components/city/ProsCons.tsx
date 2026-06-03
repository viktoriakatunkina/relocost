export function ProsCons({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Плюсы и минусы
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
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
  const accent = variant === "pros" ? "text-emerald-300" : "text-pale-copper";
  const symbol = variant === "pros" ? "+" : "−";
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-kombu-green/40 border border-dingley/30">
      <h3 className="font-serif text-2xl text-cream mb-5">{title}</h3>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-brandy/90">
            <span className={`${accent} font-semibold text-lg leading-none mt-0.5`}>
              {symbol}
            </span>
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
