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
    title: 'Литва и Вильнюс для IT в 2026: Startup Visa, Revolut HQ, налоговые стимулы',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Литва Вильнюс IT 2026: Startup Visa Литвы (Lithuania Startup Visa; для основателей стартапов; выдаётся Lithuanian Startup Association (Startup Lithuania) при одобрении; срок 1 год + renewals; требования: инновационный бизнес-план; рекомендательное письмо от аккредитованного партнёра; наличие офиса/команды в Литве; поддержка: менторинг; государственные субсидии; эко-система; IT Work Permit: обычный рабочий ВНЖ через работодателя; через Lithuanian Migration Department; срок 30-60 дней; 1-2 года; ПМЖ через 5 лет; EU Blue Card Lithuania: зарплата ≥ 1.5× средней); НАЛОГИ ЛИТВЫ: НДФЛ Литвы: 20% до €90 246/год; 32% выше €90 246; Social Insurance (SoDra): работник 12.52% + работодатель 2.49%; Health Insurance работника: 6.98% (VPD + PSD); GPM (налог на доходы): стандартный вычет для малого дохода; ИТОГО нагрузка на работника: ~33% при среднем доходе; IT Privileged Regime: нет специальной IT-льготы как в Румынии; но ставка 20% более конкурентоспособна чем в западной EU; IT-компании Вильнюса: Revolut (fintech unicorn; $33B; Global HQ Лондон но EU-лицензия Вильнюс; Lithuania HQ для EU banking operations; 800+ чел. в Вильнюсе + 10 000+ global; самый известный работодатель Вильнюса IT); Western Union Technology Center Vilnius; Nordea (Nordic bank; IT Center Vilnius; 500+ чел.); TransferGo; Oxylabs (web scraping proxy; $100M+; Вильнюс); NordSecurity (Nord VPN; $1.6B; Вильнюс); Tesonet (NordVPN parent; tech group); Whatagraph (analytics SaaS); Trafi (mobility platform; Вильнюс → global); Devbridge (software engineering; acq. Cognizant); Girteka Logistics (logistics tech; biggest truck company in EU; Вильнюс; tech IT для флота); Vinted (fashion re-sale; $5B unicorn; Вильнюс HQ!) = крупнейший unicorn Балтии',
    seo_description: 'Литва Вильнюс IT 2026: СТАРТАП-ЭКОСИСТЕМА: Вильнюс — крупнейший tech hub Балтии; 5 unicorn-ов (Revolut EU, Vinted $5B, NordVPN $1.6B, Tesonet, TransferGo); больше unicorn-ов на душу населения чем в большинстве EU стран; государственная поддержка стартапов: Lithuanian Innovation Center; Invest Lithuania; EU Horizon программы; Startup Visa Lithuania: одна из первых в EU startup visa; для основателей нероссийских/неевропейских проектов; получить одобрение Startup Lithuania; НАЛОГИ ЛИТВЫ: GPM (Gyventojų pajamų mokestis) = НДФЛ: 20% до €90 246/год; 32% свыше; Social Contributions: SODRA + VPD: работник 19.5% (пенсионное + медицина + безработица); работодатель 2.49%; ИП-литва (Individuali Imone; аналог ИП): НДФЛ 15% с прибыли (при определённых условиях); MB (Maza Bendrija = партнёрство с ограниченной ответственностью): используют фрилансеры; НДФЛ 15% / социальное пониженное; UAB (ООО): CT 15% (стандарт); 5% для малого бизнеса с доходом до €300 000 (если ≤10 сотрудников); ЗАРПЛАТЫ IT ВИЛЬНЮС: Junior Dev: €1 500-2 500/мес gross; Middle: €2 500-4 000/мес; Senior: €3 500-6 000/мес; Revolut Senior SWE: €5 000-8 000/мес; Vinted Senior: €4 000-7 000; NordVPN Senior: €4 000-6 500; СТОИМОСТЬ ЖИЗНИ ВИЛЬНЮС: аренда 1BR (Senamiestis/Uzupis/Zirmunai): €600-1 000/мес; (Pasilaiciai/Lazdynai): €450-750/мес; продукты: €250-450/мес; транспорт (Vilniaus Viesasis Transportas monthly): €30/мес; жизнь итого: €1 000-1 700/мес ($1 090-1 850); ДЕШЕВЛЕ ЧЕМ ВАРШАВА ПРИ СРАВНИМОЙ ЗАРПЛАТЕ; ЛИТОВСКИЙ ЯЗЫК: индоевропейский балтийский (самый архаичный живой язык EU; близок к санскриту); сложный; для носителей русского НЕ близкий; до B1: 700-900 часов; рабочий язык в tech компаниях (Revolut/Vinted): АНГЛИЙСКИЙ; ВНЖ через работодателя: 30-60 дней; годовой + продление; ПМЖ 5 лет; гражданство 10 лет; РАЙОНЫ ВИЛЬНЮСА: Senamiestis (Старый город; ЮНЕСКО; рестораны; дорого); Uzupis (художественный квартал; Bohemian Republic; expat-favourite); Zirmunai (спальный; удобный); Sauletekis (университетский район; молодёжный); Pasilaiciai (дешёвый; от центра далеко).',
    content_md: `# Литва и Вильнюс для IT: Revolut, Vinted $5B, NordVPN

Вильнюс — крупнейший tech hub Балтии. Revolut EU banking HQ, Vinted ($5B — крупнейший unicorn Балтии), NordVPN ($1.6B). CT для малого бизнеса 5% (UAB до €300k).

## Startup Visa Литвы

| Параметр | Значение |
|---------|---------|
| Орган | Lithuanian Startup Association |
| Требование | Инновационный бизнес + рекомендация |
| Срок | 1 год + renewals |
| Поддержка | Менторинг + EU Horizon гранты |

---

## Налоги Литвы

| Налог | Ставка |
|-------|--------|
| GPM НДФЛ (до €90 246/год) | **20%** |
| GPM НДФЛ (свыше) | 32% |
| Social (работник) | 19.5% |
| CT для UAB (ООО) | **15%** |
| CT малый бизнес (до €300k, ≤10 чел.) | **5%** |

---

## IT-компании Вильнюса

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Revolut** | Fintech EU HQ | $33B unicorn; 800+ в Вильнюсе |
| **Vinted** | Fashion re-sale | $5B unicorn; Вильнюс HQ |
| **NordVPN** | VPN (NordSecurity) | $1.6B; Вильнюс |
| **Oxylabs** | Web proxy | $100M+; Вильнюс |
| **Western Union Tech** | Fintech | 500+ чел. |
| **Nordea IT Center** | Banking IT | 500+ чел. |

---

## Зарплаты IT в Вильнюсе

| Уровень | EUR/мес | USD/мес |
|---------|---------|---------|
| Junior | €1 500-2 500 | $1 635-2 725 |
| Middle | €2 500-4 000 | $2 725-4 360 |
| Senior | €3 500-6 000 | $3 815-6 540 |
| Revolut Senior | €5 000-8 000 | $5 450-8 720 |
| Vinted Senior | €4 000-7 000 | $4 360-7 630 |

---

## Стоимость жизни в Вильнюсе

| Статья | EUR/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (центр/Uzupis) | 600-1 000 | $655-1 090 |
| Аренда 1BR (спальные р-ны) | 450-750 | $490-820 |
| Продукты | 250-450 | $273-490 |
| Транспорт (monthly pass) | 30 | $33 |
| **Итого** | **1 000-1 700** | **$1 090-1 850** |

---

## Районы Вильнюса

| Район | Характер |
|-------|---------|
| **Uzupis** | Bohemian; expat-favourite; арт |
| **Senamiestis** | Старый город ЮНЕСКО; дорого |
| **Zirmunai** | Удобный; спальный |
| **Sauletekis** | Университетский; молодёжный |

---

## Итого

Литва Вильнюс IT 2026: Startup Visa через Lithuanian Startup Association; CT 5% для UAB до €300k/год; Revolut EU HQ ($33B) / Vinted ($5B) / NordVPN ($1.6B); Senior $3 815-8 720/мес; жизнь $1 090-1 850/мес (дешевле Варшавы); ВНЖ через работодателя 30-60 дней; Uzupis = лучший район для экспатов. Рабочий язык Revolut/Vinted = английский.
`,
  },
  {
    slug: 'franciya-parizh-it-french-tech-visa-2026',
    title: 'Франция и Париж для IT в 2026: French Tech Visa, BlaBlaCar, Criteo, Doctolib',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Франция Париж IT 2026: French Tech Visa (French Tech Visa; официальная программа для IT-специалистов; 2 типа: Employee Visa (Passeport Talent Salarié Qualifié) и Founder Visa (Passeport Talent Porteur de Projet); Employee: contract ≥ €35 001/год gross; Bac+3 или 5 лет опыта в IT; работодатель = recognized tech company; срок ВНЖ 4 года сразу (Multi-annual residence permit); без ждать 1 год как стандартный ВНЖ; French Tech Founder Visa: инновационный проект; инкубатор или государственная/региональная поддержка; поддержка BPI France/Station F; Station F (крупнейший стартап-кампус в мире; Paris 13e; 30 000 кв.м; 1 000+ стартапов; программы FABERNOVEL/Facebook/LVMH/BNP/ Microsoft/Thales; офис €195-650/мес в зависимости от программы); EU Blue Card France: зарплата ≥1.5 средней; 1-3 мес рассмотрения); НДФЛ Франции: прогрессивный: 0% до €10 777; 11% €10 778-27 478; 30% €27 479-78 570; 41% €78 571-168 994; 45% свыше €168 994; Contribution Sociale Généralisée (CSG) 9.7%+; prélèvement de solidarité 7.5%; Social Insurance (cotisations sociales): работник ~22-25%; работодатель ~40-45% (!) от gross; ИТОГО: нагрузка на работодателя ОЧЕНЬ высокая; IMPATRIATES REGIME: 50% освобождение от НДФЛ для иностранных специалистов впервые приезжающих на работу во Франции; срок: до 8 лет; условие: не быть резидентом Франции 5 лет до приезда; сумма зарплаты: обычно выгодно при зарплате €100 000+; IT-компании Парижа: BlaBlaCar (ridesharing; $1.5B; Paris HQ; IPO готовится); Criteo (ad tech; NASDAQ CRTO; $3B; Paris HQ; 3 000+ чел.); Doctolib (healthtech; $6.7B unicorn; Paris/Berlin; booking medical appointments); Deezer (music streaming; NASDAQ DEEZR; Paris HQ); Vestiaire Collective (fashion resale; $1.7B; Paris); Mirakl (marketplace platform; $3.5B unicorn; Paris); Swile (fintech HR; $1B; Paris); Dataiku (data science platform; $3.7B; NYC+Paris HQ); ManoMano (home improvement e-com; €2.6B; Paris); Qonto (fintech SME banking; $5B; Paris); Alan (health insurance; $2.7B; Paris); Contentsquare (digital analytics; $3.7B; Paris)',
    seo_description: 'Франция Париж IT 2026: FRENCH TECH VISA (PASSEPORT TALENT): самый популярный путь для IT-специалистов; Employee (Salarie Qualifie): требования: зарплата ≥€35 001/год gross; диплом Bac+3 (3 года после bac) ИЛИ 5 лет опыта в IT-профессии; трудовой договор с французской компанией; ВНЖ: 4 года сразу (Carte de Séjour Pluriannuelle); значительно быстрее стандартного пути; без квоты; обращаться в OFII; семья: партнёр и дети получают сопровождающий ВНЖ; French Tech Founder Visa: инновационный проект + подтверждение от публичного инкубатора (Business France/BPI/регион) или частного инкубатора из списка; Station F как основной хаб; ПМЖ: 5 лет; ГРАЖДАНСТВО: 5 лет (НДФЛ должно быть задекларировано); французский B2/C1 для натурализации; НАЛОГИ ФРАНЦИИ: СЛОЖНАЯ СИСТЕМА; для иностранного employee на Senior позиции ($150 000+) лучше использовать IMPATRIATES REGIME: 50% налоговое освобождение на 8 лет; пример: зарплата €150 000/год; НДФЛ без режима: ~€55 000; с режимом: налог только с €75 000 = ~€24 000; экономия €31 000/год; условие: не быть резидентом Франции последние 5 лет; ЗАРПЛАТЫ IT ПАРИЖ: Junior Dev: €35 000-50 000/год gross; Middle: €50 000-75 000/год; Senior: €70 000-120 000/год; Staff/Principal: €100 000-160 000/год; Doctolib Senior: €80 000-110 000/год; Qonto Senior: €80 000-120 000/год; BlaBlaCar Senior: €80 000-110 000/год; Criteo Senior: €85 000-130 000/год; СТОИМОСТЬ ЖИЗНИ ПАРИЖ: аренда 1BR (Marais/St-Germain/Opera): €1 500-2 500/мес; (Montmartre/Belleville/République): €1 200-2 000/мес; (Banlieue близкая: Vincennes/Montreuil/Bagnolet): €900-1 500/мес; продукты: €400-700/мес; транспорт (Navigo Mois): €86/мес (Zones 1-5 покрывает весь регион IDF); жизнь итого: €2 200-4 000/мес ($2 400-4 360); GRAND PARIS EXPRESS: строится новое метро (к 2030; 200 км новых линий); ПАРИЖСКИЕ РАЙОНЫ: Marais (4e/3e): touristy; Jewish quarter; gay area; startup offices; République (10e/11e): молодёжный; tech offices; cafes; Pigalle/Montmartre (18e): bohemian; менее туристический чем кажется; Bastille (11e/12e): expat-friendly; Station F (13e): стартапы; новый Berlin Bridge (Belleville 20e/19e): бюджетный; зарождающийся; ФРАНЦУЗСКИЙ ЯЗЫК: рабочий в БОЛЬШИНСТВЕ французских компаний (даже если офис принимает CV на EN); French Tech visa позволяет работать без французского; для жизни: B1-B2 рекомендуется; до B1: 700-800 часов (для носителей русского; романский; средний барьер).',
    content_md: `# Франция и Париж для IT: French Tech Visa, BlaBlaCar, Doctolib, Qonto

Франция — второй по величине стартап-рынок EU после Великобритании. 25 tech unicorn-ов. Impatriates Regime: 50% освобождение от НДФЛ на 8 лет для новых резидентов.

## French Tech Visa (Passeport Talent)

| Тип | Требования | ВНЖ |
|-----|-----------|-----|
| **Employee** | Зарплата ≥€35 001/год + диплом Bac+3 или 5 лет опыта | 4 года сразу |
| **Founder** | Инновационный проект + инкубатор из списка | 4 года |

**Семья:** партнёр и дети получают сопровождающий ВНЖ одновременно.

---

## Impatriates Regime: 50% налоговое освобождение

| Параметр | Значение |
|---------|---------|
| Освобождение | 50% дохода от НДФЛ |
| Срок | До 8 лет |
| Условие | Не быть резидентом Франции последние 5 лет |

**Пример (€150 000/год):**

| | Без режима | С Impatriates Regime |
|--|-----------|---------------------|
| НДФЛ | ~€55 000 | ~€24 000 |
| Экономия | | €31 000/год |

---

## IT-компании Парижа

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Doctolib** | Healthtech | $6.7B unicorn |
| **Qonto** | SME banking | $5B unicorn |
| **Contentsquare** | Digital analytics | $3.7B unicorn |
| **Dataiku** | Data science | $3.7B unicorn |
| **BlaBlaCar** | Ridesharing | $1.5B |
| **Criteo** | Ad tech | NASDAQ $3B; 3 000 чел. |
| **Mirakl** | Marketplace | $3.5B unicorn |

---

## Station F: крупнейший стартап-кампус

30 000 кв.м в 13e. 1 000+ стартапов. Программы LVMH/Facebook/Microsoft/BNP. Офисы от €195/мес.

---

## Зарплаты IT в Париже

| Уровень | EUR/год | EUR/мес |
|---------|---------|---------|
| Junior | €35 000-50 000 | €2 920-4 170 |
| Middle | €50 000-75 000 | €4 170-6 250 |
| Senior | €70 000-120 000 | €5 830-10 000 |
| Criteo Senior | €85 000-130 000 | €7 080-10 830 |

---

## Стоимость жизни в Париже

| Статья | EUR/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (Marais/Bastille) | 1 500-2 500 | $1 635-2 725 |
| Аренда 1BR (пригород) | 900-1 500 | $980-1 635 |
| Продукты | 400-700 | $435-765 |
| Транспорт (Navigo Zones 1-5) | 86 | $94 |
| **Итого** | **2 200-4 000** | **$2 400-4 360** |

---

## Итого

Франция Париж IT 2026: French Tech Visa Salarié Qualifié (€35 001+ gross; Bac+3; 4-летний ВНЖ сразу); Impatriates Regime 50% освобождение 8 лет (для Senior €150k+ экономия €31k/год); Doctolib/Qonto/Contentsquare/Criteo; Senior €70 000-120 000/год; жизнь €2 200-4 000/мес; Station F (крупнейший стартап-кампус). Барьер: высокие налоги (без Impatriates) + французский язык.
`,
  },
  {
    slug: 'kolumbiya-bogota-medellin-it-2026',
    title: 'Колумбия и Медельин для IT в 2026: Digital Nomad Visa, Rappi, Bancolombia Tech',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Колумбия Медельин Богота IT 2026: Digital Nomad Visa Колумбии (Digital Nomad Visa Colombia; официальная visa V para Nomadas Digitales; введена 2022; доход ≥ 3x Colombian Minimum Wage в мес ($723 USD x 3 = $2 169/мес в 2024); работаешь для иностранного работодателя/клиентов; подавать в Consulado Colombia или онлайн через Cancilleria; срок 2 года без продления (но можно выехать и въехать); ВНЖ (для долгосрочного пребывания и ПМЖ): Visa de Residente через 5 лет или инвестиции $90 000 USD); НАЛОГИ КОЛУМБИИ: для нерезидента (до 183 дней в году): только на колумбийские доходы (foreign income 0% если нерезидент); НДФЛ для резидента: 0% до COP 44 603 400/год ($11 000); 19% $11 000-27 000/год; 28% $27 000-72 000; 33% $72 000-120 000; 35% свыше $120 000; Social Insurance для колумбийских работников: EPS (health) 4% работник + 8.5% работодатель; фонды пенсии 4% работник + 12% работодатель; IT-компании Колумбии: Rappi (super-app; delivery/fintech; $5.25B unicorn; Bogota HQ; основан колумбийцами; SoftBank инвестировал; 10 000+ чел.; операции в 9 странах LatAm); Bancolombia (крупнейший банк Колумбии; digital banking tech; 3 000+ IT сотрудников); Grupo Éxito (retail; tech digital); Carvajal (printing/digital; Cali); Endava Colombia (IT services; Bogota); Globant Colombia (IT nearshore; Medellin); Slalom Colombia; Softwareone Colombia; MercadoLibre Colombia (Bogota office); Lumu Technologies (cybersec; $8M; Bogota); Habi (proptech; $200M; Bogota); Addi (BNPL fintech; $200M; Bogota); Cuanto (fintech); Truora (identity verification; Miami/Bogota); МЕДЕЛЬИН: второй по величине город Колумбии; трансформация: из самого опасного города мира в 90-х → tech hub 2010+; El Poblado (самый popular у экспатов; рестораны; бары; Airbnb); Laureles (local; спокойный; хороший); Envigado (пригород; мощная expat community; дешевле El Poblado; безопасный); Estadio (рабочий класс; аутентичный; дешёвый); БОГОТА: столица; деловой центр; Chapinero (студенческий + expat); Zona Rosa (деловой + рестораны); POPSIKE (la 85-92 calle; tech offices)',
    seo_description: 'Колумбия Медельин Богота IT 2026: DIGITAL NOMAD VISA: официальная Visa V para Nomadas Digitales (DNV); введена июнь 2022; условия: доход ≥ 3x SMLV (Salario Minimo Legal Vigente; в 2024 = COP 1 300 000/мес = $323; нужно ≥ $969 = приблизительно $1 000/мес от иностранного источника; нет данных об точном USD эквиваленте — официально 3× SMLV); работа для иностранного работодателя или иностранных клиентов; подача: онлайн через cancilleria.gov.co ИЛИ в Consulado Colombia; документы: паспорт + банковские выписки + трудовой контракт/договор с клиентами; срок ВНЖ: 2 года (без продления того же типа; после 2 лет выехать и подать снова или другой тип визы); Visa M (turista) если просто отдыхаешь: 90-180 дней (безвиза для россиян!); БЕЗВИЗОВЫЙ ВЪЕЗД ДЛЯ РОССИЯН: Колумбия = 90 дней безвиза для граждан РФ (в 2024 был расширен в ряде стран LatAm; проверять актуально); НАЛОГИ ДЛЯ DIGITAL NOMAD (нерезидент/краткосрочный пребывающий): если ты нерезидент Колумбии (пробыл менее 183 дней за налоговый год) = налог только с колумбийских источников дохода; если твой работодатель/клиенты иностранные = 0% НДФЛ Колумбии; стандарт для DN: работаешь 2 года по DN Visa = если проводишь <183 дней в году = нерезидент = 0% налогов; ЗАРПЛАТЫ IT МЕДЕЛЬИН/БОГОТА: Junior Dev: $1 000-2 000 USD/мес (очень мало vs EU; но local cost of living низкая); Middle: $2 000-4 000 USD/мес; Senior (Colombia-based): $3 000-6 000 USD/мес; Senior (remote для US/EU employer): $5 000-12 000 USD/мес (рынок US remote payments; Rappi Senior: $4 000-8 000; Globant Senior nearshore: $5 000-9 000; СТОИМОСТЬ ЖИЗНИ МЕДЕЛЬИН: аренда 1BR (El Poblado): $500-900 USD/мес; (Laureles): $350-700; (Envigado): $350-600; продукты: $150-300 USD/мес; транспорт (Metro + Cable): $40-80/мес; жизнь итого: $800-1 500 USD/мес; БЕЗОПАСНОСТЬ 2024: Медельин трансформировался; El Poblado и Laureles = безопасные districts для экспатов; Barrios популярные у backpackers (Prado/Aranjuez): осторожность; ночью избегать одиноких улиц; всё быстро меняется; актуальность: проверяй FB Medellin Expats группу; КЛИМАТ МЕДЕЛЬИН: вечная весна (+22-26°C круглый год); 1 495 метров над уровнем моря; 2 дождливых сезона (апрель-май; октябрь-ноябрь); ИСПАНСКИЙ КОЛУМБИЙСКИЙ: нейтральный испанский; чёткое произношение; без сильного акцента (в Боготе); рекомендуется для изучения испанского.',
    content_md: `# Колумбия и Медельин для IT: Вечная весна, Rappi $5B, 0% налогов для нерезидентов

Медельин — "вечная весна" +23°C круглый год. Rappi ($5.25B) — крупнейший unicorn LatAm после Mercado Libre. Digital Nomad Visa на 2 года. Нерезиденты платят 0% налогов с иностранных доходов.

## Digital Nomad Visa Колумбии

| Параметр | Значение |
|---------|---------|
| Введена | 2022 |
| Доход | ≥ 3× SMLV от иностранного источника |
| Работодатель | Иностранный (не колумбийский) |
| ВНЖ | 2 года |
| Подача | Онлайн cancilleria.gov.co или в Консульстве |

**Россияне:** 90 дней безвиза (проверяй актуально).

---

## Налоги для digital nomad

| Ситуация | НДФЛ |
|---------|------|
| Нерезидент (<183 дней) + иностранный доход | **0%** |
| Резидент (≥183 дней) + иностранный доход | 19-35% |

Большинство DN-ов проводят <183 дней — платят 0%.

---

## IT-компании Колумбии

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Rappi** | Super-app/delivery | $5.25B unicorn; 10 000+ чел. |
| **Bancolombia Tech** | Banking IT | 3 000+ IT |
| **Globant Colombia** | IT nearshore | Medellin office |
| **Habi** | Proptech | $200M; Bogota |
| **Addi** | BNPL | $200M; Bogota |
| **MercadoLibre Colombia** | E-com | Bogota office |

---

## Зарплаты: local vs remote

| Уровень | Local USD/мес | Remote for US/EU USD/мес |
|---------|-------------|--------------------------|
| Junior | $1 000-2 000 | $3 000-5 000 |
| Middle | $2 000-4 000 | $5 000-8 000 |
| Senior | $3 000-6 000 | $7 000-12 000 |

Remote для US/EU-клиентов = ключевой вектор.

---

## Стоимость жизни в Медельине

| Статья | USD/мес |
|--------|---------|
| Аренда 1BR (El Poblado) | $500-900 |
| Аренда 1BR (Laureles/Envigado) | $350-700 |
| Продукты | $150-300 |
| Транспорт (Metro) | $40-80 |
| **Итого** | **$800-1 500** |

---

## Лучшие районы Медельина

| Район | Характер |
|-------|---------|
| **El Poblado** | Самый expat-популярный; рестораны; дороже |
| **Laureles** | Local; спокойный; чуть дешевле |
| **Envigado** | Пригород; мощная expat community; безопасный |
| **Estadio** | Аутентичный; дешёвый |

---

## Климат Медельина

| Параметр | Значение |
|---------|---------|
| Среднегодовая | +22-26°C |
| Прозвище | "Вечная весна" |
| Высота | 1 495 м над уровнем моря |
| Дождливые сезоны | Апрель-май; октябрь-ноябрь |

---

## Итого

Колумбия Медельин Богота IT 2026: DN Visa 2 года (3× SMLV иностранного дохода); нерезиденты = 0% с иностранного дохода; Rappi $5.25B/Globant nearshore; remote для US/EU $7 000-12 000/мес Senior; жизнь $800-1 500/мес; El Poblado = expat hub; вечная весна +23°C. Отличный вариант для remote-специалистов с US/EU клиентами.
`,
  },
  {
    slug: 'kak-nayti-rabotu-v-europe-linkedin-2026',
    title: 'Как найти работу в Европе через LinkedIn в 2026: стратегия, оффер, релокейшн-пакет',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Как найти работу в Европе LinkedIn 2026 стратегия: LINKEDIN-СТРАТЕГИЯ ДЛЯ EU JOB SEARCH: профиль (Profile Optimization): заголовок (Headline) включает ключевые слова (Senior Backend Engineer | Python | 7 YOE); About раздел: 3-5 предложений о твоём опыте + что ищешь + location preference; Experience: детальные описания на АНГЛИЙСКОМ; Skills: обязательно заполнить (алгоритм LinkedIn даёт visibility); Open to Work (включи; выбери EU-локации которые рассматриваешь); ПОИСК ВАКАНСИЙ: фильтры: Location = конкретные города (Berlin/Amsterdam/Warsaw); On-site/Hybrid (многие EU-работодатели хотят видеть в офисе); Job Type = Full-time; Industry = Software/IT; Salary Range (включай если знаешь рынок); Easy Apply vs Apply on Company Site = Easy Apply быстрее; OUTREACH: cold InMail работодателям; hiring manager/recruiter (не HR); сообщение: 3-5 предложений; конкретный навык + интерес к компании + призыв; acceptence rate cold InMail: 20-30% ответов; RECRUITER CONNECTIONS: коннектиться с рекрутерами в целевых компаниях (найди через LinkedIn People Search; Company > People > Search по должности Recruiter/Talent Acquisition); ДРУГИЕ ПЛАТФОРМЫ: Wellfound (Angel.co; стартапы; EU и US); Otta.com (лучший UK/EU aggregator; jobs.lever.co интеграция); Relocate.me (агрегатор вакансий с релокейшн-пакетом; удобно для visual); Glassdoor EU (reviews + vacancies); Xing (Германия/Австрия/Швейцария; аналог LinkedIn для DACH рынка); Indeed EU (Германия/Франция/UK крупные рынки); Berlin.Startup.Jobs; StepStone.de; Jobsinnetwork.com (IT Польша); Pracuj.pl (Польша); Erply (Эстония IT); Jobs.dou.ua (по традиции используют и экспаты из бывшего СССР); CV.ee (Эстония/Латвия); Prace.cz (Чехия)',
    seo_description: 'Как найти работу в Европе через LinkedIn 2026: ПОШАГОВАЯ СТРАТЕГИЯ: ШАГ 1: ОПТИМИЗАЦИЯ ПРОФИЛЯ: Headline: Senior Backend Engineer | Python | Open to EU Relocation; Photo: профессиональная; About: 3-5 предложений включая where you are + what you seek; Skills: 15-20 навыков (Python/AWS/React/System Design/etc.); Languages: English (Professional), Russian (Native); Open to Work: включи; выбери EU города; ШАГ 2: NETWORKING: 100-200 коннекций в TARGET COMPANIES за 2-4 нед; кому коннектиться: Engineers (узнать о культуре); Recruiters/Talent Acquisition (получить инсайд и направление); Engineering Managers (будущий boss); как коннектиться: персонализированная заметка (не дефолтная); упоминай: общие интересы / твой навык / почему именно эта компания; ШАГ 3: ТАРГЕТИРОВАННЫЕ ЗАЯВКИ: составь список 30-50 компаний в EU (wishlist); расставь приоритет по: зарплатным ожиданиям / visasponsorship / interesting product; подавай на 5-10 вакансий в день; отслеживай в spreadsheet; ШАГ 4: ПОДГОТОВКА К ИНТЕРВЬЮ: EU Tech Interview стандарт: Coding Round (Leetcode Medium-Hard; 45-60 мин; CoderPad/HackerRank); System Design (масштабируемые системы; 45-60 мин; Excalidraw); Behavioral (STAR метод; 30-45 мин; AWS/Google Leadership Principles аналоги); Final Round with Engineering Manager; EU companies (в отличие от US FAANG) реже используют очень hard Leetcode; фокус на практических задачах и system design; ШАГ 5: NEGOTIATION (переговоры о зарплате): EU нормы: называй верхний предел диапазона (не median); ссылайся на рыночные данные (Glassdoor/Levels.fyi/LinkedIn Salary Insights); не первым называй цифру; спрашивай о total comp (RSU есть не везде в EU); RELOCATION PACKAGE: стандартный EU relocation package: перелёт (1 раз; family = бизнес класс у крупных; эконом у маленьких); временное жильё (обычно 2-4 нед в отеле/апартаменте); lump sum для переезда ($2 000-10 000 в зависимости от компании; Google/Amazon/Meta: €5 000-15 000; стартапы: €1 000-3 000); помощь с визой (Visa assistance; юрист оплачивает работодатель); language classes (не все, но крупные дают); ВАЖНО: relocation package = переговорный пункт; просить можно всегда; худшее что скажут = нет.',
    content_md: `# Как найти работу в Европе через LinkedIn в 2026

Основные шаги: оптимизированный профиль → 100-200 коннекций в целевых компаниях → 5-10 заявок в день → интервью подготовка → переговоры о релокейшн-пакете.

---

## LinkedIn-профиль: что оптимизировать

| Элемент | Как |
|---------|-----|
| **Headline** | Senior Backend Engineer + Python + Open to EU Relocation |
| **About** | 3-5 предложений: опыт + что ищешь + предпочтительные города |
| **Skills** | 15-20 навыков (алгоритм даёт visibility) |
| **Open to Work** | Включить; выбрать EU-города |
| **Languages** | English Professional + Russian Native |

---

## Где искать вакансии

| Платформа | Фокус |
|-----------|-------|
| **LinkedIn Jobs** | Универсальный; EU |
| **Wellfound (Angel.co)** | Стартапы EU/US |
| **Otta.com** | UK + EU; лучший агрегатор |
| **Relocate.me** | Вакансии с релокейшн-пакетом |
| **StepStone.de** | Германия |
| **Xing** | DACH рынок (DE/AT/CH) |
| **Pracuj.pl** | Польша |
| **Jobs.dou.ua** | EU IT вакансии (используют и экспаты) |

---

## Стратегия нетворкинга

| Кому коннектиться | Как |
|------------------|-----|
| Recruiters/Talent Acquisition | Персонализированная заметка; просить направить резюме |
| Engineers | Узнать о культуре; спросить о проекте |
| Engineering Managers | Будущий boss; выразить интерес к команде |

**Cold InMail:** 3-5 предложений → конкретный навык + почему эта компания + CTA. Acceptance rate: 20-30%.

---

## EU Tech Interview: что ожидать

| Раунд | Формат | Время |
|-------|--------|-------|
| Coding | Leetcode Medium-Hard (CoderPad) | 45-60 мин |
| System Design | Excalidraw; масштабируемые системы | 45-60 мин |
| Behavioral | STAR метод; culture fit | 30-45 мин |
| Engineering Manager | Motivation + team fit | 30-45 мин |

EU-компании реже требуют очень hard Leetcode vs US FAANG.

---

## Relocation Package: что просить

| Компонент | Стартап | Крупная EU | Google/Amazon/Meta |
|----------|---------|-----------|-------------------|
| Перелёт | 1 × Economy | 1 × Economy/Business | Business для семьи |
| Временное жильё | 1-2 нед | 2-4 нед | 4 нед |
| Lump sum | €1 000-3 000 | €3 000-8 000 | €5 000-15 000 |
| Visa help | Нет/частично | Да | Да (юрист) |
| Language classes | Нет | Иногда | Иногда |

**Relocation — переговорный пункт.** Просить можно всегда.

---

## Переговоры о зарплате

1. Называй верхний предел диапазона (не median)
2. Ссылайся на Glassdoor/Levels.fyi/LinkedIn Salary Insights
3. Не называй первым цифру ("What's your budget for this role?")
4. Уточняй total comp: base + RSU (если есть) + bonus

---

## Итого

Как найти работу в Европе LinkedIn 2026: профиль (Headline + Open to Work + Skills); коннектиться с Recruiters/EM в целевых компаниях (100-200 за 2-4 нед); 5-10 заявок/день; Otta/Relocate.me/StepStone; EU интервью: Coding + System Design + Behavioral; STAR метод; просить релокейшн-пакет (€1 000-15 000 lump sum + временное жильё); не называть зарплату первым. Ключевой скилл: networking, не только mass apply.
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
console.log(`\nБатч 186: ${ok} OK, ${err} ошибок`);
