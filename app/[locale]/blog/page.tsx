import { setRequestLocale } from "next-intl/server";
import { getPublishedPostCardsOrThrow } from "@/lib/blog";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { defaultLocale, type Locale } from "@/i18n/routing";
import { buildRuOnlyAlternates } from "@/lib/i18n-seo";
import { ARCHIVE_PAGE_SIZE } from "@/lib/blog-archive";

export const revalidate = 3600;

// Только ru: /en/blog и /uz/blog middleware отдаёт rewrite'ом на русскую
// версию (заголовки статей и так существуют только на русском).
export function generateStaticParams() {
  return [{ locale: defaultLocale }];
}

export async function generateMetadata() {
  return {
    title: "Блог Relocost — гайды по переезду, цены, визы и сравнения городов",
    description:
      "Пошаговые гайды релокации, сравнения городов и подборки направлений. Только проверенные цифры и опыт переехавших.",
    alternates: buildRuOnlyAlternates("/blog"),
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
  // getPublishedPostCardsOrThrow (не getPublishedPosts): при сбое Supabase на
  // фоновой ISR-ревалидации бросает исключение — Next.js оставляет старую
  // хорошую версию страницы в кеше вместо показа «статей нет» живым
  // посетителям (было 2026-08-25, см. комментарий в lib/blog.ts).
  // Карточная (узкая) выборка: в клиентский BlogFilters НЕЛЬЗЯ отдавать
  // content_md — на этом /blog весила 8 МБ (аудит 2026-09-07).
  const posts = await getPublishedPostCardsOrThrow();
  const totalPages = Math.ceil(posts.length / ARCHIVE_PAGE_SIZE);
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

      {/* Архив: серверные ссылки на страницы блога. BlogFilters листает
          статьи на клиенте, поэтому в HTML попадают только 12 карточек —
          краулер не видит остальные ~2600 статей и не может до них дойти.
          Этот блок даёт реальные <a> на постраничный архив (аудит 2026-09-07). */}
      {totalPages > 1 && (
        <section className="max-w-6xl mx-auto px-6 mt-16">
          <h2 className="font-serif text-2xl text-cream mb-4">Архив статей</h2>
          <nav className="flex flex-wrap gap-2" aria-label="Архив блога по страницам">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`/blog/page/${n}`}
                className="px-3 py-1.5 rounded-pill border border-cream/10 text-brandy/70 text-sm hover:text-cream hover:border-copper/30 transition"
              >
                {n}
              </Link>
            ))}
          </nav>
        </section>
      )}

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
