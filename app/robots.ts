import type { MetadataRoute } from "next";

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://relocost.ru"
).replace(/\/$/, "");

// GEO/AEO (2026-09-29): общий "User-Agent: * / Allow: /" уже разрешает всех
// ботов, включая AI-краулеров — но явный список надёжнее на будущее (если
// кто-то потом добавит Disallow под "*", не думая про AI-ботов, эти правила
// останутся отдельными строками и не пострадают) и задокументирован сам
// список тех, кого мы осознанно пускаем.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — обучение
  "OAI-SearchBot", // OpenAI — поиск/ответы ChatGPT
  "ChatGPT-User", // OpenAI — переход по ссылке из ответа пользователя
  "ClaudeBot", // Anthropic — обучение
  "Claude-User", // Anthropic — переход по ссылке из ответа
  "Claude-SearchBot", // Anthropic — поиск/ответы
  "anthropic-ai", // Anthropic — старый UA
  "PerplexityBot", // Perplexity — поиск/ответы
  "Perplexity-User",
  "Google-Extended", // используется Gemini/AI Overviews поверх обычного Googlebot
  "Applebot-Extended", // Apple Intelligence
  "Meta-ExternalAgent", // Meta AI
  "Amazonbot",
  "CCBot", // Common Crawl — датасет для многих LLM
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
