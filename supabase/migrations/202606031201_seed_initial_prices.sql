-- ============================================================
-- Relocost.ru — стартовые цены для 10 городов (раздел 6.2 ТЗ)
-- ============================================================
-- 20 позиций × 10 городов = 200 строк.
-- Цены в рублях, оценки на июнь 2026 (Numbeo + RU telegram-каналы).
-- is_premium=true для категорий cafe/health/entertainment — закрыто пакетом 'Точный бюджет'.

-- ---------- tbilisi ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 18000, 30000, false),
  ('rent', '1-комн. квартира в центре', 50000, 75000, false),
  ('rent', '1-комн. квартира на окраине', 30000, 50000, false),
  ('rent', '2-комн. квартира в центре', 70000, 110000, false),
  ('food', 'Обед в кафе', 700, 1200, false),
  ('food', 'Ужин на двоих в ресторане', 3500, 6000, false),
  ('food', 'Капучино', 250, 400, false),
  ('food', 'Продукты на месяц на 1 человека', 18000, 28000, false),
  ('transport', 'Месячный проездной', 2000, 2500, false),
  ('transport', 'Такси 3 км', 400, 700, false),
  ('transport', 'Бензин (1 л)', 90, 110, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 5000, 8000, false),
  ('utilities', 'Домашний интернет', 1500, 2500, false),
  ('utilities', 'Мобильная связь (месяц)', 800, 1500, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2500, 4000, true),
  ('cafe', 'Коктейль в баре', 700, 1200, true),
  ('health', 'Визит к частному врачу', 3000, 5000, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 4000, 7000, true),
  ('entertainment', 'Билет в кино', 600, 900, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 500, 900, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'tbilisi';

-- ---------- yerevan ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 15000, 25000, false),
  ('rent', '1-комн. квартира в центре', 40000, 60000, false),
  ('rent', '1-комн. квартира на окраине', 25000, 40000, false),
  ('rent', '2-комн. квартира в центре', 55000, 90000, false),
  ('food', 'Обед в кафе', 600, 1000, false),
  ('food', 'Ужин на двоих в ресторане', 3000, 5500, false),
  ('food', 'Капучино', 200, 350, false),
  ('food', 'Продукты на месяц на 1 человека', 16000, 25000, false),
  ('transport', 'Месячный проездной', 1500, 2200, false),
  ('transport', 'Такси 3 км', 300, 500, false),
  ('transport', 'Бензин (1 л)', 85, 100, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 4500, 7500, false),
  ('utilities', 'Домашний интернет', 1200, 2000, false),
  ('utilities', 'Мобильная связь (месяц)', 700, 1300, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2000, 3500, true),
  ('cafe', 'Коктейль в баре', 600, 1100, true),
  ('health', 'Визит к частному врачу', 2500, 4500, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 3500, 6500, true),
  ('entertainment', 'Билет в кино', 500, 800, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 400, 800, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'yerevan';

-- ---------- belgrade ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 22000, 35000, false),
  ('rent', '1-комн. квартира в центре', 55000, 85000, false),
  ('rent', '1-комн. квартира на окраине', 35000, 55000, false),
  ('rent', '2-комн. квартира в центре', 75000, 120000, false),
  ('food', 'Обед в кафе', 800, 1400, false),
  ('food', 'Ужин на двоих в ресторане', 4000, 7000, false),
  ('food', 'Капучино', 200, 350, false),
  ('food', 'Продукты на месяц на 1 человека', 20000, 30000, false),
  ('transport', 'Месячный проездной', 2500, 3500, false),
  ('transport', 'Такси 3 км', 350, 600, false),
  ('transport', 'Бензин (1 л)', 130, 160, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 6500, 10000, false),
  ('utilities', 'Домашний интернет', 1500, 2500, false),
  ('utilities', 'Мобильная связь (месяц)', 900, 1600, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2800, 4500, true),
  ('cafe', 'Коктейль в баре', 700, 1300, true),
  ('health', 'Визит к частному врачу', 3500, 6000, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 4500, 7500, true),
  ('entertainment', 'Билет в кино', 500, 800, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 500, 1000, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'belgrade';

-- ---------- dubai ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 50000, 90000, false),
  ('rent', '1-комн. квартира в центре', 180000, 280000, false),
  ('rent', '1-комн. квартира на окраине', 110000, 170000, false),
  ('rent', '2-комн. квартира в центре', 280000, 450000, false),
  ('food', 'Обед в кафе', 1500, 2500, false),
  ('food', 'Ужин на двоих в ресторане', 8000, 15000, false),
  ('food', 'Капучино', 500, 800, false),
  ('food', 'Продукты на месяц на 1 человека', 35000, 55000, false),
  ('transport', 'Месячный проездной', 6500, 8500, false),
  ('transport', 'Такси 3 км', 800, 1200, false),
  ('transport', 'Бензин (1 л)', 70, 90, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 12000, 22000, false),
  ('utilities', 'Домашний интернет', 4000, 6500, false),
  ('utilities', 'Мобильная связь (месяц)', 3000, 5500, false),
  ('cafe', 'Стейк в ресторане среднего класса', 6500, 12000, true),
  ('cafe', 'Коктейль в баре', 1800, 3500, true),
  ('health', 'Визит к частному врачу', 8000, 15000, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 12000, 20000, true),
  ('entertainment', 'Билет в кино', 1500, 2200, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 1500, 3000, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'dubai';

-- ---------- bali ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 12000, 22000, false),
  ('rent', '1-комн. квартира в центре', 30000, 50000, false),
  ('rent', '1-комн. квартира на окраине', 18000, 30000, false),
  ('rent', '2-комн. квартира в центре', 45000, 80000, false),
  ('food', 'Обед в кафе', 250, 500, false),
  ('food', 'Ужин на двоих в ресторане', 2000, 4500, false),
  ('food', 'Капучино', 250, 450, false),
  ('food', 'Продукты на месяц на 1 человека', 15000, 25000, false),
  ('transport', 'Месячный проездной', 2000, 3000, false),
  ('transport', 'Такси 3 км', 250, 500, false),
  ('transport', 'Бензин (1 л)', 75, 95, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 4500, 9000, false),
  ('utilities', 'Домашний интернет', 1500, 2500, false),
  ('utilities', 'Мобильная связь (месяц)', 500, 1000, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2500, 4500, true),
  ('cafe', 'Коктейль в баре', 700, 1500, true),
  ('health', 'Визит к частному врачу', 3500, 7000, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 4500, 8000, true),
  ('entertainment', 'Билет в кино', 400, 700, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 600, 1200, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'bali';

-- ---------- bangkok ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 15000, 25000, false),
  ('rent', '1-комн. квартира в центре', 50000, 90000, false),
  ('rent', '1-комн. квартира на окраине', 25000, 45000, false),
  ('rent', '2-комн. квартира в центре', 75000, 130000, false),
  ('food', 'Обед в кафе', 250, 500, false),
  ('food', 'Ужин на двоих в ресторане', 3000, 6500, false),
  ('food', 'Капучино', 280, 450, false),
  ('food', 'Продукты на месяц на 1 человека', 18000, 28000, false),
  ('transport', 'Месячный проездной', 2500, 3500, false),
  ('transport', 'Такси 3 км', 250, 450, false),
  ('transport', 'Бензин (1 л)', 100, 130, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 4500, 9000, false),
  ('utilities', 'Домашний интернет', 1500, 2500, false),
  ('utilities', 'Мобильная связь (месяц)', 700, 1300, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2500, 5000, true),
  ('cafe', 'Коктейль в баре', 700, 1500, true),
  ('health', 'Визит к частному врачу', 3500, 7000, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 4500, 9000, true),
  ('entertainment', 'Билет в кино', 500, 800, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 600, 1300, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'bangkok';

-- ---------- almaty ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 25000, 40000, false),
  ('rent', '1-комн. квартира в центре', 55000, 90000, false),
  ('rent', '1-комн. квартира на окраине', 35000, 55000, false),
  ('rent', '2-комн. квартира в центре', 80000, 130000, false),
  ('food', 'Обед в кафе', 700, 1200, false),
  ('food', 'Ужин на двоих в ресторане', 3500, 6500, false),
  ('food', 'Капучино', 300, 450, false),
  ('food', 'Продукты на месяц на 1 человека', 22000, 32000, false),
  ('transport', 'Месячный проездной', 1500, 2500, false),
  ('transport', 'Такси 3 км', 350, 600, false),
  ('transport', 'Бензин (1 л)', 60, 75, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 5500, 9000, false),
  ('utilities', 'Домашний интернет', 1500, 2500, false),
  ('utilities', 'Мобильная связь (месяц)', 800, 1500, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2800, 4500, true),
  ('cafe', 'Коктейль в баре', 700, 1200, true),
  ('health', 'Визит к частному врачу', 4000, 7000, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 4500, 8000, true),
  ('entertainment', 'Билет в кино', 500, 900, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 600, 1100, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'almaty';

-- ---------- krasnodar ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 18000, 30000, false),
  ('rent', '1-комн. квартира в центре', 35000, 55000, false),
  ('rent', '1-комн. квартира на окраине', 25000, 40000, false),
  ('rent', '2-комн. квартира в центре', 50000, 80000, false),
  ('food', 'Обед в кафе', 500, 900, false),
  ('food', 'Ужин на двоих в ресторане', 2500, 4500, false),
  ('food', 'Капучино', 250, 400, false),
  ('food', 'Продукты на месяц на 1 человека', 18000, 28000, false),
  ('transport', 'Месячный проездной', 2500, 3200, false),
  ('transport', 'Такси 3 км', 300, 500, false),
  ('transport', 'Бензин (1 л)', 60, 65, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 5000, 8000, false),
  ('utilities', 'Домашний интернет', 700, 1200, false),
  ('utilities', 'Мобильная связь (месяц)', 500, 900, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2000, 3500, true),
  ('cafe', 'Коктейль в баре', 500, 1000, true),
  ('health', 'Визит к частному врачу', 2500, 4500, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 3500, 6500, true),
  ('entertainment', 'Билет в кино', 400, 700, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 400, 800, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'krasnodar';

-- ---------- sochi ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 30000, 50000, false),
  ('rent', '1-комн. квартира в центре', 60000, 100000, false),
  ('rent', '1-комн. квартира на окраине', 40000, 65000, false),
  ('rent', '2-комн. квартира в центре', 85000, 150000, false),
  ('food', 'Обед в кафе', 700, 1300, false),
  ('food', 'Ужин на двоих в ресторане', 3500, 7000, false),
  ('food', 'Капучино', 300, 500, false),
  ('food', 'Продукты на месяц на 1 человека', 22000, 35000, false),
  ('transport', 'Месячный проездной', 2500, 3500, false),
  ('transport', 'Такси 3 км', 350, 650, false),
  ('transport', 'Бензин (1 л)', 60, 65, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 5500, 9000, false),
  ('utilities', 'Домашний интернет', 800, 1300, false),
  ('utilities', 'Мобильная связь (месяц)', 500, 900, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2500, 4500, true),
  ('cafe', 'Коктейль в баре', 700, 1300, true),
  ('health', 'Визит к частному врачу', 3000, 5500, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 4500, 8000, true),
  ('entertainment', 'Билет в кино', 500, 800, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 500, 1000, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'sochi';

-- ---------- kaliningrad ----------
insert into public.prices (city_id, category, item_name_ru, price_min, price_max, is_premium)
select id, x.category, x.item_name_ru, x.price_min, x.price_max, x.is_premium from public.cities, (values
  ('rent', 'Комната', 18000, 28000, false),
  ('rent', '1-комн. квартира в центре', 35000, 55000, false),
  ('rent', '1-комн. квартира на окраине', 25000, 38000, false),
  ('rent', '2-комн. квартира в центре', 50000, 78000, false),
  ('food', 'Обед в кафе', 500, 900, false),
  ('food', 'Ужин на двоих в ресторане', 2500, 5000, false),
  ('food', 'Капучино', 250, 400, false),
  ('food', 'Продукты на месяц на 1 человека', 19000, 28000, false),
  ('transport', 'Месячный проездной', 2500, 3200, false),
  ('transport', 'Такси 3 км', 300, 500, false),
  ('transport', 'Бензин (1 л)', 60, 65, false),
  ('utilities', 'ЖКХ за 1-комн. квартиру', 5500, 8500, false),
  ('utilities', 'Домашний интернет', 800, 1200, false),
  ('utilities', 'Мобильная связь (месяц)', 500, 900, false),
  ('cafe', 'Стейк в ресторане среднего класса', 2000, 3500, true),
  ('cafe', 'Коктейль в баре', 500, 1000, true),
  ('health', 'Визит к частному врачу', 2500, 4500, true),
  ('health', 'Абонемент в фитнес-клуб (мес)', 3500, 6500, true),
  ('entertainment', 'Билет в кино', 400, 700, true),
  ('entertainment', 'Бокал вина или коктейль в баре', 400, 800, true)
) as x(category, item_name_ru, price_min, price_max, is_premium)
where slug = 'kaliningrad';

