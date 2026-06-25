import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { Header } from "@/components/Header";
import { FavoritesLimitModal } from "@/components/FavoritesLimitModal";
import { YandexMetrika } from "@/components/YandexMetrika";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteStats } from "@/lib/site-stats";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru";

// OpenGraph locale в формате xx_XX для каждой локали сайта.
const OG_LOCALE: Record<Locale, string> = {
  ru: "ru_RU",
  en: "en_US",
  uz: "uz_UZ",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = hasLocale(routing.locales, params.locale)
    ? params.locale
    : routing.defaultLocale;
  const { cityCount } = await getSiteStats();
  const byCities = `${cityCount} городам России и зарубежья`;
  const descFull = `Считаем реальный бюджет на жизнь в любом городе: аренда, еда, транспорт, виза. Цены, отзывы и гайды по ${byCities}.`;
  const descShort = `Считаем реальный бюджет на жизнь в любом городе. Цены, отзывы и гайды по ${byCities}.`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Relocost — калькулятор стоимости жизни для переезжающих",
      template: "%s",
    },
    description: descFull,
    applicationName: "Relocost",
    authors: [{ name: "Relocost" }],
    keywords: [
      "стоимость жизни",
      "калькулятор переезда",
      "релокация",
      "переезд за границу",
      "сколько стоит жить",
      "виза для россиян",
    ],
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
      siteName: "Relocost",
      title: "Relocost — калькулятор стоимости жизни для переезжающих",
      description: descShort,
    },
    twitter: {
      card: "summary_large_image",
      title: "Relocost — калькулятор стоимости жизни для переезжающих",
      description: descShort,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    verification: {
      yandex: "e9e4f69e85d03419",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#202808",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // SSG-совместимость: фиксируем локаль запроса для статической отрисовки.
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${manrope.variable} ${cormorant.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <Header />
          {children}
          <FavoritesLimitModal />
        </NextIntlClientProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
