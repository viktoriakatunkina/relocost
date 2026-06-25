import type { CityContent } from "@/lib/cities-content";
import { typo } from "@/lib/typography";

// #13: «Районы для жизни» — где селиться, характер района, аренда-ориентир, кому.
export function CityDistricts({
  districts,
}: {
  districts?: CityContent["districts"];
}) {
  if (!districts?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Где жить</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-10">
        Районы для жизни
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        {districts.map((d) => (
          <div
            key={d.name}
            className="p-6 md:p-7 rounded-3xl bg-surface border hairline transition hover:border-copper/30"
          >
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h3 className="font-serif text-2xl text-cream">{d.name}</h3>
              <span className="shrink-0 text-copper text-sm font-semibold whitespace-nowrap">
                {d.rent}
              </span>
            </div>
            <p className="text-brandy/85 leading-relaxed mb-4 text-pretty">
              {typo(d.vibe)}
            </p>
            <p className="text-sm text-brandy/65">
              <span className="text-brandy/45 uppercase tracking-[0.14em] text-[11px]">
                Кому подходит:{" "}
              </span>
              {typo(d.for_whom)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
