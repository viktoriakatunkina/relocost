import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPayment } from "@/lib/yokassa";
import { ensurePurchasePaid } from "@/lib/purchase-fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/payment/webhook
 * Принимает уведомления ЮKassa (https://yookassa.ru/developers/using-api/webhooks).
 *
 * ЮKassa шлет { event, object } без подписи, поэтому достоверность проверяем
 * повторным запросом платежа по id (getPayment) — доверяем только статусу из API.
 *
 * Адрес webhook'а нужно зарегистрировать в ЛК ЮKassa (или через API) на
 * событие payment.succeeded: https://relocost.ru/api/payment/webhook
 */
export async function POST(req: Request) {
  let body: { event?: string; object?: { id?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const paymentId = body.object?.id;
  if (!paymentId) {
    // Отвечаем 200, чтобы ЮKassa не ретраила невалидное уведомление бесконечно.
    return NextResponse.json({ ok: true });
  }

  let payment;
  try {
    payment = await getPayment(paymentId);
  } catch {
    // Временная ошибка — 500, ЮKassa повторит доставку позже.
    return NextResponse.json({ error: "verify failed" }, { status: 500 });
  }

  const purchaseId = payment.metadata?.purchase_id;
  if (!purchaseId) {
    return NextResponse.json({ ok: true });
  }

  const db = supabaseAdmin();

  if (payment.status === "succeeded" && payment.paid) {
    // Помечаем покупку оплаченной; если записи нет — восстанавливаем её
    // (защита от потери оплаты). Идемпотентно: повторный webhook по paid-заказу
    // не создаёт дубль и не возвращает ошибку.
    await ensurePurchasePaid(db, payment, purchaseId);
  } else if (payment.status === "canceled") {
    await db
      .from("purchases")
      .update({ status: "failed" })
      .eq("id", purchaseId)
      .eq("status", "pending");
  }

  return NextResponse.json({ ok: true });
}
