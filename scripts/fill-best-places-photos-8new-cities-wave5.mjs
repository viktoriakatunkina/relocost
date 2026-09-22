// Заливает фото для best_places (22-я волна: ashdod, bat-yam, burgas,
// plovdiv, zadar, chengdu, vanadzor, pavlodar) в lib/cities-content.ts.
// Источник: Unsplash Search API -> Supabase Storage bucket "photos".
// Останавливается при HTTP 403 (rate limit) и сохраняет прогресс
// инкрементально (файл переписывается после каждого успешного места).
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

const CITY_QUERIES = {
  ashdod: [
    ["Набережная Ашдода (Тайелет)", "Mediterranean promenade beach"],
    ["Крепость Ашдод-Ям", "ancient fortress ruins Mediterranean coast"],
    ["Гивъат-Йона", "hilltop viewpoint Israel coast"],
    ["Марина Ашдода", "marina yachts Israel"],
    ["Городской рынок (Шук Ашдод)", "Israel market shuk stalls"],
    ["Пляж Лидо", "sandy beach Israel"],
    ["Торгово-культурный центр «Биг Ашдод»", "shopping mall modern"],
    ["Рыбный ресторан на набережной", "seafood restaurant seaside"],
    ["Кофейня на бульваре Ротшильд", "coffee shop street Israel"],
    ["Русский книжный магазин и культурный центр", "bookstore shelves books"],
    ["Порт Ашдода (смотровая зона)", "cargo port cranes Mediterranean"],
    ["Коворкинг в центре Ашдода", "coworking office modern"],
  ],
  "bat-yam": [
    ["Набережная Бат-Яма", "Bat Yam promenade Israel"],
    ["Пляж Бат-Яма (Хоф Бат-Ям)", "Israel beach breakwater"],
    ["Площадь Вейцмана", "Mediterranean city square"],
    ["Старый Яффо", "Old Jaffa alley stone"],
    ["Рынок Бат-Яма (Шук)", "Israel street market"],
    ["Парк Яэля (Gan Yael)", "city park trees Israel"],
    ["Русский культурный центр Бат-Яма", "library reading room"],
    ["Рыбный ресторан на набережной", "seafood restaurant sunset sea"],
    ["Кофейня у площади Вейцмана", "cafe street Israel"],
    ["Комплекс высоток на набережной", "seaside high rise towers"],
    ["Марина Тель-Авива", "Tel Aviv marina yachts"],
    ["Коворкинг на границе с Тель-Авивом", "coworking space desks"],
  ],
  burgas: [
    ["Приморский парк", "Burgas sea garden park"],
    ["Остров Святой Анастасии", "small island lighthouse Black Sea"],
    ["Созополь", "Sozopol old town Bulgaria"],
    ["Солнечный Берег", "Sunny Beach Bulgaria resort"],
    ["Пешеходная улица Александровска", "pedestrian street Bulgaria"],
    ["Озеро Бургас (Вая)", "lake pelicans Bulgaria"],
    ["Этнографический музей Бургаса", "ethnographic museum building"],
    ["Рынок «Пазара»", "Bulgaria market stalls"],
    ["Часовая башня Бургаса", "clock tower Bulgaria"],
    ["Ресторан морской кухни в порту", "seafood restaurant port"],
    ["Кофейня на Александровской", "cafe street Bulgaria"],
    ["Коворкинг в центре Бургаса", "coworking office space"],
  ],
  plovdiv: [
    ["Античный театр Пловдива", "Plovdiv Roman amphitheater"],
    ["Квартал Капана", "Kapana Plovdiv creative district"],
    ["Старый город на трех холмах", "Plovdiv old town houses"],
    ["Джумая-джамия", "old mosque Balkans"],
    ["Холм Небет-тепе", "hilltop fortress ruins Balkans"],
    ["Пешеходная улица Князь Александр I", "pedestrian street Plovdiv"],
    ["Центральный крытый рынок", "covered market Bulgaria"],
    ["Ресторан болгарской кухни в Капане", "restaurant courtyard outdoor dining"],
    ["Кофейня на площади Джумаята", "cafe old town square Europe"],
    ["Римский стадион", "Roman stadium ruins"],
    ["Парк «Царь Симеонова градина»", "city park fountain Bulgaria"],
    ["Коворкинг в Капане", "coworking creative space"],
  ],
  zadar: [
    ["Морской орган", "Zadar sea organ"],
    ["Приветствие солнцу", "Zadar sun salutation sunset"],
    ["Форум и церковь Святого Доната", "Zadar Roman forum church"],
    ["Кафедральный собор Святой Анастасии", "cathedral Croatia"],
    ["Городские стены и ворота Задара", "Venetian city walls Croatia"],
    ["Национальный парк Крка", "Krka waterfalls Croatia"],
    ["Рынок Задара (Zeleni trg)", "green market Croatia"],
    ["Ресторан далматинской кухни в Старом городе", "Dalmatian restaurant seafood"],
    ["Кофейня на набережной у Морского органа", "cafe seaside Croatia"],
    ["Остров Углян", "Adriatic island olive groves"],
    ["Парк-лес Ражине", "pine forest park coast"],
    ["Коворкинг в Задаре", "coworking space Croatia"],
  ],
  chengdu: [
    ["Научная база разведения панд Чэнду", "Chengdu panda base"],
    ["Улица Цзиньли", "Chinese street lanterns old town"],
    ["Храм Уhouci (Храм маркиза У)", "Wuhou Shrine Chengdu temple"],
    ["Народная площадь и парк Тяньфу", "Chengdu Tianfu square"],
    ["Улица Куаньчжай Сянцзы", "Kuanzhai Alley Chengdu"],
    ["Гора Цинчэншань", "Qingcheng mountain Taoist temple"],
    ["Оросительная система Дуцзянъянь", "ancient irrigation canal China"],
    ["Ночной рынок Цзиньцзян", "China night market street food"],
    ["Ресторан хого (сычуаньский хот-пот)", "hotpot restaurant China"],
    ["Чайный дом в парке Хэминь", "Chinese teahouse park bamboo chairs"],
    ["Панорама Tianfu Software Park", "modern tech park China skyline"],
    ["Коворкинг в Гаосинь", "coworking office desks modern"],
  ],
  vanadzor: [
    ["Площадь Согласия", "town square Armenia Soviet architecture"],
    ["Кафедральный собор Сурб Григор Лусаворич", "Armenian church cathedral"],
    ["Ванадзорский краеведческий музей", "museum building Armenia"],
    ["Городской парк Ванадзора", "city park Armenia trees"],
    ["Ущелье Дебед", "Debed canyon Armenia monastery"],
    ["Дилижан", "Dilijan Armenia forest town"],
    ["Центральный рынок Ванадзора", "Armenia market stalls"],
    ["Ресторан армянской кухни в центре", "Armenian restaurant traditional food"],
    ["Кофейня у площади Согласия", "cafe street Armenia"],
    ["Река Памбак и набережная", "river embankment mountain town"],
    ["Драматический театр имени Ов. Абеляна", "theater building facade classic"],
    ["Коворкинг в центре Ванадзора", "coworking small office"],
  ],
  pavlodar: [
    ["Набережная Иртыша", "Irtysh river embankment Kazakhstan"],
    ["Дом-музей Павла Васильева", "writer museum house Kazakhstan"],
    ["Мечеть Машхур Жусупа", "mosque Kazakhstan"],
    ["Благовещенский собор", "Orthodox cathedral Kazakhstan"],
    ["Городской парк культуры и отдыха", "city park Kazakhstan"],
    ["Баянаульский национальный парк", "Bayanaul national park rocks lake"],
    ["Центральный рынок Павлодара", "Kazakhstan market stalls"],
    ["Ресторан казахской и русской кухни в центре", "Kazakh cuisine restaurant"],
    ["Кофейня в центре города", "cafe street Kazakhstan"],
    ["Областной художественный музей", "art museum gallery"],
    ["Мост через Иртыш", "cable bridge river Kazakhstan"],
    ["Коворкинг в центре Павлодара", "small coworking office"],
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
