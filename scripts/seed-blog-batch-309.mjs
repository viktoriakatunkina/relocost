import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import os from 'os';
const H = os.homedir();
const SUPA_URL = fs.readFileSync(H+'/.relocost/supabase_url','utf8').trim();
const SUPA_KEY = fs.readFileSync(H+'/.relocost/supabase_service_role_key','utf8').trim();
const sb = createClient(SUPA_URL, SUPA_KEY, {auth:{persistSession:false}});
async function getPhoto(q) { return null; }

const POSTS = [
  {
    slug: 'niderlandy-ejndhoven-tilburg-dn-2026',
    title: 'Нидерланды Эйндховен Тилбург DN 2026: ASML €300B, 30% Ruling, €1 000-1 800 аренда, дизайн',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Нидерланды Эйндховен Тилбург DN 2026 ASML 30% Ruling аренда дизайн переезд дешевле Амстердама',
    seo_description: 'Нидерланды Эйндховен Тилбург DN 2026 ASML 30% Ruling аренда дизайн переезд',
    content_md: `# Нидерланды Эйндховен DN 2026: ASML €300B, 30% Ruling, €1 000-1 800 аренда — 30% дешевле Амстердама

Эйндховен — нидерландский технологический центр без амстердамских цен. ASML ($300B!): производит 100% EUV-литографов мира (без них нет чипов!). 30% Ruling: налоговая льгота для иностранцев (30% дохода не облагается!). Philips (основан здесь). Dutch Design Week. €1 000-1 800 аренда (vs €1 800-3 000+ в Амстердаме).

---

## Эйндховен vs Амстердам

| Параметр | Эйндховен | Амстердам |
|---------|----------|----------|
| Аренда 2-комн | €1 000-1 800 | €1 800-3 000+ |
| Атмосфера | Технологический; дизайн | Туристический; cosmopolitan |
| До Амстердама | 1.5ч поезд | — |
| Tech-компании | ASML; Philips; NXP | ASML-штаб; Booking; Uber |
| Cycling культура | Да (нидерланды!) | Да |

---

## ASML: почему важно

| Факт | Описание |
|------|---------|
| Продукт | EUV (Extreme Ultraviolet Lithography) машины |
| Позиция | 100% мировой рынок EUV; монополия! |
| Клиенты | TSMC; Samsung; Intel; все топ-чипмейкеры |
| Цена машины | €200M+ за штуку |
| Капитализация | €300B+ |

---

## 30% Ruling: налоговая льгота

| Параметр | Значение |
|---------|---------|
| Суть | 30% зарплаты не облагается налогом |
| Для кого | Иностранные специалисты; приехали из-за рубежа |
| Срок | До 5 лет (с 2024 условия изменились) |
| Зарплатный порог | €46 107+/год (2024) |
| Экономия | ~10-15% от общей нагрузки |

---

## Itogo

Нидерланды Эйндховен DN 2026: 30% дешевле Амстердама (€1 000-1 800 vs €1 800-3 000+!); ASML €300B (монополия EUV; без ASML нет iPhone/Mac!; крупнейший работодатель!); Philips (основан в Эйндховене; lighting; health tech); NXP (полупроводники; $60B); 30% Ruling (до 5 лет!; иностранцы = льгота!); Dutch Design Week (октябрь = неделя дизайна; Стрейп отель DAF Museum!); велосипеды (Нидерланды = EU велосипед #1; инфраструктура идеальная!); Schengen (25 стран!); 1.5ч Амстердам; stroopwafel ($2-4 пачка!); bitterballen ($5-8 бар!); stamppot (картошка с зеленью = зимой!); пиво Hertog Jan (местное!; $3-5!).
`,
  },
  {
    slug: 'yuzhnaya-afrika-divan-wine-lands-dn-2026',
    title: 'ЮАР Вайнлендс Стелленбос DN 2026: Cape Winelands, $300-600 аренда, виноделие, горы',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'ЮАР Вайнлендс Стелленбос DN 2026 Cape Winelands аренда виноделие горы переезд',
    seo_description: 'ЮАР Вайнлендс Стелленбос DN 2026 Cape Winelands аренда виноделие горы переезд дешево',
    content_md: `# ЮАР Вайнлендс (Стелленбос/Франсхук) DN 2026: мировые вина, $300-600 аренда, горы, дешевле Кейптауна

Вайнлендс — альтернатива дорогому Кейптауну. $300-600 аренда (vs $800-1 600 в Кейптауне!). Стелленбос и Франсхук: мировые винные маршруты. Горы Hottentots Holland. Stellenbosch University — один из лучших университетов Африки. Французский Уголок (Franschhoek = French Corner: гугеноты 17 века!).

---

## Стелленбос vs Франсхук vs Кейптаун

| Параметр | Стелленбос | Франсхук | Кейптаун |
|---------|----------|---------|---------|
| Аренда 2-комн | R6 000-12 000 ($330-660) | R8 000-15 000 ($440-820) | R15 000-30 000 ($820-1 650) |
| Характер | Студенческий; universitaire | Гурме; французский | Космополит; туристический |
| До Кейптауна | 50 мин авто | 60 мин авто | — |
| Виноделие | Лучшие производители ЮАР | Boutique-фермы | — |
| Безопасность | Лучше Кейптауна | Лучше Кейптауна | Район важен |

---

## Виноделие: лучшие хозяйства

| Ферма | Что попробовать |
|------|---------------|
| Kanonkop | Pinotage (сорт ЮАР!); Cab Sauv |
| Meerlust | Rubicon (флагман!); Pinot Noir |
| Waterford | Kevin Arnold Shiraz |
| Graham Beck | MCC (Mandela Inauguration!) |
| Boschendal | Pique Nique на природе; Chardonnay |

---

## Почему Стелленбос

| Фактор | Описание |
|--------|---------|
| Университет | Stellenbosch University; 30 000 студентов; топ-2 ЮАР |
| Экосистема | Stias (Stellenbosch Institute); tech-стартапы |
| Архитектура | Cape Dutch (белые фасады 18 в.) |
| Дегустации | €5-20 degustation на ферме; пешком или Uber |
| Пешком | Центр + фермы пешком или велик |

---

## Itogo

ЮАР Вайнлендс DN 2026: дешевле Кейптауна (Стелленбос $330-660 vs $820-1 650!); виноделие мирового класса (Kanonkop Pinotage; Graham Beck MCC = бокал на инаугурации Манделы!; дегустации €5-20 буквально на ферме!); Stellenbosch University (30 000 студентов; топ-2 ЮАР = молодая энергия!); Cape Dutch (белоснежные фермерские дома 18 в. = фотогеника!); Франсхук (French Corner = гугеноты 1688; лучшие рестораны ЮАР!); горы (пешеходные тропы прямо из города!); 50-60 мин Кейптаун; Critical Skills Visa (оффер НЕ нужен; см. ЮАР отдельная статья!); braai ($5-15 = южноафриканский barbecue = культ!); bunny chow ($5-8 = карри в хлебе!); biltong ($5-10 = вяленое мясо!).
`,
  },
  {
    slug: 'kak-pereekhat-marketologu-smm-za-rubezh-2026',
    title: 'Как переехать маркетологу и SMM-специалисту за рубеж в 2026: удаленка, визы, страны, зарплата',
    tag: 'профессии',
    read_time: 2,
    country_slug: null,
    seo_title: 'Как переехать маркетологу SMM-специалисту за рубеж 2026 удаленка визы страны зарплата',
    seo_description: 'Как переехать маркетологу SMM-специалисту за рубеж 2026 удаленка визы страны зарплата',
    content_md: `# Как переехать маркетологу и SMM в 2026: €3 000-8 000 удаленка, лучшие страны, Growth-хаки

Маркетологи и SMM-специалисты — одна из наиболее мобильных профессий. Удаленная работа — норма. €3 000-8 000/мес для senior-специалистов. Growth-маркетинг; Paid-социальные сети; Content Strategy; SEO. Лучшие страны: Грузия (1% налог ИП!); Кипр (Non-Dom 0%!); Бали (Second Home Visa).

---

## Специализации и зарплаты

| Специализация | Junior | Middle | Senior |
|-------------|--------|--------|--------|
| SMM (Instagram; TikTok; LinkedIn) | $1 500-2 500 | $3 000-5 000 | $5 000-8 000 |
| Paid Ads (Meta; Google Ads) | $2 000-3 500 | $4 000-7 000 | $7 000-12 000 |
| Content Marketing / SEO | $1 500-3 000 | $3 000-5 500 | $5 000-9 000 |
| Growth Marketing | $3 000-5 000 | $5 000-8 000 | $8 000-15 000 |
| CMO (стартапы) | — | $6 000-10 000 | $10 000-25 000+ |

---

## Где искать удаленную работу

| Платформа | Специфика |
|----------|---------|
| Toptal | Топ-5% маркетологов; $80-150/час |
| Growann | Aggregator growth-позиций |
| Remote.co | Vetted remote jobs; marketing секция |
| AngelList / Wellfound | Стартапы; equity+cash |
| LinkedIn (remote filter) | Mass market; много вакансий |
| Contra | Freelance; no-fee; creative+marketing |

---

## Лучшие страны для маркетологов

| Страна | Почему | Налог |
|--------|--------|-------|
| Грузия Тбилиси | 1% ИП; безвизово; недорого ($500-900) | 1% ИП |
| Кипр Лимасол | Non-Dom 0% дивиденды; EU | 0% дивиденды |
| Бали Убуд/Чангу | Second Home $130k; DN-сообщество | 0% иностранный |
| Черногория Бар/Котор | 9% фикс; EU-кандидат | 9% |
| Таиланд Чиангмай | TR 0%; $400-800; DN-хаб | 0% зарубежный доход |

---

## Профессиональное развитие

| Ресурс | Описание |
|--------|---------|
| CXL Institute | Conversion; Growth; Data-driven marketing |
| Reforge | Growth; Retention; PLG (ex-Airbnb/Uber) |
| Google Digital Garage | Бесплатно; сертификаты |
| Meta Blueprint | Бесплатно; реклама Meta |
| Hubspot Academy | Inbound; Content; Email |

---

## Itogo

Маркетолог/SMM за рубеж 2026: $1 500-15 000+/мес (junior SMM vs senior Growth CMO!); топ-платформы (Toptal $80-150/час; Contra no-fee; Wellfound стартапы!); Грузия Тбилиси (1% ИП = мечта маркетолога фрилансера!; $500-900 жизнь!); Кипр Non-Dom (0% дивиденды; EU!); Бали (DN-сообщество + 0% иностранный доход!); Таиланд (0% зарубежный; Чиангмай vs Бангкок — Чиангмай спокойнее!); навыки роста (Growth Marketing $8-15k/мес = самая востребованная ниша!; CXL и Reforge = +50-100% к зарплате!); портфолио (кейсы в цифрах: CAC снизил на X%; ROAS поднял с Y до Z% — обязательно!); LinkedIn (en-профиль + англ контент = вдвое больше инбаунда!).
`,
  },
  {
    slug: 'kak-pereekhat-arxitektoru-za-rubezh-2026',
    title: 'Как переехать архитектору за рубеж в 2026: нострификация диплома, визы, ОАЭ, Канада, EU',
    tag: 'профессии',
    read_time: 2,
    country_slug: null,
    seo_title: 'Как переехать архитектору за рубеж 2026 нострификация диплома визы ОАЭ Канада EU',
    seo_description: 'Как переехать архитектору за рубеж 2026 нострификация диплома визы ОАЭ Канада EU зарплата',
    content_md: `# Как переехать архитектору в 2026: нострификация, €45-80k EU, AED 15-25k ОАЭ, Канада Express Entry

Архитектура — лицензированная профессия: диплом нострифицировать + местную лицензию получить. Процесс долгий, но результат — полноценная практика. ОАЭ: самый быстрый путь (SUA лицензия 3-6 мес; бум строительства!). Канада: NPE-категория; CACB аккредитация. EU: ARB (UK); каждая страна отдельно.

---

## Зарплаты по странам

| Страна | Junior | Middle | Senior |
|--------|--------|--------|--------|
| ОАЭ Дубай | AED 10-15k ($2 700-4 100) | AED 15-25k ($4 100-6 800) | AED 25-45k ($6 800-12 000) |
| Германия | €40-55k | €55-75k | €70-95k |
| Нидерланды | €38-55k | €55-75k | €70-95k |
| Швейцария | CHF 70-95k | CHF 90-120k | CHF 110-150k |
| Канада | CAD 55-70k | CAD 70-95k | CAD 90-130k |
| Австралия | AUD 65-80k | AUD 80-110k | AUD 100-140k |

---

## Нострификация по странам

| Страна | Орган | Срок | Сложность |
|--------|-------|------|----------|
| ОАЭ | SIRA/MENA; Dubai Municipality | 3-6 мес | Средняя |
| Германия | Architektenkammer (по земле) | 6-18 мес | Высокая |
| Канада | CACB (Canadian Architectural Certification Board) | 6-18 мес | Высокая |
| Австралия | AACA (Architectural Accreditation in Australia) | 6-24 мес | Высокая |
| UK | ARB (до Brexit — EU; сейчас отдельно) | 3-12 мес | Средняя |

---

## ОАЭ: самый быстрый путь

| Фактор | Описание |
|--------|---------|
| Строительный бум | Экспо 2020; Dubai 2040 Urban Plan; 500+ активных проектов |
| Лицензия | SUA (Supreme UAE Architecture) через DMC + MENA |
| Русские специалисты | Много (особенно после 2022!) |
| Крупные бюро | Foster+Partners UAE; Gensler; HOK; Zaha Hadid (наследие) |
| Portafolio | BIM (Revit; Rhino) = must have |

---

## Itogo

Архитектор за рубеж 2026: лицензированная профессия (нострификация = обязательна; ОАЭ 3-6 мес = быстрее всех!); ОАЭ Дубай (AED 25-45k $6-12k/мес senior; бум строительства Dubai 2040!; 0% НДФЛ!); Германия (€70-95k senior; Architektenkammer по земле; немецкий желателен!); Нидерланды (€70-95k; 30% Ruling!; English-friendly!); BIM (Revit + Archicad + Rhino = 80% вакансий требуют; учи заранее!); портфолио (ARC-сайт = обязательно; behance.net; issuu.com; показывай CG-визуализации!); Канада (CACB 6-18 мес; Express Entry; после получения лицензии = постоянная работа есть!); Австралия (AACA; много тропической архитектуры; интересная специфика!); remote (возможно частично; но не как SMM — нужно присутствие для надзора!).
`,
  },
];

let ok = 0, err = 0;
for (const p of POSTS) {
  const { data: existing } = await sb.from('blog_posts').select('id').eq('slug', p.slug).maybeSingle();
  if (existing) { console.log('[SKIP]', p.slug); ok++; continue; }
  const cover_url = await getPhoto(p.slug);
  const { error } = await sb.from('blog_posts').insert({
    slug: p.slug, title: p.title, tag: p.tag, read_time: p.read_time,
    seo_title: p.seo_title, seo_description: p.seo_description,
    content_md: p.content_md, country_slug: p.country_slug ?? null,
    city_id: null, published: true, cover_url,
    cover_author_name: null, cover_author_url: null, cover_unsplash_id: null,
  });
  if (error) { console.log('[ERR]', p.slug, error.message); err++; }
  else { console.log('[OK]', p.slug); ok++; }
}
console.log(`\nБатч 309: ${ok} OK, ${err} ошибок`);
