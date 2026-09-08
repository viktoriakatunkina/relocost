import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  loadCompare,
  parsePair,
  compareSummary,
  compareDelta,
  compareSecondPerson,
  compareFaq,
  relocationBudgets,
  TOP_COMPARE_SLUGS,
} from "@/lib/compare";
import {
  loadCountryCompare,
  countryCompareDelta,
  countryCompareSummary,
  countryCompareFaq,
  COUNTRY_COMPARE_PAIRS,
} from "@/lib/compare-countries";
import {
  CountryCompareHero,
  CountryCompareTable,
  CountryCompareVerdict,
  CountryCompareFacts,
  CountryCompareCities,
} from "@/components/compare/CountryCompareView";
import { countryIn } from "@/lib/country-prepositional";
import { CompareHero } from "@/components/compare/CompareHero";
import { CrossLinks } from "@/components/CrossLinks";
import { CompareTable } from "@/components/compare/CompareTable";
import { Verdict } from "@/components/compare/Verdict";
import { CompareDetails } from "@/components/compare/CompareDetails";
import { CompareRelocation } from "@/components/compare/CompareRelocation";
import { SecondPersonSummary } from "@/components/city/SecondPersonSummary";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { cityName } from "@/lib/i18n-content";

export const revalidate = 86400;
// Все пары сравнения генерируются ISR при первом запросе (dynamicParams=true).
// Остальные пары догенерятся при первом запросе и закешируются (ISR).
// Параметры размножаем по локалям, чтобы ×3 не взрывало сборку — топ-пар немного.
export const dynamicParams = true;

