import { Link } from "@/i18n/navigation";

// Блок перекрестных ссылок «Смотрите также» — плотная перелинковка между типами
// страниц (город ↔ страна ↔ сравнение ↔ рейтинг), как у Numbeo: помогает обходу
// поисковика и распределяет ссылочный вес по сайту. Чистый презентационный
// компонент: ссылки строит вызывающая страница из уже доступных данных (без
// новых запросов). Дубли по href отсекаются (напр. оба города одной страны).
export function CrossLinks({
  title = "Смотрите также",
  links,
}: {
  title?: string;
  links: { href: string; label: string }[];
}) {
  const seen = new Set<string>();
  const items = links.filter((l) => {
    if (!l.href || !l.label || seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
  if (items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16">
      <h2 className="font-serif text-2xl md:text-3xl text-cream mb-6">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {items.map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="px-4 py-2.5 rounded-pill bg-surface border hairline text-brandy/90 hover:text-copper hover:border-copper/40 transition text-sm"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
