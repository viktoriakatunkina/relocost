// Визовый режим для граждан РФ (туристический въезд).
//
// ВАЖНО: данные предварительные, по состоянию на 2026 год, и требуют сверки
// перед публикацией — визовые правила меняются. Маппинг по country_slug
// (как в cities.country_slug), легко редактируется вручную.
//
//   "visa_free"     — въезд без заранее оформленной визы: безвиз, виза по
//                     прилёту (visa-on-arrival) или штамп на границе.
//   "visa_required" — визу нужно оформлять заранее (включая Шенген, e-visa,
//                     которую получают до поездки).
//
// Принцип консервативности: если по стране нет уверенности — ставим
// "visa_required". Такие страны перечислены в комментарии VISA_NEEDS_REVIEW.

export type VisaStatus = "visa_free" | "visa_required";

export const VISA_BY_COUNTRY: Record<string, VisaStatus> = {
  // --- Без визы / виза по прилёту / штамп на границе ---
  armenia: "visa_free", // безвиз
  azerbaijan: "visa_free", // e-visa оформляется, но фактически по прилёту/онлайн быстро; СНГ-режим — без визы для турпоездок
  belarus: "visa_free", // союзное государство
  georgia: "visa_free", // безвиз до 1 года
  kazakhstan: "visa_free", // безвиз
  kyrgyzstan: "visa_free", // безвиз
  moldova: "visa_free", // безвиз
  russia: "visa_free", // внутренние переезды — виза не нужна
  serbia: "visa_free", // безвиз до 30 дней
  tajikistan: "visa_free", // безвиз
  uzbekistan: "visa_free", // безвиз
  turkey: "visa_free", // безвиз до 60 дней
  thailand: "visa_free", // безвиз до 60 дней
  uae: "visa_free", // безвиз до 90 дней
  indonesia: "visa_free", // виза по прилёту (VOA), Бали
  // 2026-09-29: правительство Черногории официально утвердило (23.07.2026)
  // переход на визовый режим для граждан РФ С 1 НОЯБРЯ 2026 — статус
  // остаётся visa_free только до этой даты, дальше это поле требует ручной
  // правки на visa_required (источник — gov.me, см. VISA_SOURCES.montenegro).
  montenegro: "visa_free", // безвиз до 30 дней — до 01.11.2026
  qatar: "visa_free", // безвиз
  bahrain: "visa_free", // виза по прилёту / e-visa по прилёту
  oman: "visa_free", // безвиз до 14 дней
  maldives: "visa_free", // виза по прилёту (на всякий — нет в БД)
  sri_lanka: "visa_free", // ETA по прилёту / онлайн — фактически без заранее оформленной визы
  "sri-lanka": "visa_free",
  malaysia: "visa_free", // безвиз до 30 дней
  philippines: "visa_free", // безвиз до 30 дней
  morocco: "visa_free", // безвиз до 90 дней
  tunisia: "visa_free", // безвиз до 90 дней
  cambodia: "visa_free", // виза по прилёту / e-visa
  nepal: "visa_free", // виза по прилёту
  jordan: "visa_free", // виза по прилёту
  argentina: "visa_free", // безвиз до 90 дней
  brazil: "visa_free", // безвиз до 90 дней
  mexico: "visa_free", // безвиз до 180 дней
  "south-korea": "visa_free", // безвиз до 60 дней (требуется K-ETA онлайн, но не консульская виза)
  // Переведены в «Без визы» по решению Виктории (2026-06-17): виза по прилёту /
  // e-visa / нюансы режима описываются текстом внутри страниц страны и города.
  egypt: "visa_free", // виза по прилёту
  israel: "visa_free", // безвиз до 90 дней (с 2025 дополнительно требуется ETA-IL онлайн заранее)
  china: "visa_free", // с 15.09.2025 индивидуальный безвиз (не только групповой), продлён до 31.12.2027
  vietnam: "visa_free", // e-visa оформляется онлайн; нюансы — внутри страницы

  // 2026-09-29: батч-проверка визовых источников по всем 80 странам (см.
  // VISA_SOURCES) нашла 9 расхождений кода с реальностью — 7 ниже добавлены
  // новыми, 2 выше в разделе "нужна виза" исправлены (см. комментарии там).
  chile: "visa_free", // безвиз до 90 дней (соглашение РФ-Чили с 2010)
  colombia: "visa_free", // безвиз до 90 дней (соглашение с 13.03.2011)
  "hong-kong": "visa_free", // безвиз 14 дней (взаимное соглашение с 2009)
  "northern-cyprus": "visa_free", // виза по прилёту в аэропорту Эрджан до 90 дней
  peru: "visa_free", // безвиз до 90 дней (соглашение с июня 2011)
  "south-africa": "visa_free", // безвиз до 90 дней
  uruguay: "visa_free", // безвиз до 90 дней за 180-дневный период

  // 2026-10-14: новые страны каталога (Улан-Батор, Занзибар) — проверено
  // напрямую на kdmid.ru (консульский портал МИД РФ), см. VISA_SOURCES.
  mongolia: "visa_free", // безвиз до 30 дней за визит, суммарно до 90 дней за 180-дневный период
  tanzania: "visa_free", // виза по прилёту в пункте въезда либо e-visa заранее — 50$, до 90 дней однократно

  // --- Нужна виза заранее (Шенген/ЕС/e-visa заранее/консульская) ---
  bulgaria: "visa_required", // ЕС / Шенген
  croatia: "visa_required", // Шенген
  cyprus: "visa_required", // pro-visa отменена с января 2025, теперь обычная категория C/D
  "czech-republic": "visa_required", // Шенген (фактически туристические визы не выдаются с 25.10.2022)
  greece: "visa_required", // Шенген
  hungary: "visa_required", // Шенген
  portugal: "visa_required", // Шенген
  spain: "visa_required", // Шенген
  india: "visa_required", // e-visa оформляется заранее
  // 2026-09-29 (батч-проверка): было visa_free — сезонный безвиз отменён
  // постановлением Совета министров Албании от 20.04.2023 и не восстановлен.
  // Нужна e-Viza заранее (~30-50 евро, ~1 месяц рассмотрения). Источник —
  // e-visa.al, см. VISA_SOURCES.albania. Это была активная ошибка на сайте
  // (обещали безвиз, которого нет) — важно не откатить случайно.
  albania: "visa_required",
  // 2026-09-29 (батч-проверка): было visa_free — безвиз отменён в
  // одностороннем порядке 15.03.2022. Нужна виза C/D заранее (кроме
  // держателей действующей многократной Шенген-визы — им можно без визы до
  // 15 дней, этот нюанс не укладывается в бинарный статус, описать текстом
  // на странице страны). Источник — kdmid.ru, см. VISA_SOURCES.
  "north-macedonia": "visa_required",
};

