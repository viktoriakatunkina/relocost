import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPublishedPostCardsOrThrow } from "@/lib/blog";
import { ARCHIVE_PAGE_SIZE, archivePageCount } from "@/lib/blog-archive";
import { BlogCard } from "@/components/blog/BlogCard";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { defaultLocale, type Locale } from "@/i18n/routing";
import { buildRuOnlyAlternates } from "@/lib/i18n-seo";

// Постраничный архив блога — серверный рендер реальных ссылок на статьи.
// /blog листает список на клиенте (BlogFilters), поэтому в HTML видно только
// 12 карточек: краулеру некуда идти, ~2600 статей остаются без единой
// внутренней ссылки. Этот маршрут закрывает дыру в перелинковке.
//
// Маршрут /blog/page/N не конфликтует с /blog/[slug] — у него на сегмент
// больше, Next.js разводит их по глубине пути.
export const revalidate = 3600;
// Прегенерим только первые страницы (см. generateStaticParams), остальные
// рендерятся по первому запросу и кешируются ISR — билд на VPS с 1.9 ГБ RAM
// и так на грани OOM, сотня лишних страниц ему не нужна.
export const dynamicParams = true;

const PRERENDER_PAGES = 5;

// Только ru: /en/blog/page/N и /uz/... middleware отдаёт rewrite'ом на
// русскую версию — блог не переведён ни на одну локаль.
export function generateStaticParams() {
  return Array.from({ length: PRERENDER_PAGES }, (_, i) => ({
    locale: defaultLocale,
    page: String(i + 1),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; page: string };
}) {
  const n = Number(params.page);
  return {
    title: `Блог Relocost — страница ${n} | гайды по переезду и стоимости жизни`,
    description: `Архив статей Relocost, страница ${n}. Гайды по релокации, стоимость жизни в городах мира, визы, сравнения направлений.`,
    alternates: buildRuOnlyAlternates(`/blog/page/${n}`),
    // Страницы пагинации — служебные списки: индексируем первую, остальные
    // оставляем краулеру как транзит к статьям (ссылки follow).
    robots: n === 1 ? undefined : { index: false, follow: true },
  };
}

export default async function BlogArchivePage({
  params,
}: {
  params: { locale: Locale; page: string };
}) {
  setRequestLocale(params.locale);

  const page = Number(params.page);
  if (!Number.isInteger(page) || page < 1) notFound();

  const posts = await getPublishedPostCardsOrThrow();
  const totalPages = archivePageCount(posts.length);
  if (page > totalPages) notFound();

  const slice = posts.slice((page - 1) * ARCHIVE_PAGE_SIZE, page * ARCHIVE_PAGE_SIZE);

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[{ name: "Блог", href: "/blog" }, { name: `Страница ${page}` }]}
      />

      <section className="max-w-6xl mx-auto px-6 pt-6 pb-10">
        <p className="text-copper uppercase text-sm tracking-wider mb-4">
          Архив блога
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-cream leading-[1.05] mb-4">
          Все статьи — страница {page} из {totalPages}
        </h1>
        <p className="text-brandy/80">
          {posts.length} материалов о переезде, стоимости жизни, визах и выборе города.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slice.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>

        {/* Полный список страниц: краулер за один заход видит все URL архива. */}
        <nav
          className="flex flex-wrap items-center gap-2 mt-12"
          aria-label="Навигация по архиву блога"
        >
          {page > 1 && (
            <Link
              href={`/blog/page/${page - 1}`}
              rel="prev"
              className="px-4 h-10 inline-flex items-center rounded-xl border border-cream/10 text-brandy/80 text-sm hover:text-cream hover:border-copper/30 transition"
            >
              &larr; Предыдущая
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/blog/page/${page + 1}`}
              rel="next"
              className="px-4 h-10 inline-flex items-center rounded-xl border border-cream/10 text-brandy/80 text-sm hover:text-cream hover:border-copper/30 transition"
            >
              Следующая &rarr;
            </Link>
          )}
          <Link
            href="/blog"
            className="px-4 h-10 inline-flex items-center rounded-xl border border-copper/30 text-copper text-sm hover:bg-copper hover:text-pine-tree transition"
          >
            К ленте блога
          </Link>
        </nav>

        <nav
          className="flex flex-wrap gap-2 mt-6"
          aria-label="Страницы архива блога"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
            n === page ? (
              <span
                key={n}
                aria-current="page"
                className="px-3 py-1.5 rounded-pill border border-copper bg-copper text-pine-tree text-sm font-medium"
              >
                {n}
              </span>
            ) : (
              <Link
                key={n}
                href={`/blog/page/${n}`}
                className="px-3 py-1.5 rounded-pill border border-cream/10 text-brandy/70 text-sm hover:text-cream hover:border-copper/30 transition"
              >
                {n}
              </Link>
            ),
          )}
        </nav>
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
