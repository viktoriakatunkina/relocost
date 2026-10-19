// Заливает фото для best_places (Панама-Сити, Ла-Пас, Окленд) в
// lib/cities-content.ts. Источник: Unsplash Search API -> Supabase Storage
// bucket "photos". Та же механика, что и в прошлых волнах (патчит файл
// регэкспом по name/type/description, а не парсит AST) — скрипт нужно
// запускать ПОСЛЕ того, как best_places для этих трёх городов добавлены в
// lib/cities-content.ts без поля image_url.
//
// Все id ниже — результат ручной визуальной проверки 2026-10-19 (Read на
// скачанный файл для каждого кандидата), а не "первый результат поиска"
// вслепую. Решения по каждому городу:
//
//   Панама-Сити (6 из 6 best_places с фото):
//     - "Каско-Вьехо" — запрос "Casco Viejo Panama colonial street" вернул
//       известную инсталляцию подвешенных шляп на улице исторического
//       квартала (цвета панамского флага) — однозначно узнаваемо,
//       подтверждено.
//     - "Панамский канал / шлюзы Мирафлорес" — запрос "Panama Canal
//       Miraflores Locks" вернул контейнеровоз в шлюзе с подписью автора
//       "Miraflores Locks - Panama Canal" — прямое подтверждение.
//     - "Биомузей (Biomuseo)" — запрос "Biomuseo Panama" вернул аэрофото
//       здания с характерной разноцветной нерегулярной крышей авторства
//       Фрэнка Гери на дамбе Амадор — подтверждено.
//     - "Дамба Амадор" — запрос "Amador Causeway Panama" вернул набережную
//       с пальмами вдоль залива с подписью автора "Amador Causeway in
//       Panama City, Panama" — подтверждено с разумной уверенностью.
//     - "Синта-Костера" — запрос "Casco Viejo Panama City" вернул аэрофото
//       прибрежной набережной с парком и небоскрёбами делового центра на
//       фоне — подтверждено.
//     - "Пунта-Пасифика" — запрос "Panama City downtown skyscrapers bay"
//       вернул аэрофото плотной застройки небоскрёбов на берегу бирюзовой
//       воды — подтверждено.
//
//   Ла-Пас (3 из 6 best_places с фото, 3 без):
//     - "Mi Teleférico" — запрос "Mi Teleferico La Paz cable car" вернул
//       фото кабины канатной дороги над городом в каньоне — подтверждено.
//     - "Долина Луны (Valle de la Luna)" — запрос "Moon Valley rock
//       formations La Paz" вернул характерные эрозионные глиняные башни с
//       кактусами на переднем плане — визуально соответствует известным
//       фото Valle de la Luna, подтверждено с разумной уверенностью (точной
//       геопривязки в подписи автора нет).
//     - "Базилика Сан-Франсиско" — запрос "San Francisco church La Paz
//       Bolivia" вернул фото колокольни с подписью автора "Iglesia de San
//       Francisco" — прямое подтверждение.
//     - "Гора Ильимани над городом" — тот же кадр (id=j4KLR4F-Tfg), что
//       использован как hero-фото города (см. fill-hero-photos-...) —
//       сознательно НЕ продублирован здесь как отдельное фото best_places,
//       чтобы не показывать пользователю одну и ту же картинку дважды на
//       одной странице; место остаётся без отдельного фото.
//     - "Ведьмин рынок" и "Площадь Мурильо" — целевые запросы ("Mercado de
//       las Brujas La Paz", "Plaza Murillo La Paz", "Calle Jaen La Paz") не
//       дали результатов у Unsplash вообще (0 совпадений) — оставлены без
//       фото, а не с неверной картинкой.
//
//   Окленд (6 из 6 best_places с фото):
//     - "Скай Тауэр" — запрос "Sky Tower Auckland night" вернул кадр башни
//       снизу вверх на фоне звёздного неба — однозначно узнаваема,
//       подтверждено.
//     - "Харбор-Бридж" — запрос "Auckland Harbour Bridge" вернул мост с
//       новозеландским флагом на тросах и яхтой под ним — подтверждено.
//     - "Маунт-Иден" — запрос "Mount Eden crater Auckland" вернул фото с
//       подписью автора "Mount Eden, Auckland, New Zealand" — зелёный
//       кратер со Sky Tower на фоне скайлайна — прямое подтверждение.
//     - "Вайадак-Харбор" — запрос "Viaduct Harbour Auckland" вернул
//       результат с подписью автора "Viaduct Harbour, Auckland" — марина с
//       яхтами и небоскрёбами делового центра — прямое подтверждение.
//     - "Куин-стрит" — запрос "Queen Street Auckland" вернул единственный
//       результат с подписью автора "Queen Street, Auckland" — пешеходная
//       улица с двухэтажными автобусами — прямое подтверждение.
//     - "Остров Рангитото" — запрос "Rangitoto Island" вернул вид на
//       симметричный вулканический конус острова через залив с подписью
//       автора "Rangitoto Island from the top of Mount Victoria" — прямое
//       подтверждение.
//
// Запуск: node scripts/fill-best-places-photos-3new-cities-panama-lapaz-auckland-oct2026.mjs
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
  "panama-city": [
    ["Каско-Вьехо", "uEK4vTQlIdM"],
    ["Панамский канал / шлюзы Мирафлорес", "qeltMhQIw3w"],
    ["Биомузей (Biomuseo)", "NTKcBPshz5E"],
    ["Дамба Амадор (Amador Causeway)", "v1Hl1UUhQow"],
    ["Синта-Костера", "JBjd0IBIAl8"],
    ["Пунта-Пасифика", "dblC1jCOtgE"],
  ],
  "la-paz": [
    ["Mi Teleférico", "_1lH4_mi8zI"],
    ["Долина Луны (Valle de la Luna)", "BusO6k99yv0"],
    ["Базилика Сан-Франсиско", "mezs7z2By3o"],
  ],
  auckland: [
    ["Скай Тауэр", "xkQ7qeMLLZ8"],
    ["Харбор-Бридж", "UDjkqIs2TZ8"],
    ["Маунт-Иден", "Us9wqa6GRw8"],
    ["Вайадак-Харбор", "tGi5sU6_i_4"],
    ["Куин-стрит", "6e9ZiDL7ayA"],
    ["Остров Рангитото", "jGhxb1g7IxM"],
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
