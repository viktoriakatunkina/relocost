import { setRequestLocale } from "next-intl/server";
import { getCitiesWithBudget } from "@/lib/city-budget";
import { MatchClient } from "@/components/MatchClient";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CrossLinks } from "@/components/CrossLinks";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";

export const revalidate = 86400;

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "en" }, { locale: "uz" }];
}

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  return {
    title: "Подбор города для переезда по приоритетам | Relocost",
    description:
      "Укажите, что важно — бюджет, климат, безопасность, море — и получите персональный рейтинг городов. Алгоритм подберет лучшие совпадения из 100+ направлений.",
    alternates: buildAlternates("/match", params.locale),
    openGraph: {
      title: "Подбор города для переезда",
      description: "Персональный алгоритм подбора: бюджет, климат, безопасность, море и интернет.",
      type: "website",
    },
  };
}

export default async function MatchPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const cities = await getCitiesWithBudget();

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: "Подбор города" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10">
        <span className="eyebrow">Персональный подбор</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-5 max-w-3xl">
          Куда переехать именно Вам
        </h1>
        <p className="text-brandy/75 text-lg max-w-2xl text-pretty">
          Расставьте приоритеты — алгоритм подберет города с максимальным
          совпадением. Меняйте веса в реальном времени.
        </p>
      </section>

      <MatchClient cities={cities} />

      <CrossLinks
        links={[
          { href: "/search", label: "Все города" },
          { href: "/rating", label: "Рейтинг" },
          { href: "/quiz", label: "Квиз" },
          { href: "/compare/tbilisi-vs-yerevan", label: "Сравнить города" },
        ]}
      />

      <div className="pt-16">
        <Footer />
      </div>
    </main>
  );
}
