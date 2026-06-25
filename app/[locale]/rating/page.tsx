import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCitiesWithBudget } from "@/lib/city-budget";
import { CITY_CONTENT } from "@/lib/cities-content";
import { computeLivingScore } from "@/lib/rating";
import { RatingClient, type RatedCity } from "@/components/rating/RatingClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates, localizedUrl } from "@/lib/i18n-seo";

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
    <main className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Breadcrumbs
        items={[{ name: tc("home"), href: "/" }, { name: "Рейтинг городов" }]}
      />

      <section className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <span className="eyebrow">Рейтинг</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-6 max-w-3xl">
          Рейтинг городов для переезда
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl text-pretty">
          Сводная оценка направлений по тем параметрам, которые мы можем измерить
          по нашим данным: доступность жизни, климат, простота переезда и — где
          есть данные — инфраструктура и русскоязычная среда. Сортируйте по
          любому параметру и сравнивайте.
        </p>
        <p className="mt-5 inline-flex items-start gap-2 rounded-2xl border hairline bg-surface/60 px-4 py-3 text-sm text-brandy/65 max-w-2xl text-pretty">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Это оценка для переезда, а не «уровень жизни вообще». Безопасность,
          медицину и скорость интернета мы пока не оцениваем числом — не выдумываем
          того, чего не измеряли. У части городов заполнены не все параметры — они
          помечены «оценка по 3 параметрам».
        </p>
      </section>

      <RatingClient cities={rated} />

      <div className="pt-16">
        <Footer />
      </div>
    </main>
  );
}
