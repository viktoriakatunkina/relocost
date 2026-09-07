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
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
        {cities.map((c) => (
          <li
            key={c.slug}
            className="flex items-baseline justify-between gap-3 border-b hairline py-2"
          >
            <span className="text-brandy/85 truncate">{c.name}</span>
            <span className="shrink-0 text-brandy/45">
              <Link
                href={`/city/${c.slug}/budget`}
                className="text-brandy/80 hover:text-copper transition"
              >
                бюджет
              </Link>
              {" · "}
              <Link
                href={`/city/${c.slug}/prices`}
                className="text-brandy/80 hover:text-copper transition"
              >
                цены
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
