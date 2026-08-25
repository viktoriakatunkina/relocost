// Точечный вариант fill-blog-images.mjs — только для 10 новых статей
// кластера «рейтинги/подборки» (см. seed-10-rating-articles-aug-2026.mjs).
// Та же логика подбора фото (storage, 0 запросов к Unsplash), но НЕ трогает
// остальные ~4800 статей блога — чтобы не задевать параллельную работу
// в репозитории и не тратить время на общий прогон.
//
// Запуск:  node scripts/fill-images-10-rating-articles.mjs --dry
//          node scripts/fill-images-10-rating-articles.mjs

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const r = (f) => fs.readFileSync(path.join(os.homedir(), ".relocost", f), "utf8").trim();
const sb = createClient(r("supabase_url"), r("supabase_service_role_key"), {
  auth: { persistSession: false },
});

const TARGET_SLUGS = [
  "goroda-do-50000-rubley-rossiya-i-zarubezhe-2026",
  "bezvizovye-goroda-u-morya-2026",
  "gde-vygodnee-rabotat-udalenno-dlya-rossiyan-2026",
  "gde-deshevle-vsego-zhit-rossiyaninu-2026",
  "gde-vygodnee-snimat-zhile-reyting-gorodov-2026",
  "samye-bezopasnye-goroda-dlya-pereezda-2026",
  "kuda-pereekhat-s-detmi-reyting-gorodov-2026",
  "gde-proshche-otkryt-schet-reyting-stran-2026",
  "top-gorodov-luchshaya-meditsina-dlya-relokantov-2026",
  "stoit-li-pereezzhat-chestny-reyting-gorodov-2026",
];

const isStorage = (u) => typeof u === "string" && u.includes("supabase.co/storage");
const hashStr = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
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

const TAG_CAPTION = {
  Подборка: "Направления для переезда",
  Сравнение: "Куда переехать",
  Гайд: "Жизнь за границей",
  Рейтинг: "Города для переезда",
};

// ---------- Загрузка данных ----------
const { data: posts, error: pe } = await sb
  .from("blog_posts")
  .select("id,slug,title,tag,city_id,country_slug,cover_url,cover_author_name,cover_author_url,content_md,published")
  .in("slug", TARGET_SLUGS);
if (pe) throw pe;

const { data: cities, error: ce } = await sb
  .from("cities")
  .select("id,slug,name_ru,country_slug,unsplash_url,unsplash_author_name,unsplash_author_url,gallery")
  .range(0, 999);
if (ce) throw ce;

const cityById = Object.fromEntries(cities.map((c) => [c.id, c]));
const citiesByCountry = {};
for (const c of cities) (citiesByCountry[c.country_slug] = citiesByCountry[c.country_slug] || []).push(c);

const heroOf = (c) => ({ u: c.unsplash_url, n: c.unsplash_author_name, h: c.unsplash_author_url, caption: c.name_ru });
const galleryOf = (c) =>
  (Array.isArray(c.gallery) ? c.gallery : [])
    .filter((g) => g?.u && isStorage(g.u))
    .map((g) => ({ u: g.u, n: g.n, h: g.h, caption: c.name_ru }));

const heroPool = cities.filter((c) => isStorage(c.unsplash_url)).map(heroOf).sort((a, b) => hashStr(a.u) - hashStr(b.u));

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

