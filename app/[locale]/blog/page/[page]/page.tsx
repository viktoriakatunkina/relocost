import { notFound, permanentRedirect } from "next/navigation";
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
  // i=0 (page 1) пропускаем — страница только редиректит на /blog,
  // прегенерить её как статичную нечего.
  return Array.from({ length: PRERENDER_PAGES - 1 }, (_, i) => ({
    locale: defaultLocale,
    page: String(i + 2),
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
  // 2026-09-30 (SEO-аудит): /blog/page/1 дублировал /blog — тот же контент,
  // два URL под один intent. 301 на канонический /blog, страницы 2+ без
  // изменений (там уже свой self-canonical, см. generateMetadata выше).
  if (page === 1) permanentRedirect("/blog");

  const posts = await getPublishedPostCardsOrThrow();
  const totalPages = archivePageCount(posts.length);
  if (page > totalPages) notFound();

  const slice = posts.slice((page - 1) * ARCHIVE_PAGE_SIZE, page * ARCHIVE_PAGE_SIZE);

  return (
    <main id="main-content" tabIndex={-1} className="pb-12 md:pb-24">
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

        {/* 2026-09-29 (UI-аудит): полный список из totalPages (188+) ссылок —
            намеренная SEO-инфраструктура, НЕ убираем (см. комментарий у
            <nav> выше про перелинковку ~2600 статей). Проблема была чисто
            визуальная — стена цифр на весь экран у живого человека. <details>
            решает оба: краулер/скринридер видит все ссылки в DOM как раньше
            (Google explicitly индексирует контент внутри закрытого <details>),
            человек по умолчанию видит компактный список. */}
        <details className="mt-6 group">
          <summary className="cursor-pointer inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-cream/10 text-brandy/80 text-sm hover:text-cream hover:border-copper/30 transition list-none [&::-webkit-details-marker]:hidden">
            Все {totalPages} страниц архива
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-open:rotate-180" aria-hidden><polyline points="6 9 12 15 18 9"/></svg>
          </summary>
          <nav
            className="flex flex-wrap gap-2 mt-4"
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
        </details>
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
