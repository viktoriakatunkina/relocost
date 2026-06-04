import type { SupabaseClient } from "@supabase/supabase-js";
import type { YooPayment } from "@/lib/yokassa";
import { isValidPackage } from "@/lib/yokassa";

/**
 * Защита от потери оплаты.
 *
 * webhook и verify помечают покупку оплаченной строгим update по id записи в
 * purchases. Если записи с таким id нет (редкий сбой: insert не доехал, а деньги
 * списались), update просто затрагивает 0 строк — без ошибки, без лога, и оплата
 * молча теряется. Этот модуль восстанавливает такую запись из объекта платежа
 * ЮKassa и его metadata.
 *
 * МИНИМАЛЬНЫЙ вариант: без изменений схемы БД. Поэтому учитываем ограничения
 * таблицы purchases:
 *   - city_id uuid NOT NULL (FK на cities) — если город по slug не найден,
 *     восстановить запись НЕЛЬЗЯ (NOT NULL). В этом случае логируем аномалию и
 *     возвращаем результат "no-city" без падения.
 *   - email text NOT NULL — в metadata платежа email нет, поэтому при
 *     восстановлении подставляем sentinel, чтобы строка была видна как
 *     восстановленная.
 *   - amount integer NOT NULL (>0) — округляем value из ЮKassa.
 */

const LOG_PREFIX = "[purchase-fallback]";

// email в purchases NOT NULL, но в metadata платежа его нет. Маркер
// восстановленной записи — по нему такие покупки легко найти в БД.
const RECOVERED_EMAIL = "recovered@relocost.ru";

export type FallbackResult =
  | "ok-existing" // запись уже была paid (или была обновлена раньше) — идемпотентно
  | "recovered" // записи не было, восстановили как paid
  | "no-city" // записи не было И город по slug не найден — восстановить нельзя
  | "error"; // ошибка БД при восстановлении

/**
 * Гарантирует, что покупка по purchaseId помечена как paid.
 *
 * 1. Делает строгий update(status=paid).eq(id).neq(status,paid) с .select(),
 *    чтобы узнать, сколько строк затронуто.
 * 2. Если затронута строка — всё хорошо (обычный путь).
 * 3. Если 0 строк — проверяет, существует ли запись:
 *    - существует и уже paid → идемпотентность, ничего не делаем;
 *    - не существует → upsert по id со status=paid из данных платежа.
 *
 * Не бросает исключений — всегда возвращает FallbackResult, чтобы вызывающий
 * роут мог спокойно ответить ЮKassa 200 (повторный webhook не должен ретраиться).
 */
export async function ensurePurchasePaid(
  db: SupabaseClient,
  payment: YooPayment,
  purchaseId: string,
): Promise<FallbackResult> {
  const paymentId = payment.id;

  // Шаг 1. Обычный путь: помечаем paid и узнаём число затронутых строк.
  const { data: updated, error: updErr } = await db
    .from("purchases")
    .update({ status: "paid" })
    .eq("id", purchaseId)
    .neq("status", "paid")
    .select("id");

  if (updErr) {
    console.error(
      `${LOG_PREFIX} update failed paymentId=${paymentId} purchaseId=${purchaseId}: ${updErr.message}`,
    );
    return "error";
  }

  // Затронули строку — штатный сценарий, выходим.
  if (updated && updated.length > 0) {
    return "ok-existing";
  }

  // 0 строк затронуто. Различаем два случая: запись уже paid (идемпотентность)
  // ИЛИ записи вообще нет (фолбэк-восстановление).
  const { data: existing, error: selErr } = await db
    .from("purchases")
    .select("id, status")
    .eq("id", purchaseId)
    .maybeSingle();

  if (selErr) {
    console.error(
      `${LOG_PREFIX} existence check failed paymentId=${paymentId} purchaseId=${purchaseId}: ${selErr.message}`,
    );
    return "error";
  }

  // Запись есть (раз update её не тронул — она уже была paid). Идемпотентность.
  if (existing) {
    return "ok-existing";
  }

  // Записи нет — восстанавливаем из платежа.
  return recoverPurchase(db, payment, purchaseId);
}

/**
 * Восстанавливает отсутствующую запись purchases как paid из объекта платежа.
 * city_id NOT NULL → если город по slug не найден, восстановить нельзя.
 */
async function recoverPurchase(
  db: SupabaseClient,
  payment: YooPayment,
  purchaseId: string,
): Promise<FallbackResult> {
  const paymentId = payment.id;
  const meta = payment.metadata ?? {};
  const slug = meta.slug;
  const pkg = meta.pkg;

  // package_type ограничен check-constraint'ом — не пишем мусор.
  const packageType = isValidPackage(pkg) ? pkg : null;

  // amount: integer NOT NULL (>0). Округляем строковое value ЮKassa.
  const amount = Math.round(Number(payment.amount?.value));
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : null;

  // email в metadata нет — подставляем маркер восстановления (колонка NOT NULL).
  const email = meta.email || RECOVERED_EMAIL;

  // city_id обязателен (NOT NULL + FK). Ищем по slug.
  let cityId: string | null = null;
  if (slug) {
    const { data: city, error: cityErr } = await db
      .from("cities")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (cityErr) {
      console.error(
        `${LOG_PREFIX} city lookup failed slug=${slug} paymentId=${paymentId} purchaseId=${purchaseId}: ${cityErr.message}`,
      );
      return "error";
    }
    cityId = city?.id ?? null;
  }

  // Без city_id (NOT NULL) восстановить запись невозможно — это минимальный
  // вариант без изменения схемы. Логируем громко, чтобы оплату нашли вручную.
  if (!cityId || !packageType || safeAmount === null) {
    console.error(
      `${LOG_PREFIX} PAID-BUT-UNRECOVERABLE: оплата прошла, но запись восстановить нельзя ` +
        `paymentId=${paymentId} purchaseId=${purchaseId} slug=${slug ?? "—"} ` +
        `pkg=${pkg ?? "—"} amount=${payment.amount?.value ?? "—"} ` +
        `cityFound=${Boolean(cityId)} — ВОССТАНОВИТЬ ПОКУПКУ ВРУЧНУЮ`,
    );
    return "no-city";
  }

  // upsert по primary key id: status=paid. onConflict id → идемпотентно,
  // повторный webhook не создаст дубль.
  const { error: upErr } = await db.from("purchases").upsert(
    {
      id: purchaseId,
      city_id: cityId,
      package_type: packageType,
      email,
      amount: safeAmount,
      status: "paid",
    },
    { onConflict: "id" },
  );

  if (upErr) {
    console.error(
      `${LOG_PREFIX} recover upsert failed paymentId=${paymentId} purchaseId=${purchaseId}: ${upErr.message}`,
    );
    return "error";
  }

  console.error(
    `${LOG_PREFIX} RECOVERED: отсутствующая оплата восстановлена как paid ` +
      `paymentId=${paymentId} purchaseId=${purchaseId} slug=${slug} pkg=${packageType} amount=${safeAmount}`,
  );
  return "recovered";
}
