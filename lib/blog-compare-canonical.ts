// Критический SEO-аудит 2026-10-28, находка №2: каннибализация /compare vs
// /blog на тему "город A vs город B" (или "страна A vs страна B"). Обе
// страницы отвечают на один интент («X или Y, что выбрать»), но /compare —
// более прямой match (у него в title есть конкретная цифра разницы в
// стоимости жизни, см. compareDelta() в lib/compare.ts — лучше CTR) и это
// SSG-страница с generateStaticParams, рассчитанная именно на этот запрос.
//
// Блог-статью НЕ удаляем и не редиректим (она часто длиннее/содержательнее —
// личный опыт, нюансы менталитета, визовые детали, которых на /compare нет),
// только отдаём каноническую ссылку на /compare/<a>-vs-<b>, чтобы поисковик
// консолидировал вес на той странице, у которой выше шанс конверсии в клик.
//
// Как собран список (подробности — в финальном отчёте аудита, не в коде):
// 1. Среди ~4300 опубликованных статей найдены все, чей slug/title matches
//    паттерн сравнения (-vs-/-ili-/-protiv- в slug ИЛИ "vs"/"или"/"против" в
//    title) — 290 кандидатов.
// 2. Для каждого заголовка извлечены названия городов/стран (сверка с живым
//    справочником cities/country_ru из Supabase, не выдуманный список).
//    Отобраны только те, где из заголовка однозначно читаются РОВНО 2
//    сущности ОДНОГО типа (город+город или страна+страна) — то есть именно
//    тот случай, когда /compare/<a>-vs-<b> физически существует и отвечает
//    на тот же запрос (dynamicParams=true на /compare/[pair] — страница
//    работает для любой пары валидных слагов, не только предгенерированных).
// 3. Вручную отсеяны ложные срабатывания: DN-карточки городов, где два
//    места совпали случайно внутри длинного keyword-stuffed заголовка
//    (не апробация реального "X vs Y" сравнения), и заголовки, где "или"
//    связывает не два места, а две профессии/примеры в списке.
// 4. Пары, растянутые на 3+ сущности ("США vs Канада vs Австралия vs Новая
//    Зеландия") — НЕ включены: /compare поддерживает только 2 стороны,
//    произвольный выбор "каких двух из четырёх" канонизировать был бы
//    натяжкой.
//
// Ключ — slug блог-статьи, значение — КАНОНИЧЕСКАЯ (алфавитная, как того
// требует /compare/[pair] — см. permanentRedirect в app/[locale]/compare/
// [pair]/page.tsx) пара слагов "a-vs-b" на /compare.
export const BLOG_CANONICAL_TO_COMPARE: Record<string, string> = {
  "almaty-ili-tashkent-2026": "almaty-vs-tashkent",
  "almaty-vs-astana-2026": "almaty-vs-astana",
  "almaty-vs-erevan-kuda-pereekhat-2026": "almaty-vs-yerevan",
  "antalya-ili-alanya-2026": "alanya-vs-antalya",
  "antalya-vs-tbilisi": "antalya-vs-tbilisi",
  "ashdod-ili-bat-yam-gde-deshevle-zhit-v-izraile-2026": "ashdod-vs-bat-yam",
  "astana-vs-bishkek-2026": "astana-vs-bishkek",
  "atyrau-ili-pavlodar-gde-deshevle-zhit-v-kazakhstane-2026": "atyrau-vs-pavlodar",
  "baku-vs-tbilisi-2026": "baku-vs-tbilisi",
  "bali-ili-phuket-2026": "bali-vs-phuket",
  "baliy-vs-chianmay-noma-hub-2026": "bali-vs-chiang-mai",
  "bangkok-ili-pattaya-gde-deshevle-zhit-2026": "bangkok-vs-pattaya",
  "bar-ili-kotor-2026": "bar-vs-kotor",
  "barselona-vs-madrid-pereezd-2026": "barcelona-vs-madrid",
  "batumi-ili-kutaisi-2026": "batumi-vs-kutaisi",
  "batumi-ili-tbilisi-gde-deshevle-zhit-2026": "batumi-vs-tbilisi",
  "belgrad-ili-budapesht-2026": "belgrade-vs-budapest",
  "belgrad-ili-novi-sad-2026": "belgrade-vs-novi-sad",
  "belgrad-vs-tbilisi-2026": "belgrade-vs-tbilisi",
  "berlin-vs-gamburg-2026": "berlin-vs-hamburg",
  "berlin-vs-varshava-dlya-it-specialista-2026": "berlin-vs-warsaw",
  "bishkek-ili-almaty-kuda-pereekhat-2026": "almaty-vs-bishkek",
  "bodrum-fethiye-sravnenie": "bodrum-vs-fethiye",
  "budva-ili-bar-chernogoria-2026": "bar-vs-budva",
  "budva-ili-tivat": "budva-vs-tivat",
  "chehiya-vs-polsha-gde-luchshe-emigrantu-2026": "czech-republic-vs-poland",
  "chernogoria-ili-serbiya-2026": "montenegro-vs-serbia",
  "chernogoria-vs-serbiya-sravnenie-dlya-pereezda-2026": "montenegro-vs-serbia",
  "chernogoriya-ili-gruziya-2026": "georgia-vs-montenegro",
  "doha-vs-abu-dabi-2026": "abu-dhabi-vs-doha",
  "dubai-ili-abu-dhabi-2026": "abu-dhabi-vs-dubai",
  "dubai-ili-istanbul-2026": "dubai-vs-istanbul",
  "dubai-ili-ras-el-khayma-gde-deshevle-zhit-2026": "dubai-vs-ras-al-khaimah",
  "dubai-vs-abu-dabi-gde-luchshe-2026": "abu-dhabi-vs-dubai",
  "dubai-vs-bali": "bali-vs-dubai",
  "dubai-vs-bangkok-dlya-pereezda-2026": "bangkok-vs-dubai",
  "dubai-vs-tbilisi-dlya-frilansera-2026": "dubai-vs-tbilisi",
  "erevan-ili-tbilisi": "tbilisi-vs-yerevan",
  "erevan-vs-tbilisi-ceny-vizy-mentalitet-2026": "tbilisi-vs-yerevan",
  "filipiny-vs-indonezia-sravnenie-dn-2026": "indonesia-vs-philippines",
  "galle-ili-kolombo-2026": "colombo-vs-galle",
  "germaniya-vs-polsha-dlya-pereezda-2026": "germany-vs-poland",
  "goroda-germanii-dlya-pereezda-sravnenie-2026": "berlin-vs-munich",
  "gruziya-ili-armeniya-2026": "armenia-vs-georgia",
  "gruziya-ili-kazahstan-2026": "georgia-vs-kazakhstan",
  "gruziya-ili-serbiya-2026": "georgia-vs-serbia",
  "gruziya-vs-armeniya-sravnenie-2026": "armenia-vs-georgia",
  "helsinki-vs-stokgolm-2026": "helsinki-vs-stockholm",
  "herceg-novi-ili-bar-2026": "bar-vs-herceg-novi",
  "ispaniya-barselona-vs-madrid-it-2026": "barcelona-vs-madrid",
  "ispaniya-ili-portugaliya-2026": "portugal-vs-spain",
  "ispaniya-vs-portugaliya-dlya-pereezda-2026": "portugal-vs-spain",
  "izrail-vs-germaniya-pereezd-it-2026": "germany-vs-israel",
  "kak-vybrat-mezhdu-tbilisi-i-erevanum-2026": "tbilisi-vs-yerevan",
  "kaliningrad-ili-sochi-2026": "kaliningrad-vs-sochi",
  "kanada-vs-avstralia-sravnenie-2026": "australia-vs-canada",
  "kazahstan-ili-armeniya-2026": "armenia-vs-kazakhstan",
  "kazakhstan-vs-uzbekistan": "kazakhstan-vs-uzbekistan",
  "kazan-ili-moskva-2026": "kazan-vs-moscow",
  "kipr-ili-malta-dlya-rossiyan-2026": "cyprus-vs-malta",
  "kipr-ili-turtsiya-2026": "cyprus-vs-turkey",
  "kipr-vs-malta-sravnenie-2026": "cyprus-vs-malta",
  "kiprovskiy-pas-vs-ae-zolotaya-viza-sravnenie-2026": "cyprus-vs-uae",
  "kotor-ili-budva-gde-deshevle-zhit-2026": "budva-vs-kotor",
  "kragujevac-ili-nish-2026": "kragujevac-vs-nis",
  "krasnodar-ili-sochi-sravnenie-2026": "krasnodar-vs-sochi",
  "limassol-ili-larnaka-gde-deshevle-zhit-2026": "larnaca-vs-limassol",
  "lisbon-vs-limassol-2026": "limassol-vs-lisbon",
  "lissabon-vs-barselona-dlya-pereezda-2026": "barcelona-vs-lisbon",
  "lissabon-vs-madrid-gde-luchshe-2026": "lisbon-vs-madrid",
  "lissabon-vs-madrid-sravnenie-2026": "lisbon-vs-madrid",
  "marbelya-ili-malaga-gde-deshevle-zhit-2026": "malaga-vs-marbella",
  "mayorka-ili-barselona-gde-deshevle-zhit-2026": "barcelona-vs-palma-de-mallorca",
  "mersin-ili-antalya-2026": "antalya-vs-mersin",
  "minsk-ili-moskva-2026": "minsk-vs-moscow",
  "moskva-ili-almaty-2026": "almaty-vs-moscow",
  "moskva-ili-erevan-2026": "moscow-vs-yerevan",
  "netaniya-ili-tel-aviv-gde-deshevle-zhit-2026": "netanya-vs-tel-aviv",
  "oae-ili-turtsiya-dlya-biznesa-2026": "turkey-vs-uae",
  "oae-vs-izrail-dlya-pereezda-2026": "israel-vs-uae",
  "pekin-ili-shankhay-gde-deshevle-zhit-2026": "beijing-vs-shanghai",
  "phuket-ili-chiang-mai-2026": "chiang-mai-vs-phuket",
  "phuket-ili-samui-2026": "phuket-vs-samui",
  "phuket-vs-bali": "bali-vs-phuket",
  "phuket-vs-chiang-mai-gde-zhit-2026": "chiang-mai-vs-phuket",
  "podgoritsa-ili-budva-2026": "budva-vs-podgorica",
  "port-vs-lissabon-gde-zhit-v-portugalii-2026": "lisbon-vs-porto",
  "praga-vs-budapest-dlya-pereezda-2026": "budapest-vs-prague",
  "prague-vs-budapest": "budapest-vs-prague",
  "san-francisko-ili-los-andzheles-gde-deshevle-zhit-2026": "los-angeles-vs-san-francisco",
  "sankt-peterburg-ili-ekaterinburg-2026": "spb-vs-yekaterinburg",
  "sankt-peterburg-ili-moskva-2026": "moscow-vs-spb",
  "serbia-vs-georgia": "georgia-vs-serbia",
  "serbiya-ili-chernogoriya-2026": "montenegro-vs-serbia",
  "severnyy-kipr-vs-kipr-sravnenie-2026": "cyprus-vs-northern-cyprus",
  "shymkent-ili-almaty-gde-deshevle-zhit-2026": "almaty-vs-shymkent",
  "singapur-vs-gonkong-dlya-it-2026": "hong-kong-vs-singapore",
  "singapur-vs-gonkong-dlya-it-sravnenie-2026": "hong-kong-vs-singapore",
  "singapur-vs-gonkong-dva-finansovykh-khaba-azii-2026": "hong-kong-vs-singapore",
  "singapur-vs-gonkong-sravnenie-finansistov-2026": "hong-kong-vs-singapore",
  "singapur-vs-kuala-lumpur-gde-luchshe-2026": "kuala-lumpur-vs-singapore",
  "slovakiya-vs-sloveniya-dlya-rossiyan-2026": "slovakia-vs-slovenia",
  "sravnenie-belgrada-i-tbilisi-2026": "belgrade-vs-tbilisi",
  "sri-lanka-vs-tailand-2026": "sri-lanka-vs-thailand",
  "stambul-ili-antaliya-gde-deshevle-zhit-2026": "antalya-vs-istanbul",
  "tailand-ili-vietnam-2026": "thailand-vs-vietnam",
  "tailand-vs-vietnam": "thailand-vs-vietnam",
  "tailand-vs-vietnam-dlya-pereezda-2026": "thailand-vs-vietnam",
  "tashkent-ili-tbilisi-2026": "tashkent-vs-tbilisi",
  "tbilisi-ili-erevan-2026": "tbilisi-vs-yerevan",
  "tbilisi-ili-yerevan-2026": "tbilisi-vs-yerevan",
  "tbilisi-vs-bali": "bali-vs-tbilisi",
  "tbilisi-vs-belgrad-gde-luchshe-zhit-rossiyaninu-2026": "belgrade-vs-tbilisi",
  "tbilisi-vs-belgrad-sravnenie-2026": "belgrade-vs-tbilisi",
  "tbilisi-vs-erevan-gde-luchshe-zhit-2026": "tbilisi-vs-yerevan",
  "tbilisi-vs-yerevan-gde-luchshe-zhit-2026": "tbilisi-vs-yerevan",
  "torrevieha-ili-alikante-2026": "alicante-vs-torrevieja",
  "turtsiya-ili-gruziya-2026": "georgia-vs-turkey",
  "turtsiya-vs-gruziya": "georgia-vs-turkey",
  "turtsiya-vs-gruziya-sravnenie-2026": "georgia-vs-turkey",
  "varshava-vs-krakow-gde-zhit-v-polshe-2026": "krakow-vs-warsaw",
  "zadar-ili-pula-gde-deshevle-zhit-v-khorvatii-2026": "pula-vs-zadar",
};
