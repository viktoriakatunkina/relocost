import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChecklistClient } from "@/components/checklist/ChecklistClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { CHECKLIST_STEPS } from "@/lib/checklist-data";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  return {
    title: "Чек-лист переезда за границу и по России 2026 — что не забыть | Relocost",
    description:
      "Пошаговый чек-лист переезда: документы, виза и ВНЖ, банк и карта, жильё, перевозка, связь и налоги. Отмечайте сделанное — список сохранится в браузере.",
    alternates: buildAlternates("/checklist", params.locale),
    openGraph: {
      title: "Чек-лист переезда — что нужно сделать",
      description:
        "Пошаговый план переезда за границу и по России: до отъезда, по прибытии и в первый месяц.",
      type: "website",
    },
  };
}

export default async function ChecklistPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");

  // HowTo-разметка по варианту «за границу» — сильный SEO-сигнал для интента
  // «как переехать за границу пошагово».
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Как переехать за границу: пошаговый чек-лист",
    description:
      "Полный план переезда за рубеж: документы, виза и ВНЖ, банк, жильё, связь и налоги.",
    step: CHECKLIST_STEPS.foreign.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <main className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <Breadcrumbs
        items={[{ name: tc("home"), href: "/" }, { name: "Чек-лист переезда" }]}
      />

      <section className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <span className="eyebrow">Планировщик</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-6">
          Чек-лист переезда
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl text-pretty">
          Пошаговый план, чтобы ничего не упустить — отдельно для переезда за
          границу и внутри России. Отмечайте сделанное: прогресс сохранится в
          этом браузере и будет ждать Вас при следующем заходе.
        </p>
      </section>

      <ChecklistClient initialVariant="foreign" />

      <div className="pt-16">
        <Footer />
      </div>
    </main>
  );
}
