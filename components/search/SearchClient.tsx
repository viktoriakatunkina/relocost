"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CityWithBudget } from "@/lib/types";
import { CityCard } from "@/components/CityCard";
import { formatRub } from "@/lib/cities";
import { getVisa, type VisaStatus } from "@/lib/visa";
import { COASTAL, climateTemp } from "@/lib/city-signals";
import { cityName, countryName } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/routing";

type Region =
  | "all"
  | "ru"
  | "cis"
  | "europe"
  | "asia"
  | "middle_east"
  | "africa"
  | "americas";
type Climate = "all" | "tropical" | "temperate" | "cool";
type Difficulty = "all" | "easy" | "medium" | "hard";
type Destination = "all" | "foreign" | "russia";
type VisaFilter = "all" | "free" | "required";
type Sort = "budget" | "difficulty" | "name" | "popular";

const PAGE_SIZE = 18;

const FAST_INTERNET = new Set([
  "tbilisi", "yerevan", "almaty", "istanbul", "belgrade", "budapest", "lisbon", "porto",
  "riga", "tallinn", "vilnius", "warsaw", "prague", "bali", "chiang-mai", "kuala-lumpur",
  "bangkok", "singapore", "seoul", "dubai", "abu-dhabi", "astana", "tashkent",
  "ho-chi-minh", "hanoi", "cebu", "penang", "jakarta", "malaga", "alicante",
]);

// Пороги бюджета «до X ₽/мес». Шкала расширена далеко за пределы текущих данных
// (самый дорогой город ~170к), чтобы у тех, кто рассчитывает на высокий доход,
// был запас и понятная градация. null = «любой».
const BUDGET_STEPS: number[] = [50000, 75000, 100000, 150000, 200000, 300000, 500000];

// Фаллбек для городов, которых нет в REGION_BY_SLUG — по country_slug
const REGION_BY_COUNTRY: Record<string, Exclude<Region, "all">> = {
  russia: "ru",
  georgia: "europe",
  turkey: "europe",
  germany: "europe",
  france: "europe",
  italy: "europe",
  spain: "europe",
  portugal: "europe",
  netherlands: "europe",
  belgium: "europe",
  austria: "europe",
  switzerland: "europe",
  czech: "europe",
  "czech-republic": "europe",
  czechia: "europe",
  hungary: "europe",
  poland: "europe",
  estonia: "europe",
  latvia: "europe",
  lithuania: "europe",
  croatia: "europe",
  serbia: "europe",
  albania: "europe",
  moldova: "europe",
  "north-macedonia": "europe",
  cyprus: "europe",
  greece: "europe",
  montenegro: "europe",
  slovenia: "europe",
  slovakia: "europe",
  romania: "europe",
  bulgaria: "europe",
  liechtenstein: "europe",
  luxembourg: "europe",
  armenia: "cis",
  kazakhstan: "cis",
  uzbekistan: "cis",
  tajikistan: "cis",
  kyrgyzstan: "cis",
  azerbaijan: "cis",
  turkmenistan: "cis",
  belarus: "cis",
  ukraine: "cis",
  thailand: "asia",
  vietnam: "asia",
  indonesia: "asia",
  malaysia: "asia",
  cambodia: "asia",
  philippines: "asia",
  "south-korea": "asia",
  korea: "asia",
  china: "asia",
  india: "asia",
  nepal: "asia",
  "sri-lanka": "asia",
  singapore: "asia",
  myanmar: "asia",
  laos: "asia",
  mongolia: "asia",
  japan: "asia",
  taiwan: "asia",
  bangladesh: "asia",
  uae: "middle_east",
  "united-arab-emirates": "middle_east",
  bahrain: "middle_east",
  oman: "middle_east",
  qatar: "middle_east",
  jordan: "middle_east",
  israel: "middle_east",
  "saudi-arabia": "middle_east",
  kuwait: "middle_east",
  iraq: "middle_east",
  iran: "middle_east",
  egypt: "africa",
  morocco: "africa",
  tunisia: "africa",
  kenya: "africa",
  "ivory-coast": "africa",
  nigeria: "africa",
  "south-africa": "africa",
  ghana: "africa",
  ethiopia: "africa",
  tanzania: "africa",
  senegal: "africa",
  mexico: "americas",
  argentina: "americas",
  brazil: "americas",
  colombia: "americas",
  peru: "americas",
  chile: "americas",
  uruguay: "americas",
  cuba: "americas",
  "costa-rica": "americas",
  panama: "americas",
  ecuador: "americas",
};

