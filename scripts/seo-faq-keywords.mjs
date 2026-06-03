// Разовый скрипт: добавляет в FAQ-вопросы городов название города в предложном
// падеже (главный SEO-ключевик + FAQPage-схема). Ответы не трогаем.
// Пропускаем вопросы-сравнения и те, где локация уже задана.
// Запуск: node scripts/seo-faq-keywords.mjs
import fs from "node:fs";

const FILE = new URL("../lib/cities-content.ts", import.meta.url);
const src = fs.readFileSync(FILE, "utf8");

// slug -> предложная форма с предлогом
const PHRASE = {
  tbilisi: "в Тбилиси", yerevan: "в Ереване", belgrade: "в Белграде",
  dubai: "в Дубае", bali: "на Бали", bangkok: "в Бангкоке",
  almaty: "в Алматы", krasnodar: "в Краснодаре", sochi: "в Сочи",
  moscow: "в Москве", spb: "в Санкт-Петербурге", istanbul: "в Стамбуле",
  alanya: "в Алании", limassol: "в Лимассоле", budapest: "в Будапеште",
  lisbon: "в Лиссабоне", kaliningrad: "в Калининграде", bishkek: "в Бишкеке",
  tashkent: "в Ташкенте", minsk: "в Минске", podgorica: "в Подгорице",
  batumi: "в Батуми", antalya: "в Анталье", phuket: "на Пхукете",
  kutaisi: "в Кутаиси", budva: "в Будве", sofia: "в Софии",
  varna: "в Варне", athens: "в Афинах", valencia: "в Валенсии",
  nicosia: "в Никосии", paphos: "в Пафосе", dubrovnik: "в Дубровнике",
  barcelona: "в Барселоне", prague: "в Праге", goa: "на Гоа",
};

// Стемы названий городов (вкл. сравнительные направления) — если встречаются
// в вопросе, локация уже есть → пропускаем.
const CITY_STEMS = [
  "тбилиси", "ереван", "белград", "дубай", "дубае", "бали", "бангкок",
  "алматы", "краснодар", "сочи", "петербург", "стамбул", "алания", "алани",
  "лимассол", "будапешт", "лиссабон", "калининград", "бишкек", "ташкент",
  "минск", "подгориц", "батуми", "анталь", "пхукет", "кутаиси", "будва",
  "будве", "софия", "софии", "варна", "варне", "афины", "афинах", "валенси",
  "никоси", "пафос", "дубровник", "барселон", "прага", "праге", "гоа",
  "дананг", "хошимин", "нячанг", "чиангмай",
];

function skip(q) {
  const low = q.toLowerCase();
  if (/отлича|^чем |европ|за границ|летать|добраться|ездить/.test(low)) return true;
  if (/\bес\b/.test(low)) return true;            // «в ЕС?»
  if (/росси[яиюей]\b/.test(low)) return true;    // Россия как место
  if (low.includes("москв")) return true;          // сравнение с Москвой
  for (const s of CITY_STEMS) if (low.includes(s)) return true;
  return false;
}

const KNOWN = new Set(Object.keys(PHRASE));
const lines = src.split("\n");
let current = null;
let changed = 0;

const cityKey = /^ {2}([a-z_]+): \{$/;
const qLine = /^(\s*)\{ question: "([^"]*)"/;

const out = lines.map((line) => {
  const km = line.match(cityKey);
  if (km && KNOWN.has(km[1])) {
    current = km[1];
    return line;
  }
  const qm = line.match(qLine);
  if (qm && current) {
    const q = qm[2];
    if (!skip(q) && q.endsWith("?")) {
      const newQ = q.slice(0, -1).trimEnd() + ` ${PHRASE[current]}?`;
      changed++;
      return line.replace(`question: "${q}"`, `question: "${newQ}"`);
    }
  }
  return line;
});

fs.writeFileSync(FILE, out.join("\n"), "utf8");
console.log(`Готово. Переписано вопросов: ${changed}`);
