import Link from "next/link";
import type { City } from "@/lib/types";

const GRADIENTS: Record<string, string> = {
  tbilisi: "from-rose-900/70 to-pine-tree",
  yerevan: "from-orange-900/70 to-pine-tree",
  belgrade: "from-violet-900/70 to-pine-tree",
  dubai: "from-amber-900/70 to-pine-tree",
  bali: "from-emerald-900/70 to-pine-tree",
  bangkok: "from-yellow-900/70 to-pine-tree",
  almaty: "from-sky-900/70 to-pine-tree",
  krasnodar: "from-red-900/70 to-pine-tree",
  sochi: "from-blue-900/70 to-pine-tree",
  kaliningrad: "from-slate-700/70 to-pine-tree",
  moscow: "from-zinc-700/70 to-pine-tree",
  spb: "from-indigo-900/70 to-pine-tree",
  istanbul: "from-red-800/70 to-pine-tree",
  alanya: "from-teal-800/70 to-pine-tree",
  limassol: "from-cyan-900/70 to-pine-tree",
  budapest: "from-emerald-800/70 to-pine-tree",
  lisbon: "from-amber-700/70 to-pine-tree",
};

export function CompareHero({ a, b }: { a: City; b: City }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-brandy/70 hover:text-pale-copper text-sm mb-8 transition"
      >
        ← На главную
      </Link>
      <p className="text-pale-copper uppercase text-sm tracking-wider mb-4">
        Сравнение
      </p>
      <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mb-10">
        {a.name_ru} или {b.name_ru} — где жить?
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <Side city={a} />
        <Side city={b} />
      </div>
    </section>
  );
}

function Side({ city }: { city: City }) {
  const gradient =
    GRADIENTS[city.slug] ?? "from-kombu-green/60 to-pine-tree";
  return (
    <Link
      href={`/city/${city.slug}`}
      className={`relative block aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} transition hover:-translate-y-1`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/30 to-transparent" />
      <div className="relative h-full p-5 md:p-7 flex flex-col justify-between">
        <span className="text-4xl md:text-5xl" aria-hidden>
          {city.flag_emoji}
        </span>
        <div>
          <p className="text-brandy/80 text-xs uppercase tracking-wider mb-1">
            {city.country_ru}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream">
            {city.name_ru}
          </h2>
        </div>
      </div>
    </Link>
  );
}
