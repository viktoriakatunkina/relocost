import { getTranslations, setRequestLocale } from "next-intl/server";
import { SearchClient } from "@/components/search/SearchClient";
import { getCitiesWithBudget } from "@/lib/city-budget";
import { Footer } from "@/components/Footer";
import { routing, type Locale } from "@/i18n/routing";
import { localizedUrl } from "@/lib/i18n-seo";
import { getSiteStats } from "@/lib/site-stats";

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  const { cityCount, countryCount } = await getSiteStats();
  return {
    title: "Поиск города для переезда — Россия и зарубежье | Relocost",
    description: `Найдите город по бюджету, климату и визе для россиян: ${cityCount} направлений в ${countryCount} странах с реальными ценами на аренду, еду и транспорт и оценкой сложности переезда.`,
    // Индексируем: это ценная страница-агрегатор всех направлений. Фильтры —
    // клиентское состояние (не параметры URL), поэтому thin-content вариантов
    // с параметрами не возникает; canonical ведёт на чистый /search.
    robots: { index: true, follow: true },
    alternates: { canonical: localizedUrl("/search", params.locale) },
  };
}

export default async function SearchPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("searchPage");
  const [cities, { cityCount, countryCount }] = await Promise.all([
    getCitiesWithBudget(),
    getSiteStats(),
  ]);

  return (
    <main className="pb-24">
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
        <p className="text-copper uppercase text-sm tracking-wider mb-4">
          {t("eyebrow")}
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-cream leading-[1.05] mb-6">
          {t("title")}
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl">{t("subtitle")}</p>
        <p className="text-brandy/65 text-base max-w-3xl mt-4 leading-relaxed">
          {t("intro", { cities: cityCount, countries: countryCount })}
        </p>
      </section>

      <SearchClient cities={cities} />

      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}
