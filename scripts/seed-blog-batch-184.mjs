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
    slug: 'shvetsiya-stokgolm-it-2026',
    title: 'Швеция и Стокгольм для IT в 2026: Spotify, Klarna, King — Silicon Valley of Europe',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Швеция Стокгольм IT 2026: ВНЖ Швеции (Uppehallstillstand for arbete; рабочий ВНЖ; через шведского работодателя; подача через Migrationsverket (шведская иммиграционная служба); employer pays 6 000 SEK registration fee; срок 24 мес + renewals; ПМЖ Permanent Residency через 4 года непрерывного ВНЖ; EU Blue Card Sweden: зарплата ≥1.5× средней; альтернативный путь; гражданство: 5 лет ПМЖ + знание шведского (A2 для ПМЖ; гражданство интервью); IT-компании Стокгольма: Spotify (SPOT NYSE; 9 000+ чел.; HQ Stockholm; music streaming; Senior SWE $150k-250k USD/год equiv.; частичный remote); Klarna (buy now pay later; HQ Stockholm; Sequoia/Visa/SoftBank; unicorn; $7B; Senior SWE $120k-200k USD); King (Candy Crush; Activision Blizzard/MS; HQ Stockholm; mobile games; Senior $100k-180k); Mojang Studios (Minecraft; MS; Stockholm HQ; 600 чел.); iZettle (Square/Block; HQ Stockholm; payments); Dice (EA DICE; Battlefield; Stockholm); Bambora (payments; Ingenico Group); Tobii (eye tracking; Nasdaq Stockholm); Viaplay Group; Storytel (audiobook streaming; Nasdaq First North); Truecaller (caller ID; Nasdaq First North; HQ Stockholm; founded by Indians; Senior SWE SEK 70 000-120 000/мес); НДФЛ Швеции: прогрессивный: 0% до SEK 20 200/год; муниципальный 29-35% (в зависимости от коммуны); государственный 20% свыше SEK 598 500/год; итого эффективная ставка: 30-52%; САМЫЕ ВЫСОКИЕ НАЛОГИ в OECD наряду с Данией; но высокие бесплатные сервисы: здравоохранение (Landsting; SEK 1 150/год личные расходы cap); образование (universitет бесплатный для EU); пенсия (AP-fonder государственный пенсионный); парентальный отпуск (480 дней; 80% зарплаты; шведское папство = папы берут отпуск реально)',
    seo_description: 'Швеция Стокгольм IT 2026: UPPEHALLSTILLSTAND (рабочий ВНЖ): подача работодателем через Migrationsverket (migrationsverket.se); работодатель платит 6 000 SEK (approx €520) за каждое заявление; срок рассмотрения: 1-4 мес (зависит от нагрузки); ВНЖ 24 мес + renewals; ПМЖ после 4 лет непрерывного ВНЖ; гражданство после 5 лет ПМЖ + интервью (без жёсткого языкового теста); ВАЖНО: ПМЖ подавать онлайн через e-tjänst Migrationsverket; НАЛОГИ ШВЕЦИИ: Kommunalskatt (муниципальный налог): 29-35% от дохода (зависит от коммуны; Stockholm ~30%); Statlig skatt (государственный налог): 20% на доход свыше SEK 598 500/год (approx €52 600); Итого при доходе SEK 600 000/год: коммун 30% + государственный 20% (только с превышения) = эффективная ставка ~38-42%; при SEK 1 200 000: до порога 30%, выше 50% = эффективная ~42-48%; САМЫЕ ВЫСОКИЕ НАЛОГИ в мире — но есть compensation: здравоохранение (Landsting; личные расходы ограничены SEK 1 150/год = ~€100/год; рецепты SEK 2 600/год cap); стоматология субсидировано до 23 лет; образование (университет бесплатный для EU; non-EU SEK 45 000-200 000/год); ЗАРПЛАТЫ IT СТОКГОЛЬМ: Junior Dev: SEK 35 000-50 000/мес gross ($3 220-4 600); Middle: SEK 50 000-75 000/мес ($4 600-6 900); Senior: SEK 65 000-100 000/мес ($5 990-9 210); Spotify Senior SWE: SEK 80 000-120 000/мес ($7 370-11 050); Klarna Senior: SEK 75 000-115 000/мес ($6 910-10 590); СТОИМОСТЬ ЖИЗНИ СТОКГОЛЬМ: аренда 1BR (Sodermalm/Vasastan/Ostermalm): SEK 12 000-20 000/мес ($1 105-1 840); (Nacka/Sollentuna suburbs): SEK 9 000-14 000/мес; продукты: SEK 3 000-5 000/мес ($275-460); транспорт (SL 30-day): SEK 970/мес ($89); жизнь итого: SEK 18 000-30 000/мес ($1 660-2 760); ОЧЕРЕДИ НА ЖИЛЬЁ: stockholm.se First Hand (kommunal hyresratt) = очередь 15-30 лет; реально: secondhand (sublet) или bostadsratt (кооперативная квартира; нужна первоначальная сумма SEK 500 000-2 000 000); для экспатов: обычно sublet через Hemnet.se / Blocket.se / Facebook Marketplace BostadsDirekt; ШВЕДСКИЙ ЯЗЫК: рабочий язык в Spotify/Klarna/King = АНГЛИЙСКИЙ (international teams); для жизни полноценной: шведский; Grundkurs Svenska (SFI = Svenska for Invandrare) — бесплатные уроки шведского для резидентов; срок до B1: ~400 часов (шведский из германской группы; схож с немецким/норвежским); STHLM TECH SCENE: Sthlm Techfest; Epicenter Stockholm (tech coworking); множество фондов и VCs; вторая по числу unicorn-ов страна в мире на душу населения (Spotify/Klarna/King/Mojang/Skype/Truecaller).',
    content_md: `# Швеция и Стокгольм для IT: Spotify, Klarna, Minecraft, Candy Crush

Стокгольм — Silicon Valley of Europe. На душу населения больше unicorn-ов чем где-либо кроме Кремниевой долины. Spotify ($SPOT), Klarna, King (Activision) — все отсюда. Налоги высокие, но здравоохранение фактически бесплатное.

## Рабочий ВНЖ Швеции

| Параметр | Значение |
|---------|---------|
| Название | Uppehallstillstand for arbete |
| Подаёт | Работодатель через Migrationsverket |
| Сбор | 6 000 SEK (~€520) за заявку |
| Срок рассмотрения | 1-4 мес |
| ВНЖ | 2 года + renewals |
| ПМЖ | После 4 лет непрерывного ВНЖ |
| Гражданство | После 5 лет ПМЖ |

---

## IT-компании Стокгольма

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Spotify** | Music streaming | NYSE; 9 000+ чел. |
| **Klarna** | BNPL fintech | $7B unicorn; Visa/SoftBank |
| **King** | Candy Crush | Activision Blizzard/MS |
| **Mojang** | Minecraft | MS; 600 чел. |
| **Truecaller** | Caller ID | Nasdaq First North |
| **Dice (EA)** | Battlefield | EA studio |
| **iZettle** | Payments | Square/Block |

---

## Налоги Швеции

| Ставка | Доход |
|--------|-------|
| Kommunalskatt ~30% | Весь доход |
| + Statlig 20% | Свыше SEK 598 500 (~€52 600) |
| **Эффективная ставка** | **38-48%** |

**Но что включено:**
- Здравоохранение: личные расходы cap SEK 1 150/год (~€100)
- Рецепты: cap SEK 2 600/год
- Университет: **бесплатно** для EU-резидентов
- Родительский отпуск: 480 дней, 80% зарплаты

---

## Зарплаты IT в Стокгольме

| Уровень | SEK/мес | USD/мес |
|---------|---------|---------|
| Junior | 35 000-50 000 | $3 220-4 600 |
| Middle | 50 000-75 000 | $4 600-6 900 |
| Senior | 65 000-100 000 | $5 990-9 210 |
| Spotify Senior | 80 000-120 000 | $7 370-11 050 |
| Klarna Senior | 75 000-115 000 | $6 910-10 590 |

---

## Стоимость жизни в Стокгольме

| Статья | SEK/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (Sodermalm/Vasastan) | 12 000-20 000 | $1 105-1 840 |
| Продукты | 3 000-5 000 | $275-460 |
| Транспорт (SL 30 дней) | 970 | $89 |
| **Итого** | **18 000-30 000** | **$1 660-2 760** |

---

## Жильё: главная боль Стокгольма

Очередь на социальное жильё — 15-30 лет. Для экспатов:
- **Sublet** через Hemnet.se / Blocket.se / Facebook (BostadsDirekt)
- **Bostadsratt** (кооперативная квартира) — нужно SEK 500 000-2 000 000 первоначально

---

## Шведский язык

| Параметр | Значение |
|---------|---------|
| Рабочий язык (Spotify/Klarna) | Английский |
| Для жизни | Шведский A2-B1 |
| SFI (бесплатные уроки) | Для всех резидентов |
| До B1 | ~400 часов |

---

## Итого

Швеция Стокгольм IT 2026: рабочий ВНЖ через Migrationsverket (работодатель; 6 000 SEK; 1-4 мес; ПМЖ через 4 года); Spotify/Klarna/King/Mojang; Senior SEK 65 000-100 000/мес ($5 990-9 210); налоги 38-48% но здравоохранение по €100/год cap; жизнь $1 660-2 760/мес; жильё — главная боль (sublet); SFI шведский бесплатно. Лучший город в мире для IT-карьеры с чистой совестью.
`,
  },
  {
    slug: 'sofiya-plovdiv-bolgariya-it-2026',
    title: 'Болгария и София для IT в 2026: 10% плоский налог, Vivacom, EU с самой низкой налоговой нагрузкой',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Болгария София IT 2026: самая низкая налоговая нагрузка в EU (10% плоский НДФЛ = самая низкая ставка НДФЛ в EU; Social Insurance работника: 13.78% + работодатель 18.92%; Health Insurance: 3.2% работник + 4.8% работодатель; ЕТ (Едноличен Търговец, ИП Болгарии): НДФЛ 15% (не 10%, т.к. ЕТ = отдельный режим с 15%); ООД (ООО Болгарии): Corporate Tax 10% (самый низкий в EU!)); ВНЖ Болгарии для граждан России (ВАЖНО: Болгария — EU но была дружественна к гражданам РФ; с 2022 ограничения; визовый режим для граждан РФ: шенгенская виза Болгарии (Болгария НЕ в Шенгенской зоне до 2024; вступила в Шенген авиационный и морской в 2024; НЕ сухопутный); для ВНЖ нужна болгарская D-виза; D-виза через болгарское консульство: инвестор/работник/аккредитованный в болгарской компании; ВНЖ категории: продолжительно пребиваване (temporary; 1 год) + postоянно пребиваване (ПМЖ; 5 лет)); IT-компании Болгарии: Vivacom (телеком; Bulgaria Telecom; BG HQ); A1 Bulgaria (телеком AT&T; София); Telerik (Progress Software; EdTech/UI; куплен Progress $262M; HQ Sofia/Waltham; основан болгарами); Chaos Group (V-Ray рендеринг; Chaos; $820M acq.; Sofia HQ); Musala Soft; Paysafe (платёжная система; LSE; Bulgarian origins; HQ London+Sofia); Commerzbank Bulgaria IT Hub; Societe Generale Bulgaria Technology; SAP Labs Bulgaria (2 500+ чел.; Sofia; один из крупнейших SAP Labs в мире!); Hewlett Packard Enterprise Bulgaria; CGI Bulgaria; EPAM Sofia; Luxoft Sofia; VMware Sofia; Progress Software (Telerik/Kendo UI); Coherent Solutions; Nemetschek Bulgaria (ArchiCAD; AEC software); Sitel Bulgaria (CX)',
    seo_description: 'Болгария София IT 2026: НАЛОГИ: САМЫЕ НИЗКИЕ В EU: НДФЛ физлица: flat 10% (Данък Общ Доход; одна ставка для ВСЕХ уровней дохода; уникально для EU); Social Insurance работника: 13.78% (ДОО + ДЗПО + ДОО по болест); работодатель: 18.92% (пенсионное + безработица + больничный + ТЗПБ); Health Insurance (НЗОК): 3.2% работника + 4.8% работодатель; ИТОГО нагрузка на работника: 10% НДФЛ + 16.98% Social/Health = ~26.98%; vs Германия ~45-50%; vs Франция ~50%; ООД (ООО): Корпоративный налог 10% (самый низкий в EU наряду с Кипром; но Болгария без сложных setup-requirements); Дивиденды нерезидентам: 5% withholding tax; ЗАРПЛАТЫ IT БОЛГАРИЯ: Junior Dev: 2 500-4 000 BGN/мес gross ($1 390-2 220); Middle: 4 000-7 000 BGN/мес ($2 220-3 890); Senior: 6 000-12 000 BGN/мес ($3 330-6 670); SAP Labs Sofia Senior Consultant: BGN 8 000-14 000/мес ($4 440-7 780); EPAM Sofia Senior: BGN 7 000-12 000/мес ($3 890-6 670); СТОИМОСТЬ ЖИЗНИ СОФИЯ: аренда 1BR (Lozenets/Mladost/Iztok): BGN 1 000-1 800/мес ($555-1 000); (Studentski Grad/Lyulin/Nadezhda): BGN 600-1 000/мес ($335-555); продукты: BGN 400-700/мес ($220-390); транспорт (Sofia Metro + bus monthly): BGN 80/мес ($45); жизнь итого: BGN 1 600-3 000/мес ($890-1 670); ОДИН ИЗ САМЫХ ДЕШЁВЫХ EU-ГОРОДОВ; БОЛГАРСКИЙ ЯЗЫК: кириллица + основан на старославянском; близкий к русскому языку; понимается носителями русского на 50-70% устно; очень похожая лексика; основное отличие: нет падежей (болгарский — аналитический язык); языковой барьер для носителей русского МИНИМАЛЬНЫЙ; срок до B1: 200-350 часов (намного быстрее чем немецкий/польский для носителей русского); ВНЖ БОЛГАРИИ: наиболее распространённые пути: работа в болгарской компании (Blue Card EU или разрешение на работу); регистрация ООД (ООД = ООО; учредить болгарское ООД + директор = право на ВНЖ для не-EU граждан); инвестиции (Investor Visa BGN 1 000 000); фриланс через ООД (самый популярный путь у digital nomad: регистрируешь ООД с собой директором → ВНЖ → платишь 10% CT + 5% дивиденды); срок рассмотрения ВНЖ: 30-90 дней; РАЙОНЫ SOFIA: Lozenets (лучший для экспатов; парки; рестораны; дороже); Mladost (деловой; Mall of Sofia; корпорации); Iztok (тихий; посольства); Studentski Grad (студенческий; бюджетный); ВИТОША: горнолыжный курорт прямо в границах города (30 мин от центра; лифт прямо с города); ЧЕРНОМОРСКОЕ ПОБЕРЕЖЬЕ: Варна/Бургас/Несебр (2.5-3 часа от Софии); летняя жизнь beach lifestyle недорого.',
    content_md: `# Болгария и София для IT: 10% плоский налог, самый дешёвый EU-город

Болгария — самый низкий НДФЛ в EU (flat 10%). Корпоративный налог ООД 10% (как Кипр, но проще). SAP Labs Sofia — крупнейший в мире SAP Labs с 2 500+ сотрудников. Витоша в 30 минутах от центра.

## Налоги Болгарии

| Налог | Ставка |
|-------|--------|
| НДФЛ физлица (flat) | **10%** |
| Social Insurance (работник) | 13.78% |
| Health Insurance (работник) | 3.2% |
| **Итого у работника** | **~27%** |
| Корпоративный налог (ООД) | **10%** |
| Дивиденды нерезидентам | 5% |

**Сравнение эффективной ставки для работника:**

| Страна | Нагрузка |
|--------|---------|
| Болгария | ~27% |
| Польша | ~33% |
| Чехия | ~33% |
| Германия | ~45-50% |

---

## IT-компании Болгарии

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **SAP Labs Sofia** | ERP/Enterprise | 2 500+ чел.; крупнейший SAP Labs |
| **EPAM Sofia** | IT consulting | Большой офис |
| **Chaos Group** | V-Ray rendering | $820M acq.; Sofia HQ |
| **Telerik (Progress)** | UI/EdTech | $262M acq. |
| **Paysafe** | Payments | LSE; Bulgarian roots |
| **Luxoft Sofia** | IT consulting | |
| **VMware Sofia** | Cloud | |

---

## Зарплаты IT в Болгарии

| Уровень | BGN/мес | USD/мес |
|---------|---------|---------|
| Junior | 2 500-4 000 | $1 390-2 220 |
| Middle | 4 000-7 000 | $2 220-3 890 |
| Senior | 6 000-12 000 | $3 330-6 670 |
| SAP Labs Senior | 8 000-14 000 | $4 440-7 780 |

---

## Стоимость жизни в Софии

| Статья | BGN/мес | USD/мес |
|--------|---------|---------|
| Аренда 1BR (Lozenets/Mladost) | 1 000-1 800 | $555-1 000 |
| Аренда 1BR (эконом районы) | 600-1 000 | $335-555 |
| Продукты | 400-700 | $220-390 |
| Транспорт (Metro + автобус) | 80 | $45 |
| **Итого** | **1 600-3 000** | **$890-1 670** |

---

## ВНЖ через ООД (самый популярный путь)

1. Зарегистрировать ООД (ООО) в Болгарии (~€500-1 000 через юриста)
2. Назначить себя директором
3. Подать на ВНЖ как директор болгарской компании
4. 30-90 дней рассмотрения
5. ВНЖ 1 год + renewals → ПМЖ через 5 лет

**Налог через ООД:** 10% CT + 5% дивиденды = ~14.5% эффективно.

---

## Болгарский язык: близкий к русскому

| Параметр | Значение |
|---------|---------|
| Алфавит | Кириллица (такая же) |
| Схожесть с русским | 50-70% лексики понятно |
| Главное отличие | Нет падежей |
| До B1 | ~200-350 часов |

**Самый простой для носителей русского язык в EU** — легче польского и чешского.

---

## Дополнительные плюсы

- **Витоша** — горнолыжный курорт в 30 мин от центра Софии
- **Черноморское побережье** (Варна/Несебр) — 2.5-3 часа от Софии
- **Болгарская кухня** — баница, кебапче, айран, вино

---

## Итого

Болгария София IT 2026: flat 10% НДФЛ (самый низкий в EU); ООД с 10% CT + 5% дивиденды; ВНЖ через ООД (директор; 30-90 дней); SAP Labs Sofia 2 500 чел./EPAM/Chaos Group; Senior $3 330-6 670/мес; жизнь $890-1 670/мес (один из самых дешёвых EU-городов); болгарский понятен носителям русского на 50-70%; Витоша в 30 мин. Лучший для налоговой оптимизации в EU при жизни в Восточной Европе.
`,
  },
  {
    slug: 'ssha-h1b-visa-it-2026',
    title: 'США H-1B виза для IT в 2026: лотерея, Green Card, FAANG зарплаты',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'США H-1B виза IT 2026: H-1B лотерея (H-1B Specialty Occupation Visa; Cap 65 000 новых H-1B/год + 20 000 для Master graduates в US; подача через работодателя; электронная регистрация в марте ($10 per registration fee с 2020); лотерея: более 400 000 заявок на 65 000 мест = шанс ~16-18% в 2023-2024; подача петиции в апреле только если выиграл лотерею; начало работы: 1 октября; срок H-1B: 3 года + 3 года продление; переход на другого работодателя: через H-1B transfer; H-1B holders могут работать только на sponsoring employer); Green Card из H-1B (EB-2 NOC advanced degree; EB-3 skilled workers; через работодателя PERM Labor Certification; Priority Date для граждан Индии: ожидание 15-30+ лет (категория EB-2 Индия переполнена); Priority Date для граждан России: EB-2 ожидание 5-10 лет (2023-2024); для граждан других стран (не Индия/Китай): 1-3 года ожидания; альтернатива: EB-1A (Extraordinary Ability; самономинация; без PERM; быстрее); NIW National Interest Waiver (EB-2; без PERM; но нужна exceptional ability); O-1A (Extraordinary Ability; временная виза без лотереи; для тех кто не выиграл H-1B лотерею); НАЛОГИ США (для H-1B holder = tax resident): Federal Income Tax прогрессивный: 10%/12%/22%/24%/32%/35%/37% (пары vs одиночки); FICA (Social Security 6.2% + Medicare 1.45% = 7.65%; работодатель столько же); State Income Tax: Калифорния 1-13.3%; Нью-Йорк 4-10.9%; Техас 0%; Флорида 0%; Вашингтон (штат) 0% (кроме capital gains 7%); Нью-Гэмпшир 0% earned income; ИТОГО эффективная ставка для дохода $200 000: Federal ~32% + State (CA) ~13% = ~45%; Federal + State (TX) = ~35%; ЗАРПЛАТЫ IT США (FAANG+): Big Tech (FAANG L3/E4 New Grad SWE): $170 000-250 000 total comp; L5/E5 Senior SWE: $250 000-450 000 total comp; L6/E6 Staff SWE: $400 000-700 000+ total comp; Amazon (Seattle): SDE2 $200 000-280 000; SDE3 $300 000-500 000; Google (Mountain View/NYC): L4 $250 000-350 000; L5 $350 000-500 000; Microsoft (Redmond): SDEII $190 000-280 000; Senior $280 000-420 000; Meta (Menlo Park/NYC/Seattle): E4 $230 000-320 000; E5 $320 000-500 000; Apple (Cupertino): ICT3 $200 000-290 000; ICT4 $280 000-420 000; Netflix (LA): IC5 $300 000-700 000 (no RSU; salary + perf bonus; все деньги наличными); СТОИМОСТЬ ЖИЗНИ SF Bay Area: аренда 1BR (San Jose): $2 500-3 500/мес; (SF proper): $3 000-4 500; Сиэтл: $1 800-2 800; NYC: $2 800-4 500; Austin TX: $1 400-2 200',
    seo_description: 'США H-1B виза IT 2026: H-1B ЛОТЕРЕЯ (обязательный путь для большинства): только через US-работодателя; employer подаёт electronic registration в марте ($10/registration); DHS проводит лотерею (random selection); при выигрыше employer подаёт полную петицию в апреле; I-129 Form; USCIS срок 6-9 мес (Premium Processing: $2 805 = 15 business days); 6-месячный cap-gap для OPT holders; шанс выигрыша: ~16-18% в 2024 (иногда 2-я лотерея для cap-gap); H-1B АЛЬТЕРНАТИВЫ БЕЗ ЛОТЕРЕИ: CAP-EXEMPT: universities/non-profits/research institutions (не попадают под cap 65 000; неограниченные H-1B); O-1A Extraordinary Ability: для выдающихся специалистов; 3 из 8 критериев Kazarian; обычно через иммиграционного адвоката ($5 000-15 000); срок 3 года + продление; NIW EB-2 National Interest Waiver: самономинация; без PERM; EB-1A (самый быстрый путь к GC без лотереи); TN Visa (для граждан Канады и Мексики; по CUSMA/USMCA; без лотереи); L-1A/L-1B (внутрикорпоративный перевод; для сотрудников международных компаний; без лотереи; L-1A leading to EB-1C GC); USCIS RFE тренды 2024: более строгая проверка speciality occupation requirement; ЗАРПЛАТЫ FAANG (total compensation включает base salary + stock/RSU + bonus): Google L5 Bay Area: Base $240k + Stock $400k/4yr + Bonus $50k = ~$340k/год total comp; Meta E5 NYC: Base $260k + RSU $400k/4yr + Bonus $55k = ~$375k/год; Amazon SDE3 Seattle: Base $230k + RSU $300k/4yr + Sign-on $90k (yr1) = ~$350k/год; Microsoft Senior Seattle: Base $220k + RSU $280k/4yr + Bonus $40k = ~$330k/год; Apple ICT4 Cupertino: Base $240k + RSU $320k/4yr + Bonus $45k = ~$350k; Netflix IC5 LA: Base $450k-700k (no RSU; salary only cash premium); ДАННЫЕ: levels.fyi; blind; glassdoor; прокси уровни (E4=L4=SDE2=ICT3=P3 приблизительно); СТОИМОСТЬ ЖИЗНИ SF Bay Area (Sunnyvale/San Jose): аренда 1BR: $2 500-3 500/мес; продукты: $600-1 000/мес; машина: $400-800/мес; жизнь итого: $5 000-7 000/мес; Сиэтл: $4 000-6 000/мес; NYC: $5 500-8 500/мес; Austin TX: $3 000-4 500/мес.',
    content_md: `# США H-1B виза для IT: лотерея 16%, FAANG $300k-500k, Green Card

H-1B — основной путь для IT-специалистов в США. Лотерея в марте: 16-18% шанс. Альтернативы без лотереи — O-1A, L-1, NIW. FAANG total comp $300 000-700 000+/год.

## H-1B: как работает лотерея

| Параметр | Значение |
|---------|---------|
| Квота | 65 000/год + 20 000 для MS graduates US |
| Заявок 2024 | ~400 000+ |
| Шанс выиграть | **~16-18%** |
| Регистрация | Март (electronic; $10) |
| Начало работы | 1 октября |
| Срок H-1B | 3 года + 3 года |

---

## Альтернативы H-1B без лотереи

| Виза | Подходит | Особенность |
|------|---------|------------|
| **O-1A** | Выдающиеся специалисты | 3 из 8 критериев; без лотереи |
| **L-1A/L-1B** | Сотрудники международных компаний | Внутрикорпоративный перевод |
| **TN** | Только граждане Канады/Мексики | По USMCA; без лотереи |
| **Cap-exempt H-1B** | Университеты/non-profits | Без лотереи |

---

## Green Card из H-1B

| Категория | Россия | Индия |
|----------|--------|-------|
| EB-2 (advanced degree) | 5-10 лет | 30+ лет |
| EB-1A (Extraordinary Ability) | 1-2 года | 1-2 года |
| EB-1C (CEO/Manager via L-1A) | 1-2 года | 1-2 года |

**EB-1A** — лучший путь для россиян: без PERM, без очереди, самономинация.

---

## FAANG зарплаты (total compensation)

| Компания/Уровень | Total Comp/год |
|----------------|----------------|
| Google L5 (Bay Area) | ~$340 000 |
| Meta E5 (NYC) | ~$375 000 |
| Amazon SDE3 (Seattle) | ~$350 000 |
| Microsoft Senior (Seattle) | ~$330 000 |
| Netflix IC5 (LA) | $450 000-700 000 (cash only!) |

**Total comp = Base Salary + RSU/год + Bonus.** Источник: levels.fyi

---

## Налоги США для H-1B

| Штат | Эффективная ставка ($200 000 доход) |
|------|-------------------------------------|
| Техас | ~35% (нет State Income Tax) |
| Вашингтон (Сиэтл) | ~35% (нет State Income Tax) |
| Флорида | ~35% |
| Нью-Йорк | ~45% |
| Калифорния | ~47% |

**FICA** (Social Security 6.2% + Medicare 1.45%) удерживается у всех H-1B holders.

---

## Стоимость жизни

| Город | Аренда 1BR | Жизнь итого/мес |
|-------|-----------|----------------|
| SF Bay Area | $2 500-3 500 | $5 000-7 000 |
| NYC | $2 800-4 500 | $5 500-8 500 |
| Seattle | $1 800-2 800 | $4 000-6 000 |
| Austin TX | $1 400-2 200 | $3 000-4 500 |

---

## Итого

США H-1B виза IT 2026: лотерея в марте (16-18% шанс; 65 000 мест); альтернативы без лотереи — O-1A/L-1A/cap-exempt; Green Card EB-1A для россиян (1-2 года; без PERM); FAANG total comp $300 000-700 000+; налоги: Техас/Сиэтл ~35% vs Калифорния ~47%; жизнь SF $5 000-7 000/мес; Austin $3 000-4 500/мес. Лучший путь для россиян: L-1A (через международную компанию) → EB-1C GC; или O-1A → EB-1A GC (без очереди).
`,
  },
  {
    slug: 'strakhovka-zhilye-bank-pervye-30-dney-2026',
    title: 'Первые 30 дней после переезда: страховка, жильё, банк, регистрация — чеклист 2026',
    tag: 'практика',
    read_time: 1,
    country_slug: null,
    seo_title: 'Первые 30 дней после переезда чеклист 2026: страховка, жильё, банк, регистрация: ПЕРВЫЕ 48 ЧАСОВ: 1. Temporary housing (Airbnb/Booking.com/sublet на 2-4 нед пока ищешь долгосрочное); 2. Местная SIM-карта (купить в аэропорту или операторе; нужна для банка/Booking/deliveroo/Uber/Bolt); 3. Транспортная карта (где есть: Oyster London / Navigo Paris / Monatskarte Berlin / BKK Budapest); ПЕРВАЯ НЕДЕЛЯ: 4. Медицинская страховка (если не куплена заранее: SafetyWing Nomad или Cigna Global; в EU при работе подождать оформления local GKV/Zorgverzekering); 5. Банковский счёт (в EU: N26 или Revolut европейский без требования местной прописки; IBAN = можно получить зарплату; Wise Multi-currency тоже; местный банк — часто нужна регистрация; в Грузии: TBC/BoG = можно без ВНЖ с паспортом лично в отделении; в Польше: PKO BP / ING / mBank = нужна регистрация (Zameldowanie); в Германии: N26 или Deutsche Bank = нужна Anmeldung (регистрация) иногда; DKB без Anmeldung); 6. Симка с локальным номером (если покупал туристическую — перейти на локальный тариф или контракт); ВТОРАЯ НЕДЕЛЯ: 7. Официальная регистрация (Anmeldung Германия = в Bürgeramt; в течение 14 дней от въезда; нужен Wohnungsgeberbestätigung от хозяина; в Польше: Zameldowanie = в Urzędzie Gminy; в Нидерландах: gemeente (муниципалитет) = BSN номер; в Испании: Empadronamiento = в Ayuntamiento; BSN/NIE/Steuernummer = основа для банка и работодателя); 8. Долгосрочное жильё (через Immobilienscout24.de / Hemnet.se / Rightmove.co.uk / Funda.nl / Idealista.es / OLX Польша); ТРЕТЬЯ-ЧЕТВЁРТАЯ НЕДЕЛЯ: 9. ВНЖ подача документов (если нужен ВНЖ: подача в иммиграционном органе; записаться по возможности онлайн заранее); 10. Транспорт (купить/арендовать машину если нужна; оформить страховку; если EU = международные права действуют 3-6 мес, потом обмен); 11. Местный врач / GP (в EU: зарегистрироваться в поликлинике/GP practice; в UK: NHS GP registration; в DE: выбрать Hausarzt; в NL: huisarts); 12. Налоговый номер (IdNr в Германии = приходит почтой через 2-3 нед после Anmeldung; BSN в Нидерландах = при регистрации в Gemeente; NIE в Испании = заявка в Policia Nacional; TIN в Польше = NIP; уточнить у работодателя)',
    seo_description: 'Первые 30 дней после переезда 2026: МАСТЕР-ЧЕКЛИСТ ПО НЕДЕЛЯМ: ДЕНЬ 1-2 (ПРИЛЁТ): временное жильё (Airbnb / субаренда 2-4 нед); местная SIM-карта (аэропорт или оператор; нужна для всего дальнейшего); транспортная карта (Oyster/Navigo/BVG/Metrocard); конвертация/снятие наличных; НЕДЕЛЯ 1: медицинская страховка (SafetyWing $45+/мес если не куплена); базовый банковский счёт (N26/Revolut EU IBAN без регистрации; Wise Multi-currency); НЕДЕЛЯ 2: официальная регистрация по месту жительства (обязательна в EU): DE: Anmeldung в Bürgeramt (до 14 дней с въезда; нужен Wohnungsgeberbestätigung); PL: Zameldowanie в Urząd Gminy; NL: Inschrijving в Gemeente (BSN получаешь там); ES: Empadronamiento в Ayuntamiento; FR: Mairie; AT: Meldezettel; LT: Deklaravimas; поиск долгосрочного жилья (Immobilienscout24/Idealista/Funda/Hemnet/OLX); НЕДЕЛЯ 3-4: подача на ВНЖ/Karta Pobytu/Aufenthaltstitel (запись заранее!); получение налогового номера (зависит от страны): DE: IdNr приходит почтой через 2-3 нед после Anmeldung; NL: BSN выдаётся в Gemeente; ES: NIE в Policia Nacional; PL: NIP через US (Urząd Skarbowy); регистрация у местного GP/Hausarzt/Huisarts (обязательно для медстраховки); переход на местный или local телефонный контракт; УПРАВЛЕНИЕ ФИНАНСАМИ в первые 30 дней: сохраняй все receipts (аренда/отель/расходы): нужно для налоговой и возможно налогового вычета; уведоми ИФНС РФ об открытии иностранного счёта (30 дней от открытия; штраф 5 000 руб); сохрани информацию о всех счетах; ПСИХОЛОГИЯ ПЕРВЫХ НЕДЕЛЬ: адаптационная кривая: первые 2 нед — эйфория или шок; 3-6 нед — разочарование (honeymoon period ends); 3-6 мес — принятие и рутина; план действий: найти 1-2 expat группы (Internations.org; Meetup.com; русские Telegram чаты в городе); не изолироваться; установить хотя бы 1 рутину (кафе каждое утро; gym); не принимать больших финансовых решений в первые 2 мес.',
    content_md: `# Первые 30 дней после переезда: мастер-чеклист 2026

Самые важные шаги — регистрация (Anmeldung/Zameldowanie) и банковский счёт. Делай их в конце 1-й недели, до остального не сдвинуться.

---

## День 1-2: прилёт

| Задача | Как |
|--------|-----|
| Временное жильё | Airbnb / Booking.com / sublet на 2-4 нед |
| Местная SIM-карта | В аэропорту или у оператора |
| Транспортная карта | Oyster / Navigo / BVG Monatskarte |
| Наличные | Снять в банкомате или обменять |

---

## Неделя 1: базовая инфраструктура

| Задача | Детали |
|--------|--------|
| Медицинская страховка | SafetyWing $45+ если не куплена заранее |
| Базовый банк (без регистрации) | N26 / Revolut EU / Wise — IBAN сразу |
| Связь | Местный тариф вместо туристического |

---

## Неделя 2: регистрация — самое важное

| Страна | Что делать | Срок |
|--------|-----------|------|
| **Германия** | Anmeldung в Bürgeramt + Wohnungsgeberbestätigung от хозяина | До 14 дней |
| **Польша** | Zameldowanie в Urzędzie Gminy | — |
| **Нидерланды** | Inschrijving в Gemeente (BSN выдаётся там) | — |
| **Испания** | Empadronamiento в Ayuntamiento | — |

**Без регистрации нет:** налогового номера, нормального банка, иногда работодатель не может платить.

**Поиск долгосрочного жилья:**
- DE: ImmobilienScout24, Wohnungsbörse
- NL: Funda.nl
- ES: Idealista.es
- PL: OLX / Otodom
- SE: Hemnet.se

---

## Неделя 3-4: официальные документы

| Задача | Как |
|--------|-----|
| Подача на ВНЖ | Записаться онлайн заранее |
| Налоговый номер | DE: IdNr почтой; NL: BSN в Gemeente; ES: NIE в Policia |
| Регистрация у GP/Hausarzt | Обязательно для медстраховки |
| Уведомить ИФНС РФ | Об иностранном счёте (30 дней от открытия) |

---

## Финансы в первые 30 дней

| Задача | Зачем |
|--------|-------|
| Сохранять все receipts | Для налоговой и вычетов |
| Уведомить ИФНС РФ | Об иностранном счёте (штраф 5 000 руб если пропустить) |
| Не трогать экстренный резерв | На непредвиденное в первые 3 мес |

---

## Психология адаптации

| Период | Что происходит |
|--------|---------------|
| 1-2 нед | Эйфория или культурный шок |
| 3-6 нед | Разочарование (honeymoon ends) |
| 3-6 мес | Принятие и рутина |

**Что помогает:**
- Найти 1-2 expat группы (Internations.org / Meetup.com / русские Telegram)
- Установить хотя бы 1 рутину (кафе/gym)
- Не принимать больших финансовых решений первые 2 мес

---

## Итого

Первые 30 дней после переезда 2026: SIM-карта в аэропорту → N26/Revolut без регистрации → регистрация (Anmeldung/Zameldowanie) за 1 нед → налоговый номер → ВНЖ подача → местный GP; уведомить ИФНС РФ об иностранном счёте в течение 30 дней; сохранять receipts; не изолироваться — Internations/Meetup в первые 2 нед.
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
console.log(`\nБатч 184: ${ok} OK, ${err} ошибок`);
