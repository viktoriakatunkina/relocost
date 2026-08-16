// Качество жизни по 4 осям — шкала 1–5 (5 = отлично).
// Источники: Numbeo Crime/Pollution/Health Care Index, Nomad List, AirVisual,
// WHO Air Quality data. Обновлено: 2026.
// Города без записи → компонент показывает «нет данных».

export type QualityData = {
  safety: 1 | 2 | 3 | 4 | 5;        // безопасность (инверсия индекса преступности)
  ecology: 1 | 2 | 3 | 4 | 5;       // экология / качество воздуха
  medicine: 1 | 2 | 3 | 4 | 5;      // доступность и уровень медицины
  climate_comfort: 1 | 2 | 3 | 4 | 5; // комфортность климата в среднем за год
};

export const CITY_QUALITY: Record<string, QualityData> = {
  // ── Россия ──────────────────────────────────────────────────────────────
  "moscow":          { safety: 3, ecology: 3, medicine: 4, climate_comfort: 2 },
  "saint-petersburg":{ safety: 3, ecology: 3, medicine: 3, climate_comfort: 2 },
  "novosibirsk":     { safety: 3, ecology: 3, medicine: 3, climate_comfort: 1 },
  "yekaterinburg":   { safety: 3, ecology: 3, medicine: 3, climate_comfort: 2 },
  "kazan":           { safety: 3, ecology: 3, medicine: 3, climate_comfort: 2 },
  "krasnodar":       { safety: 3, ecology: 3, medicine: 3, climate_comfort: 3 },
  "sochi":           { safety: 4, ecology: 5, medicine: 3, climate_comfort: 4 },
  "kaliningrad":     { safety: 4, ecology: 4, medicine: 3, climate_comfort: 3 },
  "samara":          { safety: 3, ecology: 3, medicine: 3, climate_comfort: 2 },
  "rostov-na-donu":  { safety: 3, ecology: 3, medicine: 3, climate_comfort: 3 },
  "ufa":             { safety: 3, ecology: 3, medicine: 3, climate_comfort: 2 },
  "voronezh":        { safety: 3, ecology: 3, medicine: 3, climate_comfort: 3 },
  "perm":            { safety: 3, ecology: 3, medicine: 3, climate_comfort: 1 },
  "krasnoyarsk":     { safety: 3, ecology: 2, medicine: 3, climate_comfort: 1 },
  "chelyabinsk":     { safety: 3, ecology: 2, medicine: 3, climate_comfort: 1 },
  "irkutsk":         { safety: 3, ecology: 3, medicine: 2, climate_comfort: 1 },
  "vladivostok":     { safety: 3, ecology: 4, medicine: 2, climate_comfort: 2 },

  // ── Грузия ──────────────────────────────────────────────────────────────
  "tbilisi":         { safety: 4, ecology: 3, medicine: 3, climate_comfort: 4 },
  "batumi":          { safety: 4, ecology: 5, medicine: 2, climate_comfort: 3 },
  "kutaisi":         { safety: 4, ecology: 4, medicine: 2, climate_comfort: 3 },

  // ── Армения ─────────────────────────────────────────────────────────────
  "yerevan":         { safety: 4, ecology: 3, medicine: 3, climate_comfort: 4 },

  // ── Казахстан ───────────────────────────────────────────────────────────
  "shymkent":        { safety: 3, ecology: 3, medicine: 2, climate_comfort: 2 },

  // ── Узбекистан ──────────────────────────────────────────────────────────
  "samarkand":       { safety: 4, ecology: 3, medicine: 2, climate_comfort: 3 },

  // ── Кыргызстан ──────────────────────────────────────────────────────────
  "bishkek":         { safety: 3, ecology: 2, medicine: 2, climate_comfort: 3 },

  // ── Азербайджан ─────────────────────────────────────────────────────────
  "baku":            { safety: 4, ecology: 3, medicine: 3, climate_comfort: 4 },

  // ── Сербия ──────────────────────────────────────────────────────────────
  "belgrade":        { safety: 4, ecology: 3, medicine: 3, climate_comfort: 3 },
  "novi-sad":        { safety: 4, ecology: 3, medicine: 3, climate_comfort: 3 },

  // ── Черногория ──────────────────────────────────────────────────────────
  "budva":           { safety: 4, ecology: 5, medicine: 2, climate_comfort: 4 },
  "podgorica":       { safety: 4, ecology: 4, medicine: 3, climate_comfort: 4 },
  "kotor":           { safety: 5, ecology: 5, medicine: 2, climate_comfort: 4 },
  "tivat":           { safety: 5, ecology: 5, medicine: 2, climate_comfort: 4 },

  // ── Турция ──────────────────────────────────────────────────────────────
  "istanbul":        { safety: 3, ecology: 3, medicine: 4, climate_comfort: 4 },
  "antalya":         { safety: 4, ecology: 4, medicine: 3, climate_comfort: 5 },
  "ankara":          { safety: 3, ecology: 3, medicine: 4, climate_comfort: 3 },
  "izmir":           { safety: 4, ecology: 4, medicine: 3, climate_comfort: 4 },
  "alanya":          { safety: 4, ecology: 4, medicine: 3, climate_comfort: 5 },
  "bodrum":          { safety: 4, ecology: 5, medicine: 3, climate_comfort: 5 },
  "trabzon":         { safety: 4, ecology: 4, medicine: 3, climate_comfort: 3 },
  "mersin":          { safety: 4, ecology: 4, medicine: 3, climate_comfort: 5 },

  // ── ОАЭ ─────────────────────────────────────────────────────────────────
  "dubai":           { safety: 5, ecology: 3, medicine: 5, climate_comfort: 3 },
  "abu-dhabi":       { safety: 5, ecology: 3, medicine: 4, climate_comfort: 3 },

  // ── Кипр ────────────────────────────────────────────────────────────────
  "paphos":          { safety: 5, ecology: 4, medicine: 4, climate_comfort: 5 },
  "larnaca":         { safety: 5, ecology: 4, medicine: 3, climate_comfort: 5 },

  // ── Израиль ─────────────────────────────────────────────────────────────
  "tel-aviv":        { safety: 3, ecology: 4, medicine: 5, climate_comfort: 4 },
  "jerusalem":       { safety: 3, ecology: 4, medicine: 5, climate_comfort: 4 },
  "haifa":           { safety: 3, ecology: 4, medicine: 5, climate_comfort: 4 },

  // ── Египет ──────────────────────────────────────────────────────────────
  "cairo":           { safety: 2, ecology: 1, medicine: 2, climate_comfort: 3 },
  "hurghada":        { safety: 3, ecology: 3, medicine: 2, climate_comfort: 4 },
  "sharm-el-sheikh": { safety: 3, ecology: 4, medicine: 2, climate_comfort: 4 },

  // ── Марокко ─────────────────────────────────────────────────────────────
  "marrakech":       { safety: 3, ecology: 3, medicine: 2, climate_comfort: 4 },
  "casablanca":      { safety: 2, ecology: 2, medicine: 3, climate_comfort: 3 },
  "agadir":          { safety: 3, ecology: 4, medicine: 2, climate_comfort: 5 },

  // ── Португалия ──────────────────────────────────────────────────────────
  "lisbon":          { safety: 4, ecology: 4, medicine: 4, climate_comfort: 5 },
  "porto":           { safety: 4, ecology: 5, medicine: 4, climate_comfort: 4 },
  "faro":            { safety: 5, ecology: 5, medicine: 3, climate_comfort: 5 },
  "funchal":         { safety: 5, ecology: 5, medicine: 3, climate_comfort: 5 },

  // ── Испания ─────────────────────────────────────────────────────────────
  "barcelona":       { safety: 3, ecology: 3, medicine: 4, climate_comfort: 5 },
  "madrid":          { safety: 4, ecology: 3, medicine: 4, climate_comfort: 4 },
  "valencia":        { safety: 4, ecology: 4, medicine: 4, climate_comfort: 5 },
  "malaga":          { safety: 4, ecology: 4, medicine: 4, climate_comfort: 5 },
  "alicante":        { safety: 4, ecology: 4, medicine: 4, climate_comfort: 5 },
  "seville":         { safety: 4, ecology: 4, medicine: 4, climate_comfort: 4 },
  "tenerife":        { safety: 4, ecology: 5, medicine: 3, climate_comfort: 5 },
  "gran-canaria":    { safety: 4, ecology: 5, medicine: 3, climate_comfort: 5 },

  // ── Греция ──────────────────────────────────────────────────────────────
  "athens":          { safety: 3, ecology: 3, medicine: 3, climate_comfort: 4 },
  "thessaloniki":    { safety: 3, ecology: 3, medicine: 3, climate_comfort: 4 },
  "crete":           { safety: 4, ecology: 5, medicine: 2, climate_comfort: 5 },
  "corfu":           { safety: 5, ecology: 5, medicine: 2, climate_comfort: 4 },

  // ── Италия ──────────────────────────────────────────────────────────────
  "rome":            { safety: 3, ecology: 3, medicine: 4, climate_comfort: 4 },
  "milan":           { safety: 3, ecology: 3, medicine: 4, climate_comfort: 3 },
  "florence":        { safety: 4, ecology: 4, medicine: 4, climate_comfort: 4 },
  "naples":          { safety: 2, ecology: 3, medicine: 3, climate_comfort: 4 },
  "sicily":          { safety: 3, ecology: 4, medicine: 3, climate_comfort: 5 },
  "bari":            { safety: 3, ecology: 4, medicine: 3, climate_comfort: 5 },

  // ── Франция ─────────────────────────────────────────────────────────────
  "paris":           { safety: 3, ecology: 3, medicine: 5, climate_comfort: 3 },
  "nice":            { safety: 4, ecology: 4, medicine: 5, climate_comfort: 5 },
  "lyon":            { safety: 3, ecology: 3, medicine: 5, climate_comfort: 3 },
  "marseille":       { safety: 2, ecology: 4, medicine: 4, climate_comfort: 4 },
  "montpellier":     { safety: 3, ecology: 4, medicine: 5, climate_comfort: 5 },

  // ── Германия ────────────────────────────────────────────────────────────
  "berlin":          { safety: 3, ecology: 4, medicine: 5, climate_comfort: 2 },
  "munich":          { safety: 4, ecology: 4, medicine: 5, climate_comfort: 2 },
  "frankfurt":       { safety: 3, ecology: 4, medicine: 5, climate_comfort: 2 },
  "hamburg":         { safety: 3, ecology: 4, medicine: 5, climate_comfort: 2 },
  "cologne":         { safety: 3, ecology: 4, medicine: 5, climate_comfort: 2 },
  "dusseldorf":      { safety: 3, ecology: 4, medicine: 5, climate_comfort: 2 },
  "stuttgart":       { safety: 4, ecology: 4, medicine: 5, climate_comfort: 2 },

  // ── Нидерланды ──────────────────────────────────────────────────────────
  "amsterdam":       { safety: 3, ecology: 4, medicine: 5, climate_comfort: 2 },
  "rotterdam":       { safety: 3, ecology: 4, medicine: 5, climate_comfort: 2 },
  "the-hague":       { safety: 4, ecology: 4, medicine: 5, climate_comfort: 2 },

  // ── Бельгия ─────────────────────────────────────────────────────────────
  "brussels":        { safety: 3, ecology: 3, medicine: 5, climate_comfort: 2 },

  // ── Австрия ─────────────────────────────────────────────────────────────
  "vienna":          { safety: 5, ecology: 4, medicine: 5, climate_comfort: 3 },
  "graz":            { safety: 5, ecology: 5, medicine: 4, climate_comfort: 3 },

  // ── Швейцария ───────────────────────────────────────────────────────────
  "zurich":          { safety: 5, ecology: 5, medicine: 5, climate_comfort: 3 },
  "geneva":          { safety: 5, ecology: 5, medicine: 5, climate_comfort: 3 },
  "lausanne":        { safety: 5, ecology: 5, medicine: 5, climate_comfort: 3 },
  "basel":           { safety: 5, ecology: 5, medicine: 5, climate_comfort: 2 },

  // ── Чехия ───────────────────────────────────────────────────────────────
  "prague":          { safety: 4, ecology: 4, medicine: 4, climate_comfort: 3 },
  "brno":            { safety: 4, ecology: 4, medicine: 4, climate_comfort: 3 },

  // ── Польша ──────────────────────────────────────────────────────────────
  "warsaw":          { safety: 4, ecology: 3, medicine: 4, climate_comfort: 2 },
  "krakow":          { safety: 4, ecology: 2, medicine: 4, climate_comfort: 2 },
  "wroclaw":         { safety: 4, ecology: 3, medicine: 4, climate_comfort: 2 },
  "gdansk":          { safety: 4, ecology: 4, medicine: 4, climate_comfort: 2 },

  // ── Венгрия ─────────────────────────────────────────────────────────────
  "budapest":        { safety: 4, ecology: 3, medicine: 4, climate_comfort: 3 },

  // ── Прибалтика ──────────────────────────────────────────────────────────
  "riga":            { safety: 4, ecology: 4, medicine: 3, climate_comfort: 2 },
  "tallinn":         { safety: 4, ecology: 5, medicine: 4, climate_comfort: 2 },
  "vilnius":         { safety: 4, ecology: 5, medicine: 4, climate_comfort: 2 },

  // ── Румыния ─────────────────────────────────────────────────────────────
  "bucharest":       { safety: 3, ecology: 3, medicine: 3, climate_comfort: 3 },
  "cluj":            { safety: 3, ecology: 4, medicine: 3, climate_comfort: 3 },

  // ── Болгария ────────────────────────────────────────────────────────────
  "sofia":           { safety: 3, ecology: 3, medicine: 3, climate_comfort: 3 },
  "varna":           { safety: 3, ecology: 4, medicine: 3, climate_comfort: 4 },
  "plovdiv":         { safety: 3, ecology: 3, medicine: 3, climate_comfort: 3 },

  // ── Хорватия ────────────────────────────────────────────────────────────
  "zagreb":          { safety: 4, ecology: 4, medicine: 4, climate_comfort: 3 },
  "split":           { safety: 4, ecology: 5, medicine: 3, climate_comfort: 4 },
  "dubrovnik":       { safety: 5, ecology: 5, medicine: 3, climate_comfort: 4 },

  // ── Словения ────────────────────────────────────────────────────────────
  "ljubljana":       { safety: 5, ecology: 5, medicine: 4, climate_comfort: 3 },

  // ── Словакия ────────────────────────────────────────────────────────────
  "bratislava":      { safety: 4, ecology: 4, medicine: 4, climate_comfort: 3 },

  // ── Таиланд ─────────────────────────────────────────────────────────────
  "bangkok":         { safety: 3, ecology: 2, medicine: 4, climate_comfort: 3 },
  "chiang-mai":      { safety: 4, ecology: 2, medicine: 3, climate_comfort: 3 },
  "phuket":          { safety: 3, ecology: 3, medicine: 3, climate_comfort: 4 },
  "pattaya":         { safety: 3, ecology: 2, medicine: 3, climate_comfort: 4 },
  "hua-hin":         { safety: 4, ecology: 4, medicine: 3, climate_comfort: 4 },
  "koh-samui":       { safety: 4, ecology: 4, medicine: 2, climate_comfort: 4 },

  // ── Индонезия ───────────────────────────────────────────────────────────
  "bali":            { safety: 4, ecology: 4, medicine: 3, climate_comfort: 4 },
  "jakarta":         { safety: 2, ecology: 1, medicine: 3, climate_comfort: 3 },
  "lombok":          { safety: 4, ecology: 5, medicine: 2, climate_comfort: 4 },

  // ── Малайзия ────────────────────────────────────────────────────────────
  "kuala-lumpur":    { safety: 3, ecology: 3, medicine: 4, climate_comfort: 3 },
  "penang":          { safety: 4, ecology: 4, medicine: 4, climate_comfort: 3 },
  "johor-bahru":     { safety: 3, ecology: 3, medicine: 4, climate_comfort: 3 },

  // ── Вьетнам ─────────────────────────────────────────────────────────────
  "ho-chi-minh":     { safety: 3, ecology: 2, medicine: 3, climate_comfort: 3 },
  "hanoi":           { safety: 4, ecology: 2, medicine: 3, climate_comfort: 3 },
  "da-nang":         { safety: 5, ecology: 4, medicine: 3, climate_comfort: 4 },
  "hoi-an":          { safety: 5, ecology: 4, medicine: 2, climate_comfort: 4 },
  "nha-trang":       { safety: 4, ecology: 4, medicine: 2, climate_comfort: 4 },

  // ── Сингапур ────────────────────────────────────────────────────────────
  "singapore":       { safety: 5, ecology: 5, medicine: 5, climate_comfort: 3 },

  // ── Южная Корея ─────────────────────────────────────────────────────────
  "seoul":           { safety: 5, ecology: 3, medicine: 5, climate_comfort: 3 },
  "busan":           { safety: 5, ecology: 4, medicine: 4, climate_comfort: 3 },

  // ── Япония ──────────────────────────────────────────────────────────────
  "tokyo":           { safety: 5, ecology: 4, medicine: 5, climate_comfort: 3 },
  "osaka":           { safety: 5, ecology: 4, medicine: 5, climate_comfort: 3 },
  "kyoto":           { safety: 5, ecology: 4, medicine: 5, climate_comfort: 3 },
  "fukuoka":         { safety: 5, ecology: 5, medicine: 4, climate_comfort: 4 },

  // ── Филиппины ───────────────────────────────────────────────────────────
  "manila":          { safety: 2, ecology: 2, medicine: 3, climate_comfort: 3 },
  "cebu":            { safety: 3, ecology: 3, medicine: 3, climate_comfort: 4 },

  // ── Камбоджа ────────────────────────────────────────────────────────────
  "phnom-penh":      { safety: 3, ecology: 2, medicine: 2, climate_comfort: 3 },
  "siem-reap":       { safety: 3, ecology: 3, medicine: 2, climate_comfort: 3 },

  // ── Мексика ─────────────────────────────────────────────────────────────
  "cancun":          { safety: 3, ecology: 4, medicine: 3, climate_comfort: 4 },
  "mexico-city":     { safety: 2, ecology: 2, medicine: 3, climate_comfort: 3 },
  "tulum":           { safety: 3, ecology: 5, medicine: 2, climate_comfort: 4 },
  "guadalajara":     { safety: 2, ecology: 3, medicine: 3, climate_comfort: 4 },
  "playa-del-carmen":{ safety: 3, ecology: 4, medicine: 3, climate_comfort: 4 },

  // ── Колумбия ────────────────────────────────────────────────────────────
  "medellin":        { safety: 3, ecology: 4, medicine: 3, climate_comfort: 5 },
  "bogota":          { safety: 2, ecology: 3, medicine: 3, climate_comfort: 4 },
  "cartagena":       { safety: 3, ecology: 4, medicine: 3, climate_comfort: 4 },

  // ── Аргентина ───────────────────────────────────────────────────────────
  "buenos-aires":    { safety: 3, ecology: 3, medicine: 3, climate_comfort: 4 },
  "mendoza":         { safety: 3, ecology: 4, medicine: 3, climate_comfort: 4 },

  // ── Бразилия ────────────────────────────────────────────────────────────
  "sao-paulo":       { safety: 2, ecology: 2, medicine: 4, climate_comfort: 3 },
  "rio-de-janeiro":  { safety: 2, ecology: 4, medicine: 3, climate_comfort: 4 },
  "florianopolis":   { safety: 3, ecology: 5, medicine: 3, climate_comfort: 4 },

  // ── Индия ───────────────────────────────────────────────────────────────
  "goa":             { safety: 3, ecology: 4, medicine: 2, climate_comfort: 4 },
  "mumbai":          { safety: 3, ecology: 1, medicine: 3, climate_comfort: 3 },
  "delhi":           { safety: 2, ecology: 1, medicine: 3, climate_comfort: 2 },
  "bengaluru":       { safety: 3, ecology: 2, medicine: 4, climate_comfort: 4 },

  // ── Шри-Ланка ───────────────────────────────────────────────────────────
  "colombo":         { safety: 4, ecology: 3, medicine: 3, climate_comfort: 3 },
  "galle":           { safety: 4, ecology: 4, medicine: 2, climate_comfort: 4 },

  // ── Грузия / Батуми уже выше ────────────────────────────────────────────

  // ── Нидерландские Антильские / Карибские ────────────────────────────────
  "punta-cana":      { safety: 3, ecology: 4, medicine: 2, climate_comfort: 4 },

  // ── Индия (дополнительные) ──────────────────────────────────────────────
  "pondicherry":     { safety: 4, ecology: 3, medicine: 3, climate_comfort: 3 },
  "bangalore":       { safety: 3, ecology: 2, medicine: 4, climate_comfort: 4 },
  "chennai":         { safety: 3, ecology: 2, medicine: 3, climate_comfort: 2 },

  // ── Иордания ────────────────────────────────────────────────────────────
  "amman":           { safety: 4, ecology: 3, medicine: 3, climate_comfort: 3 },

  // ── Катар ───────────────────────────────────────────────────────────────
  "doha":            { safety: 5, ecology: 3, medicine: 4, climate_comfort: 3 },

  // ── Оман ────────────────────────────────────────────────────────────────
  "muscat":          { safety: 5, ecology: 4, medicine: 4, climate_comfort: 3 },

  // ── Бахрейн ─────────────────────────────────────────────────────────────
  "manama":          { safety: 4, ecology: 3, medicine: 4, climate_comfort: 3 },

  // ── ОАЭ (дополнительно) ─────────────────────────────────────────────────
  "sharjah":         { safety: 5, ecology: 3, medicine: 4, climate_comfort: 3 },

  // ── Казахстан (дополнительно) ───────────────────────────────────────────
  "aktau":           { safety: 3, ecology: 3, medicine: 2, climate_comfort: 2 },

  // ── Узбекистан (дополнительно) ──────────────────────────────────────────
  "bukhara":         { safety: 4, ecology: 3, medicine: 2, climate_comfort: 3 },

  // ── Таджикистан ─────────────────────────────────────────────────────────
  "dushanbe":        { safety: 3, ecology: 3, medicine: 2, climate_comfort: 3 },

  // ── Беларусь ────────────────────────────────────────────────────────────
  "minsk":           { safety: 4, ecology: 3, medicine: 3, climate_comfort: 2 },

  // ── Молдова ─────────────────────────────────────────────────────────────
  "chisinau":        { safety: 3, ecology: 3, medicine: 2, climate_comfort: 3 },

  // ── Албания ─────────────────────────────────────────────────────────────
  "tirana":          { safety: 3, ecology: 3, medicine: 2, climate_comfort: 3 },

  // ── Северная Македония ──────────────────────────────────────────────────
  "skopje":          { safety: 3, ecology: 3, medicine: 3, climate_comfort: 3 },

  // ── Армения (дополнительно) ─────────────────────────────────────────────
  "gyumri":          { safety: 3, ecology: 4, medicine: 2, climate_comfort: 3 },

  // ── Черногория (дополнительно) ──────────────────────────────────────────
  "herceg-novi":     { safety: 4, ecology: 5, medicine: 2, climate_comfort: 4 },

  // ── Турция (дополнительно) ──────────────────────────────────────────────
  "fethiye":         { safety: 4, ecology: 5, medicine: 3, climate_comfort: 5 },

  // ── Греция (дополнительно) ──────────────────────────────────────────────
  "heraklion":       { safety: 4, ecology: 5, medicine: 2, climate_comfort: 5 },

  // ── Южная Африка ────────────────────────────────────────────────────────
  "cape-town":       { safety: 2, ecology: 5, medicine: 3, climate_comfort: 4 },

  // ── Тунис ───────────────────────────────────────────────────────────────
  "sousse":          { safety: 3, ecology: 3, medicine: 2, climate_comfort: 4 },

  // ── Непал ───────────────────────────────────────────────────────────────
  "kathmandu":       { safety: 3, ecology: 2, medicine: 2, climate_comfort: 3 },

  // ── Таиланд (дополнительно) ─────────────────────────────────────────────
  "krabi":           { safety: 4, ecology: 5, medicine: 2, climate_comfort: 4 },
  "samui":           { safety: 4, ecology: 4, medicine: 2, climate_comfort: 4 },

  // ── Вьетнам (дополнительно) ─────────────────────────────────────────────
  "phu-quoc":        { safety: 4, ecology: 5, medicine: 2, climate_comfort: 4 },

  // ── Индонезия (дополнительно) ───────────────────────────────────────────
  "seminyak":        { safety: 4, ecology: 4, medicine: 3, climate_comfort: 4 },
  "ubud":            { safety: 4, ecology: 5, medicine: 2, climate_comfort: 4 },
  "medan":           { safety: 3, ecology: 2, medicine: 2, climate_comfort: 3 },
  "yogyakarta":      { safety: 4, ecology: 3, medicine: 3, climate_comfort: 3 },

  // ── Китай ───────────────────────────────────────────────────────────────
  "sanya":           { safety: 4, ecology: 4, medicine: 3, climate_comfort: 4 },

  // ── Мексика (дополнительно) ─────────────────────────────────────────────
  "merida":          { safety: 3, ecology: 4, medicine: 3, climate_comfort: 3 },

  // ── Россия (алиасы) ─────────────────────────────────────────────────────
  "spb":             { safety: 3, ecology: 3, medicine: 3, climate_comfort: 2 },

  // ── Казахстан (дополнительно) ───────────────────────────────────────────
  "astana":          { safety: 4, ecology: 3, medicine: 3, climate_comfort: 2 },
  "nur-sultan":      { safety: 4, ecology: 3, medicine: 3, climate_comfort: 2 },

  // ── Узбекистан (столица) ────────────────────────────────────────────────
  "tashkent":        { safety: 3, ecology: 2, medicine: 3, climate_comfort: 3 },

};

export function getCityQuality(slug: string): QualityData | null {
  return CITY_QUALITY[slug] ?? null;
}
