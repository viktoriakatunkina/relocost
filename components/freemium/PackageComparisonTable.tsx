"use client";

import { CITY_COMPARISON_FEATURES, CITY_PACKAGES, type CityPackageType } from "@/lib/packages";

// Полноценная таблица сравнения 3 пакетов города — что именно входит в
// каждый, чек-марками по фичам. Раньше сравнения тарифов не было нигде на
// сайте (только разрозненные цены в разных блоках) — по фидбеку это была
// главная причина «каши в голове» у пользователя: чем пакеты отличаются
// друг от друга, кроме цены. Переиспользуется в StickyBar («Показать все
// пакеты») и на статичной странице /tariffs.
//
// Данные фич — CITY_COMPARISON_FEATURES (lib/packages.ts), сверены с
// реальной логикой разблокировки в коде, не выдуманы.

const COLUMNS: { key: CityPackageType; highlight?: boolean }[] = [
  { key: "places" },
  { key: "budget" },
  { key: "bundle", highlight: true },
];

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-copper" aria-hidden>
      ✓
    </span>
  ) : (
    <span className="text-brandy/25" aria-hidden>
      —
    </span>
  );
}

export function PackageComparisonTable({
  onBuy,
  renderAction,
}: {
  /** Клик по «Купить» в конкретной колонке — используется там, где уже есть
   *  контекст города (StickyBar открывает свою PaymentModal). */
  onBuy?: (pkg: CityPackageType) => void;
  /** Альтернатива onBuy — когда города ещё не выбрано (/tariffs): рендерит
   *  свою ссылку/кнопку вместо «Купить». */
  renderAction?: (pkg: CityPackageType) => React.ReactNode;
}) {
  return (
    <div className="w-full">
      {/* Десктоп/планшет — таблица */}
      <table className="hidden sm:table w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="text-left align-bottom pb-3 pr-3 text-brandy/55 text-xs uppercase tracking-wider font-medium w-[38%]">
              Что входит
            </th>
            {COLUMNS.map((c) => {
              const meta = CITY_PACKAGES[c.key];
              return (
                <th
                  key={c.key}
                  className={`align-bottom pb-3 px-3 text-center ${
                    c.highlight ? "text-copper" : "text-cream"
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-lg" aria-hidden>{meta.emoji}</span>
                    <span className="font-serif text-base leading-tight">{meta.short}</span>
                    <span className="font-semibold tabular-nums text-sm">{meta.price} ₽</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {CITY_COMPARISON_FEATURES.map((f, i) => (
            <tr key={f.label}>
              <td
                className={`py-2.5 pr-3 text-brandy/80 text-sm leading-snug ${
                  i > 0 ? "border-t border-cream/8" : ""
                }`}
              >
                {f.label}
              </td>
              {COLUMNS.map((c) => (
                <td
                  key={c.key}
                  className={`py-2.5 px-3 text-center ${
                    i > 0 ? "border-t border-cream/8" : ""
                  } ${c.highlight ? "bg-copper/5" : ""}`}
                >
                  <Check ok={f[c.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-3" />
            {COLUMNS.map((c) => (
              <td key={c.key} className="pt-3 px-3 text-center">
                {renderAction
                  ? renderAction(c.key)
                  : onBuy && (
                      <button
                        type="button"
                        onClick={() => onBuy(c.key)}
                        className={
                          c.highlight
                            ? "w-full px-3 py-2 rounded-pill bg-copper text-pine-tree font-semibold text-xs hover:bg-brandy transition"
                            : "w-full px-3 py-2 rounded-pill border border-copper/40 text-copper font-medium text-xs hover:bg-copper/10 transition"
                        }
                      >
                        Купить
                      </button>
                    )}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>

      {/* Мобиль — карточки, стек по пакетам (таблица не влезает по ширине) */}
      <div className="sm:hidden flex flex-col gap-3">
        {COLUMNS.map((c) => {
          const meta = CITY_PACKAGES[c.key];
          return (
            <div
              key={c.key}
              className={`rounded-2xl border px-4 py-3.5 ${
                c.highlight ? "border-copper/50 bg-copper/5" : "border-cream/10"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-cream font-serif text-base">
                  <span aria-hidden>{meta.emoji}</span>
                  {meta.short}
                </span>
                <span className="text-copper font-semibold text-sm tabular-nums">
                  {meta.price} ₽
                </span>
              </div>
              <ul className="space-y-1 mb-3">
                {CITY_COMPARISON_FEATURES.map((f) => (
                  <li
                    key={f.label}
                    className={`flex items-start gap-2 text-xs leading-snug ${
                      f[c.key] ? "text-brandy/85" : "text-brandy/35 line-through"
                    }`}
                  >
                    <Check ok={f[c.key]} />
                    {f.label}
                  </li>
                ))}
              </ul>
              {renderAction
                ? renderAction(c.key)
                : onBuy && (
                    <button
                      type="button"
                      onClick={() => onBuy(c.key)}
                      className={
                        c.highlight
                          ? "w-full px-3 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
                          : "w-full px-3 py-2.5 rounded-pill border border-copper/40 text-copper font-medium text-sm hover:bg-copper/10 transition"
                      }
                    >
                      Купить
                    </button>
                  )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
