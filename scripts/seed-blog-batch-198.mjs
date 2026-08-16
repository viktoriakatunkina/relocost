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
    slug: 'kanada-toronto-vankuver-it-2026',
    title: 'Канада для IT 2026: Express Entry, Global Talent Stream, Toronto, Vancouver, Shopify, Atlassian',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Канада Toronto Vancouver IT 2026 Express Entry ПМЖ: ВИЗЫ И ПУТИ ДЛЯ IT: EXPRESS ENTRY (Federal Skilled Worker, FSW): основная программа ПМЖ; балльная система CRS (Comprehensive Ranking System); максимум 1 200 баллов; типичный приглашённый порог: 480-560 CRS (постоянно меняется); критерии: возраст (максимум 25-35 лет); образование; опыт; IELTS (CLB 9 = C1 = максимум); адаптируемость; Provincial Nominee Program (PNP): провинция номинирует = +600 CRS = почти гарантированный ITA; GLOBAL TALENT STREAM (GTS): Work Permit через 2 недели; специально для IT; работодатель должен подать Labour Market Impact Assessment (LMIA) категория A или B; Категория A: конкретные NOC коды: Software Engineers (NOC 21232); Web Designers (21233); Database Analysts (21223); Cybersecurity Specialists (21220); Data Scientists (21211); Категория B: уникальный талант; требует подтверждения; $80 000+ зарплата; INTRA-COMPANY TRANSFER: перевод из иностранного офиса в канадский; Work Permit без LMIA; PROVINCIAL PROGRAMS: ONTARIO IMMIGRANT NOMINEE PROGRAM (OINP): Human Capital Priorities (HCP): IRCC передаёт профили из EE пула; Tech Draw: ежегодно около 5 000 номинаций; Employer Job Offer (EJO): job offer от ON-работодателя; BRITISH COLUMBIA PNP: BC Tech Pilot: партнёрство с BC Tech Association; ALBERTA: Fast Track: Medical Technology + Energy + Agriculture + IT; PROVINCES COMPARISON: Ontario: Toronto — крупнейший hub; дорогое жильё; British Columbia: Vancouver = Silicon North; дорогое; Quebec: французский обязателен; Saskatchewan: дешевле; Manitoba: Skilled Worker = дешевле + проще; Nova Scotia: Living Heritage; Atlantic Immigration Program; IELTS ДЛЯ КАНАДЫ: Reading 8+/Listening 8+/Speaking 7.5+/Writing 7.5 = CLB 9 = максимум баллов EE; реально нужен C1 английский (большинство IT = уже имеют); ОБРАЗОВАНИЕ: Canadian Education Credential Assessment: WES (World Education Services) = самый распространённый; BSc Computer Science от аккредитованного вуза РФ = обычно признаётся; НАЛОГИ КАНАДЫ: федеральный НДФЛ: 15% до CAD 55 867; 20.5% CAD 55 867-111 733; 26% CAD 111 733-154 906; 29% CAD 154 906-220 000; 33% свыше CAD 220 000; провинциальный НДФЛ (ON): ещё 5.05-13.16% поверх; итого combined top rate Ontario: около 53%; RRSP (пенсионный вычет): 18% дохода/год = вычет из налогооблагаемой базы; CPP (Canada Pension Plan): 5.95% зарплаты (2024; совместно employer+employee); нет налога на дивиденды (для public companies: dividend tax credit снижает эффективную ставку до 15-25%); Capital Gains Tax: 50% inclusion rate (то есть 50% прироста = доход; при 33% top rate = эффективный CGT ~16.5%); HST (НДС) в Ontario: 13%; Alberta: 5% (только GST; нет provincial)',
    seo_description: 'Канада Toronto Vancouver IT 2026 зарплаты стоимость жизни: ЗАРПЛАТЫ IT КАНАДА: Junior Developer: CAD 65 000-90 000/год ($47 500-65 700); Middle Developer: CAD 90 000-130 000/год ($65 700-94 900); Senior Developer: CAD 130 000-180 000/год ($94 900-131 400); Staff/Principal Engineer: CAD 180 000-250 000/год ($131 400-182 500); Shopify Senior: CAD 160 000-250 000+/год; СТОИМОСТЬ ЖИЗНИ TORONTO: аренда 1BR (Downtown Toronto/Midtown): CAD 2 400-3 200/мес ($1 752-2 336); аренда 1BR (Scarborough/Etobicoke): CAD 2 000-2 700/мес ($1 460-1 971); продукты: CAD 600-900/мес ($438-657); transit pass (Presto): CAD 156/мес ($114); жизнь итого: CAD 3 500-5 500/мес ($2 555-4 015); СТОИМОСТЬ ЖИЗНИ VANCOUVER: аренда 1BR (Downtown Vancouver): CAD 2 600-3 500/мес ($1 898-2 555); жизнь итого: CAD 4 000-6 000/мес ($2 920-4 380); ДЕШЕВЛЕ ЖИТЬ: Calgary (без provincial income tax), Winnipeg, Halifax; IT КОМПАНИИ КАНАДЫ: SHOPIFY (e-commerce platform; NYSE SHOP; $90B+ peak; Ottawa HQ; remote-first; global 10 000+ сотрудников); Atlassian (ITSM/Jira/Confluence; NYSE TEAM; ~$50B; Austin TX + Sydney AU + Toronto); Wattpad (stories; Korean Webtoon acq.; Toronto); Hootsuite (social media; Vancouver); Veeva Systems (pharma SaaS; NYSE; $40B; Toronto); Thomson Reuters (media + legal tech; NYSE; $70B; Toronto); OpenText (enterprise content mgmt; TSX OTEX; Waterloo ON); Manulife Financial (FinTech; TSX; Toronto); Royal Bank of Canada Tech (50 000+ technology workers); TD Bank Technology; CIBC Technology; Scotiabank Technology; BCE Inc. Technology; Telus Digital; Rogers Technology; CGI Group (IT consulting; TSX GIB.A; Montreal); Ubisoft Montreal (gaming; AC/For Honor; largest studio); Electronic Arts Canada (Need for Speed; Burnout; NHL franchise; Vancouver); BIOWARE (Dragon Age/Mass Effect; Edmonton; EA subsidiary); RYAN Reynolds Aviation Gin Tech (joking...); AMAZON Vancouver (важный hub; AWS Vancouver; many engineering teams); Google Canada (Waterloo + Toronto + Montreal offices); Microsoft Canada; Meta Canada (Toronto); NVIDIA Toronto Research (AI/ML research); Cohere (Canadian AI unicorn; $5.5B valuation; Toronto; competitor to OpenAI; ex-Google Brain); Cerebras Systems (AI hardware; подозрение на Canada office); Vector Institute (AI research; Toronto); Mila (Montreal AI research; Yoshua Bengio); CANADA AI ADVANTAGE: две ведущие мировые AI-лаборатории (Vector Institute + Mila); значительные инвестиции правительства в AI; open work permit для AI researchers (Global Skills Strategy); ALBERTA: Calgary Tech = растущий hub; нет provincial income tax (federal only + CPP = самые низкие налоги); хорошо для accumulation капитала; OIL&GAS tech = много demand; ПУТЬ ИЗ РФ ЧЕРЕЗ GTS: 1. Получить job offer от GTS-eligible канадского работодателя (ищи на LinkedIn Canada + Indeed.ca + Workopolis); 2. Работодатель подаёт LMIA через Service Canada; 3. Work Permit за 2 нед (GTS SLA); 4. После 1 года работы = CEC stream Express Entry; 5. PR (ПМЖ); срок весь путь: 2-3 года.',
    content_md: `# Канада для IT 2026: Express Entry, Global Talent Stream, Shopify $90B, Cohere AI

Global Talent Stream (GTS) = Work Permit за 2 недели без очереди. Express Entry = ПМЖ по баллам CRS (типично 480-560+). Shopify, Cohere, Amazon, Vector Institute. Нет налога на прирост капитала для провинции Alberta.

---

## Визы для IT-специалистов

| Программа | Срок | Условие |
|----------|------|---------|
| **Global Talent Stream (GTS)** | **2 нед.** | Job offer; LMIA категория A (NOC Software Engineer) |
| Express Entry (FSW) | 6-12 мес | 480+ CRS; IELTS CLB 9 |
| Provincial Nominee + EE | ПМЖ | Провинция nominates = +600 CRS |
| Intra-Company Transfer | Work Permit | Перевод из иностранного офиса |

**GTS NOC-коды:** 21232 Software Engineers; 21223 Database Analysts; 21220 Cybersecurity; 21211 Data Scientists.

---

## Налоги Канады

| Доход CAD/год | Фед. ставка | Ontario combined |
|--------------|------------|-----------------|
| До 55 867 | 15% | ~20% |
| 55 867-111 733 | 20.5% | ~30% |
| 111 733-154 906 | 26% | ~40% |
| 154 906-220 000 | 29% | ~46% |
| Свыше 220 000 | 33% | ~53% |
| Alberta | -нет provincial | ~15-29% (ниже!) |

RRSP (пенсионный вычет): до 18% дохода/год снижает базу.

---

## IT-компании Канады

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Shopify** | E-commerce SaaS | NYSE; Ottawa; remote-first |
| **Cohere** | Canadian AI (vs OpenAI) | $5.5B; Toronto |
| Amazon Vancouver | AWS engineering | Крупный hub |
| Atlassian | Jira/Confluence | $50B; Toronto |
| Ubisoft Montreal | Gaming (AC/For Honor) | Крупнейшая студия мира |
| Vector Institute | AI Research | Toronto |
| Mila | AI Research | Yoshua Bengio; Montreal |

---

## Зарплаты IT

| Уровень | CAD/год | USD/год |
|---------|---------|---------|
| Junior | 65-90k | $47.5-65.7k |
| Middle | 90-130k | $65.7-94.9k |
| Senior | 130-180k | $94.9-131.4k |
| Staff/Principal | 180-250k | $131.4-182.5k |

---

## Стоимость жизни

| Город | Аренда 1BR/мес | Жизнь итого/мес |
|-------|---------------|----------------|
| Toronto (Downtown) | CAD 2 400-3 200 | CAD 3 500-5 500 |
| Vancouver (Downtown) | CAD 2 600-3 500 | CAD 4 000-6 000 |
| Calgary (без prov. tax) | CAD 1 800-2 600 | CAD 3 000-4 500 |
| Halifax | CAD 1 600-2 200 | CAD 2 500-3 800 |

---

## Итого

Канада IT 2026: GTS = Work Permit 2 нед (job offer + LMIA); Express Entry = 480+ CRS ПМЖ; Shopify/Cohere $5.5B/Amazon/Vector Institute; Senior CAD 130-180k/год; налог 40-53% Ontario (Alberta ниже = нет provincial); Toronto $2 555-4 015/мес; путь GTS → 1 год работы → CEC Express Entry → ПМЖ (2-3 года); IELTS CLB9 нужен; WES признаёт российские дипломы CS.
`,
  },
  {
    slug: 'norvegiya-kopengagen-stokgolm-it-2026',
    title: 'Норвегия, Дания и Швеция для IT в 2026: Spotify, Ericsson, Equinor, налоги, визы',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Норвегия Дания Швеция IT 2026 налоги визы зарплаты: НОРВЕГИЯ: SKILLED WORKER VISA: EU Blue Card не действует (Норвегия = EEA, не EU); Skilled Worker Permit: job offer от норвежского работодателя; квалификация (BSc+) или 3 года опыта; зарплата не ниже отраслевого минимума; срок: 3 года + ПМЖ через 3 года; НАЛОГИ НОРВЕГИИ: НДФЛ (trinnskatt): 22% стандартный; плюс bracket tax: 1.7% от 208 051-292 850 NOK; 4.0% от 292 851-670 000 NOK; 13.6% свыше 670 000 NOK; trygdeavgift (National Insurance): 8% для сотрудников; итого effective rate Senior: ~35-43%; petroleumsfondsskatt: 78% для нефтяных компаний (не для IT); нет inheritance tax; Capital Gains Tax: 22% (aksjeinntekter); AKER AKSJESPAREKONTO (ASK): счёт без налога на перекладку между акциями; налог только при изводе; ЗАРПЛАТЫ IT НОРВЕГИЯ: Junior: NOK 500 000-650 000/год ($46 000-59 700); Middle: NOK 650 000-900 000/год ($59 700-82 600); Senior: NOK 900 000-1 200 000/год ($82 600-110 200); Principal: NOK 1 200 000-1 600 000/год ($110 200-146 900); Equinor Senior: NOK 1 000 000-1 400 000/год; СТОИМОСТЬ ЖИЗНИ ОСЛО: аренда 1BR (Frogner/Majorstua): NOK 12 000-16 000/мес ($1 102-1 469); аренда (Grünerløkka/Tøyen): NOK 10 000-14 000/мес ($918-1 285); продукты: NOK 4 000-6 000/мес; жизнь итого: NOK 18 000-28 000/мес ($1 653-2 572); IT КОМПАНИИ НОРВЕГИИ: Equinor (бывший Statoil; oil & gas tech; Oslo; 21 000+ чел.); Kongsberg Gruppen (defense/maritime tech; Kongsberg; Oslo); Telenor (telecom + digital; Oslo); Aker Solutions (subsea engineering); Opera Software (браузер; Oslo); Kahoot (edtech gamification; Oslo; NYSE KHTW $2.5B); Cognite (industrial AI; Oslo; SoftBank; $1.6B); Aize (digital twin; Oslo); FREYR Battery (green energy); Zwipe (biometric payment); Schibsted (media + online classifieds; VG/Aftonbladet/Finn.no); ДАНИЯ: EU Blue Card: зарплата > EUR 49 000/год (2024); квалифицированная профессия; BSc+ или 5 лет опыта; срок: 4 года + EU CR (permanent residence); Positive List Visa (POSITIVLISTEN): специальности в дефиците (включая IT); немного проще EU Blue Card; НАЛОГИ ДАНИИ: НДФЛ: AM-bidrag: 8% (социальный; сначала); бундскат: 12%; kommuneskat (муниципальный): 23.5-27.8% (средний ~25.1%); топовые ставки combined: ~55.9% (одни из самых высоких в мире); нет wealth tax; нет inheritance tax (только boafgift 15% наследникам кроме супруга/детей до порогов); ЗАРПЛАТЫ IT ДАНИЯ: Junior: DKK 420 000-580 000/год ($60 100-83 000); Middle: DKK 580 000-750 000/год ($83 000-107 400); Senior: DKK 750 000-1 000 000/год ($107 400-143 200); СТОИМОСТЬ ЖИЗНИ КОПЕНГАГЕН: аренда 1BR: DKK 9 000-13 000/мес ($1 289-1 861); продукты: DKK 3 000-4 500/мес; жизнь итого: DKK 15 000-22 000/мес ($2 148-3 150); ШВЕЦИЯ: EU Blue Card или Arbetstillstand (Work Permit); НАЛОГИ ШВЕЦИИ: коммунальный + государственный: combined up to 57.2%; Forskarskattenaset: 25% flat для иностранных high-skill workers на 3 года (expert tax relief); зарплаты IT СТОКГОЛЬМ: Junior: SEK 480 000-620 000/год ($45 400-58 700); Senior: SEK 800 000-1 100 000/год ($75 700-104 200)',
    seo_description: 'Норвегия Дания Швеция IT 2026 Spotify Ericsson Equinor: IT КОМПАНИИ ДАНИИ: Novo Nordisk (pharma; Copenhagen; Danish Crown; tech stack; ~50 000 чел.; Copenhagen); Maersk (shipping + tech + logistics digitalisation; Copenhagen; data engineering teams); Ørsted (offshore wind + energy tech; Fredericia+Copenhagen); Vestas (wind turbines; Aarhus; IoT + digital twin); Leo Pharma (pharma); Saxo Bank (fintech trading; Copenhagen; $2B); Just Eat Takeaway (food delivery; Amsterdam HQ + Copenhagen tech); Lunar (neobank; Aarhus; $2B); Pleo (expense management; Copenhagen + London; $4.7B); Siteimprove (web analytics; Copenhagen; KKR acquisition); Templafy (document automation; Copenhagen); Trustpilot (reviews platform; London HQ + Copenhagen; NASDAQ); Unity Technologies (game engine; San Francisco HQ + Copenhagen studio); IT КОМПАНИИ ШВЕЦИИ: SPOTIFY (music streaming; NASDAQ SPOT; $60B; Stockholm HQ; engineering 8 000+); ERICSSON (telecom equipment; NASDAQ; $30B; Stockholm); KLARNA (BNPL fintech; Stockholm; $6.7B valuation 2023; IPO expected); H&M Group Tech (retail tech; Stockholm); Volvo Technology (automotive tech; Gothenburg); IKEA Tech (Malmö); King (mobile gaming Candy Crush; Microsoft acq.; Stockholm); Mojang Studios (Minecraft; Microsoft; Stockholm); Truecaller (caller ID; NASDAQ INDIE; Stockholm); iZettle (POS; PayPal acq.; Stockholm); Voi Technology (e-scooters; Stockholm; EUR 1B valuation); Einride (autonomous trucks; Stockholm; $1.1B); Northvolt (battery tech; Stockholm; BMW/VW investor; green); Svenska Spel (Swedish government gambling; IT); Tink (open banking; Visa acq. EUR 1.8B; Stockholm); Lendo (financial comparison; Schibsted); Bambuser (live video commerce; Stockholm); СРАВНЕНИЕ ТРЁХ СТРАН: НОРВЕГИЯ: налог ~35-43%; жизнь $1 653-2 572/мес (ДЕШЕВЛЕ ДАН/ШВЕ); зарплаты ниже чем в Дании в EUR; нефтяная экономика = стабильна; Equinor/Kongsberg = интересно для tech+engineering; нет EU Blue Card; ДАНИЯ: налог ~55.9% (самый высокий!); жизнь $2 148-3 150/мес (самая дорогая из трёх); зарплаты в EUR/DKK самые высокие; Spotify нет — это Швеция; Saxo Bank/Pleo/Trustpilot = fintech hub; EU Blue Card через работодателя; ШВЕЦИЯ: налог до 57.2% НО Expert Tax 25% flat (3 года); жизнь дешевле Дании; Spotify/Klarna/Ericsson = крупнейшие; Stockholm = скандинавский стартап-хаб; EU Blue Card; АНГЛИЙСКИЙ В СКАНДИНАВИИ: все три страны = очень высокий уровень английского; работать в IT = на английском (без знания местного языка); для жизни (магазины/больница/транспорт): английский достаточен; ПМЖ/гражданство: требует A2-B1 местного языка; ПЛЮСЫ СКАНДИНАВИИ: лучший work-life balance в мире (Норвегия/Дания 37.5-часовая неделя); 5-6 нед отпуска; щедрое социальное обеспечение; бесплатная медицина; субсидированные ясли/детский сад; безопасность топ-3 мира; МИНУСЫ: очень высокие налоги; дорогая жизнь; язык нужен для ПМЖ; темнота зимой (Норвегия = полярная ночь); надо job offer для переезда (нет DN visa).',
    content_md: `# Норвегия, Дания, Швеция IT 2026: Spotify $60B, Equinor, Klarna, налоги 35-57%

Скандинавия = лучший work-life balance в мире. Налоги высокие (35-57%), но социальные гарантии максимальные. Для переезда нужен job offer: нет DN Visa. Швеция: Expert Tax 25% flat на 3 года.

---

## Визы для IT-специалистов

| Страна | Виза | Условие |
|--------|------|---------|
| **Норвегия** | Skilled Worker Permit | Job offer; BSc+ или 3 года опыта; 3 г. → ПМЖ |
| **Дания** | EU Blue Card / Positive List | Зарплата > EUR 49k; BSc+ |
| **Швеция** | EU Blue Card / Arbetstillstand | Job offer; BSc+ |

Все три: job offer обязателен. Нет Digital Nomad Visa.

---

## Налоги

| Страна | Эффективная ставка Senior | Особенность |
|--------|--------------------------|------------|
| Норвегия | 35-43% | Самая низкая из трёх |
| Дания | ~55.9% | Одна из самых высоких в EU |
| **Швеция** | До 57.2% | **Expert Tax 25% flat (3 года для expats)** |

---

## Зарплаты и жизнь

| Страна | Senior/год | Жизнь/мес |
|--------|-----------|----------|
| Норвегия (Oslo) | $82-110k | $1 653-2 572 |
| Дания (CPH) | $107-143k | $2 148-3 150 |
| Швеция (Stockholm) | $75-104k | ~$2 000-3 000 |

---

## Ключевые компании

| Компания | Страна | Профиль |
|---------|--------|---------|
| **Spotify** | Швеция | Music streaming; NASDAQ; $60B |
| **Klarna** | Швеция | BNPL fintech; $6.7B |
| **Equinor** | Норвегия | Oil & gas tech; 21k чел. |
| **Saxo Bank** | Дания | Fintech trading; $2B |
| **Pleo** | Дания | Expense management; $4.7B |
| Ericsson | Швеция | Telecom; NASDAQ; $30B |
| Novo Nordisk | Дания | Pharma + tech |
| Kahoot | Норвегия | EdTech; NYSE; $2.5B |

---

## Итого

Скандинавия IT 2026: Норвегия налог 35-43% (меньший); Дания 55.9% (высший); Швеция Expert Tax 25% flat первые 3 года; job offer обязателен; английский в IT = достаточен; Spotify/Klarna/Equinor/Saxo Bank; жизнь $1 653-3 150/мес; 5-6 нед отпуска; бесплатная медицина; A2-B1 языка для ПМЖ; лучший work-life balance в мире.
`,
  },
  {
    slug: 'kitay-shankhay-it-dlya-inostrantsev-2026',
    title: 'Китай и Шанхай для иностранных IT-специалистов в 2026: Z-виза, ByteDance, Alibaba, Tencent',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Китай Шанхай IT иностранцы 2026 Z-виза ByteDance Alibaba: ВИЗЫ ДЛЯ РАБОТЫ В КИТАЕ: Z-ВИЗА (рабочая виза): единственная легальная виза для работы в Китае; требования: job offer от китайского работодателя с лицензией на наём иностранцев; Work Permit For Foreigners (外国人工作许可证, Wai Guo Ren Gong Zuo Xu Ke Zheng); Categories: Category A (High-End Talents; ученые/лауреаты); Category B (Professionals; большинство IT); Category C (General Workers; ограниченный квота); для IT (Category B): подтверждение образования (BSc+ в профильной области); подтверждение опыта; Clean Criminal Record Check (апостиль!); медицинская справка; RESIDENCE PERMIT: после Z-визы = Residence Permit (продлевается ежегодно); семья: Dependents получают S1/S2 Visa; ТАЛАНТ ПРОГРАММЫ: Thousand Talents Program (Qianren Jihua): для Outstanding Overseas Talents (китайского происхождения + иностранцы); преференции для академических позиций + R&D; Hainan Free Trade Port: Special policies для иностранного таланта; упрощённое разрешение; НАЛОГИ КИТАЯ: НДФЛ (Individual Income Tax, IIT): 3% до CNY 36 000/год; 10% CNY 36 001-144 000; 20% CNY 144 001-300 000; 25% CNY 300 001-420 000; 30% CNY 420 001-660 000; 35% CNY 660 001-960 000; 45% свыше CNY 960 000; налоговый статус: если вы в Китае < 183 дней/год = платить только с китайского дохода; 183+ дней первые 6 лет = с мирового дохода (кроме доходов, налог на которые уже уплачен за рубежом); иностранный специалист допзащита: раньше было освобождение 5 лет (исчезло в 2019); СТАВКИ НДФЛ в КНР для иностранца Senior: зарплата USD 80 000 = ~580 000 CNY; IIT rate на эту сумму ≈ 25-30% federal; плюс вычеты (жильё от компании/school fees/travel = стандартные expat пакеты); net ≈ USD 55 000-60 000 при USD 80k gross; SOCIAL INSURANCE ДЛЯ ИНОСТРАНЦЕВ: обязательное с 2011; пенсионное 8%/медицинское 2%/безработица 0.5% (сотрудник); работодатель доп. 20-37%; ПЕНСИЮ МОЖНО ВЕРНУТЬ при отъезде (в отличие от EU); ЗАРПЛАТЫ IT ШАНХАЙ (иностранные компании): Junior: CNY 200 000-350 000/год ($27 500-48 100); Middle: CNY 350 000-550 000/год ($48 100-75 600); Senior: CNY 550 000-900 000/год ($75 600-123 700); Tech Lead/Architect: CNY 900 000-1 500 000/год ($123 700-206 200); в BYTEDANCE/ALIBABA/TENCENT Senior: CNY 800 000-1 800 000/год (конкурентно с US-big tech)',
    seo_description: 'Китай Шанхай IT иностранцы 2026 зарплаты жизнь GDPR: СТОИМОСТЬ ЖИЗНИ ШАНХАЙ: аренда 1BR (Jing An/French Concession/Xintiandi): CNY 8 000-14 000/мес ($1 100-1 925); аренда 1BR (Minhang/Putuo): CNY 5 000-8 000/мес ($687-1 100); продукты (local markets): CNY 1 500-2 500/мес ($206-344) — дешево; продукты (imported): CNY 3 000-5 000; обед в ресторане: CNY 50-150 ($7-21); жизнь итого (expat standard): CNY 12 000-22 000/мес ($1 650-3 025); IT КОМПАНИИ КИТАЯ: BYTEDANCE (TikTok/Douyin/Toutiao; Beijing+Shanghai; ~110 000 сотрудников; $250B valuation; крупнейший работодатель IT в КНР; нанимает иностранцев активно в international products/AI/ML); ALIBABA (e-commerce/cloud/fintech; NASDAQ BABA; Hangzhou+Shanghai; $200B+ peak; Taobao/Tmall/Alipay; DAMO Academy — исследования AI/ML); TENCENT (WeChat/QQ/gaming; HK 700; Shenzhen; $400B peak; League of Legends (Riot)/PUBG (Krafton minor)/Clash of Clans (Supercell); International Business Group нанимает иностранцев); HUAWEI (telecom/hardware/cloud/R&D; Shenzhen; 200 000+ сотрудников; нанимает на R&D позиции; спорный доступ для граждан US/UK/AU); Meituan (food delivery/super-app; HK 3690; Beijing; $80B); JD.com (e-commerce; NASDAQ JD; Beijing; tech hub); DJI (consumer drones; Shenzhen; $15B; нанимает software engineers); Xiaomi (smartphones + IoT; HK; Beijing; $40B); BYD (EVs + technology; Shenzhen; $80B); SENSETIME (computer vision AI; HK 0020; Shanghai; US sanction list!); HIKVISION (surveillance cameras; Shenzhen; US sanction list!); Pinduoduo/TEMU (e-commerce; NASDAQ PDD; Shanghai; $130B); Baidu (search + AI; NASDAQ BIDU; Beijing; $35B; Apollo AV); ОСОБЕННОСТИ РАБОТЫ В КИТАЕ: ВЕЛИКИЙ ФАЙРВОЛ (Great Firewall / Golden Shield Project): заблокированы: Google/Gmail; Facebook/Instagram/WhatsApp; Twitter/X; YouTube; Telegram; Discord; GitHub (иногда!); Wikipedia; большинство VPN (использование VPN = серая зона; технически нарушение для иностранцев); легальные в КНР: WeChat (Weixin); Weibo; Baidu; DiDi (uber); Alipay/WechatPay; ДОСТУП К ИНСТРУМЕНТАМ: разработчики используют Gitee (GitHub альтернатива); зарубежный VPN компания иногда предоставляет; ЯЗЫК: мандаринский (普通话) = крайне желателен для продуктивной работы; в ByteDance/Alibaba Int. = английский допустим; в местных командах = только китайский; ДАННЫЕ И PRIVACY: PIPL (Personal Information Protection Law 2021) = китайский GDPR; MLPS (Multi-Level Protection Scheme) = требования к security; cross-border data transfer = жёсткие ограничения; несовместимость с EU GDPR = проблема для EU-data processing; ВЫВОД ДЛЯ РОССИЙСКИХ IT: Визовые ограничения: граждане РФ = относительно просто (нет US/UK-натяжки санкций); безвиза 72/144 часа транзит; Work Permit = стандартный process; ПЛЮСЫ: высокие зарплаты в top-компаниях; дешёвая жизнь; передовые технологии (AI/ML/robotics/EVs); МИНУСЫ: файрвол = неудобно; сложный рынок труда для не-китайскоговорящих; санкции США на Huawei/Hikvision; 183-дневное правило; нет EU Blue Card; ограниченный доступ к GitHub/Google/etc.; для семьи: международные школы дорогие ($20-40k/год); BEST FOR: ML/AI инженеры в ByteDance/Alibaba DAMO; hardware engineers в Huawei/DJI; люди, понимающие мандаринский.',
    content_md: `# Китай и Шанхай для IT-иностранцев 2026: ByteDance $250B, файрвол, Z-виза

ByteDance ($250B) и Alibaba нанимают иностранных IT-специалистов. Зарплаты конкурентны с US big tech. Но: Великий Файрвол (нет GitHub/Google/Telegram) и мандаринский язык — серьёзные барьеры.

---

## Виза и требования

| Элемент | Детали |
|---------|--------|
| Z-виза | Job offer от работодателя с лицензией; Work Permit For Foreigners |
| Category B (IT) | BSc+; опыт; criminal record check (апостиль); медсправка |
| Residence Permit | После Z-визы; ежегодное продление |
| 183 дней | Меньше = налог только с китайского дохода |

---

## Налоги КНР

| Доход CNY/год | Ставка |
|--------------|--------|
| До 36 000 | 3% |
| 36-144 000 | 10% |
| 144-300 000 | 20% |
| 300-660 000 | 25-30% |
| Свыше 960 000 | 45% |

Net при USD 80k gross: ~USD 55-60k (с expat вычетами жилья/школы).

---

## IT-компании

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **ByteDance** | TikTok/Douyin | $250B; 110k чел.; нанимает иностранцев |
| **Alibaba** | E-commerce/Cloud | NASDAQ; $200B+ peak; DAMO AI |
| **Tencent** | WeChat/Gaming | HK; $400B peak |
| **Huawei** | Telecom/Cloud R&D | 200k чел. (US-санкции!) |
| DJI | Consumer drones | $15B; нанимает SWE |
| BYD | EVs + tech | $80B |

---

## Зарплаты IT (Шанхай, иностранные компании)

| Уровень | CNY/год | USD/год |
|---------|---------|---------|
| Junior | 200-350k | $27.5-48.1k |
| Middle | 350-550k | $48.1-75.6k |
| Senior | 550-900k | $75.6-123.7k |
| ByteDance/Alibaba Senior | 800-1 800k | $110-247k |

---

## Стоимость жизни в Шанхае

| Статья | CNY/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (French Concession) | 8-14k | $1 100-1 925 |
| Продукты (local) | 1 500-2 500 | $206-344 |
| Жизнь итого (expat) | 12-22k | **$1 650-3 025** |

---

## Великий Файрвол: что заблокировано

| Заблокировано | Аналог в КНР |
|-------------|-------------|
| Google/Gmail | Baidu / Qiye邮 |
| GitHub (иногда) | Gitee |
| Telegram/WhatsApp | WeChat |
| YouTube | Bilibili |
| VPN | Серая зона (корпоративный VPN) |

---

## Итого

Китай IT 2026: Z-виза (Category B = job offer + BSc+); ByteDance $250B/Alibaba/Tencent нанимают иностранцев; Senior $76-124k USD/год (DAMO/ByteDance: $110-247k); жизнь $1 650-3 025/мес; файрвол = нет Google/GitHub/Telegram; налог 25-30% при Senior-доходе; мандаринский критически важен для большинства команд; для семьи = международная школа $20-40k/год; лучшее предложение для ML/AI инженеров с языком.
`,
  },
  {
    slug: 'kak-naiti-pervuyu-rabotu-v-it-za-rubezhom-bez-opyta-2026',
    title: 'Как найти первую IT-работу за рубежом без опыта в 2026: портфолио, bootcamp, стажировки',
    tag: 'практика',
    read_time: 2,
    country_slug: null,
    seo_title: 'Первая IT-работа за рубежом без опыта 2026 стажировки bootcamp: СТРАТЕГИИ ДЛЯ ПЕРВОЙ IT-РАБОТЫ ЗА РУБЕЖОМ: СИТУАЦИЯ 1 — НЕТ ОПЫТА В IT ВООБЩЕ: BOOTCAMP: интенсивный курс 3-9 мес; специализации: Full Stack Web (React/Node.js); Data Science; Cybersecurity; UX/UI Design; iOS/Android; зарубежные bootcamp (онлайн): Flatiron School (NYC; онлайн; Income Share Agreement = платишь после трудоустройства); General Assembly (онлайн; $13 950 full-time); Le Wagon (Париж; Rails; международный; Берлин/Амстердам); Ironhack (Мадрид/Амстердам; Web Dev + Data; выпускник = EU); российские аналоги: Яндекс Практикум (Python/JS/Data); Нетология; SkillFactory; Hexlet (бесплатный основы); СТОИМОСТЬ BOOTCAMP ЗАРУБЕЖНОГО: онлайн: $5 000-15 000; ISA: $0 upfront, 10-17% дохода на 2-3 года после; очный в EU: $5 000-20 000 + виза; СИТУАЦИЯ 2 — ЕСТЬ ТЕХНИЧЕСКИЕ НАВЫКИ, НЕТ КОММЕРЧЕСКОГО ОПЫТА: GITHUB PORTFOLIO: 4-6 реальных проекта (НЕ туториальные клоны); что показывает: умение читать чужой код; умение решать реальные проблемы; умение документировать; IDEAS ДЛЯ ПРОЕКТОВ: клон известного сервиса с добавленной фичей; CLI-инструмент; API integration; Chrome Extension; бот (Telegram/Discord/WhatsApp); web scraper + dashboard; OPEN SOURCE CONTRIBUTIONS: найти проекты на GitHub (Good First Issue label); начать с documentation/bug fixes; escalate к features; популярные starter repos: freeCodeCamp; EddieHub; Microsoft VS Code; Prisma; TypeScript; KAGGLE (для Data Science): соревнования; показывают ML-навыки рекрутерам; СИТУАЦИЯ 3 — ЕСТЬ ОПЫТ В IT (РФ), НО НЕТ ЗАРУБЕЖНОГО: АДАПТАЦИЯ РЕЗЮМЕ: CV format (не российский): EN/DE/FR в зависимости от страны; GitHub ссылка = обязательно; LinkedIn = обязательно; никаких фото в CV (кроме Германии = приветствуется но не обязательно); никаких дат рождения/семейного положения (EU/US = privacy); COVERING LETTER: 3 абзаца: 1) почему эта компания; 2) что я делал; 3) что предлагаю; LINKEDIN СТРАТЕГИЯ: Open to Work badge (скрытый от текущего работодателя); connect с рекрутерами (Tech Recruiter + страна); комментировать посты (visibility); публиковать tech posts (English); СТАЖИРОВКИ (INTERNSHIP): EU программы стажировок: Google (STEP/SWE Intern; Mountain View + Zurich + London); Microsoft (SWE Intern; Dublin + London); Amazon SDE Intern (Dublin/Luxembourg); Meta SWE Intern (London/Dublin); Wise Internship (London/Tallinn); Booking.com Internship (Amsterdam); JetBrains Internship (Prague/Saint-Petersburg formerly; теперь Prague); типичные условия: $25-60k/год (pro-rated); длительность: 3-12 мес; конверсия в full-time: 60-90%; ERASMUS: программа стажировки для студентов EU вузов (и некоторых партнёрских); 300-800 EUR/мес + туда-обратно; стажировка в любой EU-компании; НЕ только для EU-граждан если учишься в EU-вузе',
    seo_description: 'Первая IT-работа за рубежом без опыта 2026 зарплата visa sponsorship: ПЛАТФОРМЫ ДЛЯ ПОИСКА ПЕРВОЙ IT-РАБОТЫ: НАЧАЛЬНОГО УРОВНЯ: LinkedIn (самый важный): настроить профиль → Open to Work → "Junior Developer OR Entry Level Developer" + страна + "visa sponsorship"; Indeed (международный): фильтр "Entry Level" + "Visa Sponsorship"; Glassdoor: читать отзывы о компании + зарплатную вилку; AngelList/Wellfound: стартапы; меньше конкуренции; Hackerrank Jobs: для хорошо сдавших tech challenges; HN Who is Hiring: ежемесячный тред (Hacker News); Monster (EU фокус); Jobinja (для Middle East); Stack Overflow Jobs (активен); Otta.com (UK/EU tech + visa sponsorship); Relocate.me (специально визовый sponsorship!); Jobgether (remote-first); СПЕЦИАЛИЗИРОВАННЫЕ ДЛЯ REMOTE: Remote.co; We Work Remotely; RemoteOK; Remotive; NoDesk; Jobspresso; Working Nomads; TIPPS ДЛЯ НАЙМА BEZ ОПЫТА ЗАРУБЕЖНОГО: VISA SPONSORSHIP СТРАТЕГИЯ: ищи компании которые системно берут иностранцев (Booking.com; Adyen; ASML; Zalando; N26; Klarna; Transferwise/Wise; bunq; NatWest); ищи компании с офисами в нескольких EU странах = больше опций; FREELANCE КАК СТАРТ: Upwork/Fiverr: первые $1 000-5 000 = кейсы; топтал для опытных; АНГЛИЙСКИЙ УРОВЕНЬ: B2/C1 = минимум для работы в EU/US/AU; IELTS/TOEFL = иногда требуется для визы (но не для работы если уже есть); ТЕХНИЧЕСКИЕ ИНТЕРВЬЮ: LeetCode (алгоритмы; Easy/Medium); System Design (для Senior/Staff); Behavioural (STAR-method: Situation-Task-Action-Result); mock interviews: Pramp.com (бесплатно peer-to-peer); interviewing.io (платное с FAANG инженерами); ТИПИЧНЫЕ ОШИБКИ ПЕРВОГО ЗАРУБЕЖНОГО ПОИСКА: 1. Рассылать одно CV всем (нужна кастомизация под каждую компанию); 2. Не иметь GitHub (рекрутеры проверяют ВСЕГДА); 3. Скромничать с зарплатой (называй выше ожиданий = торг всегда вниз); 4. Не понимать визовые требования страны (EU Blue Card vs Skilled Worker vs Work Permit); 5. Не понимать tax implications (спросить HR: gross or net? включает ли bonus stock options?); 6. Игнорировать linkedin messages от рекрутеров (ВСЕГДА отвечать даже если не интересно; связи); ТАЙМИНГ: поиск работы: 3-6 мес в среднем для первой зарубежной позиции; cold emails: отклик 2-5%; через LinkedIn: 5-10%; через рефарел (знакомый из компании): 30-50%; РЕФАРЕЛ: самый мощный инструмент; попросить знакомого в компании отправить твоё CV в ATS (Applicant Tracking System) = автоматически выше в очереди; КАК ПОПАСТЬ НА СТАЖИРОВКУ GOOGLE/META/AMAZON: LeetCode Medium-Hard (100+ задач); System Design Primer (GitHub); Behavioural STAR; подавать за 6-9 мес до начала; university email (.edu) = преимущество (или аналог); networking на конференциях (PyCon; JSConf; AWS re:Invent).',
    content_md: `# Первая IT-работа за рубежом без опыта в 2026: стратегии, платформы, стажировки

Самый мощный инструмент — референс (знакомый в компании). Без него: GitHub-портфолио + LinkedIn + Relocate.me. Bootcamp + ISA (платишь после найма) снижает барьер входа до $0.

---

## 3 стратегии в зависимости от ситуации

| Ситуация | Стратегия |
|----------|---------|
| **Нет IT-опыта вообще** | Bootcamp (Le Wagon/Ironhack/Flatiron) + GitHub |
| **Навыки есть, нет коммерции** | Portfolio 4-6 проектов + Open Source + Kaggle |
| **Опыт РФ есть** | Адаптация CV + LinkedIn + Relocate.me |

---

## Bootcamp-варианты

| Школа | Формат | Стоимость |
|-------|--------|----------|
| Flatiron School | Онлайн; ISA | $0 upfront; 10-17% дохода после |
| Le Wagon | Онлайн/Берлин/Амстердам | EUR 6-8k |
| Ironhack | Мадрид/Амстердам | EUR 9-14k |
| General Assembly | Онлайн | $13 950 |
| Яндекс Практикум | RU онлайн | RUB 60-150k |

---

## Что должно быть в GitHub-портфолио

| Проект | Почему ценен |
|--------|-------------|
| Клон сервиса + новая фича | Читаемый код + инициатива |
| API integration + dashboard | Реальный data flow |
| Chrome Extension | Продукт, которым пользуются |
| Telegram/Discord бот | Деплой + DevOps |
| Open Source contribution | Работа с чужим кодом |

---

## Стажировки в EU/US компаниях

| Компания | Условия |
|---------|---------|
| Google (STEP/SWE Intern) | Zurich/London; $25-60k pro-rated |
| Microsoft SWE Intern | Dublin/London |
| Booking.com | Amsterdam |
| Wise | London/Tallinn |
| JetBrains | Prague |
| Amazon SDE Intern | Dublin/Luxembourg |

Конверсия в full-time: 60-90%.

---

## Платформы поиска с visa sponsorship

| Платформа | Фокус |
|----------|-------|
| **Relocate.me** | Специально visa sponsorship |
| **Otta.com** | EU tech; visa sponsorship filter |
| LinkedIn | Open to Work + фильтры |
| AngelList/Wellfound | Стартапы; меньше конкуренции |
| We Work Remotely | Remote-first |

---

## Топ-5 ошибок при поиске

1. Одно CV для всех — нужна кастомизация под компанию
2. Нет GitHub — рекрутеры проверяют всегда
3. Занижать зарплату — торг всегда вниз, называй выше
4. Игнорировать LinkedIn recruiter messages — всегда отвечай
5. Не знать визовые требования страны перед подачей

---

## Итого

Первая IT-работа за рубежом 2026: GitHub-портфолио (4-6 проектов) + LinkedIn Open to Work + Relocate.me; bootcamp ISA = $0 upfront; Google/Booking.com/Wise стажировки; рефарел = 30-50% отклик (vs 2-5% cold); поиск 3-6 мес; LeetCode Medium-Hard для FAANG; Otta.com/Relocate.me для visa sponsorship; B2/C1 английский минимум.
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
console.log(`\nБатч 198: ${ok} OK, ${err} ошибок`);
