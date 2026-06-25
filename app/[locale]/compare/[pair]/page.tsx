import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  topCompareParams,
  loadCompare,
  parsePair,
  compareSummary,
  compareFaq,
} from "@/lib/compare";
import { CompareHero } from "@/components/compare/CompareHero";
import { CompareTable } from "@/components/compare/CompareTable";
import { Verdict } from "@/components/compare/Verdict";
import { CompareDetails } from "@/components/compare/CompareDetails";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { cityName } from "@/lib/i18n-content";

export const revalidate = 86400;
// Прегенерим статикой только пары топ-городов (см. topCompareParams).
// Остальные пары догенерятся при первом запросе и закешируются (ISR).
// Параметры размножаем по локалям, чтобы ×3 не взрывало сборку — топ-пар немного.
export const dynamicParams = true;

export async function generateStaticParams() {
  const pairs = await topCompareParams();
  return routing.locales.flatMap((locale) =>
    pairs.map(({ pair }) => ({ locale, pair })),
  );
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
  return {
    title: t("title", { a: aName, b: bName }),
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

  return (
    <main className="pb-24">
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: tc("compare") },
          { name: `${aName} — ${bName}` },
        ]}
      />
      <CompareHero a={data.a} b={data.b} />
      <CompareTable a={data.a} b={data.b} lines={data.lines} />
      <Verdict
        a={data.a}
        b={data.b}
        scoreA={data.scoreA}
        scoreB={data.scoreB}
      />
      <CompareDetails summary={compareSummary(data)} faq={compareFaq(data)} />
      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}
