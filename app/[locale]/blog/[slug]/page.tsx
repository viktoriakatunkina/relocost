import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  coverGradient,
  getAllPostSlugs,
  getCitiesByCountry,
  getCityForPost,
  getPostBySlug,
  getPublishedPosts,
} from "@/lib/blog";
import { getPopularCities } from "@/lib/cities";
import { unsplashAuthorUrlWithUtm } from "@/lib/unsplash";
import { photoSrc } from "@/lib/photo";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ArticleCityData } from "@/components/blog/ArticleCityData";
import { BlogReportCTA } from "@/components/blog/BlogReportCTA";
import { getPricesByCity } from "@/lib/prices";
import type { City, Price, PriceCategory } from "@/lib/types";
import { ShareButton } from "@/components/ShareButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { EmailSignupInline, EmailSignupSticky } from "@/components/blog/EmailSignup";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { localizeBlogPost } from "@/lib/content-i18n";

export const revalidate = 3600;
// Неизвестные slug рендерятся по первому запросу и кешируются ISR.
export const dynamicParams = true;

// Консолидация дублей: слабая статья отдаёт canonical на более полную версию,
// чтобы они не каннибализировали друг друга в поиске. Ключ — slug-дубль,
// значение — slug канонической (более полной) статьи.
const BLOG_CANONICAL: Record<string, string> = {
  "perevod-deneg-za-granitsu-2026": "kak-perevesti-dengi-iz-rossii-za-granitsu-2026",
};

