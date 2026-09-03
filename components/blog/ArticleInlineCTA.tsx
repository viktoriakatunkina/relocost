import { Link } from "@/i18n/navigation";
import type { City } from "@/lib/types";

// Inline CTA, вставляемый программно ВНУТРИ тела статьи (не только в конце) —
// см. app/[locale]/blog/[slug]/page.tsx. Два места вставки:
//  - "early"  — после первых 1-2 абзацев (интро), пока читатель ещё не решил
//    долистывать статью до конца или нет;
//  - "mid"    — в середине контента (~55-60%), второй шанс поймать читателя.
// Оба контекстные: если у статьи есть привязка к городу (city_id, либо
// определена рантайм-фолбэком по заголовку — см. lib/blog-city-match.ts) —
// ведут на страницу этого города; если только страна (country_slug) — на
// страницу страны; иначе — на подбор города в поиске.

// Принимает только slug/name_ru — этого достаточно для ссылки и подписи, а
// узкий тип позволяет передавать сюда как реальный City (из city_id), так и
// «догадку» из сопоставления заголовка статьи (CityMatchLite), не имеющую
// остальных полей City.
type CTACity = Pick<City, "slug" | "name_ru">;

type Props = {
  variant: "early" | "mid";
  city: CTACity | null;
  countrySlug: string | null;
};

function ctaHref(city: CTACity | null, countrySlug: string | null): string {
  if (city) return `/city/${city.slug}`;
  if (countrySlug) return `/country/${countrySlug}`;
  return "/search";
}

export function ArticleInlineCTA({ variant, city, countrySlug }: Props) {
  const href = ctaHref(city, countrySlug);

  if (variant === "early") {
    return (
      <div className="not-prose my-7 rounded-2xl border border-copper/35 bg-surface-elevated/60 px-5 py-4 flex flex-wrap sm:flex-nowrap items-center gap-4">
        <span className="text-2xl shrink-0" aria-hidden>
          💡
        </span>
        <p className="flex-1 min-w-[200px] text-brandy/85 text-sm leading-snug">
          {city ? (
            <>
              У нас уже есть реальные цены на аренду, еду и транспорт для
              города <strong className="text-cream">{city.name_ru}</strong> —
              не усреднённые с потолка.
            </>
          ) : countrySlug ? (
            <>
              У нас есть реальные цены по городам этой страны — аренда, еда,
              транспорт, без усреднений.
            </>
          ) : (
            <>
              Хотите сразу прикинуть бюджет? Калькулятор стоимости жизни
              считает по реальным ценам.
            </>
          )}
        </p>
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-pill border border-copper/50 text-copper text-sm font-semibold hover:bg-copper/10 transition whitespace-nowrap"
        >
          {city ? `Смотреть ${city.name_ru}` : "Смотреть цены"}
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="not-prose my-8 rounded-2xl border border-copper/60 px-5 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(232,155,110,0.18) 0%, rgba(232,155,110,0.06) 100%)",
      }}
    >
      <div className="flex-1">
        <p className="font-serif text-lg md:text-xl text-cream leading-tight mb-1.5">
          {city
            ? `Полный отчёт по ${city.name_ru} — от 19 ₽`
            : "Полный отчёт по городу — от 19 ₽"}
        </p>
        <p className="text-brandy/80 text-sm">
          Реальные цены · Калькулятор бюджета · Виза · Гайд — единоразовая
          оплата.
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-copper text-pine-tree font-bold text-sm hover:bg-pale-copper hover:shadow-glow transition whitespace-nowrap"
      >
        {city
          ? `Открыть отчёт по ${city.name_ru}`
          : countrySlug
            ? "Открыть города страны"
            : "Подобрать город"}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
