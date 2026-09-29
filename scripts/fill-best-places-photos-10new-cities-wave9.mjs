// Заливает фото для best_places (девятая волна: bansko, sunny-beach, chania,
// kos, cascais, brno, rijeka, ulcinj, cetinje, weligama) в lib/cities-content.ts.
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
  bansko: [
    ["Канатная дорога Банско (Gondola)", "Bansko cable car gondola mountain"],
    ["Трасса Тодорка", "ski slope mountain snow Bulgaria"],
    ["Старый город Банско", "Bansko old town stone houses"],
    ["Церковь Святой Троицы", "orthodox church bell tower Bulgaria"],
    ["Национальный парк Пирин", "Pirin national park glacier lake"],
    ["Минеральные бани Банско", "outdoor thermal pool mountains"],
    ["Улица Пирин (пешеходная)", "ski resort street bars apres-ski"],
    ["Механа традиционной болгарской кухни", "traditional tavern wooden interior food"],
    ["Кофейня с видом на Пирин", "cafe terrace mountain view"],
    ["Коворкинг в центре Банско", "coworking space desks"],
    ["Прокат горнолыжного снаряжения", "ski rental shop equipment"],
    ["Разлог — соседний город", "Bulgarian mountain village houses"],
  ],
  "sunny-beach": [
    ["Пляж Солнечного берега", "Sunny Beach Bulgaria sand beach"],
    ["Аквапарк Action", "water park slides"],
    ["Старый город Несебра", "Nessebar old town Bulgaria church"],
    ["Набережная курорта", "beach resort promenade bars"],
    ["Парк динозавров Солнечного берега", "dinosaur theme park"],
    ["Марина Порт Несебр", "marina yachts seaside restaurants"],
    ["Пляжный бар на набережной", "beach bar sunset cocktails"],
    ["Ресторан болгарской кухни в Равде", "seafood restaurant village"],
    ["Рынок сувениров и курортных товаров", "souvenir market resort street"],
    ["Коворкинг в Бургасе (30 минут)", "coworking space office"],
    ["Термальный комплекс Поморие (рядом)", "thermal spa mud therapy"],
    ["Развлекательный комплекс Sunny Beach Central", "nightclub entertainment complex lights"],
  ],
  chania: [
    ["Старая венецианская гавань", "Chania old venetian harbor Crete"],
    ["Маяк Ханьи", "Chania lighthouse Crete"],
    ["Крытый рынок Ханьи (Агора)", "covered market Crete produce"],
    ["Пляж Элафониси", "Elafonissi beach Crete"],
    ["Ущелье Самарья", "Samaria Gorge Crete mountains"],
    ["Старый город Ханьи", "Chania old town narrow streets"],
    ["Таверна на набережной гавани", "Greek taverna harbor sunset"],
    ["Кофейня в Халепе", "quiet garden cafe terrace"],
    ["Пляж Неа Хора", "Nea Chora beach Crete"],
    ["Коворкинг в центре Ханьи", "coworking space Greece"],
    ["Археологический музей Ханьи", "archaeological museum artifacts"],
    ["Монастырь Агия Триада", "Agia Triada monastery Crete"],
  ],
  kos: [
    ["Крепость Нератзия", "Neratzia castle Kos Greece"],
    ["Платан Гиппократа", "ancient plane tree Kos"],
    ["Античный Асклепион", "Asklepion ancient ruins Kos"],
    ["Пляж Тигаки", "Tigaki beach Kos windsurfing"],
    ["Пляж Парадайз (Каменья)", "turquoise beach Greek island"],
    ["Порт Коса", "Kos town harbor Greece"],
    ["Таверна у порта", "Greek taverna sunset seaside"],
    ["Кофейня на набережной Псалиди", "cafe seaside terrace calm"],
    ["Рынок Коса", "Greek island market olives honey"],
    ["Горная деревня Зия", "Greek mountain village sunset"],
    ["Термальный источник Эмброс Терме", "hot spring beach Greece"],
    ["Коворкинг в центре Коса", "small coworking office"],
  ],
  cascais: [
    ["Набережная Кашкайша", "Cascais promenade Portugal ocean"],
    ["Цитадель Кашкайша", "Cascais citadel fortress Portugal"],
    ["Пляж Прайя-да-Рибейра", "Cascais beach Portugal"],
    ["Бока-ду-Инферну (Адова пасть)", "Boca do Inferno cliffs Portugal"],
    ["Парк Марешал Кармона", "city park peacocks Portugal"],
    ["Пляж Гишу", "Guincho beach surfing Portugal"],
    ["Рынок Кашкайша (Mercado da Vila)", "covered market seafood Portugal"],
    ["Ресторан морепродуктов на набережной", "seafood restaurant ocean view"],
    ["Кофейня в историческом центре", "pastel de nata cafe Portugal"],
    ["Марина Кашкайша", "marina yachts Portugal"],
    ["Коворкинг в центре Кашкайша", "coworking space modern"],
    ["Эшторил и казино", "Estoril Portugal seafront"],
  ],
  brno: [
    ["Площадь Свободы", "Brno square Czech Republic buildings"],
    ["Собор Святых Петра и Павла", "Brno cathedral gothic spires"],
    ["Крепость Шпилберк", "Spilberk castle Czech Republic"],
    ["Villa Tugendhat", "modernist villa architecture"],
    ["Овощной рынок (Zelný trh)", "vegetable market square Czech"],
    ["Пивная в стиле чешского паба", "Czech pub beer interior"],
    ["Кофейня в Старе Место", "coffee shop historic interior Europe"],
    ["Технопарк CEITEC", "modern research lab building"],
    ["Лесопарк и плотина Брно", "Brno dam reservoir forest"],
    ["Зоопарк Брно", "zoo hillside panoramic"],
    ["Августинское аббатство (место открытия законов Менделя)", "old European monastery garden"],
    ["Коворкинг в центре Брно", "coworking space desks"],
  ],
  rijeka: [
    ["Корзо", "Rijeka Korzo pedestrian street Croatia"],
    ["Собор Святого Вита", "baroque round church Croatia"],
    ["Замок Трсат", "Trsat castle Rijeka hill"],
    ["Городская башня (Gradski toranj)", "city tower clock Croatia"],
    ["Морской и исторический музей Хорватского Приморья", "maritime museum Rijeka"],
    ["Пляж Пеhине", "Rijeka beach promenade Croatia"],
    ["Рынок Риеки (Placa)", "Rijeka market hall Croatia"],
    ["Таверна морской кухни на набережной", "seafood restaurant harbor Croatia"],
    ["Кофейня на Корзо", "cafe terrace pedestrian street"],
    ["Коворкинг в центре Риеки", "coworking space office"],
    ["Парк на горе Учка", "Ucka mountain park view"],
    ["Остров Црес (паром)", "Cres island Croatia"],
  ],
  ulcinj: [
    ["Старый город Улциня", "Ulcinj old town fortress Montenegro"],
    ["Велика-Плажа", "long sand beach Montenegro"],
    ["Ада-Бояна", "Ada Bojana river delta kitesurfing"],
    ["Мала-Плажа", "small pebble beach Montenegro town"],
    ["Дворец Балшича", "medieval palace Montenegro"],
    ["Скадарское озеро (рядом)", "Skadar lake birds boat"],
    ["Рыбный ресторан старого города", "seafood restaurant fortress view"],
    ["Кайт-станция на Ада-Бояне", "kitesurfing beach Montenegro"],
    ["Пляжный бар на Велика-Плажа", "beach bar sunset Adriatic"],
    ["Рынок Улциня", "local market vegetables Balkans"],
    ["Мечеть Паши", "historic mosque old town"],
    ["Сосновый лес Пинеш", "pine forest beach shade"],
  ],
  cetinje: [
    ["Дворец короля Николы", "royal palace museum Montenegro"],
    ["Цетинский монастырь", "Cetinje monastery Montenegro"],
    ["Влашская церковь", "old church Montenegro fence"],
    ["Бильярда (резиденция Петра II Негоша)", "historic residence museum Montenegro"],
    ["Национальный музей Черногории", "national museum building Montenegro"],
    ["Гора Ловчен и мавзолей Негоша", "Lovcen mountain mausoleum view"],
    ["Главная улица Негоша", "pedestrian street old town Montenegro"],
    ["Ресторан черногорской кухни в центре", "traditional restaurant Balkans food"],
    ["Кофейня на площади Театра", "cafe terrace theatre square"],
    ["Рынок Цетинье", "small local market Montenegro"],
    ["Голубиная пещера (Люпина Печина)", "cave lake Montenegro"],
    ["Этнографический музей", "ethnographic museum traditional costumes"],
  ],
  weligama: [
    ["Залив рыбаков на сваях", "Weligama stilt fishermen Sri Lanka"],
    ["Пляж Велигамы", "Weligama beach surfing Sri Lanka"],
    ["Серф-пойнт Мидигама", "Midigama surf point Sri Lanka"],
    ["Остров-храм Пария Дува", "small temple island Sri Lanka beach"],
    ["Форт Галле (рядом)", "Galle Fort Sri Lanka walls"],
    ["Коливинг на Кокосовом холме", "coliving space ocean view"],
    ["Кафе для серферов на набережной", "smoothie bowl beach cafe"],
    ["Ресторан морепродуктов на пляже", "seafood grill beach Sri Lanka"],
    ["Ночной рынок Велигамы", "night market street food Asia"],
    ["Пляж Мирисса (рядом)", "Mirissa beach Sri Lanka whale"],
    ["Йога-шала на побережье", "yoga shala ocean view Sri Lanka"],
    ["Плантация корицы (вглубь острова)", "cinnamon plantation Sri Lanka"],
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
