// Чинит статьи в blog_posts, у которых cover_url совпадал (все указывали
// на один и тот же путь в Storage — u/480e15a297c66c49.jpg), хотя статьи
// о совершенно разных темах: города Японии, Норвегия, Никарагуа, Палау,
// Замбия и несколько нетематических статей (страховка, школы, переезд с детьми,
// переправка вещей). Исходно кластер состоял из 32 статей.
//
// Прогон от 2026-09-15 уже починил 11 из них бесплатно (переиспользуя фото
// из lib/cities-content.ts — Осака и Токио, см. отчёт). Этот файл содержит
// ТОЛЬКО оставшиеся 21 статью, которым нужен реальный поиск Unsplash —
// прогон упёрся в rate limit (0/50) сразу на первой из них. Просто запустите
// снова, когда лимит сбросится (окно часовое):
//   node scripts/fix-japan-cluster-covers.mjs
//
// Источник фото: 1 запрос к Unsplash Search API на тему + заливка
// в Storage bucket "photos" под новым путём u/<md5(slug).slice(0,12)>.jpg
// (тот же паттерн, что в scripts/fix-covers-strong-seo.mjs).
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import { createHash } from "node:crypto";

const H = os.homedir();
const SUPA_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

// slug -> поисковый запрос
const UNSPLASH_QUERIES = {
  "fukuoka-japan-dn-2026": "Fukuoka Japan city street",
  "hakone-japan-dn-2026": "Hakone Japan Mount Fuji lake",
  "hiroshima-japan-dn-2026": "Hiroshima Japan peace memorial",
  "kanazawa-japan-dn-2026": "Kanazawa Japan Kenrokuen garden",
  "kyoto-japan-dn-2026": "Kyoto Japan temple torii gate",
  "matsue-japan-dn-2026": "Matsue Japan castle",
  "matsumoto-japan-dn-2026": "Matsumoto Japan castle",
  "matsuyama-japan-dn-2026": "Matsuyama Japan Dogo Onsen",
  "nagasaki-japan-dn-2026": "Nagasaki Japan harbor city",
  "nara-japan-dn-2026": "Nara Japan deer park temple",
  "sapporo-japan-dn-2026": "Sapporo Japan city snow",
  "takamatsu-japan-dn-2026": "Takamatsu Japan Ritsurin garden",
  "takayama-japan-dn-2026": "Takayama Japan old town street",
  "longyearbyen-norway-dn-2026": "Svalbard Longyearbyen Norway arctic",
  "managua-nicaragua-dn-2026": "Nicaragua Managua lake volcano",
  "mikroneziya-palau-dn-2026": "Palau islands rock islands ocean",
  "zambiya-lusaka-dn-2026": "Victoria Falls Zambia",
  // Общие статьи про Японию целиком (без конкретного города)
  "pereezd-v-yaponiyu-dlya-rossiyan-2026": "Japan Mount Fuji torii gate travel",
  "yaponiya-dlya-pereezda-viza-adaptatsiya-2026": "Japan Mount Fuji torii gate travel",
  "yaponiya-pereezd-it-2026": "Japan Mount Fuji torii gate travel",
  "yaponiya-visa-dn-skilled-worker-2026": "Japan Mount Fuji torii gate travel",
  // Нетематические статьи — общая тема переезда/логистики
  "kak-peredat-veshchi-za-rubezh-2026": "shipping boxes international cargo relocation",
  "pereezd-s-detmi-shkola-viza-2026": "family airport travel relocation children",
  "shkoly-za-rubezhom-gosudarstvennye-mezhdunarodnye-2026": "international school classroom children",
  "strakhovanie-ekspata-oms-mezhdunarodnoe-2026": "health insurance medical documents",
};

// Кэшируем результат Unsplash-поиска по запросу, чтобы не дублировать
// одинаковый photo для строк с одинаковым query (у нас 4 статьи шарят
// "Japan Mount Fuji torii gate travel" сознательно — все они не про
// конкретный город, а про Японию в целом).
const queryCache = new Map();

async function fetchPhoto(query) {
  if (queryCache.has(query)) return queryCache.get(query);
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "3");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (res.status === 403) {
    const body = await res.text();
    if (/Rate Limit Exceeded/i.test(body)) {
      throw new Error("RATE_LIMIT");
    }
    throw new Error(`Unsplash 403: ${body}`);
  }
  if (!res.ok) throw new Error(`Unsplash ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const p = (json.results || [])[0];
  if (!p) return null;
  const result = { rawUrl: p.urls.raw, authorName: p.user.name, authorUrl: p.user.links.html, id: p.id };
  queryCache.set(query, result);
  return result;
}

async function uploadToStorage(slug, rawUrl) {
  const imgRes = await fetch(rawUrl + "&w=1200&q=80&fm=jpg");
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const hash = createHash("md5").update(slug).digest("hex").slice(0, 12);
  const storagePath = `u/${hash}.jpg`;
  const { error } = await sb.storage.from("photos").upload(storagePath, buf, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  return `${SUPA_URL}/storage/v1/object/public/photos/${storagePath}`;
}

let ok = 0;
let failed = 0;
const failedSlugs = [];
const results = [];

// Оставшиеся статьи через Unsplash
for (const [slug, query] of Object.entries(UNSPLASH_QUERIES)) {
  try {
    const photo = await fetchPhoto(query);
    if (!photo) {
      console.log(`~ ${slug}: Unsplash не вернул фото для "${query}"`);
      failed++;
      failedSlugs.push(slug);
      continue;
    }
    const cover_url = await uploadToStorage(slug, photo.rawUrl);
    const { error } = await sb
      .from("blog_posts")
      .update({
        cover_url,
        cover_author_name: photo.authorName,
        cover_author_url: photo.authorUrl,
        cover_unsplash_id: photo.id,
      })
      .eq("slug", slug);
    if (error) {
      console.error(`✗ ${slug}: update failed — ${error.message}`);
      failed++;
      failedSlugs.push(slug);
      continue;
    }
    console.log(`✓ ${slug} -> Unsplash "${query}" (${photo.authorName})`);
    results.push({ slug, source: `Unsplash: ${query}`, cover_url, author: photo.authorName });
    ok++;
  } catch (e) {
    if (e.message === "RATE_LIMIT") {
      console.error(`\n✗ RATE LIMIT достигнут на "${slug}". Останавливаюсь.`);
      failed++;
      failedSlugs.push(slug);
      // остальные необработанные тоже помечаем как failed
      break;
    }
    console.error(`✗ ${slug}: ${e.message}`);
    failed++;
    failedSlugs.push(slug);
  }
}

console.log(`\nГотово. Исправлено: ${ok}, не удалось: ${failed}.`);
if (failedSlugs.length) console.log("Не обработано:", failedSlugs.join(", "));

fs.writeFileSync(
  "/private/tmp/claude-501/-Users-viktoriadimark/7cc9059d-467f-41f1-b2ea-ed28c09919f9/scratchpad/japan-cluster-fix-results.json",
  JSON.stringify({ results, failedSlugs }, null, 2)
);
