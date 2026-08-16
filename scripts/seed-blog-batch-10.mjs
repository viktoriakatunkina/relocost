import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";

const SUPABASE_URL = fs.readFileSync(os.homedir() + "/.relocost/supabase_url", "utf8").trim();
const SUPABASE_KEY = fs.readFileSync(os.homedir() + "/.relocost/supabase_service_role_key", "utf8").trim();
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

const posts = [
  {
    slug: "zhizn-v-norvegii-dlya-rossiyan-2026",
    title: "Жизнь в Норвегии для россиян 2026: стоимость, ВНЖ и реальные цифры",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Норвегии для россиян 2026: цифры и ВНЖ",
    seo_description: "Сколько стоит жизнь в Норвегии в 2026 году: аренда в Осло, зарплаты, как получить ВНЖ россиянину. Реальные цифры и пошаговый разбор.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/zhizn-v-norvegii-dlya-rossiyan-2026.md", "utf8"),
  },
  {
    slug: "zhizn-v-shvetsii-dlya-rossiyan-2026",
    title: "Жизнь в Швеции для россиян 2026: стоимость, ВНЖ и реальный опыт",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Швеции для россиян 2026: цены и ВНЖ",
    seo_description: "Стоимость жизни в Швеции 2026: аренда в Стокгольме, зарплаты, как получить ВНЖ. Практическое руководство для россиян по переезду в Швецию.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/zhizn-v-shvetsii-dlya-rossiyan-2026.md", "utf8"),
  },
  {
    slug: "vnzh-niderlandov-dlya-rossiyan-2026",
    title: "ВНЖ Нидерландов для россиян 2026: все способы и реальные сроки",
    tag: "ВНЖ",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ Нидерландов 2026: Kennismigrant и все способы",
    seo_description: "Как получить ВНЖ в Нидерландах россиянину в 2026 году: Kennismigrant, стартап-виза, учёба. Стоимость жизни в Амстердаме, сроки и реальный процесс.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/vnzh-niderlandov-dlya-rossiyan-2026.md", "utf8"),
  },
  {
    slug: "vnzh-malajzii-mm2h-2026",
    title: "ВНЖ Малайзии MM2H 2026: условия, стоимость и реальный опыт",
    tag: "ВНЖ",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ Малайзии MM2H 2026: условия и альтернативы",
    seo_description: "Программа MM2H Малайзии 2026: новые условия, DE Rantau для цифровых кочевников, стоимость жизни в Куала-Лумпуре. Все варианты ВНЖ для россиян.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/vnzh-malajzii-mm2h-2026.md", "utf8"),
  },
  {
    slug: "vnzh-korei-dlya-rossiyan-2026",
    title: "ВНЖ Кореи для россиян 2026: все способы переехать в Южную Корею",
    tag: "ВНЖ",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ Южной Кореи для россиян 2026: все способы",
    seo_description: "Как получить ВНЖ в Южной Корее: рабочая виза E-7, система баллов F-2, Digital Nomad. Стоимость жизни в Сеуле, зарплаты, практические советы.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/vnzh-korei-dlya-rossiyan-2026.md", "utf8"),
  },
  {
    slug: "kak-najti-arend-zhile-za-rubezhom-2026",
    title: "Как найти аренду жилья за рубежом 2026: пошаговое руководство",
    tag: "Переезд",
    published: true,
    cover_url: null,
    seo_title: "Как найти аренду жилья за рубежом 2026",
    seo_description: "Пошаговое руководство по аренде жилья за рубежом: где искать в разных странах, как не попасть на мошенников, что проверять перед подписанием договора.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/kak-najti-arend-zhile-za-rubezhom-2026.md", "utf8"),
  },
  {
    slug: "detskiy-sad-za-rubezhom-dlya-rossiyan-2026",
    title: "Детский сад за рубежом для россиян 2026: как устроить ребёнка и сколько стоит",
    tag: "Переезд",
    published: true,
    cover_url: null,
    seo_title: "Детский сад за рубежом 2026: цены и как устроить",
    seo_description: "Как устроить ребёнка в детский сад за рубежом: Грузия, Армения, Турция, ОАЭ, Европа. Стоимость, языковая адаптация и практические советы для родителей.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/detskiy-sad-za-rubezhom-dlya-rossiyan-2026.md", "utf8"),
  },
  {
    slug: "nalogovoe-rezidentstvo-pri-pereezde-2026",
    title: "Налоговое резидентство при переезде 2026: как не платить налоги дважды",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Налоговое резидентство при переезде 2026",
    seo_description: "Как меняется налоговое резидентство при переезде за рубеж: правило 183 дней, двойное налогообложение, СИДН, Грузия и ОАЭ. Практический разбор для россиян.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/nalogovoe-rezidentstvo-pri-pereezde-2026.md", "utf8"),
  },
  {
    slug: "zhizn-v-yaponii-dlya-rossiyan-2026",
    title: "Жизнь в Японии для россиян 2026: стоимость, ВНЖ и реальные цифры",
    tag: "Стоимость жизни",
    published: true,
    cover_url: null,
    seo_title: "Жизнь в Японии для россиян 2026: цены и ВНЖ",
    seo_description: "Стоимость жизни в Японии 2026: аренда в Токио, зарплаты, визы J-Skip и Digital Nomad. Как переехать в Японию россиянину — пошаговый разбор.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/zhizn-v-yaponii-dlya-rossiyan-2026.md", "utf8"),
  },
  {
    slug: "pereezd-v-avstriyu-iz-rossii-2026",
    title: "Переезд в Австрию из России 2026: ВНЖ, стоимость жизни и реальный опыт",
    tag: "ВНЖ",
    published: true,
    cover_url: null,
    seo_title: "Переезд в Австрию 2026: ВНЖ и стоимость жизни",
    seo_description: "Как переехать в Австрию из России в 2026 году: Rot-Weiß-Rot Karte, стоимость жизни в Вене, зарплаты, немецкий язык. Пошаговое руководство.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/pereezd-v-avstriyu-iz-rossii-2026.md", "utf8"),
  },
  {
    slug: "investitsii-za-rubezhom-s-nulia-2026",
    title: "Инвестиции за рубежом с нуля 2026: как россиянину вложить деньги из-за границы",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Инвестиции за рубежом 2026: как россиянину начать",
    seo_description: "Как инвестировать за рубежом в 2026 году: Interactive Brokers, ETF, недвижимость, криптовалюта. Практическое руководство для россиян после переезда.",
    content_md: fs.readFileSync("/Users/viktoriadimark/Desktop/Работа/Клод/relocost/content/blog/investitsii-za-rubezhom-s-nulia-2026.md", "utf8"),
  },
];

for (const post of posts) {
  const { error } = await sb.from("blog_posts").upsert(post, { onConflict: "slug" });
  if (error) console.error("Error:", post.slug, error.message);
  else console.log("OK:", post.slug);
}

console.log("\nBatch 10 done. Total posts attempted:", posts.length);
