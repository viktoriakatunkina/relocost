// Унификация seo_title городов: 5 разных шаблонов → доминирующий.
//
// Проблема (аудит 07.09.2026): 116 из 175 title длиннее 60 символов, при этом
// в базе жило 5 разных шаблонов. Самый длинный — «… в 2026 году — калькулятор
// бюджета | Relocost» (43 символа хвоста, 30 городов, длина 67–74). Переводим
// его на доминирующий шаблон «… 2026: виза, цены, отзывы | Relocost»
// (122 города): −9 символов и на 2 шаблона меньше в кластере.
//
// Городскую часть строки НЕ трогаем — там уже правильные падежи и предлоги
// («во Вроцлаве», «на Тенерифе», «в Херцег-Нови») после правки P0.
//
// Запуск:  node scripts/unify-city-titles.mjs [--apply]
// Без --apply — сухой прогон (только печатает, что бы изменилось).

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(path.join(__dirname, "..", ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const APPLY = process.argv.includes("--apply");

// Хвосты старого шаблона → новый хвост.
const REPLACEMENTS = [
  [" в 2026 году — калькулятор бюджета | Relocost", " 2026: виза, цены, отзывы | Relocost"],
  [" в 2026 году — калькулятор | Relocost", " 2026: виза, цены, отзывы | Relocost"],
];

const { data, error } = await sb
  .from("cities")
  .select("slug, name_ru, is_foreign, seo_title")
  .order("slug");
if (error) throw error;

let changed = 0;
for (const c of data) {
  const title = c.seo_title ?? "";
  const hit = REPLACEMENTS.find(([from]) => title.endsWith(from));
  if (!hit) continue;
  // «виза» уместна только для зарубежных городов.
  if (!c.is_foreign) {
    console.log(`SKIP (Россия) ${c.slug}: ${title}`);
    continue;
  }
  let next = title.slice(0, -hit[0].length) + hit[1];
  // Уточнение страны в скобках («Валлетта (Мальта)») съедает 9 символов и
  // выбивает title за 70 — в выдаче оно всё равно обрежется. Страна и так
  // есть в description и в хлебных крошках.
  if (next.length > 66) next = next.replace(/ \([^)]+\)/, "");
  console.log(`${title.length} → ${next.length}  ${c.slug}\n   было:  ${title}\n   стало: ${next}`);
  changed++;
  if (APPLY) {
    const { error: upErr } = await sb
      .from("cities")
      .update({ seo_title: next })
      .eq("slug", c.slug);
    if (upErr) console.error("  ! ошибка:", upErr.message);
  }
}

console.log(`\n${APPLY ? "Обновлено" : "К обновлению"}: ${changed} городов`);
if (!APPLY) console.log("Сухой прогон. Для записи: node scripts/unify-city-titles.mjs --apply");
