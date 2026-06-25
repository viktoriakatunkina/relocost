import { getCitiesWithBudget } from "./city-budget";
import type { CityWithBudget } from "./types";

// SEO-подборки городов («Города до 50 000 ₽», «Куда уехать на зимовку» и т.п.).
// Каждая — индексируемый лендинг /list/[slug] с уникальным текстом, списком
// городов из реальных данных (бюджет/сложность/климат) и ItemList-разметкой.
// Закрывают высокочастотные информационные интенты и раздают вес страницам городов.

export type ListDef = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  // Отбор и сортировка городов из общего списка с бюджетом.
  select: (cities: CityWithBudget[]) => CityWithBudget[];
};

// Средняя температура из строки climate вида «+27°C ср.» → число (или null).
function climateTemp(c: CityWithBudget): number | null {
  if (!c.climate) return null;
  const m = c.climate.match(/([+-]?\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

const hasBudget = (c: CityWithBudget) => c.monthly_from > 0;
const byBudget = (a: CityWithBudget, b: CityWithBudget) =>
  a.monthly_from - b.monthly_from;

// Приморские города (нет отдельного поля «у моря» — ведём ручной список slug).
const COASTAL = new Set<string>([
  "batumi", "sochi", "kaliningrad", "antalya", "alanya", "bodrum", "fethiye",
  "izmir", "limassol", "larnaca", "paphos", "budva", "tivat", "barcelona",
  "valencia", "alicante", "malaga", "lisbon", "porto", "split", "dubrovnik",
  "varna", "thessaloniki", "heraklion", "dubai", "abu-dhabi", "sharjah",
  "bali", "phuket", "pattaya", "samui", "krabi", "nha-trang", "da-nang",
  "phu-quoc", "colombo", "goa", "hurghada", "sharm-el-sheikh", "sousse",
  "muscat", "tel-aviv", "haifa", "rio-de-janeiro", "playa-del-carmen",
  "cebu", "penang", "manama", "doha",
]);

export const LISTS: ListDef[] = [
  {
    slug: "samye-deshevye",
    eyebrow: "Рейтинг",
    title: "Самые доступные города для жизни в 2026 году",
    intro:
      "Города с самым низким бюджетом на месяц: аренда однокомнатной на окраине, продукты, проездной и коммуналка с интернетом и связью. Суммы ориентировочные, по курсу начала 2026 года — отсортированы от самых дешевых.",
    seoTitle: "Самые дешевые города для жизни в 2026 — рейтинг по бюджету | Relocost",
    seoDescription:
      "Рейтинг самых доступных городов для переезда: реальный бюджет на месяц — аренда, еда, транспорт и ЖКХ. Где жить дешевле всего в 2026 году.",
    select: (cities) => cities.filter(hasBudget).sort(byBudget).slice(0, 30),
  },
  {
    slug: "do-50000-rubley",
    eyebrow: "Подборка",
    title: "Города, где можно жить на 50 000 ₽ в месяц",
    intro:
      "Направления, где базовый бюджет на одного человека укладывается примерно в 50 000 ₽ в месяц: аренда на окраине, продукты, транспорт и коммуналка. Ориентировочно, по курсу начала 2026 года.",
    seoTitle: "Куда переехать на 50 000 ₽ в месяц — города по бюджету 2026 | Relocost",
    seoDescription:
      "Города, где реально жить на 50 000 рублей в месяц: аренда, еда, транспорт и ЖКХ. Подборка доступных направлений для переезда в 2026 году.",
    select: (cities) =>
      cities.filter((c) => hasBudget(c) && c.monthly_from <= 50000).sort(byBudget),
  },
  {
    slug: "prostoy-pereezd",
    eyebrow: "Подборка",
    title: "Куда проще всего переехать россиянину",
    intro:
      "Зарубежные направления с самой низкой сложностью переезда: простой въезд, понятная легализация, рабочие банки и русскоязычная среда. Отсортированы от самых простых, затем по бюджету.",
    seoTitle: "Куда проще всего переехать из России в 2026 — простые страны | Relocost",
    seoDescription:
      "Города с самым простым переездом для россиян: безвиз или легкая виза, банки, ВНЖ и русскоязычное сообщество. Подборка на 2026 год.",
    select: (cities) =>
      cities
        .filter((c) => c.is_foreign && (c.difficulty_score ?? 5) <= 2)
        .sort(
          (a, b) =>
            (a.difficulty_score ?? 5) - (b.difficulty_score ?? 5) ||
            byBudget(a, b),
        )
        .slice(0, 30),
  },
  {
    slug: "dlya-zimovki",
    eyebrow: "Подборка",
    title: "Куда уехать на зимовку: теплые и недорогие города",
    intro:
      "Направления с теплой зимой (средняя температура от +22°C) и невысоким бюджетом — для тех, кто хочет переждать холода у моря или в тропиках. Отсортированы по стоимости жизни.",
    seoTitle: "Куда уехать на зимовку в 2026 — теплые недорогие города | Relocost",
    seoDescription:
      "Лучшие направления для зимовки: тепло круглый год и доступные цены. Подборка теплых городов для долгой зимовки россиян в 2026 году.",
    select: (cities) =>
      cities
        .filter((c) => {
          const t = climateTemp(c);
          return c.is_foreign && t !== null && t >= 22;
        })
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "dlya-udalenki",
    eyebrow: "Подборка",
    title: "Лучшие города для удаленной работы в 2026 году",
    intro:
      "Направления, удобные для удаленщиков: несложный переезд, доступный быт и комфортный климат. Подобраны по сочетанию низкой сложности переезда и адекватного бюджета.",
    seoTitle: "Лучшие города для удаленной работы 2026 — для релокантов | Relocost",
    seoDescription:
      "Где удобно жить и работать удаленно: простой переезд, недорогой быт, интернет и сообщество. Подборка городов для цифровых кочевников в 2026.",
    select: (cities) =>
      cities
        .filter(
          (c) => c.is_foreign && (c.difficulty_score ?? 5) <= 3 && hasBudget(c),
        )
        .sort(byBudget)
        .slice(0, 30),
  },
  {
    slug: "u-morya",
    eyebrow: "Подборка",
    title: "Города у моря для переезда и жизни",
    intro:
      "Приморские направления — от Адриатики и Средиземноморья до Юго-Восточной Азии и Залива. Отсортированы по стоимости жизни, чтобы было проще выбрать море по бюджету.",
    seoTitle: "Города у моря для переезда в 2026 — жизнь у океана по бюджету | Relocost",
    seoDescription:
      "Лучшие приморские города для переезда: жизнь у моря с реальными ценами на аренду и быт. Подборка направлений у воды на 2026 год.",
    select: (cities) =>
      cities.filter((c) => COASTAL.has(c.slug)).sort(byBudget),
  },
];

const BY_SLUG = new Map(LISTS.map((l) => [l.slug, l]));

export function getListDef(slug: string): ListDef | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getAllListSlugs(): string[] {
  return LISTS.map((l) => l.slug);
}

// Данные подборки: определение + отобранные города с бюджетом.
export async function getListData(
  slug: string,
): Promise<{ def: ListDef; cities: CityWithBudget[] } | null> {
  const def = getListDef(slug);
  if (!def) return null;
  const all = await getCitiesWithBudget();
  return { def, cities: def.select(all) };
}
