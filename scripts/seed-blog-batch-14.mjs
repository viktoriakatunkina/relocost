// Батч 14: 10 SEO-статей Relocost
// Темы: Будапешт (стоимость жизни), Испания (Digital Nomad Visa),
// Франция (переезд из России), Великобритания (для россиян),
// ВНЖ через учёбу, Болгария (переезд + недвижимость),
// Тбилиси (районы + аренда + школы), Монако/Люксембург/Лихтенштейн,
// Таиланд (LTR + Thailand Elite), Банковская карта иностранца
// Запуск: node scripts/seed-blog-batch-14.mjs

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
  // 1. Будапешт — стоимость жизни 2026
  {
    slug: "budapesht-stoimost-zhizni-2026",
    title: "Стоимость жизни в Будапеште 2026: реальный бюджет для россиян",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Стоимость жизни в Будапеште 2026: цены и бюджет",
    seo_description:
      "Аренда 375–500 €, продукты 100–150 € / мес, проездной 27 €. Реальный бюджет от 730 € до 1 140 € в месяц для жизни в Будапеште в 2026 году.",
    content_md: md("budapesht-stoimost-zhizni-2026"),
  },

  // 2. Испания — виза Digital Nomad 2026
  {
    slug: "ispaniya-digital-nomad-visa-2026",
    title: "Виза Digital Nomad в Испании 2026: полный гайд для россиян",
    tag: "Визы",
    published: true,
    cover_url: null,
    seo_title: "Виза Digital Nomad Испания 2026: гайд для россиян",
    seo_description:
      "Как получить испанскую визу Digital Nomad в 2026: требования, документы, где подавать из России. Режим Бекхэма, сравнение с Non-Lucrative Visa.",
    content_md: md("ispaniya-digital-nomad-visa-2026"),
  },

  // 3. Франция — переезд из России 2026
  {
    slug: "pereezd-vo-frantsiyu-iz-rossii-2026",
    title: "Переезд во Францию из России 2026: Париж, визы, стоимость",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Переезд во Францию 2026: визы и стоимость жизни",
    seo_description:
      "Виза Visiteur, Passeport Talent, стоимость жизни в Париже от 1 620 € / мес. Где подавать документы россиянам и сколько нужно денег для ВНЖ.",
    content_md: md("pereezd-vo-frantsiyu-iz-rossii-2026"),
  },

  // 4. Великобритания — для россиян 2026
  {
    slug: "zhizn-v-velikobritanii-dlya-rossiyan-2026",
    title: "Жизнь в Великобритании для россиян 2026: реально ли переехать",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Великобритания для россиян 2026: переезд и жизнь",
    seo_description:
      "Skilled Worker Visa, Global Talent, Student Visa. Стоимость жизни в Лондоне от 2 060 £ / мес. Что реально доступно россиянам в 2026 году.",
    content_md: md("zhizn-v-velikobritanii-dlya-rossiyan-2026"),
  },

  // 5. ВНЖ через учёбу за рубежом 2026
  {
    slug: "vnzh-cherez-uchebu-za-rubezhom-2026",
    title: "ВНЖ через учёбу за рубежом 2026: студенческая виза, топ стран",
    tag: "Визы",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ через учёбу 2026: студенческая виза, топ стран",
    seo_description:
      "Германия (бесплатное обучение), Чехия, Польша, Болгария, Канада, Австралия. Как получить ВНЖ через студенческую визу и остаться после учёбы.",
    content_md: md("vnzh-cherez-uchebu-za-rubezhom-2026"),
  },

  // 6. Болгария — переезд 2026, доступный ЕС
  {
    slug: "bolgariya-pereezd-2026-dostupnyy-es",
    title: "Болгария 2026: переезд, недвижимость, стоимость жизни",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Болгария 2026: переезд, жильё и стоимость жизни в ЕС",
    seo_description:
      "Самый доступный ЕС: аренда от 350 €, квартиры от 65 000 €, жизнь от 750 € / мес. Варна, София, Пловдив — сравнение и реальные цены 2026.",
    content_md: md("bolgariya-pereezd-2026-dostupnyy-es"),
  },

  // 7. Тбилиси — районы, аренда, школы 2026
  {
    slug: "tbilisi-rayony-arenda-zhizn-2026",
    title: "Тбилиси 2026: районы, аренда, школы — подробный гид",
    tag: "Города",
    published: true,
    cover_url: null,
    seo_title: "Тбилиси 2026: районы, аренда и школы для переезда",
    seo_description:
      "Вера, Ваке, Сабуртало, Старый город: аренда 280–1 300 $. Русские школы, частные сады, медицина. Реальный бюджет для жизни в Тбилиси в 2026 году.",
    content_md: md("tbilisi-rayony-arenda-zhizn-2026"),
  },

  // 8. Монако, Люксембург, Лихтенштейн — для состоятельных
  {
    slug: "monako-lyuksemburg-lihtenshteyn-zhizn-2026",
    title: "Монако, Люксембург, Лихтенштейн: жизнь для состоятельных 2026",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Монако, Люксембург, Лихтенштейн: ВНЖ и жизнь 2026",
    seo_description:
      "ВНЖ в Монако от 500 000 € в банке, 0% НДФЛ. Люксембург — инвестиции от 500 000 €. Лихтенштейн — 8% налог, квота 30 мест в год. Полный разбор.",
    content_md: md("monako-lyuksemburg-lihtenshteyn-zhizn-2026"),
  },

  // 9. Таиланд — LTR Visa и Thailand Elite 2026
  {
    slug: "tailand-ltr-visa-elite-pmzh-2026",
    title: "Таиланд на ПМЖ 2026: LTR Visa и Thailand Elite — разбор",
    tag: "Визы",
    published: true,
    cover_url: null,
    seo_title: "Таиланд ПМЖ 2026: LTR Visa и Thailand Elite",
    seo_description:
      "LTR Visa на 10 лет от 1 700 $ взноса (доход от 80 000 $ / год). Thailand Elite от 25 700 $ без требований к доходу. Что выбрать — полный разбор.",
    content_md: md("tailand-ltr-visa-elite-pmzh-2026"),
  },

  // 10. Банковская карта иностранца при переезде 2026
  {
    slug: "bankovskaya-karta-inostranca-kak-otkryt-2026",
    title: "Банковская карта иностранца при переезде: как открыть в 2026",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Карта иностранца при переезде: как открыть в 2026",
    seo_description:
      "Грузия, Армения, Казахстан, Сербия, ОАЭ — где проще открыть карту при переезде. Что нужно, сколько стоит, почему Турция больше не работает в 2026.",
    content_md: md("bankovskaya-karta-inostranca-kak-otkryt-2026"),
  },
];

async function main() {
  console.log(`Inserting ${posts.length} posts (batch 14)...`);

  for (const post of posts) {
    const { data, error } = await sb
      .from("blog_posts")
      .upsert(post, { onConflict: "slug" })
      .select("id, slug");

    if (error) {
      console.error(`ERROR: ${post.slug}`, error.message);
    } else {
      console.log(`OK: ${post.slug} → id=${data?.[0]?.id}`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
