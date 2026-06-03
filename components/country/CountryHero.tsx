import Link from "next/link";

export function CountryHero({
  countryRu,
  flagEmoji,
  citiesCount,
  gradient,
}: {
  countryRu: string;
  flagEmoji: string | null;
  citiesCount: number;
  gradient: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brandy/70 hover:text-pale-copper text-sm mb-10 transition"
        >
          ← На главную
        </Link>
        <div className="flex items-start gap-6 mb-6">
          {flagEmoji && (
            <span className="text-7xl md:text-8xl leading-none" aria-hidden>
              {flagEmoji}
            </span>
          )}
          <div>
            <p className="text-pale-copper uppercase text-sm tracking-wider mb-3">
              Страна
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-cream leading-[1.05]">
              {countryRu}
            </h1>
          </div>
        </div>
        <p className="text-brandy/80">
          {citiesCount === 0
            ? "Города пока не добавлены"
            : citiesCount === 1
            ? "1 город в каталоге"
            : `${citiesCount} городов в каталоге`}
        </p>
      </div>
    </section>
  );
}
