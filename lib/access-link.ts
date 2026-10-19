import { createHmac, timingSafeEqual } from "crypto";

/**
 * Ссылка доступа к оплаченному отчету — уходит покупателю в письме после
 * оплаты (см. lib/purchase-email.ts) и открывает отчет на ЛЮБОМ устройстве,
 * без ввода email.
 *
 * Зачем: разблокировка живет в localStorage браузера, где платили. Раньше
 * покупатель, открывший сайт с другого устройства, видел замок и должен был
 * сам найти «Уже оплатили?» — а письма с отчетом не было вовсе (жалобы
 * пользователей 2026-10). Токен = id покупки + HMAC-подпись, поэтому:
 *   - подделать/подобрать нельзя без ACCESS_LINK_SECRET;
 *   - схема БД не меняется (подпись проверяется без хранения токена);
 *   - доступ бессрочный, как и сама покупка (оферта: «доступ остается у Вас»).
 *
 * ACCESS_LINK_SECRET — длинная случайная строка в .env.local на сервере.
 * Смена секрета инвалидирует ВСЕ ранее отправленные ссылки — не менять без
 * необходимости (покупатели восстановят доступ через «Уже оплатили?»).
 */

const VERSION = "v1";

function secret(): string | null {
  const s = process.env.ACCESS_LINK_SECRET;
  return s && s.length >= 32 ? s : null;
}

export function isAccessLinkConfigured(): boolean {
  return secret() !== null;
}

function sign(purchaseId: string, key: string): string {
  return createHmac("sha256", key)
    .update(`relocost-access:${VERSION}:${purchaseId}`)
    .digest("base64url")
    .slice(0, 32);
}

/** Токен для ?access=… или null, если секрет не настроен. */
export function createAccessToken(purchaseId: string): string | null {
  const key = secret();
  if (!key) return null;
  return `${purchaseId}.${sign(purchaseId, key)}`;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** id покупки из валидного токена, иначе null. */
export function verifyAccessToken(token: unknown): string | null {
  const key = secret();
  if (!key || typeof token !== "string" || token.length > 100) return null;
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const purchaseId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!UUID_RE.test(purchaseId)) return null;
  const expected = Buffer.from(sign(purchaseId, key));
  const actual = Buffer.from(sig);
  if (actual.length !== expected.length) return null;
  return timingSafeEqual(actual, expected) ? purchaseId : null;
}
