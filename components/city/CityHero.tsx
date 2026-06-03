import Link from "next/link";
import type { City } from "@/lib/types";

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
};

export function CityHero({ city }: { city: City }) {
  const gradient =
    GRADIENTS[city.slug] ?? "from-kombu-green/60 via-pine-tree to-pine-tree";
  return (
    <section className="relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-20">
        <Link
          href={`/country/${city.country_slug}`}
          className="inline-flex items-center gap-2 text-brandy/70 hover:text-pale-copper text-sm mb-10 transition"
        >
          ← Все города {city.country_ru === "Россия" ? "России" : `· ${city.country_ru}`}
        </Link>
        <div className="flex items-start gap-6 mb-8">
          <span className="text-7xl md:text-8xl leading-none" aria-hidden>
            {city.flag_emoji}
          </span>
          <div>
            <p className="text-pale-copper uppercase text-sm tracking-wider mb-3">
              {city.country_ru}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-cream leading-[1.05]">
              {city.name_ru}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {city.is_foreign ? (
            <Tag>За рубежом</Tag>
          ) : (
            <Tag>Внутренняя миграция</Tag>
          )}
          {city.difficulty_score !== null && city.difficulty_score <= 2 && (
            <Tag>Простой переезд</Tag>
          )}
          {city.difficulty_score !== null && city.difficulty_score >= 4 && (
            <Tag>Сложный переезд</Tag>
          )}
          {city.is_popular && <Tag>Популярное направление</Tag>}
        </div>
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-4 py-1.5 rounded-pill border border-dingley/50 text-brandy text-xs uppercase tracking-wider">
      {children}
    </span>
  );
}
