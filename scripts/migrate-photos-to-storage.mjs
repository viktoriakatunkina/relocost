// ============================================================
// Перенос всех фото Unsplash в публичный Supabase Storage bucket.
// Причина: images.unsplash.com недоступен с российского VPS.
//
// Что делает:
//  1. Создаёт (или переиспользует) публичный bucket `photos`.
//  2. Собирает все уникальные base-URL Unsplash из БД:
//       cities.unsplash_url (hero), cities.gallery[].u, blog_posts.cover_url
//     + 1 хардкод-hero главной (app/page.tsx).
//  3. Скачивает каждый файл с этой машины (Unsplash тут доступен)
//     в w=1600&q=80&fm=jpg, заливает в photos/u/<hash>.jpg (дедуп по hash).
//  4. Перезаписывает cities.gallery[].u на storage-URL (n/h автора сохраняет).
//  5. Заполняет cities.image_url и blog_posts.cover_image_url
//     (если колонки есть — миграция 202606111200_local_image_urls.sql).
//     Если колонок ещё нет — пишет план в scripts/.photo-fill-plan.json
//     и сообщает, что нужно применить миграцию и перезапустить с --fill-only.
//
// Идемпотентно: повторный запуск не перекачивает уже загруженные файлы
// (upsert + локальный кэш storage-URL). Безопасно гонять несколько раз.
//
// Запуск:
//   node scripts/migrate-photos-to-storage.mjs            # полный прогон
//   node scripts/migrate-photos-to-storage.mjs --fill-only # только дозаписать колонки из плана
// ============================================================
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SUPA_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const BUCKET = "photos";
const PLAN_PATH = path.join(ROOT, "scripts", ".photo-fill-plan.json");
const FILL_ONLY = process.argv.includes("--fill-only");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (u) => (u ? u.split("?")[0] : u); // base URL без параметров
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);

// Хардкод-hero главной (app/page.tsx). Заливаем под стабильным путём.
const HOME_HERO = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e";

function storageUrl(objectPath) {
  return sb.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

async function ensureBucket() {
  const { data: existing } = await sb.storage.getBucket(BUCKET);
  if (existing) {
    if (!existing.public) {
      await sb.storage.updateBucket(BUCKET, { public: true });
      console.log(`bucket "${BUCKET}" существовал приватным → сделал публичным`);
    } else {
      console.log(`bucket "${BUCKET}" уже есть (public)`);
    }
    return;
  }
  const { error } = await sb.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "10MB",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });
  if (error) throw new Error(`createBucket: ${error.message}`);
  console.log(`bucket "${BUCKET}" создан (public)`);
}

// Скачать Unsplash-фото и залить в storage. Возвращает public storage-URL.
// Кэш: уже залитые объекты не перекачиваем (head по списку).
const uploaded = new Map(); // base -> storageUrl
const skipped = [];          // { base, reason }

async function transferOne(base) {
  if (uploaded.has(base)) return uploaded.get(base);
  const objectPath = `u/${hash(base)}.jpg`;
  const dl = `${base}?w=1600&q=80&fm=jpg&fit=max&auto=format`;
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(dl, { signal: AbortSignal.timeout(45000) });
      if (res.status === 403 || res.status === 429) {
        // лимит Unsplash CDN — подождём и повторим
        await sleep(3000 * (attempt + 1));
        lastErr = `HTTP ${res.status}`;
        continue;
      }
      if (!res.ok) { lastErr = `HTTP ${res.status}`; break; }
      const ct = res.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) { lastErr = `not an image (${ct})`; break; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1024) { lastErr = `too small (${buf.length}b)`; break; }
      const { error } = await sb.storage.from(BUCKET).upload(objectPath, buf, {
        contentType: "image/jpeg",
        cacheControl: "31536000",
        upsert: true,
      });
      if (error) { lastErr = `upload: ${error.message}`; break; }
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

