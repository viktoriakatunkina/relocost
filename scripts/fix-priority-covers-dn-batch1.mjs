// Чистка обложек DN-микрогородов (is_dn=true, 298 статей) — batch1.
// Запросы построены из slug'а/title (город + англ. название страны), см.
// scratchpad/build-dn-queries.py и dn-fix-list-with-queries.json (весь список из 298,
// уже в порядке приоритетного списка). Этот batch — первые 20 записей,
// подобрано под доступную квоту Unsplash (~26 запросов на момент запуска).
// Продолжение: scratchpad/dn-fix-remaining-after-batch1.json (278 записей) —
// на его основе следующим заходом собрать fix-priority-covers-dn-batch2.mjs
// по этой же схеме (см. fix-priority-covers-batch5.mjs как образец).
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
  ["trebinje-bosnia-dn-2026", "Trebinje Bosnia and Herzegovina city"],
  ["kigoma-tanzania-dn-2026", "Kigoma Tanzania city"],
  ["mindelo-cape-verde-dn-2026", "Mindelo Cape Verde city"],
  ["hunza-pakistan-dn-2026", "Hunza Pakistan city"],
  ["severnaya-irlandija-belfast-dn-2026", "Belfast United Kingdom city"],
  ["niue-alofi-dn-2026", "Alofi Niue city"],
  ["bosniya-sarayevo-dn-2026", "Sarajevo Bosnia and Herzegovina city"],
  ["vostochny-timor-dili-dn-2026", "Dili Timor Leste city"],
  ["sierra-leone-fritaun-dn-2026", "Freetown Sierra Leone city"],
  ["ohrid-north-macedonia-dn-2026", "Ohrid North Macedonia city"],
  ["ngaoundere-cameroon-dn-2026", "Ngaoundere Cameroon city"],
  ["pakistan-islamabad-dn-2026", "Islamabad Pakistan city"],
  ["mawlamyine-myanmar-dn-2026", "Mawlamyine Myanmar city"],
  ["kiribati-south-tarawa-dn-2026", "South Tarawa Kiribati city"],
  ["masvingo-zimbabwe-dn-2026", "Masvingo Zimbabwe city"],
  ["norvegiya-oslo-dn-2026", "Oslo Norway city"],
  ["niamey-niger-dn-2026", "Niamey Niger city"],
  ["ekvador-kito-dn-2026", "Quito Ecuador city"],
  ["panama-panama-siti-dn-2026", "Panama City Panama city"],
  ["meksika-mehiko-pereezd-dn-2026", "Mexico City Mexico city"],
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
  `${SCRATCH}/dn-fix-batch1-results.json`,
  JSON.stringify({ ok, failed: failedSlugs.length, results, failedSlugs }, null, 2)
);
