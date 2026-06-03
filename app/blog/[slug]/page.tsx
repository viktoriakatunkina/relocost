import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  coverGradient,
  getAllPostSlugs,
  getCityForPost,
  getPostBySlug,
  getPublishedPosts,
} from "@/lib/blog";
import { unsplashSrc, unsplashAuthorUrlWithUtm } from "@/lib/unsplash";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import type { City } from "@/lib/types";
import { ShareButton } from "@/components/ShareButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? undefined,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.seo_description ?? undefined,
      type: "article",
      publishedTime: post.created_at,
      url: `/blog/${params.slug}`,
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
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  const [city, allPosts] = await Promise.all([
    getCityForPost(post.city_id) as Promise<City | null>,
    getPublishedPosts(),
  ]);

  const heroCover = unsplashSrc(post.cover_url, { w: 1600, q: 80 });
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
      name: "Relocost",
      url: SITE_URL,
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

  return (
    <main className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: "Блог", href: "/blog" },
          { name: post.title },
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
          <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] max-w-3xl mb-8">
            {post.title}
          </h1>
          <ShareButton
            title={post.title}
            text={post.seo_description ?? undefined}
          />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pt-16 grid lg:grid-cols-[1fr_300px] gap-12">
        <article
          className="prose prose-invert prose-headings:font-serif prose-headings:text-cream prose-p:text-brandy/90 prose-strong:text-cream prose-a:text-copper prose-a:no-underline hover:prose-a:underline prose-li:text-brandy/90 prose-table:text-brandy/90 prose-th:text-cream prose-hr:hairline max-w-none"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content_md}
          </ReactMarkdown>
        </article>

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

      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}