// Фаллбек климата по стране
const CLIMATE_BY_COUNTRY: Record<string, Exclude<Climate, "all">> = {
  russia: "cool",
  georgia: "temperate",
  turkey: "temperate",
  germany: "cool",
  france: "temperate",
  italy: "temperate",
  spain: "temperate",
  portugal: "temperate",
  netherlands: "cool",
  belgium: "cool",
  austria: "cool",
  switzerland: "cool",
  czech: "cool",
  "czech-republic": "cool",
  czechia: "cool",
  hungary: "temperate",
  poland: "cool",
  estonia: "cool",
  latvia: "cool",
  lithuania: "cool",
  croatia: "temperate",
  serbia: "temperate",
  albania: "temperate",
  moldova: "temperate",
  "north-macedonia": "temperate",
  cyprus: "tropical",
  greece: "temperate",
  montenegro: "temperate",
  slovenia: "cool",
  slovakia: "cool",
  romania: "temperate",
  bulgaria: "temperate",
  liechtenstein: "cool",
  luxembourg: "cool",
  armenia: "temperate",
  kazakhstan: "cool",
  uzbekistan: "temperate",
  tajikistan: "temperate",
  kyrgyzstan: "cool",
  azerbaijan: "temperate",
  turkmenistan: "temperate",
  belarus: "cool",
  ukraine: "temperate",
  thailand: "tropical",
  vietnam: "tropical",
  indonesia: "tropical",
  malaysia: "tropical",
  cambodia: "tropical",
  philippines: "tropical",
  "south-korea": "temperate",
  korea: "temperate",
  china: "temperate",
  india: "tropical",
  nepal: "temperate",
  "sri-lanka": "tropical",
  singapore: "tropical",
  myanmar: "tropical",
  laos: "tropical",
  mongolia: "cool",
  japan: "temperate",
  taiwan: "temperate",
  bangladesh: "tropical",
  uae: "tropical",
  "united-arab-emirates": "tropical",
  bahrain: "tropical",
  oman: "tropical",
  qatar: "tropical",
  jordan: "temperate",
  israel: "temperate",
  "saudi-arabia": "tropical",
  kuwait: "tropical",
  egypt: "tropical",
  morocco: "temperate",
  tunisia: "temperate",
  kenya: "tropical",
  "ivory-coast": "tropical",
  nigeria: "tropical",
  "south-africa": "temperate",
  ghana: "tropical",
  ethiopia: "tropical",
  tanzania: "tropical",
  senegal: "tropical",
  mexico: "temperate",
  argentina: "temperate",
  brazil: "tropical",
  colombia: "tropical",
  peru: "temperate",
  chile: "temperate",
  uruguay: "temperate",
  cuba: "tropical",
  "costa-rica": "tropical",
  panama: "tropical",
  ecuador: "tropical",
};

