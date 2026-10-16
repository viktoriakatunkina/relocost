// Заливает фото для best_places (Кито, Санто-Доминго, Сараево) в
// lib/cities-content.ts. Источник: Unsplash Search API -> Supabase Storage
// bucket "photos". Та же механика, что и в прошлых волнах (патчит файл
// регэкспом по name/type/description, а не парсит AST) — скрипт нужно
// запускать ПОСЛЕ того, как best_places для этих трёх городов добавлены в
// lib/cities-content.ts без поля image_url.
//
// Все id ниже — результат ручной визуальной проверки 2026-10-16 (Read на
// скачанный файл для каждого кандидата), а не "первый результат поиска"
// вслепую. Решения по каждому городу:
//
//   Кито (4 из 6 best_places с фото, 2 без):
//     - "Ла Компания де Хесус" (церковь) — запрос "Plaza Grande Quito" на
//       самом деле вернул фасад именно этой церкви (Пласа-Гранде выглядит
//       иначе — классический беленый колониальный ансамбль), результат
//       честно переименован под то, что видно на фото, а не оставлен под
//       неверным названием.
//     - "Эль-Панесильо" — запрос "El Panecillo Virgin of Quito statue"
//       подтверждён: статуя крылатой Девы Марии с цепью, однозначно
//       узнаваема.
//     - "Ла-Ронда" — запрос "La Ronda street Quito historic" вернул фото с
//       подписью автора "An afternoon in the Historical Center of Quito,
//       Ecuador" — подтверждено.
//     - "Парк Ла-Каролина" — запрос "Quito city park lake skyline" вернул
//       парк с озером и фонтаном и городскими высотками на фоне,
//       соответствует известному виду парка; умеренная, но разумная
//       уверенность (не 100% геопривязка, честно отражено здесь).
//     - "Митад-дель-Мундо" и "Эль-Панесильо"(дубль через другой запрос) —
//       НЕ подтверждены (вернули холм с другой статуей без привязки к
//       экватору либо каменный крест в чистом поле) — оставлены без фото.
//
//   Санто-Доминго (3 из 6 best_places с фото, 3 без):
//     - "Catedral Primada de América" — запрос "Alcazar de Colon Santo
//       Domingo" на самом деле вернул фасад именно кафедрального собора
//       (с колокольней) — переименовано под то, что видно на фото.
//     - "Alcázar de Colón" — запрос той же серии вернул каменное колониальное
//       здание на углу улицы Зона-Колониаль, похожее на крепостные стены
//       Алькасара, с подписью автора "Colonial architecture" (Ruddy
//       Corporan, доминиканский автор) — принято с разумной уверенностью.
//     - "Пунта-Кана" — запрос "Punta Cana beach" вернул аэрофото
//       тропического пляжа с лагуной, типичного для курортной зоны,
//       использовано как иллюстративное (без 100% геопривязки конкретного
//       пляжа — честно отражено здесь).
//     - "Малекон", "Мercado Modelo": запросы либо не дали результатов
//       вообще (Calle El Conde, Parque Colon, Piantini, Mercado Modelo —
//       0 совпадений или откровенно не то место), либо вернули ДРУГОЙ
//       город — по запросу "Calle El Conde colonial zone" Unsplash дважды
//       подряд вернул Буэнос-Айрес (вывеска "shawarma de la República
//       Argentina" в кадре) и Лиму (перуанский флаг, Паласио-Тагле) — оба
//       результата отбракованы, оставлены без фото.
//
//   Сараево (4 из 6 best_places с фото, 2 без):
//     - "Себиль" — запрос "Bascarsija Sarajevo old bazaar" (второй
//       результат) — деревянный фонтан-киоск с минаретом мечети Гази
//       Хусрев-бега на фоне, однозначно узнаваем, подтверждено.
//     - "Вечница" — запрос "Sarajevo City Hall Vijecnica" (второй
//       результат) — маврская архитектура ратуши крупным планом с вывеской
//       "#Sarajevo", однозначно подтверждено.
//     - "Латинский мост" — запрос "Latin Bridge Sarajevo" — каменный мост
//       через реку Миляцка с историческими зданиями на фоне, соответствует
//       известным фото моста, подтверждено с разумной уверенностью.
//     - "Олимпийская бобслейная трасса" — запрос "Sarajevo abandoned bobsled
//       track Olympic" — заброшенная трасса с граффити в лесу на
//       Требевиче, однозначно узнаваема и широко задокументирована,
//       подтверждено.
//     - "Себиль"(через запрос "Sebilj fountain Sarajevo") и "Требевич
//       (канатная дорога)" — НЕ нашли результатов у Unsplash вообще
//       (0 совпадений) — оставлены без фото.
//
// Запуск: node scripts/fill-best-places-photos-3new-cities-quito-santodomingo-sarajevo-oct2026.mjs
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
  quito: [
    ["La Compañía de Jesús", "QsKPijY4Ap4"],
    ["Эль-Панесильо", "5gB40MPqHDw"],
    ["Ла-Ронда", "Myft9WRt830"],
    ["Парк Ла-Каролина", "Qo7Fi_-v9D8"],
  ],
  "santo-domingo": [
    ["Catedral Primada de América", "3cYfl1kXucE"],
    ["Alcázar de Colón", "1zYWq3rdi8Y"],
    ["Пунта-Кана", "9DAalxJGXww"],
  ],
  sarajevo: [
    ["Себиль", "OT8bxxMA3j0"],
    ["Вечница", "o9LSHybaCpc"],
    ["Латинский мост", "C6Hjg2SpGgM"],
    ["Олимпийская бобслейная трасса на Требевиче", "9B6Ip-KYA2U"],
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
