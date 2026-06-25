// Единый источник производных сигналов города (климат, побережье) — чтобы
// подборки (lib/lists.ts), поиск (SearchClient), квиз и рейтинг считали их
// одинаково. Раньше эти данные дублировались в lists.ts (COASTAL + climateTemp)
// и SearchClient.tsx (SEASIDE) и успели разойтись — здесь сведены воедино.

// Средняя температура из строки climate вида «+27°C ср.» → число (или null).
export function climateTemp(c: { climate?: string | null }): number | null {
  if (!c.climate) return null;
  const m = c.climate.match(/([+-]?\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// Грубая категория климата по средней температуре.
export type ClimateBucket = "tropical" | "temperate" | "cool";
export function climateBucket(temp: number | null): ClimateBucket | null {
  if (temp === null) return null;
  if (temp >= 22) return "tropical";
  if (temp >= 12) return "temperate";
  return "cool";
}

// Города «у моря» — настоящее морское/океанское побережье (объединение прежних
// списков COASTAL из lists.ts и SEASIDE из SearchClient). Реки/озёра/эстуарии
// (Москва, Прага, Хошимин) сюда НЕ входят. Поля «coastal» в БД нет — ведём по slug.
export const COASTAL = new Set<string>([
  "abu-dhabi", "aktau", "alanya", "alicante", "antalya", "baku", "bali",
  "barcelona", "batumi", "bodrum", "budva", "cebu", "colombo", "da-nang",
  "doha", "dubai", "dubrovnik", "fethiye", "goa", "haifa", "heraklion",
  "hurghada", "izmir", "kaliningrad", "krabi", "larnaca", "limassol", "lisbon",
  "malaga", "manama", "manila", "muscat", "nha-trang", "paphos", "pattaya",
  "penang", "phu-quoc", "phuket", "playa-del-carmen", "porto", "rio-de-janeiro",
  "samui", "sanya", "sharjah", "sharm-el-sheikh", "sochi", "sousse", "split",
  "tel-aviv", "thessaloniki", "tivat", "valencia", "varna",
]);

export function isCoastal(slug: string): boolean {
  return COASTAL.has(slug);
}
