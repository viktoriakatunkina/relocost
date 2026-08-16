// Батч 12: 10 SEO-статей Relocost
// Темы: Аргентина (переезд), Польша (жизнь+Карта Поляка), Дубай (жизнь+работа),
// Питомец за рубеж, Перевоз вещей, Мексика (Мехико+Гвадалахара),
// FIRE для эмигрантов, Малайзия (КЛ+Пенанг), Медстраховка, Австралия (Сидней+Мельбурн)
// Запуск: node scripts/seed-blog-batch-12.mjs

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
  // 1. Аргентина — переезд (готовый .md без frontmatter)
  {
    slug: "pereezd-v-argentinu-iz-rossii-2026",
    title: "Переезд в Аргентину из России 2026: пошаговое руководство",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Переезд в Аргентину из России 2026: гайд",
    seo_description:
      "Пошаговое руководство по переезду в Аргентину: документы, ВНЖ, жилье, банк, страховка. Реальные цифры для россиян в 2026 году.",
    content_md: md("pereezd-v-argentinu-iz-rossii-2026"),
  },

  // 2. Польша — Карта Поляка, ВНЖ, жизнь
  {
    slug: "polsha-dlya-rossiyan-karta-polyaka-2026",
    title: "Польша для россиян: жизнь, Карта Поляка, ВНЖ и цены 2026",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Польша для россиян: Карта Поляка и ВНЖ 2026",
    seo_description:
      "Карта Поляка, ВНЖ через работу и учебу, стоимость жизни в Варшаве и Кракове. Реальные цифры для россиян, планирующих переезд в Польшу в 2026.",
    content_md: md("polsha-dlya-rossiyan-karta-polyaka-2026"),
  },

  // 3. Дубай — жизнь, районы, работа
  {
    slug: "zhizn-v-dubae-dlya-rossiyan-2026",
    title: "Жизнь в Дубае для россиян 2026: цены, районы, как найти работу",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Дубае для россиян 2026: цены и работа",
    seo_description:
      "Стоимость жизни в Дубае 2026: районы, аренда, еда, транспорт, как найти работу и оформить визу. Реальный бюджет для россиян.",
    content_md: md("zhizn-v-dubae-dlya-rossiyan-2026"),
  },

  // 4. Переезд с питомцем
  {
    slug: "pereezd-s-pitomtsem-za-rubezh-2026",
    title: "Переезд с питомцем за рубеж 2026: ветпаспорт, чип, авиа, карантин",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Переезд с питомцем за рубеж 2026: гайд",
    seo_description:
      "Как перевезти кошку или собаку за рубеж: ветпаспорт, чип ISO, прививка от бешенства, авиаперевозка, карантин по странам. Чек-лист 2026.",
    content_md: md("pereezd-s-pitomtsem-za-rubezh-2026"),
  },

  // 5. Перевоз вещей (уже есть .md с frontmatter — читаем как есть,
  //    content_md будет содержать frontmatter-блок, это допустимо или читаем после --CONTENT--)
  //    У этого файла есть YAML frontmatter — берём весь файл, рендер Relocost обрабатывает
  {
    slug: "kak-perevezti-veshi-za-granicu",
    title:
      "Как перевезти вещи при переезде за рубеж: варианты и цены 2026",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Перевезти вещи за рубеж 2026: способы и цены",
    seo_description:
      "Авиабагаж, транспортные компании, морской контейнер — сравниваем способы перевезти вещи за границу. Цены 2026, что нельзя перевозить, как сэкономить.",
    content_md: md("kak-perevezti-veshi-za-granicu"),
  },

  // 6. Мексика — Мехико + Гвадалахара
  {
    slug: "zhizn-v-meksike-mehiko-gvadalahara-2026",
    title:
      "Жизнь в Мексике для россиян 2026: Мехико, Гвадалахара и бюджет",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Мексике 2026: Мехико и Гвадалахара",
    seo_description:
      "Стоимость жизни в Мексике 2026: районы Мехико и Гвадалахары, аренда, еда, ВНЖ, безопасность и реальный бюджет для россиян.",
    content_md: md("zhizn-v-meksike-mehiko-gvadalahara-2026"),
  },

  // 7. FIRE для эмигрантов
  {
    slug: "fire-finansovaya-nezavisimost-emigrant-2026",
    title:
      "Финансовая независимость за рубежом: FIRE для русских эмигрантов 2026",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "FIRE для русских эмигрантов 2026: как достичь",
    seo_description:
      "Как достичь финансовой независимости за рубежом: стратегии FIRE для эмигрантов из России, инвестиции через IBKR, налоги, страны с нулевым НДФЛ.",
    content_md: md("fire-finansovaya-nezavisimost-emigrant-2026"),
  },

  // 8. Малайзия — КЛ + Пенанг
  {
    slug: "zhizn-v-malajzii-dlya-rossiyan-2026",
    title:
      "Жизнь в Малайзии для россиян 2026: Куала-Лумпур, Пенанг, стоимость",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Малайзии для россиян 2026: КЛ и Пенанг",
    seo_description:
      "Стоимость жизни в Малайзии 2026: районы Куала-Лумпура и Пенанга, аренда, еда, интернет, работа. Реальный бюджет для россиян.",
    content_md: md("zhizn-v-malajzii-dlya-rossiyan-2026"),
  },

  // 9. Медстраховка за рубежом
  {
    slug: "medstraxovka-za-rubezhom-kak-vybrat-2026",
    title:
      "Медстраховка за рубежом: как выбрать и не остаться без помощи 2026",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Медстраховка за рубежом 2026: как выбрать",
    seo_description:
      "Как выбрать медицинскую страховку при переезде за рубеж: туристическая vs IPMI, что проверить, сколько стоит, как сэкономить. Сравнение 2026.",
    content_md: md("medstraxovka-za-rubezhom-kak-vybrat-2026"),
  },

  // 10. Австралия — Сидней + Мельбурн
  {
    slug: "zhizn-v-avstralii-dlya-rossiyan-2026",
    title:
      "Жизнь в Австралии для россиян 2026: Сидней, Мельбурн, ВНЖ и цены",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Австралии для россиян 2026: цены и ВНЖ",
    seo_description:
      "Стоимость жизни в Австралии 2026: Сидней vs Мельбурн, аренда, зарплаты, система иммиграции по баллам. Реальный бюджет для россиян.",
    content_md: md("zhizn-v-avstralii-dlya-rossiyan-2026"),
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Загружаю ${posts.length} статей в Supabase...`);

  const results = [];

  for (const post of posts) {
    // Пауза между запросами для избежания таймаута Supabase
    await sleep(2000);

    let attempts = 0;
    let success = false;
    let lastError = null;

    while (attempts < 3 && !success) {
      attempts++;
      const { data, error } = await sb
        .from("blog_posts")
        .upsert(post, { onConflict: "slug" })
        .select("slug");

      if (error) {
        lastError = error.message;
        console.warn(`  Попытка ${attempts}/3 [${post.slug}]: ${error.message}`);
        if (attempts < 3) await sleep(5000);
      } else {
        success = true;
        console.log(`OK: ${post.slug}`);
        results.push({ slug: post.slug, status: "OK" });
      }
    }

    if (!success) {
      console.error(`ОШИБКА [${post.slug}]:`, lastError);
      results.push({ slug: post.slug, status: "ERROR", error: lastError });
    }
  }

  console.log("\n=== ИТОГ ===");
  const ok = results.filter((r) => r.status === "OK");
  const err = results.filter((r) => r.status === "ERROR");
  console.log(`Успешно: ${ok.length}/${posts.length}`);
  if (err.length > 0) {
    console.log("Ошибки:");
    err.forEach((r) => console.log(`  - ${r.slug}: ${r.error}`));
  }

  const slugs = ok.map((r) => r.slug);
  console.log("\nЗагруженные slug'и:");
  slugs.forEach((s) => console.log(`  • ${s}`));
}

main().catch(console.error);
