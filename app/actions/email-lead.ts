"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { sendMail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitEmailLead(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 254);
  const source = String(formData.get("source") ?? "blog")
    .trim()
    .slice(0, 80);

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Укажите корректный email" };
  }

  const sb = supabaseAdmin();
  const { error } = await sb.from("email_leads").insert({ email, source });

  if (error) {
    // 23505 — unique violation: такой email уже есть, считаем успехом
    if (error.code === "23505") return { ok: true };
    if (error.code === "PGRST205" || error.code === "42P01") {
      return { ok: false, error: "Сервис временно недоступен" };
    }
    return { ok: false, error: "Ошибка сервера" };
  }

  // Короткое приветственное письмо на новую строку (2026-10-29): канал был
  // "мёртвым" — форма собирала email, но ничего не отправляла, хотя SMTP-
  // инфраструктура для писем об оплате уже работает (lib/purchase-email.ts).
  // Не промо-рассылка, не на 23505-дубликат выше — только на реальный новый
  // insert. Сбой отправки НЕ должен ломать уже сохранённую запись в БД,
  // поэтому отдельный try/catch и ошибки только логируются.
  try {
    await sendWelcomeMail(email);
  } catch (e) {
    console.error("[email-lead] не удалось отправить приветственное письмо", {
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return { ok: true };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendWelcomeMail(to: string): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://relocost.ru";
  const subject = "Email сохранен — Relocost";
  const body =
    "Будем присылать только важные обновления по теме переезда — без рекламы и регулярных рассылок.";

  const text = [
    "Спасибо, email сохранен.",
    "",
    body,
    "",
    "Relocost — калькулятор стоимости жизни для переезда",
    siteUrl,
  ].join("\n");

  const html = `<!doctype html>
<html lang="ru"><body style="margin:0;padding:0;background:#f4f1ea;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;padding:28px;font-family:Arial,Helvetica,sans-serif;color:#1a2105;">
  <tr><td style="font-size:20px;font-weight:bold;padding-bottom:8px;">Спасибо, email сохранен</td></tr>
  <tr><td style="font-size:15px;line-height:1.5;color:#3b4220;padding-bottom:8px;">
    ${esc(body)}
  </td></tr>
  <tr><td style="font-size:12px;color:#8a8f78;padding-top:20px;">
    Relocost — калькулятор стоимости жизни для переезда · <a href="${esc(siteUrl)}" style="color:#8a8f78;">${esc(siteUrl.replace(/^https?:\/\//, ""))}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  await sendMail({ to, subject, html, text });
}
