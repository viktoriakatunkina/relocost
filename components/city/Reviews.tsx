import type { CityContent } from "@/lib/cities-content";

export function Reviews({ reviews }: { reviews: CityContent["reviews"] }) {
  if (!reviews.length) return null;
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Отзывы переехавших
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        {reviews.map((r, i) => (
          <article
            key={i}
            className="p-6 md:p-8 rounded-2xl bg-kombu-green/40 border border-dingley/30"
          >
            <blockquote className="text-brandy/90 leading-relaxed mb-5">
              «{r.text}»
            </blockquote>
            <footer className="text-sm text-brandy/70">
              <span className="text-cream font-medium">{r.author}</span>
              {r.age ? `, ${r.age}` : ""}
              {r.profession ? ` · ${r.profession}` : ""}
              {r.moved_year ? ` · переехал(а) в ${r.moved_year}` : ""}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
