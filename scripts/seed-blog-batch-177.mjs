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
    slug: 'chek-list-pereezda-za-rubezh-dokumenty-2026',
    title: 'Полный чек-лист переезда за рубеж: документы, счета, уведомления 2026',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Чек-лист переезда за рубеж 2026: ДО ОТЪЕЗДА из России (документы): загранпаспорт (действие ≥6 мес + въездная виза); второй загранпаспорт (опционально; полезно если много поездок); свидетельства (рождения/брака/развода) + апостиль; дипломы об образовании + апостиль; трудовая книжка (сделать заверенную копию); справка об отсутствии судимости + апостиль; международное водительское удостоверение (МУ через ГИБДД); нотариально заверенные переводы (готовить в целевой стране — дешевле); медицинские документы (вакцинации/хронические болезни/рецепты); справка о страховом стаже ПФР (Госуслуги); медицинская карта; ДО ОТЪЕЗДА (финансы): Wise account открыть; уведомить банки РФ об отъезде; наличные (€3 000-5 000 на первый месяц); вывести часть сбережений легально (сроки и лимиты по закону); уведомить налоговую РФ при смене налогового резидентства (183 дня); ДО ОТЪЕЗДА (имущество): снять с регистрации (необязательно но некоторые делают); ипотека/кредиты (автоплатёж или доверенность); аренда квартиры (уведомить арендодателя); вещи (продать/отдать/вывезти/хранение)',
    seo_description: 'Чек-лист переезда за рубеж пошагово 2026: ЗА 3-6 МЕС ДО ОТЪЕЗДА: загранпаспорт (проверить срок — должен быть ≥6 мес; сделать новый в МФЦ если мало; биометрический 10 лет — МФЦ или ГУВМ МВД; срок выдачи 1 мес стандарт / 2 нед ускоренный); апостили (диплом через Рособрнадзор 30 дней; свидетельство о рождении через ЗАГС 5-30 дней; справка о несудимости + апостиль МВД 40-60 дней — НАЧИНАТЬ ПЕРВЫМ); МУ (международное водительское удостоверение) через ГИБДД или МФЦ (1000 ₽; срок выдачи 1-3 нед; использовать с национальными правами); Wise account (открыть онлайн с российским паспортом; EUR/USD/GBP; для хранения и переводов); МЕДИЦИНСКИЕ ДОКУМЕНТЫ: вакцинация (жёлтая лихорадка — если едешь в Африку/ЮА; COVID сертификат если нужен); хронические болезни — взять справку + выписку + рецепты (международное МНН название препарата, не торговое!); стоматология — пройти до отъезда (за рубежом дорого); очки/линзы — сделать запас и взять рецепт на диоптрии; ЗА 1-3 МЕС: медицинская страховка для въезда; жильё (Airbnb или коливинг на первые 2-4 нед); уведомить банки РФ (некоторые блокируют карту при транзакциях за рубежом — лучше предупредить); наличные для первого месяца (€2 000-5 000 в зависимости от страны); ЗА 1-2 НЕД: сдать квартиру/уведомить арендодателя; передать коммунальные платежи; отдать ключи; вещи: что везёшь (авиабагаж; перевес; cargo); что хранишь (самохранилище); что продаёшь/отдаёшь; ПОСЛЕ ПРИБЫТИЯ (1-й нед): регистрация (Meldebescheinigung в Германии; Registre Civil в Испании; Gemeentelijke Basisadministratie в NL; в течение 2 нед как правило); банковский счёт (N26/DKB в Германии после Meldebescheinigung; 1-2 нед после регистрации); SIM-карта (местный номер нужен для всего); ВНЖ заявка (BoE/Ausländerbehörde/etc); медицинский полис (EHIC / местная страховка); ПОСЛЕ 1-3 МЕС: получить ВНЖ / ID карту; открыть постоянный банковский счёт; перевести мобильный контракт; разобраться с налоговым резидентством; уведомить налоговую РФ (если нужно); РОССИЯ — НАЛОГОВОЕ РЕЗИДЕНТСТВО: если пробудешь за рубежом >183 дней в течение 12 мес — теряешь статус налогового резидента РФ; ставка НДФЛ для нерезидентов РФ на российские доходы: 30% (вместо 13%/15%); закон РФ: уведомить налоговую при смене резидентства; закон об уведомлении иностранных счетов: при наличии счёта за рубежом — уведомлять ИФНС ежегодно.',
    content_md: `# Полный чек-лист переезда за рубеж: что сделать и когда

Расписан по времени — начинай с апостилей (самые долгие).

## За 3-6 месяцев: документы

### Срочно начать:
- [ ] **Справка об отсутствии судимости + апостиль** (ГУ МВД → 40-60 дней)
- [ ] **Диплом + апостиль** (Рособрнадзор → 30 дней)

### Параллельно:
- [ ] Загранпаспорт (срок действия ≥6 мес, иначе сделать новый)
- [ ] Свидетельства (рождения/брака) + апостиль ЗАГС (5-30 дней)
- [ ] МУ — международное водительское удостоверение (ГИБДД, ~1000 ₽)
- [ ] Справка о пенсионных баллах (ИПК) — Госуслуги

---

## За 2-4 месяца: финансы и здоровье

### Финансы:
- [ ] Открыть **Wise Account** (EUR/USD/GBP, с российским паспортом)
- [ ] Уведомить банки РФ об отъезде (чтобы не блокировали карту)
- [ ] Конвертировать сбережения (в пределах легальных лимитов)
- [ ] Настроить автоплатёж ипотеки/кредитов (или доверенность)

### Медицина:
- [ ] **Стоматолог** — пройти до отъезда (за рубежом дорого)
- [ ] Взять справку и рецепты на хронические препараты (МНН-названия!)
- [ ] Вакцинация (жёлтая лихорадка если нужна, COVID сертификат)
- [ ] Запас линз/очков + рецепт на диоптрии
- [ ] Медицинская карта (выписка из поликлиники)

---

## За 1-3 месяца: логистика

- [ ] Бронь жилья на первые 2-4 недели (Airbnb или коливинг)
- [ ] Медицинская страховка для въезда (Travel Health Insurance)
- [ ] Наличные (€2 000-5 000 на первый месяц)
- [ ] Решить судьбу вещей (везти / хранить / продать)

---

## За 1-2 недели: закрытие дел в России

- [ ] Уведомить арендодателя/сдать квартиру
- [ ] Закрыть подписки/абонементы
- [ ] Коммунальные: автоплатёж или передать кому-то
- [ ] Снятие с учёта авто (если продаёшь)
- [ ] Прощания и последние дела

---

## Первая неделя после прибытия

| Задача | Срок | Важность |
|-------|------|---------|
| Регистрация адреса (Meldebescheinigung/Padrón) | В течение 2 нед | Критично |
| SIM-карта (местный номер) | 1-й день | Высокая |
| Банковский счёт (N26/DKB в DE) | После регистрации | Высокая |
| Запись в Ausländerbehörde/BoE/Gemeinde | 1-2 нед | Критично |
| Медицинский полис (EHIC или местный) | 1-2 нед | Высокая |

---

## Первый месяц

- [ ] Получить ВНЖ / ID-карту (запись на приём как можно раньше)
- [ ] Открыть постоянный банковский счёт
- [ ] Записаться на языковые курсы (Ulpan в IL, Integrationskurs в DE)
- [ ] Разобраться с налоговым резидентством

---

## Налоговое резидентство России при переезде

**Если провёл за рубежом >183 дней** в 12-месячный период:
- Теряешь статус налогового резидента РФ
- НДФЛ с российских доходов: **30%** (вместо 13-15%)
- Закон об иностранных счетах: уведомлять ИФНС ежегодно

**Что уведомить:**
- Налоговую РФ (при смене резидентства)
- ИФНС об иностранном банковском счёте (в течение 1 мес после открытия)

---

## Итого

Чек-лист переезда за рубеж 2026: начинать за 3-6 мес с апостилей (справка о несудимости 40-60 дней!); МУ через ГИБДД; Wise account до отъезда; стоматолог + рецепты на МНН; жильё на первые 2-4 нед; после прибытия: регистрация (1-2 нед) → банк → SIM → ВНЖ → полис; налоговое резидентство РФ теряется после 183 дней за рубежом.
`,
  },
  {
    slug: 'braziliya-sau-paulo-it-pereezd-2026',
    title: 'Бразилия и Сан-Паулу для IT: виза, Nubank, зарплаты BRL в 2026',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Бразилия Сан-Паулу IT 2026: рабочая виза Бразилии (Visto de Trabalho; через работодателя; требования: трудовой контракт с бразильской компанией; диплом + опыт; рассмотрение Министерства труда Бразилии; Digital Nomad Visa Бразилии с 2022: Visto VITEM-XIV; доход ≥$1 500/мес или $18 000/год; стаж 1+ год у иностранного работодателя; срок 1 год с продлением); IT-компании Бразилии: Nubank (крупнейший необанк LatAm; NASDAQ NU; $43B; HQ Сан-Паулу; 8 000+ чел.); Mercado Libre (MercadoPago; NYSE MELI; HQ Аргентина но R&D SP); iFood (food delivery #1 Brazil; $5.4B); Totvs (ERP #1 Brazil); CI&T (IT consulting; NYSE); VTEX (e-com SaaS; NYSE); PicPay (neobank; 33M users); Creditas (fintech lending); Gympass (worksite wellness; USA IPO); 99 (Didi); Rappi; НДФЛ Бразилии: прогрессивный 0%-27.5%; sociale: INSS 7.5%-14% (работник); зарплаты IT SP: Junior BRL 4 000-7 000/мес; Middle BRL 8 000-15 000/мес; Senior BRL 15 000-30 000/мес; Nubank Senior BRL 20 000-35 000/мес',
    seo_description: 'Бразилия Сан-Паулу IT 2026: DIGITAL NOMAD VISA (VITEM-XIV с 2022): требования: документальный доход ≥$1 500/мес ИЛИ $18 000/год от иностранного работодателя; трудовой стаж ≥1 год у иностранной компании; полис медицинского страхования на срок визы; заявка в Consulado Brasileiro (Посольство Бразилии в стране проживания); срок: 1 год с возможностью продления 1 раз (итого 2 года); через 4 года в Бразилии возможна постоянная резиденция; RNE (Registro Nacional de Estrangeiros) — получить в PF (Policia Federal) после приезда; НДФЛ БРАЗИЛИИ: 0% до BRL 28 559.70/год (2024); 7.5% до 42 750; 15% до 57 143; 22.5% до 71 429; 27.5% свыше 71 429; INSS (Social Security) 7.5%-14% (работник; прогрессивная шкала); итого эффективная ставка Middle Senior: 28-40%; NET Middle BRL 12 000/мес gross: ~BRL 8 000-8 500 NET = $1 500-1 600 USD (курс USD/BRL ≈ 5.2); КОМПАНИИ IT: Nubank (nu.com.br; Nu Holdings; NASDAQ NU; $42B рыночная кап 2024; 100M+ клиентов Latam; HQ Vila Olimpia Sao Paulo; 8 000+ сотрудников; Senior Eng BRL 20 000-40 000/мес; известны хорошими benefits + equity ESPP); iFood (ifood.com.br; food delivery; 71M активных пользователей Бразилии; $5.4B выручка; BRL 15 000-28 000 Senior); VTEX (vtex.com; e-com SaaS cloud; NYSE VTEX; BRL 15 000-25 000); Totvs (TOTS3.SA; ERP SAP Бразилии; BRL 10 000-20 000); CI&T (NYSE CINT; digital IT services; BRL 12 000-22 000); PicPay (33M пользователей; BRL 15 000-25 000); Creditas (fintech lending marketplace; Series F; BRL 15 000-25 000); Gympass (Wellhub; wellbeing benefits SaaS; USA IPO-целится); СТОИМОСТЬ ЖИЗНИ Сан-Паулу: аренда 1BR (Faria Lima/Itaim Bibi/Vila Olimpia) BRL 4 000-8 000/мес ($770-1 540 USD); (Mooca/Tatuape) BRL 2 500-4 500/мес; продукты BRL 1 500-2 500/мес; транспорт (метро/Uber) BRL 300-600/мес; жизнь итого $800-2 000 USD/мес; ЯЗЫК: Portuguese Brazilian (português brasileiro); Spanish НЕ то же самое (хотя похоже); английский — в международных компаниях рабочий язык; для жизни в SP нужен Portuguese (A2-B1 достаточно для начала); курсы: Duolingo/Pimsleur/Italki для PT-BR.',
    content_md: `# Бразилия и Сан-Паулу для IT: Nubank, Digital Nomad Visa, цены

LatAm tech-столица. Nubank с $43B — крупнейший необанк в мире. Стоимость жизни в 3 раза ниже Европы при сопоставимом quality of life.

## Digital Nomad Visa (VITEM-XIV с 2022)

| Параметр | Требование |
|---------|-----------|
| Доход | ≥$1 500/мес от иностранного работодателя |
| Стаж | ≥1 год у иностранной компании |
| Медицина | Полис на весь срок визы |
| Срок | 1 год + продление 1 раз |

**Итого:** до 2 лет по Digital Nomad Visa. Через 4 года в Бразилии — постоянная резиденция.

---

## НДФЛ Бразилии

| Доход (BRL/год) | Ставка |
|----------------|--------|
| до 28 560 | 0% |
| 28 560-42 750 | 7.5% |
| 42 750-57 143 | 15% |
| 57 143-71 429 | 22.5% |
| свыше 71 429 | **27.5%** |

**+ INSS (Social Security):** 7.5%-14% (работник)

**NET Middle BRL 12 000/мес:** ~BRL 8 200 = **~$1 580 USD/мес**

---

## IT-компании Бразилии

| Компания | Профиль | Факт |
|---------|---------|------|
| **Nubank** | Необанк | NASDAQ; $42B; 100M+ клиентов; 8 000+ чел. |
| **iFood** | Food delivery | #1 Brazil; 71M пользователей |
| **VTEX** | E-com SaaS | NYSE; cloud-первая |
| **Totvs** | ERP | SAP Бразилии; TOTS3 BOVESPA |
| **CI&T** | IT consulting | NYSE CINT |
| **PicPay** | Neobank | 33M пользователей |
| **Creditas** | Fintech lending | Series F |

### Nubank

Vila Olimpia, Sao Paulo. 100M+ клиентов в Бразилии/Мексике/Колумбии. Известен как лучший tech-работодатель LatAm. Benefits: equity ESPP + health + dental + meal allowance + gym.

---

## Зарплаты IT в Сан-Паулу

| Уровень | BRL/мес | USD/мес |
|---------|---------|---------|
| Junior | 4 000-7 000 | $770-1 350 |
| Middle | 8 000-15 000 | $1 540-2 885 |
| Senior | 15 000-30 000 | $2 885-5 770 |
| Nubank Senior | 20 000-40 000 | $3 846-7 692 |

**Курс:** USD/BRL ≈ 5.2 (волатильный!)

---

## Стоимость жизни Сан-Паулу

| Статья | BRL/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (Faria Lima/Vila Olimpia) | 4 000-8 000 | $770-1 540 |
| Аренда 1BR (Mooca/Tatuape) | 2 500-4 500 | $481-865 |
| Продукты | 1 500-2 500 | $288-481 |
| Транспорт (Uber/метро) | 300-600 | $58-115 |
| **Итого** | **8 000-15 000** | **$1 540-2 885** |

---

## Плюсы и минусы

**Плюсы:**
- Стоимость жизни $800-2 000/мес
- Nubank и tech-экосистема мирового уровня
- Digital Nomad Visa с $1 500/мес дохода
- Климат (круглогодичное лето)
- Дружелюбие и культура

**Минусы:**
- Безопасность (Сан-Паулу — не самый безопасный)
- Португальский язык (не испанский!)
- Волатильный реал BRL
- Длинный перелёт из России
- Бюрократия (RNE, INSS, CPF)

---

## Португальский для Бразилии

Английского хватает в международных компаниях. Для жизни нужен **Бразильский португальский** (PT-BR, отличается от PT-PT).

| Уровень | Для чего достаточно |
|---------|-------------------|
| A2 | Бытовая жизнь, транспорт, супермаркет |
| B1 | Комфортная жизнь |
| B2 | Работа в местных компаниях |

---

## Итого

Бразилия Сан-Паулу IT 2026: Digital Nomad Visa ($1 500/мес иностранный доход; 1+1 год); Nubank ($42B; 100M+ клиентов; Senior BRL 20-40k/мес)/iFood/VTEX/Totvs; НДФЛ 0-27.5% + INSS 7.5-14%; NET Middle ~$1 580/мес; жизнь $800-2 000/мес (в 3 раза дешевле Европы); Portugal/PT-BR язык обязателен для жизни. Лучший выбор если: Digital Nomad + тёплый климат + дешёвая жизнь + LatAm tech.
`,
  },
  {
    slug: 'kak-podgotovit-rezyume-dlya-inostrannoy-kompanii-2026',
    title: 'Как написать резюме для иностранной компании: CV по стандарту EU/US в 2026',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Резюме для иностранной компании CV стандарт EU US 2026: разница CV и Resume (Resume: США/Канада/Австралия — 1 страница (Junior-Middle); 2 страницы MAX (Senior+); нет фото; нет возраста; нет семейного положения; нет гражданства (добавить только если есть право на работу); Curriculum Vitae (CV): UK/EU/Австралия академический контекст — 2-5 страниц; для EU tech: гибрид 1-2 страницы; некоторые EU страны принимают фото (DE/AT/CH — традиционно да, но тренд меняется к нет)); структура хорошего CV для IT (Contact Info: имя + email + LinkedIn + GitHub/Portfolio + город страна (улицу не надо); Professional Summary/Objective: 2-3 предложения; опыт (Experience): обратная хронология; должность/компания/страна/даты; bullets: начинай с action verb (Built/Led/Reduced/Increased/Designed/Optimized/Deployed); добавляй числа везде где можно (reduced latency by 40% / served 3M users / team of 5); Education; Skills; Languages); ATS (Applicant Tracking System): большинство крупных компаний используют ATS — автоматическую систему сортировки резюме; ключевые слова из объявления о работе должны быть в резюме (буквально те же термины); форматы: PDF для прямых заявок; .docx для систем где требуется; никаких таблиц/колонок/фото в ATS-версии (парсится плохо)',
    seo_description: 'Резюме для иностранной компании 2026 CV стандарт: СТРУКТУРА CV ДЛЯ IT (1-2 страницы): CONTACT INFO (шапка): Имя Фамилия (крупно); email (профессиональный: имя.фамилия@gmail.com НЕ dimka1988@mail.ru); LinkedIn URL (linkedin.com/in/yourname); GitHub (github.com/username); Portfolio/website (если есть); Город, Страна (не улица); Phone (с кодом страны +7/+39/etc); PROFESSIONAL SUMMARY (2-3 предложения): Senior Backend Engineer with 7 years of experience building high-load distributed systems. Expert in Python, Golang, and Kubernetes; previously at [Company] scaling platform to 50M users. Seeking opportunities in EU fintech engineering.; EXPERIENCE (обратная хронология): [Должность] at [Компания], [Страна] | [месяц год] — [месяц год]; bullets: Built payment processing microservice handling 10M transactions/day using Go and Kafka; Reduced P99 latency from 800ms to 120ms by optimizing database queries and adding Redis caching; Led team of 4 engineers to deliver new auth service 2 weeks ahead of schedule; Increased test coverage from 34% to 87% improving deployment confidence; EDUCATION: Degree, Major | University, City | year; SKILLS: Languages: Python, Go, TypeScript, Java; Frameworks: FastAPI, Django, Spring Boot; Infra: AWS, GCP, Kubernetes, Terraform; DBs: PostgreSQL, MongoDB, Redis; Testing: pytest, JUnit; LANGUAGES: Russian (native), English (C1), German (A2); ТИПИЧНЫЕ ОШИБКИ: фото (в US/UK не надо и вредит через ATS); возраст/семейное положение/дата рождения (не надо в US/UK/CA/AU); duties-style bullets (Responsible for maintaining database) вместо achievement-style (Optimized query performance reducing load time by 60%); нет числового результата (везде где можно — добавлять); слишком длинно (>2 страниц для не-academic); указывать гражданство РФ если нет права на работу (лучше указать work authorization); ATS: скачать версию без колонок/таблиц/фото (только текст, парсится лучше); ключевые слова из JD (job description) должны быть в тексте дословно; LINKEDIN: обязательно полный профиль (фото + summary + опыт = больше шансов что рекрутер напишет); customize LinkedIn URL (linkedin.com/in/yourname); Open to Work (включить видимость только для рекрутеров если текущий работодатель в ЛинкедИн); РЕСУРСЫ: resume.io / cvmkr.com — шаблоны; JobScan.co — проверка ATS совпадения; Grammarly — проверка английского.',
    content_md: `# CV для иностранной компании: стандарты EU и US

Resume в США — 1 страница. CV в EU — 1-2 страницы. Никакого фото, возраста и семейного положения (US/UK/CA). Bullets с числами везде.

## Resume vs CV

| | Resume (US/CA/AU) | CV (UK/EU academic) |
|--|------------------|--------------------|
| Длина | 1 стр (Junior), 2 max | 2-5 страниц |
| Фото | **Нет** | В DE/AT/CH традиционно да |
| Возраст | **Нет** | Нет (EU trend) |
| Семейное положение | **Нет** | Нет |

**Для EU IT-компаний:** делай 1-2 страницы без фото — универсальный формат.

---

## Структура CV для IT

### 1. Contact Info (шапка)

> Ivan Petrov
> ivan.petrov@gmail.com | linkedin.com/in/ivanpetrov
> github.com/ipetrov | Berlin, Germany
> +49 123 456 789

**Не включать:** улицу, возраст, семейное положение, фото (US/UK/EU)

---

### 2. Professional Summary (2-3 предложения)

> Senior Backend Engineer with 7 years of experience building high-load distributed systems. Expert in Python, Go, and Kubernetes; previously at [Company] scaling platform to 50M daily users. Seeking engineering opportunities in EU fintech.

---

### 3. Experience (главный раздел)

**Формат:**

> **Senior Software Engineer** at ACME Corp, Russia | Jan 2020 — Aug 2024

**Bullets = Achievement-формат (Action Verb + Result + Number):**

Хорошо:
- Built payment processing microservice handling 10M transactions/day using Go and Kafka
- Reduced P99 latency from 800ms to 120ms through query optimization and Redis caching
- Led team of 4 engineers, delivered auth service 2 weeks ahead of schedule
- Increased test coverage from 34% to 87%, cutting regression bugs by 60%

Плохо:
- Responsible for maintaining the database
- Worked on payment system

---

### 4. Education

> **Bachelor of Computer Science** | MSTU Bauman, Moscow | 2015

---

### 5. Skills

> **Languages:** Python, Go, TypeScript, Java
> **Frameworks:** FastAPI, Django, Spring Boot
> **Infra:** AWS, GCP, Kubernetes, Terraform, Docker
> **Databases:** PostgreSQL, MongoDB, Redis
> **Testing:** pytest, JUnit

---

### 6. Languages

> Russian (native), English (C1), German (A2)

---

## ATS: автоматическая сортировка

Большинство компаний используют ATS (Applicant Tracking System). Если CV не прошёл ATS — его не читает человек.

**Правила ATS:**
- Ключевые слова из объявления о работе должны быть **дословно** в CV
- Никаких колонок, таблиц, фото в ATS-версии (парсится плохо)
- Формат: **PDF** для прямых заявок; .docx если ATS требует

**JobScan.co** — вставь текст объявления и CV → покажет % совпадения.

---

## Типичные ошибки россиян

| Ошибка | Почему вредит |
|-------|-------------|
| Фото в CV для US/UK | Дискриминация по виду — многие ATS исключают |
| Возраст/дата рождения | Не нужны; в US запрещено спрашивать |
| Duties-style bullets | Не показывает результат |
| Нет чисел | Невозможно оценить масштаб |
| CV >2 страниц | Никто не дочитает (для non-senior) |
| Указывать гражданство РФ | Скажи лучше: Right to work in [EU] при наличии |

---

## LinkedIn: обязательно

- Полное фото (профессиональное)
- Summary (Professional Summary как в CV)
- Весь опыт заполнен
- Customize URL: linkedin.com/in/yourname
- Open to Work: включить для рекрутеров (скрыто от работодателя)

---

## Ресурсы

| Ресурс | Для чего |
|-------|---------|
| **Resume.io / Enhancv** | Шаблоны CV |
| **JobScan.co** | Проверка ATS-совпадения |
| **Grammarly** | Проверка английского |
| **LinkedIn** | Обязательный профиль |

---

## Итого

CV для иностранной компании 2026: 1-2 страницы; без фото/возраста/семейного положения (US/UK/CA); Contact Info + Summary (2-3 предложения) + Experience (achievement bullets с числами) + Education + Skills + Languages; ATS — ключевые слова дословно из JD, без колонок/таблиц; JobScan.co для проверки; LinkedIn обязателен с полным профилем.
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
console.log(`\nБатч 177: ${ok} OK, ${err} ошибок`);
