# Relocost.ru

SEO-сайт-калькулятор стоимости жизни для людей, планирующих переезд внутри России или за рубеж. Монетизация freemium — базовый расчет бесплатно, детальные отчеты и гайды за деньги.

> **Полный актуальный контекст проекта (стек, деплой, доступы, операционные правила) — в [`CLAUDE.md`](./CLAUDE.md).** Этот README — краткая сводка, читай CLAUDE.md для реальной работы с проектом.

## Стек

- Next.js 14 (App Router, SSG)
- TypeScript + Tailwind CSS
- Supabase (PostgreSQL)
- Самохостинг на VPS (`next start` + systemd) — **не Vercel**, хостинг сменили; деплой через `./deploy.sh` (подробности в CLAUDE.md)
- ЮKassa (оплата)
- Unsplash API + Cloudflare R2 (фото городов)
- Anthropic Claude API (SEO-тексты)

## Структура

- `app/` — страницы и API-роуты
- `components/` — переиспользуемые UI-компоненты
- `lib/` — клиенты Supabase, Unsplash, ЮKassa, утилиты
- `supabase/migrations/` — SQL-миграции схемы
- `scripts/` — сид/бэкафилл-скрипты (города, фото, контент)
- `public/` — статика

## Локальная разработка

```bash
npm install
cp .env.example .env.local   # заполнить ключи — см. CLAUDE.md, раздел "Доступы"
npm run dev                  # http://localhost:3000
```

## Деплой

**Не Vercel.** `./deploy.sh` (или `./deploy-lowmem.sh` на машине с ≤8 ГБ RAM) — полная пересборка + атомарный деплой на VPS с авто-откатом при неудачном health-check. Подробная процедура и критичные правила (не запускать два билда одновременно, что делать при зависании сети) — в CLAUDE.md.

## ТЗ

Полное ТЗ — в `~/Desktop/Работа/Клод/relocost-claude-code-brief.docx` (версия 1.0, 2026).
