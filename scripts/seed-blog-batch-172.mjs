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
    slug: 'kak-rabotat-udalyonno-yuridicheski-legalno-2026',
    title: 'Как легально работать удалённо из другой страны в 2026 году: налоги, риски, EOR',
    tag: 'практика',
    read_time: 2,
    country_slug: null,
    seo_title: 'Как легально работать удалённо из-за рубежа 2026: Permanent Establishment (PE) риск для работодателя (если работник постоянно работает из страны X — работодатель может образовать «постоянное представительство» в этой стране и стать обязан платить корпоративный налог; большинство EU стран: PE risk при работе 183+ дней / при заключении сделок от имени компании; как избежать: не заключать контракты от имени компании, не иметь подписи доверенности); EOR — Employer of Record (легальное решение; EOR-компания нанимает вас официально в стране пребывания и перевыставляет расходы реальному работодателю; работник получает местный трудовой договор и социальное страхование; EOR-компании: Deel (глобальный лидер; $12B оценка; 150+ стран), Remote.com, Velocity Global, Omnipresent, Papaya Global; стоимость EOR $300-800/мес для работодателя); Shadow Payroll (теневая ведомость; работник числится в двух ведомостях: иностранной и местной; налоги удерживаются по обеим системам; сложно; редко используется); налоговое резидентство (183 дней правило: если больше 183 дней в стране X — автоматически налоговый резидент X; не всегда — зависит от ДИДН; Германия: Wohnsitz (регистрация адреса) сразу делает налоговым резидентом; Португалия: 183 дней ИЛИ постоянное жильё); удалённая работа на российскую компанию из-за рубежа: НДФЛ в РФ 30% для нерезидентов (свыше 183 дней за рубежом); или ставить ИП за рубежом',
    seo_description: 'Как легально работать удалённо из другой страны 2026: СИТУАЦИИ И РЕШЕНИЯ: 1) Сотрудник иностранной компании живёт в EU — Permanent Establishment risk: если вы уполномочены заключать сделки от имени компании → компания образует PE в вашей стране → обязана регистрироваться как налогоплательщик и платить корпоративный налог; простой сотрудник без полномочий подписи: PE risk минимален, но при 183+ дней ряд стран (Германия) всё равно требуют от работодателя регистрации как иностранного работодателя; 2) EOR (Employer of Record): EOR-компания (Deel/Remote.com/Omnipresent) регистрируется в стране пребывания, нанимает вас по местному ТД, платит все местные налоги и взносы, перевыставляет расходы реальному работодателю; реальный работодатель платит только счёт EOR ($300-800/мес) без PE риска; для работника: получают местный ТД, социальную страховку, пенсионные взносы; работодателю: compliance без регистрации в каждой стране; 3) Сотрудник российской компании живёт за рубежом: при 183+ дней вне РФ = нерезидент РФ; НДФЛ в РФ на зарплату от РФ компании 30% для нерезидентов (с 2023 для «дистанционных» работников — специальный статус: 13-15% могут сохраниться при дистанционном трудовом договоре; актуальность норм меняется — проверять); решение: переоформить на ИП в новой стране + контракт на оказание услуг; 4) Фрилансер-ИП за рубежом: самостоятельно, платит налоги в стране ИП; рекомендуемые юрисдикции: Грузия (1-3%)/Армения (5%)/Сербия (паушаль ~5%); 183-дневное правило: правило верно для большинства стран, но: США — "closer connection" test (не только дни); Германия — достаточно Wohnsitz (прописки) без 183 дней; важно проверять ДИДН (Double Income Tax Treaty) между страной гражданства и страной проживания.',
    content_md: `# Как легально работать удалённо из другой страны: PE риск, EOR, налоги

Удалённая работа за рубежом — юридически сложная тема. Разбираем три основных ситуации.

## Три ситуации удалёнщика за рубежом

| Ситуация | Решение |
|---------|---------|
| Сотрудник иностранной компании в EU | EOR или проверить PE риск |
| Сотрудник российской компании за рубежом | ИП в новой стране + контракт услуг |
| Фрилансер | ИП в выбранной юрисдикции |

---

## Permanent Establishment (PE) Risk

**Проблема работодателя:**

Если вы живёте в Германии и работаете на американскую компанию → Германия может требовать чтобы американская компания **зарегистрировалась как налогоплательщик** в Германии и платила корпоративный налог.

**Когда PE возникает:**
- Работник имеет **право подписи / доверенность** от компании
- Работник **заключает сделки** от имени компании

**Обычный сотрудник без полномочий:** PE risk минимален, но ряд стран (Германия) при 183+ днях требует регистрацию иностранного работодателя.

---

## EOR: Employer of Record — легальное решение

**Как работает:**

1. EOR-компания регистрируется в стране вашего пребывания
2. EOR **нанимает вас официально** по местному трудовому договору
3. Платит местные налоги и социальные взносы
4. Перевыставляет расходы реальному работодателю

**Для работника:**
- Местный ТД (на языке страны)
- Государственное социальное страхование
- Пенсионные взносы

**Для работодателя:**
- Compliance без регистрации в каждой стране
- Только один счёт EOR

**Стоимость для работодателя:** $300-800/мес на сотрудника.

---

## EOR-компании

| Компания | Покрытие | Цена/мес |
|---------|---------|---------|
| **Deel** | 150+ стран ($12B оценка) | $599-750 |
| **Remote.com** | 100+ стран | $299-599 |
| **Omnipresent** | 160+ стран | $399-699 |
| **Velocity Global** | 185+ стран | $499-799 |
| **Papaya Global** | 160+ стран | $400-700 |

---

## Сотрудник российской компании за рубежом

**При 183+ дней вне РФ:** нерезидент России.

**НДФЛ нерезидента на зарплату из РФ:** 30%.

**Исключение (2023+):** специальный статус «дистанционный работник» в трудовом договоре может сохранить ставку 13-15%. Нормы меняются — проверять актуальность.

**Лучшее решение:** переоформить трудовой договор → **контракт на оказание услуг** с ИП/компанией в новой стране.

---

## Налоговое резидентство: 183-дневное правило

**Базовое правило большинства стран:**

Более 183 дней в стране = **налоговый резидент** этой страны.

**Исключения:**

| Страна | Специфика |
|-------|---------|
| Германия | Достаточно Wohnsitz (прописки) — без 183 дней |
| США | «Closer connection» test — не только дни |
| Великобритания | Statutory Residence Test (несколько факторов) |

**ДИДН (Договор об избежании двойного налогообложения):**

Проверяйте есть ли ДИДН между страной гражданства и страной проживания. При наличии — двойного налогообложения не будет.

---

## Фрилансер-ИП: рекомендуемые юрисдикции

| Страна | Налог | Ключевое |
|-------|-------|---------|
| Грузия | 1-3% | Безвизовый 365 дней, SWIFT |
| Армения | 5% | Безвизовый, SWIFT |
| Сербия | ~5% паушаль | Фиксированный, SWIFT |
| Болгария | 10% | EU, EUR 2025-2026 |

---

## Итого

Как легально работать удалённо 2026: 3 ситуации: 1) Иностранная компания — EOR (Deel/Remote $300-800/мес, устраняет PE риск); 2) Российская компания — переоформить в ИП за рубежом + контракт услуг (избежать НДФЛ нерезидента 30%); 3) Фрилансер — ИП в Грузии (1-3%)/Армении (5%)/Сербии (паушаль); 183-дней правило — но Германия требует только Wohnsitz; проверять ДИДН.
`,
  },
  {
    slug: 'kanada-toronto-express-entry-it-2026',
    title: 'Канада и Торонто для IT в 2026 году: Express Entry, CRS 480+, Shopify',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Канада Торонто IT Express Entry 2026: Express Entry (Federal Skilled Worker FSW + Canadian Experience Class CEC + Federal Skilled Trades; SkillSelect-аналог Австралии; Pool системы; Invitation to Apply ITA выдаётся по CRS баллам; CRS 2024 для FSW IT: 480-510+ для приглашения General draw; IT в NOC (National Occupation Classification) TEER 0/1/2/3: 21231 Software developers/programmers, 21232 Web developers, 21223 Database analysts, 21222 Information systems analysts; CLB 7 = IELTS Academic 6.0 (Speaking 6.0, Listening 6.0, Reading 6.0, Writing 6.0) = 25 баллов CLB; IELTS 8.0 CLB 9 = значительно выше CRS; Provincial Nominee Program PNP: Ontario Immigrant Nominee Program OINP streams — Tech Draw; British Columbia BC PNP Tech Pilot (IT TEER 0/1/2); провинциальная номинация даёт +600 CRS (фактически гарантия ITA); НДФЛ Канады: прогрессивный Federal 20.5%-33% + Provincial Ontario 9.15%-13.16%; итого 43-53% для Senior; RRSP (Registered Retirement Savings Plan) — налоговый вычет до $30 780/год; CAD/USD: 1 USD = 1.38 CAD (2024); IT зарплата Senior Toronto CAD 120k-200k/год = $87k-145k; стоимость жизни Toronto (очень дорогой): аренда 1BR $CAD 2 300-4 000/мес; жизнь $CAD 4 000-7 000/мес = $2 900-5 000 USD; Shopify/Wattpad/Ryan Reynolds/Hootsuite — канадские tech',
    seo_description: 'Канада Торонто IT Express Entry 2026: EXPRESS ENTRY: три потока: FSW (Federal Skilled Worker — для работавших за рубежом), CEC (Canadian Experience Class — для отработавших 1+ год в Канаде), FST (Federal Skilled Trades); NOC (National Occupation Classification) TEER: IT специальности в TEER 0/1/2/3 — все eligible для FSW/CEC; CRS (Comprehensive Ranking System): максимум 1 200 баллов; основные: Core/Human Capital баллы (возраст 20-29 = 110б, IELTS 8.0+ CLB9 для всех 4 = 150б для женатых, 136 для холостых, English + French = бонус); Education (PhD 25б, Master/Professional 23б, Bachelor 21б); Canadian Experience (1-2 года = 40б, 3+ года = 80б); Spouse факторы; Skill transferability (комбинации); Адаптивность; Provincial Nomination: +600 CRS (практически гарантия ITA от следующего draw); CRS cutoff для General draw (2024): 480-510 для FSW IT; для Category-Based Selection (STEM draw): 481-508 (отдельный draw для STEM специалистов — НОК TEER 0/1/2 связанные с STEM включая IT); IELTS Academic: CLB 7 = IELTS 6.0 (все 4 bands 6.0); CLB 8 = IELTS 6.5-7.0; CLB 9 = IELTS 7.0-8.0; CLB 10+ = IELTS 8.0+; для Express Entry IELTS Academic OR General Training обе приемлемы (проверить последние правила); IRCC обработка Express Entry: 6 мес (~80 дней targeted для some streams); PR сразу (постоянная резиденция!); гражданство через 3 года из 5 (1 095 дней physical presence); Shopify (SHOP на NYSE; HQ Ottawa/Toronto; e-commerce platform; $100B+ пик кап; Tobi Lutke основатель); Wattpad ($600M куплен Naver Korea); Hootsuite (SMM; $500M+ оценка; Vancouver); OpenText (NASDAQ OTEX; $11B; Waterloo); Bombardier (транспорт+tech); Rogers (telco); TD Bank/RBC/BMO IT; стоимость жизни: Торонто 1BR downtown $CAD 2 500-4 000/мес ($1 812-2 900 USD); Scarborough/North York $CAD 1 800-2 800; жизнь $CAD 4 500-7 000/мес ($3 260-5 070 USD); ипотека: правительство целенаправленно борется с ценами на жильё; Vancouver ещё дороже Торонто.',
    content_md: `# Канада Торонто: Express Entry, CRS 480+, Shopify, постоянная резиденция

Канада — Express Entry даёт PR (постоянную резиденцию) напрямую. Shopify (NYSE) основан в Оттаве. CRS 480-510+ в 2024, IELTS 8.0 критически важен.

## Почему Канада для IT

- **Express Entry:** постоянная резиденция напрямую (не ВНЖ)
- Shopify / OpenText — канадские tech-компании
- Гражданство через **3 года** (быстрейшее среди G7)
- STEM Category-Based Draw — отдельные приглашения для IT

---

## Express Entry: система

**Три потока:**

| Поток | Для кого |
|-------|---------|
| **FSW** (Federal Skilled Worker) | Работавшие за рубежом |
| **CEC** (Canadian Experience Class) | Работавшие 1+ год в Канаде |
| FST | Skilled Trades |

---

## CRS Баллы: ключевые факторы

| Фактор | Максимум |
|--------|---------|
| Возраст (25-29 лет) | 110 |
| **IELTS 8.0+ (CLB 9+ все 4)** | **136-150** |
| Образование PhD | 25 |
| Master/Professional | 23 |
| Канадский опыт 3+ лет | 80 |
| Провинциальная номинация | **+600** |

**IELTS = самый важный фактор под вашим контролем:**
- CLB 7 (IELTS 6.0): стандарт
- CLB 9 (IELTS 7.0-8.0): максимальные CRS баллы за язык

---

## STEM Category-Based Draw

**С 2023 IRCC проводит отдельные draw для STEM:**

- IT специальности в NOC TEER 0/1/2 (21231/21232/21222/21223)
- CRS cutoff ниже чем General draw
- Рекомендуется: указывать STEM NOC код

---

## Provincial Nominee Program (PNP): +600 CRS

**+600 CRS = фактически гарантия ITA** (Invitation to Apply).

**IT-friendly PNP:**
- **Ontario OINP Tech Draw** — для tech workers
- **BC PNP Tech Pilot** — для BC резидентов с IT NOC
- **Alberta AAIP** — нефтяная провинция, растущий tech

---

## НДФЛ Канады

| Уровень | Ставка |
|---------|--------|
| Federal до $55 867 | 20.5% |
| Federal $55 867-100 392 | 26% |
| Federal $100 392-155 625 | 29% |
| Federal свыше $246 752 | 33% |
| Ontario Provincial | +9.15-13.16% |
| **Итого Senior** | **~43-48%** |

**RRSP (Registered Retirement Savings Plan):**
- Вычет до **CAD $30 780/год** из налогооблагаемой базы
- Экономия ~$10 000-15 000/год в налогах

---

## IT-компании Канады

| Компания | Профиль | Факт |
|---------|---------|------|
| **Shopify** | E-commerce platform | NYSE SHOP; HQ Ottawa; $100B+ пик |
| **OpenText** | Enterprise software | NASDAQ OTEX; $11B; Waterloo |
| **Hootsuite** | SMM | $500M+; Vancouver |
| **Wattpad** | Story platform | $600M куплен Naver |
| **TD/RBC/BMO** | Big banking IT | Крупные IT-отделы |

---

## Зарплаты IT в Торонто

| Должность | CAD/год | USD/год |
|-----------|---------|---------|
| Junior Dev | 65k-90k | $47k-65k |
| Middle Dev | 90k-140k | $65k-101k |
| Senior Dev | 130k-200k | $94k-145k |

---

## Стоимость жизни Торонто

| Статья | CAD/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (downtown) | 2 500-4 000 | $1 812-2 900 |
| Аренда 1BR (Scarborough) | 1 800-2 800 | $1 304-2 029 |
| Продукты | 600-900 | $435-652 |
| Транспорт (TTC/Presto) | 150-250 | $109-181 |
| **Итого** | **4 050-7 150** | **$2 935-5 181** |

**Торонто — один из дорогих городов Северной Америки.**

---

## Путь к гражданству

| Этап | Срок |
|------|------|
| Express Entry ITA | 6 месяцев обработки |
| PR (Постоянная резиденция) | Сразу |
| Гражданство (1 095 дней physical presence) | **3 из 5 лет** |

---

## Итого

Канада Торонто IT Express Entry 2026: FSW (иностранный опыт) или CEC (канадский опыт); CRS cutoff 480-510+ (General) / чуть ниже STEM draw; IELTS 8.0 = CLB 9 = максимальные языковые баллы; PNP +600 CRS = почти гарантия ITA; Shopify/OpenText/TD Bank; Senior CAD $130k-200k, НДФЛ 43-48%; $2 900-5 000/мес жизнь; гражданство 3 года. Идеально для: STEM профессионал + IELTS 8.0 + хочет PR напрямую + Shopify-экосистема.
`,
  },
  {
    slug: 'goroda-germanii-dlya-pereezda-sravnenie-2026',
    title: 'Какой город Германии выбрать для переезда в 2026 году: Берлин vs Мюнхен vs другие',
    tag: 'практика',
    read_time: 2,
    country_slug: null,
    seo_title: 'Какой город Германии выбрать для переезда 2026: Берлин (Berlin: самый дешёвый из крупных немецких городов; аренда 1BR €1 100-2 000/мес; стартап-экосистема (Zalando/N26/Delivery Hero/Tier Mobility/Babbel); НДФЛ + взносы те же что по всей DE; Berlin имеет бесплатный общественный транспорт BVG Deutschlandticket €49/мес; Берлин дорожает быстро); Мюнхен (Munich/München: самый дорогой в Германии; аренда 1BR €1 600-3 000/мес; BMW/Siemens/MAN/Allianz/MunichRe HQ; Мюнхен зарплата IT в среднем +15% vs Berlin); Гамбург (Hamburg: дорогой; Airbus EMEA HQ; крупный медиа-центр (AxelSpringer/Gruner+Jahr); аренда 1BR €1 300-2 200; порт + логистика tech); Франкфурт (Frankfurt am Main: финансовый центр DE; Deutsche Bank/Commerzbank/DZ Bank IT; аренда 1BR €1 400-2 500; нет культурного vibе Берлина но хорошие зарплаты fintech); Штутгарт (Stuttgart: Porsche/Mercedes-Benz/Bosch HQ; automotive tech; аренда 1BR €1 200-2 000; Schwäbische Hausfrau = качество но скучный; меньше экспатов); Дюссельдорф (Düsseldorf: финансовый центр рядом с Кёльном; японская и корейская экспат-сообщества; аренда 1BR €1 100-1 900; Henkel/Vodafone DE HQ); Кёльн (Cologne/Köln: дешевле Мюнхена и Гамбурга; Deutsche Telekom; аренда 1BR €1 000-1 800; хорошее качество жизни)'
    ,
    seo_description: 'Какой город Германии выбрать для переезда в 2026 году: БЕРЛИН: аренда 1BR (Mitte/Prenzlauer Berg) €1 400-2 200/мес; (Tempelhof/Spandau) €900-1 400; стартапы (Zalando €3.3B, N26, Delivery Hero, Babbel, Tier Mobility, HelloFresh, Omio); культурная жизнь (#1 в EU по культуре); международность (37% Berliner рождены за рубежом); IT зарплата Middle €3 800-5 500/мес; минусы: бюрократия (Bürgeramt запись через 3 мес), Berlinale толпы, зима тёмная; МЮНХЕН: аренда 1BR (Maxvorstadt/Schwabing) €1 800-3 000; (Giesing/Neuperlach) €1 200-1 800; BMW (90 000 сотрудников в мюнхенском регионе), Siemens (60 000), Allianz (40 000), MAN, MunichRe, Linde; IT зарплата Middle €4 200-6 500/мес (+15-20% vs Berlin при том же уровне); минусы: самый дорогой (жильё дефицит), баварская бюрократия, Oktoberfest толпы; ГАМБУРГ: аренда 1BR (Altona/Eppendorf) €1 400-2 200; Airbus EMEA HQ (10 000 в Hamburg), Xing (DACH LinkedIn), About You (fashion e-com), Tchibo, Otto Group; IT зарплата €3 800-5 500; Hafencity — новый квартал; медиа центр (SPIEGEL/stern/NDR); ФРАНКФУРТ: аренда 1BR (Sachsenhausen/Westend) €1 500-2 400; Deutsche Bank/Commerzbank/DZ Bank/Union Investment; fintech hub (N26 тоже тут; Wirecard хедквортер был тут); ING-DiBa; Commerzbank Tower; IT fintech €4 500-7 500/мес; ШТУТГАРТ: аренда 1BR (Stuttgart-Mitte/Bad Cannstatt) €1 200-2 000; Porsche (HQ Stuttgart; 30 000 чел.), Mercedes-Benz (HQ Untertürkheim; 170 000 global), Bosch (Robert Bosch GmbH HQ Gerlingen; 420 000 global); automotive tech Senior €4 000-7 000/мес; ДЮССЕЛЬДОРФ: аренда 1BR €1 100-2 000; Henkel/Vodafone DE/L-Oreal Germany; японская экспат-сообщество (JetBrains DE офис также тут); КЁЛЬН: аренда 1BR €1 000-1 800; Deutsche Telekom (HQ Bonn-20 мин)/RTL/WDR/Ford Germany; один из дешёвых крупных городов Германии.',
    content_md: `# Какой город Германии выбрать: Берлин, Мюнхен, Гамбург, Франкфурт, Штутгарт

У каждого немецкого города своя специализация. Стартапы — Берлин. Automotive — Штутгарт. Финтех — Франкфурт. Авиация — Гамбург.

## Быстрое сравнение

| Город | Аренда 1BR | IT зарплата Middle | Специализация |
|-------|-----------|-------------------|--------------|
| **Берлин** | €900-2 200 | €3 800-5 500 | Стартапы |
| **Мюнхен** | €1 200-3 000 | €4 200-6 500 | Корпорации |
| **Гамбург** | €1 200-2 200 | €3 800-5 500 | Медиа + Авиация |
| **Франкфурт** | €1 300-2 400 | €4 500-7 500 | Fintech/Banking |
| **Штутгарт** | €1 100-2 000 | €4 000-7 000 | Automotive |
| **Кёльн** | €1 000-1 800 | €3 500-5 000 | Telecom + Медиа |
| **Дюссельдорф** | €1 000-1 900 | €3 700-5 200 | Химия + Ритейл |

---

## Берлин: стартапы и культура

**Работодатели IT:**
- Zalando (€3.3B, fashion e-com)
- N26 (neobank, $9B оценка)
- Delivery Hero (NYSE DHER)
- Babbel (EdTech)
- HelloFresh (meal kits, NYSE)

**Плюсы:**
- Самый дешёвый из крупных городов
- Stартап-культура (#1 EU стартап-хаб)
- Internationality (37% рождены за рубежом)
- Культурная жизнь
- Deutschlandticket €49/мес (транспорт)

**Минусы:**
- Бюрократия (Bürgeramt запись 3+ мес)
- Дорожает быстро (жильё +40% за 5 лет)

---

## Мюнхен: крупные корпорации

**Работодатели IT:**
- BMW (90 000 в Мюнхенском регионе)
- Siemens (60 000 в Мюнхене)
- Allianz (страхование, IT)
- MAN Truck
- MunichRe

**Плюсы:**
- Зарплаты IT на 15-20% выше чем в Берлине
- Близость к Альпам (1 час на машине)
- Высокий уровень жизни

**Минусы:**
- Самый дорогой город Германии
- Аренда 1BR от €1 200 (окраины) до €3 000 (центр)
- Жильё в острейшем дефиците

---

## Гамбург: медиа и авиация

**Работодатели IT:**
- Airbus EMEA HQ (10 000+ в Гамбурге)
- Xing (DACH LinkedIn)
- About You (fashion e-com)
- Otto Group (e-com)
- SPIEGEL/stern (медиа)

**Плюсы:**
- Портовый город с характером
- Богатая медиа и мода сцена
- Хорошая культурная жизнь

---

## Франкфурт: финансы и fintech

**Работодатели IT:**
- Deutsche Bank (IT огромный)
- Commerzbank
- DZ Bank
- ING-DiBa
- Union Investment

**Плюсы:**
- Финтех зарплаты одни из высших в DE
- Аэропорт FRA — один из крупнейших в EU
- Skyline (единственный в Германии)

**Минусы:**
- Меньше культурной жизни
- «Банкерский» город

---

## Штутгарт: automotive tech

**Работодатели IT:**
- Porsche (HQ Stuttgart)
- Mercedes-Benz (HQ Untertürkheim)
- Robert Bosch (HQ Gerlingen, 420 000 global)
- ZF Friedrichshafen
- Mahle

**Плюсы:**
- Automotive tech (одна из высших ниш)
- Relative cheap vs Мюнхен

**Минусы:**
- Менее международный
- Меньше стартапов

---

## Кёльн: telecom и медиа

**Работодатели IT:**
- Deutsche Telekom (HQ соседний Бонн, 20 мин)
- RTL Deutschland
- WDR (TV)
- Ford Germany HQ

**Плюсы:**
- Один из дешёвых крупных городов Германии
- Хорошее качество жизни
- Рядом Дюссельдорф

---

## Как выбрать

| Приоритет | Город |
|---------|-------|
| Стартапы + дешевле | **Берлин** |
| Максимальные зарплаты | **Мюнхен** + Франкфурт |
| Automotive | **Штутгарт** |
| Fintech/Banking | **Франкфурт** |
| Авиация | **Гамбург** |
| Дешевле + корпорации | **Кёльн** / Дюссельдорф |

---

## Итого

Какой город Германии для переезда 2026: Берлин (стартапы, дешевле, международный, €900-2 200 аренда); Мюнхен (зарплаты +15-20%, BMW/Siemens, дорогой €1 200-3 000); Гамбург (Airbus, медиа, Hafencity); Франкфурт (fintech, банки, €4 500-7 500/мес IT); Штутгарт (Porsche/Mercedes/Bosch, automotive tech); Кёльн (Deutsche Telekom, дешевле). Совет: для первого переезда — Берлин (экспат-сообщество, стартапы, относительно дешёвый).
`,
  },
  {
    slug: 'kak-vybrat-yazyk-programmirovaniya-dlya-udalyonki-2026',
    title: 'Какой язык программирования выбрать для поиска работы за рубежом в 2026 году',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Какой язык программирования выбрать для работы за рубежом 2026: топ языков по данным Stack Overflow Developer Survey 2024 и TIOBE Index: Python (самый популярный 2024; data science/AI/ML; Django/FastAPI backend; зарплата $110k-180k/год global; спрос растёт с AI-буумом; лёгкий для изучения; многие EU/US компании требуют Python для ML/backend); JavaScript/TypeScript (TypeScript вытеснил JS; full-stack с React/Next.js/Node.js; везде нужен; зарплата $90k-160k/год; нет в топе по зарплате но спрос максимальный); Go (Golang) (растущий спрос в backend систем с высокой нагрузкой; microservices/Kubernetes; зарплата $120k-190k/год; Google/Cloudflare/Uber используют; сложнее найти позицию чем Python/JS но конкуренция ниже); Rust (самый любимый язык Developer Survey 9 лет подряд; systems programming/WebAssembly/embedded; зарплата $140k-210k/год — один из самых высоких; низкий supply специалистов = высокий спрос при небольшом числе позиций; Mozilla/AWS/Cloudflare/Microsoft используют); Java/Kotlin (enterprise backend; Spring Boot; Kotlin заменяет Java в Android и backend; зарплата $100k-160k/год; стабильный спрос в EU enterprise/fintech); Swift (iOS; Apple ecosystem; только Apple/мобильная разработка; зарплата $130k-180k/год в US; очень нишевый); C++/C (embedded systems; automotive (BMW/Porsche/Bosch)/aerospace; зарплата $110k-180k/год; Cosylab (CERN)), данные StackOverflow 2024',
    seo_description: 'Язык программирования для работы за рубежом 2026: ДАННЫЕ: Stack Overflow Developer Survey 2024 (65 000+ respondents) + TIOBE Index 2024 + LinkedIn Job Trends; PYTHON: самый используемый (51% developers); #1 по вакансиям data science/ML/AI; FastAPI/Django/Flask для backend; зарплата median USA $150k/год (Stack Overflow); Hacker Rank оценки показывают: 73% требований в ML-вакансиях — Python; EU backend с Django: €70k-120k Senior; рост спрос 2023-2024: AI boom (LLM/RAG/agents) = Python везде; лёгкий для изучения (A1-B1 Python за 6 мес с нуля); TYPESCRIPT/JAVASCRIPT: 62% developers используют; самый нужный тип разработчика — full-stack React/Next.js+Node; зарплата median USA $140k (немного ниже Python senior); EU Senior: €60k-100k; спрос очень большой; конкуренция высокая; GO (GOLANG): 13% developers (растёт); backend систем с высокой нагрузкой (Kubernetes написан на Go; Docker частично); Google/Cloudflare/Uber/Dropbox/Twitch; зарплата senior USA $175k-220k (Stack Overflow median); EU Senior Go €80k-130k; преимущество: меньше конкуренции при высоком спросе на Go-разработчиков от определённых компаний; RUST: 12% developers (2024 — рекорд любимый 9 лет); systems/embedded/WebAssembly/blockchain; AWS (Firecracker VMM)/Cloudflare (написали Workers на Rust)/Mozilla (создали); зарплата stack overflow median Senior USA $200k+; EU €90k-150k; позиций мало но зарплата самая высокая; JAVA/KOTLIN: Java 33% developers; enterprise backend (финтех/банки/страхование в EU); Spring Boot/Quarkus; Kotlin 10% (Android + backend Spring); EU fintech Senior Java €80k-130k; стабильный; СОВЕТ 2026: если с нуля или меньше 2 лет опыта — Python ИЛИ TypeScript; если 3-5 лет опыта Python/Java/JS — добавить Go или Rust; если хочешь automotive — C++; AI/ML — Python обязателен.',
    content_md: `# Какой язык программирования выбрать для работы за рубежом: данные 2026

Stack Overflow Developer Survey 2024: 65 000+ разработчиков. Разбираем спрос, зарплаты и перспективы.

## Топ языков по спросу 2024

| Язык | % разработчиков | Зарплата Senior (USA) | Конкуренция |
|------|----------------|----------------------|------------|
| **Python** | 51% | $150k | Высокая |
| **TypeScript** | 43% | $140k | Очень высокая |
| **Go** | 13% | $175-220k | Средняя |
| **Rust** | 12% | $200k+ | Низкая |
| **Java/Kotlin** | 33%/10% | $140k | Средняя |
| **C++** | 23% | $160k | Средняя |

---

## Python: AI-бум = максимальный спрос

**Почему Python в 2026:**
- #1 по вакансиям в data science / ML / AI
- FastAPI/Django/Flask для backend
- 73% требований в ML-позициях — Python (Hacker Rank)
- LLM/RAG/Agents = Python везде

**EU Senior зарплаты:**
- Backend (Django): €70 000-100 000/год
- Data Science: €80 000-120 000/год
- ML Engineer: €90 000-140 000/год

**Для кого:** если хочешь работать с AI/ML или backend — Python must-have.

---

## TypeScript: full-stack везде

**Почему TypeScript вытеснил JS:**
- 43% developers (растёт)
- React/Next.js + Node.js — самый популярный стек
- Везде нужен frontend + backend

**EU Senior зарплаты:**
- Full-stack React/Node: €60 000-100 000/год

**Для кого:** web-разработчик, стартапы, product-компании.

---

## Go: меньше конкуренции, высокие зарплаты

**Почему Go растёт:**
- Kubernetes написан на Go
- Google/Cloudflare/Uber/Dropbox
- Microservices с высокой нагрузкой

**Преимущество:** спрос есть, но Go-специалистов меньше.

**EU Senior зарплаты:** €80 000-130 000/год

**Для кого:** backend инженер хочет выделиться среди Java/Python.

---

## Rust: самый высокооплачиваемый

**9 лет подряд** — самый любимый язык (Developer Survey).

- AWS (Firecracker), Cloudflare (Workers), Mozilla
- WebAssembly, embedded, blockchain
- Позиций мало — зарплата максимальная

**EU Senior зарплаты:** €90 000-150 000/год

**Для кого:** systems programming, готов инвестировать 1-2 года в крутую кривую обучения.

---

## Java/Kotlin: enterprise fintech

**Java — стабильный выбор для EU fintech:**
- Deutsche Bank / BNP Paribas / ABN AMRO
- Spring Boot / Quarkus
- EU enterprise стандарт

**Kotlin замещает Java:**
- Android: Kotlin #1
- Backend: Kotlin + Spring/Ktor

**EU Senior зарплаты:** €80 000-130 000/год

---

## C++: automotive и aerospace

**Кому нужен:**
- BMW/Porsche/Mercedes-Benz (embedded systems)
- Airbus (авиационное ПО)
- Cosylab (CERN/ITER)

**EU Senior зарплаты:** €90 000-150 000/год в automotive.

---

## Рекомендация по ситуации

| Ситуация | Язык |
|---------|-----|
| С нуля или <2 лет опыта | **Python** или TypeScript |
| Web-разработчик | TypeScript (React/Next.js) |
| Backend + хочу рост зарплаты | **Go** |
| Максимальная зарплата | **Rust** (долгий путь) |
| AI/ML обязательно | **Python** |
| EU fintech/enterprise | Java/Kotlin |
| Automotive (Мюнхен/Штутгарт) | **C++** |

---

## Итого

Язык программирования для работы за рубежом 2026: Python (#1 спрос AI/ML, €70-140k EU); TypeScript (full-stack везде, высокая конкуренция); Go (backend, меньше конкуренции, $175-220k USA); Rust (наивысшая зарплата, низкая конкуренция, сложный); Java/Kotlin (EU fintech стабильно); C++ (automotive Штутгарт/Мюнхен). Совет: в 2026 Python + Go = лучшая инвестиция для максимального спроса+зарплаты.
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
console.log(`\nБатч 172: ${ok} OK, ${err} ошибок`);
