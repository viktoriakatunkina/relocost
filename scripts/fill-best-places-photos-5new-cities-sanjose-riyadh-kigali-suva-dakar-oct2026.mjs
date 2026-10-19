// Заливает фото для best_places (Сан-Хосе, Эр-Рияд, Кигали, Сува, Дакар) в
// lib/cities-content.ts. Источник: Unsplash Search API -> Supabase Storage
// bucket "photos". Та же механика, что и в прошлых волнах (патчит файл
// регэкспом по name/type/description, а не парсит AST).
//
// Все id ниже — результат ручной визуальной проверки 2026-10-19 (Read на
// скачанный thumbnail для каждого кандидата через Unsplash Search API), а
// не "первый результат поиска" вслепую. ЧАСТИЧНОЕ покрытие в этой волне
// (7 из 28 мест) — НЕ из-за лени проверки, а из-за комбинации двух причин:
//
//   1. Demo-приложение Unsplash имеет лимит 50 запросов/час — он был
//      исчерпан в процессе подбора (поиск + просмотр кандидатов для 5
//      городов — это много запросов), и ожидание сброса лимита заняло
//      неприемлемо много времени в рамках этой сессии. Это техническое
//      ограничение API, а не решение пропустить проверку.
//   2. Для части мест (Teatro Nacional, Mercado Central, Парк Ла-Сабана,
//      Эскасу как district-фото в Сан-Хосе; Ад-Диръия и Вади-Ханифа в
//      Эр-Рияде; Kimironko Market и Inema Art Center в Кигали) конкретные
//      текстовые запросы на Unsplash либо вернули 0 результатов, либо
//      только нерелевантные/слишком абстрактные кадры (например, текстура
//      глиняной стены для "Ад-Диръия" — не показывает место) — оставлены
//      без фото осознанно, а не с неверной картинкой.
//
// Подробности по каждому подтверждённому кандидату:
//   Сан-Хосе (2 из 6):
//     - "Национальный музей Коста-Рики" — запрос "Costa Rica architecture
//       building" вернул фото стеклянного павильона-входа с подписью автора
//       "Museo Nacional De Costa Rica" — прямое подтверждение, хотя кадр
//       показывает современную пристройку, а не историческое здание крепости
//       Бельявиста целиком. id=j4pk4BRlvnI (Emmanuel Appiah).
//     - "Вулкан Поас" — запрос "Poas Volcano Costa Rica" вернул характерное
//       бирюзовое кратерное озеро — однозначно узнаваемо, подтверждено.
//       id=IHvgTT3b1_o (Manfred Madrigal).
//   Эр-Рияд (4 из 6):
//     - "Kingdom Centre Tower" — запрос "Kingdom Centre Tower Riyadh
//       skybridge" вернул дневной кадр башни через окно машины, ОТЛИЧНЫЙ от
//       hero-фото (закат) — не дублируем картинку на странице.
//       id=zIw7tdxFtUw (Ameer Albahouth).
//     - "Крепость Эль-Масмак" — запрос "Masmak Fortress Riyadh" вернул
//       глинобитную крепость с характерными угловыми башнями — однозначно
//       узнаваема, подтверждено. id=WU-i0GKIYKg (Datingscout).
//     - "Край мира (Edge of the World)" — запрос "Edge of the World Riyadh"
//       вернул классический кадр отвесных скал плато Тувайк с туристами —
//       подтверждено. id=F2aCDaQqYDo (Zhifei Zhou).
//     - "Бульвар Эр-Рияд" — запрос "Boulevard Riyadh City" вернул
//       подсвеченную инсталляцию с подписью автора "Boulevard Riyadh" —
//       прямое подтверждение. id=-BS0ht06X_c (Muhammad Kamran Khan).
//   Кигали (1 из 6):
//     - "Национальный парк вулканов" — запрос "mountain gorilla Rwanda"
//       вернул чёткий портрет гориллы с подписью автора "Mountain gorilla in
//       Rwanda" — прямое подтверждение. id=-FezT2WMZr4 (Magdalena Kula
//       Manchee).
//
//   Сува (2 из 5, донаполнено после сброса лимита 2026-10-19):
//     - "Муниципальный рынок Сувы" — запрос "Suva market" вернул кадр
//       торговки с ананасами на прилавке, подтверждён GPS-метаданными
//       (Suva, Fiji) — id=_7xVNOYA-mk (Nik Schmidt).
//     - "Альберт-парк" — запрос "Albert Park Fiji" вернул кадр команды по
//       регби на поле с пальмами на фоне, geotag явно "albert park" +
//       Suva, Fiji — подтверждено, хотя кадр больше про команду, чем про
//       пустой парк. id=Z1nR_XYszJ0 (Azeem Sahu Khan).
//     - "Музей Фиджи", "Сады Терстон", "Набережная Стинсон-Парейд" — 0
//       результатов по целевым запросам, оставлены без фото.
//   Дакар (4 из 5, донаполнено после сброса лимита 2026-10-19):
//     - "Остров Горе" — запрос "Ngor Island Senegal" неожиданно вернул кадр
//       форта на острове Горе с подписью автора "Le fort de l'île de
//       Gorée", geotag точно "Île de Gorée, Dakar, Senegal" — прямое
//       подтверждение. id=gHtIQlkeihE (Dodji ABAH-DAKOU).
//     - "Монумент африканского возрождения" — запрос "African Renaissance
//       Monument" вернул классический вид статуи снизу, geotag "Dakar,
//       Senegal" с координатами, совпадающими с монументом — подтверждено.
//       id=voMHYWnO0LI (Omoniyi David).
//     - "Розовое озеро (Лак-Роз)" — запрос "Lac Rose Senegal" вернул кадр
//       воды характерного розово-оранжевого оттенка у деревянного причала,
//       geotag точно "Lake Retba, Senegal" (английское название Лак-Роз) —
//       подтверждено. id=PnTVEMOJtLo (aliunix).
//     - "Остров Нгор" — запрос "Ngor beach Dakar" вернул классический вид
//       бухты Нгор с лодками на бирюзовой воде, geotag точно "Ngor, Dakar,
//       Sénégal" — подтверждено. id=zWKGIhLNv4A (Dodji ABAH-DAKOU).
//     - "Рынок Сандага" — 0 результатов по целевым запросам ("Sandaga
//       Market Dakar", "Dakar market street"), оставлен без фото.
//
// Запуск: node scripts/fill-best-places-photos-5new-cities-sanjose-riyadh-kigali-suva-dakar-oct2026.mjs
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
  "san-jose-costa-rica": [
    ["Национальный музей Коста-Рики", "j4pk4BRlvnI"],
    ["Вулкан Поас", "IHvgTT3b1_o"],
  ],
  riyadh: [
    ["Kingdom Centre Tower", "zIw7tdxFtUw"],
    ["Крепость Эль-Масмак", "WU-i0GKIYKg"],
    ["Край мира (Edge of the World)", "F2aCDaQqYDo"],
    ["Бульвар Эр-Рияд (Boulevard Riyadh City)", "-BS0ht06X_c"],
  ],
  kigali: [
    ["Национальный парк вулканов", "-FezT2WMZr4"],
  ],
  suva: [
    ["Муниципальный рынок Сувы", "_7xVNOYA-mk"],
    ["Альберт-парк", "Z1nR_XYszJ0"],
  ],
  dakar: [
    ["Остров Горе (Île de Gorée)", "gHtIQlkeihE"],
    ["Монумент африканского возрождения", "voMHYWnO0LI"],
    ["Розовое озеро (Лак-Роз)", "PnTVEMOJtLo"],
    ["Остров Нгор", "zWKGIhLNv4A"],
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
