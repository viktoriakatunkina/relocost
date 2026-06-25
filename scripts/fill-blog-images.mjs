// ============================================================
// Relocost.ru — обложки для статей без них + 2-3 иллюстрации внутри каждой статьи.
//
// Что делает (всё из УЖЕ существующих storage-фото, без запросов к Unsplash):
//   1. Обложки: статьям с пустой cover_url проставляет рабочую storage-обложку
//      (гео — hero города; тематические — обложка статьи того же тега / hero).
//   2. Inline: вставляет 2-3 картинки между секциями (## H2) в content_md:
//      • гео-город  → фото из галереи своего города;
//      • гео-страна → фото городов этой страны;
//      • тематические Деньги/Визы → обложки статей того же тега (финансы/паспорта);
//      • тематические Подборка/Сравнение/Гайд → hero городов (распознаём страны
//        из slug; иначе общий travel-пул).
//   Атрибуция Unsplash зашита в title картинки как "Автор::ссылка" и
//   рендерится подписью под фото (см. components.img в blog/[slug]/page.tsx).
//
// Источники фото — только storage (.supabase.co/storage), они грузятся с
// российского VPS. Предполагается, что migrate-stray-photos.mjs уже прогнан
// (галереи и обложки переведены на storage).
//
// Идемпотентно: статьи, где картинки уже вставлены, пропускаются; обложки
// проставляются только там, где их нет.
//
// Запуск:  node scripts/fill-blog-images.mjs --dry   # предпросмотр, без записи
//          node scripts/fill-blog-images.mjs         # запись в БД
// ============================================================
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const r = (f) => fs.readFileSync(path.join(os.homedir(), ".relocost", f), "utf8").trim();
const sb = createClient(r("supabase_url"), r("supabase_service_role_key"), {
  auth: { persistSession: false },
});

