import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Relocost — калькулятор стоимости жизни",
    short_name: "Relocost",
    description:
      "Считаем реальный бюджет на жизнь в любом городе: аренда, еда, транспорт, виза. Цены и гайды для переезжающих.",
    start_url: "/",
    display: "standalone",
    background_color: "#202808",
    theme_color: "#202808",
    lang: "ru",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
