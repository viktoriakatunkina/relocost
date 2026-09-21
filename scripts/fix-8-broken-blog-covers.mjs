// Чинит 8 битых обложек блога (HTTP 400 NoSuchKey в Supabase Storage) —
// найдены фото-аудитом. Метод — как в fix-priority-covers-batch5.mjs.
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

const ENTRIES = [
  ["vnzh-cherez-uchebu-za-rubezhom-2026", "university campus students Europe"],
  ["vnzh-kanady-express-entry-2026", "Toronto Canada skyline"],
  ["zhizn-v-velikobritanii-dlya-rossiyan-2026", "London United Kingdom skyline"],
  ["zhizn-v-kanade-dlya-rossiyan-2026", "Toronto Canada skyline"],
  ["polsha-dlya-rossiyan-karta-polyaka-2026", "Warsaw Poland old town"],
  ["pereezd-v-germaniyu-sinyaya-karta-2026", "Berlin Germany city"],
  ["izrail-dlya-rossiyan-aliya-vnzh-2026", "Tel Aviv Israel skyline"],
  ["zhizn-v-meksike-mehiko-gvadalahara-2026", "Mexico City skyline"],
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

async function uploadToStorage(slug, rawUrl) {
  const imgRes = await fetch(rawUrl + "&w=1200&q=80&fm=jpg");
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const hash = createHash("md5").update(slug).digest("hex").slice(0, 12);
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
  for (const [slug, query] of ENTRIES) {
    try {
      const photo = await fetchPhoto(query);
      if (!photo) { console.log(`~ ${slug}: нет результата для "${query}"`); failed++; continue; }
      const cover_url = await uploadToStorage(slug, photo.rawUrl);
      const { error } = await sb
        .from("blog_posts")
        .update({
          cover_url,
          cover_author_name: photo.authorName,
          cover_author_url: photo.authorUrl,
          cover_unsplash_id: photo.id,
        })
        .eq("slug", slug);
      if (error) { console.error(`✗ ${slug}: update failed — ${error.message}`); failed++; continue; }
      console.log(`✓ ${slug} -> "${query}" (${photo.authorName}) -> ${cover_url}`);
      ok++;
      await sleep(400);
    } catch (e) {
      if (e.message === "RATE_LIMIT") {
        console.error(`\n✗ RATE LIMIT на ${slug}. Останавливаюсь.`);
        break;
      }
      console.error(`✗ ${slug}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\nГотово. ok=${ok} failed=${failed}`);
}

run();
