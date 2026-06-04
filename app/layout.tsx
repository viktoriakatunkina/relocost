import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { YandexMetrika } from "@/components/YandexMetrika";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Relocost — калькулятор стоимости жизни для переезжающих",
    template: "%s",
  },
  description:
    "Считаем реальный бюджет на жизнь в любом городе: аренда, еда, транспорт, виза. Цены, отзывы и гайды по 37 городам в России и за рубежом.",
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
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Relocost",
    title: "Relocost — калькулятор стоимости жизни для переезжающих",
    description:
      "Считаем реальный бюджет на жизнь в любом городе. Цены, отзывы и гайды по 37 городам в РФ и за рубежом.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relocost — калькулятор стоимости жизни для переезжающих",
    description:
      "Считаем реальный бюджет на жизнь в любом городе. Цены, отзывы и гайды по 37 городам в РФ и за рубежом.",
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

export const viewport: Viewport = {
  themeColor: "#202808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body
        className={`${manrope.variable} ${cormorant.variable} antialiased`}
      >
        <Header />
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
