import type { SupabaseClient } from "@supabase/supabase-js";
import type { YooPayment } from "@/lib/yokassa";
import { PACKAGE_LABELS, isValidPackage } from "@/lib/yokassa";
import { COUNTRY_NAMES_RU } from "@/lib/countries-content";
import { createAccessToken, isAccessLinkConfigured } from "@/lib/access-link";
import { sendMail } from "@/lib/mailer";
import { RECOVERED_EMAIL, ensurePurchasePaid } from "@/lib/purchase-fallback";

/**
 * Общий путь webhook и verify для succeeded-платежа: помечает покупку(и)
 * оплаченными (с защитой от потери оплаты) и шлет письмо по тем, что перешли
 * в paid именно сейчас. Бандл «Бюджет на 2 города» — purchase_id_2/slug2 в
 * metadata (см. app/api/payment/create-bundle).
 */
export async function markPaidAndNotify(
  db: SupabaseClient,
  payment: YooPayment,
): Promise<void> {
  const meta = payment.metadata ?? {};
  if (!meta.purchase_id) return;

  const newlyPaid: string[] = [];
  const r1 = await ensurePurchasePaid(db, payment, meta.purchase_id);
  if (r1 === "marked-paid" || r1 === "recovered") newlyPaid.push(meta.purchase_id);
  if (meta.purchase_id_2) {
    const r2 = await ensurePurchasePaid(db, payment, meta.purchase_id_2, meta.slug2);
    if (r2 === "marked-paid" || r2 === "recovered") newlyPaid.push(meta.purchase_id_2);
  }

  await sendPurchaseEmail(db, payment, newlyPaid);
}

/**
 * Письмо покупателю после оплаты: что куплено + ссылка, открывающая отчет на
 * любом устройстве (lib/access-link.ts).
 *
 * Вызывается из webhook и verify ТОЛЬКО для покупок, которые этим вызовом
 * перешли в paid (ensurePurchasePaid → "marked-paid" / "recovered") — переход
 * pending→paid происходит ровно один раз, поэтому и письмо уходит один раз,
 * даже если webhook и verify пришли одновременно.
 *
 * Никогда не бросает исключений: сбой почты не должен ломать ответ ЮKassa
 * и разблокировку.
 */

const LOCALES = ["ru", "en", "uz"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Item = { title: string; pkgLabel: string; url: string };

export async function sendPurchaseEmail(
  db: SupabaseClient,
  payment: YooPayment,
  purchaseIds: string[],
): Promise<void> {
  try {
    if (!purchaseIds.length) return;
    if (!isAccessLinkConfigured()) {
      console.error(
        "[purchase-email] ACCESS_LINK_SECRET не настроен — письмо не отправлено",
        { paymentId: payment.id },
      );
      return;
    }

    const { data: rows, error } = await db
      .from("purchases")
      .select("id, city_id, package_type, email")
      .in("id", purchaseIds);
    if (error || !rows?.length) {
      console.error("[purchase-email] покупки не найдены", {
        paymentId: payment.id,
        error: error?.message,
      });
      return;
    }

    const to = String(rows[0].email ?? "").trim();
    if (!EMAIL_RE.test(to) || to === RECOVERED_EMAIL) return;

    const cityIds = rows.map((r) => r.city_id).filter(Boolean) as string[];
    const { data: cities } = cityIds.length
      ? await db.from("cities").select("id, slug, name_ru").in("id", cityIds)
      : { data: [] as { id: string; slug: string; name_ru: string }[] };

    const meta = payment.metadata ?? {};
    const locale = (LOCALES as readonly string[]).includes(meta.locale ?? "")
      ? meta.locale
      : "ru";
    const prefix = locale === "ru" ? "" : `/${locale}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://relocost.ru";

    const items: Item[] = [];
    for (const r of rows) {
      const token = createAccessToken(r.id);
      if (!token || !isValidPackage(r.package_type)) continue;
      const pkgLabel = PACKAGE_LABELS[r.package_type];
      const city = cities?.find((c) => c.id === r.city_id);
      if (city) {
        items.push({
          title: city.name_ru,
          pkgLabel,
          url: `${siteUrl}${prefix}/city/${city.slug}?access=${token}`,
        });
      } else if (!r.city_id && meta.slug && COUNTRY_NAMES_RU[meta.slug]) {
        // Пакет страны: у покупки нет city_id, страна — в metadata платежа.
        items.push({
          title: COUNTRY_NAMES_RU[meta.slug],
          pkgLabel,
          url: `${siteUrl}${prefix}/country/${meta.slug}?access=${token}`,
        });
      }
    }
    if (!items.length) return;

    const amount = payment.amount?.value
      ? `${Math.round(Number(payment.amount.value))} ₽`
      : null;
    const subject =
      items.length === 1
        ? `Ваш отчет: ${items[0].title} — Relocost`
        : `Ваши отчеты: ${items.map((i) => i.title).join(", ")} — Relocost`;
    const replyTo = process.env.MAIL_REPLY_TO;
    const help = replyTo
      ? `Если что-то не открывается — напишите на ${replyTo}, поможем.`
      : "Если что-то не открывается — просто ответьте на это письмо.";

    const text = [
      "Спасибо за покупку!",
      "",
      `Оплата прошла${amount ? ` (${amount})` : ""}, доступ открыт навсегда.`,
      "",
      ...items.map((i) => `${i.title} — «${i.pkgLabel}»:\n${i.url}`),
      "",
      "Ссылка открывает отчет на любом устройстве: телефоне, компьютере, в другом браузере. Сохраните это письмо.",
      "",
      help,
      "",
      "Relocost — калькулятор стоимости жизни для переезда",
      siteUrl,
    ].join("\n");

    const buttons = items
      .map(
        (i) => `
        <tr><td style="padding:12px 0 4px;font-size:16px;color:#1a2105;">
          <b>${esc(i.title)}</b> — «${esc(i.pkgLabel)}»
        </td></tr>
        <tr><td style="padding:4px 0 12px;">
          <a href="${esc(i.url)}" style="display:inline-block;background:#c8734f;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-size:15px;font-weight:bold;">Открыть отчет</a>
        </td></tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html lang="ru"><body style="margin:0;padding:0;background:#f4f1ea;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;padding:28px;font-family:Arial,Helvetica,sans-serif;color:#1a2105;">
  <tr><td style="font-size:22px;font-weight:bold;padding-bottom:8px;">Спасибо за покупку!</td></tr>
  <tr><td style="font-size:15px;line-height:1.5;color:#3b4220;padding-bottom:8px;">
    Оплата прошла${amount ? ` (${esc(amount)})` : ""}, доступ открыт навсегда.
  </td></tr>
  ${buttons}
  <tr><td style="font-size:14px;line-height:1.5;color:#3b4220;padding-top:8px;">
    Ссылка открывает отчет на любом устройстве: телефоне, компьютере, в другом браузере. Сохраните это письмо.
  </td></tr>
  <tr><td style="font-size:14px;line-height:1.5;color:#3b4220;padding-top:12px;">${esc(help)}</td></tr>
  <tr><td style="font-size:12px;color:#8a8f78;padding-top:24px;">
    Relocost — калькулятор стоимости жизни для переезда · <a href="${esc(siteUrl)}" style="color:#8a8f78;">${esc(siteUrl.replace(/^https?:\/\//, ""))}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const ok = await sendMail({ to, subject, html, text });
    if (ok) {
      console.log("[purchase-email] письмо отправлено", {
        paymentId: payment.id,
        purchases: purchaseIds.length,
      });
    }
  } catch (e) {
    console.error("[purchase-email] сбой", {
      paymentId: payment.id,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
