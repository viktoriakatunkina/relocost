// Батч seed-5-articles-priority: 5 приоритетных SEO-статей.
// Запуск: node scripts/seed-5-articles-priority.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();
const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH_KEY = (() => {
  try { return fs.readFileSync(`${HOME}/.relocost/unsplash_access_key`, "utf8").trim(); }
  catch { return null; }
})();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");

const SLUGS = [
  "kuda-pereekhat-s-budzhetom-80000",
  "zhizn-v-chernogorii-dlya-rossiyan",
  "bezvizovye-strany-dlya-rossiyan-2025",
  "kak-perevesti-dengi-za-granicu-2025",
  "zhizn-v-portugalii-dlya-rossiyan",
];

const META = {
  "kuda-pereekhat-s-budzhetom-80000": {
    unsplash_query: "world travel map destination planning budget",
    country_slug: null,
    city_slug: null,
    tags: ["переезд", "бюджет", "страны", "стоимость жизни"],
  },
  "zhizn-v-chernogorii-dlya-rossiyan": {
    unsplash_query: "montenegro kotor bay adriatic sea",
    country_slug: "montenegro",
    city_slug: null,
    tags: ["Черногория", "ВНЖ", "переезд", "Балканы"],
  },
  "bezvizovye-strany-dlya-rossiyan-2025": {
    unsplash_query: "passport travel visa airport world",
    country_slug: null,
    city_slug: null,
    tags: ["безвиз", "визы", "страны", "переезд"],
  },
  "kak-perevesti-dengi-za-granicu-2025": {
    unsplash_query: "money transfer finance bank international",
    country_slug: null,
    city_slug: null,
    tags: ["финансы", "переводы", "деньги", "переезд"],
  },
  "zhizn-v-portugalii-dlya-rossiyan": {
    unsplash_query: "lisbon portugal city tram yellow",
    country_slug: "portugal",
    city_slug: null,
    tags: ["Португалия", "Лиссабон", "ВНЖ", "Европа"],
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
  if (!UNSPLASH_KEY) return null;
  try {
    const u = new URL("https://api.unsplash.com/search/photos");
    u.searchParams.set("query", query);
    u.searchParams.set("per_page", "5");
    u.searchParams.set("orientation", "landscape");
    const res = await fetch(u, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`  unsplash HTTP ${res.status} for "${query}"`);
      return null;
    }
    const json = await res.json();
    const pick = json.results?.[0];
    if (!pick) return null;
    return {
      cover_unsplash_id: pick.id,
      cover_url: pick.urls.raw,
      cover_author_name: pick.user.name,
      cover_author_url: pick.user.links.html,
    };
  } catch (e) {
    console.warn(`  unsplash error for "${query}": ${e.message}`);
    return null;
  }
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
      console.warn(`[SKIP] file not found: ${slug}.md`);
      errors++;
      continue;
    }

    // Проверяем существование в базе
    const { data: existing } = await sb
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      console.log(`[SKIP] already in DB: ${slug}`);
      skipped++;
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    let fm, body;
    try {
      ({ fm, body } = parseFrontmatter(raw));
    } catch (e) {
      console.error(`[ERR ] parse error ${slug}: ${e.message}`);
      errors++;
      continue;
    }

    const meta = META[slug] ?? {};

    // Fetch cover from Unsplash
    let cover = null;
    if (meta.unsplash_query) {
      cover = await fetchUnsplash(meta.unsplash_query);
    }

    // Разносим created_at по 1 часу для правильного порядка в блоге
    const createdAt = new Date(base - i * 3600 * 1000).toISOString();

    const row = {
      title: fm.title,
      slug,
      tag: fm.tag ?? "Переезд",
      read_time: parseInt(fm.reading_time ?? "9", 10),
      content_md: body,
      seo_title: fm.title,
      seo_description: fm.description ?? null,
      country_slug: meta.country_slug ?? null,
      city_id: null,
      cover_unsplash_id: cover?.cover_unsplash_id ?? null,
      cover_url: cover?.cover_url ?? null,
      cover_author_name: cover?.cover_author_name ?? null,
      cover_author_url: cover?.cover_author_url ?? null,
      published: fm.published !== "false",
      created_at: createdAt,
    };

    const { error } = await sb.from("blog_posts").insert(row);
    if (error) {
      console.error(`[ERR ] insert ${slug}: ${error.message}`);
      errors++;
      continue;
    }

    added++;
    console.log(`[ADD ] ${slug}${cover ? " + cover" : " (no cover)"}`);
  }

  console.log(
    `\ndone. added=${added} skipped=${skipped} errors=${errors} / total=${SLUGS.length}`
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
