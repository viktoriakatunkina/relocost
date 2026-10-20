// Заливает фото для best_places (Гавана, Манагуа, Виндхук) в
// lib/cities-content.ts. Источник: Unsplash Search API -> Supabase Storage
// bucket "photos". Та же механика, что и в прошлых волнах (патчит файл
// регэкспом по name/type/description, а не парсит AST).
//
// ⚠️ НЕ ЗАПУСКАЛСЯ в рамках сессии 2026-10-20 — проект Supabase встал на
// паузу в середине сессии (см. комментарий-БЛОКЕР в
// seed-3-new-cities-havana-managua-windhoek-oct2026.mjs). Unsplash Search
// API при этом доступен — ниже уже только подтвержденные конкретные id
// фотографий после ручной визуальной проверки (Read на скачанный thumbnail
// для каждого кандидата), не текстовый запрос. Запускать ПОСЛЕ
// разблокировки Supabase, третьим шагом (после seed- и fill-hero-скриптов).
//
// ЧАСТИЧНОЕ покрытие в этой волне (10 из 18 мест) — часть целевых запросов
// дали 0 релевантных результатов на Unsplash (особенно у Манагуа — город
// слабо покрыт стоковыми фото), оставлены без фото осознанно, лучше без
// фото, чем с неверной картинкой.
//
// Подробности по каждому подтвержденному кандидату:
//   Гавана (5 из 6):
//     - "Малекон" — запрос "Malecon Havana" вернул чёрно-белый кадр людей,
//       сидящих на набережной на закате, со скайлайном Ведадо на заднем
//       плане — подпись автора "Cubans sitting on the famous Malecon of
//       Havana, Cuba, enjoying the moment" — прямое подтверждение.
//       id=mSoOUiaO8yo (Federico Espinosa).
//     - "Пласа-де-Армас (Старая Гавана)" — запрос "Plaza Vieja Havana"
//       вернул табличку на стене с читаемыми надписями "OBISPO" и "PLAZA
//       DE ARMAS" рядом с историческим фонарём — однозначное текстовое
//       подтверждение конкретной площади. id=fkTl958Rf3A (Meg von
//       Haartman).
//     - "Капитолио" — запрос "Castillo del Morro Havana" (общий поиск по
//       скайлайну) вернул вид на крыши Гаваны с узнаваемым куполом
//       Капитолия на горизонте — автор пишет, что с трудом удалось снять
//       город с дрона, вид как раз на Капитолио и окрестные районы.
//       id=mb_nHhMc1XM (Eric Ward).
//     - "Крепость Эль-Морро" — запрос "Castillo del Morro Havana" вернул
//       снимок старых пушек на фоне крепостной стены с подписью на
//       испанском "Cañones del castillo del Morro, en La Habana" — прямое
//       подтверждение. id=QuoZ3UacBcs (Ricardo IV Tamayo).
//     - "Мирамар / Пятая авенида" — запрос "Miramar Havana" вернул вид на
//       церковь с высокой белой колокольней у побережья среди зелени
//       района — подпись автора "Views from Miramar" — подтверждение
//       локации (конкретная церковь не идентифицирована с полной
//       уверенностью, фото привязано к общему месту "район Мирамар", а не
//       к названному храму). id=p71Swk0XRd4 (Alejandro Morgado).
//     - "Fábrica de Arte Cubano (FAC)" — 0 релевантных результатов,
//       оставлен без фото.
//   Манагуа (2 из 6):
//     - "Старый кафедральный собор (Catedral Vieja de Santiago)" — запрос
//       "Managua Nicaragua city" вернул фронтальный снимок собора с
//       двумя колокольнями — узнаваемый характерный силуэт здания.
//       id=7QTcww0kAVs (Oswaldo Flores Jiménez).
//     - "Пуэрто-Сальвадор-Альенде" — запрос "Managua Nicaragua city"
//       вернул снимок бирюзового бассейна с прогулочными катамаранами и
//       лебедем-педальным транспортом — характерная локация набережной на
//       берегу озера Манагуа. id=vJ_eJC0VW0M (Kohi).
//     - "Площадь Революции", "Лома-де-Тискапа", "Новый кафедральный
//       собор", "Вулкан и рынок Масая" — целевые запросы дали 0
//       релевантных результатов (Манагуа и Никарагуа в целом слабо
//       покрыты стоковыми фото на Unsplash), оставлены без фото.
//   Виндхук (3 из 6):
//     - "Церковь Христа (Christuskirche)" — запрос "Windhoek Namibia city"
//       вернул чёткий кадр снизу на песчаниковую церковь с характерным
//       красным куполом-шпилем — однозначно узнаваемый силуэт самого
//       известного здания города. id=ibu9zUnkLFw (Ndumiso).
//     - "Мемориальный музей Независимости" — запрос "Independence
//       Memorial Museum Windhoek" вернул кадр снизу на изогнутую башню с
//       золотисто-бежевой облицовкой — силуэт соответствует известной
//       архитектуре музея (башня, облицованная золотистой плиткой).
//       id=bbel28WGOvQ (Grant Durr).
//     - "Центр города (проспект Индепенденс)" — запрос "Post Street Mall
//       Windhoek" вернул утренний снимок пустой широкой улицы с деревьями
//       и многоэтажными зданиями по бокам — подпись автора "Early
//       Mornings", характерная локация центрального проспекта.
//       id=LWWcRB7WCJQ (Cornelius C. Campbell).
//     - "Замок Хайнитцбург", "Национальный ботанический сад Намибии",
//       "Заповедник Дан-Вильон" — целевые запросы дали 0 релевантных
//       результатов, оставлены без фото.
//
// Запуск: node scripts/fill-best-places-photos-3new-cities-havana-managua-windhoek-oct2026.mjs
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
  havana: [
    ["Малекон", "mSoOUiaO8yo"],
    ["Пласа-де-Армас (Старая Гавана)", "fkTl958Rf3A"],
    ["Капитолио", "mb_nHhMc1XM"],
    ["Крепость Эль-Морро (Castillo de los Tres Reyes del Morro)", "QuoZ3UacBcs"],
    ["Мирамар / Пятая авенида", "p71Swk0XRd4"],
  ],
  managua: [
    ["Старый кафедральный собор (Catedral Vieja de Santiago)", "7QTcww0kAVs"],
    ["Пуэрто-Сальвадор-Альенде", "vJ_eJC0VW0M"],
  ],
  windhoek: [
    ["Церковь Христа (Christuskirche)", "ibu9zUnkLFw"],
    ["Мемориальный музей Независимости", "bbel28WGOvQ"],
    ["Центр города (проспект Индепенденс)", "LWWcRB7WCJQ"],
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
