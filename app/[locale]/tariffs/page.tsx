import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { TariffsCityTable } from "@/components/freemium/TariffsCityTable";
import { typo } from "@/lib/typography";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { COUNTRY_PACKAGES, COUNTRY_PACKAGE_DESCRIPTIONS } from "@/lib/packages";

// Findable-ответ на фидбек «нигде не нашла сравнения тарифов» / «не понимаю
// чем отличаются кроме цены»: раньше цены были разбросаны по разным блокам
// разных страниц, а единой точки сравнения не было нигде в навигации.
// Страница только RU (как /offer, /privacy — цены и пакеты завязаны на
// рубли и российский рынок переезда), ссылка — в футере и в бургер-меню.
export function generateStaticParams() {
  return [{ locale: "ru" }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return {
    title: "Тарифы и пакеты — Relocost",
    description:
      "Чем отличаются пакеты «Лучшие места», «Расходы» и «Все включено» на Relocost — сравнение по пунктам, а не только по цене.",
    alternates: buildAlternates("/tariffs", params.locale),
    openGraph: {
      title: "Тарифы и пакеты — Relocost",
      description: "Сравнение пакетов доступа к отчетам о стоимости жизни.",
      type: "website",
    },
  };
}

const COUNTRY_ROWS: { key: keyof typeof COUNTRY_PACKAGES }[] = [
  { key: "country_overview" },
  { key: "country_cities" },
];

export default async function TariffsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: tf("tariffs") },
        ]}
      />

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <p className="eyebrow mb-5">Тарифы</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream leading-[1.05] mb-4">
          Чем пакеты отличаются
        </h1>
        <p className="text-brandy/75 text-base leading-relaxed">
          {typo(
            "Базовый расчет бюджета на Relocost всегда бесплатный. Детальные блоки — лучшие места, точный бюджет по категориям, маршруты на день — открываются разовым платежом, отдельно по каждому городу. Три пакета отличаются НЕ только ценой — вот что входит в каждый.",
          )}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <div className="rounded-2xl bg-surface border hairline p-5 md:p-8">
          <h2 className="font-serif text-xl text-cream mb-5">Пакеты города</h2>
          <TariffsCityTable />
        </div>

        <div className="rounded-2xl bg-surface border hairline p-5 md:p-8 mt-5">
          <h2 className="font-serif text-xl text-cream mb-5">Пакеты страны</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {COUNTRY_ROWS.map((r) => {
              const meta = COUNTRY_PACKAGES[r.key];
              return (
                <div
                  key={r.key}
                  className="rounded-xl border hairline px-4 py-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-cream font-serif text-base">
                      <span aria-hidden>{meta.emoji}</span>
                      {meta.short}
                    </span>
                    <span className="text-copper font-semibold text-sm tabular-nums">
                      {meta.price} ₽
                    </span>
                  </div>
                  <p className="text-brandy/75 text-sm leading-snug">
                    {COUNTRY_PACKAGE_DESCRIPTIONS[r.key]}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-brandy/50 text-xs mt-4">
            {typo(
              "Пакет «Города» продается только там, где на странице страны реально есть скрытые города сверх бесплатных пяти.",
            )}
          </p>
        </div>

        <p className="text-brandy/55 text-sm mt-6 text-center">
          Полные условия — в{" "}
          <Link href="/offer" className="text-copper hover:underline">
            публичной оферте
          </Link>
          .
        </p>
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
