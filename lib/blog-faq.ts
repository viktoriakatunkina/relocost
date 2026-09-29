import type { FaqItem } from "@/components/FaqSchema";

// Достаёт вопросы-ответы из секции "## Часто задаваемые вопросы" / "## FAQ"
// в теле статьи блога — 2026-09-29, GEO/AEO-правка: у 438 из 1000
// опубликованных статей уже есть такая секция в тексте (написана авторами
// контента), но нигде не было FAQPage-разметки для неё — ни AI-движки, ни
// Google не могли вытащить эти пары как структурированные факты. Формат в
// content_md стабильный: "**Вопрос?**" на отдельной строке, затем один или
// несколько абзацев ответа до следующего "**" или "##".
const FAQ_HEADING =
  /^##\s+(?:Часто задаваемые вопросы|FAQ|Вопросы и ответы|Frequently Asked Questions)\s*$/im;

// Для JSON-LD текст должен быть читаемым без рендера markdown — ссылки вида
// "[калькулятор Relocost](/)" превращаем в просто "калькулятор Relocost".
function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractBlogFaqItems(contentMd: string): FaqItem[] {
  const headingMatch = FAQ_HEADING.exec(contentMd);
  if (!headingMatch) return [];

  const afterHeading = contentMd.slice(headingMatch.index + headingMatch[0].length);
  const nextHeadingIdx = afterHeading.search(/^##\s+/m);
  const section = nextHeadingIdx === -1 ? afterHeading : afterHeading.slice(0, nextHeadingIdx);

  const items: FaqItem[] = [];
  // Разбиваем по жирным строкам-вопросам: "**...**" на отдельной строке.
  const parts = section.split(/^\*\*(.+?)\*\*\s*$/m);
  // parts: [preamble, q1, answerBlock1, q2, answerBlock2, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const q = parts[i]?.trim();
    const a = parts[i + 1]?.trim();
    if (q && a) items.push({ q: stripMarkdown(q), a: stripMarkdown(a) });
  }
  return items;
}
