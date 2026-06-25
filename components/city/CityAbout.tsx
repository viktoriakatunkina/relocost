import { typo } from "@/lib/typography";

// #17: развёрнутое описание города (intro_long) — SEO-«тело» страницы.
// Рендерится только если текст задан (флагманы); абзацы разделяются \n\n.
export function CityAbout({
  cityName,
  text,
}: {
  cityName: string;
  text?: string;
}) {
  if (!text) return null;
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">О городе</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-8">
        Жизнь в {cityName}
      </h2>
      <div className="space-y-4 text-brandy/90 text-lg leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-pretty">
            {typo(p)}
          </p>
        ))}
      </div>
    </section>
  );
}
