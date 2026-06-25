// Seed двенадцатой партии: 10 городов в 10 новых странах (Центр./Зап. Европа + Балтика).
// Растит и число городов (99 -> 109), и число стран (46 -> 56) — счётчики на сайте
// (lib/site-stats.ts getSiteStats) обновятся сами после редеплоя.
// Запуск: node scripts/seed-batch-12.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SUPA_URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const UNSPLASH = fs.readFileSync(path.join(os.homedir(), ".relocost/unsplash_access_key"), "utf8").trim();
const sb = createClient(SUPA_URL, KEY, { auth: { persistSession: false } });

const CITIES = [
  { name_ru:"Берлин", name_en:"Berlin", slug:"berlin", country_ru:"Германия", country_en:"Germany", country_slug:"germany", flag_emoji:"🇩🇪", population:"3.7 млн", climate:"+10°C ср.", language:"Немецкий, английский", currency:"Евро, EUR", flight_from_moscow:"6 часов с пересадкой", is_foreign:true, difficulty_score:4, is_popular:true, intro_text:"Столица Германии и крупнейший IT- и стартап-хаб Европы: высокие зарплаты, мощная культурная среда и большое русскоязычное комьюнити. Минусы для россиян — шенгенскую визу и ВНЖ оформить сложно, аренда дорогая и ищется долго, зимой пасмурно.", lat:52.5200, lng:13.4050, unsplash_query:"berlin germany city" },
  { name_ru:"Вена", name_en:"Vienna", slug:"vienna", country_ru:"Австрия", country_en:"Austria", country_slug:"austria", flag_emoji:"🇦🇹", population:"1.9 млн", climate:"+11°C ср.", language:"Немецкий, английский", currency:"Евро, EUR", flight_from_moscow:"5.5 часа с пересадкой", is_foreign:true, difficulty_score:4, is_popular:false, intro_text:"Столица Австрии, регулярно возглавляющая рейтинги качества жизни: безопасность, отличный общественный транспорт и развитая культурная среда. Минусы — шенгенская виза и ВНЖ для россиян, высокие налоги и сдержанный местный уклад.", lat:48.2082, lng:16.3738, unsplash_query:"vienna austria city" },
  { name_ru:"Париж", name_en:"Paris", slug:"paris", country_ru:"Франция", country_en:"France", country_slug:"france", flag_emoji:"🇫🇷", population:"2.1 млн", climate:"+12°C ср.", language:"Французский, английский", currency:"Евро, EUR", flight_from_moscow:"7 часов с пересадкой", is_foreign:true, difficulty_score:4, is_popular:true, intro_text:"Столица Франции и один из главных городов мира: культура, карьерные возможности и насыщенная городская жизнь. Минусы — высокая стоимость аренды, шенгенская виза и сложная легализация для россиян, плотность и суета мегаполиса.", lat:48.8566, lng:2.3522, unsplash_query:"paris france eiffel tower" },
  { name_ru:"Рим", name_en:"Rome", slug:"rome", country_ru:"Италия", country_en:"Italy", country_slug:"italy", flag_emoji:"🇮🇹", population:"2.8 млн", climate:"+16°C ср.", language:"Итальянский, английский", currency:"Евро, EUR", flight_from_moscow:"7 часов с пересадкой", is_foreign:true, difficulty_score:4, is_popular:true, intro_text:"Столица Италии с тысячелетней историей: мягкий средиземноморский климат, богатейшая культура и неспешный южный ритм. Минусы — шенгенская виза для россиян, тяжелая бюрократия, пробки и местами уставшая инфраструктура.", lat:41.9028, lng:12.4964, unsplash_query:"rome italy colosseum" },
  { name_ru:"Амстердам", name_en:"Amsterdam", slug:"amsterdam", country_ru:"Нидерланды", country_en:"Netherlands", country_slug:"netherlands", flag_emoji:"🇳🇱", population:"920 тыс", climate:"+10°C ср.", language:"Нидерландский, английский", currency:"Евро, EUR", flight_from_moscow:"6.5 часа с пересадкой", is_foreign:true, difficulty_score:4, is_popular:true, intro_text:"Столица Нидерландов и крупный IT-хаб с почти поголовным английским: высокие зарплаты, велосипедная культура и удобная городская среда. Минусы — острый дефицит и дороговизна жилья, шенгенская виза для россиян и сырой ветреный климат.", lat:52.3676, lng:4.9041, unsplash_query:"amsterdam netherlands canal" },
  { name_ru:"Любляна", name_en:"Ljubljana", slug:"ljubljana", country_ru:"Словения", country_en:"Slovenia", country_slug:"slovenia", flag_emoji:"🇸🇮", population:"285 тыс", climate:"+11°C ср.", language:"Словенский, английский", currency:"Евро, EUR", flight_from_moscow:"6 часов с пересадкой", is_foreign:true, difficulty_score:4, is_popular:false, intro_text:"Зеленая столица Словении между Альпами и Адриатикой: компактный безопасный город, природа рядом и спокойный ритм жизни. Минусы — небольшой рынок труда, шенгенская виза для россиян и более высокие цены, чем на Балканах.", lat:46.0569, lng:14.5058, unsplash_query:"ljubljana slovenia city" },
  { name_ru:"Варшава", name_en:"Warsaw", slug:"warsaw", country_ru:"Польша", country_en:"Poland", country_slug:"poland", flag_emoji:"🇵🇱", population:"1.8 млн", climate:"+9°C ср.", language:"Польский, английский", currency:"Злотый, PLN", flight_from_moscow:"4 часа с пересадкой", is_foreign:true, difficulty_score:4, is_popular:false, intro_text:"Столица Польши и один из главных центров релокации в Восточной Европе: развитый рынок труда, понятная среда и цены ниже западноевропейских. Минусы — шенгенская виза для россиян, бюрократия с легализацией и холодная зима.", lat:52.2297, lng:21.0122, unsplash_query:"warsaw poland old town" },
  { name_ru:"Таллин", name_en:"Tallinn", slug:"tallinn", country_ru:"Эстония", country_en:"Estonia", country_slug:"estonia", flag_emoji:"🇪🇪", population:"450 тыс", climate:"+6°C ср.", language:"Эстонский, русский, английский", currency:"Евро, EUR", flight_from_moscow:"4.5 часа с пересадкой", is_foreign:true, difficulty_score:4, is_popular:false, intro_text:"Столица Эстонии и витрина цифрового государства: сильный IT-сектор, e-Residency и удобные онлайн-сервисы. Минусы — строгие ограничения на въезд и ВНЖ для россиян, высокие цены и долгая темная зима.", lat:59.4370, lng:24.7536, unsplash_query:"tallinn estonia old town" },
  { name_ru:"Рига", name_en:"Riga", slug:"riga", country_ru:"Латвия", country_en:"Latvia", country_slug:"latvia", flag_emoji:"🇱🇻", population:"610 тыс", climate:"+7°C ср.", language:"Латышский, русский", currency:"Евро, EUR", flight_from_moscow:"4 часа с пересадкой", is_foreign:true, difficulty_score:4, is_popular:false, intro_text:"Столица Латвии на Балтике: компактный город с русским языком в быту, морем рядом и европейской инфраструктурой. Минусы — визу и ВНЖ для россиян сейчас оформить трудно, небольшой рынок труда и долгая серая зима.", lat:56.9496, lng:24.1052, unsplash_query:"riga latvia old town" },
  { name_ru:"Вильнюс", name_en:"Vilnius", slug:"vilnius", country_ru:"Литва", country_en:"Lithuania", country_slug:"lithuania", flag_emoji:"🇱🇹", population:"590 тыс", climate:"+7°C ср.", language:"Литовский, русский, английский", currency:"Евро, EUR", flight_from_moscow:"4 часа с пересадкой", is_foreign:true, difficulty_score:4, is_popular:false, intro_text:"Столица Литвы: уютный исторический центр, развитый финтех-сектор и спокойный ритм жизни. Минусы — ограничения на визы и ВНЖ для россиян, небольшой рынок труда и холодная балтийская зима.", lat:54.6872, lng:25.2797, unsplash_query:"vilnius lithuania old town" },
];

