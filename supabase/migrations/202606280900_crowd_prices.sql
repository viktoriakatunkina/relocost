-- ============================================================
-- Relocost.ru — краудсорс цен (crowd_prices)
-- Фича #10: пользователи вносят актуальные цены → сообщество
-- ============================================================

CREATE TABLE IF NOT EXISTS public.crowd_prices (
  id         uuid             primary key default gen_random_uuid(),
  city_slug  text             not null,
  category   text             not null,
  item_name  text             not null,
  amount_rub numeric(12,0)   not null check (amount_rub > 0 and amount_rub < 1000000),
  created_at timestamptz      not null default now(),
  status     text             not null default 'approved'
);

CREATE INDEX IF NOT EXISTS idx_crowd_prices_city    ON public.crowd_prices(city_slug);
CREATE INDEX IF NOT EXISTS idx_crowd_prices_created ON public.crowd_prices(created_at desc);
CREATE INDEX IF NOT EXISTS idx_crowd_prices_status  ON public.crowd_prices(status);

COMMENT ON TABLE public.crowd_prices IS
  'Краудсорс-цены: пользователи вносят актуальные цены по городам. status=approved — видно на сайте.';
