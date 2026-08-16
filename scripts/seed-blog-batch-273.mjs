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
    slug: 'shankhay-pekhin-it-kitay-2026',
    title: 'Шанхай Пекин IT Китай 2026: ByteDance $300B, WeChat, ВНЖ сложности, $600-1 500 аренда',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Шанхай Пекин IT Китай 2026 ByteDance WeChat ВНЖ сложности аренда переезд',
    seo_description: 'Шанхай Пекин IT Китай 2026 ByteDance WeChat ВНЖ сложности аренда переезд иностранец',
    content_md: `# Китай IT 2026: ByteDance $300B (TikTok!), WeChat $500B, сложный ВНЖ, Шанхай $600-1 500 аренда

Китай — крупнейший IT-рынок мира после США. ByteDance (TikTok) — $300B. WeChat (Tencent) — $500B. Но для иностранных специалистов: Firewall (заблокированы Google; YouTube; Instagram; WhatsApp) + сложный рабочий ВНЖ. Шанхай — наиболее открытый международный город.

---

## IT-гиганты Китая

| Компания | Оценка | Продукт |
|---------|--------|---------|
| ByteDance | $300B | TikTok; Douyin; Toutiao |
| Tencent | $450B | WeChat; QQ; Games |
| Alibaba | $200B | Taobao; Alipay; Cloud |
| Baidu | $40B | Поиск; ERNIE LLM |
| Meituan | $100B | Food delivery; local services |
| Pinduoduo | $150B | E-com; Temu |

---

## Рабочая виза (Z Visa) для иностранца

| Требование | Значение |
|---------|---------|
| Степень | Бакалавр + |
| Опыт | 2+ лет в профессии |
| Оффер | Нужен китайский работодатель |
| Разрешение | SAFEA; через работодателя |
| Сложность | Высокая (бюрократия; долго) |

---

## Стоимость жизни

| Город | Аренда 2-комн |
|-------|-------------|
| Шанхай (Jing An; Huangpu; Pudong) | $600-2 000 (CNY 4 500-14 000) |
| Пекин (Chaoyang; Haidian) | $500-1 500 |
| Шэньчжэнь (Nanshan; tech-hub) | $400-1 200 |
| Ченду | $300-800 |

---

## Главные сложности

- **Firewall**: нет Google; YouTube; WhatsApp; Instagram; Facebook без VPN (VPN технически незаконны!)
- **WeChat**: без WeChat = без жизни в Китае (такси; платежи; социальное)
- **Alipay**: привязан к китайскому банку — иностранцам открыть сложно
- **Языковой барьер**: иероглифы везде; без мандаринского сложно за пределами expat-зон

---

## Итого

Китай IT 2026: ByteDance $300B (TikTok!); Tencent WeChat $450B; Alibaba; Baidu ERNIE; Z Visa (оффер + SAFEA; долго!); Firewall (VPN технически незаконен!); WeChat = ключ к жизни; Шанхай $600-2 000 (Jing An; наиболее международный); Шэньчжэнь (tech-hub; рядом Гонконг; Huawei HQ; Tencent HQ); мандаринский = необходимость (за пределами expat-зон); xiaolongbao (дамплинги с бульоном; Шанхай; $3-5!); Великая стена; Желтая гора.
`,
  },
  {
    slug: 'sloveniya-lyublyana-maribor-it-2026',
    title: 'Словения Любляна Марибор IT 2026: EU-резидентство, €900-1 400 аренда, Alpine',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Словения Любляна Марибор IT 2026 EU резидентство аренда Alpine природа переезд',
    seo_description: 'Словения Любляна Марибор IT 2026 EU резидентство аренда Alpine природа переезд нейтральная',
    content_md: `# Словения Любляна IT 2026: EU; Blue Card, €900-1 400 аренда, Alpine природа + Адриатика 1.5ч

Словения — одна из самых недооцененных EU-стран. 100% природы: Альпы + Адриатика (1.5ч от Любляны) + озеро Блед (Instagram-классика). Аренда Любляна: €900-1 400. EU Blue Card: оффер + €15 000/год (ниже EU-среднего из-за более скромных зарплат).

---

## Ключевые факты

| Параметр | Значение |
|---------|---------|
| Население | 2.1 млн (как небольшой мегаполис!) |
| Аренда 2-комн (Любляна) | €900-1 400 |
| НДФЛ | До 50% (прогрессивный) |
| EU Blue Card порог | €15 000/год (ниже среднего EU) |
| Природа | Альпы + Блед (40 мин) + Адриатика (1.5ч) |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| Outfit7 | Talking Tom; $1B (продан китайцам) |
| Celtra | Martech; $100M+ |
| Adacta | Insurance SaaS; EU-клиенты |
| Toshl Finance | Personal finance app |
| Viberate | Music analytics |

---

## Почему Словения для переезда

- Природа #1 в EU (Альпы; Триглав; Блед; Bohinj; Postojna Cave!)
- Маленький размер страны = всё в 1-2 часах (Хорватия; Италия; Австрия; Венгрия!)
- Ljubljana = самая маленькая столица EU (280 000 чел; уютная; велосипеды!)
- Английский язык хорошо в IT (словенский — другое дело)
- EU-страна с 2004 + Шенген + Еврозона

---

## Итого

Словения IT 2026: EU Blue Card (оффер + €15 000/год); Любляна €900-1 400 (маленькая столица 280k; велосипеды; уютно!); Outfit7 $1B (Talking Tom!); Блед (голубое озеро; замок; 40 мин!); Триглав (3-дневный трек); Адриатика Порторож (1.5ч!); Италия Триест (40 мин!); НДФЛ до 50% (прогрессивный; минус!); EU-паспорт через 10 лет; отличная экология; поштruklji (тесто с начинкой; национальное!); kranská klobasa (краинская колбаса).
`,
  },
  {
    slug: 'oman-muskat-dn-goldenresidens-2026',
    title: 'Оман Маскат DN 2026: Freelance Visa, 0% НДФЛ, $400-900 аренда, самый безопасный Залив',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Оман Маскат DN 2026 Freelance Visa 0% НДФЛ аренда самый безопасный Залив переезд',
    seo_description: 'Оман Маскат DN 2026 Freelance Visa 0% НДФЛ аренда самый безопасный Залив переезд горы море',
    content_md: `# Оман Маскат DN 2026: 0% НДФЛ, Freelance/Remote Visa, $400-900 аренда, самый нейтральный Залив

Оман — самая нейтральная и безопасная страна Персидского залива (дружит со всеми; не конфликтует). 0% НДФЛ. Freelance Visa / Remote Work Visa для DN (введена в 2021). Маскат: $400-900 аренда 2-комн. Горы + море: Джебель-Ахдар (Зеленая гора); фьорды Хасаб; пустыня Вахиба (250 000 кв.км розовых барханов!).

---

## Remote/Freelance Visa Оман

| Параметр | Значение |
|---------|---------|
| Доход | $1 500+/мес от иностранного работодателя |
| Срок | 1 год (продлеваемая) |
| Требования | Паспорт; банковская выписка; страховка |
| НДФЛ | 0% |

---

## Стоимость жизни

| Место | Аренда 2-комн |
|-------|-------------|
| Маскат (Al Khuwair; Shati) | $400-900 |
| Маскат (Qurum; богатый) | $600-1 500 |
| Салала (юг; зеленее; дешевле) | $300-700 |

---

## Почему Оман уникален

- Единственная страна Залива, которая не занимала сторону ни в одном региональном конфликте
- Султан Кабус (1970-2020) = архитектор современного Омана; дипломатический посредник
- Горы Хаджар (самые высокие в Аравии; треккинг; деревни-крепости!)
- Джебель-Ахдар (Зеленая гора; розы; фрукты; +2000м = прохладно!)
- Вади (ущелья с водой; Вади Шаб = Wadi Shab = кристальная вода в пустыне!)
- Черепахи Рас-аль-Джинз (откладывают яйца ночью; наблюдение!)

---

## Итого

Оман DN 2026: Remote Visa $1 500/мес (1 год; 0% НДФЛ); самый нейтральный Залив (дружит со всеми!); Маскат $400-900; горы + море + пустыня в радиусе 2ч; Джебель-Ахдар (Зеленая гора; розы!); Вади Шаб (кристальные водоемы!); черепахи Рас-аль-Джинз; арабский кофе с кардамоном + халва = традиционное гостеприимство; Oman Air (неплохой); жарко летом +40 (октябрь-апрель = лучший период); Салала (зеленый юг; +22-30 даже летом = уникально в Аравии!).
`,
  },
  {
    slug: 'kak-nayti-rabotu-v-inostrannom-startape-2026',
    title: 'Как найти работу в иностранном стартапе 2026: Wellfound, Y Combinator, Crunchbase, Twitter',
    tag: 'работа',
    read_time: 2,
    country_slug: null,
    seo_title: 'Найти работу иностранный стартап 2026 Wellfound Y Combinator Crunchbase Twitter LinkedIn',
    seo_description: 'Найти работу иностранный стартап 2026 Wellfound Y Combinator Crunchbase Twitter LinkedIn remote',
    content_md: `# Найти работу в иностранном стартапе 2026: Wellfound (AngelList), YC Jobs, Twitter/X outreach

Стартапы нанимают быстрее корпораций и чаще берут удаленных кандидатов. Wellfound (бывший AngelList Talent): профиль бесплатный, стартапы из Y Combinator; a16z; Sequoia. YC Work at a Startup: напрямую в YC-компании. Twitter/X: 80% tech-CEO присутствуют — прямой outreach работает.

---

## Топ-платформы для стартапов

| Платформа | Для кого | Бесплатно |
|-----------|---------|----------|
| **Wellfound (AngelList)** | Стартапы + equity | Да |
| Work at a Startup (YC) | Y Combinator-компании | Да |
| Crunchbase Jobs | Venture-funded стартапы | Да |
| Product Hunt Jobs | Product; design; tech | Да |
| LinkedIn (через поиск) | Все уровни | Профиль бесплатно |

---

## Y Combinator — как использовать

1. Список YC-компаний: ycombinator.com/companies (фильтр по batch; sector; location)
2. Work at a Startup: workatastartup.com — подача в несколько YC-компаний одновременно
3. YC Alumni Founders: часто сами в LinkedIn — прямой аутрич (референс YC работает!)

---

## Twitter/X outreach к CEO/CTO

Работает для: дизайн; product; sales; marketing; content (меньше для core-engineering).

Шаблон:
- Найди CEO/CTO на Twitter
- Почитай их посты (3-5 последних)
- Комментируй ценно (НЕ «отличный пост!»)
- DM через 2-3 недели: «Я [X] видел ваши посты про [Y]. Как я решил похожую проблему: [конкретный результат]. Открыт к разговору?»

---

## Equity (акции стартапа)

- ISOs (Incentive Stock Options): только для US-компаний; сотрудники US
- NSOs (Non-Qualified): для международных сотрудников
- Cliff 1 год (первые 25% vest только через 12 мес работы)
- Vesting 4 года (обычно)
- Попроси cap table: сколько всего акций; какой % твой грант

---

## Итого

Работа в стартапе 2026: Wellfound профиль бесплатно (YC; a16z; Sequoia компании); workatastartup.com (YC-компании; одна заявка → много компаний!); Crunchbase Jobs (venture-funded); Twitter/X CEO outreach (работает особенно для нон-инженерных ролей!); equity (ISOs US only; NSOs international; cliff 1 год; vesting 4 года; проси cap table!); стартапы нанимают быстрее (2-4 нед vs 3-6 мес корпорации!); EOR (Deel; Remote) = как получить деньги без US-юрлица.
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
console.log(`\nБатч 273: ${ok} OK, ${err} ошибок`);
