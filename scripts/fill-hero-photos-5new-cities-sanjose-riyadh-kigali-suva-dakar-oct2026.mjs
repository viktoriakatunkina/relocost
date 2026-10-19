// Заливает hero-фото (cities.unsplash_url) для 5 новых городов этой волны
// (Сан-Хосе, Эр-Рияд, Кигали, Сува, Дакар). Источник: Unsplash Search API ->
// Supabase Storage bucket "photos" (та же конвенция, что и у остальных
// городов в БД). Все кандидаты прошли визуальную проверку 2026-10-19 перед
// заливкой (Read на скачанный thumbnail для каждого кандидата) — ниже
// выбраны ТОЛЬКО подтверждённые конкретные id фотографий, а не повторный
// автопоиск по тексту запроса.
//
//   - Сан-Хосе: запрос "San Jose Costa Rica city" вернул аэрофото города на
//     рассвете с горами на фоне, подпись автора "Aerial views of San José,
//     Costa Rica in the morning" — прямое подтверждение, id=lcdcYymRrVo
//     (César Badilla Miranda).
//   - Эр-Рияд: запрос "Riyadh skyline Kingdom Tower" вернул культовую башню
//     Kingdom Centre на фоне розового заката, подпись автора "The Kingdom
//     Centre skyscraper against a vibrant pink and orange sky in Riyadh" —
//     однозначно узнаваемый символ города, id=f5ZB0LHwi0s (Hala AlGhanim).
//   - Кигали: запрос "Kigali Rwanda city hills" вернул вид на район
//     Ньямирамбо сверху — холмы с красными крышами, подпись автора "A view
//     of Nyamirambo neighborhood of Kigali..." — прямое подтверждение,
//     id=K15V22xU1zs (Protais Benjamin MUGENZI).
//   - Сува: Unsplash отдаёт очень мало результатов конкретно по Суве (в
//     отличие от курортного запада Фиджи). Среди немногих кандидатов выбран
//     снимок исторической часовой башни — подтверждён GPS-метаданными фото
//     (location: Suva, Fiji, -18.140505/178.423251 — совпадает с
//     координатами города в БД), id=3TjW-lqB1OQ (Vijesh Datt). Ночной кадр
//     менее эффектен, чем дневные hero-фото других городов, но это
//     единственный геопривязанный и однозначно узнаваемый кандидат —
//     решено не использовать неподтверждённые пляжные фото общего Фиджи
//     (могли быть сняты где угодно на архипелаге, не обязательно в Суве).
//   - Дакар: запрос "Dakar Senegal city" вернул вид на крыши города с
//     силуэтом монумента Африканского возрождения на фоне, подпись автора
//     "Rooftop view of Dakar and the African Renaissance Monument, the
//     tallest statue in Africa" — подтверждён GPS-метаданными (14.716677/
//     -17.467686, совпадает с координатами города в БД), id=rVUskjd0WRk
//     (Sweder Breet).
//
// Запуск: node scripts/fill-hero-photos-5new-cities-sanjose-riyadh-kigali-suva-dakar-oct2026.mjs
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
  { slug: "san-jose-costa-rica", photoId: "lcdcYymRrVo" },
  { slug: "riyadh", photoId: "f5ZB0LHwi0s" },
  { slug: "kigali", photoId: "K15V22xU1zs" },
  { slug: "suva", photoId: "3TjW-lqB1OQ" },
  { slug: "dakar", photoId: "rVUskjd0WRk" },
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