const REGION_BY_SLUG: Record<string, Exclude<Region, "all">> = {
  moscow: "ru",
  spb: "ru",
  krasnodar: "ru",
  sochi: "ru",
  kaliningrad: "ru",
  yerevan: "cis",
  almaty: "cis",
  tbilisi: "europe",
  belgrade: "europe",
  istanbul: "europe",
  alanya: "europe",
  limassol: "europe",
  budapest: "europe",
  lisbon: "europe",
  bali: "asia",
  bangkok: "asia",
  dubai: "middle_east",
  astana: "cis",
  samarkand: "cis",
  izmir: "europe",
  porto: "europe",
  malaga: "europe",
  "chiang-mai": "asia",
  "ho-chi-minh": "asia",
  "da-nang": "asia",
  "nha-trang": "asia",
  "kuala-lumpur": "asia",
  pattaya: "asia",
  penang: "asia",
  "tel-aviv": "middle_east",
  "abu-dhabi": "middle_east",
  bukhara: "cis",
  baku: "cis",
  samui: "asia",
  bodrum: "europe",
  tirana: "europe",
  chisinau: "europe",
  dushanbe: "cis",
  colombo: "asia",
  hanoi: "asia",
  larnaca: "europe",
  heraklion: "europe",
  alicante: "europe",
  fethiye: "europe",
  tivat: "europe",
  doha: "middle_east",
  cebu: "asia",
  split: "europe",
  thessaloniki: "europe",
  aktau: "cis",
  muscat: "middle_east",
  manama: "middle_east",
  "phnom-penh": "asia",
  sanya: "asia",
  seoul: "asia",
  sharjah: "middle_east",
  madrid: "europe",
  jakarta: "asia",
  "phu-quoc": "asia",
  krabi: "asia",
  hurghada: "africa",
  "sharm-el-sheikh": "africa",
  cairo: "africa",
  marrakesh: "africa",
  sousse: "africa",
  "mexico-city": "americas",
  "playa-del-carmen": "americas",
  "buenos-aires": "americas",
  "rio-de-janeiro": "americas",
  amman: "middle_east",
  haifa: "middle_east",
  manila: "asia",
  kathmandu: "asia",
  "siem-reap": "asia",
  seville: "europe",
  ankara: "europe",
  skopje: "europe",
  kazan: "ru",
  yekaterinburg: "ru",
  gyumri: "cis",
};

const CLIMATE_BY_SLUG: Record<string, Exclude<Climate, "all">> = {
  bali: "tropical",
  bangkok: "tropical",
  dubai: "tropical",
  alanya: "tropical",
  limassol: "tropical",
  tbilisi: "temperate",
  yerevan: "temperate",
  belgrade: "temperate",
  almaty: "temperate",
  krasnodar: "temperate",
  sochi: "temperate",
  istanbul: "temperate",
  budapest: "temperate",
  lisbon: "temperate",
  kaliningrad: "cool",
  moscow: "cool",
  spb: "cool",
  astana: "cool",
  izmir: "temperate",
  porto: "temperate",
  malaga: "temperate",
  samarkand: "temperate",
  "chiang-mai": "tropical",
  "ho-chi-minh": "tropical",
  "da-nang": "tropical",
  "nha-trang": "tropical",
  "kuala-lumpur": "tropical",
  pattaya: "tropical",
  penang: "tropical",
  "abu-dhabi": "tropical",
  "tel-aviv": "temperate",
  bukhara: "temperate",
  baku: "temperate",
  samui: "tropical",
  bodrum: "temperate",
  tirana: "temperate",
  chisinau: "temperate",
  dushanbe: "temperate",
  colombo: "tropical",
  hanoi: "tropical",
  larnaca: "tropical",
  heraklion: "temperate",
  alicante: "temperate",
  fethiye: "temperate",
  tivat: "temperate",
  doha: "tropical",
  cebu: "tropical",
  split: "temperate",
  thessaloniki: "temperate",
  aktau: "temperate",
  muscat: "tropical",
  manama: "tropical",
  "phnom-penh": "tropical",
  sanya: "tropical",
  seoul: "temperate",
  sharjah: "tropical",
  madrid: "temperate",
  jakarta: "tropical",
  "phu-quoc": "tropical",
  krabi: "tropical",
  hurghada: "tropical",
  "sharm-el-sheikh": "tropical",
  cairo: "tropical",
  marrakesh: "temperate",
  sousse: "temperate",
  "mexico-city": "temperate",
  "playa-del-carmen": "tropical",
  "buenos-aires": "temperate",
  "rio-de-janeiro": "tropical",
  amman: "temperate",
  haifa: "temperate",
  manila: "tropical",
  kathmandu: "temperate",
  "siem-reap": "tropical",
  seville: "temperate",
  ankara: "temperate",
  skopje: "temperate",
  kazan: "cool",
  yekaterinburg: "cool",
  gyumri: "cool",
};

