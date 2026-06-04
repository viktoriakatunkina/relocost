// Сеет 5 «горящих» SEO-статей из content/blog/*.md в blog_posts (upsert по slug).
// Та же логика, что seed-blog-batch.mjs, но META — на 5 новых статей.
// Запуск: node scripts/seed-blog-batch-2.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(HOME, ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

const META = [
  { slug: "shengen-dlya-rossiyan-2026", title: "Шенген для россиян в 2026: что изменилось и где еще дают визу", tag: "Визы", city: null, coverQuery: "europe passport schengen visa travel" },
  { slug: "kak-perevesti-dengi-iz-rossii-za-granitsu-2026", title: "Как перевести деньги из России за границу в 2026: рабочие способы", tag: "Деньги", city: null, coverQuery: "money transfer phone finance app" },
  { slug: "novye-pravila-bankovskih-kart-rf-2026", title: "Новые правила банковских карт в России с 2026: лимиты и налоги", tag: "Деньги", city: null, coverQuery: "bank card wallet finance" },
  { slug: "novye-bezvizovye-strany-2026", title: "Новые безвизовые страны для россиян в 2026: что изменилось", tag: "Подборка", city: null, coverQuery: "airport departure travel passport" },
  { slug: "pereezd-v-izrail-2026", title: "Переезд в Израиль в 2026: репатриация, цены, с чего начать", tag: "Гайд", city: "tel-aviv" },
];

function parseArticle(raw) {
  let text = raw.replace(/^﻿/, "");
  const marker = text.indexOf("---CONTENT---");
  if (marker === -1) throw new Error("нет маркера ---CONTENT---");
  const header = text.slice(0, marker);
  let body = text.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  body = body.replace(/^#\s+.*\n+/, "");
  const seoTitle = (header.match(/^SEO_TITLE:\s*(.+)$/m) || [])[1]?.trim() || null;
  const seoDesc = (header.match(/^SEO_DESCRIPTION:\s*(.+)$/m) || [])[1]?.trim() || null;
  const rtRaw = (header.match(/^READ_TIME:\s*(\d+)/m) || [])[1];
  const words = body.split(/\s+/).filter(Boolean).length;
  let readTime = rtRaw ? parseInt(rtRaw, 10) : Math.round(words / 170);
  readTime = Math.max(4, Math.min(8, readTime || 5));
  return { seoTitle, seoDesc, readTime, body, words };
}

async function fetchCover(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
  return { cover_url: p.urls.raw, cover_author_name: p.user.name, cover_author_url: p.user.links.html };
}

const { data: cities, error: cErr } = await sb
  .from("cities")
  .select("id, slug, unsplash_url, unsplash_author_name, unsplash_author_url");
if (cErr) throw cErr;
const cityBySlug = new Map(cities.map((c) => [c.slug, c]));

let ok = 0, fail = 0;
for (const m of META) {
  const file = path.join(DIR, `${m.slug}.md`);
  if (!fs.existsSync(file)) { console.error(`✗ ${m.slug}: файл не найден, пропуск`); fail++; continue; }
  let parsed;
  try { parsed = parseArticle(fs.readFileSync(file, "utf8")); }
  catch (e) { console.error(`✗ ${m.slug}: ${e.message}`); fail++; continue; }

  let cover = {};
  if (m.city) {
    const c = cityBySlug.get(m.city);
    if (c?.unsplash_url) cover = { cover_url: c.unsplash_url, cover_author_name: c.unsplash_author_name, cover_author_url: c.unsplash_author_url };
  } else if (m.coverQuery) {
    try { const co = await fetchCover(m.coverQuery); if (co) cover = co; }
    catch (e) { console.error(`  ~ ${m.slug}: обложка не получена (${e.message})`); }
  }

  const row = {
    slug: m.slug, title: m.title, tag: m.tag,
    city_id: m.city ? cityBySlug.get(m.city)?.id ?? null : null,
    read_time: parsed.readTime, content_md: parsed.body,
    seo_title: parsed.seoTitle, seo_description: parsed.seoDesc,
    published: true, ...cover,
  };

  const { error: upErr } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (upErr) { console.error(`✗ ${m.slug}: upsert — ${upErr.message}`); fail++; continue; }
  console.log(`✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, cover:${cover.cover_url ? "да" : "нет"}, city:${m.city || "—"}`);
  ok++;
}

console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);
