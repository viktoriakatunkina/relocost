// Продолжение чистки обложек из приоритетного списка (не-DN «чужаков»).
// batch4 — все оставшиеся 244 статьи после batch1-3 (54 уже сделаны 3-м батчем).
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
  ["argentina-buenos-ayres-pereezd-2026", "Buenos Aires Argentina city"],
  ["pereezd-v-norvegiyu-dlya-rossiyan-2026", "Oslo Norway city"],
  ["germaniya-gamburg-pereezd-2026", "Hamburg Germany port city"],
  ["gretsiya-dn-visa-ostrova-2026", "Athens Greece city"],
  ["kak-pereekhat-v-tayvan-taipei-2026", "Taipei Taiwan skyline"],
  ["yuar-keyptaun-nomad-digital-nomad-viza-2026", "Cape Town South Africa Table Mountain"],
  ["kak-pereekhat-v-italiyu-rim-2026", "Rome Italy city"],
  ["aravia-saudovskaya-ekspat-zhizn-2026", "Riyadh Saudi Arabia city"],
  ["avstralia-tss-482-viza-it-2026", "Sydney Australia skyline"],
  ["kak-pereekhat-v-filippiny-manila-2026", "Manila Philippines city"],
  ["meksika-mehiko-oakhaka-nomad-2026", "Mexico City skyline"],
  ["avstralia-it-semya-pereezd-viza-2026", "Sydney Australia skyline"],
  ["indiya-mumbay-pereezd-2026", "Mumbai India city"],
  ["shveytssariya-zheneva-pereezd-2026", "Geneva Switzerland city"],
  ["panama-dlya-pereezda-2026", "Panama City skyline"],
  ["kak-pereekhat-v-indiyu-mumbaj-2026", "Mumbai India city"],
  ["shvetsiya-it-stokgolm-pereezd-2026", "Stockholm Sweden city"],
  ["gonkong-top-talent-pass-it-2026", "Hong Kong skyline"],
  ["kambodzha-nomad-pnompen-siem-rip-2026", "Phnom Penh Cambodia city"],
  ["finlyandiya-helsinki-it-2026", "Helsinki Finland city"],
  ["kolumbiya-bogota-digital-nomad-2026", "Bogota Colombia city"],
  ["uae-abu-dhabi-it-pereezd-2026", "Dubai UAE skyline"],
  ["oman-muskat-dlya-pereezda", "Muscat Oman city"],
  ["slovakiya-bratislava-it-2026", "Bratislava Slovakia old town"],
  ["polsha-varshava-pereezd-2026", "Warsaw Poland city"],
  ["klimat-za-rubezhom-kuda-pereekhat-po-pogode-2026", "Lima Peru city"],
  ["vena-god-po-studencheskoy-vize", "Vienna Austria city"],
  ["varshava-it-specialist-1800-euro", "Warsaw Poland city"],
  ["tel-aviv-do-i-posle-2023-15000-shekel", "Tel Aviv Israel city"],
  ["pafos-kip-zhizn-u-morya-1400-euro", "Paphos Cyprus coast"],
  ["almaty-vozvrat-iz-es-450-tenge", "Almaty Kazakhstan mountains city"],
  ["bishkek-neozhidanno-komfortno-55000-rub", "Bishkek Kyrgyzstan city"],
  ["tirana-samyy-deshevyy-evropa-750-euro", "Tirana Albania city"],
  ["yerevan-cherez-god-pereotsenka", "Yerevan Armenia city"],
  ["amsterdam-programmist-3000-euro", "Amsterdam Netherlands canal"],
  ["varshava-aitishnik-yazykovoy-barer-opyt", "Warsaw Poland city"],
  ["almaty-vozvratnaya-migratsiya-iz-es", "Almaty Kazakhstan mountains city"],
  ["istanbul-kadikoy-1200-euro-inflyatsiya", "Istanbul Turkey Bosphorus"],
  ["tel-aviv-do-i-posle-oktyabrya-2023", "Tel Aviv Israel city"],
  ["amsterdam-programmist-pochemu-resil-uekhat", "Amsterdam Netherlands canal"],
  ["ekvador-dlya-pereezda-2026", "Quito Ecuador city"],
  ["ssha-silicon-valley-nyu-york-it-2026", "New York City skyline"],
  ["estoniya-tallin-tartu-it-2026", "Tallinn Estonia old town"],
  ["marokko-marrakesh-nomad-2026", "Marrakech Morocco medina"],
  ["malta-eu-non-dom-nomad-2026", "Valletta Malta harbor"],
  ["kak-pereekhat-v-tunisu-tunis-2026", "Tunis Tunisia city"],
  ["italiya-milan-pereezd-2026", "Milan Italy city"],
  ["malaziya-kl-it-pereezd-2026", "Kuala Lumpur Malaysia skyline"],
  ["kak-pereekhat-v-ssha-iz-rossii-2026", "New York City skyline"],
  ["khorvatiya-shengen-it-vnzh-2026", "Dubrovnik Croatia old town"],
  ["norvegia-oslo-bergen-pereezd-it-2026", "Bergen Norway fjord city"],
  ["litva-vilnyus-it-pereezd-eu-2026", "Vilnius Lithuania old town"],
  ["irlandiya-dublin-it-sarp-nalog-2026", "Dublin Ireland city"],
  ["top-stran-dlya-pereezda-it-spetsialistov-2026", "Singapore skyline Marina Bay"],
  ["litva-vilnyus-it-2026", "Vilnius Lithuania old town"],
  ["belgiya-lyuksemburg-it-2026", "Luxembourg City skyline"],
  ["stoimost-zhizni-v-tsyurihe-2026", "Zurich Switzerland city"],
  ["australiya-it-pereezd-permanent-visa-2026", "Sydney Australia skyline"],
  ["ssha-o1-eb1-visa-dlya-specialistov-2026", "New York City skyline"],
  ["tanzaniya-dar-es-salam-pereezd-2026", "Dar es Salaam Tanzania city"],
  ["finlyandiya-helsinki-it-pereezd-2026", "Helsinki Finland city"],
  ["finlyandiya-pereezd-deti-obrazovanie-2026", "Helsinki Finland city"],
  ["kak-pereekhat-v-braziliyu-florian-2026", "Florianopolis Brazil beach"],
  ["strany-s-nulevym-nalogom-na-dohody-2026", "Dubai UAE skyline"],
  ["avstriya-vena-grats-it-2026", "Vienna Austria city"],
  ["belgiya-bryussel-antverpen-it-2026", "Antwerp Belgium city"],
  ["islandiya-nomad-severnoe-siyanie-2026", "Reykjavik Iceland city"],
  ["shankhay-pekhin-it-kitay-2026", "Shanghai China skyline"],
  ["shvetsiya-stokholm-malme-it-2026", "Malmo Sweden city"],
  ["goroda-do-50000-rubley-rossiya-i-zarubezhe-2026", "Moscow Russia city"],
  ["kak-pereekhat-v-irlandiyu-dublin-2026", "Dublin Ireland city"],
  ["kak-pereekhat-v-kolumbiyu-medellin-2026", "Medellin Colombia city"],
  ["kapshtat-yuar-dlya-pereezda-2026", "Cape Town South Africa Table Mountain"],
  ["kak-pereekhat-v-avstpaliyu-sidnej-2026", "Sydney Australia skyline"],
  ["meksika-mehiko-nomad-cdmx-2026", "Mexico City skyline"],
  ["kak-pereekhat-v-ganzhoumu-ganzhu-2026", "Guangzhou China skyline"],
  ["belgiya-bryussel-pereezd-2026", "Brussels Belgium city"],
  ["kak-pereekhat-v-ssha-bez-h1b-2026", "New York City skyline"],
  ["stoimost-zhizni-v-monreale-2026", "Montreal Canada city"],
  ["kak-pereekhat-v-brazil-sao-paulo-rio-2026", "Rio de Janeiro Brazil beach"],
  ["kak-pereekhat-v-shvejcariyu-cyurih-2026", "Zurich Switzerland city"],
  ["italiya-rim-pereezd-2026", "Rome Italy city"],
  ["kak-pereekhat-v-franciyu-parizh-2026", "Paris France Eiffel Tower"],
  ["sloveniya-lyublyana-it-2026", "Ljubljana Slovenia city"],
  ["shveytsariya-tsyurikh-it-pereezd-2026", "Zurich Switzerland city"],
  ["pereezd-v-yuzhniyu-koreyu-2026", "Seoul South Korea city"],
  ["maroko-kasablanka-rabat-dn-it-2026", "Casablanca Morocco city"],
  ["kak-pereekhat-v-bahrejn-manama-2026", "Manama Bahrain city"],
  ["latviya-riga-it-eu-blue-card-2026", "Riga Latvia old town"],
  ["italiya-startup-viza-flat-tax-2026", "Rome Italy city"],
  ["rumyniya-bukharest-pereezd-it-2026", "Bucharest Romania city"],
  ["meksika-playa-del-carmen-tulum-2026", "Playa del Carmen Mexico beach"],
  ["katar-doha-pereezd-2026", "Doha Qatar skyline"],
  ["gretsiya-digital-nomad-viza-nalog-2026", "Athens Greece city"],
  ["kak-pereekhat-v-yuzhnuyu-afriku-keyptaun-it-2026", "Cape Town South Africa Table Mountain"],
  ["avstralia-sydney-it-skilled-migration-2026", "Sydney Australia skyline"],
  ["kanada-vankuver-pereezd-2026", "Vancouver Canada city"],
  ["kak-pereekhat-v-singapur-2026", "Singapore skyline Marina Bay"],
  ["sharm-el-sheikh-zima-2026", "Sharm El Sheikh Egypt beach"],
  ["litva-vilnus-startap-viza-it-2026", "Vilnius Lithuania old town"],
  ["norvegiya-oslo-dlya-pereezda-2026", "Oslo Norway city"],
  ["malta-it-hq-person-15-protsent-2026", "Valletta Malta harbor"],
  ["niderlandy-amsterdam-freelance-zzp-2026", "Amsterdam Netherlands canal"],
  ["niderlandy-rotterdam-pereezd-2026", "Rotterdam Netherlands skyline"],
  ["singapur-pereezd-2026", "Singapore skyline Marina Bay"],
  ["peru-lima-nomad-it-machu-picchu-2026", "Lima Peru city"],
  ["malta-valletta-it-2026", "Valletta Malta harbor"],
  ["kak-pereekhat-v-kambodzhu-phnom-penh-siem-reap-2026", "Phnom Penh Cambodia city"],
  ["stoimost-zhizni-v-neapole-2026", "Naples Italy city"],
  ["norvegiya-oslo-bergen-it-2026", "Bergen Norway fjord city"],
  ["sloveniya-lyublyana-maribor-it-2026", "Ljubljana Slovenia city"],
  ["estona-tallin-e-rezidency-bolt-skype-2026", "Tallinn Estonia old town"],
  ["avstriya-vena-pereezd-2026", "Vienna Austria city"],
  ["frantsiya-parizh-pereezd-2026", "Paris France Eiffel Tower"],
  ["yaponiya-tokio-pereezd-2026", "Tokyo Japan city"],
  ["kak-pereekhat-v-marrokko-marrakesh-2026", "Marrakech Morocco medina"],
  ["slovakiya-bratislava-it-eu-2026", "Bratislava Slovakia old town"],
  ["mavrikiy-dlya-pereezda-2026", "Mauritius island beach"],
  ["braziliya-sau-paulo-it-pereezd-2026", "Sao Paulo Brazil skyline"],
  ["gonkong-it-finansy-2026", "Hong Kong skyline"],
  ["daniya-kopenhagen-it-eu-2026", "Copenhagen Denmark city canal"],
  ["dvojnoe-grazhdanstvo-2026", "Moscow Russia city"],
  ["latviya-riga-pereezd-2026", "Riga Latvia old town"],
  ["kak-pereekhat-v-yaponiy-tokio-2026", "Tokyo Japan city"],
  ["avstralia-sidsney-it-visa-pr-2026", "Sydney Australia skyline"],
  ["stoimost-zhizni-na-tenerife-2026", "Tenerife Canary Islands Spain"],
  ["lyuksemburg-niderlandy-alternativa-germanii-2026", "Luxembourg City skyline"],
  ["tunis-sfaks-dn-africa-2026", "Tunis Tunisia city"],
  ["zhizn-v-rige-2026", "Riga Latvia old town"],
  ["lyuksemburg-dlya-pereezda-2026", "Luxembourg City skyline"],
  ["franciya-parizh-it-2026", "Paris France Eiffel Tower"],
  ["kolombiya-kartagena-barrankilya-2026", "Cartagena Colombia old town"],
  ["latviya-riga-eu-vnzh-nedvizhimost-2026", "Riga Latvia old town"],
  ["niderlandy-30-percent-ruling-podrobno-2026", "Amsterdam Netherlands canal"],
  ["boliviya-la-pas-potosi-pereezd-2026", "La Paz Bolivia mountains city"],
  ["kak-pereekhat-v-nepal-katmandu-2026", "Kathmandu Nepal city"],
  ["shotlandiya-edinburg-pereezd-2026", "Edinburgh Scotland city"],
  ["yaponiya-tokio-it-hsp-visa-sony-2026", "Tokyo Japan city"],
  ["meksika-gvadalakhara-nomad-it-2026", "Guadalajara Mexico city"],
  ["playa-del-karmen-stoimost-zhizni-2026", "Mexico City skyline"],
  ["kak-pereekhat-v-kambodzhu-phnom-pen-2026", "Phnom Penh Cambodia city"],
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
  `${SCRATCH}/priority-fix-batch4-results.json`,
  JSON.stringify({ ok, failed: failedSlugs.length, results, failedSlugs }, null, 2)
);
