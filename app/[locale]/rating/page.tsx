import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCitiesWithBudget } from "@/lib/city-budget";
import { CITY_CONTENT } from "@/lib/cities-content";
import { computeLivingScore } from "@/lib/rating";
import { RatingClient, type RatedCity } from "@/components/rating/RatingClient";
import { CityDeepLinks } from "@/components/CityDeepLinks";
import { CrossLinks } from "@/components/CrossLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { type Locale } from "@/i18n/routing";
import { buildAlternates, localizedUrl } from "@/lib/i18n-seo";

export const revalidate = 86400;

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "en" }, { locale: "uz" }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  return {
    title: "Рейтинг городов для переезда 2026 — где лучше жить | Relocost",
    description:
      "Рейтинг городов для переезда по доступности, климату, простоте переезда и инфраструктуре. Сортируйте по любому параметру и сравнивайте направления.",
    alternates: buildAlternates("/rating", params.locale),
    openGraph: {
      title: "Рейтинг городов для переезда",
      description: "Сравнение городов по доступности, климату и простоте переезда.",
      type: "website",
    },
  };
}

export default async function RatingPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const cities = await getCitiesWithBudget();

  const rated: RatedCity[] = cities
    .map((c) => {
      const breakdown = CITY_CONTENT[c.slug]?.difficulty_breakdown;
      const score = computeLivingScore(c, breakdown);
      const axes = Object.fromEntries(
        score.axes.map((a) => [a.key, { value: a.value, available: a.available }]),
      ) as RatedCity["axes"];
      return {
        slug: c.slug,
        name: c.name_ru,
        country: c.country_ru,
        flag: c.flag_emoji ?? "",
        total: score.total,
        coverage: score.coverage,
        axes,
      };
    })
    .sort((a, b) => b.total - a.total);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Рейтинг городов для переезда",
    numberOfItems: rated.length,
    itemListElement: rated.slice(0, 50).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: localizedUrl(`/city/${c.slug}`, params.locale),
      name: c.name,
    })),
  };

  return (
    <main className="pb-12 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Breadcrumbs
        items={[{ name: tc("home"), href: "/" }, { name: "Рейтинг городов" }]}
      />

      <section className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <span className="eyebrow">Рейтинг</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-5 max-w-3xl">
          Рейтинг городов для переезда
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl text-pretty">
          Сравнение {rated.length}+ направлений по доступности, климату, простоте переезда и инфраструктуре. Сортируйте по любому параметру и переходите на страницу города.
        </p>

        {/* Axis pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { label: "Доступность", desc: "цены и бюджет" },
            { label: "Климат", desc: "температура и сезоны" },
            { label: "Переезд", desc: "виза и сложность" },
            { label: "Инфраструктура", desc: "где есть данные" },
          ].map((ax) => (
            <span
              key={ax.label}
              className="inline-flex items-center gap-1.5 rounded-pill bg-surface border hairline px-3 py-1.5 text-xs text-brandy/70"
            >
              <span className="text-cream font-medium">{ax.label}</span>
              <span className="text-brandy/45">{ax.desc}</span>
            </span>
          ))}
        </div>

        <p className="mt-5 text-xs text-brandy/45 max-w-xl">
          Оценка для переезда, а не «уровень жизни вообще». Безопасность и медицину числом не оцениваем — только то, что реально измерили. Города с неполными данными помечены.
        </p>
      </section>

      <RatingClient cities={rated} />

      <CityDeepLinks
        cities={rated.slice(0, 60).map((c) => ({ slug: c.slug, name: c.name }))}
        title="Бюджет и цены по городам рейтинга"
        note="Топ-60 направлений рейтинга: детальный расчет бюджета на месяц и полная таблица цен по каждому городу."
      />

      <CrossLinks
        links={[
          { href: "/countries", label: "Все страны" },
          { href: "/search", label: "Подобрать город" },
          { href: "/compare/tbilisi-vs-yerevan", label: "Тбилиси или Ереван" },
          { href: "/compare/almaty-vs-tbilisi", label: "Алматы или Тбилиси" },
        ]}
      />

      <div className="pt-16">
        <Footer />
      </div>
    </main>
  );
}
