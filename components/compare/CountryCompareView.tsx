import { Link } from "@/i18n/navigation";
import { formatRub } from "@/lib/cities";
import type { CountryCompareResult } from "@/lib/compare-countries";
import type { CountryCompareSide } from "@/lib/compare-countries";
import { countryIn, countryOf } from "@/lib/country-prepositional";

// Отрисовка сравнения СТРАН на /compare/<a>-vs-<b>. Отдельный компонент, а не
// переиспользование CompareHero/CompareTable: те завязаны на тип City (фото,
// слаг города, страна в подписи), а здесь сущность другая — страна с числом
// городов, агрегатом цен и справочными фактами (виза, язык, климат, налоги).

export function CountryCompareHero({
  data,
  headline,
}: {
  data: CountryCompareResult;
  headline?: string;
}) {
  const { a, b } = data;
  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-brandy/70 hover:text-copper text-sm mb-8 transition"
      >
        ← На главную
      </Link>
      <p className="text-copper uppercase text-sm tracking-wider mb-4">Сравнение стран</p>
      <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-cream leading-[1.05] mb-5 text-balance">
        {a.name_ru} или {b.name_ru} — где дешевле жить?
      </h1>
      <p className="text-brandy/85 text-lg md:text-xl mb-10 text-pretty">
        {headline ??
          "Сравниваем стоимость жизни, аренду, визовый режим и сложность переезда по реальным ценам."}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <HeroSide side={a} gradient={a.content?.hero_gradient} />
        <HeroSide side={b} gradient={b.content?.hero_gradient} />
      </div>
    </section>
  );
}

function HeroSide({ side, gradient }: { side: CountryCompareSide; gradient?: string }) {
  return (
    <Link
      href={`/country/${side.slug}`}
      className={`relative block aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br ${
        gradient ?? "from-kombu-green/60 to-pine-tree"
      } transition hover:-translate-y-1`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/30 to-transparent" />
      <div className="relative h-full p-5 md:p-7 flex flex-col justify-between">
        <span className="text-3xl md:text-5xl" aria-hidden>
          {side.flag_emoji}
        </span>
        <div>
          <p className="text-brandy/80 text-xs uppercase tracking-wider mb-1">
            {side.cityCount} {cityWord(side.cityCount)} в каталоге
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream">{side.name_ru}</h2>
          <p className="text-copper text-sm mt-2 tabular-nums">
            от {formatRub(side.cost.monthlySolo)}/мес
          </p>
        </div>
      </div>
    </Link>
  );
}

function cityWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "город";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "города";
  return "городов";
}

