// Батч 13: 10 SEO-статей Relocost
// Темы: Израиль (алия+ВНЖ), Германия (Blue Card), Новая Зеландия,
// Крипта при переезде, Нидерланды (Амстердам), Чехия vs Польша,
// Израиль (практический гайд), Португалия (Лиссабон+D7), ВНЖ Германии без работы, Пенсия за рубежом
// Запуск: node scripts/seed-blog-batch-13.mjs

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
  // 1. Израиль — алия, ВНЖ, стоимость жизни
  {
    slug: "izrail-dlya-rossiyan-aliya-vnzh-2026",
    title: "Израиль для россиян: алия, ВНЖ, стоимость жизни 2026",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Израиль для россиян: алия, ВНЖ и цены 2026",
    seo_description:
      "Алия по Закону о возвращении, ВНЖ без корней, стоимость жизни в Тель-Авиве и Хайфе. Реальные цифры и льготы для олим хадаш в 2026.",
    content_md: md("izrail-dlya-rossiyan-aliya-vnzh-2026"),
  },

  // 2. Германия — Blue Card, стоимость жизни, немецкий
  {
    slug: "pereezd-v-germaniyu-sinyaya-karta-2026",
    title: "Переезд в Германию 2026: синяя карта ЕС, стоимость жизни, немецкий",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Переезд в Германию 2026: Blue Card и цены",
    seo_description:
      "EU Blue Card для россиян в 2026: требования по зарплате, процесс получения, стоимость жизни в Берлине и Мюнхене. Зарплаты и 30% ruling.",
    content_md: md("pereezd-v-germaniyu-sinyaya-karta-2026"),
  },

  // 3. Новая Зеландия
  {
    slug: "zhizn-v-novoy-zelandii-dlya-rossiyan-2026",
    title: "Жизнь в Новой Зеландии для россиян 2026",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Новой Зеландии 2026: визы и цены",
    seo_description:
      "Как переехать в Новую Зеландию: AEWV, Green List, стоимость жизни в Окленде и Веллингтоне. Зарплаты, медицина и реальный бюджет для россиян.",
    content_md: md("zhizn-v-novoy-zelandii-dlya-rossiyan-2026"),
  },

  // 4. Криптовалюта при переезде
  {
    slug: "kriptovalyuta-pri-pereezde-nalogi-khranenie-2026",
    title: "Криптовалюта при переезде 2026: налоги, хранение, вывод",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Крипта при переезде 2026: налоги и хранение",
    seo_description:
      "Налоги на криптовалюту в Германии, ОАЭ, Португалии и других странах. Как хранить крипту при переезде, вывести в фиат и не нарушить закон.",
    content_md: md("kriptovalyuta-pri-pereezde-nalogi-khranenie-2026"),
  },

  // 5. Нидерланды — Амстердам
  {
    slug: "pereezd-v-niderlandy-amsterdam-2026",
    title: "Переезд в Нидерланды 2026: Амстердам, стоимость жизни, визы",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Переезд в Нидерланды 2026: Амстердам и ВНЖ",
    seo_description:
      "Highly Skilled Migrant виза, 30% ruling, стоимость жизни в Амстердаме и Роттердаме. Жилищный кризис, зарплаты и реальный бюджет для россиян 2026.",
    content_md: md("pereezd-v-niderlandy-amsterdam-2026"),
  },

  // 6. Чехия vs Польша
  {
    slug: "chehiya-vs-polsha-gde-luchshe-emigrantu-2026",
    title: "Чехия vs Польша: где лучше жить эмигранту 2026",
    tag: "Сравнение",
    published: true,
    cover_url: null,
    seo_title: "Чехия или Польша: где лучше жить в 2026",
    seo_description:
      "Сравниваем Чехию и Польшу по 10 параметрам: цены в Праге и Варшаве, зарплаты, ВНЖ, рынок труда, язык, медицина. Для кого какая страна лучше.",
    content_md: md("chehiya-vs-polsha-gde-luchshe-emigrantu-2026"),
  },

  // 7. Израиль — практический гайд шаг за шагом
  {
    slug: "pereezd-v-izrail-prakticheskiy-gayd-2026",
    title: "Переезд в Израиль: практический гайд шаг за шагом 2026",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Переезд в Израиль 2026: гайд шаг за шагом",
    seo_description:
      "Пошаговый гайд по переезду в Израиль через алию: документы, Сохнут, консульство, первые дни, корзина абсорбции, ульпан. Чек-лист переезда 2026.",
    content_md: md("pereezd-v-izrail-prakticheskiy-gayd-2026"),
  },

  // 8. Португалия — детально: Лиссабон, Порту, ВНЖ D7/NHR
  {
    slug: "zhizn-v-portugalii-dlya-rossiyan-lissabon-2026",
    title:
      "Жизнь в Португалии для россиян 2026: Лиссабон, Порту, ВНЖ D7 и NHR",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Португалии 2026: Лиссабон, D7 и NHR",
    seo_description:
      "ВНЖ D7 для пассивного дохода, налоговый режим IFICI (замена NHR), стоимость жизни в Лиссабоне и Порту. Реальный бюджет и практика переезда 2026.",
    content_md: md("zhizn-v-portugalii-dlya-rossiyan-lissabon-2026"),
  },

  // 9. ВНЖ Германии без работы — фриланс, рантье
  {
    slug: "vnzh-germanii-bez-raboty-d-viza-frilans-2026",
    title:
      "Как получить ВНЖ Германии без работы 2026: D-виза, фриланс, рантье",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ Германии без работы 2026: фриланс и рантье",
    seo_description:
      "Пути ВНЖ в Германии без рабочего оффера: виза фрилансера, студенческая, пассивный доход, воссоединение семьи. Требования и налоги для самозанятых 2026.",
    content_md: md("vnzh-germanii-bez-raboty-d-viza-frilans-2026"),
  },

  // 10. Российская пенсия за рубежом
  {
    slug: "pensiya-za-rubezhom-rossiyskaya-pensiya-2026",
    title:
      "Пенсия за рубежом 2026: как получать российскую пенсию живя в другой стране",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Российская пенсия за рубежом 2026: как получить",
    seo_description:
      "Как получать российскую пенсию за рубежом: уведомление СФР, подтверждение жизни, схемы перевода денег, налоги в новой стране. Реальный гайд 2026.",
    content_md: md("pensiya-za-rubezhom-rossiyskaya-pensiya-2026"),
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