// Спорные страны переведены в «Без визы» по решению Виктории (2026-06-17);
// визовые нюансы (сроки, e-visa, виза по прилёту) описываются текстом внутри
// страниц страны и города, а не на плашке.
export const VISA_NEEDS_REVIEW: string[] = [];

export type VisaInfo = {
  status: VisaStatus;
  label: "Без визы" | "Нужна виза";
};

// Источник + дата проверки визового режима — отдельно от VISA_BY_COUNTRY,
// чтобы не трогать 8 файлов, уже потребляющих getVisa()/VisaInfo (бейджи,
// фильтры и т.п.). Заполняется постепенно по мере проверки: страна без
// записи здесь просто не показывает строку "Проверено: DD.MM.YYYY" в блоке
// визы на странице страны/города — это НЕ ошибка, а честный признак того,
// что источник ещё не сверен (принцип из ТЗ: не выдумывать даты проверки).
// country_slug — тот же ключ, что в VISA_BY_COUNTRY.
export type VisaSource = {
  sourceUrl: string;
  verifiedAt: string; // "YYYY-MM-DD"
};

export const VISA_SOURCES: Partial<Record<string, VisaSource>> = {
  albania: { sourceUrl: "https://e-visa.al/", verifiedAt: "2026-09-29" },
  argentina: { sourceUrl: "https://efrus.cancilleria.gob.ar/es/visas-de-turismo-1", verifiedAt: "2026-09-29" },
  armenia: { sourceUrl: "https://www.mfa.am/ru/visa", verifiedAt: "2026-09-29" },
  australia: { sourceUrl: "https://russia.embassy.gov.au/mscw/visa_visitor_tourist.html", verifiedAt: "2026-09-29" },
  austria: { sourceUrl: "https://www.bmeia.gv.at/oeb-moskau/reisen-nach-oesterreich/einreise-und-aufenthalt/visum/", verifiedAt: "2026-09-29" },
  azerbaijan: { sourceUrl: "https://www.mfa.gov.az/en/category/visa/visa-free-countries", verifiedAt: "2026-09-29" },
  bahrain: { sourceUrl: "https://www.evisa.gov.bh/list-of-online-visa-country.html", verifiedAt: "2026-09-29" },
  belarus: { sourceUrl: "https://mfa.gov.by/visa/viezd_vyezd/agreement/", verifiedAt: "2026-09-29" },
  belgium: { sourceUrl: "https://russia.diplomatie.belgium.be/nl/naar-belgie-komen/visum-voor-belgie", verifiedAt: "2026-09-29" },
  brazil: { sourceUrl: "https://concordia.itamaraty.gov.br/detalhamento-acordo/6283", verifiedAt: "2026-09-29" },
  bulgaria: { sourceUrl: "https://www.mfa.bg/ru/embassies/russiacon1/2891", verifiedAt: "2026-09-29" },
  cambodia: { sourceUrl: "https://www.evisa.gov.kh", verifiedAt: "2026-09-29" },
  canada: { sourceUrl: "https://ircc.canada.ca/english/visit/visas.asp?country=Russia", verifiedAt: "2026-09-29" },
  chile: { sourceUrl: "https://www.minrel.gob.cl/europa/federacion-de-rusia", verifiedAt: "2026-09-29" },
  china: { sourceUrl: "https://english.www.gov.cn/news/202605/20/content_WS6a0d70aac6d00ca5f9a0b1fe.html", verifiedAt: "2026-09-29" },
  colombia: { sourceUrl: "https://www.cancilleria.gov.co/tramites_servicios/visa/lista-a-b-c", verifiedAt: "2026-09-29" },
  croatia: { sourceUrl: "https://mvep.gov.hr/page/179974", verifiedAt: "2026-09-29" },
  cyprus: { sourceUrl: "https://mfa.gov.cy/visa-information.html", verifiedAt: "2026-09-29" },
  "czech-republic": { sourceUrl: "https://mzv.gov.cz/moscow/ru/vizy_i_konsulskaja/novosti/index.html", verifiedAt: "2026-09-29" },
  denmark: { sourceUrl: "https://um.dk/rusland/rejse-og-ophold/visum-og-opholdstilladelse", verifiedAt: "2026-09-29" },
  egypt: { sourceUrl: "https://visa2egypt.gov.eg/eVisa/Home/HomePage", verifiedAt: "2026-09-29" },
  estonia: { sourceUrl: "https://kriis.ee/en/travelling-crossing-state-border/travelling-estonia/visas-russian-citizens", verifiedAt: "2026-09-29" },
  finland: { sourceUrl: "https://finlandabroad.fi/web/cyp/current-affairs/-/asset_publisher/h5w4iTUJhNne/content/finland-significantly-restricts-the-non-essential-travel-of-russian-citizens/384951", verifiedAt: "2026-09-29" },
  france: { sourceUrl: "https://france-visas.gouv.fr/en/", verifiedAt: "2026-09-29" },
  georgia: { sourceUrl: "https://www.evisa.gov.ge/GeoVisa/en/VisaApp", verifiedAt: "2026-09-29" },
  germany: { sourceUrl: "https://germania.diplo.de/ru-ru/service/05-visaeinreise", verifiedAt: "2026-09-29" },
  greece: { sourceUrl: "https://www.mfa.gr/russia/visas.html?mission=mow&lang=extra1", verifiedAt: "2026-09-29" },
  "hong-kong": { sourceUrl: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html", verifiedAt: "2026-09-29" },
  hungary: { sourceUrl: "https://moszkva.mfa.gov.hu/page/konzuli-dijak_", verifiedAt: "2026-09-29" },
  iceland: { sourceUrl: "https://www.government.is/topics/foreign-affairs/visa-to-iceland/", verifiedAt: "2026-09-29" },
  india: { sourceUrl: "https://indianvisaonline.gov.in/evisa/tvoa.html", verifiedAt: "2026-09-29" },
  indonesia: { sourceUrl: "https://evisa.imigrasi.go.id/front/info/evoa", verifiedAt: "2026-09-29" },
  ireland: { sourceUrl: "https://www.irishimmigration.ie/", verifiedAt: "2026-09-29" },
  israel: { sourceUrl: "https://embassies.gov.il/russia/en/announcements/important-information-travelers-israel-eta-il-requirement", verifiedAt: "2026-09-29" },
  italy: { sourceUrl: "https://consmosca.esteri.it/ru/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/", verifiedAt: "2026-09-29" },
  japan: { sourceUrl: "https://www.ru.emb-japan.go.jp/itpr_ru/visainfo.html", verifiedAt: "2026-09-29" },
  jordan: { sourceUrl: "http://government.ru/en/docs/27246/", verifiedAt: "2026-09-29" },
  kazakhstan: { sourceUrl: "https://www.adilet.zan.kz/rus/docs/P050000494_", verifiedAt: "2026-09-29" },
  kenya: { sourceUrl: "https://www.etakenya.go.ke", verifiedAt: "2026-09-29" },
  kyrgyzstan: { sourceUrl: "https://e-consul.gov.kg/visa-types/", verifiedAt: "2026-09-29" },
  latvia: { sourceUrl: "https://www2.mfa.gov.lv/en/moscow/consular-information/entry-into-latvia-by-citizens-of-russian-federation", verifiedAt: "2026-09-29" },
  lithuania: { sourceUrl: "https://ru.mfa.lt/konsuline-informacija/aktualiausia-konsuline-informacija/vizos/40", verifiedAt: "2026-09-29" },
  malaysia: { sourceUrl: "https://www.kln.gov.my/web/rus_moscow/requirement_foreigner", verifiedAt: "2026-09-29" },
  malta: { sourceUrl: "https://visa.vfsglobal.com/one-pager/malta/russia/english/", verifiedAt: "2026-09-29" },
  mexico: { sourceUrl: "https://www.inm.gob.mx/sae/publico/ru/solicitud.html", verifiedAt: "2026-09-29" },
  moldova: { sourceUrl: "https://mfa.gov.md/ru/content/vizovyy-rezhim-dlya-grazhdan-drugih-gosudarstv", verifiedAt: "2026-09-29" },
  mongolia: { sourceUrl: "https://www.kdmid.ru/docs/mongolia/information-about-the-country/", verifiedAt: "2026-10-14" },
  montenegro: { sourceUrl: "https://www.gov.me/amp/clanak/crna-gora-u-potpunosti-uskladila-viznu-politiku-sa-evropskom-unijom-gradanima-brojnih-zemalja-dostupnije-podnosenje-zahtjeva-za-crnogorsku-vizu", verifiedAt: "2026-09-29" },
  morocco: { sourceUrl: "https://www.consulat.ma/index.php/en/list-countries-whose-citizens-are-exempted-entry-visa-morocco", verifiedAt: "2026-09-29" },
  nepal: { sourceUrl: "https://ntb.gov.np/plan-your-trip/before-you-come/tourist-visa", verifiedAt: "2026-09-29" },
  netherlands: { sourceUrl: "https://www.nederlandwereldwijd.nl/visum-nederland/schengenvisum/aanvragen-rusland", verifiedAt: "2026-09-29" },
  "north-macedonia": { sourceUrl: "https://www.kdmid.ru/docs/macedonia/information-about-the-country/", verifiedAt: "2026-09-29" },
  "northern-cyprus": { sourceUrl: "https://mfa.gov.ct.tr/consular-info/visa-regulations/", verifiedAt: "2026-09-29" },
  oman: { sourceUrl: "https://www.kdmid.ru/docs/oman/information-about-the-country/", verifiedAt: "2026-09-29" },
  peru: { sourceUrl: "https://www.kdmid.ru/docs/peru/information-about-the-country/", verifiedAt: "2026-09-29" },
  philippines: { sourceUrl: "https://moscowpe.dfa.gov.ph/consular-services/consular-visa/visa", verifiedAt: "2026-09-29" },
  poland: { sourceUrl: "https://www.gov.pl/web/rosja/wizy-informacje-ogolne", verifiedAt: "2026-09-29" },
  portugal: { sourceUrl: "https://vistos.mne.gov.pt/pt/vistos-schengen/informacao-geral/quem-precisa-de-visto", verifiedAt: "2026-09-29" },
  qatar: { sourceUrl: "https://www.kdmid.ru/docs/qatar/information-about-the-country/", verifiedAt: "2026-09-29" },
  romania: { sourceUrl: "https://www.mae.ro/travel-conditions/3740", verifiedAt: "2026-09-29" },
  serbia: { sourceUrl: "https://www.mfa.gov.rs/en/citizens/travel-serbia/visa-regime/ruska-federacija", verifiedAt: "2026-09-29" },
  singapore: { sourceUrl: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements/visa-detail-page/russia", verifiedAt: "2026-09-29" },
  slovakia: { sourceUrl: "https://www.mzv.sk/en/web/moskva-en/services/visa_information", verifiedAt: "2026-09-29" },
  slovenia: { sourceUrl: "http://www.moscow.embassy.si/index.php?id=4365&L=1", verifiedAt: "2026-09-29" },
  "south-africa": { sourceUrl: "https://www.kdmid.ru/docs/south-africa/information-about-the-country/", verifiedAt: "2026-09-29" },
  "south-korea": { sourceUrl: "https://overseas.mofa.go.kr/ru-ru/brd/m_7334/view.do?seq=761218&page=1", verifiedAt: "2026-09-29" },
  spain: { sourceUrl: "https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Servicios-consulares.aspx?scco=Rusia&scd=203&scca=Visados&scs=Visado+de+estancia+%28visado+Schengen%29", verifiedAt: "2026-09-29" },
  "sri-lanka": { sourceUrl: "https://eta.gov.lk/", verifiedAt: "2026-09-29" },
  sweden: { sourceUrl: "https://www.swedenabroad.se/en/about-sweden-non-swedish-citizens/russia/going-to-sweden/travelling-to-sweden/", verifiedAt: "2026-09-29" },
  switzerland: { sourceUrl: "https://www.eda.admin.ch/countries/russia/en/home/visa/entry-ch/up-90-days/do-i-need-a-schengen-visa.html", verifiedAt: "2026-09-29" },
  taiwan: { sourceUrl: "https://visawebapp.boca.gov.tw/BOCA_EVISA/MRV04FORM.do", verifiedAt: "2026-09-29" },
  tajikistan: { sourceUrl: "https://consular.tj/citizens/11-visa-free.html", verifiedAt: "2026-09-29" },
  tanzania: { sourceUrl: "https://www.kdmid.ru/docs/tanzania/information-about-the-country/", verifiedAt: "2026-10-14" },
  thailand: { sourceUrl: "https://image.mfa.go.th/mfa/0/wdW3FTtVMc/2026-05-22/thai-visa-exemption-table.pdf", verifiedAt: "2026-09-29" },
  tunisia: { sourceUrl: "https://www.kdmid.ru/docs/tunisia/information-about-the-country/", verifiedAt: "2026-09-29" },
  turkey: { sourceUrl: "https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa", verifiedAt: "2026-09-29" },
  uae: { sourceUrl: "https://www.mofa.gov.ae/en/missions/moscow/services/visas", verifiedAt: "2026-09-29" },
  "united-kingdom": { sourceUrl: "https://www.gov.uk/world/coming-to-the-uk-russia", verifiedAt: "2026-09-29" },
  uruguay: { sourceUrl: "https://www.kdmid.ru/docs/uruguay/information-about-the-country/", verifiedAt: "2026-09-29" },
  usa: { sourceUrl: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html/visa", verifiedAt: "2026-09-29" },
  uzbekistan: { sourceUrl: "https://gov.uz/mfa/ru/consular/visa/", verifiedAt: "2026-09-29" },
  vietnam: { sourceUrl: "https://evisa.xuatnhapcanh.gov.vn/trang-chu-ttdt", verifiedAt: "2026-09-29" },
};

export function getVisaSource(countrySlug: string | null | undefined): VisaSource | null {
  if (!countrySlug) return null;
  return VISA_SOURCES[countrySlug] ?? null;
}

// Возвращает визовый статус по стране города. Ключ — country_slug.
// Неизвестная страна → консервативно "visa_required".
export function getVisa(
  city: { country_slug: string | null } | null | undefined
): VisaInfo {
  const slug = city?.country_slug ?? "";
  const status: VisaStatus = VISA_BY_COUNTRY[slug] ?? "visa_required";
  return {
    status,
    label: status === "visa_free" ? "Без визы" : "Нужна виза",
  };
}
