import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCitiesWithBudget } from "@/lib/city-budget";
import { CITY_CONTENT } from "@/lib/cities-content";
import { QuizClient } from "@/components/quiz/QuizClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  return {
    title: "Куда переехать — пройдите тест за минуту | Relocost",
    description:
      "Не знаете, куда переехать? Ответьте на 6 вопросов о бюджете, климате и приоритетах — и получите персональную подборку городов для жизни за границей или в России.",
    alternates: buildAlternates("/quiz", params.locale),
    openGraph: {
      title: "Тест: куда Вам переехать?",
      description:
        "6 вопросов о бюджете, климате и приоритетах — и персональная подборка городов.",
      type: "website",
    },
  };
}

export default async function QuizPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const cities = await getCitiesWithBudget();

  // Карта «русскоязычное сообщество» (difficulty_breakdown.community, 1–5) для
  // бонуса за русскоязычную среду в скоринге. Record (не Map) — сериализуемо в client.
  const community: Record<string, number> = {};
  for (const [slug, c] of Object.entries(CITY_CONTENT)) {
    const v = c.difficulty_breakdown?.community;
    if (typeof v === "number") community[slug] = v;
  }

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Тест: куда переехать",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
    description:
      "Интерактивный подбор города для переезда по бюджету, климату и приоритетам.",
  };

  return (
    <main className="pb-12 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <Breadcrumbs
        items={[{ name: tc("home"), href: "/" }, { name: "Куда переехать — тест" }]}
      />

      <section className="max-w-2xl mx-auto px-6 pt-8 pb-5 text-center">
        <span className="eyebrow justify-center">Бесплатный подбор</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-4 mb-4">
          Куда Вам переехать?
        </h1>
        <p className="text-brandy/80 text-lg max-w-xl mx-auto text-pretty">
          Ответьте на 6 коротких вопросов о бюджете, климате и приоритетах — и получите персональную подборку городов с ценами, деталями переезда и сравнением.
        </p>

        {/* Benefit pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          {[
            "99+ городов в базе",
            "Бесплатно",
            "Результат за 1 минуту",
          ].map((text) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 rounded-pill bg-surface border hairline px-4 py-2 text-sm text-brandy/75"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-copper shrink-0"
                aria-hidden
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {text}
            </span>
          ))}
        </div>
      </section>

      <QuizClient cities={cities} community={community} />

      <div className="pt-8">
        <Footer />
      </div>
    </main>
  );
}
