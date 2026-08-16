// Батч 15: 10 SEO-статей Relocost
// Темы: Сингапур (EP/PR), Кипр (ВНЖ/Лимасол vs Никосия),
// Мальта (Nomad Permit), Хорватия (Загреб/Сплит),
// Румыния (бюджетный ЕС), Удалённая работа за рубежом,
// Коста-Рика (рантье/переезд), Вьетнам (Дананг/ХКМГ),
// Словакия vs Словения, Абу-Даби vs Дубай
// Запуск: node scripts/seed-blog-batch-15.mjs

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
  // 1. Сингапур — EP/PR виза, стоимость жизни 2026
  {
    slug: "singapur-dlya-rossiyan-ep-pr-2026",
    title: "Сингапур для россиян 2026: EP и PR виза, стоимость жизни",
    tag: "Визы",
    published: true,
    cover_url: null,
    seo_title: "Сингапур для россиян 2026: EP виза и стоимость жизни",
    seo_description:
      "Employment Pass от 5 600 SGD / мес, COMPASS-баллы, PR — реально ли. Бюджет от 3 000 SGD / мес. Полный гайд по переезду в Сингапур для россиян в 2026.",
    content_md: md("singapur-dlya-rossiyan-ep-pr-2026"),
  },

  // 2. Кипр — ВНЖ, Лимасол vs Никосия 2026
  {
    slug: "kipr-vnzh-limassol-nikosia-2026",
    title: "Кипр 2026: ВНЖ, Лимасол vs Никосия, стоимость жизни",
    tag: "Визы",
    published: true,
    cover_url: null,
    seo_title: "Кипр 2026: ВНЖ Cat. F, Лимасол или Никосия",
    seo_description:
      "ВНЖ через пассивный доход от 2 000 EUR / мес, депозит 30 000 EUR. Аренда в Лимасоле от 750 EUR, в Никосии от 550 EUR. Гайд для россиян 2026.",
    content_md: md("kipr-vnzh-limassol-nikosia-2026"),
  },

  // 3. Мальта — Nomad Residence Permit, стоимость жизни 2026
  {
    slug: "vnzh-malty-nomad-residence-stoimost-2026",
    title: "ВНЖ Мальты 2026: Nomad Residence Permit и стоимость жизни",
    tag: "Визы",
    published: true,
    cover_url: null,
    seo_title: "ВНЖ Мальты 2026: Nomad Permit и цены на жизнь",
    seo_description:
      "Nomad Residence Permit: доход от 2 700 EUR / мес, пошлина 300 EUR, Шенген. Аренда в Слиме от 1 200 EUR. Полный гайд для удалённых работников.",
    content_md: md("vnzh-malty-nomad-residence-stoimost-2026"),
  },

  // 4. Хорватия — жизнь для россиян 2026
  {
    slug: "zhizn-v-horvatii-dlya-rossiyan-2026",
    title: "Жизнь в Хорватии для россиян 2026: Загреб, Сплит, ВНЖ",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Хорватия для россиян 2026: Загреб, Сплит и ВНЖ",
    seo_description:
      "Хорватия в Шенгене с 2023 года. Аренда в Загребе от 500 EUR, в Сплите от 650 EUR. Пути к ВНЖ через работу, учёбу и компанию. Реальные цены 2026.",
    content_md: md("zhizn-v-horvatii-dlya-rossiyan-2026"),
  },

  // 5. Румыния — бюджетный ЕС 2026
  {
    slug: "pereezd-v-rumuniyu-2026-byudzhetnyy-es",
    title: "Переезд в Румынию 2026: самый бюджетный вариант ЕС",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Румыния 2026: переезд, ВНЖ и стоимость жизни в ЕС",
    seo_description:
      "Аренда от 350 EUR, НДФЛ 10%, налог SRL 1% с оборота. Бухарест, Клуж, Тимишоара — реальные цены 2026. Самый доступный переезд в Евросоюз.",
    content_md: md("pereezd-v-rumuniyu-2026-byudzhetnyy-es"),
  },

  // 6. Удалённая работа за рубежом 2026
  {
    slug: "kak-nayti-rabotu-za-rubezhom-udalenno-2026",
    title: "Как найти удалённую работу за рубежом в 2026 году: гайд",
    tag: "Финансы",
    published: true,
    cover_url: null,
    seo_title: "Удалённая работа за рубежом 2026: LinkedIn, WWR, Remote.co",
    seo_description:
      "LinkedIn, We Work Remotely, Remote.co, Toptal — где искать, как писать резюме и Cover Letter, как получать зарплату без российского счёта в 2026.",
    content_md: md("kak-nayti-rabotu-za-rubezhom-udalenno-2026"),
  },

  // 7. Коста-Рика — рантье, переезд из России 2026
  {
    slug: "pereezd-v-kosta-riku-iz-rossii-2026",
    title: "Переезд в Коста-Рику 2026: рантье, цены, безопасность",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Коста-Рика 2026: переезд из России, ВНЖ рантье",
    seo_description:
      "ВНЖ Rentista от $2 500 / мес дохода, Digital Nomad от $3 000 / мес. Бюджет от $1 200 / мес. Сан-Хосе, Хако, Тамариндо — реальные цены 2026.",
    content_md: md("pereezd-v-kosta-riku-iz-rossii-2026"),
  },

  // 8. Вьетнам — Дананг, Хошимин 2026
  {
    slug: "zhizn-vo-vietname-danang-hcmc-2026",
    title: "Жизнь во Вьетнаме для россиян 2026: Дананг и Хошимин",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Вьетнам 2026: жизнь в Дананге и Хошимине для россиян",
    seo_description:
      "Аренда в Дананге от $300, в Хошимине от $450. Бюджет от $700 / мес. E-Visa на 90 дней, визаран, работа удалённо. Реальные цены и районы 2026.",
    content_md: md("zhizn-vo-vietname-danang-hcmc-2026"),
  },

  // 9. Словакия vs Словения 2026
  {
    slug: "slovakiya-vs-sloveniya-dlya-rossiyan-2026",
    title: "Словакия vs Словения для россиян 2026: сравнение и цены",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Словакия vs Словения 2026: где лучше жить россиянину",
    seo_description:
      "Братислава от 1 300 EUR / мес, Любляна от 1 500 EUR / мес. Сравнение ВНЖ, налогов, климата и качества жизни. Что выбрать для переезда в ЕС в 2026.",
    content_md: md("slovakiya-vs-sloveniya-dlya-rossiyan-2026"),
  },

  // 10. Абу-Даби vs Дубай 2026
  {
    slug: "abu-dhabi-vs-dubai-gde-luchshe-zhit-2026",
    title: "Абу-Даби vs Дубай 2026: где лучше жить россиянину",
    tag: "Гайд",
    published: true,
    cover_url: null,
    seo_title: "Абу-Даби или Дубай 2026: где жить россиянину в ОАЭ",
    seo_description:
      "Аренда в Дубае от 5 000 AED, в Абу-Даби от 4 500 AED. Golden Visa, freezone, налоги 0%. Детальное сравнение для тех, кто выбирает между двумя эмиратами.",
    content_md: md("abu-dhabi-vs-dubai-gde-luchshe-zhit-2026"),
  },
];

async function main() {
  console.log(`Seeding ${posts.length} posts (batch 15)…`);

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
