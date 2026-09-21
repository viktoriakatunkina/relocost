// Заливает hero-фото (cities.unsplash_url) для 16 городов, у которых
// unsplash_url был пуст — найдено фото-аудитом. Приоритет отдан крупным
// по трафику городам (Tokyo/Singapore/Mumbai/Delhi), но порядок не важен —
// все 16 идут в одном прогоне с задержкой между запросами.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";

const H = os.homedir();
const dot = (n) => fs.readFileSync(path.join(H, ".relocost", n), "utf8").trim();
const SUPA_URL = dot("supabase_url");
const sb = createClient(SUPA_URL, dot("supabase_service_role_key"), { auth: { persistSession: false } });
const UNSPLASH = dot("unsplash_access_key");

const CITIES = [
  // приоритет — крупнейшие по трафику
  { slug: "tokyo", query: "Tokyo Japan skyline Shibuya" },
  { slug: "singapore", query: "Singapore skyline Marina Bay" },
  { slug: "mumbai", query: "Mumbai India Gateway of India skyline" },
  { slug: "delhi", query: "Delhi India landmark cityscape" },
  // остальные
  { slug: "ubud", query: "Ubud Bali rice terrace" },
  { slug: "herceg-novi", query: "Herceg Novi Montenegro old town" },
  { slug: "medan", query: "Medan Indonesia city" },
  { slug: "yogyakarta", query: "Yogyakarta Indonesia Borobudur" },
  { slug: "chennai", query: "Chennai India Marina Beach" },
  { slug: "zagreb", query: "Zagreb Croatia old town" },
  { slug: "bangalore", query: "Bangalore India city skyline" },
  { slug: "cape-town", query: "Cape Town South Africa Table Mountain" },
  { slug: "merida", query: "Merida Mexico colonial city" },
  { slug: "seminyak", query: "Seminyak Bali beach" },
  { slug: "pondicherry", query: "Pondicherry India French Quarter" },
  { slug: "lombok", query: "Lombok Indonesia beach" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPhoto(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (res.status === 403) {
    const body = await res.text();
    if (/Rate Limit Exceeded/i.test(body)) throw new Error("RATE_LIMIT");
    throw new Error(`Unsplash 403: ${body}`);
  }
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
  return { rawUrl: p.urls.raw, authorName: p.user.name, authorUrl: p.user.links.html, id: p.id };
}

async function uploadToStorage(key, rawUrl) {
  const imgRes = await fetch(rawUrl + "&w=1600&q=80&fm=jpg");
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const hash = createHash("md5").update(key).digest("hex").slice(0, 16);
  const storagePath = `u/${hash}.jpg`;
  const { error } = await sb.storage.from("photos").upload(storagePath, buf, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  return `${SUPA_URL}/storage/v1/object/public/photos/${storagePath}`;
}

async function run() {
  let ok = 0, failed = 0;
  for (const c of CITIES) {
    try {
      const photo = await fetchPhoto(c.query);
      if (!photo) { console.log(`~ ${c.slug}: нет результата для "${c.query}"`); failed++; continue; }
      const url = await uploadToStorage(`hero::${c.slug}`, photo.rawUrl);
      const { error } = await sb
        .from("cities")
        .update({
          unsplash_photo_id: photo.id,
          unsplash_url: url,
          unsplash_author_name: photo.authorName,
          unsplash_author_url: photo.authorUrl,
        })
        .eq("slug", c.slug);
      if (error) throw error;
      console.log(`✓ ${c.slug} -> "${c.query}" (${photo.authorName}) -> ${url}`);
      ok++;
      await sleep(400);
    } catch (e) {
      if (e.message === "RATE_LIMIT") {
        console.error(`\n✗ RATE LIMIT на ${c.slug}. Останавливаюсь.`);
        break;
      }
      console.error(`✗ ${c.slug}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\nГотово. ok=${ok} failed=${failed}`);
}

run();