const isStorage = (u) => typeof u === "string" && u.includes("supabase.co/storage");
const hashStr = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
// Выбрать k различных элементов, равномерно «размазав» по массиву от seed.
function pickSpread(arr, k, seed) {
  if (arr.length <= k) return arr.slice();
  const start = seed % arr.length;
  const step = Math.max(1, Math.floor(arr.length / k));
  const out = [];
  const used = new Set();
  for (let i = 0; i < k && out.length < k; i++) {
    let idx = (start + i * step) % arr.length;
    let guard = 0;
    while (used.has(idx) && guard++ < arr.length) idx = (idx + 1) % arr.length;
    used.add(idx);
    out.push(arr[idx]);
  }
  return out;
}
const cleanCaption = (s) => (s || "").replace(/[[\]()"]/g, "").trim();
const cleanTitle = (s) => (s || "").replace(/"/g, "").trim();

// Подписи для тематических картинок (без географии). Везде «е», не «ё».
const TAG_CAPTION = {
  Деньги: "Деньги и финансы за рубежом",
  Визы: "Визы и документы для переезда",
  Подборка: "Направления для переезда",
  Сравнение: "Куда переехать",
  Гайд: "Жизнь за границей",
};

// RU-подстрока в slug -> country_slug (для тематических сравнений/подборок,
// чтобы показывать фото нужных стран). Значения сверены с cities.country_slug.
const PLACE_KW = {
  gruzi: "georgia", tbilisi: "georgia", batumi: "georgia",
  armeni: "armenia", erevan: "armenia", yerevan: "armenia",
  serbi: "serbia", belgrad: "serbia",
  chernogor: "montenegro", budv: "montenegro",
  kazah: "kazakhstan", almaty: "kazakhstan", astan: "kazakhstan",
  turci: "turkey", turtsi: "turkey", stambul: "turkey", antali: "turkey",
  tailand: "thailand", bangkok: "thailand", phuket: "thailand", pattay: "thailand", samui: "thailand",
  bali: "indonesia", indonez: "indonesia", jakart: "indonesia",
  vietnam: "vietnam", nyachang: "vietnam", hanoy: "vietnam", fukuok: "vietnam",
  dubai: "uae", oae: "uae", "abu-dabi": "uae", sharj: "uae",
  portugal: "portugal", lissabon: "portugal",
  ispani: "spain", madrid: "spain", barselon: "spain", valenci: "spain",
  greci: "greece", afin: "greece", saloniki: "greece",
  kipr: "cyprus", limassol: "cyprus", larnak: "cyprus", nikosi: "cyprus",
  chehi: "czech-republic", prag: "czech-republic",
  vengri: "hungary", budapesht: "hungary",
  uzbek: "uzbekistan", tashkent: "uzbekistan", samarkand: "uzbekistan", buhar: "uzbekistan", bukhar: "uzbekistan",
  serbi2: "serbia",
  bolgari: "bulgaria", sofi: "bulgaria",
  albani: "albania", tiran: "albania",
  egip: "egypt", kair: "egypt",
  izrail: "israel", "tel-aviv": "israel",
  koreya: "south-korea", seul: "south-korea",
  malayzi: "malaysia", kuala: "malaysia", penang: "malaysia",
};

// ---------- Загрузка данных ----------
let posts = [];
{
  let from = 0;
  const cols =
    "id,slug,title,tag,city_id,country_slug,cover_url,cover_author_name,cover_author_url,content_md,published";
  while (true) {
    const { data, error } = await sb
      .from("blog_posts")
      .select(cols)
      .eq("published", true)
      .range(from, from + 999);
    if (error) throw error;
    posts.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
}
const { data: cities, error: ce } = await sb
  .from("cities")
  .select(
    "id,slug,name_ru,country_slug,unsplash_url,unsplash_author_name,unsplash_author_url,gallery",
  )
  .range(0, 999);
if (ce) throw ce;

// ---------- Индексы и пулы ----------
const cityById = Object.fromEntries(cities.map((c) => [c.id, c]));
const citiesByCountry = {};
for (const c of cities) (citiesByCountry[c.country_slug] = citiesByCountry[c.country_slug] || []).push(c);

const heroOf = (c) => ({
  u: c.unsplash_url,
  n: c.unsplash_author_name,
  h: c.unsplash_author_url,
  caption: c.name_ru,
});
const galleryOf = (c) =>
  (Array.isArray(c.gallery) ? c.gallery : [])
    .filter((g) => g?.u && isStorage(g.u))
    .map((g) => ({ u: g.u, n: g.n, h: g.h, caption: c.name_ru }));

// общий travel-пул (hero всех городов, перемешан стабильно)
const heroPool = cities
  .filter((c) => isStorage(c.unsplash_url))
  .map(heroOf)
  .sort((a, b) => hashStr(a.u) - hashStr(b.u));

// обложки статей по тегам (только storage), как фото-объекты
const coversByTag = {};
for (const p of posts) {
  if (p.cover_url && isStorage(p.cover_url)) {
    (coversByTag[p.tag] = coversByTag[p.tag] || []).push({
      u: p.cover_url,
      n: p.cover_author_name,
      h: p.cover_author_url,
      caption: TAG_CAPTION[p.tag] || "Переезд",
      _slug: p.slug,
    });
  }
}

// уникализация пула по url
const uniqByUrl = (arr) => {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    if (!x?.u || seen.has(x.u)) continue;
    seen.add(x.u);
    out.push(x);
  }
  return out;
};

// представительный город страны = с самым богатым storage-пулом
function repCity(countrySlug) {
  const list = citiesByCountry[countrySlug] || [];
  return list
    .slice()
    .sort((a, b) => galleryOf(b).length - galleryOf(a).length || hashStr(a.slug) - hashStr(b.slug))[0];
}

// ---------- Классификация и подбор фото ----------
function planForPost(p) {
  let pool = []; // фото-объекты для inline
  let coverPhoto = null; // если нужна обложка
  let diverseFront = false; // взять первые k (для сравнений: по фото на страну)

  // страны, упомянутые в slug (для сравнений «X или Y»)
  const slugCountries = [];
  for (const [kw, cs] of Object.entries(PLACE_KW))
    if (p.slug.includes(kw) && !slugCountries.includes(cs)) slugCountries.push(cs);

  // hero городов по кругу (по одному на страну за проход) — diversity для сравнений
  const heroesRoundRobin = (countrySlugs) => {
    const lists = countrySlugs.map((cs) =>
      (citiesByCountry[cs] || []).filter((c) => isStorage(c.unsplash_url)).map(heroOf),
    );
    const out = [];
    for (let ri = 0, added = true; added; ri++) {
      added = false;
      for (const list of lists)
        if (list[ri]) {
          out.push(list[ri]);
          added = true;
        }
    }
    return out;
  };

  if (p.city_id && cityById[p.city_id]) {
    // ГЕО-ГОРОД
    const c = cityById[p.city_id];
    coverPhoto = heroOf(c);
    pool = uniqByUrl([...galleryOf(c), heroOf(c)]);
    if (pool.length < 3) {
      // добор из городов-соседей по стране
      const sib = (citiesByCountry[c.country_slug] || []).filter((x) => x.id !== c.id);
      for (const s of sib) pool.push(...galleryOf(s), heroOf(s));
      pool = uniqByUrl(pool);
    }
  } else if (p.country_slug && citiesByCountry[p.country_slug]?.length) {
    // ГЕО-СТРАНА (и сравнения «страна X или Y»)
    const countries = [p.country_slug, ...slugCountries.filter((cs) => cs !== p.country_slug)];
    const rep = repCity(p.country_slug);
    coverPhoto = heroOf(rep);
    if (countries.length >= 2) {
      // сравнение: hero обеих стран по кругу впереди, галереи — добор
      const rr = heroesRoundRobin(countries);
      const rest = [];
      for (const cs of countries) for (const c of citiesByCountry[cs] || []) rest.push(...galleryOf(c));
      pool = uniqByUrl([...rr, ...rest]);
      diverseFront = true;
    } else {
      const sib = citiesByCountry[p.country_slug];
      for (const s of sib) pool.push(heroOf(s), ...galleryOf(s));
      pool = uniqByUrl(pool);
    }
  } else {
    // ТЕМАТИЧЕСКАЯ
    if (p.tag === "Деньги" || p.tag === "Визы") {
      pool = uniqByUrl((coversByTag[p.tag] || []).filter((x) => x._slug !== p.slug));
      coverPhoto = pool[hashStr(p.slug) % Math.max(1, pool.length)] || heroPool[0];
    } else {
      // Подборка/Сравнение/Гайд — пробуем распознать страны из slug
      const heroesRR = heroesRoundRobin(slugCountries);
      const rest = [];
      for (const cs of slugCountries) for (const c of citiesByCountry[cs] || []) rest.push(...galleryOf(c));
      const geo = uniqByUrl([...heroesRR, ...rest]);
      if (slugCountries.length >= 2 && heroesRR.length >= 2) {
        pool = geo; // первые элементы — hero разных стран
        diverseFront = true;
      } else {
        pool = geo.length >= 2 ? geo : heroPool.slice();
      }
      coverPhoto = pool[hashStr(p.slug) % Math.max(1, pool.length)];
    }
  }

  // запас, если пул вдруг тонкий
  if (pool.length < 2) pool = uniqByUrl([...pool, ...heroPool]);

  return { pool, coverPhoto, diverseFront };
}

// ---------- Вставка картинок в markdown ----------
function imgMarkdown(photo) {
  const cap = cleanCaption(photo.caption);
  const author = cleanTitle(photo.n);
  const href = cleanTitle(photo.h);
  let title = "";
  if (author && href) title = ` "${author}::${href}"`;
  else if (author) title = ` "${author}"`;
  return `![${cap}](${photo.u}${title})`;
}

// Возвращает k точек вставки (индексы строк), равномерно по заголовкам ## ,
// исключая самый первый (чтобы не разрывать вступление). Фолбэк — границы
// абзацев, если заголовков мало.
function insertionPoints(lines, k) {
  const heads = [];
  for (let i = 0; i < lines.length; i++) if (/^##\s/.test(lines[i])) heads.push(i);
  const body = heads.slice(1); // пропускаем первый заголовок
  const points = [];
  if (body.length >= k) {
    const used = new Set();
    for (let j = 0; j < k; j++) {
      let pos = Math.min(body.length - 1, Math.max(0, Math.round((body.length * (j + 1)) / (k + 1)) - 1));
      let guard = 0;
      while (used.has(pos) && guard++ < body.length) pos = (pos + 1) % body.length;
      used.add(pos);
      points.push(body[pos]);
    }
  } else {
    // мало заголовков: используем все доступные + границы абзацев
    points.push(...body);
    for (let i = 2; i < lines.length && points.length < k; i++) {
      if (lines[i].trim() === "" && lines[i - 1].trim() !== "" && !/^#/.test(lines[i - 1])) {
        if (!points.includes(i + 1)) points.push(i + 1);
      }
    }
  }
  return [...new Set(points)].sort((a, b) => a - b).slice(0, k);
}

function injectImages(md, photos) {
  const lines = md.split("\n");
  const pts = insertionPoints(lines, photos.length);
  if (!pts.length) return md;
  // пары [строка, фото]; вставляем снизу вверх, чтобы индексы не съезжали
  const pairs = pts.map((line, i) => [line, photos[i]]).filter(([, ph]) => ph);
  pairs.sort((a, b) => b[0] - a[0]);
  for (const [line, ph] of pairs) {
    lines.splice(line, 0, "", imgMarkdown(ph), "");
  }
  return lines.join("\n");
}

const hasInlineImg = (md) => /!\[[^\]]*\]\([^)]*supabase\.co\/storage/.test(md || "");

// ---------- Прогон ----------
let coversFixed = 0;
let inlineDone = 0;
let skippedInline = 0;
const thinPool = [];
const updates = [];

for (const p of posts) {
  const { pool, coverPhoto, diverseFront } = planForPost(p);
  const update = {};

  // 1. обложка — только если её нет
  const needCover = !p.cover_url || !isStorage(p.cover_url);
  if (needCover && coverPhoto?.u && isStorage(coverPhoto.u)) {
    update.cover_url = coverPhoto.u;
    update.cover_author_name = coverPhoto.n ?? null;
    update.cover_author_url = coverPhoto.h ?? null;
    coversFixed++;
  }

  // 2. inline — только если ещё не вставлено
  if (!hasInlineImg(p.content_md)) {
    const headCount = (p.content_md.match(/^##\s/gm) || []).length;
    const k = headCount >= 6 ? 3 : 2;
    // не дублируем обложку в теле
    const coverU = (update.cover_url || p.cover_url || "").split("?")[0];
    const inlinePool = uniqByUrl(pool).filter((x) => x.u.split("?")[0] !== coverU);
    const usePool = inlinePool.length >= 2 ? inlinePool : uniqByUrl([...inlinePool, ...heroPool]);
    // для сравнений берём первые k (hero разных стран), иначе — равномерно по пулу
    const chosen = diverseFront
      ? usePool.slice(0, Math.min(k, usePool.length))
      : pickSpread(usePool, Math.min(k, usePool.length), hashStr(p.slug));
    if (chosen.length >= 2) {
      update.content_md = injectImages(p.content_md, chosen);
      inlineDone++;
      if (usePool.length < 3) thinPool.push(p.slug);
    } else {
      skippedInline++;
    }
  }

  if (Object.keys(update).length) updates.push({ id: p.id, slug: p.slug, ...update });
}

console.log(`Статей всего: ${posts.length}`);
console.log(`Обложек проставлено: ${coversFixed}`);
console.log(`Статей с inline-картинками добавлено: ${inlineDone}`);
console.log(`Пропущено inline (мало фото): ${skippedInline}`);
if (thinPool.length) console.log(`Тонкий пул (<3 фото) у: ${thinPool.length} статей`);

if (DRY) {
  console.log("\n=== DRY-RUN: примеры ===");
  for (const slug of ["kak-pereekhat-v-pragu-2026", "karty-dlya-rossiyan-za-granitsey-2026", "gruziya-ili-armeniya-2026"]) {
    const u = updates.find((x) => x.slug === slug);
    const p = posts.find((x) => x.slug === slug);
    console.log(`\n--- ${slug} (tag:${p.tag}, city:${!!p.city_id}, country:${p.country_slug}) ---`);
    if (u?.cover_url) console.log("обложка:", u.cover_url);
    const imgs = (u?.content_md || "").match(/!\[[^\]]*\]\([^)]+\)/g) || [];
    imgs.forEach((m) => console.log("  inline:", m.slice(0, 130)));
  }
  console.log(`\nВсего апдейтов к записи: ${updates.length} (DRY — не записано)`);
  process.exit(0);
}

// ---------- Запись ----------
let written = 0;
for (const u of updates) {
  const { id, slug, ...fields } = u;
  const { error } = await sb.from("blog_posts").update(fields).eq("id", id);
  if (error) throw new Error(`update ${slug}: ${error.message}`);
  written++;
  if (written % 25 === 0) process.stdout.write(`\r  записано ${written}/${updates.length}  `);
}
console.log(`\n✓ Записано апдейтов: ${written}`);
