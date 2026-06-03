# Relocost.ru

SEO-сайт-калькулятор стоимости жизни для людей, планирующих переезд внутри России или за рубеж. Монетизация freemium — базовый расчет бесплатно, детальные отчеты и гайды за деньги.

## Стек

- Next.js 14 (App Router, SSG)
- TypeScript + Tailwind CSS
- Supabase (PostgreSQL)
- Vercel (hosting + автодеплой)
- ЮKassa (оплата)
- Unsplash API (фото городов)
- Anthropic Claude API (SEO-тексты)

## Структура

- `app/` — страницы и API-роуты
- `components/` — переиспользуемые UI-компоненты
- `lib/` — клиенты Supabase, Unsplash, ЮKassa, утилиты
- `supabase/migrations/` — SQL-миграции схемы
- `public/` — статика

## Локальная разработка

```bash
npm install
cp .env.example .env.local   # заполнить ключи
npm run dev                  # http://localhost:3000
```

## Деплой

Автоматический через Vercel при push в `main`. Preview URL — на каждый PR.

## ТЗ

Полное ТЗ — в `~/Desktop/Работа/Клод/relocost-claude-code-brief.docx` (версия 1.0, 2026).
