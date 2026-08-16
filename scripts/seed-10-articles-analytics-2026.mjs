// 10 аналитических SEO-статей — июль 2026.
// Читает frontmatter из .md файлов, cover_url берет из frontmatter (не из Unsplash API).
// Запуск: node scripts/seed-10-articles-analytics-2026.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();
const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");

const SLUGS = [
  "kuda-pereezzhayut-rossiyane-v-aziyu-2026",
  "kuda-pereezzhayut-rossiyane-v-evropu-2026",
  "mayatnikovaya-emigratsiya-iz-rossii-2026",
  "vozvrat-iz-emigratsii-v-rossiyu-2026-prichiny",
  "kuda-pereekhat-it-spetsialistu-iz-rossii-2026",
  "kuda-pereekhat-predprinimatelyu-iz-rossii-2026",
  "stoimost-pereezda-za-rubezh-iz-rossii-2026",
  "kuda-pereekhat-bez-inostrannogo-yazyka-2026",
  "latinskaya-amerika-dlya-rossiyan-2026",
  "kak-zhit-za-rubezhom-bez-vnzh-rossiyane-2026",
];

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
  const body = match[2].replace(/^#\s+.+\n+/, "").trim();
  return { fm, body };
}

async function run() {
  const base = Date.now();
  let added = 0, skipped = 0, errors = 0;

  for (let i = 0; i < SLUGS.length; i++) {
    const slug = SLUGS[i];
    const filePath = path.join(BLOG_DIR, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      console.warn(`file not found: ${slug}.md — skip`);
      errors++;
      continue;
    }

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

    const createdAt = new Date(base - i * 3600 * 1000).toISOString();

    const row = {
      title: fm.title,
      slug,
      tag: fm.tag ?? "Аналитика",
      read_time: parseInt(fm.reading_time ?? "8", 10),
      content_md: body,
      seo_title: fm.title,
      seo_description: fm.description ?? null,
      country_slug: null,
      city_id: null,
      cover_url: fm.cover_url || null,
      cover_unsplash_id: null,
      cover_author_name: null,
      cover_author_url: null,
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
    console.log(`+ ${slug}`);
  }

  console.log(`\ndone. added=${added} skipped=${skipped} errors=${errors} / total=${SLUGS.length}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
