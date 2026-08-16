import { Link } from "@/i18n/navigation";
import type { City } from "@/lib/types";

const PKGS = [
  { key: "places", emoji: "📍", label: "Лучшие места", price: 19 },
  { key: "budget", emoji: "📊", label: "Все расходы",   price: 49 },
  { key: "bundle", emoji: "🎁", label: "Расходы + Места", price: 59 },
];

export function BlogReportCTA({ city }: { city: City | null }) {
  if (city) {
    return (
      <div
        className="relative mt-12 overflow-hidden rounded-3xl border-2 border-copper/55 p-6 md:p-8 shadow-[0_0_80px_rgba(232,155,110,0.14)]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(232,155,110,0.22) 0%, rgba(232,155,110,0.06) 50%, transparent 70%), linear-gradient(135deg, #2A3618 0%, #1A2105 100%)",
        }}
      >
        <p className="text-copper text-xs uppercase tracking-wider font-semibold mb-2">
          Отчёт по городу
        </p>
        <h3 className="font-serif text-2xl md:text-3xl text-cream mb-2 leading-tight">
          Полный профиль {city.name_ru} — от 19 ₽
        </h3>
        <p className="text-brandy/90 text-sm mb-6 leading-relaxed">
          Реальные цены на аренду, еду и транспорт · Калькулятор Вашего
          бюджета · Виза и ВНЖ · Гайд для переехавших
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {PKGS.map((p) => (
            <Link
              key={p.key}
              href={`/city/${city.slug}`}
              className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-pine-tree/50 border border-copper/25 hover:border-copper/60 hover:bg-pine-tree/70 transition text-center"
            >
              <span className="text-2xl" aria-hidden>{p.emoji}</span>
              <span className="text-cream text-sm font-medium leading-tight">{p.label}</span>
              <span className="text-copper font-bold text-sm">{p.price} ₽</span>
            </Link>
          ))}
        </div>

        <Link
          href={`/city/${city.slug}`}
          className="inline-flex items-center gap-2 px-7 py-4 rounded-pill bg-copper text-pine-tree font-bold text-base transition hover:bg-pale-copper hover:shadow-glow"
        >
          Открыть полный профиль {city.name_ru} →
        </Link>
        <p className="mt-3 text-brandy/60 text-xs">
          Единоразовая оплата · Доступ навсегда · ЮKassa
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-12 overflow-hidden rounded-3xl border-2 border-copper/55 p-6 md:p-8 shadow-[0_0_80px_rgba(232,155,110,0.14)]"
      style={{
        background:
          "radial-gradient(ellipse at 80% 50%, rgba(232,155,110,0.22) 0%, rgba(232,155,110,0.06) 50%, transparent 70%), linear-gradient(135deg, #2A3618 0%, #1A2105 100%)",
      }}
    >
      <div className="sm:flex sm:items-center sm:gap-6">
        <div className="flex-1 mb-5 sm:mb-0">
          <p className="text-copper text-xs uppercase tracking-wider font-semibold mb-2">
            Полный отчёт по городу
          </p>
          <p className="font-serif text-2xl md:text-3xl text-cream mb-2 leading-tight">
            Реальные цены и лучшие места — от 19 ₽
          </p>
          <p className="text-brandy/90 text-sm">
            Калькулятор бюджета · Виза · Гайд. Выберите город и
            получите доступ сразу после оплаты.
          </p>
        </div>
        <Link
          href="/search"
          className="shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-pill bg-copper text-pine-tree font-bold text-base transition hover:bg-pale-copper hover:shadow-glow whitespace-nowrap"
        >
          Выбрать город →
        </Link>
      </div>
    </div>
  );
}
