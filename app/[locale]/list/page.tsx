import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getAllListsPreview } from "@/lib/lists";
import { isR2Src } from "@/lib/photo";
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
    title: "Все подборки городов для переезда 2026 — Relocost",
    description:
      "14 готовых подборок городов для переезда: по бюджету, климату, визам, работе и семье. Выберите свою и переходите к реальным ценам.",
    alternates: buildAlternates("/list", params.locale),
  };
}

// Ключи footer.list* — уже переведённые подписи подборок (используются и в
// подвале сайта, и в блоке "Подборки" на главной). Здесь единый источник
// подписей для всех 14 карточек индекса (правка 9, 2026-09-29).
const LABEL_KEY: Record<string, string> = {
  "samye-deshevye": "listCheapest",
  "do-50000-rubley": "listBudget",
  "do-80000-rubley": "listBudget80",
  "dlya-zimovki": "listWinter",
  "teplye-strany": "listWarm",
  "u-morya": "listSeaside",
  "dlya-udalenki": "listRemote",
  "dlya-ayti": "listIt",
  "prostoy-pereezd": "listEasy",
  "bezvizovye": "listVisaFree",
  "evropa": "listEurope",
  "s-detmi": "listKids",
  "dlya-pensionerov": "listSeniors",
  "razvedka-pered-pereezdom": "listRecon",
};

export default async function ListsIndexPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const tf = await getTranslations("footer");
  const ti = await getTranslations("listsIndex");
  const lists = await getAllListsPreview();

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs items={[{ name: tc("home"), href: "/" }, { name: tn("lists") }]} />

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
          <span className="eyebrow">{tn("lists")}</span>
          <h1 className="font-serif text-5xl md:text-7xl text-cream mt-6 mb-4 text-balance tracking-tight">
            {ti("title")}
          </h1>
          <p className="text-brandy/85 text-lg md:text-xl max-w-2xl text-pretty">
            {ti("subtitle")}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lists.map((l, i) => (
            <Reveal key={l.slug} delay={i * 40} className="h-full">
              <Link
                href={`/list/${l.slug}`}
                className="group relative flex h-full min-h-[13rem] flex-col justify-end overflow-hidden rounded-2xl sm:rounded-3xl border hairline bg-surface transition hover:-translate-y-1 hover:border-copper/40 hover:shadow-card"
              >
                {l.photo ? (
                  <Image
                    src={l.photo}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    unoptimized={isR2Src(l.photo)}
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-kombu-green via-kombu-green to-pine-tree"
                    aria-hidden
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-pine-tree via-pine-tree/70 to-pine-tree/10" />
                <div className="relative z-10 p-5 sm:p-6">
                  <span className="text-copper text-xs font-semibold uppercase tracking-wider">
                    {l.eyebrow}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl text-cream mt-1.5 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:text-copper transition">
                    {LABEL_KEY[l.slug] ? tf(LABEL_KEY[l.slug]) : l.shortTitle}
                  </h2>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
