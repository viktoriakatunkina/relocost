const STEPS = [
  {
    n: "01",
    title: "Выбери город",
    text: "Десятки направлений в России и за рубежом — каждый с реальными ценами и условиями.",
  },
  {
    n: "02",
    title: "Посчитай бюджет",
    text: "Калькулятор учтёт аренду, еду, транспорт и быт. Получишь честный месячный минимум.",
  },
  {
    n: "03",
    title: "Открой детали",
    text: "Лучшие места, виза, документы, отзывы переехавших — за чашку кофе.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-cream text-center mb-16">
          Как это работает
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="p-8 rounded-2xl bg-kombu-green/50 border border-dingley/30"
            >
              <div className="text-pale-copper font-serif text-3xl mb-4">
                {s.n}
              </div>
              <h3 className="font-serif text-2xl text-cream mb-3">
                {s.title}
              </h3>
              <p className="text-brandy/90 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