export function generateStaticParams() {
  // Все статьи генерируются ISR при первом запросе (dynamicParams=true).
  // Supabase-таймауты при сборке устранены полностью.
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const raw = await getPostBySlug(params.slug);
  if (!raw) return {};
  // Локализуем заголовок/seo статьи (en/uz — перевод, иначе ru-фолбэк).
  const post = await localizeBlogPost(raw, params.locale);
  const canonicalSlug = BLOG_CANONICAL[params.slug] ?? params.slug;
  return {
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? undefined,
    alternates: buildAlternates(`/blog/${canonicalSlug}`, params.locale),
    openGraph: {
      title: post.title,
      description: post.seo_description ?? undefined,
      type: "article",
      publishedTime: post.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.seo_description ?? undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");

  const rawPost = await getPostBySlug(params.slug);
  if (!rawPost) notFound();
  // Локализуем тело статьи (title, content_md, seo) — ниже всё рендерится из
  // этого объекта. Для ru возвращается исходный пост без изменений.
  const post = await localizeBlogPost(rawPost, params.locale);
  const [city, allPosts, prices, countryCities, popularCities] = await Promise.all([
    getCityForPost(post.city_id) as Promise<City | null>,
    getPublishedPosts(),
    post.city_id
      ? getPricesByCity(post.city_id)
      : Promise.resolve(null as Record<PriceCategory, Price[]> | null),
    // Когда статья привязана к стране, но не к конкретному городу — загружаем
    // топ городов страны, чтобы вести читателя на страницы с premium-контентом.
    (!post.city_id && post.country_slug)
      ? getCitiesByCountry(post.country_slug)
      : Promise.resolve([] as Awaited<ReturnType<typeof getCitiesByCountry>>),
    // Популярные города — для статей без страны и без города (общие обзоры)
    (!post.city_id && !post.country_slug)
      ? getPopularCities(8)
      : Promise.resolve([] as Awaited<ReturnType<typeof getPopularCities>>),
  ]);

  const updatedLabel = new Intl.DateTimeFormat(params.locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(post.created_at));

  const heroCover = photoSrc(post.cover_image_url, post.cover_url, { w: 1600, q: 80 });
  const heroAuthorUrl = unsplashAuthorUrlWithUtm(post.cover_author_url);

  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru").replace(/\/$/, "");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description ?? undefined,
    image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: {
      "@type": "Organization",
      name: "Редакция Relocost",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Relocost",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  // Разбивка контента для mid-article inline CTA (~45% текста)
  const contentParagraphs = post.content_md.split(/\n\n+/);
  const midSplitAt = Math.max(3, Math.floor(contentParagraphs.length * 0.45));
  const contentFirstHalf = contentParagraphs.slice(0, midSplitAt).join('\n\n');
  const contentSecondHalf = contentParagraphs.slice(midSplitAt).join('\n\n');
  const hasMidCTA = contentParagraphs.length > 6;

  // Ссылка для мобильного sticky-CTA: на город статьи или на поиск.
  const mobileCTAHref = city ? `/city/${city.slug}` : `/search`;
  const mobileCTALabel = city
    ? `Рассчитайте стоимость жизни в ${city.name_ru} →`
    : "Рассчитайте стоимость переезда →";

  // Краткий отображаемый заголовок: берём часть до первого «;» (в SEO-заголовках
  // вида «Страна Город DN 2026: £ХХХ; «ХУК»: …» после первой точки с запятой идут
  // исторические врезки, которые выглядят ужасно в качестве h1).
  const displayTitle = post.title.includes(";")
    ? post.title.split(";")[0].trim()
    : post.title;

  return (
    <main className="pb-20 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: tn("blog"), href: "/blog" },
          { name: displayTitle },
        ]}
      />
      <section
        className={`relative bg-gradient-to-br ${coverGradient(post.slug)} overflow-hidden`}
      >
        {heroCover && (
          <Image
            src={heroCover}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/55 to-pine-tree/30" />
        {post.cover_author_name && heroAuthorUrl && (
          <a
            href={heroAuthorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-4 z-10 text-[11px] text-brandy/55 hover:text-brandy transition"
          >
            Фото: {post.cover_author_name} / Unsplash
          </a>
        )}
        <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brandy/70 hover:text-copper text-sm mb-8 transition"
          >
            ← Все статьи
          </Link>
          <div className="flex items-center gap-2 text-brandy/70 text-xs uppercase tracking-wider mb-4">
            {post.tag && (
              <span className="text-copper">{post.tag}</span>
            )}
            {post.tag && post.read_time && <span>·</span>}
            {post.read_time && <span>{post.read_time} мин чтения</span>}
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] max-w-3xl mb-6">
            {displayTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-brandy/70 text-sm mb-8">
            <Link href="/about" className="text-brandy/90 hover:text-copper transition">
              Редакция Relocost
            </Link>
            <span aria-hidden>·</span>
            <span>обновлено: {updatedLabel}</span>
          </div>
          <ShareButton
            title={post.title}
            text={post.seo_description ?? undefined}
          />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pt-16 grid lg:grid-cols-[1fr_300px] gap-12">
        <div>
          <article
            className="prose prose-invert prose-headings:font-serif prose-headings:text-cream prose-p:text-brandy/90 prose-strong:text-cream prose-a:text-copper prose-a:no-underline hover:prose-a:underline prose-li:text-brandy/90 prose-table:text-brandy/90 prose-th:text-cream prose-hr:hairline max-w-none"
          >
            {/* Первая половина контента (до inline CTA) */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                table({ node, ...props }) {
                  return (
                    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                      <table {...props} />
                    </div>
                  );
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                img({ node, src, alt, title, ...props }) {
                  let author: string | undefined;
                  let href: string | undefined;
                  if (typeof title === "string" && title.includes("::")) {
                    [author, href] = title.split("::");
                  }
                  return (
                    <span className="not-prose my-8 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={typeof src === "string" ? src : undefined}
                        alt={alt ?? ""}
                        loading="lazy"
                        decoding="async"
                        className="block aspect-[16/9] w-full rounded-2xl border object-cover hairline"
                        {...props}
                      />
                      {(alt || author) && (
                        <span className="mt-2.5 block text-center text-xs text-brandy/55">
                          {alt}
                          {author && (
                            <>
                              {alt ? " · " : ""}Фото:{" "}
                              {href ? (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer nofollow"
                                  className="underline-offset-2 hover:text-copper hover:underline"
                                >
                                  {author}
                                </a>
                              ) : (
                                author
                              )}{" "}
                              / Unsplash
                            </>
                          )}
                        </span>
                      )}
                    </span>
                  );
                },
              }}
            >
              {hasMidCTA ? contentFirstHalf : post.content_md}
            </ReactMarkdown>

            {/* Mid-article inline CTA — вставляем в середину, чтобы не пропустить мобильных */}
            {hasMidCTA && (
              <div
                className="not-prose my-8 rounded-2xl border border-copper/60 px-5 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232,155,110,0.18) 0%, rgba(232,155,110,0.06) 100%)",
                }}
              >
                <div className="flex-1">
                  <p className="font-serif text-lg md:text-xl text-cream leading-tight mb-1.5">
                    {city
                      ? `Полный отчёт по ${city.name_ru} — от 19 ₽`
                      : "Полный отчёт по городу — от 19 ₽"}
                  </p>
                  <p className="text-brandy/80 text-sm">
                    Реальные цены · Калькулятор бюджета · Виза · Гайд — единоразовая оплата.
                  </p>
                </div>
                <Link
                  href={city ? `/city/${city.slug}` : `/search`}
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-copper text-pine-tree font-bold text-sm hover:bg-pale-copper hover:shadow-glow transition whitespace-nowrap"
                >
                  {city ? `Открыть отчёт по ${city.name_ru}` : "Подобрать город"}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}

            {/* Вторая половина контента */}
            {hasMidCTA && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  table({ node, ...props }) {
                    return (
                      <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                        <table {...props} />
                      </div>
                    );
                  },
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  img({ node, src, alt, title, ...props }) {
                    let author: string | undefined;
                    let href: string | undefined;
                    if (typeof title === "string" && title.includes("::")) {
                      [author, href] = title.split("::");
                    }
                    return (
                      <span className="not-prose my-8 block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={typeof src === "string" ? src : undefined}
                          alt={alt ?? ""}
                          loading="lazy"
                          decoding="async"
                          className="block aspect-[16/9] w-full rounded-2xl border object-cover hairline"
                          {...props}
                        />
                        {(alt || author) && (
                          <span className="mt-2.5 block text-center text-xs text-brandy/55">
                            {alt}
                            {author && (
                              <>
                                {alt ? " · " : ""}Фото:{" "}
                                {href ? (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="underline-offset-2 hover:text-copper hover:underline"
                                  >
                                    {author}
                                  </a>
                                ) : (
                                  author
                                )}{" "}
                                / Unsplash
                              </>
                            )}
                          </span>
                        )}
                      </span>
                    );
                  },
                }}
              >
                {contentSecondHalf}
              </ReactMarkdown>
            )}
          </article>

          {/* End-article CTA: витрина пакетов с ценами */}
          <BlogReportCTA city={city} />

          {/* Блок городов страны: показываем когда статья о стране, но без конкретного города */}
          {!city && countryCities.length > 0 && (
            <div className="mt-10 rounded-3xl border border-copper/25 bg-surface p-6 md:p-8">
              <p className="text-brandy/60 text-xs uppercase tracking-wider mb-3">
                Города этой страны на Relocost
              </p>
              <h3 className="font-serif text-xl text-cream mb-5">
                Детальные бюджеты и гайды по переезду
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {countryCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}`}
                    className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-surface-elevated border hairline hover:border-copper/50 hover:bg-copper/5 transition text-center"
                  >
                    {c.flag_emoji && (
                      <span className="text-2xl" aria-hidden>{c.flag_emoji}</span>
                    )}
                    <span className="text-cream text-sm font-medium leading-tight">
                      {c.name_ru}
                    </span>
                    <span className="text-copper text-xs">Открыть →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Популярные города: для общих статей без страны и без города */}
          {!city && countryCities.length === 0 && popularCities.length > 0 && (
            <div className="mt-10 rounded-3xl border border-copper/25 bg-surface p-6 md:p-8">
              <p className="text-brandy/60 text-xs uppercase tracking-wider mb-3">
                Популярные направления
              </p>
              <h3 className="font-serif text-xl text-cream mb-2">
                Узнайте стоимость жизни по городам
              </h3>
              <p className="text-brandy/70 text-sm mb-5">
                Реальные цены на аренду, еду и транспорт. Калькулятор бюджета на Ваш стиль жизни.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {popularCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}`}
                    className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-surface-elevated border hairline hover:border-copper/50 hover:bg-copper/5 transition text-center"
                  >
                    {c.flag_emoji && (
                      <span className="text-2xl" aria-hidden>{c.flag_emoji}</span>
                    )}
                    <span className="text-cream text-sm font-medium leading-tight">
                      {c.name_ru}
                    </span>
                    <span className="text-copper text-xs">Смотреть цены →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {city && prices && <ArticleCityData city={city} prices={prices} />}

          {/* Лид-магнит: чек-лист переезда на email */}
          <EmailSignupInline source={`blog-${post.slug}`} />

          <div className="mt-12 pt-6 border-t hairline text-sm text-brandy/65 space-y-2">
            <p>
              <strong className="text-cream">Как мы считаем.</strong> Цены — агрегированные
              оценки из открытых источников (Numbeo, Expatistan, курс ЦБ РФ), приведенные к
              рублям и обновляемые ежеквартально. Подробнее — на странице{" "}
              <Link href="/about" className="text-copper hover:underline">
                О проекте
              </Link>
              .
            </p>
            <p>
              Данные по визам, налогам и банкам актуальны на 2026 год и могут быстро меняться —
              проверяйте первоисточники перед решениями.
            </p>
          </div>
        </div>

        {city && (
          <aside className="lg:sticky lg:top-8 self-start">
            <div className="p-6 rounded-2xl bg-surface border hairline">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl" aria-hidden>
                  {city.flag_emoji}
                </span>
                <div>
                  <p className="text-brandy/60 text-xs uppercase tracking-wider">
                    Город из статьи
                  </p>
                  <h3 className="font-serif text-xl text-cream">
                    {city.name_ru}
                  </h3>
                </div>
              </div>
              <p className="text-brandy/80 text-sm mb-5 leading-relaxed">
                Откройте полный профиль города: реальные цены, калькулятор,
                виза, плюсы и минусы, отзывы переехавших.
              </p>
              <Link
                href={`/city/${city.slug}`}
                className="block w-full text-center px-5 py-3 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy"
              >
                Профиль {city.name_ru} →
              </Link>
            </div>
          </aside>
        )}
      </div>

      <RelatedPosts current={post} all={allPosts} />

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>

      {/* Email-лид-магнит: scroll-triggered sticky на мобиле */}
      <EmailSignupSticky source={`blog-sticky-${post.slug}`} />

      {/* Sticky bottom CTA — только на мобиле, всегда виден */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3">
        <Link
          href={mobileCTAHref}
          className="flex items-center justify-between gap-3 w-full rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-copper/30 shadow-2xl px-5 py-3.5 text-cream hover:border-copper/60 transition"
        >
          <span className="text-sm font-medium leading-snug">
            {mobileCTALabel}
          </span>
          <span className="shrink-0 px-4 py-2 rounded-pill bg-copper text-pine-tree font-semibold text-sm hover:bg-brandy transition">
            Открыть
          </span>
        </Link>
      </div>
    </main>
  );
}
