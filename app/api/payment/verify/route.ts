import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPayment, isYokassaConfigured } from "@/lib/yokassa";
import { ensurePurchasePaid } from "@/lib/purchase-fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/payment/verify?payment_id=...
 *
 * Источник правды для разблокировки. Спрашивает у ЮKassa реальный статус
 * платежа — контент открывается ТОЛЬКО если платеж succeeded и оплачен.
 * URL-параметрам и localStorage клиента не доверяем.
 *
 * Возвращает { ok, slug, pkg, status }. slug/pkg берем из metadata платежа,
 * клиент дополнительно сверяет slug со страницей.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("payment_id") || "";

  // Формат id платежа ЮKassa — буквы/цифры/дефисы.
  if (!/^[a-z0-9-]{16,64}$/i.test(paymentId)) {
    return NextResponse.json({ ok: false, error: "bad id" }, { status: 400 });
  }

  if (!isYokassaConfigured()) {
    return NextResponse.json({ ok: false });
  }

  let payment;
  try {
    payment = await getPayment(paymentId);
  } catch {
    return NextResponse.json({ ok: false, status: "error" }, { status: 502 });
  }

  if (payment.status === "succeeded" && payment.paid) {
    const slug = payment.metadata?.slug;
    const pkg = payment.metadata?.pkg;
    const purchaseId = payment.metadata?.purchase_id;
    // Бандл «Бюджет на 2 города» (/compare) — см. app/api/payment/create-bundle
    // и app/api/payment/webhook. Для обычной одиночной покупки эти поля в
    // metadata отсутствуют, и код ниже — no-op.
    const purchaseId2 = payment.metadata?.purchase_id_2;
    const slug2 = payment.metadata?.slug2;

    // Подстраховка на случай, если webhook еще не дошел: помечаем покупку
    // оплаченной. Если записи нет — восстанавливаем её из платежа (защита от
    // потери оплаты). Идемпотентно и не падает.
    if (purchaseId) {
      const db = supabaseAdmin();
      await ensurePurchasePaid(db, payment, purchaseId);
      if (purchaseId2) {
        await ensurePurchasePaid(db, payment, purchaseId2, slug2);
      }
    }

    return NextResponse.json({ ok: true, slug, pkg, slug2, status: payment.status });
  }

  return NextResponse.json({ ok: false, status: payment.status });
}
