import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getCitiesWithBudget } from "@/lib/city-budget";
import { badgeImageSrc, buildBadgeSnippet } from "@/lib/badge";
import { EmbedCityPicker } from "@/components/embed/EmbedCityPicker";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";

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
    title: "Встроить бейдж «Стоимость жизни» на сайт — бесплатно | Relocost",
    description:
      "Живой виджет с ценами города и индексом стоимости жизни (Москва = 100) для сайта или канала. Одна строка кода, обновляется автоматически, бесплатно — 174 города.",
    alternates: buildAlternates("/embed", params.locale),
    openGraph: {
      title: "Бейдж «Стоимость жизни» — встройте на свой сайт",
      description:
        "Живой обновляемый виджет с ценами и индексом стоимости жизни. Бесплатно, одна строка кода.",
      type: "website",
    },
  };
}

// Пример для живого превью в объяснении — узнаваемый город, почти всегда
// есть в базе. Если вдруг пропадёт — /api/badge/[slug] отдаст 404, но
// секция объяснения всё равно читается без превью.
const EXAMPLE_SLUG = "tbilisi";
const EXAMPLE_NAME = "Тбилиси";

export default async function EmbedPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");

  const cities = await getCitiesWithBudget();
  const pickerCities = cities.map((c) => ({
    slug: c.slug,
    name_ru: c.name_ru,
    country_ru: c.country_ru,
    flag_emoji: c.flag_emoji,
    is_popular: c.is_popular,
  }));

  const exampleSnippet = buildBadgeSnippet(EXAMPLE_SLUG, EXAMPLE_NAME);

  return (
    <main className="pb-16 md:pb-24">
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: "Встроить бейдж" },
        ]}
      />

      <section className="max-w-3xl mx-auto px-6 pt-12 pb-10">
        <span className="eyebrow">Для блогеров и авторов</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-6">
          Встройте бейдж стоимости жизни на свой сайт
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl text-pretty">
          Живой виджет с актуальными ценами города и индексом стоимости жизни
          «Москва = 100» — вставляется одной строкой кода в статью, блог или
          канал. Данные обновляются на нашей стороне, вам ничего не нужно
          редактировать.
        </p>
      </section>

      {/* Что это такое + живой пример */}
      <section className="max-w-3xl mx-auto px-6 pb-14">
        <div className="rounded-3xl bg-surface border hairline p-6 md:p-8">
          <h2 className="font-serif text-2xl md:text-3xl text-cream mb-4">
            Что это такое
          </h2>
          <ul className="space-y-3 text-brandy/85 text-base mb-8">
            <li className="flex gap-3">
              <span className="text-copper shrink-0" aria-hidden>●</span>
              Компактная картинка (SVG) с названием города, ориентировочным
              бюджетом «от ₽/мес» и индексом стоимости жизни — например,
              «Индекс 58 (Москва = 100)», если город почти вдвое дешевле
              Москвы.
            </li>
            <li className="flex gap-3">
              <span className="text-copper shrink-0" aria-hidden>●</span>
              Обновляется автоматически, когда мы обновляем цены —
              переустанавливать код на сайте не нужно.
            </li>
            <li className="flex gap-3">
              <span className="text-copper shrink-0" aria-hidden>●</span>
              Кликабельна: ведёт на страницу города на Relocost с полным
              расчётом бюджета, ценами, визой и отзывами.
            </li>
          </ul>

          <p className="text-copper text-xs uppercase tracking-[0.15em] mb-3 font-medium">
            Как это выглядит
          </p>
          <div className="mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badgeImageSrc(EXAMPLE_SLUG)}
              alt={`Пример бейджа — стоимость жизни в ${EXAMPLE_NAME}`}
              width={360}
              height={90}
              className="rounded-lg"
            />
          </div>

          <div className="rounded-2xl bg-pine-tree/50 border hairline overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b hairline">
              <span className="text-xs text-brandy/50 font-mono">HTML</span>
            </div>
            <pre className="px-4 py-4 text-xs font-mono text-brandy/80 overflow-x-auto whitespace-pre">
              {exampleSnippet}
            </pre>
          </div>
        </div>
      </section>

      {/* Зачем это блогеру */}
      <section className="max-w-3xl mx-auto px-6 pb-14">
        <h2 className="font-serif text-2xl md:text-3xl text-cream mb-4">
          Зачем это вам
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <BenefitCard
            title="Бесплатно"
            text="Без подписок и скрытых условий — просто вставьте код."
          />
          <BenefitCard
            title="Актуальные цифры"
            text="Не нужно вручную пересчитывать цены и следить, не устарели ли они."
          />
          <BenefitCard
            title="Готовый контент"
            text="Наглядная цифра для статьи о переезде или жизни за рубежом — без своих расчётов."
          />
        </div>
      </section>

      {/* Выбор города + копирование кода */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="font-serif text-2xl md:text-3xl text-cream mb-2">
          Выберите город
        </h2>
        <p className="text-brandy/70 text-sm mb-6">
          {cities.length} городов доступно — начните вводить название, чтобы
          найти нужный, или выберите из популярных ниже.
        </p>
        <EmbedCityPicker cities={pickerCities} />
      </section>

      <Footer />
    </main>
  );
}

function BenefitCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-surface border hairline p-5">
      <p className="text-cream font-medium mb-2">{title}</p>
      <p className="text-brandy/70 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
