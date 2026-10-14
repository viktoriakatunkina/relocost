// Заливает фото для best_places (Улан-Батор, Занзибар) в
// lib/cities-content.ts. Источник: Unsplash Search API -> Supabase Storage
// bucket "photos". Та же механика, что и в прошлых волнах (патчит файл
// регэкспом по name/type/description, а не парсит AST).
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import { createHash } from "node:crypto";

const H = os.homedir();
const SUPA_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const FILE = "/Users/viktoriadimark/Desktop/Работа/Клод/relocost/lib/cities-content.ts";

// Статус после двух проходов 2026-10-14 (упирались в лимит Unsplash
// 50 запросов/час и 2 неверных по смыслу результата, снятые после
// визуальной проверки — см. комментарии в lib/cities-content.ts):
//   ulaanbaatar — готово: "Площадь Сухэ-Батора" (верно), "Монастырь
//     Гандантэгчинлэн" (верно), "Национальный парк Богд-Хан-Уул" (общее
//     фото природы, не конкретно подтверждено). Осталось дозалить: "Мемориал
//     Зайсан" (запрос "Zaisan Memorial Ulaanbaatar hill" ошибочно вернул
//     память/башню в Ашхабаде — нужен другой запрос), "Чёрный рынок
//     (Нараантуул)" (результатов не было), "Национальный музей Монголии"
//     (результатов не было).
//   zanzibar — готово: "Стоун-Таун" (верно), "Остров Призон" (верно,
//     черепаха), "Пляж Нунгви" (общее фото доу на закате, не конкретно
//     подтверждено). Осталось дозалить: "Дом чудес (House of Wonders)"
//     (запрос "House of Wonders Zanzibar palace" ошибочно вернул дворец
//     Чоумахалла в Хайдарабаде, Индия — нужен другой запрос), "Дом-музей
//     Фредди Меркьюри" (результатов не было), "Рынок Дараджани" (результатов
//     не было).
// Список ниже оставлен как есть (alreadyHasImage() пропускает уже залитые
// по имени места) — при повторном запуске для 5 оставшихся позиций стоит
// сначала вручную подобрать более точные запросы через
// api.unsplash.com/search/photos и проверить превью, а не доверять первому
// результату вслепую.
const CITY_QUERIES = {
  ulaanbaatar: [
    ["Площадь Сухэ-Батора (Чингисхана)", "Sukhbaatar Square Ulaanbaatar Genghis Khan statue"],
    ["Монастырь Гандантэгчинлэн", "Gandantegchinlen monastery Ulaanbaatar Buddhist"],
    ["Мемориал Зайсан", "Zaisan Memorial Mongolia Soviet monument"],
    ["Чёрный рынок (Нараантуул)", "outdoor market stalls tents people browsing goods"],
    ["Национальный музей Монголии", "museum exhibition hall artifacts gallery"],
    ["Национальный парк Богд-Хан-Уул", "Bogd Khan mountain Mongolia nature"],
  ],
  zanzibar: [
    ["Стоун-Таун (Каменный город)", "Stone Town Zanzibar narrow streets doors"],
    ["Дом чудес (House of Wonders)", "Beit al-Ajaib Stone Town clock tower"],
    ["Дом-музей Фредди Меркьюри", "Zanzibar carved wooden door building"],
    ["Остров Призон (Чангуу)", "Prison Island Zanzibar tortoise"],
    ["Рынок Дараджани", "outdoor market stalls fresh fruits vegetables"],
    ["Пляж Нунгви", "Nungwi beach Zanzibar sunset"],
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPhoto(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (res.status === 403) {
    const body = await res.text();
    if (/Rate Limit Exceeded/i.test(body)) throw new Error("RATE_LIMIT");
    throw new Error(`Unsplash 403: ${body}`);
  }
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
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
  for (const [slug, places] of Object.entries(CITY_QUERIES)) {
    for (const [name, query] of places) {
      if (alreadyHasImage(slug, name)) continue;
      try {
        const photo = await fetchPhoto(query);
        if (!photo) {
          console.log(`~ ${slug} / ${name}: нет результата для "${query}"`);
          failed++;
          continue;
        }
        const url = await uploadToStorage(`${slug}::${name}`, photo.rawUrl);
        setImageUrlInFile(slug, name, url);
        console.log(`✓ ${slug} / ${name} -> "${query}" (${photo.authorName})`);
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
