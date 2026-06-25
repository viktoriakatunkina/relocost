// Заполняет cities.gallery (6 фото Unsplash) ТОЛЬКО городам, у которых галерея пуста.
// Ничего не перезаписывает. Идемпотентно: повторный запуск трогает лишь оставшиеся пустые.
// Запуск: node scripts/fill-gallery-missing.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(path.join(H, ".relocost/supabase_url"), "utf8").trim(),
  fs.readFileSync(path.join(H, ".relocost/supabase_service_role_key"), "utf8").trim(),
  { auth: { persistSession: false } }
);
const UNSPLASH = fs.readFileSync(path.join(H, ".relocost/unsplash_access_key"), "utf8").trim();

// Уточнённые запросы там, где name_en+country даёт неточный результат (пляжи, острова, спорные)
const QUERIES = {
  "phu-quoc": "phu quoc vietnam island beach",
  pattaya: "pattaya thailand beach",
  sanya: "sanya hainan china beach",
  "sharm-el-sheikh": "sharm el sheikh egypt red sea",
  hurghada: "hurghada egypt red sea",
  "playa-del-carmen": "playa del carmen mexico beach",
  tivat: "tivat montenegro kotor bay",
  heraklion: "heraklion crete greece",
  "siem-reap": "siem reap angkor cambodia",
  aktau: "aktau kazakhstan",
  larnaca: "larnaca cyprus",
  sousse: "sousse tunisia medina",
  manama: "manama bahrain skyline",
  doha: "doha qatar skyline",
  bodrum: "bodrum turkey marina",
  izmir: "izmir turkey waterfront",
  thessaloniki: "thessaloniki greece waterfront",
  marrakesh: "marrakesh morocco medina",
  porto: "porto portugal douro",
  split: "split croatia old town",
  colombo: "colombo sri lanka",
};

async function fetchPhotos(query, count = 6) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", String(count + 2));
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (res.status === 403 || res.status === 429) throw new Error(`RATE_LIMIT (${res.status})`);
  if (!res.ok) throw new Error(`${res.status}`);
  const json = await res.json();
  return (json.results || []).slice(0, count).map((p) => ({ u: p.urls.raw, n: p.user.name, h: p.user.links.html }));
}

const { data: cities, error } = await sb.from("cities").select("id, slug, name_en, country_en, gallery").order("slug");
if (error) throw error;
const empty = cities.filter((c) => !(Array.isArray(c.gallery) && c.gallery.length > 0));
console.log(`Городов без галереи: ${empty.length}\n`);

let ok = 0, fail = 0, rateLimited = false;
const failed = [];
for (const c of empty) {
  const q = QUERIES[c.slug] || `${c.name_en} ${c.country_en}`;
  try {
    const photos = await fetchPhotos(q, 6);
    if (!photos.length) { console.log(`~ ${c.slug}: 0 фото для "${q}"`); failed.push(c.slug); fail++; continue; }
    const { error: upErr } = await sb.from("cities").update({ gallery: photos }).eq("id", c.id);
    if (upErr) throw upErr;
    ok++;
    console.log(`✓ ${c.slug.padEnd(18)} ${photos.length} фото  (${q})`);
  } catch (e) {
    if (e.message.startsWith("RATE_LIMIT")) { rateLimited = true; failed.push(c.slug); console.error(`✗ ${c.slug}: ${e.message} — стоп, остальное допрогнать позже`); break; }
    console.error(`✗ ${c.slug}: ${e.message}`); failed.push(c.slug); fail++;
  }
}
console.log(`\nГотово. Заполнено: ${ok}, проблемных: ${fail}${rateLimited ? " (упёрлись в лимит Unsplash — перезапусти скрипт через час, он добьёт остаток)" : ""}.`);
if (failed.length) console.log(`Осталось без галереи: ${failed.join(", ")}`);
