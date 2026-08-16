/**
 * Дорабатывает топ-статью «Куда переезжают россияне в 2026»:
 * 1. Переносит обложку из Unsplash CDN в Supabase Storage
 * 2. Добавляет таблицу сравнения стран в начало (featured snippet)
 * 3. Обновляет seo_title (≤60 символов для Яндекса)
 * 4. Обновляет content_md в базе
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import crypto from "node:crypto";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim(),
  fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim(),
  { auth: { persistSession: false } }
);

const SLUG = "kuda-pereezzhayut-rossiyane-v-2026-top-stran";
const ARTICLE_ID = "d0381f22-1a7b-4e70-bf11-a4ad867f279f";

// ─── 1. Перенос обложки ────────────────────────────────────────────────────

const UNSPLASH_URL = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80&fm=jpg";
const sha = crypto.createHash("sha1").update("photo-1476514525535-07fb3b4ae5f1").digest("hex").slice(0, 16);
const storagePath = `u/${sha}.jpg`;

console.log("Скачиваю обложку с Unsplash...");
const imgRes = await fetch(UNSPLASH_URL, { signal: AbortSignal.timeout(30000) });
if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
const buf = Buffer.from(await imgRes.arrayBuffer());

const { error: upErr } = await sb.storage.from("photos").upload(storagePath, buf, {
  contentType: "image/jpeg", cacheControl: "31536000", upsert: true,
});
if (upErr && !upErr.message.includes("already exists")) throw new Error(upErr.message);

const coverUrl = sb.storage.from("photos").getPublicUrl(storagePath).data.publicUrl;
console.log(`✓ Обложка в Storage: ${coverUrl}`);

// ─── 2. Новый контент статьи ───────────────────────────────────────────────

// Таблица для featured snippet — добавляем после первого абзаца (после «...более взвешенно.»)
const TABLE = `
## Топ-10 стран для переезда россиян в 2026 — быстрое сравнение

| Страна | Оценочно уехало | Стоимость жизни в месяц | Безвизовый въезд | Банк открыть |
|---|---|---|---|---|
| Грузия | ~100 тыс. | $1 000–1 500 | ✓ 365 дней | Да |
| Армения | ~80 тыс. | $900–1 300 | ✓ без ограничений | Да |
| Казахстан | ~75 тыс. | $800–1 100 | ✓ без ограничений | Да |
| Сербия | ~110 тыс. | €1 000–1 500 | ✓ 30–90 дней | Сложнее |
| ОАЭ | ~150 тыс. | $2 500–3 500 | ✓ 30–90 дней | Да |
| Турция | ~125 тыс. | $700–1 200 | ✓ 60 дней | Сложно |
| Таиланд | ~50 тыс. | $800–1 800 | ✓ 60 дней | Ограниченно |
| Кипр | ~28 тыс. | €1 500–2 500 | ✓ 90 дней | Сложно |
| Германия | н/д | €2 000–3 000 | Нужна виза | Да |
| Узбекистан | ~30 тыс. | $500–800 | ✓ без ограничений | Да |

Сравнить детальные расходы по любому городу — в [калькуляторе Relocost](/).

`;

// Читаем текущий content_md из файла
const rawFile = fs.readFileSync(
  new URL(`../content/blog/${SLUG}.md`, import.meta.url),
  "utf8"
);

// Убираем frontmatter, берем только body
const bodyMatch = rawFile.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
if (!bodyMatch) throw new Error("Не удалось распарсить frontmatter");
let body = bodyMatch[1].trim();

// Убираем первый H1 (он в title)
body = body.replace(/^# .+\n+/, "");

// Вставляем таблицу после первого раздела (после блока «## Масштаб эмиграции»)
// Точнее — перед ним, чтобы таблица была первым контентом после intro
const introEnd = body.indexOf("\n---\n\n## Масштаб");
if (introEnd === -1) throw new Error("Не найдена точка вставки таблицы");

const intro = body.slice(0, introEnd);
const rest = body.slice(introEnd);
const updatedBody = intro + "\n" + TABLE + rest;

console.log(`✓ Таблица добавлена (${TABLE.length} символов)`);

// ─── 3. Обновление базы ────────────────────────────────────────────────────

const { error: updErr } = await sb.from("blog_posts").update({
  cover_url: coverUrl,
  cover_author_name: "Mesut Kaya",
  cover_author_url: "https://unsplash.com/@directormesut",
  seo_title: "Куда переезжают россияне в 2026: топ-10 стран",
  seo_description: "Куда чаще всего переезжают россияне в 2026 году: топ-10 стран с реальными цифрами — стоимость жизни, визовый режим, банки, тренды. Аналитика Relocost.",
  content_md: updatedBody,
}).eq("id", ARTICLE_ID);

if (updErr) throw new Error(updErr.message);
console.log("✓ Статья обновлена в базе");
console.log(`\nseo_title: «Куда переезжают россияне в 2026: топ-10 стран» (${("Куда переезжают россияне в 2026: топ-10 стран").length} символов)`);
console.log("cover_url: Storage (не Unsplash CDN)");
console.log("Таблица: добавлена в начало");
