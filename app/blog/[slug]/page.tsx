import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  coverGradient,
  getAllPostSlugs,
  getCityForPost,
  getPostBySlug,
} from "@/lib/blog";
import type { City } from "@/lib/types";
import { ShareButton } from "@/components/ShareButton";
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
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  const city = (await getCityForPost(post.city_id)) as City | null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description ?? undefined,
    datePublished: post.created_at,
    author: { "@type": "Organization", name: "Relocost" },
    publisher: { "@type": "Organization", name: "Relocost" },
  };

  return (
    <main className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <section
        className={`relative bg-gradient-to-br ${coverGradient(post.slug)} overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/40 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brandy/70 hover:text-pale-copper text-sm mb-8 transition"
          >
            ← Все статьи
          </Link>
          <div className="flex items-center gap-2 text-brandy/70 text-xs uppercase tracking-wider mb-4">
            {post.tag && (
              <span className="text-pale-copper">{post.tag}</span>
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
          className="prose prose-invert prose-headings:font-serif prose-headings:text-cream prose-p:text-brandy/90 prose-strong:text-cream prose-a:text-pale-copper prose-a:no-underline hover:prose-a:underline prose-li:text-brandy/90 prose-table:text-brandy/90 prose-th:text-cream prose-hr:border-dingley/30 max-w-none"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content_md}
          </ReactMarkdown>
        </article>

        {city && (
          <aside className="lg:sticky lg:top-8 self-start">
            <div className="p-6 rounded-2xl bg-kombu-green/40 border border-dingley/30">
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
                Открой полный профиль города: реальные цены, калькулятор,
                виза, плюсы и минусы, отзывы переехавших.
              </p>
              <Link
                href={`/city/${city.slug}`}
                className="block w-full text-center px-5 py-3 rounded-pill bg-pale-copper text-pine-tree font-semibold transition hover:bg-brandy"
              >
                Профиль {city.name_ru} →
              </Link>
            </div>
          </aside>
        )}
      </div>

      <div className="pt-24">
        <Footer />
      </div>
    </main>
  );
}
