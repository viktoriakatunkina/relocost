import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  topCompareParams,
  loadCompare,
  parsePair,
  compareSummary,
  compareDelta,
  compareSecondPerson,
  compareFaq,
  relocationBudgets,
} from "@/lib/compare";
import { CompareHero } from "@/components/compare/CompareHero";
import { CrossLinks } from "@/components/CrossLinks";
import { CompareTable } from "@/components/compare/CompareTable";
import { Verdict } from "@/components/compare/Verdict";
import { CompareDetails } from "@/components/compare/CompareDetails";
import { CompareRelocation } from "@/components/compare/CompareRelocation";
import { SecondPersonSummary } from "@/components/city/SecondPersonSummary";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { cityName } from "@/lib/i18n-content";

export const revalidate = 86400;
// Прегенерим статикой только пары топ-городов (см. topCompareParams).
// Остальные пары догенерятся при первом запросе и закешируются (ISR).
// Параметры размножаем по локалям, чтобы ×3 не взрывало сборку — топ-пар немного.
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; pair: string };
}) {
  const parsed = parsePair(params.pair);
  if (!parsed) return {};
  const data = await loadCompare(parsed[0], parsed[1]);
  if (!data) return {};
  const t = await getTranslations({ locale: params.locale, namespace: "compareMeta" });
  const aName = cityName(data.a, params.locale);
  const bName = cityName(data.b, params.locale);
  // Canonical: всегда алфавитная пара. Для реверсной — указываем на алфавитную.
  const [first, second] = [parsed[0], parsed[1]].sort();
  const canonicalPair = `${first}-vs-${second}`;
  // SEO-хук с процентом: «X дешевле Y на N% — стоимость жизни 2026».
  const delta = compareDelta(data);
  const hookTitle = delta
    ? `${delta.cheaper === "a" ? aName : bName} дешевле ${delta.cheaper === "a" ? bName : aName} на ${delta.pct}% — стоимость жизни 2026`
    : t("title", { a: aName, b: bName });
  return {
    title: hookTitle,
    description: t("description", { a: aName, b: bName }),
    alternates: buildAlternates(`/compare/${canonicalPair}`, params.locale),
    openGraph: {
      title: t("ogTitle", { a: aName, b: bName }),
      description: t("ogDescription", { a: aName, b: bName }),
      type: "article",
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: { locale: Locale; pair: string };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");

  const parsed = parsePair(params.pair);
  if (!parsed) notFound();
  const data = await loadCompare(parsed[0], parsed[1]);
  if (!data) notFound();

  const aName = cityName(data.a, params.locale);
  const bName = cityName(data.b, params.locale);
  const secondPersonText = compareSecondPerson(data);
  // Денежные бюджеты A/B для калькулятора переезда с составом семьи.
  const relocation = relocationBudgets(data);
  // SEO-хук «X дешевле Y на N%» для подзаголовка в зоне h1.
  const delta = compareDelta(data);
  const heroHeadline = delta
    ? `${delta.cheaper === "a" ? data.a.name_ru : data.b.name_ru} дешевле, чем ${delta.cheaper === "a" ? data.b.name_ru : data.a.name_ru}, примерно на ${delta.pct}% по базовым расходам.`
    : undefined;

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: tc("compare") },
          { name: `${aName} — ${bName}` },
        ]}
      />
      <CompareHero a={data.a} b={data.b} headline={heroHeadline} />
      <CompareTable a={data.a} b={data.b} lines={data.lines} />
      <Verdict
        a={data.a}
        b={data.b}
        scoreA={data.scoreA}
        scoreB={data.scoreB}
      />
      {secondPersonText && (
        <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
          <SecondPersonSummary
            eyebrow="Что изменится для Вас"
            text={secondPersonText}
          />
        </section>
      )}
      <CompareRelocation
        aName={aName}
        bName={bName}
        budgetA={relocation.a}
        budgetB={relocation.b}
      />
      <CompareDetails summary={compareSummary(data)} faq={compareFaq(data)} />
      <CrossLinks
        links={[
          { href: `/city/${data.a.slug}`, label: `Стоимость жизни в ${data.a.name_ru}` },
          { href: `/city/${data.b.slug}`, label: `Стоимость жизни в ${data.b.name_ru}` },
          { href: `/country/${data.a.country_slug}`, label: data.a.country_ru },
          { href: `/country/${data.b.country_slug}`, label: data.b.country_ru },
          { href: `/compare/${data.b.slug}-vs-${data.a.slug}`, label: `${data.b.name_ru} или ${data.a.name_ru}` },
          { href: "/rating", label: "Рейтинг городов по стоимости жизни" },
          { href: "/countries", label: "Все страны" },
        ]}
      />
      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
