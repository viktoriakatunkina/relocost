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
    slug: 'ip-v-serbii-dlya-it-frilansera-2026',
    title: 'ИП в Сербии для IT-фрилансера в 2026 году: паушальный налог, банки, SWIFT',
    tag: 'практика',
    read_time: 2,
    country_slug: null,
    seo_title: 'ИП в Сербии для фрилансера 2026: Preduzentnik Pausalac (паушальный предприниматель; самая простая форма ИП в Сербии; фиксированная сумма налога независимо от дохода; регистрация через APR Agencija za privredne registre — портал apr.gov.rs онлайн или офис; стоимость: RSD 500 = $4.5; срок 1 день; нет требования к ВНЖ — иностранцы регистрируют ИП; нужен ПИБ/JMBG = налоговый идентификатор; налоги ИП паушалиста: фиксированная сумма рассчитывается раз в год ПФУ (Poreska Uprava) на основе деятельности + региона; приблизительно 10% от дохода итого; взносы на обязательное страхование: PIO пенсия RSD 7 344-20 000/мес + PZO здоровье; итого для IT в Белграде ≈ RSD 25 000-50 000/мес = $230-460 независимо от дохода = ОЧЕНЬ МАЛО при высоких доходах; банки Сербии (Banca Intesa Serbia/UniCredit Serbia/Raiffeisen Serbia/OTP Serbia; SWIFT работает хорошо; USD/EUR/RSD счета; карты Visa/MC без ограничений); безвизовый для россиян 30 дней (продлять путём выезда) или ВНЖ; RSD/EUR волатилен но управляемо (1 EUR ≈ 117 RSD)',
    seo_description: 'ИП в Сербии для IT-фрилансера 2026: ФОРМА: Preduzetnik Pausalist (паушальный предприниматель); регистрация: апр.gov.rs онлайн ИЛИ в офисе APR (Agencija za privredne registre); документы: загранпаспорт + ПИБ (Poreski Identifikacioni Broj — аналог ИНН; получить в Poreska Uprava 1-2 часа при первом визите) + JMBG (для постоянных резидентов) или только ПИБ (для нерезидентов-иностранцев); стоимость: RSD 500 ($4.5); срок: 1 рабочий день; ВНЖ НЕ требуется (иностранец без ВНЖ может зарегистрировать ИП — уникально для EU-региона); НАЛОГИ паушалиста: Poreska Uprava ежегодно устанавливает фиксированную паушальную сумму на год (Решение о паушалном опорезивању); для IT в Белграде 2024: приблизительно RSD 20 000-40 000/мес совокупно (НДФЛ + взносы) независимо от дохода; при доходе $5 000/мес = €4 700/мес: нагрузка $230-370 = 5-7.5% (!); при доходе $10 000/мес = €9 300: нагрузка ~2.5-3.5%; взносы отдельно: PIO пенсия RSD 7 344-15 000/мес + Zdravstveno osiguranje (RZZO) медицина RSD 3 000-8 000/мес; SWIFT в Сербии: работает полностью; Banca Intesa Serbia (дочка Intesa Sanpaolo IT) — лучший для нерезидентов; USD/EUR/RSD счёт; Visa/MC карты работают везде; Raiffeisen Bank Serbia — хорошая альтернатива; RSD (Srpski dinar): 1 EUR = 117 RSD (умеренно стабилен; НБС Народная банка поддерживает диапазон); безвизовый РФ→Сербия: 30 дней (визу гражданам РФ не нужна по межправдоговору; но 30 дней — нужно выезжать или оформлять ВНЖ боравак).',
    content_md: `# ИП в Сербии для IT-фрилансера: паушальный налог $230-460/мес, SWIFT работает

Сербия — популярная юрисдикция для российских IT-фрилансеров. Паушальный налог фиксированный (независимо от дохода), SWIFT работает полностью, безвизовый 30 дней.

## Почему Сербия для ИП

- **Паушальный налог:** фиксированно ~$230-460/мес независимо от дохода
- Регистрация ИП за 1 день ($4.5 пошлина)
- ВНЖ НЕ требуется для регистрации
- SWIFT работает полностью
- Безвизовый для россиян 30 дней

---

## Регистрация ИП (Preduzetnik)

**Через APR (apr.gov.rs) онлайн или в офисе:**

| Параметр | Значение |
|---------|---------|
| Пошлина | RSD 500 ($4.5) |
| Срок | 1 рабочий день |
| ВНЖ | НЕ требуется |

**Что нужно:**
1. Загранпаспорт
2. ПИБ (Poreski Identifikacioni Broj) — получить в налоговой инспекции (Poreska Uprava); занимает 1-2 часа при первом визите

---

## Паушальный налог: как работает

**Poreska Uprava ежегодно устанавливает фиксированную сумму** (Решение о паушалном опорезивању) — независимо от фактического дохода.

**Типичный размер для IT в Белграде (2024):**

| Статья | RSD/мес | USD/мес |
|--------|---------|---------|
| НДФЛ (паушальный) | 8 000-15 000 | $72-135 |
| PIO пенсия | 7 344-12 000 | $66-108 |
| RZZO медицина | 3 000-7 000 | $27-63 |
| **Итого** | **18 344-34 000** | **$165-306** |

**Почему выгодно при высоком доходе:**

| Доход | Налоговая нагрузка |
|-------|------------------|
| $2 000/мес | ~10-15% |
| $5 000/мес | **~5-6%** |
| $10 000/мес | **~2-3%** |

При росте дохода сумма налога НЕ меняется — только при ежегодном пересмотре.

---

## Банки Сербии

| Банк | Нерезидентам | SWIFT | Visa/MC |
|------|-------------|-------|---------|
| **Banca Intesa Serbia** | Да | Да | Да |
| **Raiffeisen Bank Serbia** | Да | Да | Да |
| **UniCredit Serbia** | Да | Да | Да |
| **OTP Serbia** | Да | Да | Да |

**Banca Intesa Serbia** — лучший для нерезидентов (дочка Intesa Sanpaolo Италия). USD/EUR/RSD счёт, карты Visa Classic, SWIFT без ограничений.

---

## RSD: умеренная стабильность

| Год | RSD/EUR |
|-----|---------|
| 2022 | 117.3 |
| 2023 | 117.2 |
| 2024 | 117.1 |

НБС (Народна банка Србиjе) поддерживает курс в управляемом диапазоне.

---

## Безвизовый vs ВНЖ

**Граждане РФ:**
- Безвизово 30 дней
- Нужно выезжать для сброса счётчика (выезд-въезд через Боснию/Хорватию/Северную Македонию)
- Долгосрочное пребывание: оформить ВНЖ (Odobrenje boravka): обычно через аренду квартиры + справки

---

## Схема работы

1. Паушальный ИП в Сербии
2. Banca Intesa Serbia: USD/EUR счёт
3. Иностранный клиент → SWIFT → сербский счёт
4. Карта Visa serbia → тратить везде
5. Налог ~$230-460/мес фиксированно

---

## Итого

ИП в Сербии для IT-фрилансера 2026: Preduzetnik Pausalist; регистрация APR 1 день ($4.5); ВНЖ не нужно; паушальный налог фиксированно ~$165-306/мес независимо от дохода (при $10k/мес = 2-3% нагрузка); SWIFT работает; Banca Intesa/Raiffeisen; Visa/MC; безвизовый 30 дней. Идеально для: фрилансер с высоким доходом + минимальная налоговая нагрузка (паушаль) + SWIFT + безвизовая страна рядом с EU.
`,
  },
  {
    slug: 'uk-skilled-worker-visa-it-2026',
    title: 'UK Skilled Worker Visa для IT-специалиста в 2026 году: требования, зарплаты, спонсор',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'UK Skilled Worker Visa IT 2026: Skilled Worker Visa (SWV; заменила Tier 2 General с 2021; points-based immigration system PBS; 70 баллов нужно; обязательные баллы 50: оффер от UK-лицензированного работодателя (Sponsor) 20б + подходящая должность (SOC код) 20б + английский язык B1 10б; зарплатный порог 20 баллов: General Threshold £38 700/год gross = £3 225/мес 2024 (повышен с £26 200 в 2024 апреле!); IT должности — SOC коды: 2133 IT business analysts; 2134 Programmers; 2135 Web designers/developers; 2136 Software quality professionals; 2139 IT; Shortage Occupation List (SOL) с 2023 переименован в Immigration Salary List (ISL) — некоторые IT должности имеют пониженный порог до £30 960/год; CoS (Certificate of Sponsorship) — работодатель выдаёт; обработка 3 нед fast-track или 8 нед standard; ILR (Indefinite Leave to Remain) через 5 лет → гражданство через 6 лет; UK без EU после Brexit: нет свободы передвижения в EU с UK паспортом; GBP нестабилен (2022: £1=$1.04; 2024: £1=$1.27); NHS с первого дня работы (но IHS Surcharge £1 035/год); стоимость жизни Лондон ($3 500-7 000/мес) vs другие города (Манчестер/Бирмингем/Эдинбург)',
    seo_description: 'UK Skilled Worker Visa для IT 2026: Skilled Worker Visa — основная рабочая виза UK для квалифицированных специалистов (заменила Tier 2 General с 5 января 2021); Points-Based System (PBS): нужно 70 баллов; Mandatory (50б): Sponsor 20б (лицензированный UK спонсор; база на sponsorship-management.service.gov.uk) + Suitable job 20б (RQF Level 3+ = A-level эквивалент; SOC код в eligible list) + английский язык B1 10б (IELTS/OET ИЛИ страна где английский официальный ИЛИ диплом/образование на английском); Tradeable (20б): зарплата General threshold £38 700/год (2024; повышена с апреля 2024 с £26 200!) — даёт 20б; ИЛИ Immigration Salary List job (ранее Shortage Occupation; пониженный порог £30 960/год) — даёт 20б; IT SOC-коды в Skilled Worker: 2133 IT Business Analysts, 2134 Programmers and Software Development Professionals, 2135 Web Design and Development Professionals, 2136 Information Security Professionals, 2139 Information Technology and Telecommunications Professionals; CoS (Certificate of Sponsorship) — обязательный документ от работодателя; работодатель запрашивает CoS в Home Office; стоимость CoS для работодателя £239 (Small) / £239-479 (Large); IELTS не нужен гражданам: Australia, Canada, New Zealand, USA, Antigua&Barbuda, Barbados, Bahamas, Belize, Dominica, Grenada, Guyana, Jamaica, Kittis-Nevis, Lucia, St. Vincent, Trinidad; россияне: нужен IELTS Life Skills B1 Speaking+Listening — level 4.0 minimum (дешевле и проще чем Academic IELTS); ILR (Indefinite Leave to Remain): через 5 лет (continuous residence) → British Citizenship через 12 мес после ILR; обработка визы: Priority service 5 рабочих дней (£500 доп); Standard 8 нед; стоимость: £719 (3 года) / £1 420 (5 лет) + IHS Surcharge £1 035/год; Лондон стоимость жизни: 1BR в Zone 1/2 £2 000-3 500/мес ($2 525-4 420); Manchester: 1BR £850-1 400/мес ($1 073-1 768); Edinburgh: 1BR £900-1 500/мес.',
    content_md: `# UK Skilled Worker Visa для IT в 2026: после Brexit, порог £38 700/год

UK после Brexit — своя points-based система. Главный порог повышен с £26k до £38.7k в 2024. Оффер + спонсор + английский = 70 баллов.

## Почему UK для IT (и почему нет)

**Плюсы:**
- Лондон — крупнейший финансовый tech-центр Европы
- Visa за 5 рабочих дней (Priority)
- ILR (ПМЖ) через 5 лет → гражданство через 6
- NHS бесплатная медицина с первого дня

**Минусы:**
- Зарплатный порог **£38 700/год** (2024, повышен!)
- Лондон очень дорогой ($3 500-6 000/мес)
- После Brexit — нет свободы передвижения в EU

---

## Points-Based System: как набрать 70 баллов

**Обязательные (50 баллов):**

| Критерий | Баллы |
|---------|------|
| Оффер от UK Sponsor | 20 |
| SOC код в Eligible list | 20 |
| Английский B1 | 10 |

**Tradeable (20 баллов):**

| Зарплата | Баллы |
|---------|------|
| ≥£38 700/год (General Threshold) | 20 |
| ≥£30 960/год (Immigration Salary List) | 20 |

---

## Зарплатный порог 2024

**Апрель 2024:** порог повышен с £26 200 → **£38 700/год** (£3 225/мес).

**Immigration Salary List (ранее Shortage Occupation):**
- Пониженный порог £30 960/год для отдельных IT должностей
- Требует чтобы должность входила в список ISL

---

## IT SOC-коды (Eligible)

| SOC код | Должность |
|---------|-----------|
| 2133 | IT Business Analysts |
| **2134** | **Programmers and Software Development** |
| 2135 | Web Design and Development |
| 2136 | Information Security |
| 2139 | IT and Telecoms Professionals |

---

## Английский язык

**Россиянам нужен:** IELTS Life Skills B1 (Speaking + Listening; уровень 4.0).

Это **проще и дешевле** чем Academic IELTS. Сдаётся отдельно.

**Не нужен** гражданам: Australia, Canada, New Zealand, USA и ещё 10 государств Карибского бассейна.

---

## CoS: Certificate of Sponsorship

**Работодатель:**
1. Регистрируется как UK Sponsor (sponsorship-management.service.gov.uk)
2. Запрашивает CoS для конкретного кандидата
3. Вы используете CoS при подаче на визу

**Стоимость для работодателя:**
- Small Sponsor: £239
- Large Sponsor: £239-479

---

## Зарплаты IT в UK

| Должность | London £/мес | Manchester £/мес |
|-----------|-------------|-----------------|
| Junior Dev | 3 000-4 500 | 2 200-3 500 |
| Middle Dev | 4 500-7 500 | 3 500-6 000 |
| Senior Dev | 7 000-12 000 | 5 500-9 000 |

---

## Стоимость жизни

| Город | 1BR аренда | Жизнь/мес |
|-------|-----------|-----------|
| Лондон Zone 1/2 | £2 000-3 500 | $3 500-6 000 |
| **Манчестер** | £850-1 400 | $1 800-3 000 |
| **Эдинбург** | £900-1 500 | $1 900-3 200 |
| **Бирмингем** | £750-1 200 | $1 700-2 800 |

**IHS Surcharge** (International Health Surcharge): £1 035/год — обязательная доплата при подаче визы. Даёт право на NHS.

---

## Путь к ILR и гражданству

| Этап | Срок |
|------|------|
| Skilled Worker Visa | 3 или 5 лет |
| ILR (Indefinite Leave to Remain) | **5 лет** continuous |
| British Citizenship | 12 мес после ILR |

**Итого:** 6+ лет до британского паспорта.

---

## Итого

UK Skilled Worker Visa IT 2026: Points-Based System 70 баллов (оффер 20 + SOC 20 + английский B1 10 + зарплата ≥£38 700/год 20); IELTS Life Skills B1 нужен россиянам; CoS от работодателя; обработка 5 дней Priority; Senior London £7 000-12 000/мес; жизнь £2 500-5 500/мес; ILR 5 лет → гражданство 6 лет. Идеально для: Лондонский fintech/banking tech + оффер от UK Sponsor + нет проблем с £38 700 порогом.
`,
  },
  {
    slug: 'avstralia-sydney-it-skilled-migration-2026',
    title: 'Австралия и Сидней для IT в 2026 году: Skilled Independent Visa, IELTS 7.0',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Австралия Сидней IT Skilled Migration 2026: Skilled Independent Visa 189 (постоянная резиденция без спонсора работодателя; Points Test: 65 баллов минимум, конкурентные заявки получают 85-90+; баллы за возраст 25-32 = 30б, диплом 20б, IELTS 7.0 = 10б, IELTS 8.0 = 20б, опыт работы в AU 15б, опыт за рубежом 5-15б; IELTS General Training IELTS 7.0 = threshold (все 4 skills ≥7.0); SkillSelect Expression of Interest EOI; ANZSCO код для IT: 2613 Software and Applications Programmers, 2621 Database and Systems Administrators/IT Security, 2633 Telecommunications); Subclass 482 TSS (Temporary Skill Shortage; спонсируемая работодателем; Medium-term stream для IT 4 года + PR после); TSMIT (Temporary Skilled Migration Income Threshold) £70 000 AUD/год ($45 000 USD); стоимость жизни Сидней (второй самый дорогой в AU): 1BR аренда $AUD 2 800-4 500/мес ($1 830-2 940 USD); жизнь $2 500-4 500/мес; зарплата Senior IT AUD 120k-200k/год ($78k-130k); НДФЛ AU: прогрессивный до 45% + Medicare 2%; IT-компании AU: Atlassian (TEAM NASDAQ; HQ Sydney; $40B+ пик; Confluence/Jira создана австралийцами), Canva ($39.5B оценка; HQ Sydney; graphic design), Afterpay (BNPL; куплен Square/Block $29B; AU origin), Xero (cloud accounting; $11B; NZ-AU), SafetyCulture ($2.2B scaleup; safety software)',
    seo_description: 'Австралия Сидней IT Skilled Migration 2026: Subclass 189 (Skilled Independent Visa): постоянная резиденция без спонсора; Points Test — минимум 65 баллов для EOI (Expression of Interest), invitation cutoffs в популярных IT специальностях обычно 80-90+ баллов (конкуренция высокая); ANZSCO коды IT: 261111 ICT Business Analyst, 261313 Software Engineer, 261314 Software Tester, 262113 Systems Administrator, 262114 ICT Security Specialist, 263112 Network Engineer; баллы: Возраст 18-24=25б, 25-32=30б, 33-39=25б, 40-44=15б, 45-49=0б; диплом PhD 20б, Master/Bachelor 15б; English: Proficient (IELTS 7.0+) 10б, Superior (IELTS 8.0+) 20б; Skilled employment в AU: 1 год=5б, 3 года=10б, 5 лет=15б; за рубежом: 3 года=5б, 5 лет=10б, 8 лет=15б; State Nomination (Subclass 190): +5б за номинацию штата → снижает cutoff; Subclass 482 TSS (Temporary Skill Shortage Visa): работодатель спонсирует; Medium-term stream (4 года): требуется TSMIT (Temporary Skilled Migration Income Threshold) AUD $73 150/год (2024) + IELTS 5.0; IT специальности в Medium-term; после 2-3 лет на 482 можно подать на PR Subclass 186 (ENS); IELTS General Training (не Academic): General Training = для иммиграции; Academic = для университетов; для 189/190/482 — General Training; IELTS 7.0 = Proficient English (все 4 band ≥7.0); IELTS 8.0 = Superior English (дают +20б vs +10б); стоимость жизни: Сидней 1BR Zone 2 (Chippendale/Newtown): AUD 2 400-3 500/мес ($1 565-2 285); Zone 1 (CBD/Surry Hills): AUD 3 000-5 000/мес; Melbourne несколько дешевле; IT зарплата Senior: AUD 120 000-180 000/год = $78 000-117 000/год gross; НДФЛ прогрессивный 0%-45% + Medicare 2%; NET Senior AUD 120k/год: ~AUD 82k ($53k) = ~AUD 6 800/мес ($4 430); Atlassian (Jira+Confluence; NASDAQ TEAM; основана в Сиднее 2002 Scott Farquhar+Mike Cannon-Brookes; HQ Sydney; пик кап $100B; 11 000 чел.); Canva (graphic design SaaS; $39.5B частная оценка 2021; Сидней+Манила+Остин; 4 000+ чел.); Afterpay (BNPL куплен Square/Block за $29B 2022).',
    content_md: `# Австралия Сидней: Atlassian, Canva, Subclass 189, IELTS 7.0

Австралия — Atlassian (Jira/Confluence) и Canva созданы в Сиднее. Subclass 189 = постоянная резиденция без спонсора. IELTS 7.0 нужен.

## Почему Австралия для IT

- **Subclass 189:** постоянная резиденция без работодателя-спонсора
- Atlassian ($40B) и Canva ($39.5B) — основаны в Сиднее
- Высокие зарплаты: Senior AUD $120k-180k/год
- AUD относительно стабильный
- Английский официальный

---

## Subclass 189: Skilled Independent Visa

**Постоянная резиденция без спонсора:**

**Points Test — нужно набрать:**
- Минимум для EOI: **65 баллов**
- Реальный cutoff в IT: **80-90+** (конкуренция)

**Баллы:**

| Критерий | Баллы |
|---------|------|
| Возраст 25-32 лет | 30 |
| Диплом Bachelor/Master | 15 |
| IELTS 7.0+ (Proficient) | 10 |
| IELTS 8.0+ (Superior) | **20** |
| Опыт в AU 5+ лет | 15 |
| Опыт за рубежом 8+ лет | 15 |
| Nominated State (Sub 190) | +5 |

**Совет:** IELTS 8.0 даёт на 10 баллов больше — критично для высокого cutoff.

---

## IT ANZSCO коды (189 eligible)

| Код | Должность |
|-----|-----------|
| 261313 | Software Engineer |
| 261314 | Software Tester |
| 261111 | ICT Business Analyst |
| 263112 | Network Engineer |
| 262114 | ICT Security Specialist |

---

## Subclass 482 TSS: альтернатива

**Временная виза с путём к PR:**
- Работодатель-спонсор
- Medium-term stream: 4 года
- Зарплата: ≥AUD $73 150/год (TSMIT 2024)
- После 2-3 лет: Subclass 186 (PR)

---

## IELTS: General vs Academic

| Тип | Когда нужен |
|-----|------------|
| **General Training** | Иммиграция (189/190/482) |
| Academic | Университет |

**IELTS 7.0** — Proficient (все 4 раздела ≥7.0).
**IELTS 8.0** — Superior (+10 баллов сверх Proficient).

---

## IT-компании Австралии

| Компания | Профиль | Факт |
|---------|---------|------|
| **Atlassian** | Jira+Confluence | NASDAQ TEAM; основана в Сиднее 2002; пик $100B |
| **Canva** | Graphic design SaaS | $39.5B; 4 000+ чел.; Сидней |
| **SafetyCulture** | Safety software | $2.2B scaleup; Сидней |
| **Xero** | Cloud accounting | $11B; NZ+AU |

### Atlassian

Основана в Сиднее в 2002 Скоттом Фаркером и Майком Кэнноном-Бруксом. Jira, Confluence, Trello, Bitbucket, JSM. IPO на NASDAQ в 2015. Пиковая капитализация ~$100 млрд (2021). Штаб-квартира остаётся в Сиднее + крупные офисы в Нью-Йорке, Сан-Франциско, Амстердаме.

---

## Зарплаты IT в Сиднее

| Должность | AUD/год | USD/год |
|-----------|---------|---------|
| Junior Dev | 65k-90k | $42k-59k |
| Middle Dev | 90k-130k | $59k-85k |
| Senior Dev | 120k-180k | $78k-117k |

---

## НДФЛ Австрии

| Доход (AUD/год) | Ставка |
|----------------|--------|
| 0-18 200 | 0% |
| 18 200-45 000 | 19% |
| 45 000-120 000 | 32.5% |
| 120 000-180 000 | 37% |
| свыше 180 000 | 45% |

**Плюс Medicare Levy: 2%.**

**NET Senior AUD 140k/год:** ~AUD 96 000/год = **AUD 8 000/мес = $5 200/мес**

---

## Стоимость жизни Сиднея

| Статья | AUD/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (CBD/Surry Hills) | 3 000-4 500 | $1 957-2 936 |
| Аренда 1BR (Newtown/Chippendale) | 2 400-3 200 | $1 565-2 087 |
| Продукты | 500-800 | $326-522 |
| Транспорт (Opal) | 200-350 | $130-228 |
| **Итого** | **3 100-5 450** | **$2 023-3 556** |

---

## Итого

Австралия Сидней IT Skilled Migration 2026: Subclass 189 (постоянная резиденция без спонсора; Points Test 65+ мин, реальный cutoff 80-90+); IELTS General Training 7.0 (Proficient) или 8.0 (Superior +10б); Atlassian/Canva/SafetyCulture; Senior AUD 120k-180k/год, NET ~$5 200/мес; жизнь $2 000-3 500/мес; Medicare. Идеально для: Atlassian/Canva оффер + 189 постоянная резиденция без спонсора + IELTS 8.0 для высоких баллов.
`,
  },
  {
    slug: 'kak-poluchit-meditsinskuyu-strakhovku-za-rubezhom-2026',
    title: 'Как получить медицинскую страховку при переезде за рубеж в 2026 году',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Медицинская страховка при переезде за рубеж 2026: государственная медицина в EU (как работает GKV в Германии: работодатель регистрирует с 1 дня; выбираете Krankenkasse — AOK/TK/Barmer/DAK; взнос работника ~7.3%+1.7% Zusatzbeitrag от зарплаты; бесплатно семья при условиях; как использовать: Krankenversicherungskarte (KVK) карточка; обычного врача (Hausarzt) найти через Arztsuche); UK NHS (National Health Service): бесплатно для всех с postcode registration; GP (General Practitioner) = ваш семейный врач; запись к специалисту только через GP; IHS Surcharge £1 035/год при визовой подаче дает доступ к NHS; Нидерланды базовое страхование (Basisverzekering) от €140-180/мес обязательно для всех резидентов; как выбрать Zorgverzekering: Zorgwijzer.nl сравнение; частная страховка экспатов при переезде (для первых 1-3 мес до государственной; Cigna Global Health; Allianz Care; AXA Global Healthcare; ORV от AXA; ihi Bupa; стоимость $80-400/мес); для Грузии/Армении/Сербии (нет бесплатной государственной для иностранцев): частная страховка обязательна; Locals.md / Unifun / GPI Insurance Грузия; Ingostrakh Армения',
    seo_description: 'Медицинская страховка при переезде 2026: ГОСУДАРСТВЕННАЯ МЕДИЦИНА EU: Германия GKV (Gesetzliche Krankenversicherung): обязательна при трудоустройстве (зарплата <€69 300/год = GKV, выше = PKV или GKV по выбору); работодатель автоматически регистрирует при приёме; взнос работника: 7.3% + Zusatzbeitrag ~1.7% = ~9% от зарплаты; выбрать Krankenkasse самостоятельно (TK/Barmer/AOK/DAK — сходные условия, TK имеет хороший English service); карточка электронная Krankenversicherungskarte (КВК); семья Mitversicherung бесплатно при условии (доход члена <€520/мес + < 2 детей); Нидерланды: Basisverzekering (базовая страховка) — €140-180/мес обязательно для всех резидентов независимо от трудоустройства; Zorgwijzer.nl + vergelijk.nl для сравнения; Aanvullende verzekering (дополнительная) для стоматологии/физио; UK NHS: бесплатно для резидентов с регистрацией (номер NHS + GP registration); IHS Surcharge при визе = даёт доступ; запись к специалисту только через GP referral (wait list); ЧАСТНАЯ СТРАХОВКА ДЛЯ ЭКСПАТОВ (первые месяцы или если нет государственной): Cigna Global Health — самая популярная среди экспатов; покрытие $500k-unlimited; цена $120-400/мес (зависит от возраста/страны); Allianz Care — хорошая для EU+AU; AXA Global Healthcare — гибкая; GeoBlue — для США командировочных; Bupa Global — UK+интернациональный; как выбрать: смотреть Network coverage в стране переезда, deductible, coverage включая pre-existing conditions (хронические), repatriation; ГРУЗИЯ/АРМЕНИЯ/СЕРБИЯ: нет автоматической государственной страховки для иностранцев; обязательно покупать частную (через местного страховщика или Cigna/Allianz от $30-100/мес); для визы D7 Португалии: Portugalia Insurance ≈€50/мес или Cigna; для Ikamet Турции: Turkiye Sigorta/Allianz Turkey ≈$20-50/мес.',
    content_md: `# Медицинская страховка при переезде за рубеж: что и как

Медицина — один из первых вопросов при переезде. Разбираем государственную страховку в разных странах и частные варианты.

## Государственная медицина в EU

### Германия (GKV)

**Gesetzliche Krankenversicherung — обязательная при трудоустройстве:**

| Параметр | Значение |
|---------|---------|
| Взнос работника | ~9% от зарплаты (7.3% + Zusatzbeitrag ~1.7%) |
| Семья | Бесплатно при доходе члена <€520/мес |
| Регистрация | Работодатель автоматически |

**Выбрать Krankenkasse:**
- TK (Techniker Krankenkasse) — лучший English service
- Barmer — традиционный
- AOK — региональные

**Как использовать:**
- Krankenversicherungskarte (KVK) — карточка вместо полиса
- Hausarzt (семейный врач) — через сайт Arztsuche
- К специалисту — через Hausarzt или напрямую

---

### Нидерланды (Basisverzekering)

**Обязательная для всех резидентов:**

| Параметр | Значение |
|---------|---------|
| Стоимость | €140-180/мес |
| Кто платит | Сам резидент |
| Eigen risico (франшиза) | €385/год (стандарт) |

Выбрать через **Zorgwijzer.nl** или **vergelijk.nl**.

---

### UK (NHS)

| Параметр | Значение |
|---------|---------|
| Стоимость | Бесплатно для резидентов |
| IHS Surcharge | £1 035/год (при подаче визы) |
| Регистрация | GP registration + NHS number |

**Система направлений:** к специалисту только через GP referral. Ожидание GP appointment: 2-6 нед.

---

## Частные страховки для экспатов

**Нужны для:** первых месяцев до госстраховки, Грузия/Армения/Сербия, путешествий.

| Страховщик | Покрытие | Цена/мес |
|-----------|---------|---------|
| **Cigna Global Health** | $500k-Unlimited | $120-350 |
| **Allianz Care** | $1-2M | $100-300 |
| **AXA Global Healthcare** | Гибкая | $80-250 |
| **Bupa Global** | UK+интернациональный | $150-400 |

---

## Что проверять при выборе страховки

| Критерий | Почему важно |
|---------|-------------|
| **Network coverage** | Врачи в вашем городе |
| **Deductible (франшиза)** | Из кармана до начала покрытия |
| **Pre-existing conditions** | Хронические болезни покрыты ли |
| **Repatriation** | Эвакуация домой при тяжёлом случае |
| **Mental health** | Психотерапия — покрыта ли |

---

## Страны без автоматической страховки (Грузия/Армения/Сербия)

| Страна | Рекомендация | Цена |
|-------|-------------|------|
| Грузия | GPI Insurance / Cigna | $30-100/мес |
| Армения | Ингосстрах Армения / AXA | $30-80/мес |
| Сербия | Wiener Stadtische Serbia / Cigna | $40-100/мес |

---

## Для D7 Visa Португалии

Страховка обязательна при подаче:
- **Portugalia Insurance** (~€50/мес)
- **Cigna Global** (~€80-120/мес)

---

## Для Ikamet Турции

Обязательна при оформлении:
- **Türkiye Sigorta** ($20-40/мес)
- **Allianz Turkey** ($30-50/мес)

---

## Итого

Медицинская страховка при переезде 2026: EU трудоустройство — автоматически государственная (Германия GKV ~9%, Нидерланды €140-180/мес, UK NHS IHS £1 035/год); Грузия/Армения/Сербия — частная обязательно ($30-100/мес Cigna/AXA); первые месяцы до госстраховки — Cigna Global Health/AXA ($80-350/мес); проверять: Network coverage, pre-existing conditions, mental health.
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
console.log(`\nБатч 171: ${ok} OK, ${err} ошибок`);
