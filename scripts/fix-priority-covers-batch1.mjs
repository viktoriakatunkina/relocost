// Чинит обложки статей из приоритетного списка "чужаков"
// (/private/tmp/.../scratchpad/priority-fix-list.json), составленного
// вчера: 650 статей, чей cover_url совпадает с другими статьями на
// совершенно другую тему (кластеры по cover_hash), приоритет — не-DN
// контентные статьи по убыванию размера кластера.
//
// Этот прогон (batch1):
//  1) Кластер "Tower Bridge" (cover u/a7ac0cfaa81df91a.jpg, фото Лондона
//     от Benjamin Davies) — 5 явных чужаков: Аргентина, Босния (Требине),
//     Эстония (Таллин), Танзания (Кигома), Финляндия (Хельсинки).
//  2) Начало основного приоритетного списка (is_dn=false), по убыванию
//     размера кластера — от Тайваня/Марокко (95) до Пекина (32).
//
// Метод — тот же, что в scripts/fix-japan-cluster-covers.mjs:
// 1 запрос к Unsplash Search API на тему (с кэшем по тексту запроса —
// несколько статей об одном городе шарят 1 фото) → заливка в Supabase
// Storage bucket "photos" под путём u/<md5(slug).slice(0,12)>.jpg →
// UPDATE blog_posts.cover_url + cover_author_name/cover_author_url/cover_unsplash_id.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import { createHash } from "node:crypto";

const H = os.homedir();
const SUPA_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const SCRATCH =
  "/private/tmp/claude-501/-Users-viktoriadimark/7cc9059d-467f-41f1-b2ea-ed28c09919f9/scratchpad";

