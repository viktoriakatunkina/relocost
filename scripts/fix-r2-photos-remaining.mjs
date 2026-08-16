/**
 * Фиксирует оставшиеся 12 городов с R2 фото (с задержками для Unsplash rate limit)
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

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Только оставшиеся 12 городов (те что получили 403)
const REMAINING = {
  "gdansk":      "Gdansk Poland old town colorful",
  "naples":      "Naples Italy city view",
  "los-angeles": "Los Angeles California skyline sunset",
  "santiago":    "Santiago Chile cityscape Andes",
  "vancouver":   "Vancouver Canada mountains bay",
  "montreal":    "Montreal Canada city architecture",
  "miami":       "Miami Florida beach city",
  "new-york":    "New York City Manhattan skyline",
  "tulum":       "Tulum Mexico jungle ruins",
  "nairobi":     "Nairobi Kenya modern city",
  "casablanca":  "Casablanca Morocco Hassan mosque",
  "funchal":     "Funchal Madeira island city port",
};

async function findAndUpload(slug, query) {
  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&client_id=${UNSPLASH_KEY}`;
  const searchResp = await fetch(searchUrl);

  if (searchResp.status === 403) {
    const msg = await searchResp.text();
    if (msg.includes("Rate Limit")) {
      console.error(`  ✗ Rate limit! Ожидаю 30с...`);
      await sleep(30000);
      // Повтор
      const retry = await fetch(searchUrl);
      if (!retry.ok) {
        console.error(`  ✗ Повтор тоже не сработал: ${retry.status}`);
        return null;
      }
      const data = await retry.json();
      const photo = data?.results?.[0];
      if (!photo) return null;
      return downloadAndStore(slug, photo.urls?.regular);
    }
    return null;
  }

  if (!searchResp.ok) {
    console.error(`  ✗ ${searchResp.status}`);
    return null;
  }

  const data = await searchResp.json();
  const photo = data?.results?.[0];
  if (!photo) {
    console.error(`  ✗ Нет результатов`);
    return null;
  }
  return downloadAndStore(slug, photo.urls?.regular);
}

async function downloadAndStore(slug, downloadUrl) {
  const imgResp = await fetch(downloadUrl);
  if (!imgResp.ok) return null;
  const buffer = Buffer.from(await imgResp.arrayBuffer());

  const hash = crypto.createHash("sha1").update(slug).digest("hex").slice(0, 16);
  const storagePath = `u/${hash}.jpg`;
  const { error } = await sb.storage.from("photos").upload(storagePath, buffer, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) {
    console.error(`  ✗ Upload: ${error.message}`);
    return null;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/photos/${storagePath}`;
}

let fixed = 0;
const entries = Object.entries(REMAINING);
for (let i = 0; i < entries.length; i++) {
  const [slug, query] = entries[i];
  process.stdout.write(`[${i+1}/${entries.length}] ${slug}... `);

  try {
    const newUrl = await findAndUpload(slug, query);
    if (!newUrl) continue;

    const { error } = await sb.from("cities").update({ unsplash_url: newUrl }).eq("slug", slug);
    if (error) { console.error(`✗ DB: ${error.message}`); continue; }

    fixed++;
    console.log(`✓`);
  } catch (e) {
    console.error(`✗ ${e.message}`);
  }

  // Задержка между запросами: 3 сек
  if (i < entries.length - 1) await sleep(3000);
}

console.log(`\nГотово: исправлено ещё ${fixed} городов`);
