// Заливает фото для best_places (Сан-Сальвадор, Белиз-Сити) в
// lib/cities-content.ts. Источник: Unsplash Search API -> Supabase Storage
// bucket "photos". Та же механика, что и в прошлых волнах (патчит файл
// регэкспом по name/type/description, а не парсит AST).
//
// Все id ниже — результат ручной визуальной проверки 2026-10-19 (Read на
// скачанный thumbnail для каждого кандидата через Unsplash Search API), а
// не "первый результат поиска" вслепую. ЧАСТИЧНОЕ покрытие в этой волне
// (5 из 12 мест) — часть целевых запросов (Собор Сан-Сальвадора, Хойя-де-
// Серен, Форт-Джордж/маяк барона Блисса, Музей Белиза, Swing Bridge,
// барьерный риф конкретно у Белиз-Сити) либо дали 0 релевантных
// результатов на Unsplash, либо только нерелевантные/слишком абстрактные
// кадры (например, подводные фото водорослей для "барьерный риф" — не
// показывают узнаваемо именно риф) — оставлены без фото осознанно, лучше
// без фото, чем с неверной картинкой.
//
// Подробности по каждому подтвержденному кандидату:
//   Сан-Сальвадор (3 из 6):
//     - "Вулкан Сан-Сальвадор (Эль-Бокерон)" — запрос "El Boqueron volcano
//       San Salvador" вернул фото таблички на входе в национальный парк
//       («EL BOQUERÓN / PARQUE NACIONAL») — не живописный вид на кратер, но
//       однозначно узнаваемое подтверждение места. id=fPhUYIV1KZs (Meg von
//       Haartman).
//     - "Национальный дворец" — запрос "Palacio Nacional San Salvador"
//       вернул ночной снимок фасада с читаемой надписью "PALACIO NACIONAL"
//       на портике — прямое подтверждение. id=u44OXgFXLxs (Luis Rodriguez).
//     - "Исторический центр (Centro Histórico)" — запрос "San Salvador El
//       Salvador city" вернул памятник с ангелом на фоне купольного храма,
//       подпись автора "Centro Histórico de El Salvador" — подтверждение
//       локации (конкретное здание на фото не идентифицировано с полной
//       уверенностью, поэтому фото привязано к общему месту "исторический
//       центр", а не к конкретному названному собору). id=L3B_KCP58OQ
//       (Esaú Fuentes González).
//     - "Собор Сан-Сальвадора" — 0 релевантных результатов по целевому
//       запросу, оставлен без фото (не привязываем неподтвержденное фото
//       купольного храма выше к этому конкретному собору).
//     - "Хойя-де-Серен" — 0 результатов, оставлен без фото.
//   Белиз-Сити (2 из 6):
//     - "Алтун-Ха (руины майя)" — запрос "Altun Ha Belize" вернул серию фото
//       одной и той же ступенчатой пирамиды в джунглях (та же серия снимков
//       всплыла и по запросу "Belize City" с общими подписями вида "gray
//       concrete tomb/building" — явно один и тот же травел-сет снимков по
//       Белизу) — силуэт однозначно соответствует главному храму Алтун-Ха
//       (тот самый, что на этикетке пива Belikin). id=kfxua-2ay64 (Alisa
//       Matthews).
//     - "Исторический центр / Альберт-стрит" — запрос "Belize City" вернул
//       уличную сцену с подписью "Downtown street in Belize City" — прямое
//       подтверждение. id=MwXtLXvQZvA (Meritt Thomas).
//     - "Форт-Джордж и маяк барона Блисса", "Музей Белиза", "Разводной мост
//       Swing Bridge", "Барьерный риф Белиза" — целевые запросы дали 0
//       релевантных результатов (риф — только абстрактные подводные снимки
//       водорослей без узнаваемых примет места), оставлены без фото.
//
// Запуск: node scripts/fill-best-places-photos-2new-cities-sansalvador-belizecity-oct2026.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const H = os.homedir();
const dot = (n) => fs.readFileSync(path.join(H, ".relocost", n), "utf8").trim();
const SUPA_URL = dot("supabase_url");
const sb = createClient(SUPA_URL, dot("supabase_service_role_key"), { auth: { persistSession: false } });
const UNSPLASH = dot("unsplash_access_key");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "..", "lib", "cities-content.ts");

