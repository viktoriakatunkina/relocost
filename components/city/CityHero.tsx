import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { City } from "@/lib/types";
import { photoSrc } from "@/lib/photo";
import { getDifficulty } from "@/lib/difficulty";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButton } from "@/components/ShareButton";
import { typo } from "@/lib/typography";

const GRADIENTS: Record<string, string> = {
  tbilisi: "from-rose-900/70 via-pine-tree to-pine-tree",
  yerevan: "from-orange-900/70 via-pine-tree to-pine-tree",
  belgrade: "from-violet-900/70 via-pine-tree to-pine-tree",
  dubai: "from-amber-900/70 via-pine-tree to-pine-tree",
  bali: "from-emerald-900/70 via-pine-tree to-pine-tree",
  bangkok: "from-yellow-900/70 via-pine-tree to-pine-tree",
  almaty: "from-sky-900/70 via-pine-tree to-pine-tree",
  krasnodar: "from-red-900/70 via-pine-tree to-pine-tree",
  sochi: "from-blue-900/70 via-pine-tree to-pine-tree",
  kaliningrad: "from-slate-700/70 via-pine-tree to-pine-tree",
  moscow: "from-zinc-700/70 via-pine-tree to-pine-tree",
  spb: "from-indigo-900/70 via-pine-tree to-pine-tree",
  istanbul: "from-red-800/70 via-pine-tree to-pine-tree",
  alanya: "from-teal-800/70 via-pine-tree to-pine-tree",
  limassol: "from-cyan-900/70 via-pine-tree to-pine-tree",
  budapest: "from-emerald-800/70 via-pine-tree to-pine-tree",
  lisbon: "from-amber-700/70 via-pine-tree to-pine-tree",
};

export function CityHero({ city }: { city: City }) {
  const gradient =
    GRADIENTS[city.slug] ?? "from-kombu-green/60 via-pine-tree to-pine-tree";
  const photo = photoSrc(city.image_url, city.unsplash_url, { w: 1600, q: 80 });
  const difficulty = getDifficulty(city);

  return (
    <section className="relative overflow-hidden bg-pine-tree">
      {photo ? (
        <Image
          src={photo}
          alt={`${city.name_ru} — ${city.country_ru}`}
          fill
          priority
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          quality={72}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEElEQVR42mOQUmSFIwbiOABphAQBZ5neoAAAAABJRU5ErkJggg=="
          className="object-cover"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          aria-hidden
        />
      )}
      {/* Базовое затемнение, чтобы яркие фото не съедали текст */}
      <div className="absolute inset-0 bg-pine-tree/35" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/85 to-pine-tree/55" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-pine-tree/55 via-transparent to-transparent" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(216,148,120,0.18), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-16 md:pt-16 md:pb-24">
        <Link
          href={`/country/${city.country_slug}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-black/55 backdrop-blur-md border border-cream/20 text-cream hover:text-copper hover:border-copper/40 text-sm mb-8 md:mb-12 transition shadow-card"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Все города {city.country_ru === "Россия" ? "России" : `· ${city.country_ru}`}
        </Link>

        <div className="flex items-start gap-4 mb-6 md:gap-6 md:mb-8">
          <span className="text-6xl md:text-9xl leading-none drop-shadow-2xl" aria-hidden>
            {city.flag_emoji}
          </span>
          <div className="pt-2">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2.5 px-3 py-1 rounded-pill bg-black/50 backdrop-blur-md border border-cream/15">
                <span className="h-px w-7 bg-copper" />
                <span className="text-copper uppercase text-xs tracking-[0.2em] font-semibold text-shadow-body">
                  {city.country_ru}
                </span>
              </span>
            </div>
            <h1 className="font-serif text-cream leading-[0.98] tracking-tight text-shadow-hero">
              <span className="block text-4xl md:text-8xl">{city.name_ru}</span>
              <span className="block mt-3 font-sans text-base md:text-lg text-brandy/90 uppercase tracking-[0.2em] font-medium">
                Стоимость жизни в 2026 году
              </span>
            </h1>
          </div>
        </div>

        {city.intro_text && (
          <p className="text-cream/95 text-lg md:text-xl max-w-3xl leading-relaxed text-pretty mb-8 text-shadow-body">
            {typo(city.intro_text)}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {city.is_foreign ? <Tag>За рубежом</Tag> : <Tag>Внутри России</Tag>}
          {difficulty?.label === "Легко" && <Tag accent>Простой переезд</Tag>}
          {difficulty?.label === "Сложно" && <Tag>Сложный переезд</Tag>}
          {city.is_popular && <Tag>Популярное</Tag>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FavoriteButton
            slug={city.slug}
            cityName={city.name_ru}
            variant="hero"
          />
          <ShareButton
            title={`Стоимость жизни в ${city.name_ru} — Relocost`}
            text={`Сколько стоит жить в ${city.name_ru}? Калькулятор, цены, виза.`}
          />
        </div>
      </div>
    </section>
  );
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`px-4 py-1.5 rounded-pill backdrop-blur-md text-xs uppercase tracking-[0.15em] font-medium border ${
        accent
          ? "bg-copper/25 border-copper/50 text-cream"
          : "bg-pine-tree/75 border-cream/20 text-cream/95"
      }`}
    >
      {children}
    </span>
  );
}
