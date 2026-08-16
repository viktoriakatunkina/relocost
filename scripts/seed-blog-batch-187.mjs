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
    slug: 'irlandiya-dublin-it-2026',
    title: 'Ирландия и Дублин для IT в 2026: EU Blue Card, Google/Meta/Apple EMEA, 12.5% CT',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Ирландия Дублин IT 2026: ВНЖ Ирландии (Ireland работает по своей системе не Шенген; General Employment Permit; Critical Skills Employment Permit (CSEP) = основной путь для IT; CSEP: только для квалифицированных профессий (список Critical Skills Occupations; включает Software Engineers/Data Scientists/IT Architects); зарплата ≥ €32 000/год gross; работодатель = ирландская компания; подача в DBEI (Department of Enterprise); срок 1-2 мес; ВНЖ 2 года; после 2 лет Stamp 4 = право работать без разрешения у любого работодателя; ПМЖ через 5 лет; гражданство через 5 лет (одно из самых быстрых в EU!); EU Blue Card: Ирландия НЕ участвует в EU Blue Card scheme); НДФЛ Ирландии: USC (Universal Social Charge): 0.5% до €12 012; 2% €12 013-22 920; 4.5% €22 921-70 044; 8% свыше €70 044; PAYE (Income Tax): 20% до €40 000; 40% свыше €40 000; PRSI (социальное): 4% работник + 10.95% работодатель; ИТОГО при €60 000/год: 20% первые 40k + 40% выше + USC 4.5-8% + PRSI 4% = ~35-40% эффективная ставка; REMITTANCE BASIS для нерезидентов: иностранные доходы не облагаются если не переводить в Ирландию; КОРПОРАТИВНЫЙ НАЛОГ: 12.5% (один из самых низких в EU; поэтому Apple/Google/Meta держат EMEA HQ в Дублине); для крупных компаний (>€750M оборот): OECD Pillar Two = 15% minimum (с 2024); IT-компании Дублина (FAANG EMEA HQ!): Google EMEA HQ (Google Ireland; 8 000+ чел.; HQ Barrow Street D4; крупнейший работодатель Дублина; EU Search/YT/Cloud operations); Meta (Facebook) EMEA HQ (Dublin; 4 000+ чел.; Ballsbridge D4; EU Ads/Policy/Content moderation); Apple European HQ (Cork; 6 000+ чел.; и Дублин офис; Apple Distribution International; EMEA Finance HQ); Microsoft EMEA HQ (Dublin; One Microsoft Place Leopardstown; 2 000+ чел.); LinkedIn European HQ (Dublin; 2 000+ чел.); Twitter/X EMEA (Dublin; 400+ чел.); Stripe EMEA HQ (Dublin; fintech; основана ирландцами Collison Brothers; $65B); Intercom (SaaS messaging; $1.3B; founded в Дублине); Zendesk (CX SaaS; Dublin EMEA); HubSpot EMEA HQ (Dublin; 1 000+ чел.; инструменты маркетинга)',
    seo_description: 'Ирландия Дублин IT 2026: CRITICAL SKILLS EMPLOYMENT PERMIT (CSEP): наиболее быстрый путь для IT; Critical Skills Occupations List (включает Software Engineer/Data Analyst/IT Architect/Project Manager IT/ Data Scientist — список обновляется; проверять на enterpriseinfo.ie); зарплата: ≥€32 000/год gross (порог для CSEP; большинство IT-позиций в Дублине $50k-120k gross = проходят); работодатель: ирландская компания (зарегистрированная в Ирландии); срок рассмотрения: 5-15 business days expedited (официально; реально 1-2 мес); стоимость: €1 000 за permit; ВНЖ (Irish Residence Permit): оформить по прилёту в GNIB/INIS в течение 90 дней; Stamp 4 после 2 лет CSEP: автоматически право работать у любого ирландского работодателя; ПМЖ после 5 лет законного пребывания (Long-term Residence); ГРАЖДАНСТВО после 5 лет + 1 год непрерывного пребывания до подачи; НЕТ языкового теста для гражданства Ирландии (уникально в EU!); EU PASSPORT Ирландии = British Isles + EU (Common Travel Area с UK: возможность работать в UK без дополнительных разрешений); ЗАРПЛАТЫ IT ДУБЛИН: Junior SWE: €40 000-60 000/год gross; Middle: €60 000-90 000/год; Senior: €80 000-130 000/год; Staff/Principal: €120 000-200 000/год; Google Senior SWE Dublin: €110 000-160 000/год (base); Meta Senior Dublin: €100 000-150 000/год; Stripe Senior: €100 000-160 000/год; Apple Senior Cork: €85 000-130 000/год; СТОИМОСТЬ ЖИЗНИ ДУБЛИН: Дублин = один из САМЫХ ДОРОГИХ городов EU; аренда 1BR (Dublin D2/D4/D6): €2 000-3 200/мес; (Dublin D1/D7/D8): €1 700-2 500/мес; (Suburbs: Sandyford/Leopardstown/Tallagh): €1 500-2 200/мес; продукты: €400-700/мес; транспорт (Leap Card monthly): €130-160/мес; жизнь итого: €2 700-4 500/мес ($2 950-4 910); ОЧЕНЬ ДОРОГОЙ ГОРОД; ЖИЛИЩНЫЙ КРИЗИС: Дублин страдает от нехватки жилья; очереди; цены растут; Housing Crisis = известная проблема; РАЙОНЫ ДУБЛИНА: D2 (Leeson Street/Baggot; бизнес-центр); D4 (Ballsbridge/Sandymount; embassy row; дорого; FAANG HQ); D6 (Ranelagh/Rathmine; popular expat residential); D7 (Smithfield/Stoneybatter; молодёжный; bohemian; дешевле); D8 (Portobello; rising; cafes); Cork (Apple EMEA; 6 000 чел.; дешевле Дублина на 30-40%).',
    content_md: `# Ирландия и Дублин для IT: Google/Meta/Stripe EMEA, CT 12.5%, гражданство без языкового теста

Дублин — EMEA HQ для Google, Meta, Apple, Microsoft, LinkedIn, Stripe. Critical Skills Employment Permit — 5-15 дней expedited. Гражданство через 5 лет без языкового теста.

## Critical Skills Employment Permit (CSEP)

| Параметр | Значение |
|---------|---------|
| Профессии | Software Engineer, Data Scientist, IT Architect (список enterpriseinfo.ie) |
| Зарплата | ≥€32 000/год gross |
| Подача | Работодатель через DBEI |
| Срок | 5-15 рабочих дней (expedited) |
| Стоимость | €1 000 |
| После 2 лет | Stamp 4 = право на любого работодателя |

---

## Налоги Ирландии

| Налог | Ставка |
|-------|--------|
| Income Tax (до €40 000) | 20% |
| Income Tax (свыше €40 000) | 40% |
| USC (до €22 920) | 0.5-2% |
| USC (свыше €70 044) | 8% |
| PRSI (работник) | 4% |

**Эффективная ставка при €60 000/год:** ~35-40%

**CT (Корпоративный налог):** 12.5% — именно поэтому Google/Apple держат EMEA HQ в Дублине.

---

## EMEA HQ в Дублине

| Компания | Сотрудников | Особенность |
|---------|------------|------------|
| **Google Ireland** | 8 000+ | EU Search/YouTube/Cloud |
| **Meta (Facebook)** | 4 000+ | EU Ads/Policy |
| **Apple** | 6 000+ (Cork) | EMEA Finance HQ |
| **Microsoft EMEA** | 2 000+ | One Microsoft Place |
| **LinkedIn EMEA** | 2 000+ | |
| **Stripe EMEA** | 1 000+ | основан ирландцами; $65B |

---

## Зарплаты IT в Дублине

| Уровень | EUR/год | EUR/мес |
|---------|---------|---------|
| Junior | €40 000-60 000 | €3 330-5 000 |
| Middle | €60 000-90 000 | €5 000-7 500 |
| Senior | €80 000-130 000 | €6 670-10 830 |
| Google Senior | €110 000-160 000 | €9 170-13 330 |
| Stripe Senior | €100 000-160 000 | €8 330-13 330 |

---

## Стоимость жизни в Дублине

| Статья | EUR/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (D4/D2) | 2 000-3 200 | $2 180-3 490 |
| Аренда 1BR (D7/D8) | 1 700-2 500 | $1 855-2 725 |
| Продукты | 400-700 | $435-765 |
| Транспорт (Leap Card) | 130-160 | $142-175 |
| **Итого** | **2 700-4 500** | **$2 950-4 910** |

**Дублин = один из самых дорогих городов EU.** Жилищный кризис — известная проблема.

---

## Гражданство Ирландии: уникальные условия

| Параметр | Значение |
|---------|---------|
| Срок | 5 лет + 1 год непрерывного перед подачей |
| Языковой тест | **Нет** (уникально для EU!) |
| Что даёт | EU паспорт + Common Travel Area с UK |

---

## Итого

Ирландия Дублин IT 2026: CSEP (5-15 дней expedited; €32 000+ gross); Google/Meta/Apple/Stripe EMEA HQ (8 000/4 000/6 000/1 000 чел.); Senior €80 000-130 000/год; CT 12.5%; жизнь €2 700-4 500/мес (очень дорого); гражданство через 5 лет без языкового теста = EU паспорт. Cork = Apple EMEA + дешевле Дублина на 30-40%.
`,
  },
  {
    slug: 'belgiya-bryussel-it-2026',
    title: 'Бельгия и Брюссель для IT в 2026: Single Permit, NATO/EU штаб-квартиры, ING/KBC Tech',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Бельгия Брюссель IT 2026: Single Permit Бельгии (Permis unique / Gecombineerde vergunning; Single Permit = разрешение на работу + ВНЖ в одном документе; через работодателя; подача в регионе (Bruxelles Région / Vlaamse Gewest / Wallonie); региональная квота; срок 3-6 мес рассмотрения; ВНЖ 1 год + renewals; EU Blue Card Бельгии: зарплата ≥ 1.5x средней ≈ €55 000/год gross; высшее образование; 2 года ВНЖ; ПМЖ через 5 лет; гражданство через 5 лет + интеграционный курс + Нидерландский/французский/немецкий B1); НАЛОГИ БЕЛЬГИИ (ОДНИ ИЗ САМЫХ ВЫСОКИХ В EU): НДФЛ (Personenbelasting): 25% до €15 200; 40% €15 201-26 830; 45% €26 831-46 440; 50% свыше €46 440; Social Security работника: 13.07%; Special Social Contribution: до €731/год; Communal Tax: 5-8% от НДФЛ (надбавка коммуны); ИТОГО эффективная ставка: ~50-55% при €80 000/год; EXPAT REGIME BELGIUM (с 2022 новый режим): 30% tax-free lump sum до €90 000/год (заменил старый expat regime); условие: впервые работаешь в Бельгии; зарплата ≥€75 000/год gross; срок: 5 лет без продления; IT-компании Брюсселя: NATO HQ Brussels (гражданские IT-роли; международный персонал; английский рабочий язык; конкурентные зарплаты без налогов (NATO сотрудники налоговые привилегии в Бельгии!)); EU institutions (European Commission/Parliament/Council IT roles; EPSO конкурс; AD/AST категории; TAXUD/DIGIT/CNECT); ING Belgium (ING Group; крупнейший банк; tech hub; 2 000+ IT Bruxelles); KBC Group (bancassurance; KBC Tech & Transformation; 1 000+ IT; HQ Bruxelles/Leuven); Proximus (telecom бывший Belgacom; digital tech 2 000 IT); Base Company (telecom); Microsoft Belgium; Amazon Web Services Belgium; Deloitte Belgium (IT consulting); McKinsey Digital Belgium; Capgemini Belgium (IT outsourcing); SWIFT (Society for Worldwide Interbank Financial Telecommunication; La Hulpe suburb Bruxelles; финансовые сообщения; 4 000 чел.; tax-exempt как SWIFT; международный персонал)',
    seo_description: 'Бельгия Брюссель IT 2026: SINGLE PERMIT (PERMIS UNIQUE): единый документ работа + ВНЖ; работодатель подаёт в регион (Bruxelles Capitale: Bruxelles.irisnet.be; Flandre: werk.be; Wallonie: emploi.wallonie.be); процесс: работодатель → регион → Federal → выдача; срок реально 3-6 мес (Брюссель медленнее Фландрии); EU Blue Card: Blaue Karte EU; зарплата ≥ €54 000-56 000/год gross (обновляется); 2 года + возможность mobility в EU через 18 мес; ВАЖНО: Бельгия = 3 региона (Brussels Capital; Flanders; Wallonia) с РАЗНЫМИ правилами иммиграции; Брюссель = двуязычный (FR+NL); Гент/Антверпен = нидерландский; Льеж/Намюр = французский; EXPAT TAX REGIME БЕЛЬГИИ (с 2022): новый Special Tax Regime for Incoming Taxpayers (RIS); 30% налоговый вычет = освобождение 30% зарплаты от НДФЛ как "cost of living" до max €90 000 зарплаты (т.е. освобождение max €27 000/год); ПЛЮС дополнительные вычеты: €11 250/год travel expenses (если живёшь за пределами Бельгии); итого освобождение до €38 250/год при полном соблюдении; условие: зарплата ≥€75 000/год gross; первый раз работаешь в Бельгии (не был налоговым резидентом последние 60 мес); срок: 5 лет без продления; ЗАРПЛАТЫ IT БРЮССЕЛЬ: Junior Dev: €3 000-4 500/мес gross; Middle: €4 500-6 500/мес; Senior: €6 000-9 000/мес; EU Institution AD5 (entry; ≈ €5 000/мес net без налогов!); NATO civilian IT: €4 000-7 000/мес net (без налогов = огромное преимущество); SWIFT IT: €6 000-10 000/мес gross; ING Senior: €6 500-9 000/мес; СТОИМОСТЬ ЖИЗНИ БРЮССЕЛЬ: аренда 1BR (Ixelles/Saint-Gilles/Etterbeek): €1 000-1 700/мес; (Schaerbeek/Molenbeek): €700-1 200/мес; (центр квартал Sablon/Louise): €1 500-2 500/мес; продукты: €350-600/мес; транспорт (STIB+TEC+De Lijn zonal): €50-80/мес (бесплатен для работников с 2024 в Брюссельском регионе; нулевой тариф для резидентов); жизнь итого: €1 600-2 800/мес ($1 745-3 050); РАЙОНЫ БРЮССЕЛЯ: Ixelles/Elsene (экспатский; посольства; европейский квартал); Saint-Gilles (богемный; affordable; хорошие рестораны); Etterbeek (тихий; EU institutions nearby; семейный); Molenbeek (дешёвый; diverse; improving); EU Quarter (Schuman/Rue de la Loi): EU-бюрократия; рестораны и офисы.',
    content_md: `# Бельгия и Брюссель для IT: NATO/EU, SWIFT, новый Expat Tax Regime

Брюссель — столица EU и NATO. Сотрудники NATO и EU institutions платят нулевые или низкие налоги. SWIFT (4 000 чел.) базируется здесь. Новый Expat Regime с 2022: 30% лампсум-вычет.

## Single Permit Бельгии

| Параметр | Значение |
|---------|---------|
| Название | Permis unique / Gecombineerde vergunning |
| Подаёт | Работодатель в регионе |
| Регионы | Брюссель / Фландрия / Валлония (разные правила!) |
| Срок | 3-6 мес |
| ВНЖ | 1 год + renewals |
| EU Blue Card | Зарплата ≥€54 000/год; 2 года |

---

## Налоги Бельгии

| НДФЛ | Ставка |
|------|--------|
| До €15 200 | 25% |
| €15 201-26 830 | 40% |
| €26 831-46 440 | 45% |
| Свыше €46 440 | **50%** |
| + Social Security работника | 13.07% |
| + Communal Tax | 5-8% от НДФЛ |

**Эффективная ставка при €80 000/год:** ~50-55%.

---

## New Expat Regime (с 2022)

| Параметр | Значение |
|---------|---------|
| Вычет | 30% зарплаты (до €90 000/год = max €27 000/год) |
| Travel expenses | +€11 250/год |
| Условие | Зарплата ≥€75 000/год; не работал в BE последние 5 лет |
| Срок | 5 лет |

---

## Особые работодатели: нулевые налоги

| Работодатель | Налог | Зарплата |
|-------------|-------|---------|
| **NATO civilians** | Нет НДФЛ | €4 000-7 000/мес net |
| **EU institutions** | Пониженный (EU-tax) | AD5 ≈ €5 000/мес net |
| **SWIFT** | Стандартный BE | €6 000-10 000/мес gross |

---

## IT-компании Брюсселя

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **SWIFT** | Financial messaging | 4 000 чел.; La Hulpe |
| **EU Institutions** | IT roles DIGIT/CNECT | Многочисленные |
| **NATO HQ** | Civilian IT | Международный персонал |
| **ING Belgium** | Banking IT | 2 000+ IT |
| **KBC Tech** | Bancassurance | 1 000+ IT |
| **Proximus** | Telecom digital | 2 000 IT |

---

## Зарплаты IT в Брюсселе

| Уровень | EUR/мес gross | EUR/мес net |
|---------|-------------|------------|
| Junior | 3 000-4 500 | 2 000-3 000 |
| Middle | 4 500-6 500 | 2 900-4 100 |
| Senior | 6 000-9 000 | 3 700-5 500 |
| NATO/EU (net, без налогов) | — | 4 000-7 000 |

---

## Стоимость жизни в Брюсселе

| Статья | EUR/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (Ixelles/Saint-Gilles) | 1 000-1 700 | $1 090-1 855 |
| Аренда 1BR (центр) | 1 500-2 500 | $1 635-2 725 |
| Продукты | 350-600 | $380-655 |
| Транспорт | 0-80 (бесплатный для резидентов Брюсселя) | |
| **Итого** | **1 600-2 800** | **$1 745-3 050** |

---

## Итого

Бельгия Брюссель IT 2026: Single Permit (3-6 мес; 1 год ВНЖ); Expat Regime 30% вычет (≥€75 000; 5 лет); НДФЛ 50% при высоком доходе; NATO/EU institutions = нет налогов; SWIFT/ING/KBC/Proximus; Senior €6 000-9 000/мес gross; жизнь €1 600-2 800/мес; Ixelles = лучший район для экспатов. Главный вопрос: NATO/EU job?
`,
  },
  {
    slug: 'avstriya-vena-it-2026',
    title: 'Австрия и Вена для IT в 2026: Red-White-Red Card, A1 Telekom, Vienna Insurance',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Австрия Вена IT 2026: Red-White-Red Card (Rot-Weiss-Rot Karte; основная иммиграционная система Австрии для квалифицированных специалистов; балльная система; категории: Sehr hoch qualifizierte Arbeitnehmer (Very Highly Qualified Workers): балльная оценка; критерии: образование (30 баллов для PhD), опыт (10-20 баллов), возраст (до 40 = max баллы), зарплата (≥ €3 045/мес gross 2024 = достаточно), языки (немецкий/английский), работа в Австрии; нужно 70+ баллов из 100; Fachkraefte (Skilled Workers): для дефицитных профессий (Mangelberuf liste; IT профессии входят); зарплата ≥€2 440/мес gross; Schlüsselkraft в отдельной сфере; срок 1-2 года + renewals; Red-White-Red Plus: работник И семья; ПМЖ Niederlassungsbewilligung через 5 лет; EU Blue Card Австрия: зарплата ≥ 1.5× средней ≈ €50 000/год gross; 2 года; Rot-Weiss-Rot + Card для Austria Residence); НДФЛ Австрии: 0% до €12 816; 20% €12 817-20 818; 30% €20 819-34 513; 40% €34 514-66 612; 48% €66 613-99 266; 50% €99 267-1 000 000; 55% свыше €1 000 000 (Solidaritätszuschlag); Social Insurance работника: ~18.07% (Krankenversicherung 3.87% + Pensionsversicherung 10.25% + Arbeitslosenversicherung 3.15% + Unfallversicherung + andere); работодатель: ~21.23%; 13-й и 14-й зарплаты: в Австрии традиционно выплачивают ноябрь (Weihnachtsgeld) и июнь/июль (Urlaubsgeld) = дополнительные месячные зарплаты; IT-компании Вены: A1 Telekom Austria (крупнейший телеком AT; A1 Digital; HQ Wien; 10 000+ чел.); Vienna Insurance Group (страхование; IT digital; Wien); Erste Group Bank (первый банк AU/CE; IT Hub Wien; 3 000+ IT); Raiffeisen Bank International (RBI; Wien HQ; IT transformation; 2 000+ IT); FACC (aerospace IT; 3 000 чел.; OOe); Kapsch Group (транспортные IT системы; Wien HQ; ITS; ANPR); Siemens Austria (промышленный IT; Wien); Microsoft Austria; SAP Austria; Runtastic (Apple Watch fitness app; Linz; acq. Adidas €220M); Tricentis (тест-автоматизация SaaS; $400M; Wien HQ; Austin US); Dynatrace (APM SaaS; NYSE DT; $13B; HQ Wels Austria!); Greentube (iGaming tech; Novomatic group; Wien); BAWAG P.S.K. tech (банк; Wien)',
    seo_description: 'Австрия Вена IT 2026: RED-WHITE-RED CARD: балльная система для квалифицированных иностранных специалистов; ДВЕ ОСНОВНЫЕ КАТЕГОРИИ ДЛЯ IT: 1. Sehr hoch qualifizierte Arbeitnehmer (Very Highly Qualified): Требования: 70+ баллов из 100; Образование: PhD = 30 баллов; Master/равное = 20; Bachelor = 15; Опыт: 3-5 лет = 10-15 баллов; Возраст: до 30 = 15 баллов; 30-40 = 10; Немецкий: B1 = 5 баллов; A2 = 3; Зарплата ≥ 150% AMS Mindestentgelt = примерно ≥ €3 000/мес gross; Bachelor + 5 лет опыта + немецкий B1 + адекватная зарплата = легко 70+; 2. Fachkraefte im Mangelbereich (Dearth): IT профессии в списке Mangelberufe (списки обновляются; включают Software Developer/IT-Security/Data Engineer); зарплата ≥ €2 440/мес gross (Mindestentgelt 2024); проще получить чем Very Highly Qualified; срок: ВНЖ 1 год; renewals; после 5 лет = Niederlassungsbewilligung ПМЖ; гражданство: 10 лет (или 6 при особых заслугах); австрийское гражданство не допускает двойного гражданства (нужно отказаться от российского); ЗАРПЛАТЫ IT ВЕНА: Junior: €35 000-50 000/год gross; Middle: €50 000-75 000/год; Senior: €70 000-110 000/год; Dynatrace Senior (NYSE компания): €80 000-120 000/год; Tricentis Senior: €75 000-110 000/год; A1 Telekom Senior: €65 000-95 000/год; Erste Group IT Senior: €65 000-100 000/год; 13я+14я зарплаты: +~16.7% к годовому gross (но налогооблагаемы по льготной ставке 6%!); СТОИМОСТЬ ЖИЗНИ ВЕНА: аренда 1BR (Innenstadt 1st district / Wieden 4th / Neubau 7th): €1 000-1 800/мес; (Favoriten 10th / Floridsdorf 21st / Donaustadt 22nd): €750-1 300/мес; продукты: €350-600/мес; транспорт (Wiener Linien Jahreskarte = годовой проездной): €365/год = €30/мес (один из лучших транспортных стоимостей в EU!); жизнь итого: €1 500-2 500/мес ($1 635-2 725); ДЕШЕВЛЕ МЮНХЕНА И ЦЮРИХА НА 20-40%; НЕМЕЦКИЙ ЯЗЫК: для Red-White-Red Very Highly Qualified: A2 (3 балла) или B1 (5 баллов) = опционально но помогает; для Fachkraefte: не требуется строго; рабочий язык в международных tech компаниях (Dynatrace; Tricentis): английский; для жизни в Австрии: немецкий очень нужен (Austrians говорят по-английски меньше чем в Нидерландах; сильный австрийский диалект); до B1: 600-700 часов; РАЙОНЫ ВЕНЫ: Innere Stadt (1. Bezirk): tourist/expensive; Wieden (4.) и Mariahilf (6.): bohemian; affordable; Neubau (7.): hip; restaurants; Landstrasse (3.): Embassy row; Donaustadt (22.): Uno City; DC Tower (Raiffeisen/Deloitte/A1); Favoriten (10.): diverse; affordable; рабочий класс.',
    content_md: `# Австрия и Вена для IT: Red-White-Red Card, Dynatrace $13B, Tricentis

Вена — один из лучших городов EU по качеству жизни (Mercer Quality of Life #1 несколько лет подряд). Dynatrace ($13B, NYSE) — ключевой tech unicorn. Транспортный годовой проездной €365 (€30/мес).

## Red-White-Red Card: балльная система

| Категория | Минимум | Ключевое требование |
|----------|---------|-------------------|
| Very Highly Qualified | 70 баллов из 100 | PhD/Master + опыт + зарплата |
| Fachkraefte (Mangelberufe) | Профессия в списке | ≥€2 440/мес gross |
| EU Blue Card | — | ≥€50 000/год gross |

**Пример набора баллов (Very Highly Qualified):**
- Master = 20 баллов
- 5 лет опыта = 15 баллов
- Возраст до 35 = 15 баллов
- Немецкий B1 = 5 баллов
- Зарплата ≥€3 000/мес = 15 баллов
- **ИТОГО: 70+ = проходит**

---

## Налоги Австрии

| НДФЛ | Ставка |
|------|--------|
| До €12 816 | 0% |
| €12 817-20 818 | 20% |
| €20 819-34 513 | 30% |
| €34 514-66 612 | 40% |
| €66 613-99 266 | 48% |
| Свыше €99 266 | 50-55% |

**Бонус:** 13-я и 14-я зарплаты (Weihnachtsgeld + Urlaubsgeld) облагаются по ставке 6%!

---

## IT-компании Вены и Австрии

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Dynatrace** | APM SaaS | NYSE DT; $13B; HQ Wels, Austria |
| **Tricentis** | Test automation | $400M; Wien HQ |
| **A1 Telekom** | Digital telecom | 10 000+ чел. |
| **Erste Group IT** | Banking | 3 000+ IT; Wien |
| **Raiffeisen Bank IT** | Banking | 2 000+ IT; Wien |
| **Kapsch Group** | Transport IT/ANPR | Wien HQ |

---

## Зарплаты IT в Вене

| Уровень | EUR/год | EUR/год + 13/14 мес |
|---------|---------|---------------------|
| Junior | €35 000-50 000 | €40 000-58 000 |
| Middle | €50 000-75 000 | €58 000-87 000 |
| Senior | €70 000-110 000 | €81 000-128 000 |
| Dynatrace Senior | €80 000-120 000 | €93 000-140 000 |

---

## Стоимость жизни в Вене

| Статья | EUR/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (7./4. Bezirk) | 1 000-1 800 | $1 090-1 965 |
| Аренда 1BR (10./22. Bezirk) | 750-1 300 | $820-1 420 |
| Продукты | 350-600 | $380-655 |
| Транспорт (Jahreskarte) | 30 | $33 |
| **Итого** | **1 500-2 500** | **$1 635-2 725** |

**Годовой проездной Wiener Linien €365** — один из лучших в EU.

---

## Итого

Австрия Вена IT 2026: Red-White-Red Card (70 баллов; Very Highly Qualified — Master + 5 лет + немецкий B1 = проходит); Dynatrace ($13B NYSE)/Tricentis ($400M)/A1 Telekom; Senior €70 000-110 000/год + 13/14 мес зарплаты (6%!); жизнь €1 500-2 500/мес (дешевле Мюнхена); транспорт €30/мес; Mercer #1 качество жизни. Барьер: немецкий нужен для быта + высокие налоги при высоком доходе.
`,
  },
  {
    slug: 'ispaniya-barcelona-IT-autonomo-2026',
    title: 'Испания и Барселона для IT в 2026: Digital Nomad Visa, autonomo, Cabify, Idealista',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Испания Барселона IT 2026: Digital Nomad Visa Испании (Visa para Teletrabajadores de Caracter Internacional; введена 2023 Ley de Startups; для удалённых работников на иностранного работодателя; условия: трудовой договор с иностранным (non-ES) работодателем или клиентами; работа в режиме тeletrabajo (дистанционно); доход ≥ 200% испанского минимума ($25 000+/год); опыт работы ≥ 3 года или диплом; не работал ≥ 12 мес в Испании; срок: visa turista (0-6 мес) → DNV 1 год → продление до 5 лет; семья: супруг/дети включаются; путь к ПМЖ через 5 лет; путь к гражданству через 10 лет; EU Blue Card Испания: зарплата ≥1.5 средней ≈ €35 000-40 000/год gross; для работников с испанским работодателем); BECKHAM LAW (Regimen Especial para Trabajadores Impatriados): специальный налоговый режим для иностранных специалистов приехавших работать в Испанию; flat rate 24% НДФЛ на первые €600 000/год (вместо прогрессивной шкалы до 47%!); срок: 6 лет (год приезда + 5); условие: не был резидентом ES последние 5 лет; подать через Agencia Tributaria в течение 6 мес от приезда (Modelo 149); также доступно для DNV holders (с 2023)!; НДФЛ Испании без Beckham: 19% до €12 450; 24% €12 451-20 200; 30% €20 201-35 200; 37% €35 201-60 000; 45% €60 001-300 000; 47% свыше €300 000; Social Insurance: trabajador 6.35% + autónomo (фрилансер) фиксированный взнос по доходу (sistema de cuotas por tramos; 2023+: €230-500/мес в зависимости от реального дохода); IT-компании Барселоны: Cabify (ridesharing; $1.4B; Madrid HQ + BCN); Idealista (proptech; $1.5B; Madrid+BCN); Wallapop (C2C marketplace; $690M; BCN HQ); Glovo (delivery; $2.3B; BCN HQ; Delivery Hero group); Factorial HR (SaaS HR; $530M unicorn; BCN HQ); Typeform (SaaS forms; $135M; BCN+SF); Carto (geospatial data SaaS; BCN+NYC); Privalia (fashion outlet; Vente-privee group; BCN); SocialPoint (mobile games; Take-Two acq.; BCN); King Barcelona; Amazon BCN Tech Hub; Gartner Barcelona; Microsoft BCN; Contentful Barcelona; Holidu (travel tech; BCN)',
    seo_description: 'Испания Барселона IT 2026: DIGITAL NOMAD VISA (VISA PARA TELETRABAJADORES): введена Ley de Startups 2023; УСЛОВИЯ: работа для иностранного (non-ES) работодателя/клиентов через digital means; доход ≥ 200% испанского SMI (Salario Minimo Interprofesional; SMI 2024 = €1 134/мес x 12 = €13 608/год; 200% = €27 216/год; приблизительно €2 300/мес); минимум работаешь на одного иностранного работодателя (можно иметь дополнительный испанский контракт, но основной = иностранный); опыт ≥3 года в профессии ИЛИ диплом; подача: в испанском Consulado (до въезда) или в Испании через ОТДЕЛЕНИЕ UGE/Oficinas de Extranjeros; срок рассмотрения: 20-30 рабочих дней; Visa DN: turistica 90 дней → подача на ВНЖ в Испании; ВНЖ 1 год + 2 года + 2 года (итого 5 лет) → ПМЖ; BECKHAM LAW (2023 обновление): теперь ДОСТУПНО для DNV holders; ранее только для сотрудников испанских компаний; flat 24% НДФЛ на доходы до €600 000/год; доходы свыше €600 000 = 47%; подать Modelo 149 в течение 6 мес от начала деятельности в ES; 6 лет + год приезда; AUTÓNOMO (испанское ИП): для фрилансеров и DNV holders предпочтительнее через autónomo; регистрация через RETA (Régimen Especial de Trabajadores Autónomos); cuota autónomos: c 2023 = €230-500/мес в зависимости от ожидаемого чистого дохода (прогрессивные квоты по 13 tramos); + 24% НДФЛ или Beckham 24% flat; модуль IRPF для фрилансеров (retenciones); ЗАРПЛАТЫ IT БАРСЕЛОНА: Junior Dev: €25 000-38 000/год gross; Middle: €38 000-60 000/год; Senior: €55 000-90 000/год; Glovo Senior: €65 000-90 000; Factorial Senior: €65 000-85 000; Amazon BCN Senior: €80 000-120 000; Remote for US/EU employer (через autónomo): €60 000-150 000/год; СТОИМОСТЬ ЖИЗНИ БАРСЕЛОНА: аренда 1BR (Gracia/Eixample/Poblenou): €1 000-1 700/мес; (Sants/Sant Andreu/Nou Barris): €700-1 200/мес; продукты: €300-500/мес; транспорт (T-Casual/T-Usual ABB zones): €50-80/мес; жизнь итого: €1 500-2 500/мес ($1 635-2 725); ИСПАНСКИЙ ЯЗЫК: B2 для ПМЖ и гражданства; для жизни необходим; английский в IT-компаниях (особенно iностранных) рабочий язык; до B1 для носителей русского: 700-800 часов (романский; средний барьер; но проще французского); каталанский: Барселона = Каталония; каталанский используется в регионе; для работы и жизни испанский достаточен; РАЙОНЫ БАРСЕЛОНЫ: Eixample (деловой; широкие бульвары; экспаты; Гауди; дорого); Gracia (bohemian; local; restaurants; expat-friendly); Poblenou (tech hub; @22 district; стартапы; coastal); El Born (hipster; пабы; молодёжь); Barceloneta (пляж; туристический).',
    content_md: `# Испания и Барселона для IT: Digital Nomad Visa, Beckham Law 24%, Glovo, Factorial

Испания — Digital Nomad Visa с 2023 плюс Beckham Law (flat 24% на 6 лет). Барселона: Glovo ($2.3B), Factorial ($530M), Amazon Tech Hub. Море, климат, испанский.

## Digital Nomad Visa Испании

| Параметр | Значение |
|---------|---------|
| Введена | 2023 (Ley de Startups) |
| Работодатель | Иностранный (non-ES) |
| Доход | ≥€27 216/год ($2 300+/мес) |
| Опыт | ≥3 года или диплом |
| ВНЖ | 1 год → 2 года → 2 года |
| ПМЖ | Через 5 лет |

---

## Beckham Law: 24% flat на 6 лет

| Параметр | Значение |
|---------|---------|
| Ставка | **24%** до €600 000/год |
| Доступно | DNV holders (с 2023) |
| Срок | 6 лет |
| Условие | Не был резидентом ES последние 5 лет |
| Подать | Modelo 149 в течение 6 мес |

**Vs стандартная шкала:** до 47% при высоком доходе → с Beckham = 24%.

---

## IT-компании Барселоны

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Glovo** | Delivery | $2.3B; BCN HQ |
| **Factorial HR** | SaaS HR | $530M unicorn; BCN HQ |
| **Wallapop** | C2C marketplace | $690M; BCN HQ |
| **Typeform** | SaaS forms | $135M; BCN+SF |
| **Amazon BCN** | Tech Hub | Senior €80-120k/год |
| **King Barcelona** | Mobile games | |

---

## Зарплаты IT в Барселоне

| Уровень | EUR/год | EUR/год (remote для US/EU) |
|---------|---------|--------------------------|
| Junior | €25 000-38 000 | €40 000-60 000 |
| Middle | €38 000-60 000 | €60 000-90 000 |
| Senior | €55 000-90 000 | €80 000-150 000 |

---

## Autónomo: схема для DN

Регистрируешь autónomo (испанское ИП) в RETA:
- **Cuota** с 2023: €230-500/мес (по доходу)
- + Beckham 24% НДФЛ (если подал Modelo 149)
- Итого при €100 000/год: €27 500 налогов + €3 600 cuota = ~31% нагрузка

---

## Стоимость жизни в Барселоне

| Статья | EUR/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (Gracia/Eixample) | 1 000-1 700 | $1 090-1 855 |
| Аренда 1BR (Sants/Nou Barris) | 700-1 200 | $765-1 310 |
| Продукты | 300-500 | $325-545 |
| Транспорт | 50-80 | $55-87 |
| **Итого** | **1 500-2 500** | **$1 635-2 725** |

---

## Районы Барселоны

| Район | Характер |
|-------|---------|
| **Poblenou (@22)** | Tech hub; стартапы; coastal |
| **Gracia** | Local bohemian; рестораны |
| **Eixample** | Деловой; экспаты; дороже |
| **El Born** | Hipster; молодёжь |

---

## Итого

Испания Барселона IT 2026: Digital Nomad Visa (€27k/год; иностранный работодатель; 5 лет → ПМЖ); Beckham Law 24% flat 6 лет (подать Modelo 149 в 6 мес); Glovo/Factorial/Wallapop; autónomo €230-500/мес cuota; жизнь €1 500-2 500/мес; Poblenou = tech hub. Испанский B2 для ПМЖ; Beckham = главное преимущество для remote Senior с высоким доходом.
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
console.log(`\nБатч 187: ${ok} OK, ${err} ошибок`);
