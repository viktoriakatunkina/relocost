// Батч july-batch2: 10 SEO-статей — Казахстан, Бали, удалёнка, Таиланд, семья, ВНЖ Турции, Белград, Дубай, выбор страны, Грузия.
// Запуск: node scripts/seed-10-articles-july-batch2.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();
const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${HOME}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");

const SLUGS = [
  "pereezd-v-kazahstan-2026",
  "stoimost-zhizni-v-bali-2026",
  "rabota-udalenno-za-rubezhom-2026",
  "pereezd-v-tailand-2026",
  "kak-pereekhat-s-semey-za-rubezh-2026",
  "vnzh-turtsii-2026",
  "beograd-dlya-zhizni-2026",
  "stoimost-zhizni-v-dubae-2026",
  "kak-vybrat-stranu-dlya-pereezda-2026",
  "zhizn-v-gruzii-dlya-rossiyan-2026",
];

const META = {
  "pereezd-v-kazahstan-2026": {
    unsplash_query: "almaty kazakhstan mountains city",
    country_slug: "kazakhstan",
    city_slug: "almaty",
  },
  "stoimost-zhizni-v-bali-2026": {
    unsplash_query: "bali indonesia rice terraces temple",
    country_slug: "indonesia",
    city_slug: "bali",
  },
  "rabota-udalenno-za-rubezhom-2026": {
    unsplash_query: "remote work laptop coffee cafe abroad",
    country_slug: null,
    city_slug: null,
  },
  "pereezd-v-tailand-2026": {
    unsplash_query: "bangkok thailand city skyline temple",
    country_slug: "thailand",
    city_slug: "bangkok",
  },
  "kak-pereekhat-s-semey-za-rubezh-2026": {
    unsplash_query: "family children moving new home abroad",
    country_slug: null,
    city_slug: null,
  },
  "vnzh-turtsii-2026": {
    unsplash_query: "turkey istanbul bosphorus blue mosque",
    country_slug: "turkey",
    city_slug: null,
  },
  "beograd-dlya-zhizni-2026": {
    unsplash_query: "belgrade serbia danube river old town",
    country_slug: "serbia",
    city_slug: "belgrade",
  },
  "stoimost-zhizni-v-dubae-2026": {
    unsplash_query: "dubai marina skyline modern architecture",
    country_slug: "uae",
    city_slug: "dubai",
  },
  "kak-vybrat-stranu-dlya-pereezda-2026": {
    unsplash_query: "world map travel planning destination choose",
    country_slug: null,
    city_slug: null,
  },
  "zhizn-v-gruzii-dlya-rossiyan-2026": {
    unsplash_query: "tbilisi georgia old town bridge church",
    country_slug: "georgia",
    city_slug: "tbilisi",
  },
};

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("No frontmatter found");
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^"(.*)"$/, "$1");
    fm[key] = val;
  }
  const body = match[2].trim();
  return { fm, body };
}

async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${query}: ${res.status}`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return {
    cover_unsplash_id: pick.id,
    cover_url: pick.urls.raw,
    cover_author_name: pick.user.name,
    cover_author_url: pick.user.links.html,
  };
}

async function run() {
  const base = Date.now();
  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < SLUGS.length; i++) {
    const slug = SLUGS[i];
    const filePath = path.join(BLOG_DIR, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      console.warn(`file not found: ${slug}.md — skip`);
      errors++;
      continue;
    }

    // Проверяем, нет ли уже такого slug в базе
    const { data: existing } = await sb
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      console.log(`skip (exists): ${slug}`);
      skipped++;
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    let fm, body;
    try {
      ({ fm, body } = parseFrontmatter(raw));
    } catch (e) {
      console.error(`parse error ${slug}: ${e.message}`);
      errors++;
      continue;
    }

    const meta = META[slug] ?? {};
    let cover = null;
    if (meta.unsplash_query) {
      try {
        cover = await fetchUnsplash(meta.unsplash_query);
      } catch (e) {
        console.warn(`unsplash failed ${slug}: ${e.message}`);
      }
    }

    // Разносим created_at по 1 часу, чтобы порядок в блоге был корректным
    const createdAt = new Date(base - i * 3600 * 1000).toISOString();

    const row = {
      title: fm.title,
      slug,
      tag: fm.tag ?? "Журнал",
      read_time: parseInt(fm.reading_time ?? "10", 10),
      content_md: body,
      seo_title: fm.title,
      seo_description: fm.description ?? null,
      country_slug: meta.country_slug ?? null,
      city_id: null,
      cover_unsplash_id: cover?.cover_unsplash_id ?? null,
      cover_url: cover?.cover_url ?? (fm.cover_url || null),
      cover_author_name: cover?.cover_author_name ?? null,
      cover_author_url: cover?.cover_author_url ?? null,
      published: fm.published !== "false",
      created_at: createdAt,
    };

    const { error } = await sb.from("blog_posts").insert(row);
    if (error) {
      console.error(`insert error ${slug}: ${error.message}`);
      errors++;
      continue;
    }

    added++;
    console.log(`+ ${slug}${cover ? " + cover" : " (no cover)"}`);
  }

  console.log(`\ndone. added=${added} skipped=${skipped} errors=${errors} / total=${SLUGS.length}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
