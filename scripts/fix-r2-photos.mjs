/**
 * Фиксирует фото городов batch2 — R2 → Supabase Storage
 * Bucket: "photos", путь: u/<hash>.jpg
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import crypto from "node:crypto";

const H = os.homedir();
const SUPABASE_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const UNSPLASH_KEY = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();

const sb = createClient(
  SUPABASE_URL,
  fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim(),
  { auth: { persistSession: false } }
);

// Поисковые запросы для Unsplash
const CITY_QUERIES = {
  "florence":   "Florence Italy city architecture",
  "zurich":     "Zurich Switzerland city lake",
  "hamburg":    "Hamburg Germany harbor port",
  "frankfurt":  "Frankfurt Germany skyline",
  "nice":       "Nice France promenade city",
  "copenhagen": "Copenhagen Denmark city canal",
  "stockholm":  "Stockholm Sweden old town",
  "helsinki":   "Helsinki Finland cathedral",
  "gdansk":     "Gdansk Poland old town",
  "naples":     "Naples Italy cityscape",
  "los-angeles":"Los Angeles California skyline",
  "santiago":   "Santiago Chile cityscape mountains",
  "vancouver":  "Vancouver Canada mountains city",
  "montreal":   "Montreal Canada city old port",
  "miami":      "Miami Beach Florida city",
  "new-york":   "New York City skyline",
  "tulum":      "Tulum Mexico ruins beach",
  "nairobi":    "Nairobi Kenya city",
  "casablanca": "Casablanca Morocco city architecture",
  "funchal":    "Funchal Madeira Portugal city",
};

async function findAndUpload(slug, query) {
  // Поиск фото через Unsplash API
  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&client_id=${UNSPLASH_KEY}`;
  const searchResp = await fetch(searchUrl);
  if (!searchResp.ok) {
    console.error(`  ✗ Unsplash search ${searchResp.status}: ${await searchResp.text()}`);
    return null;
  }
  const searchData = await searchResp.json();
  const photo = searchData?.results?.[0];
  if (!photo) {
    console.error(`  ✗ Нет результатов для "${query}"`);
    return null;
  }

  const downloadUrl = photo.urls?.regular;
  if (!downloadUrl) return null;

  // Скачиваем фото
  const imgResp = await fetch(downloadUrl);
  if (!imgResp.ok) {
    console.error(`  ✗ Ошибка скачивания: ${imgResp.status}`);
    return null;
  }
  const buffer = Buffer.from(await imgResp.arrayBuffer());

  // Загружаем в Supabase Storage (bucket: photos, path: u/<hash>.jpg)
  const hash = crypto.createHash("sha1").update(slug).digest("hex").slice(0, 16);
  const storagePath = `u/${hash}.jpg`;
  const { error: uploadErr } = await sb.storage.from("photos").upload(storagePath, buffer, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (uploadErr) {
    console.error(`  ✗ Upload error: ${uploadErr.message}`);
    return null;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/photos/${storagePath}`;
}

let fixed = 0;
for (const [slug, query] of Object.entries(CITY_QUERIES)) {
  process.stdout.write(`Обрабатываю ${slug}... `);

  try {
    const newUrl = await findAndUpload(slug, query);
    if (!newUrl) continue;

    const { error } = await sb.from("cities")
      .update({ unsplash_url: newUrl })
      .eq("slug", slug);

    if (error) {
      console.error(`✗ DB: ${error.message}`);
      continue;
    }
    fixed++;
    console.log(`✓ → ...${newUrl.slice(-30)}`);
  } catch (e) {
    console.error(`✗ Exception: ${e.message}`);
  }
}

console.log(`\nГотово: исправлено ${fixed} из ${Object.keys(CITY_QUERIES).length} городов`);
