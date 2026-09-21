import { Link } from "@/i18n/navigation";
import { CITY_PACKAGES } from "@/lib/packages";
import type { NewsCTACity } from "@/lib/news-city-match";

// Обязательный CTA на оплату — в КАЖДОЙ карточке списка новостей и на КАЖДОЙ
// странице новости (ТЗ раздел «Новости»). Две плотности: "card" — компактная
// врезка внутри карточки списка, "article" — крупный блок в конце статьи (тот
// же визуальный язык, что components/blog/BlogReportCTA.tsx и
// components/blog/ArticleInlineCTA.tsx — единая freemium-подача по сайту).
const MIN_PRICE = Math.min(
  CITY_PACKAGES.places.price,
  CITY_PACKAGES.budget.price,
  CITY_PACKAGES.bundle.price,
);

type Props = {
  city?: NewsCTACity | null;
  variant?: "card" | "article";
};

function ctaHref(city?: NewsCTACity | null): string {
  return city ? `/city/${city.slug}/budget` : "/tariffs";
}

export function NewsCTA({ city, variant = "card" }: Props) {
  const href = ctaHref(city);

  if (variant === "article") {
    return (
      <div
        className="not-prose my-10 overflow-hidden rounded-3xl border-2 border-copper/55 p-6 md:p-8 shadow-[0_0_80px_rgba(232,155,110,0.14)]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(232,155,110,0.22) 0%, rgba(232,155,110,0.06) 50%, transparent 70%), linear-gradient(135deg, #2A3618 0%, #1A2105 100%)",
        }}
      >
        <p className="text-copper text-xs uppercase tracking-wider font-semibold mb-2">
          Планируете переезд?
        </p>
        <p className="font-serif text-2xl md:text-3xl text-cream mb-2 leading-tight">
          {city
            ? `Узнайте точный бюджет жизни в ${city.name_ru} — от ${MIN_PRICE} ₽`
            : `Узнайте точный бюджет жизни в любом городе — от ${MIN_PRICE} ₽`}
        </p>
        <p className="text-brandy/90 text-sm mb-6 leading-relaxed">
          Реальные цены на аренду, еду и транспорт · Калькулятор бюджета ·
          Виза и лучшие места — единоразовая оплата.
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-7 py-4 rounded-pill bg-copper text-pine-tree font-bold text-base transition hover:bg-pale-copper hover:shadow-glow"
        >
          {city ? `Открыть бюджет ${city.name_ru}` : "Выбрать тариф"}
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-copper/35 bg-surface-elevated/60 px-4 py-3.5 flex flex-wrap sm:flex-nowrap items-center gap-3">
      <span className="text-xl shrink-0" aria-hidden>
        🧭
      </span>
      <p className="flex-1 min-w-[160px] text-brandy/85 text-sm leading-snug">
        Планируете переезд? Узнайте точный бюджет жизни
        {city ? ` в ${city.name_ru}` : " в любом городе"} — от {MIN_PRICE} ₽
      </p>
      <Link
        href={href}
        className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 rounded-pill border border-copper/50 text-copper text-xs font-semibold hover:bg-copper/10 transition whitespace-nowrap"
      >
        Смотреть →
      </Link>
    </div>
  );
}
