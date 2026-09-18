// Продолжение чистки обложек из приоритетного списка (не-DN «чужаков»).
// batch5 — оставшиеся 103 статьи после batch1-4 (352 приоритетных -> 0 после этого батча,
// если не будет новых промахов). Далее — 298 DN-микрогородов (отдельная задача).
// Скрипт останавливается сам при достижении rate-limit Unsplash (50/час) и
// сохраняет прогресс/failedSlugs в scratchpad, чтобы продолжить со следующего элемента.
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
  ["sri-lanka-colombo-nomad-2026", "Colombo Sri Lanka city"],
  ["germaniya-chancenkarte-2024-2026", "Berlin Germany city"],
  ["finlyandiya-startup-permit-it-2026", "Helsinki Finland city"],
  ["khorvatiya-eu-adriatika-digital-nomad-2026", "Dubrovnik Croatia old town"],
  ["malta-valletta-igaming-it-2026", "Valletta Malta harbor"],
  ["urugvay-montevideo-it-pereezd-2026", "Montevideo Uruguay city"],
  ["shvetsiya-stokgolm-it-pereezd-nalog-2026", "Stockholm Sweden city"],
  ["gvatemala-antigua-nomady-2026", "Antigua Guatemala colonial city"],
  ["italiya-florentsiya-pereezd-2026", "Florence Italy city"],
  ["meksika-nomad-merida-vs-oakhaka-2026", "Merida Mexico colonial city"],
  ["estoniya-e-residency-kak-otkryt-2026", "Tallinn Estonia old town"],
  ["kak-pereekhat-v-litvu-vilnyus-2026", "Vilnius Lithuania old town"],
  ["kenya-mombasa-diani-dn-coast-2026", "Nairobi Kenya city"],
  ["kak-pereekhat-v-italiyu-milan-2026", "Milan Italy city"],
  ["stoimost-zhizni-v-sidnee-2026", "Sydney Australia skyline"],
  ["niderlandy-amsterdam-highly-skilled-migrant-2026", "Amsterdam Netherlands canal"],
  ["skandinaviya-norvegiya-it-pereezd-2026", "Oslo Norway city"],
  ["katar-doha-it-nalogovyy-rai-2026", "Doha Qatar skyline"],
  ["kosta-rika-san-khose-zhizn-2026", "San Jose Costa Rica city"],
  ["kanada-alberta-calgary-it-2026", "Calgary Canada skyline"],
  ["kak-pereekhat-v-braziliyu-rio-2026", "Rio de Janeiro Brazil beach"],
  ["kolumbiya-kartagena-medelyin-2026", "Cartagena Colombia old town"],
  ["tayvan-tajpej-it-2026", "Taipei Taiwan skyline"],
  ["kak-pereekhat-v-belarus-minsk-2026", "Minsk Belarus city"],
  ["tayvan-gold-card-it-2026", "Taipei Taiwan skyline"],
  ["niderlandy-amsterdam-30-ruling-podrobno-2026", "Amsterdam Netherlands canal"],
  ["niderlandy-amsterdam-it-30-percent-ruling-2026", "Amsterdam Netherlands canal"],
  ["kak-pereekhat-v-kambodzhu-siemp-rip-pnompen-2026", "Phnom Penh Cambodia city"],
  ["kak-pereekhat-v-dubrovnik-2026", "Dubrovnik Croatia old town"],
  ["kak-pereekhat-v-ssha-losandzheles-2026", "Los Angeles skyline"],
  ["stoimost-zhizni-v-gdanske-2026", "Gdansk Poland old town"],
  ["kak-pereekhat-v-kolumbiyu-kartagenu-2026", "Cartagena Colombia old town"],
  ["arenda-zhilya-alikante-2026", "Alicante Spain city"],
  ["shvetsiya-stokgolm-it-2026", "Stockholm Sweden city"],
  ["kenya-nairobi-it-hub-2026", "Nairobi Kenya city"],
  ["kak-pereekhat-v-slovakiyu-bratislava-2026", "Bratislava Slovakia old town"],
  ["luksemburg-dn-it-finance-2026", "Luxembourg City skyline"],
  ["velikobritaniya-it-global-talent-visa-2026", "London United Kingdom skyline"],
  ["skandinaviya-inzhener-norvegiya-2026", "Oslo Norway city"],
  ["tayland-krabi-ko-lanta-pereezd-2026", "Bangkok Thailand city"],
  ["islandiya-reykjavik-it-2026", "Reykjavik Iceland city"],
  ["kak-pereekhat-v-belgii-bryussel-it-2026", "Brussels Belgium city"],
  ["stoimost-zhizni-v-nyu-yorke-2026", "New York City skyline"],
  ["niderlandy-amsterdam-dn-guide-2026", "Amsterdam Netherlands canal"],
  ["yuzhno-afrikanskaya-respublika-keyp-taun-pereezd-2026", "Cape Town South Africa Table Mountain"],
  ["tayvan-taipei-it-2026", "Taipei Taiwan skyline"],
  ["stoimost-zhizni-vo-florencii-2026", "Florence Italy city"],
  ["kak-pereekhat-v-meksiiku-mexico-city-2026", "Mexico City skyline"],
  ["khorvatiya-digital-nomad-viza-eu-2026", "Dubrovnik Croatia old town"],
  ["kak-pereekhat-v-polshu-varshavu-2026", "Warsaw Poland city"],
  ["pereezd-na-shri-lanku-dlya-rossiyan-2026", "Colombo Sri Lanka city"],
  ["kak-pereekhat-v-avstriyu-venu-2026", "Vienna Austria city"],
  ["ssha-alternativy-h1b-visa-2026", "New York City skyline"],
  ["goa-indiya-zimovka-nomad-2026", "Goa India beach"],
  ["kak-nayti-rabotu-v-ssha-bez-h1b-2026", "New York City skyline"],
  ["shveytssariya-tsyurikch-pereezd-2026", "Zurich Switzerland city"],
  ["kak-pereekhat-v-maltu-2026", "Valletta Malta harbor"],
  ["peru-lima-pereezd-2026", "Lima Peru city"],
  ["polsha-krakow-pereezd-2026", "Krakow Poland old town"],
  ["yaponiya-it-highly-skilled-professional-viza-2026", "Tokyo Japan city"],
  ["stoimost-zhizni-v-los-andzhelese-2026", "Los Angeles skyline"],
  ["avstraliya-sidney-pereezd-2026", "Sydney Australia skyline"],
  ["norvegia-oslo-pereezd-rabota-2026", "Oslo Norway city"],
  ["kak-pereekhat-v-finlandiyu-helsinki-it-2026", "Helsinki Finland city"],
  ["chili-santiago-it-2026", "Santiago Chile city"],
  ["meksika-mexico-city-it-dnv-2026", "Mexico City skyline"],
  ["niderlandy-amsterdam-vizovyj-sponzor-2026", "Amsterdam Netherlands canal"],
  ["kak-pereekhat-v-germaniyu-berlin-2026", "Berlin Germany city"],
  ["tayvan-taybey-pereezd-2026", "Taipei Taiwan skyline"],
  ["stoimost-zhizni-v-kelne-2026", "Cologne Germany city"],
  ["kak-pereekhat-v-tadzikhistan-dushanbe-2026", "Dushanbe Tajikistan city"],
  ["niderlandy-eyndhoven-pereezd-2026", "Eindhoven Netherlands city"],
  ["kak-pereekhat-v-indiyu-bangalore-2026", "Bangalore India city"],
  ["kak-pereekhat-v-lesoto-maseru-2026", "Cape Town South Africa Table Mountain"],
  ["pereezd-v-panamu-2026", "Panama City skyline"],
  ["belgiya-bryussel-it-pereezd-eu-2026", "Brussels Belgium city"],
  ["katar-doha-it-pereezd-2026", "Doha Qatar skyline"],
  ["tunis-pereezd-2026", "Tunis Tunisia city"],
  ["yaponiya-tokio-it-j-skip-visa-2026", "Tokyo Japan city"],
  ["stoimost-zhizni-v-kasablanke-2026", "Casablanca Morocco city"],
  ["kak-pereekhat-v-shveciy-stokgolm-2026", "Stockholm Sweden city"],
  ["estoniya-e-rezidentstvo-pereezd-it-2026", "Tallinn Estonia old town"],
  ["kosta-rika-pensionado-pereezd-2026", "San Jose Costa Rica city"],
  ["kak-pereekhat-v-kitaj-shanghaj-2026", "Shanghai China skyline"],
  ["kak-pereekhat-v-horvatiju-zagreb-2026", "Dubrovnik Croatia old town"],
  ["kak-poluchit-vizu-ssha-step-by-step-2026", "New York City skyline"],
  ["kak-pereekhat-v-latviju-riga-2026", "Riga Latvia old town"],
  ["sloveniya-lyublyana-dn-guide-2026", "Ljubljana Slovenia city"],
  ["filipiny-manila-dlya-pereezda-2026", "Manila Philippines city"],
  ["bahreyn-golden-residency-fintech-2026", "Manama Bahrain city"],
  ["stoimost-zhizni-v-adelaide-2026", "Adelaide Australia city"],
  ["stambul-kadikoy-vs-beyoglu-byudzhet-i-inflyatsiya", "Istanbul Turkey Bosphorus"],
  ["praga-otkryli-ip-byudzhet-byurokratiya", "Prague Czech Republic old town"],
  ["mehiko-neochevIdnyy-vybor-bezopasnost-byudzhet", "Mexico City skyline"],
  ["kuala-lumpur-semya-multikulturnost-opyt", "Kuala Lumpur Malaysia skyline"],
  ["tbilisi-s-rebenkom-opyt-it-spetsialista", "Tbilisi Georgia old town"],
  ["kuala-lumpur-semya-1500-dollar", "Kuala Lumpur Malaysia skyline"],
  ["stoimost-zhizni-v-dyusseldorfe-2026", "Dusseldorf Germany city"],
  ["avstraliya-melburn-pereezd-2026", "Melbourne Australia city"],
  ["almaty-vs-erevan-kuda-pereekhat-2026", "Almaty Kazakhstan mountains city"],
  ["praga-ip-frilanser-1600-euro", "Prague Czech Republic old town"],
  ["kip-limasol-semya-koshki-2000-euro", "Limassol Cyprus city"],
  ["kak-pereekhat-v-uzbekistan-samarkand-2026", "Samarkand Uzbekistan Registan"],
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
  `${SCRATCH}/priority-fix-batch5-results.json`,
  JSON.stringify({ ok, failed: failedSlugs.length, results, failedSlugs }, null, 2)
);
