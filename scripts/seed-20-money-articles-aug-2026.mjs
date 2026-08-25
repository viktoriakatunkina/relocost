// 20 SEO-статей блога Relocost — коммерческий интент (decision-stage): «под
// ключ» сметы переезда, сколько накопить перед отъездом, точный бюджет на
// одного/пару/семью (household.ts множители), прямые сравнения городов с
// реальным спросом по данным /compare (Я.Метрика 90д). Не дублирует темы
// сегодняшних 35 статей (рейтинги, топ-5 городов Лондон/Париж/СПб/
// Калининград/Осака, узкие темы вроде воинского учета).
//
// Формат файлов — как в seed-blog-batch.mjs: SEO_TITLE / SEO_DESCRIPTION /
// READ_TIME + ---CONTENT---. city_id проставляется по слагу города в cities
// (нужен для автоматического inline-CTA механизма). Идемпотентно: upsert по
// slug.
//
// ВАЖНО: используем сырой REST fetch с явным AbortController-таймаутом
// вместо supabase-js — под сегодняшней нагрузкой (параллельные агенты)
// supabase-js виснет на одном запросе на много минут без внятного таймаута,
// а короткий fetch-таймаут с повторными попытками и паузами реально
// пробивается через перегруженную базу (проверено на price-data фетчере).
//
// Запуск: node scripts/seed-20-money-articles-aug-2026.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const HOME = os.homedir();
const SB_URL = fs.readFileSync(path.join(HOME, ".relocost/supabase_url"), "utf8").trim();
const SB_KEY = fs.readFileSync(path.join(HOME, ".relocost/supabase_service_role_key"), "utf8").trim();

const DIR = path.join(HOME, "Desktop/Работа/Клод/relocost/content/blog");

// city — slug города в таблице cities (для city_id и обложки). null — без привязки.
const META = [
  // Сравнения (реальный спрос по /compare, Я.Метрика 90д)
  { slug: "moskva-ili-erevan-2026", title: "Москва или Ереван: где дешевле жить и сколько нужно зарабатывать в 2026", tag: "Сравнение", city: "yerevan" },
  { slug: "minsk-ili-moskva-2026", title: "Минск или Москва: где дешевле жить в 2026 году", tag: "Сравнение", city: "minsk" },
  { slug: "sankt-peterburg-ili-ekaterinburg-2026", title: "Санкт-Петербург или Екатеринбург: сравнение стоимости жизни 2026", tag: "Сравнение", city: "yekaterinburg" },
  { slug: "batumi-ili-kutaisi-2026", title: "Батуми или Кутаиси: куда переехать в Грузии в 2026 году", tag: "Сравнение", city: "kutaisi" },
  { slug: "tashkent-ili-tbilisi-2026", title: "Ташкент или Тбилиси: где дешевле жить и легче вести бизнес в 2026", tag: "Сравнение", city: "tbilisi" },
  { slug: "kazan-ili-moskva-2026", title: "Казань или Москва: где дешевле жить в 2026 году", tag: "Сравнение", city: "kazan" },
  { slug: "moskva-ili-almaty-2026", title: "Москва или Алматы: где дешевле жить в 2026 году", tag: "Сравнение", city: "almaty" },
  // Переезд под ключ (виза + перелет + депозит + первый месяц одним списком)
  { slug: "pereezd-v-tbilisi-pod-klyuch-2026", title: "Переезд в Тбилиси под ключ 2026: виза, перелет, депозит и первый месяц одним списком", tag: "Финансы", city: "tbilisi" },
  { slug: "pereezd-v-erevan-pod-klyuch-2026", title: "Переезд в Ереван под ключ 2026: сколько денег нужно на старте", tag: "Финансы", city: "yerevan" },
  { slug: "pereezd-v-belgrad-pod-klyuch-2026", title: "Переезд в Белград под ключ 2026: полная смета расходов на старте", tag: "Финансы", city: "belgrade" },
  { slug: "pereezd-v-almaty-pod-klyuch-2026", title: "Переезд в Алматы под ключ 2026: сколько денег взять с собой", tag: "Финансы", city: "almaty" },
  { slug: "pereezd-v-dubai-pod-klyuch-2026", title: "Переезд в Дубай под ключ 2026: полная смета от визы до первой аренды", tag: "Финансы", city: "dubai" },
  // Сколько накопить перед переездом (стартовый капитал, не помесячный бюджет)
  { slug: "skolko-nakopit-pered-pereezdom-v-batumi-2026", title: "Сколько нужно накопить перед переездом в Батуми в 2026 году", tag: "Финансы", city: "batumi" },
  { slug: "skolko-nakopit-pered-pereezdom-v-astanu-2026", title: "Сколько нужно накопить перед переездом в Астану в 2026 году", tag: "Финансы", city: "astana" },
  { slug: "skolko-nakopit-pered-pereezdom-v-bishkek-2026", title: "Сколько нужно накопить перед переездом в Бишкек в 2026 году", tag: "Финансы", city: "bishkek" },
  { slug: "skolko-nakopit-pered-pereezdom-v-gyumri-2026", title: "Сколько нужно накопить перед переездом в Гюмри в 2026 году", tag: "Финансы", city: "gyumri" },
  // Точный бюджет на одного/пару/семью (household.ts множители)
  { slug: "aktau-byudzhet-odin-para-semya-2026", title: "Актау: точный бюджет на одного, пару и семью в 2026 году", tag: "Финансы", city: "aktau" },
  { slug: "minsk-byudzhet-odin-para-semya-2026", title: "Минск: точный бюджет на одного, пару и семью в 2026 году", tag: "Финансы", city: "minsk" },
  { slug: "baku-byudzhet-odin-para-semya-2026", title: "Баку: точный бюджет на одного, пару и семью в 2026 году", tag: "Финансы", city: "baku" },
  { slug: "alanya-byudzhet-odin-para-semya-2026", title: "Аланья: точный бюджет на одного, пару и семью в 2026 году", tag: "Финансы", city: "alanya" },
];

