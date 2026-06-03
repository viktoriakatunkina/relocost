import Link from "next/link";
import type { City } from "@/lib/types";

export function Verdict({
  a,
  b,
  scoreA,
  scoreB,
}: {
  a: City;
  b: City;
  scoreA: number;
  scoreB: number;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Итог
      </h2>
      <div className="rounded-3xl bg-gradient-to-br from-dingley/40 via-kombu-green to-pine-tree p-8 md:p-12 border border-dingley/40">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <Card city={a} score={scoreA} accent={scoreA > scoreB} />
          <Card city={b} score={scoreB} accent={scoreB > scoreA} />
        </div>
        <p className="text-brandy/80 text-sm leading-relaxed">
          Победитель по большему числу категорий — выгоднее по деньгам и
          легче по адаптации. Но финальный выбор зависит от приоритетов:
          климат, виза, сообщество, инфраструктура — у каждого свои.
        </p>
      </div>
    </section>
  );
}

function Card({
  city,
  score,
  accent,
}: {
  city: City;
  score: number;
  accent: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-2xl border ${
        accent
          ? "bg-pale-copper/20 border-pale-copper"
          : "bg-kombu-green/40 border-dingley/30"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl" aria-hidden>
          {city.flag_emoji}
        </span>
        <div>
          <h3 className="font-serif text-2xl text-cream">{city.name_ru}</h3>
          <p className="text-brandy/70 text-sm">{city.country_ru}</p>
        </div>
      </div>
      <p className="text-brandy/80 text-sm mb-5 leading-relaxed">
        {accent
          ? `Выигрывает в ${score} из 5 категорий — заметная разница для регулярных трат.`
          : `${score} из 5 — догоняет по основным расходам, но проигрывает по большинству.`}
      </p>
      <Link
        href={`/city/${city.slug}`}
        className="inline-block px-5 py-2.5 rounded-pill bg-pale-copper text-pine-tree text-sm font-semibold transition hover:bg-brandy"
      >
        Подробно про {city.name_ru} →
      </Link>
    </div>
  );
}
