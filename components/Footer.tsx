import Link from "next/link";

const SECTIONS = [
  {
    title: "Сервис",
    links: [
      { href: "/search", label: "Поиск городов" },
      { href: "/countries", label: "Все страны" },
      { href: "/favorites", label: "Избранное" },
      { href: "/blog", label: "Журнал" },
    ],
  },
  {
    title: "Направления",
    links: [
      { href: "/city/tbilisi", label: "Тбилиси" },
      { href: "/city/yerevan", label: "Ереван" },
      { href: "/city/istanbul", label: "Стамбул" },
      { href: "/city/bali", label: "Бали" },
    ],
  },
  {
    title: "Помощь",
    links: [
      { href: "/blog", label: "Гайды и подборки" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t hairline mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[1.5fr,repeat(3,1fr)] gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-2xl bg-copper text-pine-tree flex items-center justify-center font-serif text-xl font-semibold">
                R
              </span>
              <span className="font-serif text-2xl text-cream">Relocost</span>
            </div>
            <p className="text-brandy/70 text-sm max-w-xs leading-relaxed">
              Калькулятор стоимости переезда. Реальные цены и понятные гайды для жизни в новом городе.
            </p>
          </div>
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <div className="text-cream/80 text-xs uppercase tracking-[0.18em] mb-4">{s.title}</div>
              <ul className="space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-brandy/80 hover:text-copper text-sm transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-8 border-t hairline text-xs text-brandy/55">
          <p>© {year} Relocost. Цены — оценки на основе открытых источников.</p>
          <p>Сделано в России, с любовью к переменам.</p>
        </div>
      </div>
    </footer>
  );
}
