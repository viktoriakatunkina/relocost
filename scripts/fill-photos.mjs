// Догрузка Unsplash-фото для городов без unsplash_url.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SB_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const QUERIES = {
  bishkek: "bishkek kyrgyzstan",
  tashkent: "tashkent uzbekistan",
  minsk: "minsk belarus",
  podgorica: "podgorica montenegro",
  batumi: "batumi black sea georgia",
  antalya: "antalya turkey",
  phuket: "phuket thailand beach",
  "chiang-mai": "chiang mai thailand",
  kutaisi: "kutaisi georgia",
  budva: "budva montenegro sea",
};

async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`${query}: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return {
    photo_id: pick.id,
    base_url: pick.urls.raw,
    author_name: pick.user.name,
    author_url: pick.user.links.html,
  };
}

for (const [slug, q] of Object.entries(QUERIES)) {
  const photo = await fetchUnsplash(q);
  if (!photo) { console.log(`no photo for ${slug}`); continue; }
  const { error } = await sb.from("cities").update({
    unsplash_photo_id: photo.photo_id,
    unsplash_url: photo.base_url,
    unsplash_author_name: photo.author_name,
    unsplash_author_url: photo.author_url,
  }).eq("slug", slug);
  if (error) throw error;
  console.log(`${slug} ← ${photo.photo_id} by ${photo.author_name}`);
}
