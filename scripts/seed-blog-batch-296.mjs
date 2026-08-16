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
    slug: 'kak-pereekhat-v-belgii-bryussel-it-2026',
    title: 'Бельгия Брюссель IT 2026: EU-столица, EU Blue Card €57k, €1 200-2 200 аренда, Anvers',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Бельгия Брюссель IT 2026 EU столица EU Blue Card аренда Anvers переезд',
    seo_description: 'Бельгия Брюссель IT 2026 EU столица EU Blue Card аренда Anvers переезд Schengen',
    content_md: `# Бельгия IT 2026: столица EU, EU Blue Card €57k, Teamleader, Brussels Tech Hub, €1 200-2 200

Бельгия — сердце Европы (Брюссель = столица EU и NATO). EU Blue Card порог €57k (выше, чем в Германии; меньше чем Нидерланды). Tech-экосистема: Deliverect $1B; Teamleader; Showpad $680M. Фламандская технология + французская культура. Бельгийский шоколад = мировой стандарт.

---

## EU Blue Card Бельгия

| Параметр | Значение |
|---------|---------|
| Порог зарплаты | €57 500/год (2026) |
| MINT-специальности | €57 500/год (нет снижения) |
| Срок | 3 года |
| ПМЖ | 5 лет |
| Налог | 30-50% прогрессивный (высокий!) |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Deliverect | $1B; Restaurant software |
|Showpad | $680M; Sales enablement |
| Teamleader | $100M+; CRM/PM |
| itsme | $300M; Digital ID |
| Odoo | $3.2B; ERP (Бельгийский конкурент SAP!) |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Брюссель (EU-квартал; Ixelles) | €1 400-2 500 |
| Брюссель (Моленбек; Андерлехт) | €900-1 600 |
| Антверпен (мода; алмазы) | €1 000-1 800 |
| Гент (студенческий; красивый) | €800-1 500 |
| Льеж (дешевле; франкофонный) | €700-1 300 |

---

## Плюсы Бельгии

- Центр EU (штаб-квартиры Europol; NATO; Европейская Комиссия = много работы)
- 3 официальных языка: фламандский (нидерландский) + французский + немецкий
- В Брюсселе работают в основном на французском + английском
- Антверпен: фламандский + английский в tech-компаниях
- Бельгийский шоколад; вафли; пиво (3 000+ сортов!) = гастрономия мирового класса

---

## Itogo

Бельгия IT 2026: столица EU (Брюссель = EU Commission; NATO HQ; Europol = много международных организаций нанимают!); EU Blue Card €57k (дороже чем Германия €44k; но дешевле НЛ!); Odoo $3.2B (бельгийский ERP; конкурент SAP; 7M+ пользователей!); Deliverect $1B; Showpad $680M; Брюссель €900-2 500 (EU-квартал дорогой; Molenbeek дешевле!); Антверпен (мода; алмазы; фламандский язык; €1-1.8k!); Гент (студенческий; средневековый; красивейший в EU!); 3 000+ сортов пива (Chimay; Leffe; Duvel; Westvleteren = пивная столица мира!); шоколад (Neuhaus; Godiva; Leonard; Leonidas = берешь коробку и не можешь остановиться!).
`,
  },
  {
    slug: 'kuanda-lusaka-dn-africa-2026',
    title: 'Замбия Лусака DN 2026: Victoria Falls, $200-400 аренда, инвестиционная виза, медь',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Замбия Лусака DN 2026 Victoria Falls аренда инвестиционная виза медь переезд Африка',
    seo_description: 'Замбия Лусака DN 2026 Victoria Falls аренда инвестиционная виза медь переезд Африка',
    content_md: `# Замбия DN 2026: Victoria Falls (половина!), $200-400 аренда Лусака, Investor Visa, английский

Замбия — одна из самых малоизвестных DN-стран Южной Африки. English официальный. Victoria Falls (водопад на границе Замбия/Зимбабве; 1/2 на нашей стороне!). $200-400 аренда Лусака. Investor Residence Permit от $250k. Медь = главный экспорт (Медный Пояс; Copper Belt).

---

## Визы в Замбию

| Виза | Условие | Стоимость |
|------|---------|---------|
| Tourist Visa | Въезд | $50 |
| KAZA UniVisa | Замбия + Зимбабве (комбо!) | $50 |
| Investor Residence Permit | $250 000+ инвестиций | $1 500/год |
| Employment Permit | Через работодателя | Через работодателя |
| Visitor Permit | 30-90 дней | Входит в Tourist Visa |

---

## Victoria Falls: уникальность

| Факт | Значение |
|------|---------|
| Ширина | 1 700м — самый широкий водопад в мире! |
| Высота | 108м (выше Ниагары!) |
| Название на языке коренных | Mosi-oa-Tunya («Дым, который гремит») |
| ЮНЕСКО | Мировое наследие 1989 |
| Деятельность | Рафтинг; банджи-джамп; вертолетный тур |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Лусака (Kabulonga; Woodlands) | $300-500 |
| Лусака (Chilenje; Kabwata) | $200-350 |
| Ливингстон (Victoria Falls) | $250-500 |

---

## Itogo

Замбия DN 2026: Victoria Falls (половина нашей стороны; 1 700м шириной = самый широкий в мире!; Mosi-oa-Tunya!); KAZA UniVisa $50 (Замбия + Зимбабве = оба берега!); $200-400 аренда Лусака; English официальный; Investor Visa $250k; Медный Пояс (Kitwe; Ndola; Chingola = индустриальный север); South Luangwa (лучший пеший сафари в Африке — walking safaris!); Kafue National Park (огромный; слоны; гиппопотамы; крокодилы); Livingstone (туристический; 25 000 туристов в год vs водопад); рафтинг Zambezi River (Class 5; один из лучших в мире; $120-160/день!).
`,
  },
  {
    slug: 'kak-pereekhat-v-serbii-beograd-it-2026',
    title: 'Сербия Белград IT 2026: безвизово 30 дней, $400-800 аренда, Nordeus, Levi9, балканский хаб',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Сербия Белград IT 2026 безвизово аренда Nordeus Levi9 балканский хаб переезд',
    seo_description: 'Сербия Белград IT 2026 безвизово аренда Nordeus Levi9 балканский хаб переезд',
    content_md: `# Сербия Белград IT 2026: безвизово 30 дней, $400-800 аренда, Nordeus, плоский налог 15%, EU-кандидат

Сербия — балканский хаб для русскоязычных IT-специалистов (большая диаспора 2022+). Безвизово 30 дней (можно продлить). Плоский налог 15%. $400-800 аренда. Nordeus (EA купила 2021; первый сербский единорог). Levi9 (IT-аутсорс €180M). EU-кандидат (переговоры идут).

---

## Базовые факты

| Параметр | Значение |
|---------|---------|
| Виза РФ | Безвизово 30 дней → ВНЖ (нет лимита продлений) |
| Налог НДФЛ | 15% плоский |
| Аренда 2-комн Белград | $500-900 |
| Аренда 2-комн (Нови-Сад) | $400-700 |
| Язык | Сербский (кириллица + латиница) |
| Русскоязычная диаспора | Большая (2022+; десятки тысяч) |

---

## IT-экосистема Сербии

| Компания | Профиль |
|---------|---------|
| Nordeus | EA купила 2021; Top Eleven (120M игроков) |
| Levi9 | IT-аутсорс; €180M оборот |
| Loomio | Collaborative decision-making |
| Seven Bridges | Биоинформатика; $22M |
| MicroLED | Свой стартап-проект |

---

## ВНЖ Сербии для россиян

| Основание | Условие |
|---------|---------|
| Регистрация компании (d.o.o.) | Директор = ВНЖ |
| Владение недвижимостью | Покупка квартиры → ВНЖ |
| Работа в сербской компании | Трудовой договор → ВНЖ |
| Freelance Visa | Договор с иностранным клиентом |

---

## Itogo

Сербия Белград IT 2026: безвизово 30 дней (продлевай ВНЖ; нет лимита!); 15% плоский налог (удобно для ИП/d.o.o!); $500-900 аренда Белград ($400-700 Нови-Сад); большая русская диаспора (Zemun; Dorćol; Savamala кварталы); Nordeus (Top Eleven 120M игроков; EA купила!); Levi9 IT-аутсорс; EU-кандидат (процесс долгий; но перспективы есть!); Белград ночная жизнь (Splav; понтонные бары на Дунае; лучшая в регионе!); Novi Sad (Exit Festival; Европейская Столица Культуры 2022; тихий; интеллигентный!); Serbia Rail (Белград-Нови-Сад 40 мин; удобно!); cevapi + pljeskavica (мясо!); rakija (сливовица; домашняя; крепкая — 40-60%; национальный напиток!).
`,
  },
  {
    slug: 'kak-pereekhat-v-shveytsariyu-2026',
    title: 'Как переехать в Швейцарию 2026: CHF 6 000+ зарплата, L/B Permit, Zurich, Google, UBS, Nestle',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Швейцария 2026 CHF зарплата L B Permit Zurich Google UBS Nestle переезд',
    seo_description: 'Швейцария 2026 CHF зарплата L B Permit Zurich Google UBS Nestle переезд Schengen',
    content_md: `# Швейцария 2026: CHF 6 000+/мес, L Permit → B Permit → C Permit, Цюрих Google/UBS, Nestle/Roche

Швейцария — не EU (но Schengen!); САМЫЕ высокие зарплаты в Европе. Цюрих: Google EMEA HQ; UBS; Credit Suisse (теперь UBS). Женева: ООН; CERN; WHO; Nestle HQ. Базель: Roche; Novartis. CHF 6 000-12 000/мес ИТ. Дорогая: CHF 2 500-4 000 аренда.

---

## Permits в Швейцарии

| Permit | Кто | Условие |
|-------|-----|---------|
| L Permit | Краткосрочный | Контракт < 1 года; возобновляемый |
| B Permit | Долгосрочный | Контракт 1+ год; ежегодно продляется |
| C Permit | Постоянный | 5 лет (EU) или 10 лет (не-EU) в B + хорошая интеграция |
| G Permit | Фронтальер | Живешь в EU; работаешь в Швейцарии |

Путь из России: оффер → B Permit → 10 лет → C Permit.

---

## Работа и зарплаты

| Профессия | CHF/год |
|---------|--------|
| Junior Software Engineer | CHF 80-100k |
| Senior Software Engineer | CHF 120-160k |
| Engineering Manager | CHF 150-250k |
| Data Scientist | CHF 100-150k |
| Financial Analyst UBS | CHF 100-180k |

---

## Города

| Город | Характер | Аренда 2-комн |
|-------|---------|-------------|
| Цюрих | Google; UBS; Finance; Largest | CHF 2 500-4 500 |
| Женева | ООН; WHO; Nestle; International | CHF 2 000-3 500 |
| Базель | Pharma (Roche; Novartis); tram | CHF 1 800-3 000 |
| Берн (столица) | Правительство; тише | CHF 1 800-3 000 |
| Лозанна | Nestle HQ; EPFL; студенческий | CHF 1 800-3 000 |

---

## Itogo

Швейцария 2026: САМЫЕ высокие зарплаты Европы (CHF 120-160k/год Senior Engineer = $135-180k!); не EU НО Schengen (нет НДФЛ EU-ставок; свои налоны 10-35% кантональные!); B Permit (оффер 1+ год → B Permit → 10 лет → C Permit постоянный); Цюрих Google EMEA HQ (инженеры среди лучших оплачиваемых в мире!); UBS CHF 120-180k; Женева ООН + WHO + CERN (физики; международные организации; Nestle HQ!); Базель Roche/Novartis (pharma-столица мира!); дорогая жизнь (CHF 2 500-4 000 аренда; кофе CHF 5-7; ланч CHF 20-35!); немецкий (Цюрих; Базель; Берн; A2 помогает) + французский (Женева; Лозанна!).
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
console.log(`\nБатч 296: ${ok} OK, ${err} ошибок`);
