// Честный счётчик покупок для соцдоказательства у paywall.
//
// 2026-09-11: считали по city_id — оказалось, что почти на любом городе,
// кроме горстки самых трафиковых, продаж за всё время 0-1, и блок
// соцдоказательства просто никогда не показывался (условие count > 0 не
// выполнялось почти нигде). 2026-09-14: переход на САЙТ-ВАЙД счётчик за
// скользящее окно в 30 дней — по всем городам и пакетам сразу. Окно в 30, а
// не в 7 дней: при текущем объёме продаж (единицы в месяц) семидневное окно
// почти всегда даёт 0-1, тридцатидневное даёт число, которое уже реально
// что-то показывает, оставаясь честным (не накопленное "за всё время",
// чтобы цифра не стагнировала, когда рост продаж есть).
//
// purchases закрыт RLS от анонимного ключа (там email), поэтому читаем
// сервисным ключом прямым REST-запросом — то же, что и другие built-time
// одноразовые чтения в проекте (см. generateStaticParams в page.tsx).

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Округляем порог до начала текущих суток (UTC): все страницы, собранные
 *  в рамках одного дня, шлют один и тот же URL — Next.js Data Cache отдаёт
 *  закешированный ответ вместо повторного похода в Supabase на каждую из
 *  сотен генерируемых страниц города. */
function windowStartIso(days: number): string {
  const startOfToday = Math.floor(Date.now() / DAY_MS) * DAY_MS;
  return new Date(startOfToday - (days - 1) * DAY_MS).toISOString();
}

async function countPaidSince(sinceIso: string): Promise<number> {
  if (!url || !serviceKey) return 0;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 5_000);
    const res = await fetch(
      `${url}/rest/v1/purchases?select=id&status=eq.paid&created_at=gte.${sinceIso}&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "count=exact",
        },
        signal: ctrl.signal,
      },
    ).finally(() => clearTimeout(tid));
    if (!res.ok) return 0;
    const range = res.headers.get("content-range"); // формат "0-0/5"
    const total = range?.split("/")[1];
    return total && total !== "*" ? parseInt(total, 10) : 0;
  } catch {
    // Не блокируем рендер страницы из-за счётчика — просто не показываем
    // блок соцдоказательства при любой ошибке/таймауте.
    return 0;
  }
}

/** Сайт-вайд число оплаченных заказов за последние `days` дней — по всем
 *  городам и пакетам. Используется вместо city-scoped версии везде, где
 *  раньше был getCityPurchaseCounts. */
export async function getGlobalPurchaseCount(days = 30): Promise<number> {
  return countPaidSince(windowStartIso(days));
}
