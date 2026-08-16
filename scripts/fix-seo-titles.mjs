import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import os from 'os';
const H = os.homedir();
const sb = createClient(
  fs.readFileSync(H+'/.relocost/supabase_url','utf8').trim(),
  fs.readFileSync(H+'/.relocost/supabase_service_role_key','utf8').trim(),
  {auth:{persistSession:false}}
);

// Сокращаем до 60 симв по границе слова
function shorten(str, maxLen = 58) {
  if (!str) return '';
  // Убираем суффикс " | Relocost" — он добавляется в <title> автоматически
  str = str.replace(/\s*\|\s*Relocost\s*$/i, '').trim();
  if (str.length <= maxLen) return str;
  // Обрезаем по последнему пробелу/запятой/точке/разделителю
  let cut = str.slice(0, maxLen);
  const lastBreak = Math.max(
    cut.lastIndexOf(' '),
    cut.lastIndexOf(','),
    cut.lastIndexOf(';'),
    cut.lastIndexOf(':'),
    cut.lastIndexOf('—'),
  );
  if (lastBreak > maxLen * 0.6) cut = cut.slice(0, lastBreak);
  return cut.trim().replace(/[,;:\s]+$/, '');
}

// Для очень длинных (>200 симв) — берём title статьи, оно короче и чище
function buildFromTitle(title, maxLen = 58) {
  if (!title) return '';
  // title обычно: "Страна Город переезд DN 2026: $X аренда; факт1; факт2"
  // Берём всё до первой точки с запятой после двоеточия, либо просто обрезаем
  let t = title;
  // Убираем денежные суффиксы в конце: "; дешевле Амстердама; дизайн-столица"
  const colonIdx = t.indexOf(':');
  if (colonIdx > 0 && colonIdx < 50) {
    // Есть "Город 2026: ценность1; ценность2" — берём "Город 2026: ценность1"
    const afterColon = t.slice(colonIdx + 1).trim();
    const firstSemi = afterColon.indexOf(';');
    if (firstSemi > 0) {
      const shortTitle = t.slice(0, colonIdx + 1 + firstSemi).trim();
      if (shortTitle.length <= maxLen) return shortTitle;
    }
  }
  return shorten(t, maxLen);
}

const { data: posts } = await sb
  .from('blog_posts')
  .select('id, slug, title, seo_title')
  .eq('published', true);

const toFix = posts.filter(p => p.seo_title && p.seo_title.length > 65);
console.log(`Статей с длинным seo_title: ${toFix.length}`);

let fixed = 0, skipped = 0, errors = 0;

for (const p of toFix) {
  let newTitle;
  if (p.seo_title.length > 200) {
    // Явно битое — строим из title
    newTitle = buildFromTitle(p.title);
  } else {
    // Просто чуть длиннее 65 — обрезаем умно
    newTitle = shorten(p.seo_title);
  }

  if (!newTitle || newTitle.length > 65) {
    // Крайний случай — жёсткий обрез
    newTitle = (newTitle || p.title || p.slug).slice(0, 58).trim();
  }

  const { error } = await sb
    .from('blog_posts')
    .update({ seo_title: newTitle })
    .eq('id', p.id);

  if (error) {
    console.log('[ERR]', p.slug, error.message);
    errors++;
  } else {
    console.log(`[OK] ${newTitle.length}с "${newTitle}"`);
    fixed++;
  }
}

console.log(`\nГотово: ${fixed} исправлено, ${skipped} пропущено, ${errors} ошибок`);
