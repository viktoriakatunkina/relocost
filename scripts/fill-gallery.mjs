// Заполняет cities.gallery массивом из 6 фото Unsplash для каждого города.
// Запуск: node scripts/fill-gallery.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SB_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

// Кастомные поисковые запросы для городов, где общий поиск даст плохие результаты
const QUERIES = {
  spb: "saint petersburg russia",
  moscow: "moscow russia",
  sochi: "sochi black sea",
  krasnodar: "krasnodar russia",
  kaliningrad: "kaliningrad",
  tbilisi: "tbilisi georgia old town",
  yerevan: "yerevan armenia",
  belgrade: "belgrade serbia",
  budapest: "budapest hungary",
  istanbul: "istanbul turkey bosphorus",
  alanya: "alanya turkey",
  lisbon: "lisbon portugal",
  almaty: "almaty kazakhstan",
  dubai: "dubai uae",
  bali: "bali indonesia",
  bangkok: "bangkok thailand",
  limassol: "limassol cyprus",
  bishkek: "bishkek kyrgyzstan",
  tashkent: "tashkent uzbekistan",
  minsk: "minsk belarus",
  podgorica: "podgorica montenegro",
  batumi: "batumi georgia",
  antalya: "antalya turkey",
  phuket: "phuket thailand",
  "chiang-mai": "chiang mai thailand",
  kutaisi: "kutaisi georgia",
  budva: "budva montenegro",
};

async function fetchPhotos(query, count = 6) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", String(count + 2));
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`${query}: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return (json.results || []).slice(0, count).map((p) => ({
    u: p.urls.raw,
    n: p.user.name,
    h: p.user.links.html,
  }));
}

const { data: cities, error } = await sb.from("cities").select("slug, name_en").order("name_ru");
if (error) throw error;

for (const c of cities) {
  const q = QUERIES[c.slug] || `${c.name_en} city`;
  try {
    const photos = await fetchPhotos(q, 6);
    if (photos.length === 0) {
      console.log(`${c.slug}: 0 photos for "${q}"`);
      continue;
    }
    const { error: upErr } = await sb.from("cities").update({ gallery: photos }).eq("slug", c.slug);
    if (upErr) throw upErr;
    console.log(`${c.slug}: ${photos.length} photos (${q})`);
  } catch (e) {
    console.error(`${c.slug} failed: ${e.message}`);
  }
}
console.log("done.");
