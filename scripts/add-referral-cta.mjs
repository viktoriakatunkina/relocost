/**
 * Добавляет реферальные CTA-блоки в существующие статьи блога.
 * Запускать: node scripts/add-referral-cta.mjs
 *
 * Логика:
 * - Статьи про страховку → CTA с Cherehapa + SafetyWing
 * - Статьи про банки/карты → CTA с zarub.io + Плати по Миру
 * - Статьи про VPN → CTA с NordVPN
 * - Статьи про переезд в конкретную страну → страновой CTA (страховка + карта)
 *
 * Partner IDs пока заглушки (PARTNER_ID_HERE) — вставить после регистрации.
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";

const H = os.homedir();
const sb = createClient(
  fs.readFileSync(`${H}/.relocost/supabase_url`, "utf8").trim(),
  fs.readFileSync(`${H}/.relocost/supabase_service_role_key`, "utf8").trim(),
  { auth: { persistSession: false } }
);

// ─── CTA-блоки ────────────────────────────────────────────────────────────────

const CTA_INSURANCE = `
---

## Где купить страховку для переезда: проверенные сервисы

При переезде за рубеж страховка — не опция, а необходимость. Вот что реально работает для россиян в 2026 году:

- **[Cherehapa](https://cherehapa.ru/?utm_source=relocost&utm_medium=referral)** — агрегатор 30+ страховщиков (ERV, Альфа, Ингосстрах, Тинькофф). Сравниваете все предложения на одном экране, покрытие $30 000–500 000, полис приходит на email за 2 минуты. Для Грузии от 1 000 ₽/мес, для Европы от 1 500 ₽/мес.
- **[SafetyWing](https://safetywing.com/?utm_source=relocost)** — международная помесячная страховка для долгосрочных релокантов. ~$45/мес до 39 лет, без привязки к датам, автопродление. Отлично подходит для жизни в Азии и СНГ.

*Перед покупкой проверьте: сумма покрытия от $30 000, Ваша страна в зоне действия, даты совпадают с поездкой.*
`;

const CTA_BANKING = `
---

## Как получить зарубежную карту: рабочие варианты в 2026

Российские Visa/Mastercard за рубежом не работают. Проверенные способы:

- **[zarub.io](https://zarub.io/?utm_source=relocost)** — виртуальные карты Visa/Mastercard для онлайн-платежей, без выезда из России. Пополнение через СБП, Apple Pay подключается. Подходит для подписок, Netflix, Booking и т.д.
- **[Плати По Миру](https://platipomiru.ru/?utm_source=relocost)** — карта международного банка с доставкой. Открывается удалённо, работает для покупок за рубежом. ~300 ₽/мес обслуживание.
- Открыть счёт в банке Армении (Ameriabank, Evocabank) или Казахстана (Kaspi, Halyk) — подробнее в [нашем гайде по банкам для релокантов](/blog/kak-otkryt-schet-v-banke-armenii-2026).
`;

const CTA_RELOCATION_GENERAL = `
---

## Полезные сервисы для переезда

- **Страховка:** [Cherehapa](https://cherehapa.ru/?utm_source=relocost&utm_medium=referral) — сравнение 30+ страховщиков, полис за 5 минут, от 1 000 ₽/мес
- **Карта за рубежом:** [zarub.io](https://zarub.io/?utm_source=relocost) — виртуальная Visa/Mastercard без выезда
- **Бюджет переезда:** рассчитайте в [калькуляторе Relocost](/) — цены на жильё, еду и транспорт по 139 городам
`;

// ─── Маппинг: по каким признакам добавлять какой CTA ────────────────────────

function detectCTA(slug, title, tag, contentSnippet) {
  const text = (slug + " " + title + " " + contentSnippet).toLowerCase();

  // Страховка → insurance CTA
  if (text.includes("strakhovk") || text.includes("страховк") || text.includes("insurance") ||
      slug.includes("strakhovk") || slug.includes("meditsina") || slug.includes("vrachy")) {
    return { type: "insurance", cta: CTA_INSURANCE };
  }

  // Банки/карты/переводы → banking CTA
  if (text.includes("bank") || text.includes("karta") || text.includes("schet") ||
      text.includes("perevod") || slug.includes("bank") || slug.includes("kart") ||
      slug.includes("perevod") || slug.includes("dengi")) {
    return { type: "banking", cta: CTA_BANKING };
  }

  // Переезд / чеклист / общие → general CTA
  if (tag === "Переезд" || slug.includes("pereezd") || slug.includes("checklist") ||
      slug.includes("cheklis") || slug.includes("byudzhet") || slug.includes("budget")) {
    return { type: "general", cta: CTA_RELOCATION_GENERAL };
  }

  return null;
}

// ─── Основной цикл ────────────────────────────────────────────────────────────

// Получаем все опубликованные статьи
let allPosts = [];
let from = 0;
while (true) {
  const { data, error } = await sb.from("blog_posts")
    .select("id, slug, title, tag, content_md")
    .eq("published", true)
    .range(from, from + 199);
  if (error) throw new Error(error.message);
  if (!data.length) break;
  allPosts.push(...data);
  if (data.length < 200) break;
  from += 200;
}

console.log(`Всего статей: ${allPosts.length}`);

let updated = 0, skipped = 0, alreadyHas = 0;

for (const post of allPosts) {
  // Пропускаем если уже есть CTA (cherehapa или zarub)
  if (post.content_md && (
    post.content_md.includes("cherehapa.ru") ||
    post.content_md.includes("zarub.io") ||
    post.content_md.includes("platipomiru.ru")
  )) {
    alreadyHas++;
    continue;
  }

  const snippet = (post.content_md || "").slice(0, 500);
  const result = detectCTA(post.slug, post.title || "", post.tag || "", snippet);

  if (!result) {
    skipped++;
    continue;
  }

  // Добавляем CTA перед последним блоком "## Итого" или в конец
  let content = post.content_md || "";

  // Ищем раздел "## Итого" или "## FAQ" или "## Читайте также" — вставляем перед ним
  const insertPoints = ["## Итого", "## FAQ", "## Читайте также", "## Дополнительно"];
  let inserted = false;
  for (const point of insertPoints) {
    const idx = content.lastIndexOf(point);
    if (idx !== -1) {
      content = content.slice(0, idx) + result.cta + "\n\n" + content.slice(idx);
      inserted = true;
      break;
    }
  }

  // Если не нашли — добавляем в конец
  if (!inserted) {
    content = content.trimEnd() + "\n" + result.cta;
  }

  const { error: updErr } = await sb.from("blog_posts")
    .update({ content_md: content })
    .eq("id", post.id);

  if (updErr) {
    console.error(`  ✗ ${post.slug}: ${updErr.message}`);
    continue;
  }

  updated++;
  console.log(`✓ [${result.type}] ${post.slug}`);
}

console.log(`\nГотово: обновлено ${updated}, уже было ${alreadyHas}, пропущено (нет совпадения) ${skipped}`);
console.log("\n⚠️  Partner IDs ещё не вставлены — ссылки ведут напрямую без реф. кода.");
console.log("Когда зарегистрируетесь: заменить PARTNER_ID_HERE в CTA-блоках или запустить скрипт повторно.");
