// Добавляет обложки статьям без cover_url по ключевым словам из slug.
// Загружает в Supabase Storage (не raw Unsplash CDN — не доступен с VPS).
// Запуск: node scripts/fill-covers-by-slug.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import crypto from "node:crypto";

const H = os.homedir();
const SB_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SB_URL, KEY, { auth: { persistSession: false } });

const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Маппинг slug → поисковый запрос для Unsplash
function queryFromSlug(slug) {
  const s = slug.toLowerCase();
  if (s.includes("bangkok") || s.includes("tailand") || s.includes("thai")) return "bangkok thailand city street";
  if (s.includes("berlin") || s.includes("germany") || s.includes("nemets")) return "berlin germany architecture";
  if (s.includes("barselona") || s.includes("ispaniy")) return "barcelona spain architecture";
  if (s.includes("lisabon") || s.includes("lissabon") || s.includes("portugal")) return "lisbon portugal tram";
  if (s.includes("kipr") || s.includes("limassol") || s.includes("limasol")) return "limassol cyprus sea";
  if (s.includes("dubai") || s.includes("oae")) return "dubai skyline architecture";
  if (s.includes("serbiy") || s.includes("belgrad")) return "belgrade serbia city";
  if (s.includes("chernogori") || s.includes("budva")) return "budva montenegro sea coast";
  if (s.includes("horvatiy") || s.includes("zagreb")) return "croatia adriatic coast";
  if (s.includes("vengriy") || s.includes("budapesht")) return "budapest hungary parliament";
  if (s.includes("yaponiy") || s.includes("tokyo")) return "tokyo japan street city";
  if (s.includes("koshk") || s.includes("cat")) return "cat cozy home travel";
  if (s.includes("sobak") || s.includes("dog")) return "dog outdoor travel";
  if (s.includes("pensioner") || s.includes("pension")) return "senior couple travel retirement";
  if (s.includes("rebenk") || s.includes("deti") || s.includes("semya")) return "family children travel";
  if (s.includes("student")) return "student university europe";
  if (s.includes("frilanser") || s.includes("freelance") || s.includes("udalenk")) return "freelancer laptop coffee coworking";
  if (s.includes("budget") || s.includes("byudzhet") || s.includes("stoimost")) return "budget travel planning finance";
  if (s.includes("viza") || s.includes("vnzh") || s.includes("dokument")) return "passport visa documents travel";
  if (s.includes("dengi") || s.includes("bank") || s.includes("perevesti")) return "bank cards finance money transfer";
  if (s.includes("meditsina") || s.includes("vrach") || s.includes("zdorov")) return "doctor hospital healthcare";
  if (s.includes("zima") || s.includes("winter")) return "winter cozy city snow";
  if (s.includes("kvartir") || s.includes("arend")) return "apartment interior cozy living";
  if (s.includes("mehiko") || s.includes("meksik")) return "mexico city architecture colourful";
  if (s.includes("sinagpur") || s.includes("singapur")) return "singapore skyline city";
  if (s.includes("krasnod")) return "krasnodar russia park city";
  if (s.includes("udalenn") || s.includes("remote")) return "remote work laptop home office";
  if (s.includes("top") || s.includes("luchsh") || s.includes("stran")) return "world map travel destinations";
  return "travel relocation city lifestyle";
}

// Получаем статьи без обложки
const { data: posts } = await sb
  .from("blog_posts")
  .select("id, slug, cover_url")
  .is("cover_url", null)
  .eq("published", true);

console.log(`Статей без обложки: ${posts.length}`);

let done = 0, skipped = 0;

for (const post of posts) {
  const query = queryFromSlug(post.slug);

  // 1. Ищем фото через Unsplash API
  let photo = null;
  try {
    const u = new URL("https://api.unsplash.com/search/photos");
    u.searchParams.set("query", query);
    u.searchParams.set("per_page", "3");
    u.searchParams.set("orientation", "landscape");
    const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` }, signal: AbortSignal.timeout(15000) });
    if (res.status === 429 || res.status === 403) {
      console.warn(`  ! Rate limit Unsplash — остановка (${done} готово)`);
      break;
    }
    if (!res.ok) { console.warn(`  ! Unsplash ${res.status} для ${post.slug}`); skipped++; continue; }
    const json = await res.json();
    photo = json.results?.[0];
  } catch (e) {
    console.warn(`  ! fetch error ${post.slug}: ${e.message}`);
    skipped++;
    continue;
  }

  if (!photo) { console.log(`  ~ ${post.slug}: нет фото для запроса "${query}"`); skipped++; continue; }

  // 2. Скачиваем и заливаем в Storage
  const rawUrl = photo.urls.raw + "?w=1600&q=80&fm=jpg&fit=max&auto=format";
  const objectPath = `u/${hash(photo.urls.raw)}.jpg`;
  let storageUrl;
  try {
    const imgRes = await fetch(rawUrl, { signal: AbortSignal.timeout(30000) });
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const { error: upErr } = await sb.storage.from("photos").upload(objectPath, buf, {
      contentType: "image/jpeg", cacheControl: "31536000", upsert: true,
    });
    if (upErr) throw new Error(upErr.message);
    storageUrl = sb.storage.from("photos").getPublicUrl(objectPath).data.publicUrl;
  } catch (e) {
    console.warn(`  ! upload error ${post.slug}: ${e.message}`);
    skipped++;
    continue;
  }

  // 3. Сохраняем в базу
  const { error: updErr } = await sb.from("blog_posts").update({
    cover_url: storageUrl,
    cover_author_name: photo.user.name || null,
    cover_author_url: photo.user.links?.html || null,
  }).eq("id", post.id);

  if (updErr) { console.error(`  ✗ update ${post.slug}: ${updErr.message}`); skipped++; continue; }

  done++;
  console.log(`✓ ${post.slug} → ${query}`);
  await sleep(1200); // 1.2 сек между запросами (API лимит ~50/час)
}

console.log(`\nГотово: обложки добавлены ${done}, пропущено ${skipped} из ${posts.length}`);