// slug -> поисковый запрос. Порядок = порядок обработки.
// Одинаковый query text у нескольких slug -> 1 запрос к Unsplash на всех (кэш).
const ENTRIES = [
  // --- Tower Bridge cluster (5 явных чужаков) ---
  ["argentina-buenos-aires-nomad-it-2026", "Buenos Aires Argentina skyline"],
  ["trebinje-bosnia-dn-2026", "Trebinje Bosnia old town river"],
  ["estoniya-tallinn-e-residency-it-2026", "Tallinn Estonia old town"],
  ["kigoma-tanzania-dn-2026", "Lake Tanganyika Kigoma Tanzania"],
  ["finlyandiya-helsinki-it-eu-2026", "Helsinki Finland city"],

  // --- Приоритетный список, is_dn=false, по убыванию cluster_size ---
  ["taivan-taipei-it-2026", "Taipei Taiwan skyline"],
  ["marokko-kasablanka-agadir-dn-it-2026", "Casablanca Morocco city"],
  ["finlyandiya-helsinki-pereezd-2026", "Helsinki Finland city"], // cache
  ["medellin-kolumbiya-nomad-pereezd-2026", "Medellin Colombia city"],
  ["kak-pravilno-oformit-ip-za-rubezhom-2026", "Tbilisi Georgia city view"],
  ["bosiya-gercegovina-samaya-deshevaya-evropa-2026", "Mostar Bosnia and Herzegovina bridge"],
  ["saudovskaya-araviya-ekspat-pereezd-2026", "Riyadh Saudi Arabia skyline"],
  ["yuzhnoafrikanskaya-respublika-kejptaun-it-2026", "Cape Town South Africa Table Mountain"],
  ["litva-vilnyus-kaunas-it-2026", "Vilnius Lithuania old town"],
  ["meksika-siti-it-digital-nomad-kavak-2026", "Mexico City skyline"],
  ["islandiya-rejkyavik-it-2026", "Reykjavik Iceland city"],
  ["kolumbiya-medellin-nomad-2026", "Medellin Colombia city"], // cache
  ["kak-pereekhat-v-kolumbiyu-bogota-2026", "Bogota Colombia city"],
  ["estoniya-e-residency-kompaniya-v-eu-2026", "Tallinn Estonia old town"], // cache
  ["kak-pereekhat-v-kanadu-vankuver-2026", "Vancouver Canada skyline mountains"],
  ["latviya-riga-it-eu-pereezd-2026", "Riga Latvia old town"],
  ["denmark-kopengagen-dlya-nomadov-it-2026", "Copenhagen Denmark city canal"],
  ["daniya-kopengagen-pereezd-2026", "Copenhagen Denmark city canal"], // cache
  ["kak-pereekhat-v-daniyu-kopengagen-2026", "Copenhagen Denmark city canal"], // cache
  ["oman-maskat-it-freelancer-visa-2026", "Muscat Oman city"],
  ["chi-chili-santiago-nomad-2026", "Santiago Chile skyline Andes"],
  ["tanzaniya-zanzibar-lc-2026", "Zanzibar Tanzania beach"],
  ["estoniya-tallin-it-2026", "Tallinn Estonia old town"], // cache
  ["pereezd-v-ekvador-dlya-rossiyan-2026", "Quito Ecuador city Andes"],
  ["oman-muskat-dn-goldenresidens-2026", "Muscat Oman city"], // cache
  ["finlyandiya-tampere-pereezd-2026", "Tampere Finland city"],
  ["niderlandy-amsterdam-30-ruling-it-2026", "Amsterdam Netherlands canal"],
  ["zhizn-v-meksiko-siti-dlya-ekspata-2026", "Mexico City skyline"], // cache
  ["germaniya-berlin-pereezd-2026", "Berlin Germany city"],
  ["franciya-parizh-it-french-tech-visa-2026", "Paris France Eiffel Tower"],
  ["paragvaj-asunsion-dn-0-nalogov-2026", "Asuncion Paraguay city"],
  ["latviya-riga-it-2026", "Riga Latvia old town"], // cache
  ["braziliya-rio-nomad-digital-visa-2026", "Rio de Janeiro Brazil skyline"],
  ["kak-pereekhat-v-avstraliyu-melburn-2026", "Melbourne Australia skyline"],
  ["singapur-it-tech-pass-employment-pass-2026", "Singapore skyline Marina Bay"],
  ["kak-pereekhat-v-ingermandiyu-delhi-2026", "Delhi India city"],
  ["dominikanskaya-respublika-punta-kana-zhizn-2026", "Punta Cana Dominican Republic beach"],
  ["velikobritaniya-skilled-worker-pereezd-2026", "London United Kingdom skyline"],
  ["kak-pereekhat-v-kambodzhu-siem-rip-2026", "Siem Reap Cambodia Angkor Wat"],
  ["indiya-bangalor-pereezd-2026", "Bangalore India city"],
  ["marokko-marrakesh-pereezd-2026", "Marrakesh Morocco medina"],
  ["malta-valetta-sliema-it-2026", "Valletta Malta harbor"],
  ["luchshaya-meditsinskaya-pomoshch-za-rubezhom-ekspatam-2026", "modern hospital medical clinic"],
  ["irlandiya-dublin-it-critical-skills-2026", "Dublin Ireland city"],
  ["kak-pereekhat-v-kitay-pekin-2026", "Beijing China city"],
];

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
    if (/Rate Limit Exceeded/i.test(body)) throw new Error("RATE_LIMIT");
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

for (const [slug, query] of ENTRIES) {
  try {
    const photo = await fetchPhoto(query);
    if (!photo) {
      console.log(`~ ${slug}: Unsplash не вернул фото для "${query}"`);
      failed++;
      failedSlugs.push(slug);
      continue;
    }
    const cover_url = await uploadToStorage(slug, photo.rawUrl);
    const { error, count } = await sb
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
    console.log(`✓ ${slug} -> "${query}" (${photo.authorName})`);
    results.push({ slug, query, cover_url, author: photo.authorName });
    ok++;
  } catch (e) {
    if (e.message === "RATE_LIMIT") {
      console.error(`\n✗ RATE LIMIT достигнут на "${slug}". Останавливаюсь.`);
      failedSlugs.push(slug);
      break;
    }
    console.error(`✗ ${slug}: ${e.message}`);
    failed++;
    failedSlugs.push(slug);
  }
}

console.log(`\nГотово. Исправлено: ${ok}, не удалось/пропущено: ${failedSlugs.length}.`);
if (failedSlugs.length) console.log("Не обработано:", failedSlugs.join(", "));

fs.writeFileSync(
  `${SCRATCH}/priority-fix-batch1-results.json`,
  JSON.stringify({ ok, failed: failedSlugs.length, results, failedSlugs }, null, 2)
);