// Проверенные вручную конкретные id фотографий (см. комментарий выше) —
// НЕ текстовый запрос, чтобы избежать повторного автопоиска непроверенного
// результата при повторном запуске скрипта.
const CITY_PHOTOS = {
  "san-salvador": [
    ["Вулкан Сан-Сальвадор (Эль-Бокерон)", "fPhUYIV1KZs"],
    ["Национальный дворец", "u44OXgFXLxs"],
    ["Исторический центр (Centro Histórico)", "L3B_KCP58OQ"],
  ],
  "belize-city": [
    ["Алтун-Ха (руины майя)", "kfxua-2ay64"],
    ["Исторический центр / Альберт-стрит", "MwXtLXvQZvA"],
  ],
};

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
  return { rawUrl: p.urls.raw, authorName: p.user.name, id: p.id };
}

async function uploadToStorage(key, rawUrl) {
  const imgRes = await fetch(rawUrl + "&w=1200&q=80&fm=jpg");
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

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setImageUrlInFile(slug, placeName, url) {
  let text = fs.readFileSync(FILE, "utf8");
  let cityIdx = text.indexOf(`\n  ${slug}: {`);
  if (cityIdx === -1) cityIdx = text.indexOf(`\n  "${slug}": {`);
  if (cityIdx === -1) throw new Error(`city marker not found: ${slug}`);
  const bpMarker = "\n    best_places: [";
  const bpIdx = text.indexOf(bpMarker, cityIdx);
  if (bpIdx === -1) throw new Error(`best_places not found: ${slug}`);
  const closeIdx = text.indexOf("\n    ],", bpIdx);
  if (closeIdx === -1) throw new Error(`best_places close not found: ${slug}`);

  const before = text.slice(0, bpIdx);
  const block = text.slice(bpIdx, closeIdx);
  const after = text.slice(closeIdx);

  const nameEsc = escapeRegex(placeName);
  const re = new RegExp(`(\\{ name: "${nameEsc}", type: "[a-z]+", description: "(?:[^"\\\\]|\\\\.)*")( \\},)`);
  if (!re.test(block)) {
    throw new Error(`line not found for place "${placeName}" in ${slug}`);
  }
  const newBlock = block.replace(re, `$1, image_url: "${url}"$2`);

  fs.writeFileSync(FILE, before + newBlock + after, "utf8");
}

function alreadyHasImage(slug, placeName) {
  const text = fs.readFileSync(FILE, "utf8");
  let cityIdx = text.indexOf(`\n  ${slug}: {`);
  if (cityIdx === -1) cityIdx = text.indexOf(`\n  "${slug}": {`);
  if (cityIdx === -1) return false;
  const bpIdx = text.indexOf("\n    best_places: [", cityIdx);
  if (bpIdx === -1) return false;
  const closeIdx = text.indexOf("\n    ],", bpIdx);
  if (closeIdx === -1) return false;
  const block = text.slice(bpIdx, closeIdx);
  const nameEsc = escapeRegex(placeName);
  const re = new RegExp(`\\{ name: "${nameEsc}", type: "[a-z]+", description: "(?:[^"\\\\]|\\\\.)*", image_url:`);
  return re.test(block);
}

async function run() {
  let ok = 0;
  let failed = 0;

  outer:
  for (const [slug, places] of Object.entries(CITY_PHOTOS)) {
    for (const [name, photoId] of places) {
      if (alreadyHasImage(slug, name)) { console.log(`~ ${slug} / ${name}: уже есть фото, пропуск`); continue; }
      try {
        const photo = await fetchPhotoById(photoId);
        const url = await uploadToStorage(`${slug}::${name}`, photo.rawUrl);
        setImageUrlInFile(slug, name, url);
        console.log(`✓ ${slug} / ${name} -> id=${photoId} (${photo.authorName})`);
        ok++;
        await sleep(300);
      } catch (e) {
        if (e.message === "RATE_LIMIT") {
          console.error(`\n✗ RATE LIMIT достигнут на ${slug} / ${name}. Останавливаюсь.`);
          break outer;
        }
        console.error(`✗ ${slug} / ${name}: ${e.message}`);
        failed++;
      }
    }
  }

  console.log(`\nГотово (до лимита или до конца списка). ok=${ok} failed=${failed}`);
}

run();
