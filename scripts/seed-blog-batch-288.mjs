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
    slug: 'litva-vilnyus-it-2026',
    title: 'Литва Вильнюс IT 2026: EU страна, Startup Visa, €700-1 200 аренда, Vinted €3B',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Литва Вильнюс IT 2026 EU страна Startup Visa аренда Vinted переезд Балтия',
    seo_description: 'Литва Вильнюс IT 2026 EU страна Startup Visa аренда Vinted переезд Балтия Прибалтика',
    content_md: `# Литва IT 2026: EU-страна, Startup Visa, Vinted €3B, Вильнюс €700-1 200 аренда, Schengen

Литва — одна из самых быстрорастущих экономик EU. Финтех-хаб (крупнейшее количество финтех-лицензий в EU после Люксембурга!). Vinted (€3B; мировой лидер second-hand одежды; Вильнюс HQ!). Startup Visa: инновационный стартап → ВНЖ. НДФЛ 20%. EU Blue Card: оффер + €7 000/год (один из самых низких порогов в EU!).

---

## EU Blue Card Литва

| Параметр | Значение |
|---------|---------|
| Доход | €7 000/год (ниже большинства EU!) |
| Оффер | От литовской компании |
| Срок | 2 года |
| ПМЖ | 5 лет |

---

## Финтех-лицензирование Литвы

Литва выдала 150+ EMI (Electronic Money Institution) лицензий — больше, чем Германия, Нидерланды или Франция! Причина: понятный регулятор (Lietuvos Bankas); English-документация; быстрое одобрение (3-6 мес vs 12-24 мес EU average).

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Vinted | €3B; Secondhand fashion; Вильнюс |
| Nord Security (Nord VPN) | $1.6B; Cybersecurity |
| Kilo Health | €200M+; Digital health |
| Tesonet | B2B tech; VPN infrastructure |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Вильнюс (Senamiestis; Uzupis) | €900-1 600 |
| Вильнюс (Antakalnis; Pilaitė) | €700-1 200 |
| Каунас (2-й IT-хаб) | €500-900 |

---

## Itogo

Литва IT 2026: EU Blue Card €7 000/год (самый низкий порог в EU!); Startup Visa (инновационный стартап); 150+ EMI финтех-лицензий (финтех EU-хаб!); Vinted €3B (Вильнюс!); Nord VPN $1.6B; Вильнюс €700-1 200 (барочный ЮНЕСКО-центр!); Uzupis (богемный район = местный «Монмартр»; собственная Конституция!); EU-страна Шенген Еврозона; НДФЛ 20%; EU-паспорт через 10 лет (длинно); но ПМЖ через 5 лет; cepelinai (клецки из картошки с мясом + сметана = национальное!); Тракайский замок (остров в озере; 30 мин от Вильнюса!).
`,
  },
  {
    slug: 'kak-otkryt-biznes-za-rubezhom-2026',
    title: 'Как открыть бизнес за рубежом 2026: Грузия ООО 1%, Эстония OÜ, ОАЭ Freezone, шаги',
    tag: 'бизнес',
    read_time: 2,
    country_slug: null,
    seo_title: 'Открыть бизнес рубеж 2026 Грузия ООО 1% Эстония OÜ ОАЭ Freezone шаги регистрация',
    seo_description: 'Открыть бизнес рубеж 2026 Грузия ООО 1% Эстония OÜ ОАЭ Freezone шаги регистрация иностранец',
    content_md: `# Открыть бизнес за рубежом 2026: Грузия (1% ООО), Эстония (OÜ; e-Residency), ОАЭ (Freezone 0%)

Открытие иностранной компании — часть стратегии для DN и переезжающих. Лучшие юрисдикции: Грузия (1% налог при малом бизнесе; регистрация 1 день); Эстония (OÜ онлайн через e-Residency; 0% нераспределенная прибыль); ОАЭ (Freezone; 0% корпоративный на иностранный доход).

---

## Сравнение юрисдикций

| Юрисдикция | Регистрация | Налог на прибыль | Для кого |
|-----------|------------|-----------------|---------|
| Грузия ООО | 1 день $50 | 15% (ИЛИ 1% оборот малый бизнес!) | Живешь в Грузии; быстрый старт |
| Эстония OÜ | Онлайн через e-Residency €190 | 0% (20% при дивидендах) | EU без переезда; реинвестиции |
| ОАЭ Freezone | 1-4 нед $2 000-15 000 | 0% (при 100% иностранный доход) | Высокий доход; 0% НДФЛ |
| Кипр Ltd | 1-2 нед €1 000 | 12.5%; IP Box 2.5% | EU; IP; Нон-дом |
| UK Ltd | Онлайн £50 | 25% (25k+ прибыль) | UK рынок; международная репутация |

---

## Грузия: самая быстрая регистрация

1. Приедь в Грузию (безвизово 365 дней для РФ)
2. Revenue Service Georgia (rs.ge): регистрация ООО онлайн или в центре обслуживания
3. Срок: 1-2 дня
4. Открой счет: BOG или TBC (1-2 часа)
5. Налог: 15% на дивиденды ИЛИ 1% как ИП малый бизнес (до 500k GEL)
6. Подача отчетности: раз в год + ежемесячные декларации

---

## Эстония e-Residency + OÜ

- e-Residency ($190 сбор; карта через 3-5 нед; в посольстве Эстонии)
- OÜ: регистрируй онлайн через e-Business Register (€190 уставный капитал)
- 0% налог на прибыль (20% только при выплате дивидендов!)
- Банк: LHV; Wise Business; Revolut Business (e-Residency)
- Но: НЕ ВНЖ Эстонии (только право вести бизнес!)

---

## ОАЭ Freezone: самый дорогой но 0%

- Freezone: DIFC; DMCC; Abu Dhabi Global Market; Dubai Internet City
- 0% корпоративный налог (если 100% доход иностранный; за пределами ОАЭ)
- Residency Visa: 2-3 года (включена при регистрации многих FZ)
- Стоимость: $2 000-15 000/год (по Freezone и пакету)

---

## Itogo

Открыть бизнес за рубежом 2026: Грузия ООО (1 день $50; 1% налог малый бизнес; BOG за 2ч = лучший старт!); Эстония OÜ + e-Residency (0% нераспределенная прибыль; EU; онлайн = идеально для реинвестирования!); ОАЭ Freezone (0%; дорого $2-15k/год; но Residency Visa + 0% НДФЛ!); UK Ltd (£50 онлайн; 25% налог; для UK-рынка!); Кипр (12.5% + IP Box 2.5%); НЕ Эстония e-Residency как замена ВНЖ (только бизнес!); налоговый бухгалтер в каждой юрисдикции = необходимость.
`,
  },
  {
    slug: 'kak-pereekhat-v-novuyu-zealandiyu-2026',
    title: 'Как переехать в Новую Зеландию 2026: Skilled Migrant, Green List, Xero, NZ$29/ч минималка',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать Новая Зеландия 2026 Skilled Migrant Green List Xero минималка шаги',
    seo_description: 'Переехать Новая Зеландия 2026 Skilled Migrant Green List Xero минималка шаги пошагово',
    content_md: `# Новая Зеландия 2026: Skilled Migrant, Green List (прямой PR!), Xero $10B, NZ$29.66/ч минималка

Новая Зеландия — одна из лучших стран для качества жизни (природа + стабильность). Xero ($10B; облачная бухгалтерия). Минимальная зарплата: NZ$29.66/ч (одна из самых высоких в мире!). Green List: прямой PR для критических профессий без очередей. Skilled Migrant: очковая система.

---

## Green List: прямой PR для ряда профессий

Профессии с прямым PR (Tier 1):
- Construction & Infrastructure: Architect; Civil Engineer; Structural Engineer
- Care Sector: Midwife; Psychologist; Social Worker
- IT: нет в Tier 1; IT — обычно через Skilled Migrant или Work Visa

Профессии с облегченным PR (Tier 2):
- Software Engineer; Cybersecurity Analyst; Data Scientist

---

## Skilled Migrant Category

| Критерий | Очки |
|---------|-----|
| Квалификация (NZ or foreign recognized) | 40-80 |
| Возраст 20-39 | 30 |
| Опыт в NZ 2+ лет | 30 |
| Опыт за рубежом 10+ лет | 20 |
| Партнер (квалификация) | 20 |

Минимум: 160 очков.

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Xero | $10B; Cloud Accounting; Auckland; Wellington |
| Pushpay | $900M; Digital Payments; Auckland |
| Datacom | $1B; IT services |
| Orion Health | Health IT; $400M |
| Straker Translations | AI-перевод; $200M |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Окленд | NZ$2 500-4 500 |
| Веллингтон | NZ$2 000-3 500 |
| Крайстчерч | NZ$1 500-2 500 |
| Куинстаун (горы!) | NZ$2 000-3 500 |

---

## Itogo

Новая Зеландия IT 2026: Green List Tier 2 (Software Engineer; Data Scientist; облегченный PR!); Skilled Migrant 160+ очков; Xero $10B (Веллингтон; Auckland; cloud accounting!); NZ$29.66/ч минималка (одна из самых высоких в мире!); Окленд NZ$2 500-4 500; Крайстчерч (дешевле; Canterbury; Alps!); Куинстаун (горы; бандже!; ski; не дешево); Lord of the Rings (Хоббитон; Матамата; 3ч от Окленда; MUST VISIT!); kiwi (птица; символ; nocturnal; очень редко увидишь!); Vegemite vs Marmite (у них Marmite; более мягкий); НДФЛ до 39% (прогрессивный; KiwiSaver обязательный 3% работник+работодатель).
`,
  },
  {
    slug: 'kak-pereekhat-v-irlandiyu-2026',
    title: 'Как переехать в Ирландию 2026: Critical Skills Permit, Apple/Google/Meta, €1 500-3 000 Дублин',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать Ирландия 2026 Critical Skills Permit Apple Google Meta аренда Дублин EU',
    seo_description: 'Переехать Ирландия 2026 Critical Skills Permit Apple Google Meta аренда Дублин EU tech',
    content_md: `# Ирландия IT 2026: Critical Skills Permit, Apple/Google/Meta EU HQ, Дублин €1 500-3 000

Ирландия — европейский хаб американских tech-гигантов. Apple; Google; Facebook (Meta); LinkedIn; Twitter (X) — EU-штаб-квартиры в Дублине. 12.5% корпоративный налог (один из самых низких EU). Critical Skills Employment Permit: IT + оффер + $34 000/год = рабочая виза без лимитов.

---

## Critical Skills Employment Permit

| Параметр | Значение |
|---------|---------|
| Порог зарплаты | €34 000/год (IT и ряд других профессий) |
| Общий порог | €64 000/год (все профессии) |
| Срок | 2 года → продление |
| ПМЖ | После 5 лет |
| Гражданство | После 5 лет ПМЖ |

---

## EU HQ американских tech-гигантов

| Компания | EU HQ | Зачем Ирландия |
|---------|-------|--------------|
| Apple | Cork | 12.5% корп. налог |
| Google | Dublin | Налоги + English |
| Meta (Facebook) | Dublin | Налоги + регулятор |
| LinkedIn | Dublin | — |
| Twitter/X | Dublin | — |
| Stripe | Dublin (соучредитель Патрик Коллисон — ирландец) | — |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Дублин (D2; D4; City Centre) | €2 500-4 500 |
| Дублин (D12; D15; периферия) | €1 500-2 500 |
| Корк (2-й IT-хаб) | €1 200-2 000 |
| Голуэй | €1 000-1 800 |

---

## Itogo

Ирландия IT 2026: Critical Skills Permit (€34k/год IT; 2 года; → 5 лет ПМЖ → гражданство!); Apple; Google; Meta; LinkedIn; Stripe — EU HQ Дублин; 12.5% корпоративный (почему все здесь!); Дублин €1 500-2 500 (дорогой!; кризис жилья 2024-2025 = аренда выросла!); Корк €1 200-2 000 (Apple; более спокойный); НДФЛ до 40%+USC; Ирландия не EU-Schengen (свой визовый режим!; UK + Ирландия = Common Travel Area); pub culture (Guinness; Traditional Music сессии каждый вечер!); cliffs of Moher (400 000 туристов/год; 3ч от Дублина!); EU-паспорт 5 лет (один из быстрейших!).
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
console.log(`\nБатч 288: ${ok} OK, ${err} ошибок`);
