import Link from "next/link";
import Image from "next/image";
import type { City } from "@/lib/types";
import { unsplashSrc } from "@/lib/unsplash";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButton } from "@/components/ShareButton";

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
  const photo = unsplashSrc(city.unsplash_url, { w: 1600, q: 80 });

  return (
    <section className="relative overflow-hidden">
      {photo ? (
        <Image
          src={photo}
          alt={`${city.name_ru} — ${city.country_ru}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/75 to-pine-tree/20" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(216,148,120,0.18), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-24">
        <Link
          href={`/country/${city.country_slug}`}
          className="inline-flex items-center gap-2 text-brandy/70 hover:text-copper text-sm mb-12 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Все города {city.country_ru === "Россия" ? "России" : `· ${city.country_ru}`}
        </Link>

        <div className="flex items-start gap-6 mb-8">
          <span className="text-7xl md:text-9xl leading-none drop-shadow-2xl" aria-hidden>
            {city.flag_emoji}
          </span>
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-copper" />
              <p className="text-copper uppercase text-xs tracking-[0.2em] font-medium">
                {city.country_ru}
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-8xl text-cream leading-[0.98] drop-shadow-2xl tracking-tight">
              {city.name_ru}
            </h1>
          </div>
        </div>

        {city.intro_text && (
          <p className="text-brandy/85 text-lg md:text-xl max-w-3xl leading-relaxed text-pretty mb-8">
            {city.intro_text}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {city.is_foreign ? <Tag>За рубежом</Tag> : <Tag>Внутри России</Tag>}
          {city.difficulty_score !== null && city.difficulty_score <= 2 && (
            <Tag accent>Простой переезд</Tag>
          )}
          {city.difficulty_score !== null && city.difficulty_score >= 4 && (
            <Tag>Сложный переезд</Tag>
          )}
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
      className={`px-4 py-1.5 rounded-pill backdrop-blur text-xs uppercase tracking-[0.15em] font-medium border ${
        accent
          ? "bg-copper/15 border-copper/40 text-copper"
          : "bg-pine-tree/60 border-cream/15 text-brandy"
      }`}
    >
      {children}
    </span>
  );
}
