// Батч 17: 10 SEO-статей Relocost
// Темы: Банк Грузия, Испания (переезд), Черногория (жизнь),
// Перевоз животных, Налоги при релокации, Аренда в Турции,
// Стоимость жизни Таиланд, Армения (плюсы/минусы), ВНЖ Сербии, Дети за границей
// Запуск: node --input-type=module < scripts/seed-blog-batch-17.mjs

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HOME = os.homedir();

const SUPA_URL = fs
  .readFileSync(`${HOME}/.relocost/supabase_url`, "utf8")
  .trim();
const KEY = fs
  .readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8")
  .trim();

const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

function md(slug) {
  return fs.readFileSync(
    path.join(ROOT, "content/blog", `${slug}.md`),
    "utf8"
  );
}

const posts = [
  // 1. Банковский счёт в Грузии для россиян
  {
    slug: "bank-gruziya-schot-rossiyanin-2026",
    title: "Как открыть банковский счёт в Грузии для россиян 2026",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Банковский счёт в Грузии для россиян 2026",
    seo_description:
      "Какие банки открывают счета россиянам в Грузии в 2026, какие документы нужны и как переводить деньги. TBC Bank, Bank of Georgia — актуальный расклад.",
    content_md: md("bank-gruziya-schot-rossiyanin-2026"),
  },

  // 2. Переезд в Испанию самостоятельно
  {
    slug: "pereezd-v-ispaniyu-samostoyatelno-2026",
    title: "Переезд в Испанию самостоятельно: пошаговый гайд 2026",
    tag: "Переезд",
    published: true,
    cover_url: null,
    seo_title: "Переезд в Испанию самостоятельно 2026",
    seo_description:
      "Пошаговый гайд по самостоятельному переезду в Испанию: визы, документы, поиск жилья, NIE, ВНЖ и стоимость жизни в Мадриде, Барселоне и Валенсии.",
    content_md: md("pereezd-v-ispaniyu-samostoyatelno-2026"),
  },

  // 3. Жизнь в Черногории для россиян
  {
    slug: "zhizn-v-chernogorii-dlya-rossiyan-2026",
    title: "Жизнь в Черногории для россиян: цены, визы, плюсы и минусы 2026",
    tag: "Жизнь",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Черногории 2026: цены и плюсы",
    seo_description:
      "Реальные цены на аренду в Будве, Которе и Подгорице, ВНЖ через аренду и компанию, плюсы и минусы жизни в Черногории для россиян в 2026 году.",
    content_md: md("zhizn-v-chernogorii-dlya-rossiyan-2026"),
  },

  // 4. Перевоз животных за границу
  {
    slug: "perevoz-zhivotnyh-za-granicu-2026",
    title: "Как перевезти кошку или собаку за границу из России 2026",
    tag: "Переезд",
    published: true,
    cover_url: null,
    seo_title: "Перевоз кошки или собаки за границу 2026",
    seo_description:
      "Документы, прививки, авиаперевозка и требования разных стран для вывоза кошки или собаки из России. Пошаговая инструкция на 2026 год.",
    content_md: md("perevoz-zhivotnyh-za-granicu-2026"),
  },

  // 5. Налоги при релокации
  {
    slug: "nalogi-pri-relokazii-rossiyanin-2026",
    title: "Налоги при релокации: что нужно знать россиянину за рубежом 2026",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Налоги при релокации для россиян 2026",
    seo_description:
      "Налоговое резидентство, двойное налогообложение, уведомление ФНС о зарубежном счёте — всё что нужно знать россиянину при переезде за рубеж в 2026.",
    content_md: md("nalogi-pri-relokazii-rossiyanin-2026"),
  },

  // 6. Аренда жилья в Турции
  {
    slug: "arenda-zhilya-turtsiya-2026",
    title:
      "Аренда жилья в Турции для россиян: Анталья, Аланья, Стамбул 2026",
    tag: "Жизнь",
    published: true,
    cover_url: null,
    seo_title: "Аренда в Турции 2026: Анталья, Аланья, Стамбул",
    seo_description:
      "Цены на аренду квартир в Анталье, Аланье и Стамбуле в 2026 году. Как искать жильё, какие документы нужны и сколько стоит жить в Турции.",
    content_md: md("arenda-zhilya-turtsiya-2026"),
  },

  // 7. Стоимость жизни в Таиланде
  {
    slug: "stoimost-zhizni-v-tailande-2026",
    title: "Сколько стоит жить в Таиланде: реальный бюджет на месяц 2026",
    tag: "Жизнь",
    published: true,
    cover_url: null,
    seo_title: "Стоимость жизни в Таиланде 2026",
    seo_description:
      "Реальный бюджет на месяц жизни в Таиланде: Бангкок, Пхукет, Чиангмай. Аренда, еда, транспорт, медицина — конкретные цифры на 2026 год.",
    content_md: md("stoimost-zhizni-v-tailande-2026"),
  },

  // 8. Переезд в Армению: плюсы и минусы
  {
    slug: "pereezd-v-armeniyu-plyusy-minusy-2026",
    title: "Переезд в Армению: плюсы и минусы, цены 2026",
    tag: "Жизнь",
    published: true,
    cover_url: null,
    seo_title: "Переезд в Армению 2026: плюсы и минусы",
    seo_description:
      "Реальные цены на аренду в Ереване, ВНЖ, банки и налоги. Плюсы и минусы жизни в Армении для россиян в 2026 году — честный разбор.",
    content_md: md("pereezd-v-armeniyu-plyusy-minusy-2026"),
  },

  // 9. ВНЖ Сербии для россиян
  {
    slug: "vnzh-serbii-dlya-rossiyan-2026",
    title: "Как получить ВНЖ Сербии для россиян 2026",
    tag: "Визы",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ Сербии для россиян 2026",
    seo_description:
      "Все способы получить ВНЖ в Сербии: через компанию DOO, аренду жилья, фриланс. Документы, сроки, стоимость и подводные камни в 2026 году.",
    content_md: md("vnzh-serbii-dlya-rossiyan-2026"),
  },

  // 10. Дети за границей
  {
    slug: "deti-za-granicey-shkoly-sadiki-medicina-2026",
    title:
      "Дети за границей: школы, садики, медицина для семей с детьми 2026",
    tag: "Переезд",
    published: true,
    cover_url: null,
    seo_title: "Дети за границей: школы и медицина 2026",
    seo_description:
      "Как устроить детей в школу и садик за рубежом, где лучшая медицина для детей и сколько стоит образование в Грузии, Сербии, Таиланде, ОАЭ в 2026.",
    content_md: md("deti-za-granicey-shkoly-sadiki-medicina-2026"),
  },
];

for (const post of posts) {
  const { error } = await sb
    .from("blog_posts")
    .upsert(post, { onConflict: "slug" });
  if (error) console.error("Error:", post.slug, error.message);
  else console.log("OK:", post.slug);
}
console.log("Done: " + posts.length + " posts");
