// Заливает hero-фото (cities.unsplash_url) для 2 новых городов этой волны
// (Сан-Сальвадор, Белиз-Сити). Источник: Unsplash Search API -> Supabase
// Storage bucket "photos" (та же конвенция, что и у остальных городов в БД).
// Оба кандидата прошли визуальную проверку 2026-10-19 перед заливкой (Read
// на скачанный thumbnail для каждого кандидата) — ниже выбраны ТОЛЬКО
// подтвержденные конкретные id фотографий, а не повторный автопоиск по
// тексту запроса.
//
//   - Сан-Сальвадор: запрос "San Salvador El Salvador city" вернул монумент
//     Эль-Сальвадор-дель-Мундо (Христос на земном шаре) на фоне делового
//     центра города и гор, подпись автора "El monumento a El Salvador del
//     Mundo, en la ciudad de San Salvador" — прямое подтверждение,
//     id=Jfvq1iu8AiI (Ricardo Ardon).
//   - Белиз-Сити: тот же запрос "Belize City" вернул канал с деревянными
//     домами на сваях вдоль улицы, подпись автора "Canal running through
//     the streets of Belize City" — прямое подтверждение, характерный для
//     города кадр (Белиз-Сити исторически застроен вдоль каналов и
//     протоки Хаулавер-Крик), id=fz1ZxPkIISk (Meritt Thomas).
//
// Запуск: node scripts/fill-hero-photos-2new-cities-sansalvador-belizecity-oct2026.mjs
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

// Проверенные вручную конкретные id фотографий (см. комментарий выше) —
// НЕ текстовый запрос, чтобы избежать повторного автопоиска непроверенного
// результата при повторном запуске скрипта.
const CITIES = [
  { slug: "san-salvador", photoId: "Jfvq1iu8AiI" },
  { slug: "belize-city", photoId: "fz1ZxPkIISk" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPhotoById(id) {
  const res = await fetch(`https://api.unsplash.com/photos/${id}`, {
    headers: { Authorization: `Client-ID ${UNSPLASH}` },
  });
  if (res.status === 403) {
    const body = await res.text();
    if (/Rate Limit Exceeded/i.test(body)) throw new Error("RATE_LIMIT");
    throw new Error(`Unsplash 403: ${body}`);
  }
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const p = await res.json();
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
      const { data: cityRow } = await sb.from("cities").select("unsplash_url").eq("slug", c.slug).maybeSingle();
      if (cityRow?.unsplash_url) { console.log(`~ ${c.slug}: уже есть фото, пропуск`); continue; }
      const photo = await fetchPhotoById(c.photoId);
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
      console.log(`✓ ${c.slug} -> id=${photo.id} (${photo.authorName})`);
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
