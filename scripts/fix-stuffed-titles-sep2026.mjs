// 2026-09-22 (SEO-аудит): часть постов blog_posts пришла из отдельного
// Supabase-only пайплайна, минующего content/blog/*.md (генератор писал
// сразу в БД, без прохода через markdown-файлы). У части таких постов
// keyword-stuffed заголовки без пунктуации, часто длиннее 100 символов —
// склеенные ключевые фразы без человеческого оформления.
//
// Почему заголовки генерируются НЕ вызовом Anthropic API из этого скрипта:
// правки заголовков делает Claude Code-агент (та же модель, что пишет этот
// скрипт) в интерактивной сессии — это и есть "генерация языковой моделью",
// просто без лишнего платного API-вызова поверх уже используемого Claude
// Max. Агент сканирует кандидатов (--scan), сам формулирует человеческие
// заголовки, кладет их в JSON-маппинг, затем применяет через --apply
// (сначала dry-run, потом --live) — так автор правки может проверить
// адекватность каждого заголовка перед массовым апдейтом БД.
//
// Использование:
//   node scripts/fix-stuffed-titles-sep2026.mjs --scan [--limit 50]
//     -> находит кандидатов, печатает список, пишет JSON-снэпшот в
//        scripts/_stuffed-titles-scan.json (кандидаты + контекст для правки)
//
//   node scripts/fix-stuffed-titles-sep2026.mjs --apply mapping.json
//     -> dry-run: печатает "было -> стало" по файлу маппинга {slug,newTitle}[]
//
//   node scripts/fix-stuffed-titles-sep2026.mjs --apply mapping.json --live
//     -> применяет title + seo_title (с суффиксом "| Relocost") в Supabase

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import os from "os";
import path from "path";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(H + "/.relocost/supabase_url", "utf8").trim(),
  fs.readFileSync(H + "/.relocost/supabase_service_role_key", "utf8").trim(),
  { auth: { persistSession: false } }
);

const args = process.argv.slice(2);
const LIVE = args.includes("--live");
const limitArg = args.indexOf("--limit");
const LIMIT = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : 50;
const applyArg = args.indexOf("--apply");
const APPLY_FILE = applyArg !== -1 ? args[applyArg + 1] : null;

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const SCAN_OUT = path.join(process.cwd(), "scripts", "_stuffed-titles-scan.json");

function hasNoPunctuation(str) {
  // Признак "склеенных ключевых слов": нет запятой/двоеточия/тире-разделителя
  // между словами (дефис внутри слова типа "кто-то" не считается).
  return !/[,:]|(\s[-—]\s)/.test(str);
}

function isStuffed(str) {
  if (!str) return false;
  return str.length > 90 && hasNoPunctuation(str);
}

function cleanSeoTitleSuffix(title) {
  return title.replace(/(?:\s*\|\s*Relocost\s*)+$/i, " | Relocost").trim();
}

async function scan() {
  const localSlugs = new Set(
    fs.readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
  );
  console.log(`content/blog: ${localSlugs.size} md-файлов`);

  let allPosts = [];
  let from = 0;
  const PAGE = 1000;
  for (;;) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("id,slug,title,seo_title,seo_description,content_md")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    allPosts = allPosts.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  console.log(`blog_posts всего: ${allPosts.length}`);

  const orphans = allPosts.filter((p) => !localSlugs.has(p.slug));
  console.log(`постов без соответствующего .md файла (Supabase-only пайплайн): ${orphans.length}`);

  const stuffed = orphans.filter((p) => isStuffed(p.title) || isStuffed(p.seo_title));
  console.log(`из них с признаками keyword-stuffed заголовка (>90 симв, без пунктуации): ${stuffed.length}`);

  const batch = stuffed.slice(0, LIMIT);
  console.log(`\nВ снэпшот попадет: ${batch.length}${stuffed.length > LIMIT ? ` (LIMIT=${LIMIT}, всего найдено ${stuffed.length} — остальные следующим проходом)` : ""}\n`);

  const snapshot = batch.map((p) => ({
    slug: p.slug,
    oldTitle: p.title,
    oldSeoTitle: p.seo_title,
    seoDescription: p.seo_description || null,
    contentPreview: (p.content_md || "").slice(0, 400),
  }));

  for (const s of snapshot) {
    console.log(`--- ${s.slug} (${s.oldTitle.length} симв.)`);
    console.log(`  ${s.oldTitle}`);
  }

  fs.writeFileSync(SCAN_OUT, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(`\nСнэпшот записан: ${SCAN_OUT}`);
  console.log(`Всего кандидатов (без учета LIMIT): ${stuffed.length}`);
}

async function apply() {
  if (!APPLY_FILE) {
    console.error("Укажи файл маппинга: --apply path/to/mapping.json");
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync(APPLY_FILE, "utf8"));
  if (!Array.isArray(mapping)) {
    console.error("mapping.json должен быть массивом [{slug, newTitle}, ...]");
    process.exit(1);
  }

  const slugs = mapping.map((m) => m.slug);
  const { data: current, error } = await sb
    .from("blog_posts")
    .select("id,slug,title,seo_title")
    .in("slug", slugs);
  if (error) throw error;
  const bySlug = new Map(current.map((p) => [p.slug, p]));

  const plan = [];
  for (const m of mapping) {
    const post = bySlug.get(m.slug);
    if (!post) {
      console.warn(`[skip] ${m.slug}: не найден в blog_posts`);
      continue;
    }
    if (!m.newTitle || m.newTitle.length > 70) {
      console.warn(`[skip] ${m.slug}: newTitle отсутствует или длиннее 70 символов`);
      continue;
    }
    const newSeoTitle = cleanSeoTitleSuffix(
      m.newTitle.endsWith("| Relocost") ? m.newTitle : `${m.newTitle} | Relocost`
    );
    plan.push({ id: post.id, slug: m.slug, oldTitle: post.title, newTitle: m.newTitle, newSeoTitle });
  }

  console.log(`План правок: ${plan.length}\n`);
  for (const p of plan) {
    console.log(`--- ${p.slug}`);
    console.log(`  было:  ${p.oldTitle}`);
    console.log(`  стало: ${p.newTitle}`);
    console.log(`  seo:   ${p.newSeoTitle}`);
  }

  if (!LIVE) {
    console.log(`\nDRY-RUN: в БД ничего не записано (${plan.length} записей готовы). Запусти с --live для применения.`);
    return;
  }

  console.log("\n--live: применяем апдейты...");
  let updated = 0;
  for (const p of plan) {
    const { error: updErr } = await sb
      .from("blog_posts")
      .update({ title: p.newTitle, seo_title: p.newSeoTitle })
      .eq("id", p.id);
    if (updErr) {
      console.error(`  [ERR] ${p.slug}: ${updErr.message}`);
      continue;
    }
    updated += 1;
  }
  console.log(`Обновлено постов в Supabase: ${updated} / ${plan.length}`);
}

async function main() {
  if (APPLY_FILE) {
    await apply();
  } else {
    await scan();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
