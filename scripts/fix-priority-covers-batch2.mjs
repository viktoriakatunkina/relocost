// Продолжение чистки обложек из приоритетного списка (см. batch1 для
// контекста и полного описания метода). Этот прогон (batch2) — следующие
// ~60 не-DN "чужаков" по убыванию размера кластера (после первых 45,
// обработанных в batch1), начиная со Словении/Македонии (cluster_size 31)
// и ниже.
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

const ENTRIES = [
  ["sloveniya-lyublyana-it-eu-2026", "Ljubljana Slovenia city"],
  ["kak-pereekhat-v-makedoniyu-ohrid-2026", "Ohrid North Macedonia lake"],
  ["indiya-goa-pereezd-dn-dlitelno-2026", "Goa India beach"],
  ["panama-pensionado-zhizn-2026", "Panama City skyline"],
  ["ssha-h1b-visa-it-2026", "New York City skyline"],
  ["sravnenie-vostochnaya-afrika-pereezd-2026", "Nairobi Kenya city"],
  ["gonkong-dlya-pereezda-2026", "Hong Kong skyline"],
  ["velikobritaniya-global-talent-viza-it-2026", "London United Kingdom skyline"],
  ["keniia-nairobi-dn-africa-2026", "Nairobi Kenya city"], // cache
  ["avstriya-vena-it-rwrplus-card-2026", "Vienna Austria city"],
  ["kolumbiya-medelyin-nomad-2026", "Medellin Colombia city"],
  ["belgiya-bryussel-it-expat-tax-2026", "Brussels Belgium city"],
  ["kolumbiya-medellin-peru-lima-it-2026", "Medellin Colombia city"], // cache
  ["avstriya-vena-it-pereezd-red-white-red-2026", "Vienna Austria city"], // cache
  ["singapur-tech-pass-grab-sea-it-2026", "Singapore skyline Marina Bay"],
  ["indiya-bangalor-it-pereezd-2026", "Bangalore India city"],
  ["kak-pereekhat-v-kroaciyu-dubrovnik-2026", "Dubrovnik Croatia old town"],
  ["norvegia-oslo-it-pereezd-2026", "Oslo Norway city"],
  ["polsha-varshava-it-eu-pereezd-2026", "Warsaw Poland city"],
  ["ruminiya-bukharest-it-0-nalog-eu-2026", "Bucharest Romania city"],
  ["rumyniya-bukharest-it-2026", "Bucharest Romania city"], // cache
  ["kak-pereekhat-v-ssha-nyu-york-2026", "New York City skyline"], // cache
  ["meksika-siti-digital-nomad-it-2026", "Mexico City skyline"],
  ["irlandiya-dublin-pereezd-2026", "Dublin Ireland city"],
  ["boliviya-la-pas-dlya-pereezda-2026", "La Paz Bolivia mountains city"],
  ["malta-it-non-dom-ostrove-v-more-2026", "Valletta Malta harbor"],
  ["kak-pereekhat-v-yuzhnuyu-afrikukeyptaun-2026", "Cape Town South Africa Table Mountain"],
  ["kak-pereekhat-v-finlandiu-tampere-oulu-2026", "Tampere Finland city"],
  ["islandiya-reykjavik-it-pereezd-2026", "Reykjavik Iceland city"],
  ["daniya-it-pereezd-positive-list-2026", "Copenhagen Denmark city canal"],
  ["irlandiya-dublin-it-eu-2026", "Dublin Ireland city"], // cache
  ["kak-pereekhat-v-avstriyu-grac-insbruk-2026", "Innsbruck Austria mountains"],
  ["gretsiya-digital-nomad-visa-ostrova-2026", "Greece islands Santorini"],
  ["kak-pereekhat-v-ssha-step-by-step-2026", "New York City skyline"], // cache
  ["kak-pereekhat-v-sloveniju-maribor-2026", "Maribor Slovenia city"],
  ["pol-sha-varshava-it-eu-2026", "Warsaw Poland city"], // cache
  ["kak-pereekhat-v-gonkong-2026", "Hong Kong skyline"], // cache
  ["ssha-it-visa-o1-h1b-pereezd-2026", "New York City skyline"], // cache
  ["italiya-milan-rim-it-2026", "Milan Italy city"],
  ["kak-pereekhat-v-velikobritaniyu-london-2026", "London United Kingdom skyline"], // cache
  ["ipoteka-za-rubezhom-kak-inostranets-2026", "Dubai UAE skyline"],
  ["frantsiya-parizh-it-nomad-2026", "Paris France Eiffel Tower"],
  ["kak-pereekhat-v-polshu-krakov-2026", "Krakow Poland old town"],
  ["belgiya-bryussel-it-eu-expat-2026", "Brussels Belgium city"], // cache
  ["slovakiya-bratislava-kosice-it-2026", "Bratislava Slovakia old town"],
  ["tayvan-it-gold-card-tsmc-2026", "Taipei Taiwan skyline"],
  ["pereezd-v-velikobritaniyu-posle-brexit-2026", "London United Kingdom skyline"], // cache
  ["chernogoriya-ili-gruziya-2026", "Tbilisi Georgia city view"],
  ["shvetsiya-stokgolm-it-spotify-klarna-2026", "Stockholm Sweden city"],
  ["meksika-mexico-siti-guadalahara-dn-it-2026", "Mexico City skyline"], // cache
  ["gana-akkra-ekspat-hub-zapadnaya-afrika-2026", "Accra Ghana city"],
  ["belarussiya-pereezd-2026-opcii-dlya-grazhdan", "Minsk Belarus city"],
  ["shvetsiya-gyoteborg-pereezd-2026", "Gothenburg Sweden city"],
  ["germaniya-myunkhen-pereezd-2026", "Munich Germany city"],
  ["khorvatiya-digital-nomad-visa-2026", "Dubrovnik Croatia old town"], // cache
  ["gde-zhit-v-azii-za-500-dollarov-2026", "Bali Indonesia rice terrace"],
  ["pereezd-v-panamu-dlya-rossiyan-2026", "Panama City skyline"], // cache
  ["finlyandiya-dlya-pereezda-it-obrazovanie-2026", "Helsinki Finland city"],
  ["niderlandy-amsterdam-vs-eydhoven-2026", "Amsterdam Netherlands canal"],
  ["niderlandy-amsterdam-pereezd-2026", "Amsterdam Netherlands canal"], // cache
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
const failedSlugs = [];
const results = [];

for (const [slug, query] of ENTRIES) {
  try {
    const photo = await fetchPhoto(query);
    if (!photo) {
      console.log(`~ ${slug}: Unsplash не вернул фото для "${query}"`);
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
    failedSlugs.push(slug);
  }
}

console.log(`\nГотово. Исправлено: ${ok}, не удалось/пропущено: ${failedSlugs.length}.`);
if (failedSlugs.length) console.log("Не обработано:", failedSlugs.join(", "));

fs.writeFileSync(
  `${SCRATCH}/priority-fix-batch2-results.json`,
  JSON.stringify({ ok, failed: failedSlugs.length, results, failedSlugs }, null, 2)
);
