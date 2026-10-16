// Заливает hero-фото (cities.unsplash_url) для 3 новых городов этой волны
// (Кито, Санто-Доминго, Сараево). Источник: Unsplash Search API -> Supabase
// Storage bucket "photos" (та же конвенция, что и у остальных городов в БД).
// Все кандидаты прошли визуальную проверку 2026-10-16 перед заливкой (Read
// на скачанный файл) — ниже выбраны ТОЛЬКО подтверждённые конкретные id
// фотографий, а не повторный автопоиск по тексту запроса, чтобы повторный
// запуск не мог случайно залить другой, непроверенный результат.
//
//   - Кито: запрос "Quito Ecuador historic center skyline" вернул несколько
//     кандидатов, среди них явный исторический центр Кито (колокольня и
//     купола базилики на фоне Анд) — визуально подтверждено, фото
//     id=UztdOwzVTY4 (Andres Medina).
//   - Санто-Доминго: простые запросы вида "Santo Domingo skyline" не дали
//     результатов вообще (0 совпадений у Unsplash), сработал только прямой
//     запрос "Santo Domingo" — первый результат с подписью автора на
//     испанском "Vista aerea de alcazar de colon, Zona Colonial, Republica
//     Dominicana" (аэрофото форта Осама/Алькасар-де-Колон в Зона-Колониаль)
//     — явный честный match, фото id=WTF0QbzEXpA (Venero Encarnación
//     Martínez). ВАЖНО: запрос "Santo Domingo cathedral" вернул собор в
//     Санто-Доминго-де-ла-Кальсада — город-тёзка в Испании, не тот город —
//     результат отбракован, не используется нигде на странице.
//   - Сараево: первый запрос "Sarajevo skyline" вернул закат над полем с
//     тюками сена без единого признака города — явно не то, отбраковано.
//     Второй запрос "Sarajevo old town Bascarsija" вернул подтверждённый
//     результат — площадь Баш-чаршия с фонтаном Себиль, минаретом мечети
//     Гази Хусрев-бега и горами на фоне, фото id=ZVwP01HBOwU (ADEV).
//
// Запуск: node scripts/fill-hero-photos-3new-cities-quito-santodomingo-sarajevo-oct2026.mjs
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
  { slug: "quito", photoId: "UztdOwzVTY4" },
  { slug: "santo-domingo", photoId: "WTF0QbzEXpA" },
  { slug: "sarajevo", photoId: "ZVwP01HBOwU" },
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