// Категория, название и флаг premium — фиксированы; меняются только суммы (RUB/мес).
const ITEMS = [
  ["rent","Комната",false],
  ["rent","1-комн. квартира в центре",false],
  ["rent","1-комн. квартира на окраине",false],
  ["rent","2-комн. квартира в центре",false],
  ["food","Обед в кафе",false],
  ["food","Ужин на двоих в ресторане",false],
  ["food","Капучино",false],
  ["food","Продукты на месяц на 1 человека",false],
  ["transport","Месячный проездной",false],
  ["transport","Такси 3 км",false],
  ["transport","Бензин (1 л)",false],
  ["utilities","ЖКХ за 1-комн. квартиру",false],
  ["utilities","Домашний интернет",false],
  ["utilities","Мобильная связь (месяц)",false],
  ["cafe","Стейк в ресторане среднего класса",true],
  ["cafe","Коктейль в баре",true],
  ["health","Визит к частному врачу",true],
  ["health","Абонемент в фитнес-клуб (мес)",true],
  ["entertainment","Билет в кино",true],
  ["entertainment","Бокал вина или коктейль в баре",true],
];

// [min,max] в той же последовательности, что ITEMS (20 пар), в рублях/мес.
const RANGES = {
  berlin:    [[45000,75000],[100000,160000],[75000,120000],[140000,220000],[1300,2400],[6000,12000],[350,550],[28000,42000],[5000,7000],[900,1500],[170,200],[10000,20000],[2000,3200],[1200,2500],[3500,7000],[1100,2200],[5000,10000],[3000,6500],[800,1300],[800,1600]],
  vienna:    [[42000,72000],[95000,150000],[70000,115000],[135000,210000],[1400,2500],[6500,12500],[350,550],[27000,41000],[3500,5500],[900,1600],[160,200],[10000,20000],[2000,3200],[1000,2200],[3800,7500],[1100,2200],[5000,10000],[3000,6500],[800,1300],[700,1500]],
  paris:     [[60000,100000],[130000,210000],[95000,150000],[180000,280000],[1600,2800],[7000,14000],[400,650],[32000,48000],[6000,8500],[1000,1800],[180,220],[11000,22000],[2200,3500],[1300,2600],[4500,9000],[1300,2600],[5500,11000],[4000,8000],[900,1500],[900,1800]],
  rome:      [[40000,70000],[90000,150000],[65000,110000],[130000,200000],[1300,2400],[6000,12000],[250,450],[26000,40000],[3500,5500],[900,1600],[180,220],[10000,20000],[2000,3000],[1000,2000],[3500,7000],[1100,2200],[5000,10000],[3500,7000],[800,1300],[700,1500]],
  amsterdam: [[60000,100000],[130000,200000],[95000,150000],[175000,270000],[1500,2700],[7000,13000],[400,600],[30000,46000],[6000,8500],[1100,1900],[190,230],[11000,22000],[2200,3400],[1200,2400],[4200,8500],[1300,2500],[5500,11000],[3500,7000],[900,1500],[900,1800]],
  ljubljana: [[30000,52000],[70000,110000],[50000,85000],[95000,150000],[1100,2000],[5000,10000],[250,450],[24000,36000],[2800,4500],[700,1300],[160,200],[9000,18000],[1800,2800],[900,1800],[3200,6000],[900,1800],[4500,9000],[3000,6000],[700,1200],[600,1300]],
  warsaw:    [[28000,48000],[55000,95000],[40000,70000],[80000,130000],[900,1800],[4500,9000],[280,480],[22000,34000],[2500,4000],[600,1200],[150,190],[8000,17000],[1500,2500],[800,1600],[2800,5500],[900,1800],[4000,8000],[2800,5500],[600,1100],[600,1200]],
  tallinn:   [[32000,55000],[70000,115000],[50000,85000],[95000,150000],[1200,2200],[5500,11000],[350,550],[25000,38000],[2000,3500],[700,1300],[160,200],[9000,19000],[1800,2800],[1000,2000],[3300,6500],[1000,2000],[4500,9000],[3000,6000],[700,1200],[700,1400]],
  riga:      [[26000,46000],[50000,85000],[36000,62000],[72000,120000],[1000,1900],[4500,9000],[300,500],[22000,34000],[2200,3800],[600,1200],[160,200],[9000,18000],[1500,2500],[800,1600],[2800,5500],[900,1800],[4000,8000],[2800,5500],[600,1100],[600,1200]],
  vilnius:   [[28000,48000],[52000,88000],[38000,65000],[75000,125000],[1000,1900],[4800,9500],[300,500],[22000,34000],[2000,3500],[600,1200],[160,200],[9000,18000],[1500,2500],[800,1600],[2900,5700],[900,1800],[4000,8000],[2800,5500],[600,1100],[600,1200]],
};