function parseArticle(raw) {
  let text = raw.replace(/^﻿/, "");
  const marker = text.indexOf("---CONTENT---");
  if (marker === -1) throw new Error("нет маркера ---CONTENT---");
  const header = text.slice(0, marker);
  let body = text.slice(marker + "---CONTENT---".length).replace(/^\s*\n/, "").trim();
  body = body.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  body = body.replace(/^#\s+.*\n+/, "");
  const seoTitle = (header.match(/^SEO_TITLE:\s*(.+)$/m) || [])[1]?.trim() || null;
  const seoDesc = (header.match(/^SEO_DESCRIPTION:\s*(.+)$/m) || [])[1]?.trim() || null;
  const rtRaw = (header.match(/^READ_TIME:\s*(\d+)/m) || [])[1];
  const words = body.split(/\s+/).filter(Boolean).length;
  let readTime = rtRaw ? parseInt(rtRaw, 10) : Math.round(words / 170);
  readTime = Math.max(6, Math.min(20, readTime || 10));
  return { seoTitle, seoDesc, readTime, body, words };
}

async function fetchWithTimeout(url, opts = {}, timeoutMs = 40000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(t);
  }
}

async function withRetry(label, fn, tries = 6, baseDelay = 40000) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fn();
      console.error(`OK: ${label}`);
      return r;
    } catch (e) {
      console.error(`${label} attempt ${i + 1}/${tries} failed: ${e.message}`);
      if (i === tries - 1) throw e;
      console.error(`  waiting ${baseDelay}ms before retry...`);
      await new Promise((r) => setTimeout(r, baseDelay));
    }
  }
}

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

async function run() {
  const cities = await withRetry("cities lookup", () =>
    fetchWithTimeout(
      `${SB_URL}/rest/v1/cities?select=id,slug,unsplash_url,unsplash_author_name,unsplash_author_url`,
      { headers },
      40000
    )
  );
  const cityBySlug = new Map(cities.map((c) => [c.slug, c]));

  let ok = 0, fail = 0;
  for (const m of META) {
    const file = path.join(DIR, `${m.slug}.md`);
    if (!fs.existsSync(file)) {
      console.error(`✗ ${m.slug}: файл не найден, пропуск`);
      fail++;
      continue;
    }
    let parsed;
    try {
      parsed = parseArticle(fs.readFileSync(file, "utf8"));
    } catch (e) {
      console.error(`✗ ${m.slug}: ${e.message}`);
      fail++;
      continue;
    }

    let cover = {};
    const c = m.city ? cityBySlug.get(m.city) : null;
    if (m.city && !c) {
      console.error(`⚠ ${m.slug}: город "${m.city}" не найден в cities — city_id будет null`);
    }
    if (c?.unsplash_url) {
      cover = { cover_url: c.unsplash_url, cover_author_name: c.unsplash_author_name, cover_author_url: c.unsplash_author_url };
    }

    const row = {
      slug: m.slug,
      title: m.title,
      tag: m.tag,
      city_id: c?.id ?? null,
      read_time: parsed.readTime,
      content_md: parsed.body,
      seo_title: parsed.seoTitle,
      seo_description: parsed.seoDesc,
      published: true,
      ...cover,
    };

    try {
      await withRetry(`upsert ${m.slug}`, () =>
        fetchWithTimeout(
          `${SB_URL}/rest/v1/blog_posts?on_conflict=slug`,
          {
            method: "POST",
            headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify(row),
          },
          40000
        )
      );
      console.log(`✓ ${m.slug} — ${parsed.words} слов, ${parsed.readTime} мин, city:${m.city || "—"}, city_id:${c?.id ? "да" : "нет"}`);
      ok++;
    } catch (e) {
      console.error(`✗ ${m.slug}: не удалось записать — ${e.message}`);
      fail++;
    }
    // мягкая пауза между вставками — не долбим базу подряд
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`\nГотово. Опубликовано/обновлено: ${ok}, проблемных: ${fail}.`);
  if (ok > 0) {
    console.log(`Next: node scripts/fill-blog-images.mjs   (обложки/inline-картинки из storage, если ещё не проставлены)`);
  }
  if (fail > 0) process.exitCode = 1;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
