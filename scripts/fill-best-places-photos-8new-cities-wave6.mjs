// Заливает фото для best_places (23-я волна: didim, hua-hin, phan-thiet,
// kandy, atyrau, ruse, pula, faro) в lib/cities-content.ts.
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
  didim: [
    ["Храм Аполлона", "Didim Apollo temple columns"],
    ["Античный Милет", "Miletus ancient theater Turkey"],
    ["Пляж Алтынкум", "Altinkum beach Turkey"],
    ["Акбюк", "Akbuk Turkey coast"],
    ["Воскресный базар Дидима", "Turkey bazaar market stalls"],
    ["Марина Дидим", "Didim marina yachts"],
    ["Рыбный ресторан на набережной Алтынкума", "seafood restaurant Turkey coast"],
    ["Кафе у Храма Аполлона", "cafe ancient ruins Turkey"],
    ["Русский магазин и пекарня в Ешилькёй", "bakery shop shelves bread"],
    ["Пляж Тузбургазы", "wild sandy beach Turkey"],
    ["Коворкинг в Алтынкуме", "coworking space desks"],
    ["Бухта Кучукада", "quiet cove Aegean sea"],
  ],
  "hua-hin": [
    ["Ночной рынок Чатчай", "Chatchai night market Thailand"],
    ["Пляж Хуахина", "Hua Hin beach Thailand"],
    ["Летний дворец Клай Кангвон", "royal palace Thailand coast"],
    ["Кхао Такиаб (Гора обезьян)", "Khao Takiab monkey mountain Thailand"],
    ["Гольф-клуб Black Mountain", "golf course Thailand mountains"],
    ["Cicada Market", "Cicada Market Hua Hin"],
    ["Ресторан морепродуктов на пирсе Хуахина", "seafood restaurant pier Thailand"],
    ["Кафе на Хуахин-Сой-51", "cafe alley Thailand"],
    ["Санторини Парк", "Santorini Park Hua Hin Thailand"],
    ["Национальный парк Кхао Сам Рой Йот", "Khao Sam Roi Yot national park cave"],
    ["Коворкинг в центре Хуахина", "coworking office Thailand"],
    ["Храм Ват Хуахин", "Buddhist temple Thailand"],
  ],
  "phan-thiet": [
    ["Красные песчаные дюны", "red sand dunes Mui Ne Vietnam"],
    ["Белые песчаные дюны", "white sand dunes Vietnam desert"],
    ["Ручей Фей (Suoi Tien)", "Fairy Stream Mui Ne Vietnam"],
    ["Рыбацкая деревня Муйне", "Mui Ne fishing village boats"],
    ["Башня По Шанин", "Cham tower Vietnam Po Shanu"],
    ["Маяк Ке Га", "Ke Ga lighthouse Vietnam"],
    ["Русская улица в Муйне", "Mui Ne street shops Vietnam"],
    ["Рыбный ресторан на набережной Фантхьета", "seafood restaurant Vietnam coast"],
    ["Кафе для кайтсерферов в Хам Тьене", "beach cafe kitesurf Vietnam"],
    ["Ночной рынок Фантхьета", "Vietnam night market street food"],
    ["Коворкинг для кайтсерферов в Муйне", "coworking beach office"],
    ["Кайт-станция на пляже Муйне", "kitesurfing beach Vietnam"],
  ],
  kandy: [
    ["Храм Далада Малигава", "Temple of the Tooth Kandy Sri Lanka"],
    ["Озеро Канди", "Kandy lake Sri Lanka"],
    ["Ботанический сад Перадения", "Peradeniya botanical garden Sri Lanka"],
    ["Статуя Будды Багамбара", "Bahirawakanda Buddha statue Kandy"],
    ["Культурный центр танца Канди", "Kandyan dance performance Sri Lanka"],
    ["Центральный рынок Канди", "Kandy market spices Sri Lanka"],
    ["Ресторан шри-ланкийской кухни у озера", "Sri Lankan restaurant rice curry"],
    ["Кофейня для цифровых кочевников", "coffee shop laptop Sri Lanka"],
    ["Слоновий питомник в Пиннавеле", "Pinnawala elephant orphanage Sri Lanka"],
    ["Университет Перадении", "Peradeniya university campus Sri Lanka"],
    ["Коворкинг в центре Канди", "coworking space Sri Lanka"],
    ["Чайная плантация и фабрика у Канди", "Sri Lanka tea plantation hills"],
  ],
  atyrau: [
    ["Мост Европа-Азия", "Europe Asia bridge Atyrau Kazakhstan"],
    ["Набережная реки Урал", "Ural river embankment Kazakhstan"],
    ["Мечеть Имангали", "mosque Kazakhstan turquoise domes"],
    ["Центральный парк культуры и отдыха", "city park Kazakhstan"],
    ["Атырауский областной музей", "regional museum building Kazakhstan"],
    ["Центральный рынок Атырау", "Kazakhstan market fish stalls"],
    ["Ресторан казахской и русской кухни в центре", "Kazakh cuisine restaurant"],
    ["Кофейня в бизнес-центре", "cafe office building modern"],
    ["Драмтеатр им. Махамбета Утемисова", "theater building facade Kazakhstan"],
    ["Микрорайон Нурсая", "modern residential complex Kazakhstan"],
    ["Коворкинг для нефтегазовых специалистов", "coworking office desks modern"],
    ["Каспийское побережье у Атырау", "Caspian sea coast steppe"],
  ],
  ruse: [
    ["Площадь Свободы", "Ruse Freedom Square Bulgaria"],
    ["Мост Дружбы через Дунай", "Danube bridge Bulgaria Romania"],
    ["Доходный дом (Съдебна палата)", "neoclassical building Bulgaria courthouse"],
    ["Драматический театр Русе", "theater building Bulgaria facade"],
    ["Парк на набережной Дуная", "Danube river park Bulgaria"],
    ["Центральный рынок Русе", "Bulgaria market stalls"],
    ["Ресторан болгарской кухни в центре", "Bulgarian restaurant traditional food"],
    ["Кафе на пешеходной улице Александровска", "pedestrian street cafe Bulgaria"],
    ["Панорама на набережной", "Danube riverside sunset view"],
    ["Региональный исторический музей", "history museum building Bulgaria"],
    ["Коворкинг в центре Русе", "coworking office space"],
    ["Квартал застройки эпохи модерна", "art nouveau architecture facade Europe"],
  ],
  pula: [
    ["Амфитеатр Пулы (Арена)", "Pula Arena Roman amphitheater Croatia"],
    ["Храм Августа", "Temple of Augustus Pula Croatia"],
    ["Триумфальная арка Сергиев", "Arch of the Sergii Pula Croatia"],
    ["Пляж Верудела", "Verudela beach Pula Croatia"],
    ["Крытый рынок Пулы", "covered market Croatia Art Nouveau"],
    ["Ресторан истрийской кухни в Старом городе", "Istrian restaurant truffle pasta"],
    ["Кафе на набережной у порта", "harbor cafe Croatia fishing boats"],
    ["Марина Веруда", "Veruda marina Croatia yachts"],
    ["Национальный парк Бриони", "Brijuni islands national park Croatia"],
    ["Коворкинг в центре Пулы", "coworking space Croatia"],
    ["Крепость Кастель", "Venetian fortress Pula Croatia hill"],
    ["Улица Сергиеваца", "old town pedestrian street Croatia"],
  ],
  faro: [
    ["Сидаде-Велья (Старый город)", "Faro old town walls Portugal"],
    ["Кафедральный собор Фару", "Faro cathedral Portugal"],
    ["Лагуна Риа-Формоза", "Ria Formosa lagoon Portugal flamingos"],
    ["Прая-де-Фару", "Praia de Faro beach island Portugal"],
    ["Часовня из костей (Capela dos Ossos)", "Capela dos Ossos bone chapel Portugal"],
    ["Муниципальный рынок Фару", "Faro market Portugal fish"],
    ["Ресторан морепродуктов в порту", "seafood restaurant Portugal harbor"],
    ["Кафе в Старом городе", "cafe old town Portugal terrace"],
    ["Университет Алгарве", "university campus Portugal Algarve"],
    ["Мыс Понта-да-Пьедаде", "Ponta da Piedade cliffs Portugal"],
    ["Коворкинг в Фару", "coworking office Portugal"],
    ["Марина Фару", "Faro marina Portugal boats"],
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
