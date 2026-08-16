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
    slug: 'yaponiya-tokio-osaka-dn-2026',
    title: 'Япония Токио Осака IT 2026: Highly Skilled Professional, $800-2 000 аренда, Sony, Toyota',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Япония Токио Осака IT 2026 Highly Skilled Professional аренда Sony Toyota переезд',
    seo_description: 'Япония Токио Осака IT 2026 Highly Skilled Professional аренда Sony Toyota переезд аниме раmen',
    content_md: `# Япония IT 2026: Highly Skilled Professional Visa (70+ очков), Токио ¥120 000-250 000, Sony/Toyota

Япония — технологическая держава с уникальной культурой. Highly Skilled Professional (HSP) Visa: очковая система (70+ required; 80+ = ускоренный ПМЖ). Sony ($90B); Toyota ($250B); SoftBank ($60B). Токио: мегаполис 13.9M. Аренда: ¥120 000-250 000/мес 2-комн ($800-1 600).

---

## Highly Skilled Professional (HSP) Visa

| Параметр | Значение |
|---------|---------|
| Минимум | 70 очков |
| Ускоренный ПМЖ | 80+ очков → ПМЖ через 1 год (vs 5 лет обычно) |
| Ультра-ускоренный | 70+ очков + топ-100 вуз → ПМЖ через 3 года |

---

## Как набрать очки (HSP Point System)

| Критерий | Очки |
|---------|-----|
| Степень PhD | 30 |
| Степень магистра | 20 |
| Бакалавр | 10 |
| Опыт 10+ лет | 20 |
| Зарплата ¥10M+ ($65k+) | 40 |
| Возраст до 30 лет | 15 |
| Японский N2+ | 10 |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Sony | $90B; Electronics; Gaming (PlayStation) |
| Toyota | $250B; Automotive + Tech |
| SoftBank | $60B; Telecom + Venture Capital |
| Rakuten | $10B; e-commerce + fintech |
| Mercari | $3B; C2C marketplace |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Токио (Shibuya; Shinjuku) | $1 200-2 500 |
| Токио (Nerima; Edogawa) | $800-1 400 |
| Осака (Namba; Shinsaibashi) | $700-1 300 |
| Фукуока (самый доступный) | $500-900 |

---

## Itogo

Япония IT 2026: HSP Visa 70+ очков (PhD+30; зарплата $65k+=40; 80+ = ПМЖ 1 год!); Sony; Toyota; SoftBank; Mercari $3B; Токио $800-1 600 (Nerima дешевле; Shibuya = дорого!); Фукуока (самый доступный город + Startup Visa специальная!); японский язык (N2 = 10 очков + реальная необходимость вне tech-компаний!); ramen ($8-15; Ичиран = must!); sushi (conveyor belt; $1-5/блюдо!); onsen (горячие источники); Kyoto (2ч от Токио); sakura (конец марта - начало апреля); Mount Fuji; уважение + чистота + порядок = культурный шок для многих россиян (в хорошем смысле!).
`,
  },
  {
    slug: 'koreya-seul-pуsan-it-2026',
    title: 'Южная Корея Сеул IT 2026: D-8 Startup Visa, Samsung, Kakao, ₩1.5-3M аренда, K-culture',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Южная Корея Сеул IT 2026 D-8 Startup Visa Samsung Kakao аренда K-culture переезд',
    seo_description: 'Южная Корея Сеул IT 2026 D-8 Startup Visa Samsung Kakao аренда K-culture переезд K-pop',
    content_md: `# Южная Корея IT 2026: D-10 Job Seeker, D-8 Startup, Samsung $400B, Kakao $15B, Сеул ₩1.5-3M

Южная Корея — технологическая держава (Samsung $400B; LG $50B; Kakao $15B; Krafton). K-Culture (BTS; Netflix «Игра в кальмара»; Parasite). D-10 Job Seeker Visa: поиск работы 6 мес без оффера. D-8 Startup Visa: создание стартапа. Сеул: ₩1 500 000-3 000 000/мес аренда.

---

## Визы в Южную Корею

| Виза | Для кого | Срок |
|------|---------|------|
| D-10 Job Seeker | Поиск работы без оффера | 6 мес + продление |
| E-7 Специалист | Оффер от корейской компании | 1-3 года |
| D-8 Startup Visa | Создание компании в Корее | 2 года |
| F-5 ПМЖ | 5+ лет легального проживания | Постоянный |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Samsung | $400B; чипы; смартфоны; TV; техника |
| Kakao | $15B; KakaoTalk (мессенджер 95% корейцев); KakaoBank |
| Krafton | $5B; PUBG; Battlegrounds |
| Naver | $25B; поиск; LINE мессенджер (Япония!) |
| Coupang | $10B; e-commerce; Amazon Кореи |

---

## Jeonse: уникальная корейская система аренды

Jeonse: одноразовый депозит (20-80% стоимости квартиры) на 2 года без ежемесячной оплаты. После 2 лет — депозит возвращается.
Monthly (월세): обычная ежемесячная аренда ($800-2 500 2-комн Сеул).

---

## Стоимость жизни

| Место | Аренда 2-комн (monthly) |
|-------|----------------------|
| Сеул Gangnam; Mapo | ₩2 000 000-4 000 000 ($1 500-3 000) |
| Сеул Nowon; Dobong | ₩1 000 000-2 000 000 ($750-1 500) |
| Пусан (2-й город) | ₩800 000-1 800 000 ($600-1 400) |

---

## Itogo

Южная Корея IT 2026: D-10 Job Seeker (6 мес без оффера; уникально!); D-8 Startup; Samsung $400B; Kakao KakaoTalk 95% корейцев; PUBG Krafton; Naver+Line; Coupang; Сеул ₩1-3M ($750-2 500); K-Food (Korean BBQ; bibimbap; kimchi; tteokbokki = рисовые клецки в остром соусе $3-7!); K-Beauty (косметика = мировой экспорт!); Han River парки (велодорожки; пикники; BBQ!); PC-банги (24/7 компьютерные клубы $1/ч; культура!); корейский язык (хангыль = логически построен; выучить алфавит за 1 день!); быстрейший интернет в мире (средний $100 Mbps; норма!).
`,
  },
  {
    slug: 'kak-pereekhat-finansistu-banku-za-rubezh-2026',
    title: 'Как переехать финансисту или банкиру за рубеж 2026: ACCA, CFA, ОАЭ DIFC, Швейцария',
    tag: 'работа',
    read_time: 2,
    country_slug: null,
    seo_title: 'Переехать финансист банкир рубеж 2026 ACCA CFA ОАЭ DIFC Швейцария Лондон',
    seo_description: 'Переехать финансист банкир рубеж 2026 ACCA CFA ОАЭ DIFC Швейцария Лондон финансы',
    content_md: `# Финансист/банкир за рубежом 2026: ACCA/CFA — международный пропуск, ОАЭ DIFC, Люксембург, Швейцария

Финансисты с международными сертификатами имеют преимущество при переезде. ACCA (Association of Chartered Certified Accountants): признается в 180+ странах. CFA (Chartered Financial Analyst): глобальный стандарт для инвестиций. DIFC Дубай: крупнейший финансовый центр Ближнего Востока.

---

## Международные сертификаты

| Сертификат | Для чего | Срок | Стоимость |
|-----------|---------|------|---------|
| **ACCA** | Бухгалтерия; аудит; финансы | 2-4 года (самостоятельно) | £1 000-3 000 за 13 экзаменов |
| **CFA** | Investment Analysis; Portfolio | 3+ года | $3 000-5 000 за 3 уровня |
| CIMA | Management Accounting | 2-3 года | £2 000-4 000 |
| FRM | Risk Management | 1-2 года | $1 000-2 000 |
| CAIA | Alternative Investments | 1-2 года | $2 000-3 000 |

---

## Лучшие финансовые хабы

| Город | Особенность | Зарплата |
|-------|------------|---------|
| Лондон | Глобальный #1; £40-150k+ | £40-150k/год |
| Дубай DIFC | 0% НДФЛ; 6 000+ компаний | $80-200k/год |
| Люксембург | EU финансовый хаб; фонды | €70-130k/год |
| Цюрих | Банки; UBS; Credit Suisse | CHF 100-200k/год |
| Сингапур | Азиатский финхаб; ASEAN | $80-200k USD/год |

---

## DIFC Дубай: самый доступный хаб для россиян

- Dubai International Financial Centre: 6 000+ компаний; регулятор DFSA
- 0% НДФЛ + 0% корпоративный (Freezone)
- ACCA + работа в Дубай = Employment Visa через работодателя
- Работа: Bloomberg; HSBC; Standard Chartered; Goldman; JP Morgan (UAE офисы)

---

## Itogo

Финансист за рубежом 2026: ACCA (£1-3k; 13 экзаменов; 180+ стран признают; начать прямо сейчас!); CFA (3 уровня; $3-5k; 3+ года; инвестиции + портфель!); DIFC Дубай (6 000+ компаний; 0% НДФЛ; Employment Visa через работодателя; Bloomberg/HSBC/Goldman UAE офисы!); Люксембург (EU финансовый хаб; фонды; €70-130k; Schengen!); Цюрих (CHF 100-200k; самые высокие зарплаты в EU/CH; дорого жить!); Лондон (глобальный #1; £40-150k; не EU теперь!); CIMA; FRM; CAIA = дополнительные специализации.
`,
  },
  {
    slug: 'kapo-verde-mindelo-dn-2026',
    title: 'Кабо-Верде DN 2026: португальский архипелаг Атлантика, $200-400 аренда, безопасная Африка',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Кабо-Верде DN 2026 португальский архипелаг Атлантика аренда безопасная Африка переезд',
    seo_description: 'Кабо-Верде DN 2026 португальский архипелаг Атлантика аренда безопасная Африка переезд острова',
    content_md: `# Кабо-Верде DN 2026: португальский архипелаг Атлантика, $200-400 аренда, безопасная Африка

Кабо-Верде (Cabo Verde) — архипелаг из 10 островов в Атлантике (570 км от Сенегала). Самая безопасная Африка (стабильная демократия; европейский стиль управления; португальское наследие). $200-400 аренда. UTC-1 = удобно для EU-работы. Portuguese language + Creole. Morna музыка (ЮНЕСКО 2019).

---

## Ключевые факты

| Параметр | Значение |
|---------|---------|
| Язык | Португальский (официальный); Cape Verdean Creole |
| Аренда 2-комн | $200-400 |
| Безвизово (РФ) | Visa on Arrival $35 |
| Часовой пояс | UTC-1 (Лондон -1; EU-работа рано утром) |
| Погода | +25-30 круглый год |
| Ветер | Сильный (кайтсерфинг мировой класс!) |

---

## Острова по характеру

| Остров | Характер |
|--------|---------|
| Санта Мария (Sal) | Туристический; пляжи; аэропорт прямой |
| Сан-Висенти (Mindelo) | Культурная столица; музыка; порт; богемный |
| Сантьяго (Прая) | Столица; бизнес; аутентичный |
| Сан-Николау | Горный; нетронутый; дешево |
| Фого | Вулкан (действующий!) + виноград на лаве |

---

## Morna: музыкальный дар Кабо-Верде

Morna — меланхоличная музыка в стиле «африканского фаду». ЮНЕСКО Нематериальное наследие 2019. Cesaria Evora — «Босоногая дива»; наиболее известная морна-исполнительница в мире.

---

## Itogo

Кабо-Верде DN 2026: самая безопасная Африка (стабильная демократия; European-style governance!); $200-400 аренда; +25-30 круглый год; UTC-1; португальский язык; Morna ЮНЕСКО; Mindelo (культурная столица; порт; богемный); Sal (туристы; прямые рейсы EU!); кайтсерфинг мировой класс (Sal; Boa Vista; постоянный ветер!); Фого (вулкан + виноград на лаве = уникальное!); Cesaria Evora (легенда!); cachupa (рагу с кукурузой+бобовыми+мясом = национальное!); grogue (местный ром из сахарного тростника = попробуй!); интернет (4G LTE; в туристических зонах нормально; в деревнях хуже).
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
console.log(`\nБатч 290: ${ok} OK, ${err} ошибок`);
