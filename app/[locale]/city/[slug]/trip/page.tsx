import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { supabase } from "@/lib/supabase";
import { CITY_ROUTES } from "@/lib/city-routes";
import {
  cheapestRouteFrom,
  totalStopsCount,
  pluralPoints,
  pluralRoutes,
} from "@/lib/trip-format";
import { formatRub } from "@/lib/cities";
import { typo } from "@/lib/typography";
import { type Locale } from "@/i18n/routing";
import { localizedUrl } from "@/lib/i18n-seo";
import { Link } from "@/i18n/navigation";
import { TripBoard } from "@/components/trip/TripBoard";
import { StickyBar } from "@/components/freemium/StickyBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";

export const revalidate = 86400;
// Только 6 городов, для которых есть контент в lib/city-routes.ts, и только
// ru — контент не переведён (осознанно, чтобы не раздувать билд и не
// показывать непереведённые маршруты на en/uz).
export const dynamicParams = false;

// Дательный падеж «Маршруты по …» для городов с данными — Тбилиси/Бали/Батуми
// несклоняемые, Еревану/Дубаю/Пхукету нужна другая форма, чем именительный
// city.name_ru (который приходит из БД и используется на других страницах).
const CITY_DATIVE: Record<string, string> = {
  tbilisi: "Тбилиси",
  yerevan: "Еревану",
  dubai: "Дубаю",
  bali: "Бали",
  phuket: "Пхукету",
  batumi: "Батуми",
};

export async function generateStaticParams() {
  return Object.keys(CITY_ROUTES).map((slug) => ({ locale: "ru", slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  if (!CITY_ROUTES[params.slug]) return {};
  const { data: city } = await supabase
    .from("cities")
    .select("name_ru")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) return {};

  const title = `Маршруты по ${city.name_ru} на день 2026 — куда сходить и сколько потратить | Relocost`;
  const description = `Три готовых маршрута по ${city.name_ru}: бесплатный первый день, день гурмана и бюджетный вариант. Тайминг и цены на каждую точку — по шагам.`;

  return {
    title,
    description,
    // Страница только на ru — canonical без hreflang на en/uz (их не существует).
    alternates: { canonical: localizedUrl(`/city/${params.slug}/trip`, "ru") },
    openGraph: { title, description, type: "website" },
  };
}

export default async function CityTripPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(params.locale);

  const routes = CITY_ROUTES[params.slug];
  if (!routes) notFound();

  const { data: city } = await supabase
    .from("cities")
    .select("slug, name_ru, country_ru, country_slug, is_foreign")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!city) notFound();

  const name = city.name_ru;
  const totalStops = totalStopsCount(routes);
  const dayFrom = cheapestRouteFrom(routes);

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: city.country_ru, href: `/country/${city.country_slug}` },
          { name, href: `/city/${city.slug}` },
          { name: "Маршруты на день" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-6 pt-12 pb-2">
        <span className="eyebrow">Маршруты на день</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.05] mt-6 mb-4">
          Маршруты по {CITY_DATIVE[city.slug] ?? name} на день
        </h1>
        <p className="text-brandy/80 text-lg max-w-2xl text-pretty">
          {typo(
            "Три готовых маршрута без раздумий: куда пойти, где поесть и что успеть до заката. Тайминг и цены — на каждую точку.",
          )}
        </p>
        <p className="text-brandy/55 text-sm mt-4">
          {totalStops} {pluralPoints(totalStops)} в {routes.length}{" "}
          {pluralRoutes(routes.length)} · день от {formatRub(dayFrom)}
        </p>
      </section>

      <TripBoard citySlug={city.slug} cityName={name} routes={routes} />

      <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
        <div className="rounded-3xl border hairline bg-surface p-6 md:p-8 flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0">
            <h2 className="font-serif text-2xl text-cream mb-1.5">
              Понравился {name}?
            </h2>
            <p className="text-brandy/70 text-sm max-w-md text-pretty">
              Посмотрите, сколько стоит здесь жить — аренда, еда, транспорт и
              полный бюджет на месяц.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap shrink-0">
            <Link
              href={`/city/${city.slug}`}
              className="px-5 py-2.5 rounded-pill border hairline text-brandy hover:text-cream hover:border-copper/40 transition text-sm min-h-[44px] inline-flex items-center"
            >
              О городе
            </Link>
            <Link
              href={`/city/${city.slug}/budget`}
              className="px-5 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold hover:bg-brandy transition text-sm min-h-[44px] inline-flex items-center"
            >
              Бюджет на жизнь
            </Link>
          </div>
        </div>
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>

      <StickyBar slug={city.slug} isForeign={city.is_foreign} />
    </main>
  );
}
