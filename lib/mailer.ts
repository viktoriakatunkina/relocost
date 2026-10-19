import nodemailer, { type Transporter } from "nodemailer";

/**
 * Отправка писем через SMTP (любой провайдер: Яндекс 360, Unisender, Mail.ru
 * для бизнеса и т.п.). До 2026-10 в проекте не было отправки писем вообще.
 *
 * Настройки — в .env.local на сервере:
 *   SMTP_HOST, SMTP_PORT (465 = SSL, 587 = STARTTLS), SMTP_USER, SMTP_PASS,
 *   MAIL_FROM  (например: Relocost <hello@relocost.ru>; по умолчанию SMTP_USER),
 *   MAIL_REPLY_TO (необязательно — куда пойдут ответы покупателей).
 *
 * Если SMTP не настроен — письма просто не уходят (с логом), оплата и
 * разблокировка работают как раньше.
 */

let transporter: Transporter | null = null;

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

function getTransporter(): Transporter {
  if (transporter) return transporter;
  const port = Number(process.env.SMTP_PORT || 465);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    // Не держать webhook ЮKassa дольше нескольких секунд, если SMTP завис.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  if (!isMailConfigured()) {
    console.error("[mailer] SMTP не настроен — письмо не отправлено", {
      subject: opts.subject,
    });
    return false;
  }
  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      replyTo: process.env.MAIL_REPLY_TO || undefined,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return true;
  } catch (e) {
    console.error("[mailer] ошибка отправки", {
      subject: opts.subject,
      error: e instanceof Error ? e.message : String(e),
    });
    return false;
  }
}
