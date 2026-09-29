import { Link } from "@/i18n/navigation";

// Перелинковка на подстраницы городов — /city/[slug]/budget и /city/[slug]/prices.
//
// Зачем: 350 подстраниц (по 2 на каждый из 175 городов) целятся в конвертящие
// запросы («сколько денег нужно для переезда в …», «цены в … 2026»), но до
// 07.09.2026 на каждую вела ровно ОДНА внутренняя ссылка — из блока
// «Смотрите также» на родительской странице города. Для обхода и распределения
// веса этого мало. Блок ставится в конец подборок /list и рейтинга, где список
// городов уже есть и ссылки уместны по смыслу.

export function CityDeepLinks({
  cities,
  title,
  note,
}: {
  cities: { slug: string; name: string }[];
  title: string;
  note?: string;
}) {
  if (!cities.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-16">
      <h2 className="font-serif text-2xl md:text-3xl text-cream mb-2">{title}</h2>
      {note && <p className="text-brandy/60 text-sm mb-6 max-w-2xl">{note}</p>}
      {/* 2026-09-29: было похоже на голую текстовую таблицу — название
          города и два подчёркнутых-на-hover слова "бюджет"/"цены" без формы
          кнопки, непонятно, что это вообще кликабельно. Теперь каждая строка
          — карточка с явными пилюлями-ссылками. */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cities.map((c) => (
          <li
            key={c.slug}
            className="flex items-center justify-between gap-3 rounded-xl border hairline bg-surface/50 px-4 py-3 transition hover:border-copper/30 hover:bg-surface"
          >
            <span className="text-cream/90 text-sm truncate min-w-0">{c.name}</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <Link
                href={`/city/${c.slug}/budget`}
                className="px-2.5 py-1 rounded-pill border border-cream/15 text-brandy/85 text-xs font-medium hover:border-copper/50 hover:text-cream hover:bg-copper/10 transition"
              >
                Бюджет
              </Link>
              <Link
                href={`/city/${c.slug}/prices`}
                className="px-2.5 py-1 rounded-pill border border-cream/15 text-brandy/85 text-xs font-medium hover:border-copper/50 hover:text-cream hover:bg-copper/10 transition"
              >
                Цены
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
