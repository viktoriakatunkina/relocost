import type { CityContent } from "@/lib/cities-content";
import { typo } from "@/lib/typography";

// #14 + #16: «Работа и удалёнка» — рынок труда, зарплаты, сферы, связь/интернет.
export function CityWork({
  cityName,
  work,
}: {
  cityName: string;
  work?: CityContent["work"];
}) {
  if (!work) return null;

  const stats: { label: string; value: string }[] = [
    { label: "Зарплаты", value: work.salary },
    { label: "Удалённая работа", value: work.remote },
    { label: "Интернет и связь", value: work.internet },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Работа и удалёнка</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-8">
        Работа в {cityName}
      </h2>

      <p className="text-brandy/90 text-lg leading-relaxed max-w-3xl mb-8 text-pretty">
        {typo(work.summary)}
      </p>

      {work.sectors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {work.sectors.map((s) => (
            <span
              key={s}
              className="px-3.5 py-2 rounded-pill bg-surface border hairline text-brandy/85 text-sm"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-6 rounded-3xl bg-surface border hairline"
          >
            <div className="text-copper text-[11px] uppercase tracking-[0.16em] mb-2.5">
              {s.label}
            </div>
            <p className="text-cream/90 leading-relaxed text-pretty">
              {typo(s.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
