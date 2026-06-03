import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-24 px-6">
      <div className="relative max-w-6xl mx-auto rounded-[2rem] overflow-hidden border hairline">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 25% 15%, rgba(216,148,120,0.35), transparent 55%), radial-gradient(circle at 75% 85%, rgba(106,120,77,0.45), transparent 55%), linear-gradient(135deg, #2C3A24 0%, #1A2105 100%)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-noise opacity-30" aria-hidden />

        <div className="relative px-8 md:px-16 py-16 md:py-24 grid md:grid-cols-[1.4fr,1fr] gap-10 items-center">
          <div>
            <span className="eyebrow">Готовы начать?</span>
            <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 mb-6 text-balance">
              Считаем сколько денег <span className="text-copper">понадобится</span> в первый месяц
            </h2>
            <p className="text-brandy/85 text-lg md:text-xl max-w-xl text-pretty">
              Выберите город — собираем бюджет, расскажем про визу, документы и быт. Бесплатно.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="#popular"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy hover:shadow-glow"
              >
                Выбрать город
                <Arrow />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-pill border hairline text-cream/90 hover:text-cream hover:border-copper transition"
              >
                Все направления
              </Link>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-3">
            <Stat label="городов" value="27" />
            <Stat label="цен в базе" value="540" />
            <Stat label="статей" value="9" />
            <Stat label="обновление" value="2026" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-pine-tree/40 backdrop-blur p-5 border hairline">
      <div className="font-serif text-4xl text-cream leading-none">{value}</div>
      <div className="text-brandy/70 text-xs uppercase tracking-wider mt-2">{label}</div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
