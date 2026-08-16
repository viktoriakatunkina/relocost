// Батч 11: 10 SEO-статей Relocost — Канада, Швейцария, Чехия ВНЖ, Гоа,
// Аргентина (жизнь+переезд), Golden Visa ОАЭ, компания за рубежом, Индия, Торонто.
// Запуск: node scripts/seed-blog-batch-11.mjs

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HOME = os.homedir();

const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();

const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

function md(slug) {
  return fs.readFileSync(path.join(ROOT, "content/blog", `${slug}.md`), "utf8");
}

const posts = [
  {
    slug: "zhizn-v-kanade-dlya-rossiyan-2026",
    title: "Жизнь в Канаде для россиян 2026: стоимость, ВНЖ и реальные цифры",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Канаде для россиян 2026: цены и ВНЖ",
    seo_description: "Сколько стоит жизнь в Канаде в 2026 году: аренда в Торонто, Ванкувере, Монреале, зарплаты, налоги и пути получения ВНЖ. Реальные цифры для релокантов.",
    content_md: md("zhizn-v-kanade-dlya-rossiyan-2026"),
  },
  {
    slug: "vnzh-kanady-express-entry-2026",
    title: "ВНЖ Канады 2026: Express Entry, провинциальные программы и реальные сроки",
    tag: "ВНЖ",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ Канады Express Entry 2026: все программы",
    seo_description: "Как получить ВНЖ Канады через Express Entry, PNP и учебу: баллы CRS, проходные баллы 2026, сроки и расходы. Пошаговый разбор для россиян.",
    content_md: md("vnzh-kanady-express-entry-2026"),
  },
  {
    slug: "zhizn-v-shveycarii-dlya-rossiyan-2026",
    title: "Жизнь в Швейцарии для россиян 2026: стоимость, работа и реальные цифры",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Швейцарии для россиян 2026: цены",
    seo_description: "Стоимость жизни в Швейцарии 2026: аренда в Цюрихе и Женеве, зарплаты IT-специалистов, страховка Krankenkasse, ВНЖ через работу и учебу.",
    content_md: md("zhizn-v-shveycarii-dlya-rossiyan-2026"),
  },
  {
    slug: "vnzh-chehii-dlya-rossiyan-2026",
    title: "ВНЖ Чехии для россиян 2026: Живностенский лист, рабочая виза и все способы",
    tag: "ВНЖ",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ Чехии 2026: Живностенский лист и ПМЖ",
    seo_description: "Как получить ВНЖ Чехии в 2026 году: Живностенский лист для фрилансеров, Синяя карта ЕС, учебный ВНЖ. Документы, стоимость и реальные сроки.",
    content_md: md("vnzh-chehii-dlya-rossiyan-2026"),
  },
  {
    slug: "zhizn-na-goa-dlya-rossiyan-2026",
    title: "Жизнь на Гоа для россиян 2026: реальные расходы, жилье и виза",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь на Гоа 2026: сколько стоит и как там жить",
    seo_description: "Реальная стоимость жизни на Гоа в 2026 году: аренда виллы, бюджет на месяц, визовые варианты, лучшие районы и правда о мусонном сезоне.",
    content_md: md("zhizn-na-goa-dlya-rossiyan-2026"),
  },
  {
    slug: "zhizn-v-argentine-dlya-rossiyan-2026",
    title: "Жизнь в Аргентине для россиян 2026: стоимость, ВНЖ и реальный опыт",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Аргентине 2026: цены, ВНЖ и Буэнос-Айрес",
    seo_description: "Сколько стоит жизнь в Аргентине в 2026 году: аренда в Буэнос-Айресе, доллар blue, ВНЖ рантье и реальный опыт россиян. Все расходы в долларах.",
    content_md: md("zhizn-v-argentine-dlya-rossiyan-2026"),
  },
  {
    slug: "golden-visa-oae-dlya-rossiyan-2026",
    title: "Golden Visa ОАЭ для россиян 2026: условия, стоимость и как получить",
    tag: "ВНЖ",
    published: true,
    cover_url: null,
    seo_title: "Golden Visa ОАЭ 2026: условия и стоимость",
    seo_description: "Golden Visa ОАЭ для россиян 2026: 10-летний ВНЖ через недвижимость, инвестиции или высокую зарплату. Все категории, расходы и пошаговый процесс.",
    content_md: md("golden-visa-oae-dlya-rossiyan-2026"),
  },
  {
    slug: "kak-zaregistrirovat-kompaniyu-za-rubezhom-2026",
    title: "Как зарегистрировать компанию за рубежом 2026: ОАЭ, Грузия, Армения, Казахстан",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Компания за рубежом 2026: ОАЭ, Грузия, Армения",
    seo_description: "Как открыть иностранную компанию в 2026 году: Грузия (Виртуальная зона), ОАЭ Freezone, Армения, Казахстан, Эстония e-Residency. Цены и налоги.",
    content_md: md("kak-zaregistrirovat-kompaniyu-za-rubezhom-2026"),
  },
  {
    slug: "zhizn-v-indii-dlya-rossiyan-2026",
    title: "Жизнь в Индии для россиян 2026: стоимость жизни, города и реальный опыт",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Индии 2026: Бангалор, Мумбаи, Пуна",
    seo_description: "Стоимость жизни в Индии в 2026 году: Бангалор, Мумбаи, Пуна, Кочин. Аренда, питание, медицина, визы и реальный опыт россиян в IT-городах.",
    content_md: md("zhizn-v-indii-dlya-rossiyan-2026"),
  },
  {
    slug: "pereezd-v-toronto-2026",
    title: "Переезд в Торонто 2026: стоимость жизни, работа и первые шаги",
    tag: "Переезд",
    published: true,
    cover_url: null,
    seo_title: "Переезд в Торонто 2026: расходы и первые шаги",
    seo_description: "Как переехать в Торонто в 2026 году: стоимость аренды по районам, рынок труда IT, система TTC, медицина OHIP и пошаговый план первых месяцев.",
    content_md: md("pereezd-v-toronto-2026"),
  },
];

async function main() {
  console.log(`\nЗагрузка батча 11: ${posts.length} статей...\n`);

  for (const post of posts) {
    const { data, error } = await sb
      .from("blog_posts")
      .upsert(post, { onConflict: "slug" })
      .select("slug, title");

    if (error) {
      console.error(`ОШИБКА [${post.slug}]:`, error.message);
    } else {
      console.log(`OK  ${post.slug}`);
    }
  }

  console.log("\nГотово! Батч 11 загружен.");
}

main().catch(console.error);
