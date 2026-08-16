// Данные для блока TrueSizeMap: площадь стран и текстовое сравнение с Россией.
// Россия: 17 098 246 км². Площадь регионов для сравнения:
//   Московская обл — 44 329 км²
//   Краснодарский кр — 75 485 км²
//   Калининградская обл — 15 125 км²
//   Беларусь — 207 600 км² (для масштаба)

export type CountrySizeData = {
  /** Площадь в км² */
  area_km2: number;
  /** Во сколько раз меньше России (17 098 246 / area_km2) */
  russia_ratio: number;
  /** Текстовое сравнение для русской локали */
  comparison_ru: string;
  /** Текстовое сравнение для английской локали */
  comparison_en: string;
  /** SVG-путь контура страны (viewBox 0 0 200 200 — нормализован).
   *  Приближённый многоугольник, визуально узнаваемый. */
  svg_path: string;
};

export const COUNTRY_SIZE_DATA: Record<string, CountrySizeData> = {
  georgia: {
    area_km2: 69_700,
    russia_ratio: 245,
    comparison_ru:
      "Площадь Грузии — 69 700 км². Это как Московская и Тверская области вместе или в 245 раз меньше России.",
    comparison_en:
      "Georgia's area is 69,700 km² — about 245× smaller than Russia, comparable to the US state of West Virginia.",
    svg_path:
      "M 40 80 L 80 60 L 130 65 L 160 70 L 165 90 L 150 105 L 120 110 L 90 115 L 60 110 L 40 95 Z",
  },
  armenia: {
    area_km2: 29_743,
    russia_ratio: 575,
    comparison_ru:
      "Площадь Армении — 29 743 км². Это чуть больше Московской области и в 575 раз меньше России.",
    comparison_en:
      "Armenia's area is 29,743 km² — 575× smaller than Russia, about the size of Maryland and Delaware combined.",
    svg_path:
      "M 70 60 L 110 55 L 135 70 L 140 100 L 130 120 L 100 130 L 70 120 L 55 95 L 60 70 Z",
  },
  serbia: {
    area_km2: 77_474,
    russia_ratio: 221,
    comparison_ru:
      "Площадь Сербии — 77 474 км². Примерно как Краснодарский край — в 221 раз меньше России.",
    comparison_en:
      "Serbia's area is 77,474 km² — 221× smaller than Russia, roughly the size of South Carolina.",
    svg_path:
      "M 65 45 L 110 40 L 140 55 L 155 80 L 150 110 L 130 130 L 105 140 L 75 135 L 55 115 L 50 85 L 55 60 Z",
  },
  uae: {
    area_km2: 83_600,
    russia_ratio: 204,
    comparison_ru:
      "Площадь ОАЭ — 83 600 км². Это как Краснодарский край плюс Ростовская область — в 204 раза меньше России.",
    comparison_en:
      "UAE's area is 83,600 km² — 204× smaller than Russia, about the size of Austria.",
    svg_path:
      "M 45 50 L 130 45 L 160 70 L 165 100 L 155 120 L 130 125 L 100 130 L 70 115 L 50 90 L 40 65 Z",
  },
  indonesia: {
    area_km2: 1_904_569,
    russia_ratio: 9,
    comparison_ru:
      "Площадь Индонезии — 1 904 569 км². Это примерно 1/9 России. Но Индонезия — архипелаг: сам Бали занимает лишь 5 780 км².",
    comparison_en:
      "Indonesia's area is 1,904,569 km² — about 1/9 of Russia. But Indonesia is an archipelago; Bali itself is only 5,780 km².",
    svg_path:
      "M 10 80 L 50 60 L 90 65 L 120 60 L 160 55 L 185 70 L 190 85 L 175 100 L 145 105 L 110 100 L 80 95 L 50 100 L 20 95 Z",
  },
  thailand: {
    area_km2: 513_120,
    russia_ratio: 33,
    comparison_ru:
      "Площадь Таиланда — 513 120 км². Это примерно как 3 Краснодарских края или в 33 раза меньше России.",
    comparison_en:
      "Thailand's area is 513,120 km² — 33× smaller than Russia, similar in size to France.",
    svg_path:
      "M 75 25 L 100 20 L 125 30 L 135 60 L 130 90 L 125 120 L 110 145 L 90 165 L 80 150 L 75 130 L 80 110 L 85 80 L 80 55 L 65 40 Z",
  },
  malaysia: {
    area_km2: 329_847,
    russia_ratio: 52,
    comparison_ru:
      "Площадь Малайзии — 329 847 км². Это как 2 Краснодарских края и Московская область вместе, в 52 раза меньше России.",
    comparison_en:
      "Malaysia's area is 329,847 km² — 52× smaller than Russia, about the size of Norway.",
    svg_path:
      "M 15 75 L 55 60 L 100 65 L 130 60 L 155 70 L 160 90 L 150 105 L 125 110 L 100 105 L 70 100 L 40 105 L 20 95 Z",
  },
  kazakhstan: {
    area_km2: 2_724_900,
    russia_ratio: 6,
    comparison_ru:
      "Казахстан — 2 724 900 км²: 9-я по размеру страна мира, в 6 раз меньше России. Это чуть меньше всей Западной Европы.",
    comparison_en:
      "Kazakhstan is 2,724,900 km² — the 9th largest country in the world, 6× smaller than Russia.",
    svg_path:
      "M 20 40 L 90 30 L 150 35 L 180 55 L 185 90 L 170 125 L 140 145 L 100 150 L 60 140 L 30 115 L 15 80 L 18 55 Z",
  },
  turkey: {
    area_km2: 783_356,
    russia_ratio: 22,
    comparison_ru:
      "Площадь Турции — 783 356 км². Это как 5 Краснодарских краев или Франция и Германия вместе — в 22 раза меньше России.",
    comparison_en:
      "Turkey's area is 783,356 km² — 22× smaller than Russia, roughly as large as France and Germany combined.",
    svg_path:
      "M 20 65 L 60 50 L 110 45 L 155 50 L 180 65 L 185 85 L 175 100 L 145 110 L 110 115 L 80 110 L 50 100 L 25 85 Z",
  },
  cyprus: {
    area_km2: 9_251,
    russia_ratio: 1847,
    comparison_ru:
      "Площадь Кипра — 9 251 км². Это как Калининградская область. В 1847 раз меньше России — уютный средиземноморский остров.",
    comparison_en:
      "Cyprus is 9,251 km² — 1,847× smaller than Russia, about the size of Delaware in the US.",
    svg_path:
      "M 30 80 L 75 60 L 130 65 L 165 80 L 160 100 L 140 115 L 110 120 L 75 115 L 45 105 L 28 90 Z",
  },
  hungary: {
    area_km2: 93_028,
    russia_ratio: 184,
    comparison_ru:
      "Площадь Венгрии — 93 028 км². Это как Краснодарский и Ставропольский края вместе — в 184 раза меньше России.",
    comparison_en:
      "Hungary's area is 93,028 km² — 184× smaller than Russia, roughly the size of Indiana.",
    svg_path:
      "M 35 65 L 90 50 L 140 55 L 165 75 L 160 100 L 140 115 L 105 120 L 70 115 L 40 100 L 28 80 Z",
  },
  portugal: {
    area_km2: 92_212,
    russia_ratio: 185,
    comparison_ru:
      "Площадь Португалии — 92 212 км². Это как Краснодарский край плюс Ставропольский — в 185 раз меньше России.",
    comparison_en:
      "Portugal's area is 92,212 km² — 185× smaller than Russia, slightly larger than Indiana.",
    svg_path:
      "M 70 25 L 100 22 L 115 45 L 120 80 L 115 120 L 105 155 L 85 165 L 70 145 L 60 110 L 58 70 L 62 40 Z",
  },
  poland: {
    area_km2: 312_696,
    russia_ratio: 55,
    comparison_ru:
      "Площадь Польши — 312 696 км². Это как 2 Краснодарских края и 2 Московских области — в 55 раз меньше России.",
    comparison_en:
      "Poland's area is 312,696 km² — 55× smaller than Russia, comparable to New Mexico.",
    svg_path:
      "M 40 40 L 120 35 L 160 50 L 165 90 L 155 120 L 130 135 L 90 140 L 50 130 L 25 105 L 22 70 L 30 50 Z",
  },
  "czech-republic": {
    area_km2: 78_866,
    russia_ratio: 217,
    comparison_ru:
      "Площадь Чехии — 78 866 км². Это как Краснодарский край — в 217 раз меньше России.",
    comparison_en:
      "Czech Republic's area is 78,866 km² — 217× smaller than Russia, about the size of South Carolina.",
    svg_path:
      "M 25 70 L 80 50 L 140 55 L 175 75 L 170 100 L 145 115 L 100 120 L 55 112 L 25 95 L 20 80 Z",
  },
  austria: {
    area_km2: 83_871,
    russia_ratio: 204,
    comparison_ru:
      "Площадь Австрии — 83 871 км². Это как Краснодарский край — в 204 раза меньше России.",
    comparison_en:
      "Austria's area is 83,871 km² — 204× smaller than Russia, slightly larger than Maine.",
    svg_path:
      "M 20 65 L 75 50 L 140 55 L 175 70 L 178 90 L 160 105 L 120 115 L 75 112 L 35 100 L 18 80 Z",
  },
  montenegro: {
    area_km2: 13_812,
    russia_ratio: 1238,
    comparison_ru:
      "Площадь Черногории — 13 812 км². Это чуть меньше Калининградской области — в 1238 раз меньше России.",
    comparison_en:
      "Montenegro's area is 13,812 km² — 1,238× smaller than Russia, about the size of Connecticut.",
    svg_path:
      "M 55 50 L 120 45 L 150 70 L 148 105 L 130 130 L 100 140 L 70 130 L 48 105 L 45 75 Z",
  },
  kyrgyzstan: {
    area_km2: 199_951,
    russia_ratio: 85,
    comparison_ru:
      "Площадь Кыргызстана — 199 951 км². Это как Московская, Тверская, Смоленская и Ярославская области вместе — в 85 раз меньше России.",
    comparison_en:
      "Kyrgyzstan's area is 199,951 km² — 85× smaller than Russia, slightly larger than Nebraska.",
    svg_path:
      "M 20 70 L 80 50 L 150 55 L 178 75 L 175 100 L 155 118 L 120 125 L 75 120 L 35 105 L 18 85 Z",
  },
  israel: {
    area_km2: 20_770,
    russia_ratio: 823,
    comparison_ru:
      "Площадь Израиля — 20 770 км². Это как Калининградская и Псковская области — в 823 раза меньше России.",
    comparison_en:
      "Israel's area is 20,770 km² — 823× smaller than Russia, about the size of New Jersey.",
    svg_path:
      "M 75 25 L 105 22 L 125 50 L 130 90 L 120 130 L 100 160 L 82 165 L 68 145 L 62 110 L 60 70 L 65 40 Z",
  },
  germany: {
    area_km2: 357_114,
    russia_ratio: 48,
    comparison_ru:
      "Площадь Германии — 357 114 км². Это как 2 Краснодарских края и Московская область — в 48 раз меньше России.",
    comparison_en:
      "Germany's area is 357,114 km² — 48× smaller than Russia, comparable to Montana.",
    svg_path:
      "M 65 20 L 115 18 L 145 35 L 155 65 L 145 100 L 130 130 L 110 148 L 85 150 L 60 135 L 45 105 L 42 70 L 50 40 Z",
  },
  spain: {
    area_km2: 505_990,
    russia_ratio: 34,
    comparison_ru:
      "Площадь Испании — 505 990 км². Это как 3 Краснодарских края — в 34 раза меньше России.",
    comparison_en:
      "Spain's area is 505,990 km² — 34× smaller than Russia, comparable to California plus Nevada.",
    svg_path:
      "M 15 50 L 90 35 L 165 45 L 185 80 L 180 115 L 155 135 L 110 145 L 65 140 L 25 120 L 10 85 Z",
  },
  bulgaria: {
    area_km2: 110_879,
    russia_ratio: 154,
    comparison_ru:
      "Площадь Болгарии — 110 879 км². Это как Краснодарский и Ростовский края вместе — в 154 раза меньше России.",
    comparison_en:
      "Bulgaria's area is 110,879 km² — 154× smaller than Russia, about the size of Ohio.",
    svg_path:
      "M 25 55 L 100 45 L 160 52 L 178 80 L 170 110 L 145 125 L 100 130 L 60 125 L 28 105 L 20 75 Z",
  },
  greece: {
    area_km2: 131_957,
    russia_ratio: 130,
    comparison_ru:
      "Площадь Греции — 131 957 км². Это как Краснодарский край и Ставрополье и Ростов вместе — в 130 раз меньше России.",
    comparison_en:
      "Greece's area is 131,957 km² — 130× smaller than Russia, about the size of Alabama.",
    svg_path:
      "M 60 25 L 115 22 L 150 45 L 160 80 L 150 115 L 130 140 L 100 155 L 75 148 L 55 120 L 45 85 L 48 50 Z",
  },
  croatia: {
    area_km2: 56_594,
    russia_ratio: 302,
    comparison_ru:
      "Площадь Хорватии — 56 594 км². Это как Московская область с Тульской и Рязанской — в 302 раза меньше России.",
    comparison_en:
      "Croatia's area is 56,594 km² — 302× smaller than Russia, about the size of West Virginia.",
    svg_path:
      "M 20 55 L 80 40 L 140 48 L 165 70 L 160 100 L 140 120 L 110 130 L 75 125 L 40 110 L 18 80 Z",
  },
  vietnam: {
    area_km2: 331_212,
    russia_ratio: 52,
    comparison_ru:
      "Площадь Вьетнама — 331 212 км². Это как 2 Краснодарских края и Ростовская область — в 52 раза меньше России.",
    comparison_en:
      "Vietnam's area is 331,212 km² — 52× smaller than Russia, comparable to Germany.",
    svg_path:
      "M 80 15 L 115 18 L 145 35 L 155 70 L 150 110 L 140 145 L 120 168 L 95 175 L 75 165 L 62 140 L 55 105 L 58 65 L 65 35 Z",
  },
  india: {
    area_km2: 3_287_263,
    russia_ratio: 5,
    comparison_ru:
      "Площадь Индии — 3 287 263 км². Это 1/5 России. При этом население почти в 10 раз больше — 1,4 млрд человек.",
    comparison_en:
      "India's area is 3,287,263 km² — 1/5 the size of Russia, yet houses 10× more people.",
    svg_path:
      "M 65 15 L 125 18 L 170 50 L 180 95 L 175 140 L 155 175 L 120 185 L 90 183 L 65 165 L 45 130 L 35 85 L 42 45 Z",
  },
  belarus: {
    area_km2: 207_600,
    russia_ratio: 82,
    comparison_ru:
      "Площадь Беларуси — 207 600 км². Это как 3 Краснодарских края — в 82 раза меньше России.",
    comparison_en:
      "Belarus's area is 207,600 km² — 82× smaller than Russia, slightly larger than Michigan.",
    svg_path:
      "M 35 35 L 120 30 L 165 55 L 168 95 L 155 130 L 120 145 L 75 140 L 35 120 L 20 80 L 25 50 Z",
  },
  uzbekistan: {
    area_km2: 448_978,
    russia_ratio: 38,
    comparison_ru:
      "Площадь Узбекистана — 448 978 км². Это как 3 Краснодарских края и Ростовская область — в 38 раз меньше России.",
    comparison_en:
      "Uzbekistan's area is 448,978 km² — 38× smaller than Russia, comparable to California.",
    svg_path:
      "M 15 60 L 85 45 L 160 50 L 185 80 L 180 115 L 155 135 L 110 140 L 60 130 L 20 105 L 10 78 Z",
  },
};

// Россия как референс для визуального наложения
export const RUSSIA_SVG_PATH =
  "M 5 45 L 60 20 L 130 15 L 180 25 L 195 45 L 195 80 L 185 110 L 165 130 L 140 140 L 110 145 L 80 150 L 55 148 L 30 140 L 10 120 L 5 90 Z";

export const RUSSIA_AREA_KM2 = 17_098_246;
