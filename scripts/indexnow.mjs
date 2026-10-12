#!/usr/bin/env node
// Уведомляет IndexNow (Яндекс, Bing) о всех страницах сайта после деплоя.
// Читает живой sitemap.xml чтобы не дублировать логику генерации URL.
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const HOST = "relocost.ru";
const KEY = "c4a9f8e2b1d3567f0e8c2a9d4b7e1f3a";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const BATCH = 100;

// Троттлинг: не слать полный пинг всего sitemap чаще раза в THROTTLE_HOURS.
// При частых деплоях (несколько раз в день) это защищает от волны переобхода
// краулерами (см. инцидент 18.09 — VPS лёг под нагрузкой от YandexBot после
// нескольких пингов подряд).
const THROTTLE_HOURS = 8;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, "..", ".indexnow-last-sent");

function hoursSinceLastSend() {
  if (!existsSync(STATE_FILE)) return Infinity;
  const last = Number(readFileSync(STATE_FILE, "utf-8").trim());
  if (!Number.isFinite(last)) return Infinity;
  return (Date.now() - last) / (1000 * 60 * 60);
}

function markSent() {
  writeFileSync(STATE_FILE, String(Date.now()));
}

const hoursSince = hoursSinceLastSend();
if (hoursSince < THROTTLE_HOURS) {
  console.log(
    `IndexNow: пропущено, последняя отправка была ${hoursSince.toFixed(1)} ч. назад (throttle ${THROTTLE_HOURS} ч.)`
  );
  process.exit(0);
}

async function getSitemapUrls() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`Sitemap ${res.status}`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>(https:\/\/relocost\.ru[^<]*)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

async function submitBatch(urls) {
  const res = await fetch("https://yandex.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  });
  return res.status;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const urls = await getSitemapUrls();
console.log(`IndexNow: ${urls.length} URL из sitemap`);

// 2026-10-12: markSent() раньше стоял в самом конце, ПОСЛЕ всех батчей —
// .indexnow-last-sent не обновлялся почти 1.5 месяца (с 25.08), потому что
// каждый прогон падал с необработанным исключением на каком-то батче
// (SocketError от Яндекса — "other side closed", вероятно сам троттлинг на
// их стороне за слишком частые полные пинги) раньше, чем успевал дойти до
// markSent(). Throttle в итоге НИКОГДА не срабатывал — каждый деплой заново
// слал полный sitemap (4000+ URL) в Яндекс, что при частых деплоях (как
// сегодня — 5+ подряд за пару часов) само усугубляло проблему. Теперь
// markSent() вызывается СРАЗУ после проверки throttle, до отправки —
// throttle защёлкивается на 8 часов вперёд независимо от исхода отправки:
// лучше один раз пропустить индексацию, чем раз за разом бомбить Яндекс
// повторными полными пингами при каждом деплое.
markSent();

let okCount = 0;
let failCount = 0;
for (let i = 0; i < urls.length; i += BATCH) {
  const batch = urls.slice(i, i + BATCH);
  const batchNum = Math.floor(i / BATCH) + 1;
  try {
    const status = await submitBatch(batch);
    console.log(`  Батч ${batchNum}: ${batch.length} URL → HTTP ${status}`);
    okCount += batch.length;
  } catch (e) {
    console.log(`  Батч ${batchNum}: ${batch.length} URL → ошибка сети (${e.message}), пропущен`);
    failCount += batch.length;
  }
  // Небольшая пауза между батчами — не слать десятки POST подряд без
  // передышки, похоже именно это могло провоцировать обрыв соединений.
  await sleep(250);
}

console.log(`IndexNow готово: ${okCount} отправлено, ${failCount} пропущено из-за сетевых ошибок.`);
