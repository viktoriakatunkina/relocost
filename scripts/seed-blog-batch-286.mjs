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
    slug: 'polsha-varshava-krakow-it-2026',
    title: 'Польша Варшава Краков IT 2026: EU, €600-1 200 аренда, CD Projekt RED, Allegro, 19% НДФЛ',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Польша Варшава Краков IT 2026 EU аренда CD Projekt RED Allegro 19% НДФЛ переезд',
    seo_description: 'Польша Варшава Краков IT 2026 EU аренда CD Projekt RED Allegro 19% НДФЛ переезд Центральная Европа',
    content_md: `# Польша IT 2026: EU-страна, CD Projekt RED $3B, Allegro €10B, Варшава €600-1 200, 19% НДФЛ

Польша — самая крупная экономика Центральной Европы. Быстрый рост IT-сектора. CD Projekt RED (Cyberpunk 2077; Witcher): $3B. Allegro: €10B (польский Amazon). Варшава: €600-1 200 2-комн. EU Blue Card порог: €16 000/год. НДФЛ 12-32% (линейный 19% для ИП — популярный вариант).

---

## НДФЛ для IT-специалистов

| Схема | Ставка | Условие |
|-------|--------|---------|
| Общая шкала | 12% до 120k PLN; 32% выше | Для сотрудников |
| Линейный (Liniowy) | 19% flat | Для самозанятых ИП (B2B) |
| IP Box | 5% | Для создателей программного обеспечения! (авторское право) |

---

## IP Box: уникальная льгота 5%!

- Польша IP Box (Innovation Box): 5% налог на доход от интеллектуальной собственности
- Применяется к: разработке программного обеспечения; патентам; R&D
- Требует: отдельный учет R&D деятельности + бухгалтер
- 5% vs 19% = огромная разница при высоком доходе!

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| CD Projekt RED | $3B; Cyberpunk 2077; The Witcher |
| Allegro | €10B; e-commerce; Польский Amazon |
| OLX Group | $2B; Marketplace; Варшава |
| Docplanner | $600M; Health bookings |
| Booksy | $400M; Appointment scheduling |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Варшава Mokotow; Zoliborz | €700-1 200 |
| Варшава Praga; Bielany | €500-900 |
| Краков | €600-1 000 |
| Вроцлав | €500-900 |
| Лодзь | €350-650 |

---

## Itogo

Польша IT 2026: EU Blue Card €16k/год порог; IP Box 5% (разработчики ПО; УНИКАЛЬНАЯ льгота; лучше Румынии/Болгарии при высоком доходе!); Линейный ИП 19% (B2B стандарт); CD Projekt RED (Witcher; Cyberpunk; Варшава!); Allegro €10B; OLX $2B; Варшава €600-1 200; Краков (UNESCO; Вавельский замок; самый красивый польский город; €600-1 000!); EU-паспорт 5 лет + польское гражданство (доступно через натурализацию!); польский язык (схож с чешским/словацким; для русских читается!); pierogi (вареники с картошкой+сыром; $3-8 в кафе!); bigos; Польша Шенген.
`,
  },
  {
    slug: 'finlyandiya-helsinki-it-2026',
    title: 'Финляндия Хельсинки IT 2026: Supercell, Nokia, €1 500-2 500 аренда, D-виза для специалистов',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Финляндия Хельсинки IT 2026 Supercell Nokia аренда D-виза специалистов переезд EU',
    seo_description: 'Финляндия Хельсинки IT 2026 Supercell Nokia аренда D-виза специалистов переезд EU Северная',
    content_md: `# Финляндия IT 2026: Supercell €10B, Nokia, Helsinki D-виза для специалистов, €1 500-2 500 аренда

Финляндия — технологическая страна с одними из лучших школ в мире (PISA #1-3) и выдающимся качеством жизни. Supercell (Clash of Clans; Brawl Stars): €10B. Nokia: $30B (5G revival). Helsinki D-виза для специалистов: 1 мес ускоренное оформление. Высокий НДФЛ (до 53%) но богатый welfare state.

---

## Visa для IT-специалистов

| Программа | Условие | Срок |
|----------|---------|------|
| EU Blue Card | Оффер + €43 000/год | 2-4 мес |
| D-виза специалиста | Оффер в финской компании | 1 мес (ускоренная!) |
| Start-up Visa | Инновационный стартап + €75k | 2-4 мес |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Supercell | €10B; Clash of Clans; Brawl Stars; Hay Day |
| Rovio | Angry Birds; €780M; Хельсинки |
| Nokia | $30B; 5G networks; Espoo |
| Wolt | €8.1B; Food delivery (продан DoorDash) |
| Smartly.io | $1B; Ad automation |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Хельсинки центр | €1 800-3 000 |
| Хельсинки периферия | €1 200-2 000 |
| Эспоо (Nokia HQ; Supercell) | €1 400-2 500 |
| Тампере (2-й IT-хаб) | €1 000-1 800 |
| Оулу | €800-1 400 |

---

## Itogo

Финляндия IT 2026: D-виза 1 мес (ускоренная; лучший путь при оффере!); Supercell €10B (Clash of Clans; 100% remote на пандемии; Хельсинки!); Nokia $30B revival (5G; Espoo); Wolt €8.1B; НДФЛ до 53% (высокий!; но healthcare + образование бесплатно; пособия; welfare state = реальная ценность!); Хельсинки €1 500-2 500; Эспоо (Nintendo-of-Finland area; чище; семейный); sisu (финское слово = стойкость/упорство; национальная черта!); sauna (в каждом доме; обязательный ритуал; публичные sauna по €15-20!); лосось; karjalanpiirakka (рисово-ржаной пирожок; $1-3); полярная ночь (декабрь = 6ч солнца; aurora borealis!).
`,
  },
  {
    slug: 'kak-pereekhat-yuristu-advokata-za-rubezh-2026',
    title: 'Как переехать юристу за рубеж 2026: адвокатура EU, нострификация, сферы без барьеров',
    tag: 'работа',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать юрист адвокат рубеж 2026 адвокатура EU нострификация международное право',
    seo_description: 'Переехать юрист адвокат рубеж 2026 адвокатура EU нострификация международное право контракты',
    content_md: `# Юрист за рубежом 2026: нострификация в EU, международное право, корпоративный юрист, Legal Ops

Юриспруденция — сложная для эмиграции профессия. Практиковать как адвокат (судебное представительство) требует нострификации. Но: международное право; корпоративные контракты; compliance; legal tech; Legal Ops — без ограничений. Сфера Legal Operations ($4-10k/мес удаленно) = оптимальный путь.

---

## Пути для юристов за рубежом

| Путь | Страны | Сложность | Зарплата |
|------|--------|---------|---------|
| Адвокатура местная | EU (каждая страна отдельно) | Высокая (нострификация!) | €3 000-8 000 |
| Международное право (арбитраж) | Нейтральная юрисдикция | Средняя | $5 000-15 000 |
| Корпоративный юрист (in-house) | Любая страна с оффером | Средняя | $4 000-12 000 |
| **Legal Ops / Legal Tech** | **Удаленно; любая страна** | **Низкая!** | **$4 000-10 000** |
| Compliance (AML; GDPR) | EU; ОАЭ; UK | Средняя | €4 000-9 000 |

---

## Legal Operations: что это

Legal Ops = управление юридическими процессами без практики права:
- Управление контрактами (CLM — Contract Lifecycle Management)
- Внедрение Legal Tech (Ironclad; DocuSign; Juro)
- GDPR compliance; Privacy programs
- Vendor management юридических услуг
- Не требует адвокатского статуса!

---

## Международный арбитраж: самая мобильная практика

- Международный коммерческий арбитраж (ICC; LCIA; AAA) = практика без привязки к стране
- Женева; Лондон; Париж; Сингапур = основные центры
- ICSID (инвестиционный арбитраж; Всемирный банк)
- Требует: опыт в international commercial law; языки; нетворкинг

---

## Нострификация адвокатуры в EU

| Страна | Процесс | Срок |
|--------|---------|------|
| Германия | Zusatzprüfung (немецкий + экзамен) | 1-2 года |
| Эстония | Признание через EU-директиву (если EU-диплом) | 3-6 мес |
| Польша | Egzamin Adwokacki + практика | 1-2 года |

---

## Itogo

Юрист за рубежом 2026: Legal Ops/Legal Tech (CLM; GDPR compliance; CONTRACT automation; без адвокатского статуса!; $4-10k remote!); международный арбитраж (Женева; Лондон; Сингапур = мобильные хабы; без нострификации!); корпоративный юрист (in-house; оффер → виза); нострификация в EU (Германия Zusatzprüfung 1-2 года; Польша Adwokacki 1-2 года); AML/KYC compliance (финтех бум = огромный спрос; онлайн-курсы ACAMS; $4-8k!); GDPR Privacy Officer ($4-8k; EU требует!); Legal технологии: Ironclad; Juro; Clio; знание = конкурентное преимущество.
`,
  },
  {
    slug: 'norvegia-oslo-bergen-it-2026',
    title: 'Норвегия Осло Берген IT 2026: EU Skilled Worker, нефтяные фонды, €2 000-4 000 аренда',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Норвегия Осло Берген IT 2026 EU Skilled Worker нефтяные фонды аренда переезд Скандинавия',
    seo_description: 'Норвегия Осло Берген IT 2026 EU Skilled Worker нефтяные фонды аренда переезд Скандинавия',
    content_md: `# Норвегия IT 2026: Skilled Worker Visa, нефтяной фонд $1.7T, Oslofjord, €2 000-4 000 аренда

Норвегия — самая богатая страна Скандинавии. Государственный нефтяной фонд: $1.7 трлн (крупнейший суверенный фонд в мире!). Не EU-страна (EEA/Schengen). Skilled Worker Visa: оффер + квалификация. Зарплаты Senior IT: €6 000-12 000 (одни из высочайших в EU). НДФЛ до 47.4%.

---

## Skilled Worker Visa Норвегия

| Параметр | Значение |
|---------|---------|
| Основание | Оффер от норвежского работодателя |
| Срок | 1-3 года (продлеваемая) |
| Зарплата | Не ниже отраслевого минимума (разная для профессии) |
| ПМЖ | 3 года → постоянное резидентство |
| Гражданство | 7 лет → норвежское (один из самых длинных!) |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Kongsberg Digital | $500M; Industrial IoT |
| Visma | $10B; Business software; Oslo |
| Schibsted | $5B; Media + MarketPlace; VG; Finn.no |
| Autostore | $12B; Warehouse Robotics |
| Nordic Semiconductor | $5B; IoT chips |

---

## Зарплаты в IT (нетто, NOK → EUR)

| Роль | Зарплата/мес (нетто) |
|------|---------------------|
| Junior Developer | €3 000-5 000 |
| Senior Developer | €5 000-9 000 |
| Team Lead | €7 000-12 000 |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Осло (Frogner; Majorstuen) | €2 500-4 500 |
| Осло (Groruddalen; периферия) | €1 800-3 000 |
| Берген | €2 000-3 500 |
| Тронхейм | €1 500-2 500 |

---

## Itogo

Норвегия IT 2026: нефтяной фонд $1.7T (государство богатейшее; welfare state = феноменальный!); Skilled Worker Visa (оффер; не EU но Schengen EEA!); Visma $10B; Autostore $12B; Senior $5-9k нетто; Осло €2 000-4 000 (дорого!; но зарплаты = компенсируют); НДФЛ до 47.4% (высокий; но не платишь за медицину; образование детей; декрет 80-100% до 49 нед!); fjord (Geirangerfjord; Nærøyfjord ЮНЕСКО!); norskе salmon ($5-10 в магазине!); Northern Lights (октябрь-март Тромсо); skihopp; Norwegian Wood (Haruki Murakami!); EEA = вправе работать в Норвегии с EU Blue Card!.
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
console.log(`\nБатч 286: ${ok} OK, ${err} ошибок`);