const PRICES = Object.fromEntries(
  Object.entries(RANGES).map(([slug, ranges]) => [
    slug,
    ITEMS.map(([cat, item, prem], i) => [cat, item, ranges[i][0], ranges[i][1], prem]),
  ])
);

const PREP = {
  berlin:"в Берлине", vienna:"в Вене", paris:"в Париже", rome:"в Риме",
  amsterdam:"в Амстердаме", ljubljana:"в Любляне", warsaw:"в Варшаве",
  tallinn:"в Таллине", riga:"в Риге", vilnius:"в Вильнюсе",
};

function seoFor(c) {
  const phrase = PREP[c.slug] ?? `в ${c.name_ru}`;
  if (!c.is_foreign) {
    return {
      seo_title: `Стоимость жизни ${phrase} 2026: аренда, цены, отзывы | Relocost`,
      seo_description: `Сколько стоит жизнь ${phrase} в месяц: аренда, еда, транспорт, зарплаты и отзывы переехавших. Считаем реальный бюджет переезда в калькуляторе Relocost.`,
    };
  }
  return {
    seo_title: `Стоимость жизни ${phrase} 2026: виза, цены, отзывы | Relocost`,
    seo_description: `Сколько стоит жизнь ${phrase} в месяц, нужна ли виза россиянам, работа, аренда и отзывы переехавших. Реальный бюджет переезда — в калькуляторе Relocost.`,
  };
}

