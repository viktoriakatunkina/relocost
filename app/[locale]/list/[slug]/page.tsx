import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getListData, getListDef, getAllListSlugs, type Tip } from "@/lib/lists";
import { CityCard } from "@/components/CityCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { type Locale } from "@/i18n/routing";
import { buildAlternates, localizedUrl } from "@/lib/i18n-seo";

export const revalidate = 86400;

export function generateStaticParams() {
  const slugs = getAllListSlugs();
  return slugs.map((slug) => ({ locale: "ru", slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const def = getListDef(params.slug);
  if (!def) return {};
  return {
    title: def.seoTitle,
    description: def.seoDescription,
    alternates: buildAlternates(`/list/${params.slug}`, params.locale),
    openGraph: { title: def.title, description: def.seoDescription, type: "website" },
  };
}

export default async function ListPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const data = await getListData(params.slug);
  if (!data) notFound();
  const { def, cities } = data;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: def.title,
    numberOfItems: cities.length,
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: localizedUrl(`/city/${c.slug}`, params.locale),
      name: c.name_ru,
    })),
  };

  return (
    <main className="pb-12 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Breadcrumbs
        items={[{ name: tc("home"), href: "/" }, { name: def.title }]}
      />

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-4">
        <span className="eyebrow">{def.eyebrow}</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-6 max-w-3xl">
          {def.title}
        </h1>
        <p className="text-brandy/85 text-lg max-w-3xl leading-relaxed text-pretty">
          {def.intro}
        </p>
      </section>

      {def.tips.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pt-6 pb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {def.tips.map((tip: Tip) => (
              <div
                key={tip.title}
                className="rounded-xl border border-dingley/25 bg-kombu-green/40 p-4"
              >
                <span className="text-2xl leading-none block mb-2" aria-hidden="true">
                  {tip.icon}
                </span>
                <p className="font-semibold text-cream text-sm mb-1">{tip.title}</p>
                <p className="text-brandy/75 text-sm leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 pt-8">
        {cities.length === 0 ? (
          <p className="text-brandy/70">Пока нет подходящих городов.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {cities.map((c, i) => (
              <CityCard key={c.id} city={c} index={i} />
            ))}
          </div>
        )}
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
