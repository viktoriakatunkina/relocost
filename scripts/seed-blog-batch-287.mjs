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
    slug: 'avstriya-vena-grats-it-2026',
    title: 'Австрия Вена Грац IT 2026: EU Red-White-Red Card, €1 200-2 500 аренда, самое высокое качество жизни EU',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Австрия Вена Грац IT 2026 EU Red-White-Red Card аренда качество жизни EU переезд',
    seo_description: 'Австрия Вена Грац IT 2026 EU Red-White-Red Card аренда качество жизни EU переезд Альпы',
    content_md: `# Австрия IT 2026: Red-White-Red Card, Вена №1 по качеству жизни, €1 200-2 500, Альпы

Вена — №1 по качеству жизни в мире (The Economist; Mercer 10+ лет подряд). Австрия: EU-страна; один из лучших welfare state. Red-White-Red Card: рабочая виза по очковой системе. НДФЛ до 55% (высокий; но бесплатное здравоохранение; 25 дней отпуска минимум).

---

## Red-White-Red Card: очковая система

| Критерий | Очки |
|---------|-----|
| Возраст 24-35 | 8 |
| Немецкий B1 | 4; B2 = 6 |
| Высшее образование | 4 |
| Работа по специальности 3+ лет | 4 |
| Оффер в Австрии выше €2 300/мес | 4 |

Для получения RWR Card: 55+ очков (из 100 максимальных).

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Bitpanda | $4B; Crypto exchange; Вена |
| Frequentis | $400M; Air Traffic Management; Vienna |
| Dynatrace | $10B+; Observability; Linz |
| Runtastic | Health; (продан Adidas; €240M) |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Вена центр (1; 4; 7 Bezirk) | €1 800-3 000 |
| Вена периферия (10-23 Bezirk) | €1 200-2 000 |
| Грац | €1 000-1 800 |
| Инсбрук (горы!) | €1 100-2 000 |

---

## Почему Вена №1

- Вена №1 по качеству жизни 10+ лет подряд (Economist; Mercer)
- Публичный транспорт (100% электрический; €1 на поездку; все виды)
- Kaffeehauskultur (кофейная культура ЮНЕСКО!)
- Рождественские рынки (лучшие в Европе!)
- Альпы в часе езды (горнолыжные курорты; пешие маршруты)
- Венская опера ($10 стоячие места!)

---

## Itogo

Австрия IT 2026: Red-White-Red Card (55 очков; немецкий B1+; оффер €2 300/мес; 1-3 мес оформление); Bitpanda $4B (крипто; Вена!); Dynatrace $10B (Linz; наблюдаемость); Вена №1 качество жизни (Mercer 10+ лет!); €1 200-2 000 периферия Вены; немецкий язык (B1 для очков; C1 для комфортной жизни!); НДФЛ до 55% (высокий! но Krankenversicherung + 25 отпусков + Elterngeld = реальная ценность!); Kaffeehauskultur (Melange; Einspanner; sachertorte €5-8!); Альпы 1ч (Kitzbuhel; Zell am See; Schladming); EU-паспорт 10 лет (один из самых длинных!).
`,
  },
  {
    slug: 'tunis-sfaks-dn-africa-2026',
    title: 'Тунис Тунис-город DN 2026: Carte de Sejour, $200-450 аренда, Средиземноморье, Карфаген',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Тунис DN 2026 Carte de Sejour аренда Средиземноморье Карфаген переезд Африка',
    seo_description: 'Тунис DN 2026 Carte de Sejour аренда Средиземноморье Карфаген переезд Северная Африка дешево',
    content_md: `# Тунис DN 2026: Ближайшая Африка к EU, $200-450 аренда, Carte de Sejour, Карфаген

Тунис — самая близкая к Европе африканская страна (90 минут до Рима). Недооцененное направление. Аренда: $200-450 (одна из дешевейших в регионе). Carte de Sejour (ВНЖ): через банковский вклад или работу. Средиземное море. Карфаген (ЮНЕСКО; руины финикийского города). Французский + арабский.

---

## Пребывание и виза

| Параметр | Значение |
|---------|---------|
| Безвизово (РФ) | 90 дней |
| Carte de Sejour (ВНЖ) | Через работу; инвестиции; пассивный доход |
| Налог | Территориальный; иностранный доход практически 0% |
| Валюта | Динар (TND); строгий контроль (не вывозить!) |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Тунис-город (Lac; Les Berges) | $250-500 |
| Тунис-город (Медина; La Marsa) | $200-400 |
| Сус (пляжный курорт) | $180-400 |
| Хаммамет | $150-350 |
| Дjerba (остров) | $180-380 |

---

## Почему Тунис

- Ближайшая Африка к EU (Рим 1.5ч; Марсель 2.5ч; Мадрид 2.5ч!)
- Медина Туниса (ЮНЕСКО; старый город; souq; мозаики!)
- Карфаген (ЮНЕСКО; руины величайшего конкурента Рима!)
- Эль-Джем (ЮНЕСКО; Колизей лучшей сохранности чем Римский!)
- Сахара (2-5 часов до дюн Эрг-Шебби; Star Wars съемки!)
- Французский язык (широко распространен; наследие протектората)
- Интернет: fiber в крупных городах; Tunisie Telecom; 50-100 Mbps $20-40

---

## Itogo

Тунис DN 2026: самая близкая Африка к EU (Рим 1.5ч!); $200-450 аренда; 90 дней безвизово; Carte de Sejour через работу/инвестиции; Медина Туниса (ЮНЕСКО; souq; мозаики!); Карфаген (финикийцы; Ганнибал!); Эль-Джем (Колизей лучше Римского!); Сахара (2-5ч; Star Wars!; верблюды!); французский распространен (учишь бонусом!); couscous (национальное; $2-5 в ресторане!); brik (жареный пирожок с яйцом; $0.50-1; уличная!); mint tea; jasmine (цветы жасмина = парфюм страны!); TND нельзя вывозить (обменивай перед выездом!).
`,
  },
  {
    slug: 'kak-pereekhat-v-avstraliyu-step-by-step-2026',
    title: 'Как переехать в Австралию 2026: Skilled Migration 189/190, TSS 482, NDIS, шаги',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать Австралия 2026 Skilled Migration 189 190 TSS 482 NDIS шаги пошагово',
    seo_description: 'Переехать Австралия 2026 Skilled Migration 189 190 TSS 482 NDIS шаги пошагово иммиграция',
    content_md: `# Австралия 2026: Skilled Migration 189/190, TSS Visa 482, NDIS $35k+, пошаговое руководство

Австралия — один из самых популярных эмиграционных направлений для IT и медиков. Skilled Migration 189 (независимый): очки (70+ required; 65 minimum). IT-специальности в SOL (Skilled Occupation List) = приоритет. TSS 482: спонсорская виза от работодателя (2-4 года). NDIS: до AU$200k+/год поддержка инвалидам.

---

## Skilled Migration 189: очки (Points Test)

| Критерий | Очки |
|---------|-----|
| Возраст 25-32 | 30 |
| Возраст 33-39 | 25 |
| Английский IELTS 8+ | 20 |
| Английский IELTS 7-7.5 | 10 |
| Австралийское образование | 5-15 |
| Опыт за рубежом 3-4 года | 5-10 |
| STEM квалификация | 10 |
| Партнер IELTS 7+ | 10 |

Минимум 65 очков; реальный порог приглашений: 75-80+ (IT = 80+).

---

## Визы для IT

| Виза | Тип | Условие |
|------|-----|---------|
| 189 Skilled Independent | Постоянная PR | 65+ очков; EOI в SkillSelect |
| 190 State Nominated | Постоянная PR | + 5 очков от штата; проживание в штате |
| 491 Skilled Regional | Временная 5 лет → 191 PR | Региональный штат; 15 очков bonus |
| TSS 482 | Временная 2-4 года | Спонсор-работодатель; -> 186 PR |

---

## IT-профессии в SOL (Skilled Occupation List)

- Software Engineer (ANZSCO 261313)
- Developer Programmer (261312)
- ICT Business Analyst (261111)
- Systems Analyst (261112)
- Database Administrator (262111)

---

## Itogo

Австралия IT 2026: Skilled Migration 189 (70+ очков реально; 80+ = больше шансов приглашения!); IELTS 8+ = +20 очков (ключевой!); IT SOL список (Software Engineer; Developer; приоритет!); TSS 482 (работодатель → 2-4 года → 186 PR); NDIS (AU$35 000-200 000+/год; PR или гражданство; уникальная программа мира!); Сидней (AU$2 500-5 000 аренда; дорогой!); Мельбурн (AU$2 000-4 000; IT-хаб); Брисбен (дешевле; теплее); Аделаида (State Nomination + дешевле; Барossa Valley вино!); citizenship 4 года PR + 1 год; кенгуру; опоссум; Great Barrier Reef; Vegemite (попробуй!).
`,
  },
  {
    slug: 'kak-pereekhat-v-sinhapure-step-by-step-2026',
    title: 'Как переехать в Сингапур 2026: Employment Pass, Tech Pass, ONE Pass, зарплаты $5-20k',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать Сингапур 2026 Employment Pass Tech Pass ONE Pass зарплаты шаги пошагово',
    seo_description: 'Переехать Сингапур 2026 Employment Pass Tech Pass ONE Pass зарплаты шаги пошагово иммиграция',
    content_md: `# Сингапур 2026: Employment Pass, Tech Pass, ONE Pass, зарплаты $5-20k, Grab $15B

Сингапур — азиатский финансово-технологический хаб. 0% НДФЛ на зарубежный доход. Employment Pass: оффер + $6 000/мес (порог 2024). Tech Pass: 5 лет; прогрессивные требования ($30 000/мес OR CTO/CEO в tech-компании $500M+). ONE Pass: топ-таланты. Grab: $15B. Sea Group: $35B.

---

## Визы в Сингапур для IT

| Виза | Условие | Срок |
|------|---------|------|
| **Employment Pass (EP)** | **Оффер + $6 000/мес (min 2024)** | **1-2 года** |
| S Pass | Оффер + $3 150/мес; средний уровень | 2 года |
| Entrepreneur Pass | Бизнес-план + $50k investida | 1 год |
| **Tech Pass** | **$30 000/мес OR CTO $500M+ OR 5 лет в $500M+ tech** | **2 года** |
| **ONE Pass** | **$30 000/мес + выдающийся вклад** | **5 лет!** |

---

## Employment Pass: что нужно

1. Оффер от сингапурской компании (зарплата $6 000/мес min)
2. Работодатель подает заявку на EP через MOM (Ministry of Manpower)
3. Проверка через COMPASS (очковая система)
4. Одобрение: 3-8 нед
5. EP = 1-2 года; продление; путь к PR (5 лет) → гражданство

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Grab | $15B; Super App; SEA лидер |
| Sea Group | $35B; Shopee; Garena; SeaMoney |
| Lazada (Alibaba) | e-commerce SEA |
| Razer | $4B; Gaming hardware; HQ Singapore |
| Bytedance (TikTok SEA HQ) | TikTok региональный хаб |

---

## Itogo

Сингапур IT 2026: Employment Pass (оффер + $6 000/мес; 1-2 года; COMPASS система); Tech Pass ($30k/мес OR CTO; 2 года; без оффера!); ONE Pass (5 лет; топ-таланты!); Grab $15B; Sea $35B; 0% НДФЛ на зарубежный доход; стандартный НДФЛ 0-22% (прогрессивный; низкий по меркам развитых стран!); $3 000-6 000 аренда 2-комн; MRT (метро; шикарный!); hawker centres ($2-5 поесть; Michelin-блюда за $3!); лучший чистейший воздух (никакой грязи); multi-cultural (китайцы; малайцы; индийцы; экспаты); Sentosa (пляж; Universal Studios); PR 5 лет → гражданство 3 года.
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
console.log(`\nБатч 287: ${ok} OK, ${err} ошибок`);