async function main() {
  await ensureBucket();

  const { data: cities, error: ce } = await sb
    .from("cities")
    .select("id, slug, unsplash_url, gallery");
  if (ce) throw new Error(`cities: ${ce.message}`);
  const { data: posts, error: pe } = await sb
    .from("blog_posts")
    .select("id, slug, cover_url");
  if (pe) throw new Error(`blog_posts: ${pe.message}`);

  // --- Собираем все уникальные base-URL ---
  const bases = new Set();
  for (const c of cities) {
    if (c.unsplash_url) bases.add(norm(c.unsplash_url));
    for (const g of Array.isArray(c.gallery) ? c.gallery : []) if (g?.u) bases.add(norm(g.u));
  }
  for (const p of posts) if (p.cover_url) bases.add(norm(p.cover_url));
  bases.add(HOME_HERO);
  console.log(`\nуникальных base-URL к переносу: ${bases.size}`);

  // --- Перенос (последовательно, чтобы не ловить лимиты CDN) ---
  let done = 0;
  for (const base of bases) {
    await transferOne(base);
    done++;
    if (done % 10 === 0) console.log(`  ... ${done}/${bases.size}`);
  }
  console.log(`перенесено: ${uploaded.size}, пропущено: ${skipped.length}`);

  // --- Считаем, что куда пишем ---
  const cityUpdates = [];   // { id, image_url, gallery? }
  for (const c of cities) {
    const heroBase = norm(c.unsplash_url);
    const image_url = heroBase ? uploaded.get(heroBase) ?? null : null;
    let newGallery = null;
    const g = Array.isArray(c.gallery) ? c.gallery : null;
    if (g && g.length) {
      newGallery = g.map((ph) => {
        const local = ph?.u ? uploaded.get(norm(ph.u)) : null;
        return local ? { ...ph, u: local } : ph; // фолбэк: оставляем как есть
      });
    }
    cityUpdates.push({ id: c.id, slug: c.slug, image_url, gallery: newGallery });
  }
  const postUpdates = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    cover_image_url: p.cover_url ? uploaded.get(norm(p.cover_url)) ?? null : null,
  }));
  const homeHeroUrl = uploaded.get(HOME_HERO) ?? null;

  // Сохраняем план (на случай, если колонок ещё нет / для перезапуска --fill-only)
  fs.writeFileSync(PLAN_PATH, JSON.stringify({ cityUpdates, postUpdates, homeHeroUrl }, null, 2));
  console.log(`план записан: ${PLAN_PATH}`);
  console.log(`\nHOME HERO storage-URL: ${homeHeroUrl ?? "(не перенесён!)"}`);

  await applyPlan({ cityUpdates, postUpdates });
  reportSkips();
}

async function applyPlan({ cityUpdates, postUpdates }) {
  // 1) Галерея — всегда (это data в существующей колонке gallery)
  let galleryOk = 0;
  for (const u of cityUpdates) {
    if (!u.gallery) continue;
    const { error } = await sb.from("cities").update({ gallery: u.gallery }).eq("id", u.id);
    if (error) console.warn(`  ! gallery ${u.slug}: ${error.message}`);
    else galleryOk++;
  }
  console.log(`gallery обновлено у городов: ${galleryOk}`);

  // 2) image_url / cover_image_url — если колонки существуют
  const hasCol = await columnsExist();
  if (!hasCol.cityImage) {
    console.log("\n⚠ колонка cities.image_url ещё не создана.");
    console.log("  Применить миграцию 202606111200_local_image_urls.sql в Supabase Studio,");
    console.log("  затем: node scripts/migrate-photos-to-storage.mjs --fill-only");
    return;
  }
  let cityOk = 0;
  for (const u of cityUpdates) {
    if (!u.image_url) continue;
    const { error } = await sb.from("cities").update({ image_url: u.image_url }).eq("id", u.id);
    if (error) console.warn(`  ! image_url ${u.slug}: ${error.message}`);
    else cityOk++;
  }
  console.log(`cities.image_url проставлено: ${cityOk}`);

  if (hasCol.postCover) {
    let postOk = 0;
    for (const u of postUpdates) {
      if (!u.cover_image_url) continue;
      const { error } = await sb.from("blog_posts").update({ cover_image_url: u.cover_image_url }).eq("id", u.id);
      if (error) console.warn(`  ! cover_image_url ${u.slug}: ${error.message}`);
      else postOk++;
    }
    console.log(`blog_posts.cover_image_url проставлено: ${postOk}`);
  } else {
    console.log("⚠ колонка blog_posts.cover_image_url ещё не создана — пропуск.");
  }
}

async function columnsExist() {
  const { error: ce } = await sb.from("cities").select("image_url").limit(1);
  const { error: pe } = await sb.from("blog_posts").select("cover_image_url").limit(1);
  return { cityImage: !ce, postCover: !pe };
}

function reportSkips() {
  if (!skipped.length) { console.log("\n✓ пропусков нет — все фото перенесены."); return; }
  console.log(`\n✗ НЕ перенесено (${skipped.length}):`);
  for (const s of skipped) console.log(`  - ${s.base}  (${s.reason})`);
}

// --- Режим только дозаписи колонок из ранее сохранённого плана ---
async function fillOnly() {
  if (!fs.existsSync(PLAN_PATH)) throw new Error("нет плана — сначала запусти полный прогон");
  const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
  // восстановим uploaded-кэш не нужен: план уже содержит готовые storage-URL
  console.log(`fill-only: города ${plan.cityUpdates.length}, посты ${plan.postUpdates.length}`);
  console.log(`HOME HERO: ${plan.homeHeroUrl}`);
  await applyPlan(plan);
}

(FILL_ONLY ? fillOnly() : main()).catch((e) => {
  console.error("ОШИБКА:", e.message);
  process.exit(1);
});