async function fetchUnsplash(query) {
  const u = new URL("https://api.unsplash.com/search/photos");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "5");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!res.ok) throw new Error(`Unsplash ${query}: ${res.status}`);
  const json = await res.json();
  const pick = json.results?.[0];
  if (!pick) return null;
  return { photo_id: pick.id, base_url: pick.urls.raw, author_name: pick.user.name, author_url: pick.user.links.html };
}

async function run() {
  for (const c of CITIES) {
    const { data: existing } = await sb.from("cities").select("id").eq("slug", c.slug).maybeSingle();
    if (existing) { console.log(`skip (exists): ${c.slug}`); continue; }
    let photo = null;
    try { photo = await fetchUnsplash(c.unsplash_query); } catch (e) { console.warn(`unsplash failed for ${c.slug}: ${e.message}`); }
    const seo = seoFor(c);
    const row = {
      name_ru: c.name_ru, name_en: c.name_en, slug: c.slug,
      country_ru: c.country_ru, country_en: c.country_en, country_slug: c.country_slug,
      flag_emoji: c.flag_emoji, population: c.population, climate: c.climate,
      language: c.language, currency: c.currency, flight_from_moscow: c.flight_from_moscow,
      is_foreign: c.is_foreign, difficulty_score: c.difficulty_score, is_popular: c.is_popular,
      seo_title: seo.seo_title, seo_description: seo.seo_description, intro_text: c.intro_text,
      lat: c.lat, lng: c.lng,
      unsplash_photo_id: photo?.photo_id ?? null, unsplash_url: photo?.base_url ?? null,
      unsplash_author_name: photo?.author_name ?? null, unsplash_author_url: photo?.author_url ?? null,
    };
    const { data: inserted, error } = await sb.from("cities").insert(row).select("id").single();
    if (error) throw new Error(`insert ${c.slug}: ${error.message}`);
    const cityId = inserted.id;
    const prices = (PRICES[c.slug] || []).map(([cat, item, min, max, prem]) => ({
      city_id: cityId, category: cat, item_name_ru: item, price_min: min, price_max: max, is_premium: prem,
    }));
    if (prices.length) {
      const { error: pErr } = await sb.from("prices").insert(prices);
      if (pErr) throw new Error(`prices ${c.slug}: ${pErr.message}`);
    }
    console.log(`+ ${c.slug}: city + ${prices.length} prices${photo ? " + photo" : ""}`);
  }
  console.log("done.");
}

run().catch((e) => { console.error(e); process.exit(1); });
