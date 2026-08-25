import { setRequestLocale } from "next-intl/server";
import { getPublishedPosts } from "@/lib/blog";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  return {
    title: "Блог Relocost — гайды по переезду, цены, визы и сравнения городов",
    description:
      "Пошаговые гайды релокации, сравнения городов и подборки направлений. Только проверенные цифры и опыт переехавших.",
    alternates: buildAlternates("/blog", params.locale),
    openGraph: {
      title: "Блог Relocost — гайды по переезду",
      description:
        "Пошаговые гайды релокации, сравнения городов и подборки направлений.",
      type: "website" as const,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const posts = await getPublishedPosts();
  return (
    <main className="pb-12 md:pb-24">
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">
        <p className="text-copper uppercase text-sm tracking-wider mb-4">
          Блог
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-cream leading-[1.05] mb-6">
          Гайды, сравнения и подборки
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl">
          Практические материалы для тех, кто планирует переезд. Бюджеты,
          визы, банки, школы — на конкретных цифрах.
        </p>
      </section>

      {/* Мини-CTA перед лентой статей */}
      <section className="max-w-6xl mx-auto px-6 mb-8">
        <div className="rounded-2xl bg-surface border border-copper/20 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <div className="flex-1 min-w-0">
            <p className="text-cream font-medium text-sm leading-snug">
              Знаете, куда переезжаете? Откройте полный отчёт по городу — цены, виза, лучшие места.
            </p>
            <p className="text-brandy/55 text-xs mt-0.5">40+ статей расходов · единоразово · от 49 ₽</p>
          </div>
          <Link
            href="/search"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition whitespace-nowrap"
          >
            Выбрать город →
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <BlogFilters posts={posts} />
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
