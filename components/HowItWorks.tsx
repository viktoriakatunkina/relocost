const STEPS = [
  {
    n: "01",
    title: "Выберите город",
    text: "27 направлений в России и за рубежом — с реальными ценами, визой и инфраструктурой.",
    icon: PinIcon,
  },
  {
    n: "02",
    title: "Посчитайте бюджет",
    text: "Калькулятор учтет аренду, еду, транспорт и быт. Получите честный месячный минимум.",
    icon: CalcIcon,
  },
  {
    n: "03",
    title: "Откройте детали",
    text: "Лучшие места, виза, документы, отзывы переехавших — все собрано на одной странице.",
    icon: BookIcon,
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow">Процесс</span>
          <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 text-balance">
            Как это работает
          </h2>
          <p className="text-brandy/80 text-lg max-w-xl mx-auto mt-4 text-pretty">
            Три шага от мысли «а где лучше?» до собранного бюджета и плана переезда.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="relative p-8 rounded-3xl bg-surface border hairline overflow-hidden group transition-all duration-300 hover:bg-surface-elevated hover:-translate-y-1"
              >
                <div className="absolute -top-6 -right-6 font-serif text-[8rem] text-pale-copper/8 leading-none select-none pointer-events-none">
                  {s.n}
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-pale-copper/15 text-copper flex items-center justify-center mb-6 group-hover:bg-pale-copper/25 transition">
                    <Icon />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-copper font-mono text-sm tracking-wider">{s.n}</span>
                    <span className="h-px flex-1 bg-pale-copper/25" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-cream mb-3">{s.title}</h3>
                  <p className="text-brandy/85 leading-relaxed text-pretty">{s.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function CalcIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2"/>
      <line x1="8" y1="7" x2="16" y2="7"/>
      <line x1="8" y1="12" x2="10" y2="12"/>
      <line x1="13" y1="12" x2="14" y2="12"/>
      <line x1="16" y1="12" x2="16" y2="12"/>
      <line x1="8" y1="16" x2="10" y2="16"/>
      <line x1="13" y1="16" x2="14" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}
