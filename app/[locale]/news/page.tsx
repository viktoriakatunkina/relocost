import { setRequestLocale } from "next-intl/server";
import { getNewsList } from "@/lib/news";
import { getCitiesForTitleMatch } from "@/lib/cities";
import { matchCityForNews } from "@/lib/news-city-match";
import { NewsCard } from "@/components/news/NewsCard";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { defaultLocale, type Locale } from "@/i18n/routing";
import { buildRuOnlyAlternates } from "@/lib/i18n-seo";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

// Только ru — тот же паттерн, что у /blog: контент не переведён, middleware
// отдаёт по /en/news и /uz/news русскую версию через rewrite (см. middleware.ts).
export function generateStaticParams() {
  return [{ locale: defaultLocale }];
}

export async function generateMetadata() {
  return {
    title: "Новости — ежедневная подборка мировых событий | Relocost",
    description:
      "Главные мировые новости дня: политика, экономика, технологии, происшествия. Обновляем ежедневно.",
    alternates: buildRuOnlyAlternates("/news"),
    openGraph: {
      title: "Новости — Relocost",
      description: "Главные мировые новости дня, обновляем ежедневно.",
      type: "website" as const,
    },
  };
}

export default async function NewsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations({ locale: defaultLocale, namespace: "common" });

  // getNewsList — через unwrapOrThrow (см. lib/news.ts): при сбое Supabase на
  // фоновой ISR-ревалидации бросает исключение, self-hosted ISR оставляет
  // старую хорошую версию страницы вместо пустого списка. Тот же принцип,
  // что в getPublishedPostCardsOrThrow (lib/blog.ts).
  const [items, citiesForMatch] = await Promise.all([
    getNewsList(200),
    getCitiesForTitleMatch(),
  ]);

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs items={[{ name: tc("home"), href: "/" }, { name: "Новости" }]} />
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-10">
        <p className="text-copper uppercase text-sm tracking-wider mb-4">
          Новости
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-cream leading-[1.05] mb-6">
          Главное в мире сегодня
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl">
          Ежедневная подборка горящих мировых новостей — политика, экономика,
          технологии, происшествия. Обновляем каждый день.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 grid gap-5">
        {items.length === 0 && (
          <p className="text-brandy/60 text-sm">Скоро здесь появятся новости.</p>
        )}
        {items.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            ctaTarget={matchCityForNews(item.title, item.summary, citiesForMatch)}
          />
        ))}
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
