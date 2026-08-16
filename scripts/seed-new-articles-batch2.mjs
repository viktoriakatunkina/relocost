// Seed партии из 5 SEO-статей для блога Relocost (июль 2026):
// 1. perevod-deneg-v-armeniyu-iz-rossii-2026
// 2. kak-otkryt-schet-v-banke-kazakhstana-2026
// 3. apostil-dokumentov-dlya-pereezda-2026
// 4. vtoroy-pasport-dlya-rossiyan-2026
// 5. kak-zhit-za-rubezhom-bez-vnzh-rossiyane-2026
//
// Запуск: node scripts/seed-new-articles-batch2.mjs

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const H = os.homedir();
const SB_URL = fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim();
const KEY = fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim();
const UNSPLASH = fs.readFileSync(`${H}/.relocost/unsplash_access_key`, "utf8").trim();
const sb = createClient(SB_URL, KEY, { auth: { persistSession: false } });

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");

const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Описание статей ──────────────────────────────────────────────────────────
const ARTICLES = [
  {
    slug: "perevod-deneg-v-armeniyu-iz-rossii-2026",
    unsplash_query: "armenia yerevan banking finance money transfer",
    city_slug: "yerevan",
  },
  {
    slug: "kak-otkryt-schet-v-banke-kazakhstana-2026",
    unsplash_query: "almaty kazakhstan bank finance modern building",
    city_slug: "almaty",
  },
  {
    slug: "apostil-dokumentov-dlya-pereezda-2026",
    unsplash_query: "official documents stamp passport apostille papers",
    city_slug: null,
  },
  {
    slug: "vtoroy-pasport-dlya-rossiyan-2026",
    unsplash_query: "passport travel multiple countries citizenship",
    city_slug: null,
  },
  {
    slug: "kak-zhit-za-rubezhom-bez-vnzh-rossiyane-2026",
    unsplash_query: "travel nomad digital passport border crossing",
    city_slug: null,
  },
];

// ── Парсинг frontmatter ───────────────────────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("No frontmatter found");
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^"(.*)"$/, "$1");
    fm[key] = val;
  }
  const body = match[2].trim();
  return { fm, body };
}

