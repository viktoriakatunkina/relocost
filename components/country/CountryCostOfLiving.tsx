import { Link } from "@/i18n/navigation";
import { formatRub } from "@/lib/cities";
import type { CountryCost } from "@/lib/country-cost";

// Главный блок страницы страны: отвечает на запрос «стоимость жизни в <стране>
// 2026» / «сколько стоит жить в <стране>» — тот самый интент, который
// Яндекс.Suggest отдает на уровне СТРАН, а не городов. До появления этого
// блока страница страны не показывала ни одной цифры бюджета.
//
// Порядок внутри блока рассчитан на быстрый ответ в выдаче: сначала таблица
// «сколько нужно в месяц» (одному / паре / семье), затем разбор по категориям,
// затем разброс по городам с ссылками на их страницы.

export type CountryCostLabels = {
  title: string;
  subtitle: string;
  colBudget: string;
  colEconomy: string;
  colComfort: string;
  rowSolo: string;
  rowCouple: string;
  rowFamily: string;
  categoriesTitle: string;
  colCategory: string;
  colMedian: string;
  colCities: string;
  byCityTitle: string;
  colCity: string;
  colRent: string;
  colMonthly: string;
  methodTitle: string;
  method: string;
  costNoteTitle: string;
};

export function CountryCostOfLiving({
  cost,
  labels,
  summary,
  costNote,
}: {
  cost: CountryCost;
  labels: CountryCostLabels;
  summary: string[];
  /** Ручной абзац из COUNTRY_CONTENT.cost_note — контекст, которого нет в цифрах. */
  costNote?: string;
}) {
  // Комфортный бюджет пары/семьи оцениваем той же надбавкой, что и для одного
  // (отношение комфорт/эконом), чтобы не заводить второй набор множителей.
  const comfortRatio = cost.monthlySolo > 0 ? cost.monthlyComfort / cost.monthlySolo : 1.4;
  const rows = [
    { label: labels.rowSolo, economy: cost.monthlySolo, comfort: cost.monthlyComfort },
    { label: labels.rowCouple, economy: cost.monthlyCouple, comfort: Math.round(cost.monthlyCouple * comfortRatio) },
    { label: labels.rowFamily, economy: cost.monthlyFamily, comfort: Math.round(cost.monthlyFamily * comfortRatio) },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">{labels.title}</h2>
      <p className="text-brandy/70 mb-8 max-w-3xl">{labels.subtitle}</p>

      {/* Быстрый ответ: сколько нужно в месяц по составу семьи */}
      <div className="rounded-2xl bg-surface border hairline overflow-hidden mb-10">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 md:gap-4 px-4 sm:px-5 py-3 border-b hairline text-brandy/60 text-xs uppercase tracking-wider">
          <span>{labels.colBudget}</span>
          <span className="text-right">{labels.colEconomy}</span>
          <span className="text-right">{labels.colComfort}</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 md:gap-4 px-4 sm:px-5 py-4 border-b border-dingley/20 last:border-0 items-center"
          >
            <span className="text-brandy/90 text-sm md:text-base">{r.label}</span>
            <span className={`text-right tabular-nums ${i === 0 ? "text-copper font-semibold text-lg" : "text-cream"}`}>
              {formatRub(r.economy)}
            </span>
            <span className="text-right tabular-nums text-cream/80">{formatRub(r.comfort)}</span>
          </div>
        ))}
      </div>

      {summary.map((p, i) => (
        <p key={i} className="text-brandy/85 leading-relaxed mb-4 max-w-3xl">
          {p}
        </p>
      ))}

      {/* Что двигает бюджет именно здесь — единственный неавтоматический абзац
          блока. Выделен рамкой, потому что это самая полезная часть для того,
          кто уже увидел цифры и хочет понять, чего в них не хватает. */}
      {costNote && (
        <div className="mt-6 rounded-2xl border-l-2 border-copper/50 bg-surface/60 px-5 py-4 max-w-3xl">
          <p className="text-copper text-xs uppercase tracking-wider mb-2">
            {labels.costNoteTitle}
          </p>
          <p className="text-brandy/85 leading-relaxed">{costNote}</p>
        </div>
      )}

      {/* Разбор по категориям — медианы по городам страны */}
      <h3 className="font-serif text-2xl md:text-3xl text-cream mt-12 mb-6">{labels.categoriesTitle}</h3>
      <div className="rounded-2xl bg-surface border hairline overflow-hidden">
        <div className="grid grid-cols-[1.6fr_1fr_auto] gap-2 md:gap-4 px-4 sm:px-5 py-3 border-b hairline text-brandy/60 text-xs uppercase tracking-wider">
          <span>{labels.colCategory}</span>
          <span className="text-right">{labels.colMedian}</span>
          <span className="text-right hidden sm:block">{labels.colCities}</span>
        </div>
        {cost.lines.map((l) => (
          <div
            key={l.key}
            className="grid grid-cols-[1.6fr_1fr_auto] gap-2 md:gap-4 px-4 sm:px-5 py-4 border-b border-dingley/20 last:border-0 items-center"
          >
            <span className="text-brandy/90 text-sm md:text-base">{l.label}</span>
            <span className="text-right tabular-nums text-cream">{formatRub(l.value)}</span>
            <span className="text-right tabular-nums text-brandy/50 text-sm hidden sm:block">{l.cities}</span>
          </div>
        ))}
      </div>

      {/* Разброс по городам страны — перелинковка страна → города */}
      {cost.cities.length > 1 && (
        <>
          <h3 className="font-serif text-2xl md:text-3xl text-cream mt-12 mb-6">{labels.byCityTitle}</h3>
          <div className="rounded-2xl bg-surface border hairline overflow-hidden">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-2 md:gap-4 px-4 sm:px-5 py-3 border-b hairline text-brandy/60 text-xs uppercase tracking-wider">
              <span>{labels.colCity}</span>
              <span className="text-right">{labels.colRent}</span>
              <span className="text-right">{labels.colMonthly}</span>
            </div>
            {cost.cities.map((c) => (
              <div
                key={c.slug}
                className="grid grid-cols-[1.6fr_1fr_1fr] gap-2 md:gap-4 px-4 sm:px-5 py-4 border-b border-dingley/20 last:border-0 items-center"
              >
                <Link href={`/city/${c.slug}`} className="text-brandy/90 hover:text-copper transition text-sm md:text-base">
                  {c.name_ru}
                </Link>
                <span className="text-right tabular-nums text-cream/80">{c.rent > 0 ? formatRub(c.rent) : "—"}</span>
                <span className="text-right tabular-nums text-cream">{formatRub(c.monthly)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <details className="mt-6 group">
        <summary className="cursor-pointer text-brandy/60 text-sm hover:text-copper transition list-none">
          {labels.methodTitle}
        </summary>
        <p className="text-brandy/60 text-sm leading-relaxed mt-3 max-w-3xl">{labels.method}</p>
      </details>
    </section>
  );
}
