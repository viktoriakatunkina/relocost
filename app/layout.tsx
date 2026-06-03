import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Relocost — калькулятор стоимости жизни для переезжающих",
  description:
    "Считаем реальный бюджет на жизнь в любом городе: аренда, еда, транспорт, виза. Цены, отзывы, гайды по 10+ направлениям внутри РФ и за рубежом.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body
        className={`${manrope.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