// ── Unsplash поиск + загрузка в Storage ─────────────────────────────────────
async function fetchAndUploadCover(query, slug) {
  // 1. Ищем фото через Unsplash API
  let photo = null;
  try {
    const u = new URL("https://api.unsplash.com/search/photos");
    u.searchParams.set("query", query);
    u.searchParams.set("per_page", "5");
    u.searchParams.set("orientation", "landscape");
    const res = await fetch(u, {
      headers: { Authorization: `Client-ID ${UNSPLASH}` },
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 429 || res.status === 403) {
      console.warn(`  ! Rate limit Unsplash при "${query}"`);
      return null;
    }
    if (!res.ok) {
      console.warn(`  ! Unsplash HTTP ${res.status} для ${slug}`);
      return null;
    }
    const json = await res.json();
    photo = json.results?.[0];
  } catch (e) {
    console.warn(`  ! Unsplash fetch error для ${slug}: ${e.message}`);
    return null;
  }

  if (!photo) {
    console.warn(`  ~ Нет фото на запрос "${query}"`);
    return null;
  }

  // 2. Скачиваем изображение локально
  const rawUrl = photo.urls.raw + "?w=1600&q=80&fm=jpg&fit=max&auto=format";
  let buf;
  try {
    const imgRes = await fetch(rawUrl, { signal: AbortSignal.timeout(30000) });
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
    buf = Buffer.from(await imgRes.arrayBuffer());
  } catch (e) {
    console.warn(`  ! Ошибка скачивания фото для ${slug}: ${e.message}`);
    return null;
  }

  // 3. Заливаем в Supabase Storage bucket "photos"
  const objectPath = `u/${hash(photo.urls.raw)}.jpg`;
  let storageUrl;
  try {
    const { error: upErr } = await sb.storage.from("photos").upload(objectPath, buf, {
      contentType: "image/jpeg",
      cacheControl: "31536000",
      upsert: true,
    });
    if (upErr) throw new Error(upErr.message);
    storageUrl = sb.storage.from("photos").getPublicUrl(objectPath).data.publicUrl;
  } catch (e) {
    console.warn(`  ! Storage upload error для ${slug}: ${e.message}`);
    return null;
  }

  return {
    cover_url: storageUrl,
    cover_author_name: photo.user.name || null,
    cover_author_url: photo.user.links?.html || null,
  };
}

// ── Главная функция ───────────────────────────────────────────────────────────
async function run() {
  const base = Date.now();
  let added = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < ARTICLES.length; i++) {
    const { slug, unsplash_query, city_slug } = ARTICLES[i];
    const filePath = path.join(BLOG_DIR, `${slug}.md`);

    // Проверяем наличие файла
    if (!fs.existsSync(filePath)) {
      console.warn(`[SKIP] файл не найден: ${slug}.md`);
      errors++;
      continue;
    }

    // Парсим файл
    const raw = fs.readFileSync(filePath, "utf8");
    let fm, body;
    try {
      ({ fm, body } = parseFrontmatter(raw));
    } catch (e) {
      console.error(`[ERR ] parse error для ${slug}: ${e.message}`);
      errors++;
      continue;
    }

    // Проверяем существование в базе
    const { data: existing } = await sb
      .from("blog_posts")
      .select("id, cover_url")
      .eq("slug", slug)
      .maybeSingle();

    // Получаем обложку из Unsplash и грузим в Storage
    let coverData = null;
    if (!existing?.cover_url || existing.cover_url.includes("unsplash.com")) {
      console.log(`  Загружаю обложку для ${slug}...`);
      coverData = await fetchAndUploadCover(unsplash_query, slug);
      await sleep(1200); // лимит Unsplash API ~50/час
    }

    // Разносим created_at по 1 часу для правильного порядка в блоге
    const createdAt = new Date(base - i * 3600 * 1000).toISOString();

    if (existing) {
      // Статья уже есть — обновляем title/description/tag/content и обложку если нужна
      const updatePayload = {
        title: fm.title,
        tag: fm.tag ?? "Переезд",
        read_time: parseInt(fm.reading_time ?? "10", 10),
        content_md: body,
        seo_title: fm.title,
        seo_description: fm.description ?? null,
        published: fm.published !== "false",
      };
      if (coverData) {
        updatePayload.cover_url = coverData.cover_url;
        updatePayload.cover_author_name = coverData.cover_author_name;
        updatePayload.cover_author_url = coverData.cover_author_url;
      }
      const { error } = await sb.from("blog_posts").update(updatePayload).eq("id", existing.id);
      if (error) {
        console.error(`[ERR ] update ${slug}: ${error.message}`);
        errors++;
        continue;
      }
      updated++;
      console.log(`[UPD ] ${slug}${coverData ? " + обложка" : ""}`);
    } else {
      // Новая статья — вставляем
      const row = {
        title: fm.title,
        slug,
        tag: fm.tag ?? "Переезд",
        read_time: parseInt(fm.reading_time ?? "10", 10),
        content_md: body,
        seo_title: fm.title,
        seo_description: fm.description ?? null,
        city_id: null,
        country_slug: null,
        cover_url: coverData?.cover_url ?? null,
        cover_author_name: coverData?.cover_author_name ?? null,
        cover_author_url: coverData?.cover_author_url ?? null,
        published: fm.published !== "false",
        created_at: createdAt,
      };

      const { error } = await sb.from("blog_posts").insert(row);
      if (error) {
        console.error(`[ERR ] insert ${slug}: ${error.message}`);
        errors++;
        continue;
      }
      added++;
      console.log(`[ADD ] ${slug}${coverData ? " + обложка" : " (без обложки)"}`);
    }
  }

  console.log(
    `\nГотово: добавлено=${added}, обновлено=${updated}, пропущено=${skipped}, ошибок=${errors} / всего=${ARTICLES.length}`
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
