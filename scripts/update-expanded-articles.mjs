// Обновляет content_md и read_time у 5 расширенных старых статей.
// Берет тело из content/blog/_expand/<slug>.exp.md, остальные поля (title, seo,
// tag, city_id, обложку) НЕ трогает. Запуск: node scripts/update-expanded-articles.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog/_expand");
const SLUGS = [
  "top-7-napravleniy-relokatsii-2026",
  "kak-pereekhat-v-tbilisi-2026",
  "tbilisi-ili-yerevan-2026",
  "lisbon-vs-limassol-2026",
  "istanbul-dlya-udalenshika-budget-2026",
];

function clean(raw) {
  let b = raw.replace(/^﻿/, "").trim();
  // на случай, если агент все же добавил SEO-шапку или маркер — берем тело после ---CONTENT---
  const m = b.indexOf("---CONTENT---");
  if (m !== -1) b = b.slice(m + "---CONTENT---".length).trim();
  b = b.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  b = b.replace(/^#\s+.*\n+/, ""); // снять случайный H1
  return b.trim();
}

let ok = 0, fail = 0;
for (const slug of SLUGS) {
  const file = path.join(DIR, `${slug}.exp.md`);
  if (!fs.existsSync(file)) { console.error(`✗ ${slug}: нет файла .exp.md`); fail++; continue; }
  const body = clean(fs.readFileSync(file, "utf8"));
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words < 700) { console.error(`✗ ${slug}: всего ${words} слов — подозрительно мало, пропуск`); fail++; continue; }
  const readTime = Math.max(4, Math.min(9, Math.round(words / 170)));
  const { error } = await sb.from("blog_posts").update({ content_md: body, read_time: readTime }).eq("slug", slug);
  if (error) { console.error(`✗ ${slug}: ${error.message}`); fail++; continue; }
  console.log(`✓ ${slug} — ${words} слов, ${readTime} мин`);
  ok++;
}
console.log(`\nОбновлено: ${ok}, проблемных: ${fail}.`);
