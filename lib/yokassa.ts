import { randomUUID } from "crypto";

/**
 * Серверный клиент ЮKassa (REST API v3).
 * Документация: https://yookassa.ru/developers/api
 *
 * Самозанятый (НПД): фискальные чеки ЮKassa формирует и отправляет в ФНС
 * автоматически на стороне сервиса, поэтому объект `receipt` в запросе НЕ передаем.
 */

const API_BASE = "https://api.yookassa.ru/v3";

export type PackageType = "places" | "guide" | "budget" | "bundle";

/** Авторитетные цены (₽). Берутся ТОЛЬКО с сервера — клиенту не доверяем. */
export const PACKAGE_PRICES: Record<PackageType, number> = {
  places: 79,
  guide: 149,
  budget: 199,
  bundle: 299,
};

export const PACKAGE_LABELS: Record<PackageType, string> = {
  places: "Лучшие места",
  guide: "Гайд по жизни",
  budget: "Точный бюджет",
  bundle: "Все вместе",
};

export function isValidPackage(v: unknown): v is PackageType {
  return v === "places" || v === "guide" || v === "budget" || v === "bundle";
}

/** Настроены ли ключи ЮKassa. Если нет — фронт работает в demo-режиме. */
export function isYokassaConfigured(): boolean {
  return Boolean(process.env.YOKASSA_SHOP_ID && process.env.YOKASSA_SECRET_KEY);
}

/**
 * Слать ли в платеж чек НПД («Чеки для самозанятых»).
 * ВКЛЮЧАТЬ только после активации фискализации на стороне ЮKassa
 * (иначе платежи будут отклоняться). Управляется env YOKASSA_RECEIPTS=1.
 */
export function receiptsEnabled(): boolean {
  return process.env.YOKASSA_RECEIPTS === "1";
}

/**
 * Чек НПД для самозанятого: одна позиция-услуга, НДС не облагается (vat_code 1).
 * ЮKassa сама формирует чек в «Мой налог» и отправляет покупателю на email.
 */
export function buildNpdReceipt(opts: {
  email: string;
  description: string;
  amountRub: number;
}): Record<string, unknown> {
  return {
    customer: { email: opts.email },
    items: [
      {
        description: opts.description.slice(0, 128),
        quantity: "1.00",
        amount: { value: formatAmount(opts.amountRub), currency: "RUB" },
        vat_code: 1, // НДС не облагается (самозанятый)
        payment_subject: "service",
        payment_mode: "full_payment",
      },
    ],
  };
}

function authHeader(): string {
  const shopId = process.env.YOKASSA_SHOP_ID;
  const secretKey = process.env.YOKASSA_SECRET_KEY;
  if (!shopId || !secretKey) {
    throw new Error("YOKASSA_SHOP_ID / YOKASSA_SECRET_KEY не заданы");
  }
  const token = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
  return `Basic ${token}`;
}

/** Форматирует сумму в строку вида "79.00", как требует ЮKassa. */
function formatAmount(rub: number): string {
  return rub.toFixed(2);
}

export type YooPayment = {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  paid: boolean;
  amount: { value: string; currency: string };
  confirmation?: { type: string; confirmation_url?: string };
  metadata?: Record<string, string>;
};

/**
 * Создает платеж в ЮKassa с подтверждением через redirect.
 * Возвращает объект платежа с `confirmation.confirmation_url` для перенаправления.
 */
export async function createPayment(opts: {
  amountRub: number;
  description: string;
  returnUrl: string;
  metadata: Record<string, string>;
  /** Email покупателя — для уведомления и чека НПД на стороне ЮKassa. */
  customerEmail?: string;
  /** Чек НПД. Передавать ТОЛЬКО при включенной фискализации (receiptsEnabled). */
  receipt?: Record<string, unknown>;
}): Promise<YooPayment> {
  const body: Record<string, unknown> = {
    amount: { value: formatAmount(opts.amountRub), currency: "RUB" },
    capture: true,
    confirmation: { type: "redirect", return_url: opts.returnUrl },
    description: opts.description.slice(0, 128),
    metadata: opts.metadata,
  };
  if (opts.receipt) {
    body.receipt = opts.receipt;
  }

  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      "Idempotence-Key": randomUUID(),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ЮKassa createPayment ${res.status}: ${text}`);
  }
  return (await res.json()) as YooPayment;
}

/** Получает актуальное состояние платежа по id (для верификации webhook). */
export async function getPayment(paymentId: string): Promise<YooPayment> {
  const res = await fetch(`${API_BASE}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ЮKassa getPayment ${res.status}: ${text}`);
  }
  return (await res.json()) as YooPayment;
}
