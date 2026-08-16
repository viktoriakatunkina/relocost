// Обновляет content_md в Supabase для переданных .md файлов
// Использование: node scripts/reseed-blog-batch.mjs <glob-pattern или список файлов>
// Пример: node scripts/reseed-blog-batch.mjs 1 50
// (обновит файлы с 1 по 50 из отсортированного списка)

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const HOME = os.homedir();
const SUPA_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const BLOG_DIR = path.join(import.meta.dirname, "../content/blog");

const [fromArg, toArg] = process.argv.slice(2);
const from = parseInt(fromArg ?? "1") - 1;
const to = parseInt(toArg ?? "50");

function parseFrontmatter(raw, filename) {
  // Новый формат: ---\nslug: ...\n---\nContent
  const newFmt = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (newFmt) {
    const meta = {};
    for (const line of newFmt[1].split("\n")) {
      const colon = line.indexOf(":");
      if (colon === -1) continue;
      const key = line.slice(0, colon).trim();
      const val = line.slice(colon + 1).trim().replace(/^"|"$/g, "");
      meta[key] = val;
    }
    return { meta, content: newFmt[2].trim() };
  }
  // Старый формат: SEO_TITLE: ...\n---CONTENT---\nContent
  const oldFmt = raw.match(/---CONTENT---\n([\s\S]*)$/);
  if (oldFmt) {
    const meta = { slug: filename.replace(".md", "") };
    const titleMatch = raw.match(/^SEO_TITLE:\s*(.+)$/m);
    if (titleMatch) meta.title = titleMatch[1].trim();
    const descMatch = raw.match(/^SEO_DESCRIPTION:\s*(.+)$/m);
    if (descMatch) meta.description = descMatch[1].trim();
    return { meta, content: oldFmt[1].trim() };
  }
  return null;
}

const allFiles = fs.readdirSync(BLOG_DIR)
  .filter(f => f.endsWith(".md"))
  .sort();

const files = allFiles.slice(from, to);
console.log(`Updating ${files.length} articles (${from + 1}–${to}) in Supabase...`);

let ok = 0, err = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const parsed = parseFrontmatter(raw, file);
  if (!parsed) { console.log(`⚠️  Unparseable: ${file}`); err++; continue; }

  const { meta, content } = parsed;
  const slug = meta.slug || file.replace(".md", "");

  const updates = { content_md: content };
  if (meta.title) updates.seo_title = meta.title + " | Relocost";
  if (meta.description) updates.seo_description = meta.description;

  const { error } = await sb.from("blog_posts")
    .update(updates)
    .eq("slug", slug);

  if (error) {
    console.log(`❌ ${slug}: ${error.message}`);
    err++;
  } else {
    ok++;
    if (ok % 10 === 0) console.log(`  ... ${ok} done`);
  }
}

console.log(`\nГотово: ${ok} обновлено, ${err} ошибок.`);
