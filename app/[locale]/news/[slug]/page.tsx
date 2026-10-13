import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getNewsBySlug } from "@/lib/news";
import { getCitiesForTitleMatch } from "@/lib/cities";
import { matchCityForNews } from "@/lib/news-city-match";
import { NewsCTA } from "@/components/news/NewsCTA";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { fetchWithHardTimeout } from "@/lib/supabase";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale, type Locale } from "@/i18n/routing";
import { buildRuOnlyAlternates } from "@/lib/i18n-seo";

export const revalidate = 3600;
// Неизвестные (новые, опубликованные после билда) slug рендерятся по первому
// запросу и кешируются ISR — тот же паттерн, что у /blog/[slug].
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];
    const res = await fetchWithHardTimeout(
      `${url}/rest/v1/news_items?select=slug&published=eq.true&order=event_date.desc.nullslast,created_at.desc&limit=500`,
      { apikey: key, Authorization: `Bearer ${key}` },
    );
    if (!res.ok) return [];
    const rows: { slug: string }[] = await res.json();
    // Только ru — новости не переводятся (тот же принцип, что у блога).
    return rows.map((r) => ({ locale: "ru", slug: r.slug }));
  } catch {
    return [];
  }
}

// 2026-10-13 (SEO-аудит): у части новостей заголовок (post.title) и/или summary
// пришли из источника длинными («Ускоритель Super Heavy прибыл на стартовую
// площадку перед первым орбитальным пуском Starship» — 92 символа) — с
// суффиксом «| Новости Relocost» <title> доходил до 111 символов, а
// meta-description (= summary) — до 279. Google/Яндекс обрезают это сами по
// символам прямо посреди слова, что в сниппете выглядит как явный баг. Режем
// по границе слова здесь же, в мета-тегах, не трогая исходные title/summary
// в Supabase (они и на странице, и в OG-карточке остаются полными).
function truncateAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[.,;:—-]+$/, "")}…`;
}

function buildNewsMetaTitle(title: string): string {
  const suffix = " | Новости Relocost";
  if (title.length + suffix.length <= 70) return `${title}${suffix}`;
  // Заголовок сам по себе длинный — бренд-суффикс в этом случае только
  // ускоряет обрезание в выдаче ровно там, где обрезался бы сам текст новости.
  return title.length <= 78 ? title : truncateAtWord(title, 75);
}

function buildNewsMetaDescription(summary: string): string {
  return truncateAtWord(summary, 155);
}

function formatNewsDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const post = await getNewsBySlug(params.slug);
  if (!post) return {};
  const metaDescription = buildNewsMetaDescription(post.summary);
  return {
    title: buildNewsMetaTitle(post.title),
    description: metaDescription,
    alternates: buildRuOnlyAlternates(`/news/${post.slug}`),
    openGraph: {
      // OG/Twitter-карточки режут текст по своим правилам при рендере
      // (и у них больше запаса по длине) — здесь оставляем полный заголовок
      // и summary, как раньше.
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.created_at,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function NewsItemPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations({ locale: defaultLocale, namespace: "common" });

  const post = await getNewsBySlug(params.slug);
  if (!post) notFound();

  const citiesForMatch = await getCitiesForTitleMatch();
  const ctaTarget = matchCityForNews(post.title, post.summary, citiesForMatch);

  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru").replace(/\/$/, "");
  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.summary,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: { "@type": "Organization", name: "Редакция Relocost", url: `${SITE_URL}/about` },
    publisher: {
      "@type": "Organization",
      name: "Relocost",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/news/${post.slug}` },
  };

  const dateLabel = formatNewsDate(post.event_date ?? post.created_at);

  return (
    <main className="pb-20 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: "Новости", href: "/news" },
          { name: post.title },
        ]}
      />

      <div className="max-w-3xl mx-auto px-6 pt-12">
        <div className="flex items-center gap-2 text-brandy/70 text-xs uppercase tracking-wider mb-4">
          {post.category && <span className="text-copper">{post.category}</span>}
          {post.category && dateLabel && <span>·</span>}
          {dateLabel && <span>{dateLabel}</span>}
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-cream leading-[1.1] mb-6">
          {post.title}
        </h1>
        <p className="text-brandy/85 text-lg leading-relaxed mb-8">{post.summary}</p>

        <article className="prose prose-invert prose-headings:font-serif prose-headings:text-cream prose-p:text-brandy/90 prose-strong:text-cream prose-a:text-copper prose-a:no-underline hover:prose-a:underline prose-li:text-brandy/90 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content_md}</ReactMarkdown>
        </article>

        {/* Обязательный CTA на оплату — см. lib/news-city-match.ts: ведёт на
            /city/[slug]/budget при упоминании конкретного города,
            /country/[slug] при упоминании только страны, иначе на
            общий /tariffs. */}
        <NewsCTA target={ctaTarget} variant="article" />

        {post.source_name && (
          <p className="mt-6 text-brandy/55 text-sm">
            Источник:{" "}
            {post.source_url ? (
              <a
                href={post.source_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-copper hover:underline"
              >
                {post.source_name}
              </a>
            ) : (
              post.source_name
            )}
          </p>
        )}

        <div className="mt-10 pt-6 border-t hairline">
          <Link href="/news" className="text-copper hover:underline text-sm">
            ← Все новости
          </Link>
        </div>
      </div>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
