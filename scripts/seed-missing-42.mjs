// Загружает в Supabase все .md-статьи из content/blog/, которых ещё нет в базе.
// Поддерживает оба формата: YAML frontmatter (---) и старый (---CONTENT---).
// Запуск: node scripts/seed-missing-42.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(`${HOME}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${HOME}/.relocost/supabase_service_role_key`, "utf8").trim();
const sb = createClient(SB_URL, KEY, { auth: { persistSession: false } });

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");

// Тег по ключевым словам в slug
function guessTag(slug) {
  if (/viza|vnzh|pasport|grazhdanstvo/.test(slug)) return "Визы";
  if (/nalog|dengi|schet|bank|karty|perevesti|byudzhet|stoimost/.test(slug)) return "Деньги";
  if (/opyt|zhizn|god|mesyac|istoriya|kochevnik|programmist|studentka|pensioner|semya/.test(slug)) return "Журнал";
  if (/pereezd|kak-pereekhat|kak-snyat|kak-kupit/.test(slug)) return "Гайд";
  if (/top|luchsh|reyting|kuda-pereezzhayut|kuda-pereekhat/.test(slug)) return "Аналитика";
  if (/strahovka|meditsina|voprosy/.test(slug)) return "Гайд";
  return "Журнал";
}

// Парсит YAML-фронтматер: --- ... ---
function parseYaml(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    fm[line.slice(0, colon).trim()] = line.slice(colon + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  let body = m[2].trim().replace(/^#\s+.+\n+/, "");
  return {
    title: fm.title || null,
    seoTitle: fm.title || null,
    seoDesc: fm.description || null,
    tag: fm.tag || "Журнал",
    readTime: parseInt(fm.reading_time || "7", 10),
    coverUrl: fm.cover_url || null,
    published: fm.published !== "false",
    body,
  };
}

// Парсит старый формат: SEO_TITLE / SEO_DESCRIPTION / READ_TIME + ---CONTENT---
function parseOld(content) {
  const marker = content.indexOf("---CONTENT---");
  if (marker === -1) return null;
  const header = content.slice(0, marker);
  let body = content.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");

  const rawSeoTitle = (header.match(/^SEO_TITLE:\s*(.+)$/m) || [])[1]?.trim() || null;
  const seoDesc = (header.match(/^SEO_DESCRIPTION:\s*(.+)$/m) || [])[1]?.trim() || null;
  const rtRaw = (header.match(/^READ_TIME:\s*(\d+)/m) || [])[1];

  // Вытаскиваем заголовок: из первого H1 в теле, иначе из SEO_TITLE (убираем " | Relocost")
  const h1Match = body.match(/^#\s+(.+)$/m);
  let title = h1Match ? h1Match[1].trim() : null;
  if (!title && rawSeoTitle) title = rawSeoTitle.replace(/\s*\|\s*Relocost\s*$/, "").trim();

  // Убираем первый H1 из тела
  body = body.replace(/^#\s+.+\n+/, "").trim();

  const words = body.split(/\s+/).filter(Boolean).length;
  const readTime = rtRaw ? parseInt(rtRaw, 10) : Math.max(4, Math.min(12, Math.round(words / 170)));

  return {
    title,
    seoTitle: rawSeoTitle || title,
    seoDesc,
    tag: null, // определим по slug
    readTime,
    coverUrl: null,
    published: true,
    body,
  };
}

// Получаем все slug из базы
let from = 0, dbSlugs = new Set();
while (true) {
  const { data } = await sb.from("blog_posts").select("slug").range(from, from + 999);
  data.forEach(r => dbSlugs.add(r.slug));
  if (data.length < 1000) break;
  from += 1000;
}

// Все .md файлы
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".md")).sort();
const missing = files.map(f => f.replace(".md", "")).filter(s => !dbSlugs.has(s));
console.log(`В базе: ${dbSlugs.size} | Файлов: ${files.length} | Не в базе: ${missing.length}`);

const base = Date.now();
let added = 0, skipped = 0, errors = 0;

for (let i = 0; i < missing.length; i++) {
  const slug = missing[i];
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8");

  let parsed = parseYaml(raw) || parseOld(raw);
  if (!parsed) {
    console.error(`✗ ${slug}: не удалось распарсить`);
    errors++;
    continue;
  }

  if (!parsed.title) {
    console.warn(`! ${slug}: нет заголовка, пропуск`);
    errors++;
    continue;
  }

  const tag = parsed.tag || guessTag(slug);
  const row = {
    slug,
    title: parsed.title,
    seo_title: parsed.seoTitle || parsed.title,
    seo_description: parsed.seoDesc || null,
    tag,
    read_time: parsed.readTime,
    content_md: parsed.body,
    cover_url: parsed.coverUrl,
    cover_unsplash_id: null,
    cover_author_name: null,
    cover_author_url: null,
    country_slug: null,
    city_id: null,
    published: parsed.published,
    created_at: new Date(base - i * 3600 * 1000).toISOString(),
  };

  const { error } = await sb.from("blog_posts").insert(row);
  if (error) {
    console.error(`✗ ${slug}: ${error.message}`);
    errors++;
    continue;
  }

  added++;
  process.stdout.write(`+ ${slug}\n`);
}

console.log(`\nИтого: добавлено ${added}, пропущено ${skipped}, ошибок ${errors} из ${missing.length}`);
