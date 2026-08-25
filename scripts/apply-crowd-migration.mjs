// Применяет миграцию crowd_prices через прямое подключение к PostgreSQL.
// Запуск: node scripts/apply-crowd-migration.mjs
import pg from "pg";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tls from "node:tls";

const { Client } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = "ftkyoneazoqlkrpisdef";
// Ключ читаем из env или из ~/.relocost/supabase_service_role_key (тот же
// паттерн, что и во всех остальных scripts/*.mjs) — никогда не хардкодим.
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  (() => {
    try {
      return fs
        .readFileSync(path.join(os.homedir(), ".relocost/supabase_service_role_key"), "utf8")
        .trim();
    } catch {
      return "";
    }
  })();

if (!SERVICE_KEY) {
  console.error(
    "Нужен SUPABASE_SERVICE_ROLE_KEY (env) или файл ~/.relocost/supabase_service_role_key"
  );
  process.exit(1);
}

const sql = fs.readFileSync(
  path.join(__dirname, "../supabase/migrations/202606280900_crowd_prices.sql"),
  "utf8"
);

const connectionConfigs = [
  {
    host: `aws-0-eu-west-1.pooler.supabase.com`,
    port: 6543,
    database: "postgres",
    user: `postgres.${PROJECT_REF}`,
    password: SERVICE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
  {
    host: `db.${PROJECT_REF}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: SERVICE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  },
];

for (const config of connectionConfigs) {
  console.log(`Пробуем: ${config.host}:${config.port}`);
  const client = new Client(config);
  try {
    await client.connect();
    console.log("Подключение успешно!");
    await client.query(sql);
    console.log("Миграция применена успешно.");
    await client.end();
    process.exit(0);
  } catch (e) {
    console.error("Ошибка:", e.message);
    try { await client.end(); } catch {}
  }
}

console.error("\nНе удалось подключиться к Supabase PostgreSQL напрямую.");
console.log("Вставьте SQL вручную в Supabase Studio (supabase.com → project → SQL Editor):");
console.log("\n" + sql);
process.exit(1);
