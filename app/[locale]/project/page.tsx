import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { buildAlternates } from "@/lib/i18n-seo";
import { type Locale } from "@/i18n/routing";

export const revalidate = 86400;

export function generateStaticParams() {
  return [{ locale: "ru" }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  return {
    title: "О проекте, тарифы и документы — Relocost",
    description:
      "Relocost: как устроен сервис, тарифы, виджет для блогеров и юридические документы — всё о проекте в одном месте.",
    alternates: buildAlternates("/project", params.locale),
  };
}

// Хаб для пункта меню "Проект" (правка 9, 2026-09-29): собирает ссылки,
// которые раньше были только в подвале сайта, в единую страницу-навигатор.
const CARDS = [
  { href: "/about", labelKey: "about", descKey: "aboutDesc" },
  { href: "/tariffs", labelKey: "tariffs", descKey: "tariffsDesc" },
  { href: "/embed", labelKey: "embed", descKey: "embedDesc" },
  { href: "/offer", labelKey: "offer", descKey: "offerDesc" },
  { href: "/privacy", labelKey: "privacy", descKey: "privacyDesc" },
  { href: "/contacts", labelKey: "contacts", descKey: "contactsDesc" },
] as const;

export default async function ProjectPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const tf = await getTranslations("footer");
  const ti = await getTranslations("projectIndex");

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs items={[{ name: tc("home"), href: "/" }, { name: tn("project") }]} />

      <section className="relative px-6 pt-12 pb-10 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 20% 10%, rgba(216,148,120,0.18), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(106,120,77,0.25), transparent 55%)",
          }}
        />
        <div className="max-w-6xl mx-auto">
          <span className="eyebrow">{tn("project")}</span>
          <h1 className="font-serif text-5xl md:text-7xl text-cream mt-6 mb-4 text-balance tracking-tight">
            {ti("title")}
          </h1>
          <p className="text-brandy/85 text-lg md:text-xl max-w-2xl text-pretty">
            {ti("subtitle")}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CARDS.map((c, i) => (
            <Reveal key={c.href} delay={i * 40}>
              <Link
                href={c.href}
                className="group flex flex-col justify-between h-full min-h-[8rem] p-6 rounded-2xl border hairline bg-surface transition hover:-translate-y-1 hover:border-copper/40 hover:shadow-card"
              >
                <h2 className="font-serif text-2xl text-cream group-hover:text-copper transition">
                  {tf(c.labelKey)}
                </h2>
                <span className="mt-3 inline-flex items-center gap-2 text-brandy/70 text-sm group-hover:text-cream transition">
                  {tc("learnMore")}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
