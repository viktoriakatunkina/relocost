// Сеет 10 SEO-статей на нейтральные (не привязанные к городу) темы из content/blog/*.md в blog_posts.
//  • content / seo_title / seo_description / read_time — из .md.
//  • Обложка — 1 запрос к Unsplash по coverQuery. При 403/ошибке (лимит) обложку НЕ трогает —
//    повторный запуск со свежей квотой добавит обложки тем, у кого их ещё нет. Идемпотентно (upsert по slug).
// Запуск: node scripts/seed-blog-neutral-2026.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const H = os.homedir();
const SB_URL = fs.readFileSync(path.join(H, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(H, ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(H, ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const DIR = path.join(H, "Desktop/Работа/Клод/relocost/content/blog");

const META = [
  { slug: "kak-kupit-nedvizhimost-za-granitsey-2026", title: "Как купить недвижимость за границей россиянину в 2026", tag: "Деньги", coverQuery: "modern apartment building real estate keys" },
  { slug: "kak-sdavat-kvartiru-v-rossii-iz-za-granitsy-2026", title: "Как сдавать квартиру в России, живя за границей", tag: "Деньги", coverQuery: "apartment keys for rent contract" },
  { slug: "kak-platit-ipoteku-iz-za-granitsy-2026", title: "Как платить ипотеку и кредиты в России из-за границы", tag: "Деньги", coverQuery: "mortgage calculator finance documents" },
  { slug: "kak-perevesti-pensiyu-za-granitsu-2026", title: "Как получать российскую пенсию при переезде за границу", tag: "Деньги", coverQuery: "senior couple finance planning" },
  { slug: "brokerskiy-schet-za-granitsey-2026", title: "Как открыть брокерский счет за границей россиянину", tag: "Деньги", coverQuery: "stock market investing chart laptop" },
  { slug: "grazhdanstvo-za-naturalizatsiyu-2026", title: "Гражданство за натурализацию: где получить быстрее в 2026", tag: "Визы", coverQuery: "passport citizenship documents flags" },
  { slug: "russkoyazychnoe-soobshchestvo-za-granitsey-2026", title: "Как найти русскоязычное сообщество за границей", tag: "Гайд", coverQuery: "friends community meeting cafe" },
  { slug: "adaptatsiya-i-kulturnyy-shok-2026", title: "Культурный шок и адаптация после переезда: как пережить", tag: "Гайд", coverQuery: "person walking city street thoughtful" },
  { slug: "rody-za-granitsey-dlya-rossiyan-2026", title: "Роды за границей для россиян: где и сколько стоит", tag: "Гайд", coverQuery: "newborn baby hospital mother" },
  { slug: "rossiyskie-servisy-za-granitsey-2026", title: "Как пользоваться российскими сервисами за границей", tag: "Гайд", coverQuery: "laptop smartphone online banking" },
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
  if (res.status === 403 || res.status === 429) throw new Error(`RATE_LIMIT (${res.status})`);
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
  return { cover_url: p.urls.raw, cover_author_name: p.user.name, cover_author_url: p.user.links.html };
}

// какие slug уже имеют обложку (чтобы при повторном запуске не дёргать Unsplash зря)
const { data: existing } = await sb.from("blog_posts").select("slug, cover_url").in("slug", META.map((m) => m.slug));
const coverBySlug = new Map((existing || []).map((p) => [p.slug, p.cover_url]));

const base = Date.now();
let ok = 0, withCover = 0, fail = 0, rateLimited = false;
for (let i = 0; i < META.length; i++) {
  const m = META[i];
  const file = path.join(DIR, `${m.slug}.md`);
  if (!fs.existsSync(file)) { console.error(`✗ ${m.slug}: файл не найден`); fail++; continue; }
  let parsed;
  try { parsed = parseArticle(fs.readFileSync(file, "utf8")); }
  catch (e) { console.error(`✗ ${m.slug}: ${e.message}`); fail++; continue; }

  // Обложка: тянем только если её ещё нет и лимит не исчерпан
  let cover = {};
  if (!coverBySlug.get(m.slug) && !rateLimited) {
    try { const co = await fetchCover(m.coverQuery); if (co) cover = co; }
    catch (e) { if (e.message.startsWith("RATE_LIMIT")) rateLimited = true; else console.error(`  ~ ${m.slug}: обложка — ${e.message}`); }
  }

  const row = {
    slug: m.slug, title: m.title, tag: m.tag, city_id: null, country_slug: null,
    read_time: parsed.readTime, content_md: parsed.body,
    seo_title: parsed.seoTitle, seo_description: parsed.seoDesc,
    published: true, created_at: new Date(base - i * 3600 * 1000).toISOString(),
    ...cover,
  };
  const { error: upErr } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (upErr) { console.error(`✗ ${m.slug}: upsert — ${upErr.message}`); fail++; continue; }
  if (cover.cover_url) withCover++;
  ok++;
  console.log(`✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, cover:${cover.cover_url ? "да" : (coverBySlug.get(m.slug) ? "уже была" : "нет")}`);
}
console.log(`\nГотово. Статей: ${ok}/${META.length}, новых обложек: ${withCover}, ошибок: ${fail}${rateLimited ? " — лимит Unsplash исчерпан, перезапусти позже для обложек" : ""}.`);