export function CountryCompareTable({ data }: { data: CountryCompareResult }) {
  const { a, b, lines } = data;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
        Стоимость жизни: {a.name_ru} против {b.name_ru}
      </h2>
      <p className="text-brandy/70 mb-8 max-w-3xl">
        Медианы по всем городам страны из базы Relocost, рубли в месяц на одного человека.
      </p>
      <div className="rounded-2xl bg-surface border hairline overflow-hidden">
        <div className="grid grid-cols-[1fr_minmax(5rem,auto)_minmax(5rem,auto)] md:grid-cols-[1.5fr_1fr_1fr] gap-2 md:gap-4 px-5 py-3 border-b hairline text-brandy/60 text-xs uppercase tracking-wider">
          <span>Категория</span>
          <span className="text-right truncate">{a.name_ru}</span>
          <span className="text-right truncate">{b.name_ru}</span>
        </div>
        {lines.map((l) => {
          const aWin = l.winner === "a";
          const bWin = l.winner === "b";
          const fmt = (n: number) => (l.unit === "rub" ? formatRub(n) : `${n}/5`);
          const badge =
            l.winner === "tie" || l.a <= 0 || l.b <= 0
              ? null
              : (() => {
                  const ratio = Math.max(l.a, l.b) / Math.min(l.a, l.b);
                  return ratio >= 2 ? `×${ratio.toFixed(1)}` : `+${Math.round((ratio - 1) * 100)}%`;
                })();
          return (
            <div
              key={l.key}
              className={`grid grid-cols-[1fr_minmax(5rem,auto)_minmax(5rem,auto)] md:grid-cols-[1.5fr_1fr_1fr] gap-2 md:gap-4 px-5 py-4 border-b border-dingley/20 last:border-0 items-center ${
                l.key === "monthly" ? "bg-surface-elevated/60" : ""
              }`}
            >
              <span className={`text-sm md:text-base ${l.key === "monthly" ? "text-cream font-medium" : "text-brandy/90"}`}>
                {l.label}
              </span>
              <span className={`text-right tabular-nums ${aWin ? "text-copper font-semibold" : "text-cream"}`}>
                {fmt(l.a)}
                {bWin && badge && <span className="ml-2 text-xs tabular-nums text-brandy/50">{badge}</span>}
              </span>
              <span className={`text-right tabular-nums ${bWin ? "text-copper font-semibold" : "text-cream"}`}>
                {fmt(l.b)}
                {aWin && badge && <span className="ml-2 text-xs tabular-nums text-brandy/50">{badge}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Справочные факты бок о бок: виза, язык, климат, налоги, ВНЖ. */
export function CountryCompareFacts({ data }: { data: CountryCompareResult }) {
  const { a, b } = data;
  const rows: { label: string; a?: string; b?: string }[] = [
    { label: "Виза для россиян", a: a.content?.visa_note, b: b.content?.visa_note },
    { label: "Язык", a: a.content?.language_note, b: b.content?.language_note },
    { label: "Климат", a: a.content?.climate, b: b.content?.climate },
    { label: "Налоги", a: a.content?.taxes_note, b: b.content?.taxes_note },
    { label: "ВНЖ и гражданство", a: a.content?.residency_note, b: b.content?.residency_note },
  ].filter((r) => r.a || r.b);
  if (rows.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
        Виза, язык и налоги: что отличается
      </h2>
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="rounded-2xl bg-surface border hairline p-5 md:p-6">
            <p className="text-copper text-xs uppercase tracking-wider mb-4">{r.label}</p>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <p className="text-cream font-medium mb-1.5 text-sm">
                  {a.flag_emoji} {a.name_ru}
                </p>
                <p className="text-brandy/80 text-sm leading-relaxed">{r.a ?? "Данных пока нет."}</p>
              </div>
              <div>
                <p className="text-cream font-medium mb-1.5 text-sm">
                  {b.flag_emoji} {b.name_ru}
                </p>
                <p className="text-brandy/80 text-sm leading-relaxed">{r.b ?? "Данных пока нет."}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Самые дешевые города обеих стран — перелинковка сравнение → города. */
export function CountryCompareCities({ data }: { data: CountryCompareResult }) {
  const { a, b } = data;
  const top = (s: CountryCompareSide) => s.cost.cities.slice(0, 5);
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
        Самые доступные города
      </h2>
      <p className="text-brandy/70 mb-8 max-w-3xl">
        Бюджет на одного человека в месяц. Разброс внутри страны часто больше, чем разница между
        странами, — выбирайте город, а не страну.
      </p>
      <div className="grid md:grid-cols-2 gap-5">
        {[a, b].map((s) => (
          <div key={s.slug} className="rounded-2xl bg-surface border hairline overflow-hidden">
            <div className="px-5 py-3 border-b hairline flex items-center gap-2">
              <span aria-hidden>{s.flag_emoji}</span>
              <Link href={`/country/${s.slug}`} className="text-cream font-medium hover:text-copper transition">
                Города {countryOf(s.slug, s.name_ru)}
              </Link>
            </div>
            {top(s).map((c) => (
              <div
                key={c.slug}
                className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-dingley/20 last:border-0"
              >
                <Link href={`/city/${c.slug}`} className="text-brandy/90 hover:text-copper transition text-sm">
                  {c.name_ru}
                </Link>
                <span className="text-cream tabular-nums text-sm">{formatRub(c.monthly)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Итоговый вердикт: кто победил по числу статей расходов. */
export function CountryCompareVerdict({ data }: { data: CountryCompareResult }) {
  const { a, b, scoreA, scoreB } = data;
  const leader = scoreA === scoreB ? null : scoreA > scoreB ? a : b;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
      <div className="rounded-3xl bg-surface-elevated border hairline p-6 md:p-8">
        <p className="text-copper text-xs uppercase tracking-wider mb-3">Счет по категориям</p>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-serif text-4xl md:text-5xl text-cream tabular-nums">
            {scoreA} : {scoreB}
          </span>
          <span className="text-brandy/70 text-sm">
            {a.name_ru} — {b.name_ru}
          </span>
        </div>
        <p className="text-brandy/85 leading-relaxed">
          {leader
            ? `По большинству статей расходов выгоднее ${countryIn(leader.slug, leader.name_ru)}. Это не приговор второй стране: виза, язык и климат часто перевешивают разницу в деньгах.`
            : "Счет равный — деньги не решают. Смотрите на визовый режим, язык и климат."}
        </p>
      </div>
    </section>
  );
}
