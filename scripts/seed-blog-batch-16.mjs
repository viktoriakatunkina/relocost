// Батч 16: 10 SEO-статей Relocost
// Темы: Пассивный доход за рубежом, Греция (Golden Visa 250K),
// Паттайя (районы детально), Колумбия (Медельин/Богота/Pensionado),
// Черногория (Котор и Тиват детально), ИИ-инструменты для эмигранта,
// Тбилиси (чеклист 30 дней), Бразилия (Сан-Паулу / VITEM-V),
// Эквадор (Куэнка), Сравнение аренды по странам
// Запуск: node scripts/seed-blog-batch-16.mjs

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
  // 1. Пассивный доход за рубежом 2026
  {
    slug: "passivnyy-dohod-za-rubezhom-2026",
    title:
      "Жизнь на пассивный доход за рубежом 2026: дивиденды, аренда, проценты",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Жизнь на пассивный доход за рубежом 2026",
    seo_description:
      "Дивиденды, арендный доход, проценты по вкладу — как жить на пассивный доход за рубежом и в какой стране это реальнее всего в 2026.",
    content_md: md("passivnyy-dohod-za-rubezhom-2026"),
  },

  // 2. Греция — Golden Visa 250K, стоимость жизни 2026
  {
    slug: "pereezd-v-greciyu-golden-visa-2026",
    title:
      "Переезд в Грецию 2026: Golden Visa 250K, стоимость жизни, ВНЖ",
    tag: "Визы",
    published: true,
    cover_url: null,
    seo_title: "Греция 2026: Golden Visa 250K и стоимость жизни",
    seo_description:
      "Golden Visa Греции от 250 000 EUR, стоимость жизни в Афинах и Салониках, аренда, медицина. Полный гайд для россиян 2026.",
    content_md: md("pereezd-v-greciyu-golden-visa-2026"),
  },

  // 3. Паттайя — районы, аренда, стоимость жизни 2026
  {
    slug: "zhizn-v-pattaye-dlya-rossiyan-rayony-2026",
    title: "Жизнь в Паттайе для россиян 2026: районы, аренда, бюджет",
    tag: "Азия",
    published: true,
    cover_url: null,
    seo_title: "Паттайя 2026: районы, аренда и стоимость жизни",
    seo_description:
      "Где жить в Паттайе: Джомтьен, На Клуа, центр. Аренда от 8 000 бат, бюджет от 35 000 бат/мес. Реальные цены и визовые схемы 2026.",
    content_md: md("zhizn-v-pattaye-dlya-rossiyan-rayony-2026"),
  },

  // 4. Колумбия — Медельин, Богота, ВНЖ Pensionado 2026
  {
    slug: "pereezd-v-kolumbiyu-medellin-bogota-2026",
    title: "Переезд в Колумбию 2026: Медельин, Богота, ВНЖ Pensionado",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Колумбия 2026: переезд в Медельин, ВНЖ Pensionado",
    seo_description:
      "ВНЖ Pensionado от $750/мес, стоимость жизни в Медельине от $1 000. Богота vs Медельин. Реальный гайд по переезду в Колумбию 2026.",
    content_md: md("pereezd-v-kolumbiyu-medellin-bogota-2026"),
  },

  // 5. Черногория — Котор и Тиват детально 2026
  {
    slug: "zhizn-v-chernogorii-kotor-tivat-2026",
    title:
      "Жизнь в Черногории: Котор и Тиват в 2026 — районы, аренда, ВНЖ",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Котор и Тиват 2026: жизнь, аренда, ВНЖ в Черногории",
    seo_description:
      "Котор vs Тиват: где жить в Черногории 2026. Аренда от 450 EUR, стоимость жизни, ВНЖ через аренду. Реальные цены и районы.",
    content_md: md("zhizn-v-chernogorii-kotor-tivat-2026"),
  },

  // 6. ИИ-инструменты для эмигранта 2026
  {
    slug: "ii-instrumenty-dlya-emigranta-2026",
    title:
      "ИИ-инструменты для эмигранта 2026: ChatGPT и другие при переезде",
    tag: "Лайфстайл",
    published: true,
    cover_url: null,
    seo_title: "ChatGPT и ИИ для эмигранта 2026: полный гайд",
    seo_description:
      "ChatGPT, Claude, Perplexity, DeepL — как использовать ИИ при переезде: перевод документов, поиск жилья, изучение языка, юридические вопросы.",
    content_md: md("ii-instrumenty-dlya-emigranta-2026"),
  },

  // 7. Тбилиси — практический чеклист первых 30 дней 2026
  {
    slug: "pereezd-v-gruziyu-tbilisi-cheklyst-30-dney",
    title: "Переезд в Грузию: чеклист первых 30 дней в Тбилиси 2026",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Тбилиси 2026: чеклист первых 30 дней после переезда",
    seo_description:
      "Что сделать в первые 30 дней в Тбилиси: регистрация, банк, мобильный, аренда, страховка. Практический чеклист для россиян 2026.",
    content_md: md("pereezd-v-gruziyu-tbilisi-cheklyst-30-dney"),
  },

  // 8. Бразилия — Сан-Паулу, ВНЖ VITEM-V 2026
  {
    slug: "zhizn-v-brazilii-dlya-rossiyan-sao-paulo-2026",
    title:
      "Жизнь в Бразилии для россиян 2026: Сан-Паулу, ВНЖ VITEM-V",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Бразилия 2026: жизнь в Сан-Паулу, ВНЖ VITEM-V",
    seo_description:
      "Стоимость жизни в Сан-Паулу и Флорианополисе, ВНЖ VITEM-V через работу или доход. Бюджет от $1 200, реальные цены 2026 для россиян.",
    content_md: md("zhizn-v-brazilii-dlya-rossiyan-sao-paulo-2026"),
  },

  // 9. Эквадор — Куэнка, бюджетная Латинская Америка 2026
  {
    slug: "pereezd-v-ekvador-kuenka-2026",
    title:
      "Переезд в Эквадор 2026: Куэнка — бюджетная Латинская Америка",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Эквадор 2026: жизнь в Куэнке, ВНЖ, стоимость жизни",
    seo_description:
      "Куэнка — самый доступный город для эмигрантов в Латинской Америке. Бюджет от $900, ВНЖ Pensionado от $800, реальные цены 2026.",
    content_md: md("pereezd-v-ekvador-kuenka-2026"),
  },

  // 10. Как выбрать страну по стоимости аренды — сравнительная 2026
  {
    slug: "kak-vybrat-stranu-po-stoimosti-arendy-2026",
    title:
      "Как выбрать страну для переезда по стоимости аренды 2026",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Аренда жилья за рубежом 2026: сравнение стран",
    seo_description:
      "Сравнение стоимости аренды в 20 странах мира: от $200 в Грузии до $2000 в Швейцарии. Как выбрать страну по бюджету 2026.",
    content_md: md("kak-vybrat-stranu-po-stoimosti-arendy-2026"),
  },
];

async function seed() {
  console.log(`Seeding ${posts.length} posts (batch 16)...`);

  for (const post of posts) {
    // Проверяем, нет ли уже такого slug
    const { data: existing } = await sb
      .from("blog_posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();

    if (existing) {
      console.log(`  SKIP (already exists): ${post.slug}`);
      continue;
    }

    const { error } = await sb.from("blog_posts").insert(post);

    if (error) {
      console.error(`  ERROR inserting ${post.slug}:`, error.message);
    } else {
      console.log(`  OK: ${post.slug}`);
    }
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
