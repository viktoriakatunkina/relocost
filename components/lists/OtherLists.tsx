import { Link } from "@/i18n/navigation";
import { LISTS } from "@/lib/lists";

// «Другие подборки» — перелинковка между лендингами /list.
//
// До 07.09.2026 на 9 из 14 подборок не вело НИ ОДНОЙ внутренней ссылки: в
// футере жили только 5. Блок ставится в конец каждой подборки и связывает их
// между собой (заодно ведёт пользователя из «до 50 000 ₽» в «50–80 000 ₽»
// и из «зимовки» в «тёплые страны» — это соседние по смыслу шаги выбора).

export function OtherLists({ currentSlug }: { currentSlug: string }) {
  const others = LISTS.filter((l) => l.slug !== currentSlug);
  if (!others.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-16">
      <h2 className="font-serif text-2xl md:text-3xl text-cream mb-6">
        Другие подборки
      </h2>
      <div className="flex flex-wrap gap-3">
        {others.map((l) => (
          <Link
            key={l.slug}
            href={`/list/${l.slug}`}
            className="px-4 py-2.5 rounded-pill bg-surface border hairline text-brandy/90 hover:text-copper hover:border-copper/40 transition text-sm"
          >
            {l.shortTitle}
          </Link>
        ))}
      </div>
    </section>
  );
}
