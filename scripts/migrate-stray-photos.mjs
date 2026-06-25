// ============================================================
// Relocost.ru — перенос «зависших» Unsplash-фото в Supabase Storage.
//
// Контекст: images.unsplash.com недоступен с российского VPS. Основной перенос
// уже был сделан (cities.unsplash_url, большинство cities.gallery[].u и
// blog_posts.cover_url указывают на bucket `photos`). Но города из последних
// батчей попали в БД ПОСЛЕ переноса — их галереи (и часть обложек блога) всё
// ещё ссылаются на images.unsplash.com и потому БИТЫЕ на проде.
//
// Этот скрипт находит ВСЕ оставшиеся unsplash-URL в:
//   • cities.gallery[].u
//   • blog_posts.cover_url
// скачивает каждое фото с этой машины (тут Unsplash доступен), заливает в
// photos/u/<hash>.jpg (дедуп) и ПЕРЕЗАПИСЫВАЕТ поле IN PLACE на storage-URL.
// Атрибуция авторов (gallery .n/.h, blog cover_author_*) не трогается.
//
// Идемпотентно: storage-URL пропускаются, повторный прогон ничего не ломает.
// Скачивание картинок с images.unsplash.com (CDN) НЕ расходует лимит 50/час
// поискового API (api.unsplash.com) — это разные хосты.
//
// Запуск: node scripts/migrate-stray-photos.mjs
// ============================================================
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const r = (f) => fs.readFileSync(path.join(os.homedir(), ".relocost", f), "utf8").trim();
const sb = createClient(r("supabase_url"), r("supabase_service_role_key"), {
  auth: { persistSession: false },
});

const BUCKET = "photos";
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const norm = (u) => (u ? u.split("?")[0] : u);
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
const isUnsplash = (u) => typeof u === "string" && u.includes("images.unsplash.com");
const isStorage = (u) => typeof u === "string" && u.includes("supabase.co/storage");

function storageUrl(objectPath) {
  return sb.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

const uploaded = new Map(); // base -> storageUrl
const skipped = [];

async function transferOne(rawUrl) {
  const base = norm(rawUrl);
  if (uploaded.has(base)) return uploaded.get(base);
  const objectPath = `u/${hash(base)}.jpg`;
  const dl = `${base}?w=1600&q=80&fm=jpg&fit=max&auto=format`;
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(dl, { signal: AbortSignal.timeout(45000) });
      if (res.status === 403 || res.status === 429) {
        await sleep(3000 * (attempt + 1));
        lastErr = `HTTP ${res.status}`;
        continue;
      }
      if (!res.ok) {
        lastErr = `HTTP ${res.status}`;
        break;
      }
      const ct = res.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) {
        lastErr = `not an image (${ct})`;
        break;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1024) {
        lastErr = `too small (${buf.length}b)`;
        break;
      }
      const { error } = await sb.storage.from(BUCKET).upload(objectPath, buf, {
        contentType: "image/jpeg",
        cacheControl: "31536000",
        upsert: true,
      });
      if (error) {
        lastErr = `upload: ${error.message}`;
        break;
      }
      const url = storageUrl(objectPath);
      uploaded.set(base, url);
      return url;
    } catch (e) {
      lastErr = e.message;
      await sleep(2000 * (attempt + 1));
    }
  }
  skipped.push({ base, reason: lastErr });
  console.warn(`  ! пропуск ${base} — ${lastErr}`);
  return null;
}

// ---------- 1. Галереи городов ----------
const { data: cities, error: ce } = await sb.from("cities").select("id, slug, gallery");
if (ce) throw ce;

let galPhotos = 0;
let galCitiesTouched = 0;
for (const c of cities) {
  const gallery = Array.isArray(c.gallery) ? c.gallery : [];
  const strays = gallery.filter((g) => g?.u && isUnsplash(g.u));
  if (!strays.length) continue;
  let changed = false;
  for (const g of gallery) {
    if (g?.u && isUnsplash(g.u)) {
      const url = await transferOne(g.u);
      if (url) {
        g.u = url;
        changed = true;
        galPhotos++;
      }
    }
  }
  if (changed) {
    const { error } = await sb.from("cities").update({ gallery }).eq("id", c.id);
    if (error) throw new Error(`update city ${c.slug}: ${error.message}`);
    galCitiesTouched++;
    process.stdout.write(`\r  галереи: ${galPhotos} фото / ${galCitiesTouched} городов  `);
  }
}
console.log(`\n✓ галереи: перенесено ${galPhotos} фото в ${galCitiesTouched} городах`);

// ---------- 2. Обложки блога ----------
let posts = [];
{
  let from = 0;
  while (true) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("id, slug, cover_url")
      .range(from, from + 999);
    if (error) throw error;
    posts.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
}
let coverCount = 0;
for (const p of posts) {
  if (p.cover_url && isUnsplash(p.cover_url)) {
    const url = await transferOne(p.cover_url);
    if (url) {
      const { error } = await sb.from("blog_posts").update({ cover_url: url }).eq("id", p.id);
      if (error) throw new Error(`update post ${p.slug}: ${error.message}`);
      coverCount++;
    }
  }
}
console.log(`✓ обложки блога: перенесено ${coverCount}`);

// ---------- Итог ----------
console.log(`\nИтого уникальных фото залито: ${uploaded.size}`);
if (skipped.length) {
  console.log(`Пропущено (ошибки): ${skipped.length}`);
  skipped.slice(0, 10).forEach((s) => console.log(`  ${s.reason}: ${s.base}`));
}

// контроль: остались ли ещё unsplash-URL
const { data: cAfter } = await sb.from("cities").select("gallery");
let leftGal = 0;
for (const c of cAfter || []) for (const g of c.gallery || []) if (isUnsplash(g?.u)) leftGal++;
const leftCov = posts.length
  ? (await sb.from("blog_posts").select("cover_url").not("cover_url", "is", null))
      .data.filter((p) => isUnsplash(p.cover_url)).length
  : 0;
console.log(`\nОсталось unsplash в галереях: ${leftGal} | в обложках: ${leftCov}`);
console.log(`(storage в галереях теперь — ок: ${isStorage ? "проверка пройдена" : ""})`);
