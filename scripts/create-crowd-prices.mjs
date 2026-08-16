// Разовая миграция: создаёт таблицу crowd_prices для краудсорс-цен.
// Запуск: node scripts/create-crowd-prices.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const URL = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_url"), "utf8").trim();
const KEY = fs.readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8").trim();
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

// Тест вставки тестовой строки (если таблица уже есть - поймём ошибку 404)
async function main() {
  // 1. Проверим, существует ли таблица
  const check = await sb.from("crowd_prices").select("id").limit(1);
  if (check.status !== 404) {
    console.log("Таблица crowd_prices уже существует, пропускаем создание.");
    return;
  }

  console.log("Таблица не найдена (404). Создаём через Supabase Management API...");

  // 2. Суpabase не предоставляет DDL через PostgREST (service role),
  //    поэтому используем Management API /database/query
  const projectRef = URL.replace("https://", "").split(".")[0];
  const sql = `
    CREATE TABLE IF NOT EXISTS crowd_prices (
      id uuid primary key default gen_random_uuid(),
      city_slug text not null,
      category text not null,
      item_name text not null,
      amount_rub numeric(12,0) not null check (amount_rub > 0 and amount_rub < 1000000),
      created_at timestamptz not null default now(),
      status text not null default 'approved'
    );
    CREATE INDEX IF NOT EXISTS idx_crowd_prices_city ON crowd_prices(city_slug);
    CREATE INDEX IF NOT EXISTS idx_crowd_prices_created ON crowd_prices(created_at desc);
  `;

  const resp = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  const text = await resp.text();
  if (!resp.ok) {
    console.error("Management API ошибка:", resp.status, text);
    console.log("\nSQL для ручного запуска в Supabase Studio:\n");
    console.log(sql);
    process.exit(1);
  }

  console.log("Таблица crowd_prices создана успешно.");

  // 3. Проверяем
  const verify = await sb.from("crowd_prices").select("id").limit(1);
  if (verify.status === 200) {
    console.log("Проверка пройдена: таблица доступна.");
  } else {
    console.log("Статус проверки:", verify.status, verify.error);
  }
}

main().catch(console.error);
