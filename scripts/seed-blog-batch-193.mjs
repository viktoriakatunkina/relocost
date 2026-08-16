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
    slug: 'meksika-meksiko-siti-it-2026',
    title: 'Мексика и Мехико для IT в 2026: Temporary Resident Visa, Mercado Libre, налоги 30%',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Мексика Мехико IT 2026: Temporary Resident Visa Мексики: для нерезидентов желающих жить в MX более 180 дней: доход-основания: пенсия/рента/сбережения от $1 620/мес (MXN 27 000/мес); удалённая работа без Mexican employer; срок: 1-4 года (renewals); процесс: явиться в мексиканское консульство в стране происхождения; предоставить: выписки банка 6 мес; справку о доходах; форма IM-5; стоимость: USD $36 (консульский сбор); получить FMM (Forma Migratoria Multiple) при въезде; зарегистрировать ВНЖ в INM (Instituto Nacional de Migracion) локально после въезда; Permanent Resident: после 4 лет Temporary Resident; гражданство Мексики: 5 лет ПМЖ; знание испанского; 2 гражданства разрешены; Meksika Digital Nomad Community: очень крупная; сотни тысяч digital nomad в CDMX (Ciudad de Mexico); Condesa/Roma Norte/Polanco = expat-хабы; НАЛОГИ МЕКСИКИ: НДФЛ (ISR; Impuesto Sobre la Renta): прогрессивный; для нерезидентов: удержание у источника 25-30% (если работаешь для мексиканского работодателя); для Temporary Resident без Mexican employer: доход из-за рубежа = НЕ облагается мексиканским НДФЛ пока не является мексиканским sourced; с 2023: обсуждается более строгое отношение к DN (Digital Nomad) в MX; если проводишь < 183 дней = нерезидент; > 183 дней = резидент = обязан декларировать мировой доход; ставки для резидентов: 1.92% до MXN 8 952/год; 6.4% MXN 8 953-75 984; 10.88% MXN 75 985-133 536; 16% MXN 133 537-155 232; 17.92% MXN 155 233-185 852; 21.36% MXN 185 853-374 837; 23.52% MXN 374 838-590 796; 30% MXN 590 797-1 127 926; 32% MXN 1 127 927-1 503 902; 34% MXN 1 503 903-4 511 704; 35% свыше MXN 4 511 704; НДС (IVA): 16%; IT-компании Мексики: Mercado Libre Mexico (NASDAQ MELI; $95B market cap; крупнейший e-commerce LA; MX офис в CDMX; tech engineering hub); OLX Mexico (classifieds; OLX Group); Clip (payments fintech; unicorn $2B; CDMX); Kavak (used cars marketplace; unicorn $8.7B; CDMX); Merama (e-commerce aggregator; unicorn; CDMX); Konfio (SMB fintech; unicorn $1.3B; CDMX); Bitso (crypto exchange; unicorn $2.2B; CDMX); Conekta (payments; CDMX); OXXO Digital; Rappi Mexico (DoorDash model); CityBase; Kueski (BNPL; CDMX); Baz (payments; Azteca)',
    seo_description: 'Мексика Мехико IT 2026: ЗАРПЛАТЫ IT CDMX: Junior Dev: USD $1 500-3 000/мес; Middle: $3 000-5 500/мес; Senior (local): $4 500-9 000/мес; Kavak Senior: $5 000-10 000/мес; Clip Senior: $4 500-8 000/мес; Remote US employer: $8 000-20 000/мес; (очень выгодно при жизни в CDMX: geo-arbitrage); СТОИМОСТЬ ЖИЗНИ CDMX: аренда 1BR (Condesa/Roma Norte): USD $700-1 300/мес; аренда (Narvarte/Del Valle): USD $500-900/мес; аренда (Polanco дорогой): USD $1 200-2 500/мес; продукты: USD $150-300/мес; транспорт (Metro/Metrobus): USD $15-30/мес; жизнь итого: USD $900-1 800/мес; (очень дёшево для LATAM-мегаполиса); РАЙОНЫ CDMX: Condesa (самый expat-популярный; дорогой; зелёный; парки; рестораны; стартап-кафе; Art Deco); Roma Norte (молодёжный; expat; рестораны; galeria; чуть дешевле Condesa); Polanco (богатый; посольства; Reforma; очень дорогой; luxury); Narvarte/Del Valle (local-favourite; дешевле 30-40%; безопасный; удобный; metro); Santa Fe (деловой район; ТЦ; офисы корпораций; далеко от центра; безопасный; дорогой); Xochimilco (далеко; плавучие сады; tourist; не для expat-жизни); БЕЗОПАСНОСТЬ В МЕКСИКЕ: CDMX: неоднородная безопасность; Condesa/Roma Norte/Polanco/Narvarte/Del Valle = безопасны для expat; Tepito/Doctores/Iztapalapa = ОПАСНЫ (не жить); правило: следуй expat-зонам; Uber вместо такси с улицы; приложения iOverlander/Numbeo/Telerik для реальных отзывов; вне CDMX: Guadalajara (Silicon Valley Мексики; безопаснее; второй tech-хаб; Wizeline/BPO/HP); Monterrey (индустриальный; корпорации); Playa del Carmen (DN-хаб; карибский берег; летом гуаякиль / зимой лучше); Oaxaca (cultural; дёшево; медленный интернет); ИСПАНСКИЙ ЯЗЫК: для Temporary Resident: не нужен; для гражданства: нужен; латиноамериканский испанский: отличается от кастильского (нет "vosotros"; "tio" не используется); для русскоязычных: до B1 = 400-600 часов (романская семья; относительно легче EU языков для изучения); очень много онлайн-ресурсов; CO-WORKING В CDMX: очень развита экосистема: WeWork (Reforma/Insurgentes/Polanco); Selina (hostel+cowork; Roma Norte); Nest Lab; Impact Hub; Kolab; средняя стоимость: USD $100-300/мес; INTERNET В MEXICO: качество: неоднородное; в Condesa/Roma Norte/Polanco: хорошее (Telmex Infinitum; Totalplay; Megacable); в апартаментах: проверяй скорость до аренды; в коворкинге: обычно надёжный; SIM-карта: Telcel (лучшее покрытие); Movistar; AT&T Mexico.',
    content_md: `# Мексика и Мехико для IT 2026: Kavak $8.7B, geo-arbitrage, USD удалённо

Мехико (CDMX) — крупнейший tech-хаб LATAM с жизнью за $900-1 800/мес. Kavak ($8.7B) и Clip ($2B) — флагманские unicorns. Для remote-специалиста с US-зарплатой ($8-20k) = идеальный geo-arbitrage.

---

## Temporary Resident Visa

| Параметр | Значение |
|---------|---------|
| Мин. доход | $1 620/мес (MXN 27 000) |
| Срок | 1-4 года + renewals |
| Стоимость | $36 консульский сбор |
| Для кого | DN, удалённая работа, пенсия/рента |

**ПМЖ:** 4 года Temporary. **Гражданство:** 5 лет ПМЖ + испанский. Dual citizenship разрешён.

---

## Налоги Мексики

| Ситуация | Налог |
|---------|-------|
| Нерезидент (< 183 дней) | Мировой доход не облагается |
| Резидент (> 183 дней) | Прогрессивный ISR до 35% |

При работе на зарубежного работодателя с < 183 дней = практически 0% в MX.

---

## IT-компании Мексики

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Kavak** | Used cars marketplace | $8.7B unicorn |
| **Bitso** | Crypto exchange | $2.2B unicorn |
| **Clip** | Payments fintech | $2B unicorn |
| **Konfio** | SMB fintech | $1.3B unicorn |
| **Merama** | E-commerce aggregator | Unicorn |
| Mercado Libre MX | E-commerce | $95B MELI; engineering hub |

---

## Зарплаты IT в Мехико

| Уровень | USD/мес |
|---------|---------|
| Junior | $1 500-3 000 |
| Middle | $3 000-5 500 |
| Senior (local) | $4 500-9 000 |
| Remote US employer | **$8 000-20 000** |

---

## Стоимость жизни в Мехико

| Статья | USD/мес |
|--------|---------|
| Аренда 1BR (Condesa/Roma Norte) | $700-1 300 |
| Аренда 1BR (Narvarte/Del Valle) | $500-900 |
| Продукты | $150-300 |
| Транспорт (Metro) | $15-30 |
| **Итого** | **$900-1 800** |

---

## Безопасные районы для expat

| Район | Характер |
|-------|---------|
| **Condesa** | Самый популярный expat; Art Deco |
| **Roma Norte** | Рестораны; молодёжный; дешевле Condesa |
| **Narvarte/Del Valle** | Local; безопасный; -30-40% к цене |
| Polanco | Посольства; luxury; дорого |

**Избегать:** Tepito, Doctores, Iztapalapa.

---

## Итого

Мексика CDMX IT 2026: Temporary Resident Visa ($36; $1 620/мес; 1-4 года); < 183 дней = нерезидент (мировой доход не облагается); geo-arbitrage: US-зарплата $8-20k при жизни $900-1 800/мес; Kavak $8.7B/Bitso $2.2B/Clip $2B/Konfio $1.3B; Condesa/Roma Norte = безопасный expat-район; испанский легче для русскоязычных (400-600 ч до B1). Лучший LATAM-выбор для digital nomad.
`,
  },
  {
    slug: 'braziliya-sao-paulo-it-2026',
    title: 'Бразилия и Сан-Паулу для IT в 2026: Digital Nomad Visa, Nubank, налоги, стоимость жизни',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Бразилия Сан-Паулу IT 2026: Brazil Digital Nomad Visa (VITEM XIV): введена 2022; для удалённых работников; условие: доход $1 500/мес (MBR = минимальная бразильская зарплата x 1.5 = ~BRL 3 300/мес 2024); работодатель = иностранный; срок: 1 год (renewals на 1 год); возможность перехода на ПМЖ после 4 лет; требования: паспорт; выписки банка; contract с иностранным работодателем; health insurance; criminal record (notarized); стоимость: BRL 500 (~$100); процесс: в бразильском консульстве; Permanent Resident: 4 года + подтверждение дохода; гражданство Бразилии: 4 года ПМЖ (или 1 год для супруга гражданина; или через заслуги); двойное гражданство разрешено; НАЛОГИ БРАЗИЛИИ: НДФЛ (IRPF; Imposto de Renda Pessoa Fisica): прогрессивный; 0% до BRL 2 824/мес; 7.5% BRL 2 825-3 751; 15% BRL 3 752-4 664; 22.5% BRL 4 665-6 101; 27.5% свыше BRL 6 102/мес; для нерезидентов (Digital Nomad Visa): часто не считаются налоговыми резидентами Бразилии (если < 183 дней В году); нерезидент: доход из-за рубежа = 0% IRPF (только если получаешь за пределами Бразилии); IT-компании Бразилии: Nubank (финтех; NYSE NU; $53B market cap!!; HQ SP; 94 000 чел.; самый дорогой unicorn LATAM; нет отделений = mobile-only bank); iFood (delivery; NYSE parent; HQ SP; Prosus/Movile; $5B); Movile (Rocket Internet of Brazil; $1B unicorn); Totvs (enterprise software; B3 TOTS3; HQ SP; $3B; SAP аналог в LATAM); Locaweb (cloud/hosting; B3 LWSA3; HQ SP); Mercado Livre Brazil (MELI; крупнейший ecommerce; HQ Sao Paulo operations); Linx (retail tech; Stone acq. $1.1B); VTEX (e-commerce SaaS; NYSE VTEX; $1.5B); Loft (proptech; unicorn; SP); OLX Brasil (classifieds; OLX Group); Creditas (fintech; unicorn $4.8B; SP); Quinto Andar (proptech; unicorn $5.1B; SP); Pismo (payments; Visa acq. $1B; SP); Itau Tech; Bradesco Tech; XP Inc tech',
    seo_description: 'Бразилия Сан-Паулу IT 2026: ЗАРПЛАТЫ IT SAO PAULO: Junior Dev: USD $1 500-3 000/мес; Middle: $2 500-5 000/мес; Senior: $4 000-8 000/мес; Nubank Senior SWE: $7 000-14 000/мес; VTEX Senior: $5 000-10 000/мес; Remote US/EU employer: $8 000-20 000/мес; СТОИМОСТЬ ЖИЗНИ САН-ПАУЛУ: аренда 1BR (Pinheiros/Vila Madalena/Jardins): USD $700-1 400/мес; аренда (Centro/Mooca): USD $400-800/мес; аренда (Itaim Bibi/Faria Lima деловой): USD $1 200-2 500/мес; продукты: USD $200-400/мес; транспорт (Metro+Bus): USD $50-80/мес; жизнь итого: USD $1 000-2 200/мес; ДРУГИЕ ГОРОДА: Florianopolis (остров; tech-стартапы; DN-хаб; дешевле SP; красиво); Recife (north; пляжи; дешевле; PortoDigital tech park; 300 компаний); Belo Horizonte (BH; Minas Gerais; дешевле SP; local tech); Curitiba (европейский стиль; автомобильная промышленность; дешевле; Renault/Volvo); РАЙОНЫ САН-ПАУЛУ: Pinheiros (молодёжь; рестораны; стартапы; expat); Vila Madalena (bohemian; искусство; пабы; expat); Faria Lima/Itaim Bibi (деловой; банки; стартапы; дорогой; Silicon Valley of BR); Paulista (деловой; Avenida Paulista = Champs Elysees BR; офисы; банки); Jardins (luxury; посольства; тихий); ПОРТУГАЛЬСКИЙ ЯЗЫК (БРАЗИЛЬСКИЙ): бразильский португальский != европейский португальский (акцент; слова); для русскоязычных: 400-600 ч до B1 (романская семья; проще EU языков); очень много content на YouTube; DuoLingo хорошо работает; отличие от испанского: схожий но НЕ одинаковый (не взаимопонимаемый); БЕЗОПАСНОСТЬ: Сан-Паулу: НЕОДНОРОДНАЯ безопасность; Pinheiros/Jardins/Itaim = безопасные; Centro/Brás = опасные для turist/expat; не гулять ночью в незнакомых районах; Uber вместо такси; iPhone убирать (petty crime); Florianopolis и Curitiba = безопаснее; ИНТЕРНЕТ БРАЗИЛИИ: хороший в городах: Claro/Vivo/TIM; Fiber до 1 Gbps; AWS Sao Paulo region; Google Cloud SP; Microsoft Azure SP; AWS Brazil = один из 4 латиноамериканских регионов AWS; низкая задержка для US east coast (~5-10 мс); coworking: WeWork SP/Spaces/Impact Hub; CRYPTO В БРАЗИЛИИ: Бразилия = один из крупнейших crypto рынков в мире; Binance Brazil; Foxbit; Bitcoin продаётся везде; legalized 2022 (Marco das Criptoativas); низкая банковизация населения + Nubank + PIX = fintech развит; PIX (Pix): instant payment system Бразилии (Центральный банк); переводы за секунды; 24/7; бесплатно; аналог СБП РФ; запущен 2020.',
    content_md: `# Бразилия и Сан-Паулу для IT 2026: Nubank $53B, Digital Nomad Visa, geo-arbitrage

Nubank ($53B, NYSE NU) — крупнейший необанк мира. Бразилия: Digital Nomad Visa с 2022. Сан-Паулу: tech-экосистема LATAM, жизнь $1 000-2 200/мес при US-зарплате $8-20k.

---

## Digital Nomad Visa (VITEM XIV)

| Параметр | Значение |
|---------|---------|
| Мин. доход | $1 500/мес (иностранный работодатель) |
| Срок | 1 год + renewals |
| Стоимость | ~$100 |
| Гражданство | 4 года ПМЖ; dual citizenship разрешён |

---

## Налоги Бразилии

| Ситуация | Налог |
|---------|-------|
| Нерезидент < 183 дней (иностранный доход) | **0%** |
| Резидент > 183 дней | Прогрессивный IRPF до 27.5% |

---

## IT-компании Бразилии

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **Nubank** | Необанк | NYSE NU; **$53B**; 94 000 чел. |
| **Quinto Andar** | Proptech | $5.1B unicorn |
| **Creditas** | Fintech | $4.8B unicorn |
| **VTEX** | E-commerce SaaS | NYSE VTEX; $1.5B |
| **iFood** | Food delivery | $5B |
| **Pismo** | Payments | Visa acq. $1B |

---

## Зарплаты IT в Сан-Паулу

| Уровень | USD/мес |
|---------|---------|
| Junior | $1 500-3 000 |
| Middle | $2 500-5 000 |
| Senior (local) | $4 000-8 000 |
| Nubank Senior SWE | $7 000-14 000 |
| Remote US/EU | **$8 000-20 000** |

---

## Стоимость жизни в Сан-Паулу

| Статья | USD/мес |
|--------|---------|
| Аренда 1BR (Pinheiros/Jardins) | $700-1 400 |
| Аренда 1BR (Centro) | $400-800 |
| Продукты | $200-400 |
| Транспорт (Metro) | $50-80 |
| **Итого** | **$1 000-2 200** |

---

## Безопасные районы

| Район | Характер |
|-------|---------|
| **Pinheiros** | Expat; стартапы; рестораны |
| **Vila Madalena** | Bohemian; искусство |
| **Itaim Bibi/Faria Lima** | Деловой; Silicon Valley BR |
| **Florianopolis** | Остров; DN-хаб; безопаснее SP |

---

## Итого

Бразилия Сан-Паулу IT 2026: Digital Nomad Visa ($100; $1 500/мес иностранный работодатель; 1 год); < 183 дней = 0% IRPF; geo-arbitrage ($8-20k remote при жизни $1-2.2k); Nubank $53B/Creditas $4.8B/VTEX/iFood; Pinheiros/Faria Lima безопасны; PIX instant payments; crypto legalized; португальский 400-600 ч до B1. Florianopolis = более спокойная альтернатива SP.
`,
  },
  {
    slug: 'chili-santiago-it-2026',
    title: 'Чили и Сантьяго для IT в 2026: Techado Visa, стабильная экономика, лучшая LATAM для бизнеса',
    tag: 'страна',
    read_time: 2,
    country_slug: null,
    seo_title: 'Чили Сантьяго IT 2026: Чили как лучшая страна LATAM для бизнеса: индекс Doing Business (World Bank): Чили = лучшая в LATAM (2023: 49-е место в мире; выше Бразилии/Мексики/Колумбии); низкая коррупция (наименьшая в LATAM); политическая стабильность (ОЭСР член); высокий ИЧР (Human Development Index): 45-е место; сильные институты; Visa Techado (Visa de Trabajo): работная виза Чили; через чилийского работодателя; срок: 1 год + продление; ПМЖ (Permanencia Definitiva): после 1 года работы; Visa de Rentista (рента/пассивный доход): для тех кто получает пассивный доход из-за рубежа; мин. доход: $1 000/мес; срок: 1 год с продлением; подходит для digital nomad; Visa de Inversionista (инвестор): для тех кто открывает бизнес в Чили; Acuerdo MERCOSUR + Чили: граждане аргентины/уругвая/бразилии/парагвая/боливии могут жить в Чили свободно; для граждан РФ: обычная туристическая виза 90 дней; затем Visa de Rentista или Techado; НАЛОГИ ЧИЛИ: НДФЛ (Impuesto de Segunda Categoria): прогрессивный; 0% до CLP 830 654/мес (~$900); 4% CLP 831 000-1 846 000; 8% CLP 1 847 000-3 077 000; 13.5% CLP 3 078 000-4 308 000; 23% CLP 4 309 000-5 539 000; 30.4% CLP 5 540 000-7 693 000; 35% свыше CLP 7 693 000/мес; для нерезидентов (первые 3 года): только чилийский доход облагается; с 4-го года резидентства: мировой доход; НДС (IVA): 19%; Impuesto de Primera Categoria (корпоративный): 27%; IT-компании Чили: Cornershop (grocery delivery; Uber acq. $1.4B; Santiago); NotCo (FoodTech AI; unicorn $1.5B; Santiago); Conekta (payments; Santiago); Fintual (robo-advisor; unicorn; YC alumni; Santiago); Betterfly (HR tech; unicorn $1B; Santiago); Khipu (payments; Santiago); Houm (proptech; YC; Santiago); Buk (HR SaaS; unicorn; Santiago); Justo (food delivery; Santiago); Cumplo (P2P lending; Santiago); Reservo; Habitat (digital health)',
    seo_description: 'Чили Сантьяго IT 2026: ЗАРПЛАТЫ IT САНТЬЯГО: Junior Dev: USD $1 500-2 800/мес; Middle: $2 800-5 000/мес; Senior: $4 500-8 000/мес; NotCo Senior: $6 000-11 000/мес; Betterfly Senior: $5 000-9 000/мес; Remote US/EU: $8 000-20 000/мес; СТОИМОСТЬ ЖИЗНИ САНТЬЯГО: аренда 1BR (Providencia/Las Condes/Santiago Centro): USD $500-900/мес; аренда 1BR (Nunoa/Macul): USD $400-700/мес; продукты: USD $200-400/мес; транспорт (Metro/Transantiago): USD $35-60/мес; жизнь итого: USD $750-1 500/мес; РАЙОНЫ САНТЬЯГО: Providencia (expat-favourite; рестораны; деловой; зелёный; безопасный; средний ценник); Las Condes/Vitacura (богатый; посольства; luxury; очень безопасный); Nunoa (local-favourite; молодёжный; дешевле; студенческий; artsy); Santiago Centro (centre; исторический; Mixed; пл. Бармеса; средний риск); Barrio Italia/Yungay (bohemian; дизайн-хабы; развивающийся; hipster); Maipу/Pudahuel (западный; рабочий; дёшевый; далеко); SANTIAGO TECH ECOSYSTEM: стартап-экосистема: одна из лучших в LATAM; Start-Up Chile (государственная программа 2010-2024): принято 2 000+ стартапов из 85 стран; до $60 000 equity-free grant; поддержка CORFO (Chile Economic Development Agency); VC активность: Kaszek Ventures (LATAM фонд); South Ventures; Magma Partners; LATIN AMERICA X (LAX); наличие AWS/GCP/Azure Chile offices; Tech Hub: Barrio Italia = дизайн/стартап; WeWork Santiago; LIDE; Cowork Factory; БЕЗОПАСНОСТЬ ЧИЛИ: Сантьяго: относительно безопасный для LATAM (безопаснее Бразилии/Мексики/Колумбии/Перу); Providencia/Las Condes = очень безопасны; Centro = умеренно осторожно; карманники (bolsistas) в местах скопления туристов; оппортунистические кражи; political protests иногда (Plaza Baquedano в 2019-2021); ИСПАНСКИЙ (ЧИЛИЙСКИЙ): чилийский испанский = очень специфический акцент (chilensis); быстро; сленг (weón; cachai; po); для русскоязычных: 400-600 ч до B1 стандартного испанского; КУЛЬТУРА: индейская культура (Mapuche; Aymara); европейский вклад (немцы/хорваты в Патагонии); вино (Valle del Maipo/Colchagua); деревянная архитектура Valparaiso; треккинг Torres del Paine (Патагония); пустыня Атакама (сев); КЛИМАТ САНТЬЯГО: тёплый средиземноморский; лето (дек-мар): +28-35C; зима (июнь-авг): +7-15C; смог зимой (инверсия); рядом: Анды со снегом (30-40 мин); побережье Тихого океана (60-90 мин); отлично для outdoor-lifestyle.',
    content_md: `# Чили и Сантьяго для IT 2026: NotCo unicorn, Start-Up Chile, лучший бизнес-климат LATAM

Чили — лучшая в LATAM по Doing Business. Сантьяго: NotCo ($1.5B), Buk, Betterfly. Стабильная экономика, низкая коррупция. Жизнь $750-1 500/мес.

---

## Visa de Rentista (для DN)

| Параметр | Значение |
|---------|---------|
| Мин. доход | $1 000/мес (пассивный/иностранный) |
| Срок | 1 год + renewal |
| ПМЖ | После 1 года рабочей визы |

---

## Налоги Чили

| Доход/мес | Ставка |
|----------|--------|
| До ~$900 | 0% |
| $900-2 000 | 4-8% |
| $2 000-6 000 | 13.5-30.4% |
| Свыше ~$8 000 | 35% |
| Нерезидент (1-3 год) | Только чилийский доход |

---

## IT-компании Чили

| Компания | Профиль | Масштаб |
|---------|---------|---------|
| **NotCo** | AI FoodTech | $1.5B unicorn |
| **Betterfly** | HR tech | $1B unicorn |
| **Buk** | HR SaaS | Unicorn |
| **Fintual** | Robo-advisor | YC alumni; unicorn |
| Cornershop | Grocery delivery | Uber acq. $1.4B |

**Start-Up Chile:** государственная программа; 2 000+ стартапов; до $60 000 equity-free grant.

---

## Зарплаты IT в Сантьяго

| Уровень | USD/мес |
|---------|---------|
| Junior | $1 500-2 800 |
| Middle | $2 800-5 000 |
| Senior (local) | $4 500-8 000 |
| Remote US/EU | $8 000-20 000 |

---

## Стоимость жизни

| Статья | USD/мес |
|--------|---------|
| Аренда 1BR (Providencia) | $500-900 |
| Аренда 1BR (Nunoa) | $400-700 |
| Продукты | $200-400 |
| Транспорт | $35-60 |
| **Итого** | **$750-1 500** |

---

## Итого

Чили Сантьяго IT 2026: Visa Rentista ($1 000/мес; 1 год); нерезидент 1-3 года = только чилийский доход; NotCo $1.5B/Betterfly $1B/Buk/Fintual; Senior $4.5-8k/мес; remote $8-20k; жизнь $750-1 500/мес; лучший Doing Business в LATAM; Start-Up Chile гранты; Providencia = безопасный expat-район; вино/Анды/Патагония рядом.
`,
  },
  {
    slug: 'kak-ne-poteryat-svyaz-s-rossiyskim-bankom-pri-pereezde-2026',
    title: 'Как не потерять доступ к российскому банку при переезде за рубеж в 2026',
    tag: 'финансы',
    read_time: 1,
    country_slug: null,
    seo_title: 'Как сохранить доступ к российскому банку при переезде 2026: риски потери доступа к банковскому счёту в РФ: блокировка карты при длительном отсутствии: банки РФ могут заблокировать карту при: нарушении лимитов по операциям; подозрительных транзакциях за рубежом; нарушении условий договора (нет операций > 12 мес); истечении срока действия карты (2-5 лет); РОССИЙСКИЕ НОМЕР ТЕЛЕФОНА: большинство операций в интернет-банке требуют SMS на российский номер; если потеряешь российский номер = потеряешь доступ к интернет-банку; стратегия: оставить российский номер активным: Tele2/Билайн: SIM активна пока есть > 0 руб. на балансе + нет ограничений; МТС/МегаФон: аналогично; минимальная активность: 1 звонок/SMS в квартал; иностранная SIM: не поможет для российского банка (разные коды страны +7 vs другие); ДОСТУП К СЧЁТУ: сбербанк онлайн / SberBusiness: требует Сбер SIM или токен для подтверждения; ВТБ Онлайн: SMS на российский номер; Тинькофф (Т-Банк): SMS/push на российский номер; Альфа-банк: аналогично; Банк Санкт-Петербург (один из лучших для нерезидентов): часть операций = без SMS; ФИЗИЧЕСКОЕ ПРИСУТСТВИЕ ПРИ ВОЗВРАТЕ: перевыпуск карты: нужен физически (или доверенность); смена лимитов: нужно в офисе или через доверенное лицо; ДОВЕРЕННОСТЬ НА БАНКОВСКИЕ ОПЕРАЦИИ: выдать доверенному лицу (родственнику/доверенному другу): нотариально оформленная доверенность; перечень полномочий: снять средства; перевыпустить карту; управлять лимитами; доступ к сейфовой ячейке; нотариус может выдать генеральную доверенность или специальную банковскую; риск: доверяешь большие суммы другому человеку; альтернативы: Т-Банк Доверие / Сбер Доверие; сервисы дистанционного управления',
    seo_description: 'Как сохранить доступ к российскому банку при переезде 2026: ЧТО СДЕЛАТЬ ДО ОТЪЕЗДА: СПИСОК ДЕЙСТВИЙ: 1. СОХРАНИТЬ РОССИЙСКИЙ НОМЕР: оставить +7 SIM активным; пополнить баланс на год вперёд; подключить автопополнение с банковской карты или интернет-банка; если SIM заблокируется: для восстановления нужен физический приход или нотариальная доверенность; 2. ВКЛЮЧИТЬ ВСЕ КАНАЛЫ ВХОДА В БАНК: установить мобильное приложение; выучить ЛОГИН и ПАРОЛЬ (не полагаться только на SMS); настроить PUSH-уведомления вместо SMS где возможно; Т-Банк: поддерживает push вместо SMS = удобно из-за рубежа; Альфа: аналогично; Сбер: SMS обязателен для некоторых операций; 3. ПЕРЕВЫПУСТИТЬ КАРТЫ ЗАБЛАГОВРЕМЕННО: если карта истекает в ближайшие 2-3 года = перевыпустить сейчас; попросить перевыпустить на максимальный срок; 4. ОТКРЫТЬ ДОСТУП ДЛЯ ОПЕРИРОВАНИЯ ДОВЕРЕННЫМ ЛИЦОМ: нотариальная доверенность (банковская); перечень полномочий: операции по счёту; перевыпуск карты; снятие наличных; 5. ОТКРЫТЬ ДОПОЛНИТЕЛЬНУЮ КАРТУ: выпустить дополнительную карту на надежного родственника; карточный продукт семейного типа; СНЯТИЕ НАЛИЧНЫХ РУБЛЕЙ ЗА РУБЕЖОМ: возможности 2024: Сбер под санкциями; ВТБ под санкциями; работающие в EU: Банк Санкт-Петербург; Экспобанк; Примсоцбанк; в странах без санкций (Армения/Грузия/Казахстан/Турция/Сербия): Тинькофф работает; Сбер в Казахстане через банкоматы Halyk/Kaspi; КУРСЫ КОНВЕРТАЦИИ: берегись: курс конвертации при снятии рублей за рубежом может быть невыгодным (банк берёт spread 3-8%); лучше: хранить рубли → конвертировать через Wise/Revolut или снимать в Армении/Казахстане; СЕРВИСЫ ПЕРЕВОДА ДЕНЕГ ИЗ РФ ЗА РУБЕЖ: Золотая Корона (крупнейший оператор; работает в 100+ странах); Юнистрим (аналог; конкурент); Contact (Money Transfer); Western Union: ограничен в РФ; MoneyGram: ограничен; SWIFT: доступен через Райффайзен/Банк СПб/ряд региональных банков без санкций; КРИПТОВАЛЮТА: Bitcoin/USDT через P2P: законно в РФ (с января 2025 для нерезидентов разрешена уплата криптой в ограниченных случаях); LocalBitcoins: закрыт; Binance P2P: работает (Binance не под РФ санкциями на потребительском уровне); риски: P2P = доверяй только верифицированным контрагентам; НЕРЕЗИДЕНТ И РОССИЙСКИЙ БАНКОВСКИЙ СЧЁТ: гражданин РФ за рубежом: счёт в РФ сохраняется; обязан УВЕДОМИТЬ ФНС о зарубежных счётах (через Госуслуги или ФНС лично); не позднее 1 мес с момента открытия; обязан подавать ежегодный отчёт о движении средств по зарубежным счётам (ОДДС); не подал = штраф 2 000-3 000 руб.; уведомление не требует возврата в РФ (можно через Госуслуги онлайн из-за рубежа).',
    content_md: `# Как сохранить доступ к российскому банку при переезде 2026

Главные риски: потеря российского номера телефона; истечение карты; блокировка при подозрительных операциях. Решение: оставить +7 SIM активным, доверенность на родственника, перевыпустить карты заблаговременно.

---

## Что сделать до отъезда

| Действие | Детали |
|---------|--------|
| Сохранить +7 SIM | Пополнить на год вперёд; минимум 1 операция в квартал |
| Включить push (не SMS) | Т-Банк/Альфа поддерживают; Сбер частично |
| Перевыпустить карту | Если истекает в 2-3 года — перевыпустить сейчас |
| Нотариальная доверенность | Банковская; доверить родственнику перевыпуск/снятие |
| Дополнительная карта | Выпустить на родственника |

---

## Перевод денег из РФ за рубеж

| Инструмент | Доступность |
|-----------|------------|
| Золотая Корона | 100+ стран; работает |
| Юнистрим | Работает |
| SWIFT | Через Райффайзен/Банк СПб (не под санкциями) |
| Сбер/ВТБ SWIFT | Заблокировано |

---

## Банки, работающие за рубежом (2024)

| Банк | Где работает |
|------|-------------|
| Т-Банк (Тинькофф) | Армения, Грузия, Казахстан, Турция |
| Банк СПб | SWIFT доступен |
| Сбер | Казахстан через Halyk/Kaspi ATM |
| ВТБ | Санкционирован; ограничено |

---

## Обязанности нерезидента по ФНС

| Обязанность | Срок |
|------------|------|
| Уведомить ФНС об открытии зарубежного счёта | 1 месяц |
| ОДДС (отчёт о движении средств) | Ежегодно |
| Способ | Госуслуги онлайн (из-за рубежа) |

Штраф за непредоставление: 2 000-3 000 руб.

---

## Итого

Российский банк при переезде 2026: сохрани +7 SIM (пополни на год вперёд); включи push вместо SMS (Т-Банк/Альфа); перевыпусти карту заблаговременно; нотариальная доверенность на родственника; Золотая Корона/Юнистрим/SWIFT Райффайзен для переводов; уведомить ФНС о зарубежных счётах в 1 мес (через Госуслуги); ОДДС ежегодно.
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
console.log(`\nБатч 193: ${ok} OK, ${err} ошибок`);
