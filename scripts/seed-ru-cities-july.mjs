// Seed 3 SEO-статей про российские города — июль 2026
// Краснодар, Сочи, Калининград
// Запуск: node scripts/seed-ru-cities-july.mjs

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const HOME = os.homedir();
const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const BLOG_DIR = path.join(import.meta.dirname, "../content/blog");

const FILES = [
  "zhizn-v-krasnodare-stoimost-zhizni-2026.md",
  "pereezd-v-sochi-na-pmzh-tseny-2026.md",
  "zhizn-v-kaliningrade-evropejskij-gorod-2026.md",
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("No frontmatter found");
  const meta = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim().replace(/^"|"$/g, "");
    meta[key] = val;
  }
  return { meta, content: match[2].trim() };
}

for (const file of FILES) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { meta, content } = parseFrontmatter(raw);

  const row = {
    slug: meta.slug,
    title: meta.title,
    tag: meta.category || "Города России",
    read_time: parseInt(meta.readTime) || 14,
    city_id: null,
    country_slug: null,
    seo_title: meta.title + " | Relocost",
    seo_description: meta.description,
    content_md: content,
    cover_url: null,
    published: true,
  };

  const { error } = await sb
    .from("blog_posts")
    .upsert(row, { onConflict: "slug", ignoreDuplicates: false });

  if (error) {
    console.error(`❌ ${meta.slug}:`, error.message);
  } else {
    console.log(`✅ ${meta.slug} (${meta.title})`);
  }
}

console.log("\nДонейро. Статьи в Supabase.");
