import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function CTABanner({
  cityCount,
  countryCount,
}: {
  cityCount: number;
  countryCount: number;
}) {
  const t = await getTranslations("cta");
  const th = await getTranslations("home");

  return (
    <section className="py-12 px-6">
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

        <div className="relative px-6 md:px-16 py-12 md:py-24 grid md:grid-cols-[1.4fr,1fr] gap-10 items-center">
          <div>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-cream mt-6 mb-6 text-balance">
              {t("titlePre")}
              <span className="text-copper">{t("titleAccent")}</span>
              {t("titlePost")}
            </h2>
            <p className="text-brandy/85 text-lg md:text-xl max-w-xl text-pretty">
              {t("text")}
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy hover:shadow-glow"
              >
                {t("chooseCity")}
                <Arrow />
              </Link>
              <Link
                href="/countries"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-pill border hairline text-cream/90 hover:text-cream hover:border-copper transition"
              >
                {t("chooseCountry")}
              </Link>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-3">
            <Stat
              label={th("statCities")}
              value={String(cityCount)}
              description="Азия, Европа, СНГ и Ближний Восток"
              accent="#E89B6E"
            />
            <Stat
              label={th("statCountries")}
              value={String(countryCount)}
              description="Все направления — безвиз и виза"
              accent="#E0A93E"
            />
            <Stat
              label={t("statRealPrices")}
              value="✓"
              description="Аренда, еда, транспорт — из открытых источников, не с потолка"
            />
            <Stat
              label={t("statVisa")}
              value="✓"
              description="Как въехать россиянину, сколько можно жить без визы"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  description,
  accent,
}: {
  label: string;
  value: string;
  description?: string;
  accent?: string;
}) {
  const isCheck = value === "✓";
  return (
    <div className="rounded-2xl bg-pine-tree/50 backdrop-blur border hairline p-5 flex flex-col gap-1.5">
      <div
        className="font-serif leading-none tabular-nums lining-nums"
        style={{
          fontSize: isCheck ? "2rem" : "2.5rem",
          color: isCheck ? "#E89B6E" : (accent ?? "#F6F1E8"),
        }}
      >
        {value}
      </div>
      <div className="text-cream/90 text-xs font-semibold uppercase tracking-wider">{label}</div>
      {description && (
        <div className="text-brandy/60 text-xs leading-snug mt-0.5">{description}</div>
      )}
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
