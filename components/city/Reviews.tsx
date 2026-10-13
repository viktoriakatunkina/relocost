import type { CityContent } from "@/lib/cities-content";
import { typo } from "@/lib/typography";
import { movedVerbRu } from "@/lib/gender";

function ReviewCard({
  r,
}: {
  r: CityContent["reviews"][number];
}) {
  return (
    <article className="relative shrink-0 w-[86%] sm:w-[70%] md:w-auto snap-center p-5 md:p-8 rounded-3xl bg-surface border hairline">
      <span className="absolute -top-1 left-4 md:-top-2 md:left-5 text-4xl md:text-6xl font-serif text-copper/40 leading-none select-none pointer-events-none" aria-hidden>
        ”
      </span>
      <blockquote className="text-cream/90 leading-relaxed text-pretty mb-4 md:mb-5 text-sm md:text-lg line-clamp-6 md:line-clamp-none">
        {typo(r.text)}
      </blockquote>
      {/* 2026-10-13 (маркетинговый аудит, решение Виктории): раньше здесь
          стояло конкретное имя ("Алексей, 32 года, разработчик, переехал в
          2024") — читалось как byline реального проверенного отзыва, хотя
          текст полностью написан редакцией. Имя больше не показываем —
          r.author используется только для рода глагола (movedVerbRu),
          остальное подаём как обезличенный архетип сценария. */}
      <footer className="text-xs md:text-sm text-brandy/70 flex items-center gap-2 flex-wrap">
        <span className="text-cream font-semibold">Типичный случай</span>
        {r.profession ? <span className="text-brandy/50">·</span> : null}
        {r.profession ? <span>{r.profession}</span> : null}
        {r.age ? <span className="text-brandy/50">·</span> : null}
        {r.age ? <span>{r.age} лет</span> : null}
        {r.moved_year ? <span className="text-brandy/50">·</span> : null}
        {r.moved_year ? (
          <span>
            {movedVerbRu(r.author)} в {r.moved_year}
          </span>
        ) : null}
      </footer>
    </article>
  );
}

export function Reviews({
  reviews,
}: {
  slug?: string;
  isForeign?: boolean;
  reviews: CityContent["reviews"];
}) {
  if (!reviews.length) return null;

  return (
    <section id="reviews" className="scroll-mt-[120px] pt-14 md:pt-20">
      <div className="max-w-6xl mx-auto px-6">
        <span className="eyebrow">Опыт</span>
        <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
          Типичный опыт переехавших
        </h2>
        <p className="text-brandy/55 text-xs md:text-sm mb-8 md:mb-10">
          Иллюстративные примеры по частым сценариям переезда — не отзывы конкретных людей.
        </p>
      </div>

      {/* Мобиль: горизонтальная карусель со свайпом — раньше карточки шли
          полноразмерным вертикальным списком и съедали весь экран на один
          отзыв (2026-09-09). Десктоп — прежняя сетка в 2 колонки. */}
      <div className="flex md:grid md:grid-cols-2 md:max-w-6xl md:mx-auto gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-6 md:px-6 pb-2 md:pb-0 scrollbar-none">
        {reviews.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>
    </section>
  );
}
