import Link from "next/link";
import type { City, Price, PriceCategory } from "@/lib/types";
import { formatRub } from "@/lib/cities";

// Уникальные данные Relocost внутри статьи: реальные базовые цены связанного
// города из нашей базы + ссылка на полный калькулятор. То, чего нет у конкурентов
// и что даёт «information gain» для SEO. Рендерится только для статей с city_id.

const PICKS: { category: PriceCategory; match: string; label: string }[] = [
  { category: "rent", match: "1-комн. квартира на окраине", label: "Аренда 1-комн. (окраина)" },
  { category: "food", match: "Продукты на месяц", label: "Продукты на месяц" },
  { category: "transport", match: "Месячный проездной", label: "Проездной на месяц" },
  { category: "utilities", match: "ЖКХ", label: "ЖКХ за квартиру" },
];

function pick(prices: Record<PriceCategory, Price[]>, category: PriceCategory, match: string): Price | null {
  const list = prices[category] ?? [];
  return list.find((p) => p.item_name_ru.includes(match)) ?? list[0] ?? null;
}

export function ArticleCityData({
  city,
  prices,
}: {
  city: City;
  prices: Record<PriceCategory, Price[]>;
}) {
  const rows = PICKS.map((p) => ({ label: p.label, price: pick(prices, p.category, p.match) })).filter(
    (r) => r.price,
  );
  if (rows.length < 3) return null;

  const monthlyFrom = rows.reduce((sum, r) => sum + (r.price?.price_min ?? 0), 0);

  return (
    <aside className="not-prose my-10 rounded-2xl border hairline bg-surface overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b hairline flex items-center gap-3">
        <span className="text-2xl" aria-hidden>
          {city.flag_emoji}
        </span>
        <div>
          <p className="text-copper text-xs uppercase tracking-[0.16em]">Наши данные · {city.name_ru}</p>
          <p className="text-cream font-serif text-xl leading-tight">Реальные цены на 2026 год</p>
        </div>
      </div>

      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b hairline last:border-0">
              <td className="px-6 py-3 text-brandy/85">{r.label}</td>
              <td className="px-6 py-3 text-right text-cream whitespace-nowrap font-medium">
                {formatRub(r.price!.price_min)} — {formatRub(r.price!.price_max)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-6 py-4 bg-pine-tree/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-brandy/80 text-sm">
          Бюджет от <span className="text-cream font-semibold">{formatRub(monthlyFrom)}</span> в месяц
        </p>
        <Link
          href={`/city/${city.slug}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm transition hover:bg-brandy"
        >
          Полный расчёт для {city.name_ru} →
        </Link>
      </div>
    </aside>
  );
}
