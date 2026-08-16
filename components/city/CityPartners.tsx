// Блок партнёрских программ — только для зарубежных городов.
// Ссылки открываются в новой вкладке, rel="noopener noreferrer sponsored".

const TP_MARKER =
  process.env.NEXT_PUBLIC_TP_MARKER ?? "";
const CHEREHAPA_ID =
  process.env.NEXT_PUBLIC_CHEREHAPA_ID ?? "";

const PARTNERS = [
  {
    id: "aviasales",
    icon: "✈️",
    heading: "Авиабилеты",
    subheading: "Поиск дешёвых рейсов",
    cta: "Найти билет",
    href: `https://www.aviasales.ru/?marker=${TP_MARKER}`,
  },
  {
    id: "hotellook",
    icon: "🏠",
    heading: "Жильё на первое время",
    subheading: "Отели и апартаменты для старта",
    cta: "Найти жильё",
    href: `https://hotellook.ru/?marker=${TP_MARKER}`,
  },
  {
    id: "cherehapa",
    icon: "🛡️",
    heading: "Страховка",
    subheading: "Медицинская страховка для экспата",
    cta: "Оформить",
    href: `https://cherehapa.ru/?partnerId=${CHEREHAPA_ID}`,
  },
] as const;

export function CityPartners() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">ПАРТНЁРЫ</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-4 mb-10">
        Подготовьтесь к переезду
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PARTNERS.map((p) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="relative group flex flex-col gap-4 p-6 rounded-2xl bg-surface border hairline hover:bg-surface-elevated hover:border-copper/40 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Лейбл «Реклама» */}
            <span className="absolute top-3 right-3 text-[10px] text-brandy/40 uppercase tracking-widest">
              Реклама
            </span>

            <span className="text-3xl leading-none">{p.icon}</span>

            <div className="flex flex-col gap-1">
              <p className="text-cream font-semibold text-lg leading-tight">
                {p.heading}
              </p>
              <p className="text-brandy/70 text-sm leading-relaxed">
                {p.subheading}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 mt-auto self-start px-4 py-2 rounded-pill bg-copper text-pine-tree text-sm font-semibold group-hover:bg-brandy transition-colors">
              {p.cta}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