// Для тематических статей без city_id/country_slug — используем общий travel-пул
// (все 10 статей этой партии тематические, мульти-городские рейтинги).
function planForPost(p) {
  let pool = [];
  let coverPhoto = null;

  if (p.city_id && cityById[p.city_id]) {
    const c = cityById[p.city_id];
    coverPhoto = heroOf(c);
    pool = uniqByUrl([...galleryOf(c), heroOf(c)]);
  } else if (p.country_slug && citiesByCountry[p.country_slug]?.length) {
    const rep = citiesByCountry[p.country_slug][0];
    coverPhoto = heroOf(rep);
    const sib = citiesByCountry[p.country_slug];
    for (const s of sib) pool.push(heroOf(s), ...galleryOf(s));
    pool = uniqByUrl(pool);
  } else {
    // тематическая мульти-городская статья — общий пул, обложка стабильно по хэшу slug
    pool = heroPool.slice();
    coverPhoto = pool[hashStr(p.slug) % Math.max(1, pool.length)];
  }
  if (pool.length < 2) pool = uniqByUrl([...pool, ...heroPool]);
  return { pool, coverPhoto };
}

function imgMarkdown(photo) {
  const cap = cleanCaption(photo.caption);
  const author = cleanTitle(photo.n);
  const href = cleanTitle(photo.h);
  let title = "";
  if (author && href) title = ` "${author}::${href}"`;
  else if (author) title = ` "${author}"`;
  return `![${cap}](${photo.u}${title})`;
}

function insertionPoints(lines, k) {
  const heads = [];
  for (let i = 0; i < lines.length; i++) if (/^##\s/.test(lines[i])) heads.push(i);
  const body = heads.slice(1);
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
    points.push(...body);
  }
  return [...new Set(points)].sort((a, b) => a - b).slice(0, k);
}

function injectImages(md, photos) {
  const lines = md.split("\n");
  const pts = insertionPoints(lines, photos.length);
  if (!pts.length) return md;
  const pairs = pts.map((line, i) => [line, photos[i]]).filter(([, ph]) => ph);
  pairs.sort((a, b) => b[0] - a[0]);
  for (const [line, ph] of pairs) lines.splice(line, 0, "", imgMarkdown(ph), "");
  return lines.join("\n");
}

const hasInlineImg = (md) => /!\[[^\]]*\]\([^)]*supabase\.co\/storage/.test(md || "");

const updates = [];
for (const p of posts) {
  const { pool, coverPhoto } = planForPost(p);
  const update = {};

  const needCover = !p.cover_url || !isStorage(p.cover_url);
  if (needCover && coverPhoto?.u && isStorage(coverPhoto.u)) {
    update.cover_url = coverPhoto.u;
    update.cover_author_name = coverPhoto.n ?? null;
    update.cover_author_url = coverPhoto.h ?? null;
  }

  if (!hasInlineImg(p.content_md)) {
    const headCount = (p.content_md.match(/^##\s/gm) || []).length;
    const k = headCount >= 6 ? 3 : 2;
    const coverU = (update.cover_url || p.cover_url || "").split("?")[0];
    const inlinePool = uniqByUrl(pool).filter((x) => x.u.split("?")[0] !== coverU);
    const usePool = inlinePool.length >= 2 ? inlinePool : uniqByUrl([...inlinePool, ...heroPool]);
    const chosen = pickSpread(usePool, Math.min(k, usePool.length), hashStr(p.slug));
    if (chosen.length >= 2) update.content_md = injectImages(p.content_md, chosen);
  }

  if (Object.keys(update).length) updates.push({ id: p.id, slug: p.slug, ...update });
}

console.log(`Статей в партии: ${posts.length}, апдейтов: ${updates.length}`);

if (DRY) {
  for (const u of updates) {
    console.log(`\n--- ${u.slug} ---`);
    if (u.cover_url) console.log("обложка:", u.cover_url);
    const imgs = (u.content_md || "").match(/!\[[^\]]*\]\([^)]+\)/g) || [];
    imgs.forEach((m) => console.log("  inline:", m.slice(0, 120)));
  }
  process.exit(0);
}

let written = 0;
for (const u of updates) {
  const { id, slug, ...fields } = u;
  const { error } = await sb.from("blog_posts").update(fields).eq("id", id);
  if (error) throw new Error(`update ${slug}: ${error.message}`);
  written++;
}
console.log(`✓ Записано апдейтов: ${written}`);
