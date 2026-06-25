import { Link } from "@/i18n/navigation";

export function CountryHero({
  countryRu,
  flagEmoji,
  gradient,
  backHomeLabel,
  eyebrowLabel,
  citiesCountLabel,
}: {
  countryRu: string;
  flagEmoji: string | null;
  gradient: string;
  backHomeLabel: string;
  eyebrowLabel: string;
  citiesCountLabel: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/40 to-pine-tree/0" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-16 md:pt-16 md:pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brandy/70 hover:text-copper text-sm mb-8 md:mb-12 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {backHomeLabel}
        </Link>

        <div className="flex items-start gap-4 mb-5 md:gap-6 md:mb-6">
          {flagEmoji && (
            <span className="text-6xl md:text-9xl leading-none drop-shadow-2xl" aria-hidden>
              {flagEmoji}
            </span>
          )}
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-copper" />
              <p className="text-copper uppercase text-xs tracking-[0.2em] font-medium">
                {eyebrowLabel}
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-8xl text-cream leading-[0.98] tracking-tight">
              {countryRu}
            </h1>
          </div>
        </div>

        <p className="text-brandy/85 text-lg mt-6">{citiesCountLabel}</p>
      </div>
    </section>
  );
}