export function generateStaticParams() {
  // Объединяем ручной список популярных городов с TOP_COMPARE_SLUGS
  // (lib/compare.ts) — тем же списком, из которого sitemap.ts строит
  // /compare/... ссылки. Без объединения часть пар из sitemap (например,
  // krasnodar-vs-sochi) не попадала в generateStaticParams и рендерилась
  // через ISR-фолбэк на VPS, где notFound() мог закешироваться на 404.
  const TOP = Array.from(
    new Set([
      "tbilisi", "yerevan", "istanbul", "belgrade", "almaty",
      "dubai", "bali", "lisbon", "barcelona", "tashkent",
      "limassol", "berlin", "prague", "budapest", "warsaw",
      "moscow", "spb", "bishkek", "baku",
      ...TOP_COMPARE_SLUGS,
    ]),
  );
  const pairs: string[] = [];
  for (let i = 0; i < TOP.length; i++) {
    for (let j = i + 1; j < TOP.length; j++) {
      pairs.push(`${TOP[i]}-vs-${TOP[j]}`);
    }
  }
  // Пары СТРАН (georgia-vs-armenia и т.п.) — тот же маршрут, но сущность
  // другая. Спрос подтвержден Яндекс.Suggest, список в lib/compare-countries.
  // Прегенерируем обе ориентации, как и для городов.
  for (const [x, y] of COUNTRY_COMPARE_PAIRS) {
    pairs.push(`${x}-vs-${y}`, `${y}-vs-${x}`);
  }
  return Array.from(new Set(pairs)).flatMap((pair) => [
    { locale: "ru", pair },
    { locale: "en", pair },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; pair: string };
}) {
  const parsed = parsePair(params.pair);
  if (!parsed) return {};
  const data = await loadCompare(parsed[0], parsed[1]);
  // Города не нашлись — пробуем прочитать пару как СТРАНЫ. Порядок важен:
  // slug'и `singapore` и `hong-kong` есть и как город, и как страна, и для них
  // должна побеждать городская трактовка (она была на сайте раньше).
  if (!data) {
    const countries = await loadCountryCompare(parsed[0], parsed[1]);
    if (!countries) return {};
    const [first, second] = [parsed[0], parsed[1]].sort();
    const delta = countryCompareDelta(countries);
    const aName = countries.a.name_ru;
    const bName = countries.b.name_ru;
    const title = delta
      ? `${delta.cheaper === "a" ? aName : bName} или ${delta.cheaper === "a" ? bName : aName}: где дешевле жить в 2026`
      : `${aName} или ${bName}: где дешевле жить в 2026`;
    return {
      title,
      description: `Сравнение стоимости жизни ${countryIn(countries.a.slug, aName)} и ${countryIn(countries.b.slug, bName)} в 2026 году: аренда, продукты, транспорт, ЖКХ, виза и сложность переезда. Реальные цены по городам.`,
      alternates: buildAlternates(`/compare/${first}-vs-${second}`, params.locale),
      openGraph: {
        title,
        description: `Где дешевле жить — ${aName} или ${bName}? Цены, виза, сложность переезда.`,
        type: "article",
      },
    };
  }
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
  if (!data) {
    // Пара не про города — пробуем страны (/compare/georgia-vs-armenia).
    const countries = await loadCountryCompare(parsed[0], parsed[1]);
    if (!countries) notFound();
    return (
      <CountryComparePage data={countries} homeLabel={tc("home")} compareLabel={tc("compare")} />
    );
  }

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
      {/* CTA: горячий пользователь выбирает между двумя городами — подтолкнуть к покупке */}
      <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
        <div
          className="rounded-3xl border-2 border-copper/45 p-6 md:p-8 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(232,155,110,0.18) 0%, transparent 60%), linear-gradient(135deg, #2A3618 0%, #1A2105 100%)" }}
        >
          <p className="text-copper text-xs uppercase tracking-wider font-semibold mb-3">Полные данные по обоим городам</p>
          <h3 className="font-serif text-2xl md:text-3xl text-cream mb-3 leading-tight">
            40+ статей расходов — аренда, еда, транспорт, медицина
          </h3>
          <p className="text-brandy/80 mb-7 max-w-lg mx-auto text-sm leading-relaxed">
            Таблица сравнения показывает только базовые данные. Полный прайс откроется сразу после оплаты — реальные диапазоны, не усредненные.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/city/${data.a.slug}/prices`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition"
            >
              📊 Цены в {data.a.name_ru} — 49 ₽
            </Link>
            <Link
              href={`/city/${data.b.slug}/prices`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-pill border border-copper/50 text-copper font-semibold text-sm hover:bg-copper/10 transition"
            >
              📊 Цены в {data.b.name_ru} — 49 ₽
            </Link>
          </div>
          <p className="text-brandy/40 text-xs mt-4">Единоразовая оплата · Доступ навсегда · ЮKassa</p>
        </div>
      </section>

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

// Страница сравнения СТРАН. Живет на том же маршруте /compare/<a>-vs-<b>:
// URL-шаблон один и тот же, а сущность выбирается по слагам (сначала города,
// потом страны). Так /compare остается единой точкой входа для запросов вида
// «X или Y», которые в Suggest есть и на уровне городов, и на уровне стран.
function CountryComparePage({
  data,
  homeLabel,
  compareLabel,
}: {
  data: Awaited<ReturnType<typeof loadCountryCompare>> & object;
  homeLabel: string;
  compareLabel: string;
}) {
  const delta = countryCompareDelta(data);
  const headline = delta
    ? `${delta.cheaper === "a" ? data.a.name_ru : data.b.name_ru} дешевле, чем ${
        delta.cheaper === "a" ? data.b.name_ru : data.a.name_ru
      }, примерно на ${delta.pct}% по базовым расходам на месяц.`
    : undefined;

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[
          { name: homeLabel, href: "/" },
          { name: compareLabel },
          { name: `${data.a.name_ru} — ${data.b.name_ru}` },
        ]}
      />
      <CountryCompareHero data={data} headline={headline} />
      <CountryCompareTable data={data} />
      <CountryCompareVerdict data={data} />
      <CountryCompareCities data={data} />
      <CountryCompareFacts data={data} />
      <CompareDetails
        summary={countryCompareSummary(data)}
        faq={countryCompareFaq(data)}
        title={`${data.a.name_ru} или ${data.b.name_ru} — что выбрать`}
        faqTitle={`Частые вопросы: ${data.a.name_ru} и ${data.b.name_ru}`}
      />
      <CrossLinks
        links={[
          { href: `/country/${data.a.slug}`, label: `Стоимость жизни ${countryIn(data.a.slug, data.a.name_ru)}` },
          { href: `/country/${data.b.slug}`, label: `Стоимость жизни ${countryIn(data.b.slug, data.b.name_ru)}` },
          { href: `/compare/${data.b.slug}-vs-${data.a.slug}`, label: `${data.b.name_ru} или ${data.a.name_ru}` },
          ...(data.a.cost.cheapest && data.b.cost.cheapest
            ? [
                {
                  href: `/compare/${data.a.cost.cheapest.slug}-vs-${data.b.cost.cheapest.slug}`,
                  label: `${data.a.cost.cheapest.name_ru} или ${data.b.cost.cheapest.name_ru}`,
                },
              ]
            : []),
          { href: "/countries", label: "Все страны" },
          { href: "/rating", label: "Рейтинг городов по стоимости жизни" },
        ]}
      />
      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
