// Догружает фото Unsplash для всех городов без unsplash_url.
// Переживает часовой лимит: при 403 ждет и повторяет.
// Запуск: node scripts/backfill-photos.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SUPA_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Запросы под конкретные слаги (точнее, чем «город страна»)
const QUERY = {
  sousse: "sousse tunisia", "rio-de-janeiro": "rio de janeiro", amman: "amman jordan",
  haifa: "haifa israel", manila: "manila philippines", kathmandu: "kathmandu nepal",
  "siem-reap": "angkor wat", seville: "seville spain", ankara: "ankara turkey",
  skopje: "skopje macedonia", kazan: "kazan kremlin", yekaterinburg: "yekaterinburg",
  gyumri: "gyumri armenia",
};

async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (res.status === 403) return "RATELIMIT";
  if (!res.ok) throw new Error(`Unsplash ${query}: ${res.status}`);
  const json = await res.json();
  return json.results?.[0] || null;
}

async function run() {
  const { data: cities, error } = await sb
    .from("cities").select("id, slug, name_ru, unsplash_url").is("unsplash_url", null);
  if (error) throw error;
  console.log(`Городов без фото: ${cities.length}`);

  for (const c of cities) {
    const q = QUERY[c.slug] || `${c.name_ru} city`;
    let pick = null;
    for (let attempt = 0; attempt < 12; attempt++) {
      const r = await fetchUnsplash(q);
      if (r === "RATELIMIT") {
        console.log(`  rate limit, ждем 5 мин (${c.slug})...`);
        await sleep(5 * 60 * 1000);
        continue;
      }
      pick = r;
      break;
    }
    if (!pick) { console.log(`✗ ${c.slug}: фото не найдено`); continue; }
    const { error: upErr } = await sb.from("cities").update({
      unsplash_photo_id: pick.id, unsplash_url: pick.urls.raw,
      unsplash_author_name: pick.user.name, unsplash_author_url: pick.user.links.html,
    }).eq("id", c.id);
    console.log(upErr ? `✗ ${c.slug}: ${upErr.message}` : `✓ ${c.slug}: ${pick.id}`);
    await sleep(2000); // мягкий троттлинг
  }
  console.log("backfill done.");
}

run().catch((e) => { console.error(e); process.exit(1); });