function diffBucket(score: number | null): Exclude<Difficulty, "all"> | null {
  if (score == null) return null;
  if (score <= 1) return "easy";
  if (score <= 3) return "medium";
  return "hard";
}

// Прямой рейс из Москвы определяем по полю flight_from_moscow: считаем рейс
// прямым, если в описании нет пометки «пересадк». Данные — свободный текст
// в БД («3.5 часа», «5 часов с пересадкой»), поэтому фолбэк-эвристика.
function isDirectFlight(flight: string | null): boolean {
  if (!flight) return false;
  return !/пересадк/i.test(flight);
}

export function SearchClient({ cities }: { cities: CityWithBudget[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("searchPage");

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region>("all");
  const [climate, setClimate] = useState<Climate>("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [destination, setDestination] = useState<Destination>("all");
  const [visa, setVisa] = useState<VisaFilter>("all");
  const [directOnly, setDirectOnly] = useState(false);
  const [seasideOnly, setSeasideOnly] = useState(false);
  // null = «любой» бюджет.
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>("budget");
  const [page, setPage] = useState(1);

  type TagKey = "cheap" | "warm" | "safe" | "visa_free" | "seaside" | "internet";

  const [activeTags, setActiveTags] = useState<Set<TagKey>>(new Set());

  const toggleTag = (tag: TagKey) =>
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });

  const EMOJI_TAGS: { key: TagKey; emoji: string; label: string }[] = [
    { key: "cheap",     emoji: "💰", label: "Дёшево" },
    { key: "warm",      emoji: "☀️", label: "Тепло зимой" },
    { key: "safe",      emoji: "🛡️", label: "Безопасно" },
    { key: "visa_free", emoji: "✈️", label: "Без визы" },
    { key: "seaside",   emoji: "🌊", label: "У моря" },
    { key: "internet",  emoji: "⚡", label: "Быстрый интернет" },
  ];

  const REGION_OPTIONS: [Region, string][] = [
    ["all", t("regionAll")],
    ["ru", t("regionRu")],
    ["cis", t("regionCis")],
    ["europe", t("regionEurope")],
    ["asia", t("regionAsia")],
    ["middle_east", t("regionMiddleEast")],
    ["africa", t("regionAfrica")],
    ["americas", t("regionAmericas")],
  ];
  const CLIMATE_OPTIONS: [Climate, string][] = [
    ["all", t("climateAll")],
    ["tropical", t("climateTropical")],
    ["temperate", t("climateTemperate")],
    ["cool", t("climateCool")],
  ];
  const DIFFICULTY_OPTIONS: [Difficulty, string][] = [
    ["all", t("difficultyAll")],
    ["easy", t("difficultyEasy")],
    ["medium", t("difficultyMedium")],
    ["hard", t("difficultyHard")],
  ];
  const DESTINATION_OPTIONS: [Destination, string][] = [
    ["all", t("destinationAll")],
    ["foreign", t("destinationForeign")],
    ["russia", t("destinationRussia")],
  ];
  const VISA_OPTIONS: [VisaFilter, string][] = [
    ["all", t("visaAll")],
    ["free", t("visaFree")],
    ["required", t("visaRequired")],
  ];
  const BUDGET_OPTIONS: [string, string][] = [
    ...BUDGET_STEPS.map(
      (v) => [String(v), t("budgetUpTo", { amount: formatRub(v) })] as [string, string],
    ),
    ["any", t("budgetAny")],
  ];
  const SORT_OPTIONS: [Sort, string][] = [
    ["budget", t("sortBudget")],
    ["difficulty", t("sortDifficulty")],
    ["popular", t("sortPopular")],
    ["name", t("sortName")],
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const max = budgetMax ?? Infinity;
    const list = cities.filter((c) => {
      if (q) {
        const name = cityName(c, locale).toLowerCase();
        const country = countryName(c, locale).toLowerCase();
        if (
          !name.includes(q) &&
          !country.includes(q) &&
          !c.name_ru.toLowerCase().includes(q) &&
          !c.country_ru.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (region !== "all") {
        const r = REGION_BY_SLUG[c.slug] ?? REGION_BY_COUNTRY[c.country_slug ?? ""];
        if (r !== region) return false;
      }
      if (climate !== "all") {
        const cl = CLIMATE_BY_SLUG[c.slug] ?? CLIMATE_BY_COUNTRY[c.country_slug ?? ""];
        if (cl !== climate) return false;
      }
      if (difficulty !== "all" && diffBucket(c.difficulty_score) !== difficulty)
        return false;
      if (destination === "foreign" && !c.is_foreign) return false;
      if (destination === "russia" && c.is_foreign) return false;
      if (visa !== "all") {
        const status: VisaStatus = getVisa(c).status;
        if (visa === "free" && status !== "visa_free") return false;
        if (visa === "required" && status !== "visa_required") return false;
      }
      if (directOnly && !isDirectFlight(c.flight_from_moscow)) return false;
      if (seasideOnly && !COASTAL.has(c.slug)) return false;
      if (c.monthly_from > 0 && c.monthly_from > max) return false;
      // Tag-фильтры (AND-логика: все активные теги должны совпасть)
      if (activeTags.has("cheap") && c.monthly_from > 50000) return false;
      if (activeTags.has("warm")) {
        const temp = climateTemp(c);
        if (!temp || temp < 18) return false;
      }
      if (activeTags.has("safe") && (c.difficulty_score === null || c.difficulty_score > 4)) return false;
      if (activeTags.has("visa_free") && getVisa(c).status !== "visa_free") return false;
      if (activeTags.has("seaside") && !COASTAL.has(c.slug)) return false;
      if (activeTags.has("internet") && !FAST_INTERNET.has(c.slug)) return false;
      return true;
    });

    const byName = (a: CityWithBudget, b: CityWithBudget) =>
      cityName(a, locale).localeCompare(cityName(b, locale), locale);

    return list.sort((a, b) => {
      if (sort === "budget") {
        const av = a.monthly_from || Infinity;
        const bv = b.monthly_from || Infinity;
        return av - bv || byName(a, b);
      }
      if (sort === "difficulty") {
        return (
          (a.difficulty_score ?? 99) - (b.difficulty_score ?? 99) || byName(a, b)
        );
      }
      if (sort === "popular") {
        return Number(b.is_popular) - Number(a.is_popular) || byName(a, b);
      }
      return byName(a, b);
    });
  }, [
    cities,
    locale,
    query,
    region,
    climate,
    difficulty,
    destination,
    visa,
    directOnly,
    seasideOnly,
    budgetMax,
    sort,
    activeTags,
  ]);

  const activeFilters =
    activeTags.size +
    (region !== "all" ? 1 : 0) +
    (climate !== "all" ? 1 : 0) +
    (difficulty !== "all" ? 1 : 0) +
    (destination !== "all" ? 1 : 0) +
    (visa !== "all" ? 1 : 0) +
    (directOnly ? 1 : 0) +
    (seasideOnly ? 1 : 0) +
    (budgetMax !== null ? 1 : 0);

  const hasAnyFilter = activeFilters > 0 || query.trim().length > 0;

  // Пагинация по отфильтрованному набору. Сбрасываем на 1-ю страницу при любом
  // изменении фильтров/поиска/сортировки.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    setPage(1);
  }, [query, region, climate, difficulty, destination, visa, directOnly, seasideOnly, budgetMax, sort, activeTags]);

  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Якорь начала списка городов — к нему скроллим при смене страницы (а не на
  // самый верх к фильтру, как было).
  const resultsRef = useRef<HTMLDivElement>(null);

  function reset() {
    setQuery("");
    setRegion("all");
    setClimate("all");
    setDifficulty("all");
    setDestination("all");
    setVisa("all");
    setDirectOnly(false);
    setSeasideOnly(false);
    setBudgetMax(null);
    setActiveTags(new Set());
    setPage(1);
  }

  function goToPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
    if (typeof window !== "undefined" && resultsRef.current) {
      // Прокручиваем к началу списка с запасом под «липкую» шапку, чтобы первые
      // города оказались сразу под ней, а не уехали под шапку.
      const top =
        resultsRef.current.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="rounded-3xl bg-surface/80 backdrop-blur border hairline shadow-card p-5 md:p-7 mb-8">
        {/* Строка поиска + «Очистить» */}
        <div className="flex items-center gap-3 mb-7">
          <div className="relative flex-1">
            <span
              className="absolute left-5 top-1/2 -translate-y-1/2 text-copper pointer-events-none"
              aria-hidden
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="w-full pr-5 py-4 rounded-pill bg-pine-tree/60 text-cream placeholder-brandy/45 text-lg border hairline focus:border-copper focus:outline-none transition [color-scheme:dark]"
              style={{ paddingLeft: "3.25rem" }}
              aria-label={t("ariaInput")}
            />
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={!hasAnyFilter}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-pill border hairline px-4 py-3 text-sm transition text-brandy/85 hover:border-copper/60 hover:text-cream disabled:opacity-40 disabled:pointer-events-none"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {t("clear")}
          </button>
        </div>

        {/* Тег-фильтры — «поиск как конструктор» */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-6 px-6 md:mx-0 md:px-0 mb-4">
          {EMOJI_TAGS.map((tag) => {
            const active = activeTags.has(tag.key);
            return (
              <button
                key={tag.key}
                type="button"
                onClick={() => toggleTag(tag.key)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-pill text-sm font-medium transition-all border ${
                  active
                    ? "bg-copper/20 border-copper text-copper"
                    : "bg-surface border-cream/10 text-brandy/75 hover:border-copper/40 hover:text-brandy"
                }`}
              >
                <span role="img" aria-hidden>{tag.emoji}</span>
                {tag.label}
              </button>
            );
          })}
          {activeTags.size > 0 && (
            <button
              type="button"
              onClick={() => setActiveTags(new Set())}
              className="shrink-0 px-3 py-2 text-sm text-brandy/50 hover:text-brandy transition"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* Чип-группы */}
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          <ChipGroup label={t("filterRegion")} value={region} options={REGION_OPTIONS} onChange={setRegion} />
          <ChipGroup label={t("filterClimate")} value={climate} options={CLIMATE_OPTIONS} onChange={setClimate} />
          <ChipGroup label={t("filterDifficulty")} value={difficulty} options={DIFFICULTY_OPTIONS} onChange={setDifficulty} />
          <ChipGroup label={t("filterDestination")} value={destination} options={DESTINATION_OPTIONS} onChange={setDestination} />
          <ChipGroup label={t("filterVisa")} value={visa} options={VISA_OPTIONS} onChange={setVisa} />
          <ChipGroup
            label={t("filterBudget")}
            value={budgetMax === null ? "any" : String(budgetMax)}
            options={BUDGET_OPTIONS}
            onChange={(v) => setBudgetMax(v === "any" ? null : Number(v))}
          />
        </div>

        {/* Нижняя панель: тумблеры + сортировка */}
        <div className="flex flex-wrap items-center gap-4 mt-7 pt-6 border-t hairline">
          <Toggle
            on={seasideOnly}
            onClick={() => setSeasideOnly((v) => !v)}
            label={t("seaside")}
          />
          <Toggle
            on={directOnly}
            onClick={() => setDirectOnly((v) => !v)}
            label={t("directFlight")}
          />

          <label className="inline-flex items-center gap-2 ml-auto text-brandy/70 text-sm">
            <span className="hidden sm:inline">{t("sort")}</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="appearance-none rounded-pill bg-pine-tree/60 border hairline text-cream pl-4 pr-9 py-2 text-sm focus:border-copper focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map(([v, lbl]) => (
                  <option key={v} value={v} className="bg-pine-tree">
                    {lbl}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-copper pointer-events-none"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </label>
        </div>
      </div>

      {/* Счетчик + сброс. resultsRef — якорь, к которому скроллим при пагинации. */}
      <div ref={resultsRef} className="flex items-center justify-between mb-6 scroll-mt-24">
        <span className="text-cream font-medium tabular-nums">
          {t("found", { count: filtered.length })}
        </span>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-copper text-sm hover:text-brandy transition"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {t("clearAll")}
            {activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brandy/80 text-lg mb-4">{t("emptyTitle")}</p>
          <button
            type="button"
            onClick={reset}
            className="text-copper hover:underline"
          >
            {t("emptyAction")}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((c, i) => (
              <CityCard key={c.id} city={c} index={(safePage - 1) * PAGE_SIZE + i} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={goToPage}
              prevLabel={t("prev")}
              nextLabel={t("next")}
              prevAria={t("prevAria")}
              nextAria={t("nextAria")}
              pageAria={(p) => t("pageAria", { page: p })}
            />
          )}
        </>
      )}
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="block text-brandy/55 text-[11px] uppercase tracking-[0.15em] mb-2.5">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, lbl]) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={active}
              className={`rounded-pill border px-3.5 py-2 text-sm transition ${
                active
                  ? "bg-copper text-pine-tree border-transparent font-semibold"
                  : "hairline text-brandy/85 hover:border-copper/60 hover:text-cream"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Тумблер-переключатель «вкл/выкл» (прямой рейс, у моря и т.п.).
function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-2.5 rounded-pill border px-4 py-2 text-sm transition ${
        on
          ? "bg-copper/15 border-copper/50 text-cream"
          : "hairline text-brandy/85 hover:border-copper/50"
      }`}
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
          on ? "bg-copper" : "bg-cream/15"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-cream shadow transition-transform ${
            on ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}

// Компактные номера страниц с многоточиями вокруг текущей.
function pageList(current: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  const push = (n: number) => out.push(n);
  const range = (a: number, b: number) => {
    for (let i = a; i <= b; i++) push(i);
  };
  if (total <= 7) {
    range(1, total);
    return out;
  }
  push(1);
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) out.push("…");
  range(left, right);
  if (right < total - 1) out.push("…");
  push(total);
  return out;
}

function Pagination({
  page,
  totalPages,
  onChange,
  prevLabel,
  nextLabel,
  prevAria,
  nextAria,
  pageAria,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  prevLabel: string;
  nextLabel: string;
  prevAria: string;
  nextAria: string;
  pageAria: (p: number) => string;
}) {
  const items = pageList(page, totalPages);
  const base =
    "inline-flex items-center justify-center rounded-pill border px-4 h-10 text-sm transition";
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 mt-10"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label={prevAria}
        className={`${base} hairline text-brandy/85 hover:border-copper/60 hover:text-cream disabled:opacity-35 disabled:pointer-events-none`}
      >
        <svg className="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="hidden sm:inline">{prevLabel}</span>
      </button>

      {items.map((it, idx) =>
        it === "…" ? (
          <span key={`gap-${idx}`} className="px-2 text-brandy/40 select-none">
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onChange(it)}
            aria-current={it === page ? "page" : undefined}
            aria-label={pageAria(it)}
            className={`${base} min-w-[2.5rem] tabular-nums ${
              it === page
                ? "bg-copper text-pine-tree border-transparent font-semibold"
                : "hairline text-brandy/85 hover:border-copper/60 hover:text-cream"
            }`}
          >
            {it}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={nextAria}
        className={`${base} hairline text-brandy/85 hover:border-copper/60 hover:text-cream disabled:opacity-35 disabled:pointer-events-none`}
      >
        <span className="hidden sm:inline">{nextLabel}</span>
        <svg className="ml-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
