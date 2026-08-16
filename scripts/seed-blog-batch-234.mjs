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
    slug: 'tailand-bangkok-chiangmaj-dn-2026',
    title: 'Таиланд Бангкок Чиангмай DN 2026: LTR Visa 10 лет, Agoda, True Move, тайская еда',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Таиланд Бангкок Чиангмай DN 2026 LTR Visa 10 лет Agoda тайская еда дешево',
    seo_description: 'Таиланд Бангкок Чиангмай 2026 LTR Visa 10 лет Agoda DTGO дешево pad thai massaman: ТАИЛАНД ДЛЯ IT DN В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ТАИЛАНД: ДЕШЕВИЗНА: один из самых доступных DN-хабов Азии; $500-800/мес КОМФОРТНО в Чиангмае; CHIANG MAI: Digital Nomad Hub мирового уровня (PIMD.co; Nomad List #1 Hub многие годы); стоимость ниже Бангкока; горы; природа; храмы; FOOD: pad thai (рисовая лапша с яйцом; ростками фасоли; арахисом); massaman curry (исламский карри; TIME назвал лучшим едой мира 2011); som tum (зелёная папайя); mango sticky rice; khao man gai (рис с курицей); рынки (Chatuchak Bangkok; Night Bazaar Chiang Mai); КУЛЬТУРА: Буддизм Тхеравада (95% населения!); Сонгкран (Новый год апрель; водная битва!); Ой Крати (плоты на реке); ват Пхра Кео (Изумрудный Будда); ват Пхо (лежачий Будда 46 м); ИСТОРИЯ: Королевство Аюттхая (1351-1767); Королевство Сиам; единственная страна ЮВА никогда не колонизированная (осталась свободной!); военные перевороты (12+ за 1932-2020); военный переворот 2014; новая конституция 2017; Вачиралонгкорн (Рама X) = нынешний король; ПРИРОДА: острова (Самуи; Пхукет; Пхи-Пхи; Краби; Ко Таo); национальные парки (Дои Интханон; Кхао-Яй UNESCO); ВРЕМЕННАЯ ЗОНА: ICT UTC+7; EU: большая разница; лучше для Азии; ЯЗЫКИ: тайский (очень сложный; тональный; 5 тонов; своя письменность); английский в туристических зонах = достаточно; в IT-компаниях = достаточно; ВИЗЫ ТАИЛАНД: 1. LTR VISA (LONG-TERM RESIDENT): ЗОЛОТО ДЛЯ DN И IT: СРОК: 10 ЛЕТ (!); ДЛЯ REMOTE PROFESSIONALS: доход из иностранного источника мин $80 000/год (OR $40 000/год с дипломом + 5 лет опыта OR $80 000+ активы); СТОИМОСТЬ: THB 50 000 (~$1 400) однократно; ПРЕИМУЩЕСТВА: 10 лет без хлопот с визами; работать на иностранные компании из Таиланда; 17% flat tax на доходы, облагаемые в Таиланде (vs стандартный до 35%); FAST TRACK в аэропортах; Thailand Privilege Card чуть дешевле; 2. THAILAND PRIVILEGE (EX-ELITE): 5-20 лет; THB 500 000-2 000 000 ($14 000-56 000); без требований к доходу; 3. TOURIST VISA: 30 дней без визы (граждане РФ); продляется 1 раз в BO; визаран в Малайзию/Мьянму; 4. NON-O/OA (RETIREMENT): 50+ лет; депозит THB 800 000 ($22 000) в тайском банке OR пенсия THB 65 000/мес; 5. ED VISA (СТУДЕНЧЕСКАЯ): через языковую школу; работать нельзя; использовалась как визаран раньше; НАЛОГИ ТАИЛАНД: ДО 2024: иностранный доход НЕ облагался если не ввезён в тайский год; ПОСЛЕ 2024: иностранный доход облагается если ввезён в Таиланд В ТОМ ЖЕ ГОДУ (раньше "следующий год" = не облагается); ставки НДФЛ: 0% до THB 150 000/год; 5% до THB 300 000; 10% до THB 500 000; 15% до THB 750 000; 20% до THB 1M; 25% до THB 2M; 30% до THB 5M; 35% свыше; LTR VISA: 17% flat для тех кто работает на иностранцев; LTR VISA: ОСВОБОЖДЕНИЕ от тайского налога на иностранный доход; РЫНОК IT ТАИЛАНД: AGODA ($10B+ как часть Booking Holdings; HEADQUARTERS Bangkok!; travel tech; 4 000+ employees); TRUE MOVE H (telecom; 5G; digital transformation; Charoen Pokphand Group CP); AIS (Advanced Info Service; telecom; fintech); KBTG (KasikornBank Tech Group; fintech; крупнейший tech bank); GRAB Thailand (крупный офис; ride-hailing); LAZADA Thailand (e-commerce; Alibaba); DTGO (real estate tech; Magnolias; $10B+); SCBX (SCB X Public Company; fintech + VC; $5B); ЗАРПЛАТЫ IT ТАИЛАНД (GROSS THB; 1 USD = 33-35 THB): БАНГКОК (LOCAL): Junior: THB 25 000-45 000/мес ($714-1 286); Middle: THB 45 000-80 000 ($1 286-2 286); Senior: THB 80 000-140 000 ($2 286-4 000); AGODA/KBTG Senior: THB 100 000-200 000 ($2 857-5 714); REMOTE EU/US: $3 000-12 000/мес (при $3k/мес = $36k/год → LTR не хватает $80k; но Tourist+визаран OR Privilege Card); СТОИМОСТЬ ЖИЗНИ ТАИЛАНД 2026: ЧИАНГМАЙ (DN HUB #1): АРЕНДА: 1-комн Old City; Nimmanhaemin: THB 8 000-15 000/мес ($229-429); 1-комн дальше: THB 5 000-10 000 ($143-286); СОВМЕСТНЫЙ КОВОРКИНГ ЧИАНГМАЙ: CAMP Maya; MANA (очень популярен); Think Park; БАНГКОК: 1-комн Sukhumvit; Silom; Sathorn: THB 15 000-35 000 ($429-1 000); 1-комн Thonglor; Ari: THB 20 000-50 000; ПРОДУКТЫ: pad thai у уличного торговца: THB 60-100 ($1.71-2.86); massaman curry в ресторане: THB 120-200 ($3.43-5.71); mango sticky rice (десерт): THB 60-80; Leo Beer 0.5л в ресторане: THB 90-130; продукты Tops; Lotus (7-Eleven везде!): THB 5 000-9 000/мес ($143-257); ТРАНСПОРТ: BTS Skytrain Bangkok: THB 17-47/поездка; месячный: THB 800-1 500; сонгтео Чиангмай: THB 20-40; мотобайк аренда: THB 2 500-4 000/мес; КЛИМАТ: tropical monsoon; HOT (март-май +38-40!); RAINY (июнь-октябрь; ливни; но быстро); COOL (ноябрь-февраль +20-30; лучший сезон; Чиангмай +15-25 ночью); Чиангмай: влажность ниже; горный бриз',
    content_md: `# Таиланд Бангкок Чиангмай DN 2026: LTR Visa 10 лет, Agoda HQ, тайская кухня

Таиланд — LTR Visa (10 лет, $80k+ доход/год). Chiang Mai = мировой DN-хаб #1 (Nomad List). Agoda (штаб-квартира в Бангкоке, часть Booking Holdings). Pad thai $1.71, аренда от $143/мес. Никогда не колонизирован.

---

## LTR Visa (Long-Term Resident)

| Параметр | Значение |
|---------|---------|
| Срок | 10 лет |
| Доход | $80 000/год (или $40k + диплом + 5 лет опыта) |
| Стоимость | THB 50 000 ($1 400) однократно |
| Налог | 17% flat (vs стандартный до 35%) |
| Иностранный доход | Освобожден от тайского налога |

---

## IT-экосистема

| Компания | Профиль |
|---------|---------|
| **Agoda** | **$10B+; HQ Бангкок; часть Booking Holdings** |
| KBTG | KasikornBank tech; fintech; leading |
| SCBX | SCB X fintech + VC; $5B |
| True Move H | Telecom; 5G; CP Group |

---

## Стоимость жизни

| Город/Район | Аренда 1-комн THB/мес | USD/мес |
|-------------|---------------------|---------|
| **Чиангмай центр** | **8 000-15 000** | **$229-429** |
| Чиангмай дальше | 5 000-10 000 | $143-286 |
| Бангкок центр | 15 000-35 000 | $429-1 000 |

---

## Итого

Таиланд DN 2026: LTR Visa 10 лет ($80k доход); Чиангмай = DN хаб #1 (от $143/мес); Agoda HQ Bangkok; pad thai $1.71; иностранный доход: изменения с 2024 (ввезенный в тот же год облагается налогом); НДФЛ до 35% (или LTR 17%); Tourist 30 дней без визы (РФ); страна никогда не колонизирована; лучший сезон ноябрь-февраль; острова Самуи/Пхи-Пхи.
`,
  },
  {
    slug: 'novaya-zelandiya-oklend-vellington-it-2026',
    title: 'Новая Зеландия Окленд Веллингтон IT 2026: Green List, Weta Digital, хоббиты, природа',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Новая Зеландия Окленд IT 2026 Green List Weta Digital хоббиты природа жизнь',
    seo_description: 'Новая Зеландия Окленд Веллингтон IT 2026 Green List Weta Digital хоббиты природа маори: НОВАЯ ЗЕЛАНДИЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ НЗ: WETA DIGITAL: основана Питером Джексоном (Властелин Колец); $800M продан Unity; 3D спецэффекты; Avatar; King Kong; Planet of the Apes; Властелин Колец; Хоббит; ХОББИТЫ: весь Шир снят в НЗ (Хоббитон в Матамате; открыт для туристов!); НЗ = «Middle-Earth»; ПРИРОДА: фьорды Фьордленд (Милфорд Саунд; UNESCO); вулканы (Тонгариро National Park; также Мордор в фильме!); горы Южные Альпы (Aoraki/Mt Cook 3 724 м); пляжи (Bay of Islands; Coromandel); Rotorua (гейзеры; маорийская культура; запах серы!); Marlborough Sound (виноградники + фьорды); МАОРИ: коренной народ; с 1000 г. до прихода европейцев; хака (боевой танец; All Blacks!); язык маори = официальный; 16% населения; Waitangi Treaty (1840; первый договор с британской короной); ИСТОРИЯ: Голландец Тасман (1642); Кук (1769); колония Великобритании (1840); первая страна мире давшая женщинам право голоса (1893!); Австралия vs НЗ: схожи но разные (НЗ строго против ядерного оружия); СПОРТ: All Blacks (регби; #1 в мире; хака перед матчем); ВРЕМЕННАЯ ЗОНА: NZST UTC+12/+13; EU: на 10-13 часов вперёд; почти противоположный; Азия: лучше; ЯЗЫКИ: английский; маори (официальный); ВИЗЫ НЗ: 1. GREEN LIST OCCUPATION (РАБОТА): SKILL SHORTAGE LIST = зелёный список профессий с дефицитом; IT-специальности включены (Software Developer; Systems Analyst; ICT Project Manager; Network Admin; Database Admin); ТРЕБОВАНИЕ: job offer от NZ-работодателя + профессия в Green List; прямое ПМЖ или ускоренный путь к ПМЖ; 2. SKILLED MIGRANT VISA: очки; 6+ = шанс; учитывают зарплату; опыт; образование; 3. ACCREDITED EMPLOYER WORK VISA (AEWV): через аккредитованного работодателя НЗ; до 3-5 лет; ведёт к ПМЖ; 4. GLOBAL IMPACT VISA: инновационные компании; партнёрство Callaghan Innovation; ГРАЖДАНСТВО: ПМЖ + 5 лет в НЗ из которых 240 дней/год = гражданство; двойное: разрешено; паспорт НЗ: 187 стран; РЫНОК IT НЗ: WETA DIGITAL ($800M продан Unity 2021; спецэффекты #1 мира; Avatar; LOTR; основан Питером Джексоном 1993); WETA WORKSHOP (отдельная компания; физические эффекты; оружие; костюмы; LOTR); XERO ($10B ASX+NASDAQ; accounting SaaS; New Zealand origin!); VISTA GROUP ($900M ASX; cinema technology; кинотеатры по миру); ORION HEALTH ($500M; healthcare IT); DATACOM (IT services; NZ+AU; outsourcing; $1B+); AIR NEW ZEALAND (digital transformation; tech); ASB BANK; ANZ NZ; BNZ (banking tech); CALLAGHAN INNOVATION (innovation agency + tech spinoffs); ЗАРПЛАТЫ IT НЗ (GROSS NZD; 1 USD = 1.62 NZD): ОКЛЕНД: Junior: NZD 60 000-85 000/год ($37 037-52 469); Middle: NZD 85 000-120 000 ($52 469-74 074); Senior: NZD 120 000-180 000 ($74 074-111 111); Xero/Weta Senior: NZD 140 000-220 000 + equity; ВЕЛЛИНГТОН (немного ниже): подобно Окленду -10%; НАЛОГИ НЗ (IRD): НДФЛ: 10.5% до NZD 14 000; 17.5% до NZD 48 000; 30% до NZD 70 000; 33% до NZD 180 000; 39% свыше; эффективная ставка при NZD 120 000: ~26%; без CGT (Capital Gains Tax) нет!; GST (НДС): 15%; KIWISAVER: добровольная пенсионная схема; взносы 3%+ от gross; работодатель минимум 3%; очень выгодна; СТОИМОСТЬ ЖИЗНИ НЗ 2026: ОКЛЕНД (ДОРОГОЙ): АРЕНДА: 2-комн Ponsonby; Parnell; Mount Eden: NZD 2 500-3 800/мес ($1 543-2 346); 2-комн South Auckland: NZD 1 800-2 600 ($1 111-1 605); ВЕЛЛИНГТОН: 2-комн Te Aro; Mount Victoria: NZD 2 200-3 200 ($1 358-1 975); КРАЙСТЧЁРЧ (ДЕШЕВЛЕ; ГОРЫ РЯДОМ!): 2-комн: NZD 1 600-2 400 ($988-1 481); ПРОДУКТЫ: hangi (маорийская запеченная еда в яме): на фестивале; meat pie (культурный продукт!): NZD 5-9 ($3.09-5.56); flat white (схожо с AU): NZD 5-7 ($3.09-4.32); продукты Countdown; New World; PAK nSAVE: NZD 600-1 100/мес ($370-679); ТРАНСПОРТ: AT Metro Auckland: NZD 2-5/поездка; HOP card месячный: NZD 250-350 ($154-216); авто обязательно в большинстве районов; КЛИМАТ: умеренный морской; Окленд: мягкий; зима +8-14; лето +24-28; Веллингтон: ВЕТЕР! (столица ветра по прозвищу Wellington!); Южный остров: альпийский; Крайстчёрч: 4 сезона; горнолыжные курорты зимой',
    content_md: `# Новая Зеландия Окленд IT 2026: Green List, Xero $10B, Weta Digital, хоббиты

НЗ — Green List: IT-специальности = ускоренный путь к ПМЖ. Xero ($10B; accounting SaaS; из НЗ). Weta Digital (Avatar, LOTR; основана Питером Джексоном). Нет CGT. Хоббитон в Матамате — открыт для посещения.

---

## Green List (Skill Shortage)

| Параметр | Значение |
|---------|---------|
| IT-профессии | Software Dev; Systems Analyst; ICT PM; DBA; Network Admin |
| Требование | Job offer от NZ-работодателя |
| Результат | Прямое ПМЖ или ускоренный путь |
| Нет CGT | Налога на прирост капитала нет |

---

## IT-экосистема

| Компания | Оценка | Профиль |
|---------|--------|---------|
| **Xero** | **$10B** | **Accounting SaaS; ASX+NASDAQ; из НЗ** |
| Weta Digital | $800M | Spецэффекты Avatar/LOTR; основана Джексоном |
| Vista Group | $900M | Cinema technology; мировой охват |
| Datacom | $1B+ | IT-аутсорсинг; НЗ+AU |

---

## Стоимость жизни

| Город | Аренда 2-комн NZD/мес | USD/мес |
|-------|--------------------|---------|
| Окленд центр | 2 500-3 800 | $1 543-2 346 |
| **Крайстчёрч** | **1 600-2 400** | **$988-1 481 (горы рядом!)** |

---

## Итого

НЗ IT 2026: Green List (IT-профессии → ПМЖ); Xero ($10B; бухгалтерский SaaS); Weta Digital (Avatar; LOTR; основан Питером Джексоном); нет CGT!; KiwiSaver (пенсия; 3% + 3% работодатель); гражданство 5 лет ПМЖ + 240 дней/год; Хоббитон (Шир; Матамата); Фьордленд UNESCO; All Blacks хака; Wellington = "столица ветра"; дорого (сопоставимо с AU).
`,
  },
  {
    slug: 'yuzhno-koreya-seul-busan-it-2026',
    title: 'Южная Корея Сеул IT 2026: D-8 Tech Visa, Samsung, Kakao, NAVER, K-culture',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Южная Корея Сеул IT 2026 D-8 Tech Visa Samsung Kakao NAVER K-culture жизнь',
    seo_description: 'Южная Корея Сеул IT 2026 D-8 Tech Visa Samsung Kakao NAVER K-culture bibimbap: ЮЖНАЯ КОРЕЯ ДЛЯ IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ ЮК: SAMSUNG: $300B+ (Samsung Electronics; память; смартфоны; чипы; дисплеи); $400B Group всего; GLOBAL TECH HUB: NAVER ($23B; корейский Google; Maps; Webtoon; HyperCLOVA X); KAKAO ($10B; KakaoTalk 94% населения!; Kakao Pay; Kakao Mobility; Kakao Entertainment); K-CULTURE: K-Pop (BTS; BLACKPINK; Stray Kids); K-Drama (Squid Game; Parasite; Goblin; Crash Landing on You); K-Food (bibimbap; bulgogi; tteokbokki; samgyeopsal; ramyeon); СКОРОСТЬ ИНТЕРНЕТА: Корея регулярно #1 в мире по скорости; 5G охват 95%+; ОБРАЗОВАНИЕ: KAIST (Корейский продвинутый институт науки; #1 в Азии для IT); SNU; Yonsei; Korea University; ИСТОРИЯ: Goryeo (918-1392; откуда Корея!); Joseon (1392-1897); Японская оккупация (1910-1945; очень болезненная); Разделение 1945 (38-я параллель); Корейская война 1950-1953; перемирие (МИРА НЕ ПОДПИСАНО до сих пор!); экономическое чудо 1960-1980-е (Saemaul Undong); Samsung; Hyundai; LG; Lotte = chaebols; ПРИРОДА: горы (Seoraksan; Hallasan на Чеджу); Чеджу-до (остров; UNESCO; вулканический); Мёоде; Пусан (пляжи + порт #1 Кореи); ВРЕМЕННАЯ ЗОНА: KST UTC+9; хорошо для Японии; средне для Австралии; ЯЗЫКИ: корейский (агглютинативный; своя письменность ханыль; 1443 г.; считается лингвистически изолированным); английский в IT = стандарт; основная часть документации и интерфейсов EN; русский не распространён; ВИЗЫ КОРЕЯ: 1. D-8 (CORPORATE INVESTMENT VISA): регистрация корейской компании (min KRW 300M ~$220 000 инвестиций) → D-8; подходит для серьёзных инвесторов; 2. E-7 (PROFESSIONAL EMPLOYMENT): через корейского работодателя; конкретные специальности (IT включены); стандартный путь для работы; 3. F-2 (POINT SYSTEM): очки за образование; опыт; зарплату; корейский язык; возраст; F-2 = постоянный резидент почти; 4. D-10 (JOB SEEKER): поиск работы; 6 мес; нужен диплом; 5. OVERSEAS KOREANS (F-4): для диаспоры корейского происхождения; широкие права; ПМЖ: F-5 через 5 лет легального пребывания + требования; ГРАЖДАНСТВО: 5 лет ПМЖ + корейский язык (TOPIK 3+) + гражданский экзамен; двойное: В ОБЩЕМ НЕ РАЗРЕШЕНО (исключения: этнические корейцы; дети до 22 лет могут иметь двойное); паспорт Кореи: 192 страны (#2 в мире наравне с DE/FI!); РЫНОК IT КОРЕЯ: SAMSUNG ($300B+ Electronics alone; DRAM/NAND memory #1; Exynos chips; Galaxy; display; home appliances; Bixby AI); LG ($50B; OLED дисплеи #1; tvOS webOS; LG Uplus telco; CLOi robots); NAVER ($23B; Korean Google; Maps; Shopping; Webtoon; Cafe; Line (Япония); HyperCLOVA X LLM); KAKAO ($10B; KakaoTalk 94% Корея; Kakao Pay $2B; Kakao Mobility; KakaoTv; Kakao Entertainment; Kakao Games); SK TELECOM ($20B; 5G; AI; T map; ifland metaverse); KT ($8B; telecom; GiGA Genie AI speaker); KRAFTON ($5B; PUBG!; BATTLEGROUNDS; Battlegrounds Mobile India); SMILEGATE ($2B; CrossFire; Epic Games partner); KRAFTON; WEMADE; NCSOFT; NEXON (игры!); ЗАРПЛАТЫ IT КОРЕЯ (GROSS KRW; 1 USD = 1 350 KRW): СЕУЛ: Junior: KRW 3 500 000-5 000 000/мес ($2 593-3 704); Middle: KRW 5 000 000-8 000 000 ($3 704-5 926); Senior: KRW 8 000 000-15 000 000 ($5 926-11 111); Samsung/Kakao/NAVER Senior: KRW 10 000 000-25 000 000 ($7 407-18 519); НАЛОГИ КОРЕЯ: НДФЛ: 6% до KRW 14M/год; 15% до KRW 50M; 24% до KRW 88M; 35% до KRW 150M; 38% до KRW 300M; 40% до KRW 500M; 42% до KRW 1B; 45% свыше; местный подоходный налог 10% от НДФЛ; социал (National Pension NPS): 4.5% работник + 4.5% работодатель; NHIS медстраховка: 3.545% работник; СТОИМОСТЬ ЖИЗНИ КОРЕЯ 2026: СЕУЛ: АРЕНДА: традиционная система JEONSE (ключевой депозит 50-80% стоимости; аренда = 0 в месяц; УНИКАЛЬНО!); WOLSE (ежемесячная): 2-комн Gangnam; Itaewon; Mapo: KRW 1 200 000-2 500 000/мес ($889-1 852); 2-комн Dobong; Gwanak; Nowon: KRW 700 000-1 300 000 ($519-963); ПУСАН (ДЕШЕВЛЕ НА 30%): 2-комн: KRW 600 000-1 100 000 ($444-815); ПРОДУКТЫ: bibimbap (рис с овощами и яйцом): KRW 7 000-12 000 ($5.19-8.89); samgyeopsal (свиная грудинка на гриле; национальный ритуал + соджу): KRW 12 000-18 000/порция; tteokbokki (рисовые клецки в остром соусе; уличная еда): KRW 3 000-6 000; Soju (соджу; мин 20%; национальный алкоголь; самый продаваемый дистиллят в мире!): KRW 1 200-2 500; продукты E-Mart; HomePlus; Lotte Mart: KRW 350 000-700 000/мес; ТРАНСПОРТ: Seoul Metro: KRW 1 400-2 100/поездка; T-Money месячный: KRW 55 000 (~$41); КЛИМАТ: Сеул: зима -5 до -10 (ХОЛОДНО!); лето +30-35 (влажное; сезон дождей тэфун июль-сентябрь); Пусан: мягче; Чеджу: субтропический',
    content_md: `# Южная Корея Сеул IT 2026: E-7 Visa, Samsung $300B, Kakao, NAVER, PUBG

Корея — Samsung ($300B; память; чипы; Galaxy). NAVER ($23B; корейский Google + HyperCLOVA X). Kakao ($10B; KakaoTalk 94% населения). PUBG (Krafton $5B). Интернет #1 в мире по скорости. Паспорт #2 в мире (192 страны).

---

## Визы

| Виза | Путь |
|------|------|
| E-7 | Через корейского работодателя; IT включены |
| D-10 | Поиск работы; 6 мес; нужен диплом |
| F-2 | Point system; почти постоянный резидент |
| F-5 (ПМЖ) | После 5 лет легального пребывания |

---

## IT-экосистема

| Компания | Оценка | Профиль |
|---------|--------|---------|
| **Samsung Electronics** | **$300B+** | **DRAM #1; Galaxy; Exynos чипы** |
| NAVER | $23B | Корейский Google; Webtoon; HyperCLOVA X |
| Kakao | $10B | KakaoTalk 94%; Pay; Mobility; Games |
| Krafton | $5B | PUBG; Battlegrounds |

---

## Особенности аренды

Jeonse — уникальная корейская система: крупный депозит 50-80% стоимости квартиры → ежемесячная аренда = 0. Wolse = обычная ежемесячная оплата.

---

## Итого

Корея IT 2026: Samsung ($300B; DRAM #1); NAVER (HyperCLOVA X); Kakao (KakaoTalk 94%); PUBG; E-7 через работодателя; НДФЛ до 45%; Jeonse (уникальная система депозита); интернет #1 в мире; паспорт #2 (192 страны); двойное НЕ разрешено; bibimbap $5; samgyeopsal + соджу = национальный ритуал; зима -10 в Сеуле.
`,
  },
  {
    slug: 'kolumbiya-bogota-medellin-dn-it-2026',
    title: 'Колумбия Богота Медельин DN IT 2026: Digital Nomad Visa, Rappi $5B, вечная весна',
    tag: 'страны',
    read_time: 2,
    country_slug: null,
    seo_title: 'Колумбия Богота Медельин DN IT 2026 Digital Nomad Visa Rappi вечная весна кофе',
    seo_description: 'Колумбия Богота Медельин 2026 Digital Nomad Visa Rappi вечная весна кофе arepa: КОЛУМБИЯ ДЛЯ DN IT В 2026 — КЛЮЧЕВЫЕ ФАКТЫ: ПОЧЕМУ КОЛУМБИЯ: MEDELLIN: «Вечная весна» (+18-25 круглый год!); некогда опасный город наркоторговли → один из самых трансформированных городов мира; инфраструктура Metrocable (фуникулёр в трущобы!); Urban Innovation Award; ЦЕНООБРАЗОВАНИЕ: один из лучших соотношений цена/качество в Латинской Америке; RAPPI: $5B unicorn; суперапп доставки; основан в Боготе; работает в 9 странах ЛА; КОФЕ: Колумбия = ведущий производитель арабики (мягкий; non-bitter); UNESCO Кофейный Культурный Ландшафт (Кофейный Треугольник; Caldas+Quindio+Risaralda; 2011); ПРИРОДА: Анды (три хребта; Кордильеры); Карибское (Картахена; Santa Marta; Тайрона) + Тихоокеанское побережье; Амазония; La Ciudad Perdida; Caño Cristales (река 5 цветов; самая красивая в мире по оценкам); ИСТОРИЯ: Доколумбовая: Muisca; Tairona; Quimbaya; (Эльдорадо — легенда Муиска!); Испанская колония (1499); независимость 1819 (Боливар!); Великая Колумбия → Колумбия; история Пабло Эскобара (1980-90е); трансформация 2010-е; КУЛЬТУРА: Шакира (родилась в Барранкилья!); Габриэль Гарсия Маркес (Маркес; «Сто лет одиночества»; Нобель 1982); Ботеро (толстые фигуры; Plaza Botero Medellin!); ВРЕМЕННАЯ ЗОНА: COT UTC-5; хорошо для US East; EU: большая разница; ЯЗЫКИ: испанский; английский в Боготе/Медельине в IT = достаточно; ВИЗЫ КОЛУМБИЯ: 1. DIGITAL NOMAD VISA (VISA DE NÓMADA DIGITAL; с 2022): ТРЕБОВАНИЯ: доход минимум 3x минимальная зарплата Колумбии = примерно $700/мес (COP 3.9M); иностранный работодатель или клиент; медстраховка; СРОК: 2 года; РАЗРЕШАЕТ: жить и работать удалённо; не платить колумбийский подоходный налог (если не в колумбийской компании); СТОИМОСТЬ: ~$50-80; 2. TOURIST VISA: граждане РФ = 90 дней (автоматически при въезде); 3. MIGRANT VISA М (через работодателя): для работы в колумбийской компании; 4. RESIDENT VISA R: долгосрочный; через брак; рождение детей; или 5 лет законного пребывания; НАЛОГИ КОЛУМБИЯ: ДЛЯ NON-RESIDENT (менее 183 дней/год): 35% flat на колумбийский доход; ДЛЯ RESIDENT: прогрессивный 0-39%; ДЛЯ DN VISA: если работаешь на иностранцев = по факту 0% (не Colombia-sourced); РЫНОК IT КОЛУМБИЯ: RAPPI ($5B; delivery super app; Bogota; 9 countries; основатели: Simon Borrero; Sebastian Mejia; Felipe Villamarin); BANCOLOMBIA (крупнейший банк Колумбии; digital banking; $15B); GRUPO EXITO (retail; e-commerce; Carulla; Exito); TIGO (телеком; часть Millicom); CLARO (телеком; América Móvil; Digital Claro); MERCADO LIBRE (аргентинский но крупнейший офис разработки; $70B NASDAQ); VTEX ($3B NYSE; e-commerce SaaS; бразильский но офис Bogota); LULO BANK ($1B; fintech); NEQUI (bancolombia digital; $2B); ЗАРПЛАТЫ IT КОЛУМБИЯ (GROSS COP; 1 USD = 4 000-4 200 COP): LOCAL: Junior: COP 4-8M/мес ($952-1 905); Middle: COP 8-15M ($1 905-3 571); Senior: COP 15-28M ($3 571-6 667); Rappi/Lulo Senior: COP 20-40M ($4 762-9 524); REMOTE US: $3 000-8 000/мес; СТОИМОСТЬ ЖИЗНИ КОЛУМБИЯ 2026: МЕДЕЛЬИН (EL POBLADO; LAURELES): АРЕНДА: 2-комн El Poblado (экспат-район): COP 3 000 000-6 000 000/мес ($714-1 429); 2-комн Laureles; Envigado; Bello: COP 1 500 000-3 000 000 ($357-714); БОГОТА (CHAPINERO; ZONA ROSA): 2-комн: COP 2 500 000-5 000 000 ($595-1 190); ПРОДУКТЫ: arepa (кукурузная лепешка; национальное блюдо): COP 1 000-3 000 ($0.24-0.71); bandeja paisa (рис; фасоль; мясо; яйцо; чичаррон): COP 18 000-35 000 ($4.29-8.33); tinto (черный кофе): COP 1 000-2 000 ($0.24-0.48; невероятно дёшево!); продукты Exito; Carulla: COP 600 000-1 200 000/мес ($143-286); ТРАНСПОРТ: Metro Medellin (одна из лучших систем ЛА!): COP 2 900-3 200/поездка; Metrocable (фуникулёр): включен в карту Metro; КЛИМАТ: Медельин: ВЕЧНАЯ ВЕСНА +18-25 КРУГЛЫЙ ГОД!; Богота: высота 2600 м = +7-18; пасмурно; дождливо; ПОДГОТОВКА К ПЕРЕЕЗДУ: USD/EUR в Колумбию обменивай в кассах Casa de Cambio (в аэропорту хуже курс); SIM: Claro или Tigo купи на месте; районы: El Poblado = туристы+экспаты (дорже и безопаснее); Laureles = более местный; безопасность: НЕ Колумбия 90-х; туристические районы безопасны; просто не демонстрируй дорогие вещи',
    content_md: `# Колумбия Богота Медельин DN IT 2026: Digital Nomad Visa $700/мес, Rappi $5B, вечная весна

Колумбия — DN Visa: минимальный доход ~$700/мес, 2 года. Rappi ($5B; суперапп доставки; основан в Боготе). Медельин — «вечная весна» (+18-25 круглый год). Кофе tinto $0.24. Arepa $0.24. Trансформация из «самого опасного» в Innovation Award.

---

## Digital Nomad Visa

| Параметр | Значение |
|---------|---------|
| Минимальный доход | ~$700/мес (3x мин. зарплата Колумбии) |
| Требование | Иностранный работодатель или клиент |
| Срок | 2 года |
| Налог | 0% на иностранный доход |
| Стоимость | ~$50-80 |

---

## IT-экосистема

| Компания | Оценка | Профиль |
|---------|--------|---------|
| **Rappi** | **$5B** | **Delivery super app; Богота; 9 стран ЛА** |
| Nequi | $2B | Bancolombia digital fintech |
| Lulo Bank | $1B | Neo-bank; fintech |
| Mercado Libre | $70B | Аргентинский; крупнейший dev-офис в CO |

---

## Стоимость жизни

| Город/Район | Аренда 2-комн COP/мес | USD/мес |
|-------------|---------------------|---------|
| Медельин El Poblado | 3 000 000-6 000 000 | $714-1 429 |
| **Медельин Laureles** | **1 500 000-3 000 000** | **$357-714** |
| Богота Chapinero | 2 500 000-5 000 000 | $595-1 190 |

---

## Итого

Колумбия DN IT 2026: Digital Nomad Visa $700/мес (2 года; 0% налог на иностранный доход); Rappi ($5B; Богота); Медельин «вечная весна» +18-25; tinto $0.24; arepa $0.24; безопасность = трансформирована (не 90-е!); Габриэль Гарсия Маркес (Нобель 1982); Шакира; кофейный треугольник UNESCO; турист 90 дней без визы (РФ).
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
console.log(`\nБатч 234: ${ok} OK, ${err} ошибок`);
