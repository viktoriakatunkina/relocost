// Визовый режим для граждан РФ (туристический въезд).
//
// ВАЖНО: данные предварительные, по состоянию на 2026 год, и требуют сверки
// перед публикацией — визовые правила меняются. Маппинг по country_slug
// (как в cities.country_slug), легко редактируется вручную.
//
//   "visa_free"     — въезд без заранее оформленной визы: безвиз, виза по
//                     прилёту (visa-on-arrival) или штамп на границе.
//   "visa_required" — визу нужно оформлять заранее (включая Шенген, e-visa,
//                     которую получают до поездки).
//
// Принцип консервативности: если по стране нет уверенности — ставим
// "visa_required". Такие страны перечислены в комментарии VISA_NEEDS_REVIEW.

export type VisaStatus = "visa_free" | "visa_required";

export const VISA_BY_COUNTRY: Record<string, VisaStatus> = {
  // --- Без визы / виза по прилёту / штамп на границе ---
  armenia: "visa_free", // безвиз
  azerbaijan: "visa_free", // e-visa оформляется, но фактически по прилёту/онлайн быстро; СНГ-режим — без визы для турпоездок
  belarus: "visa_free", // союзное государство
  georgia: "visa_free", // безвиз до 1 года
  kazakhstan: "visa_free", // безвиз
  kyrgyzstan: "visa_free", // безвиз
  moldova: "visa_free", // безвиз
  russia: "visa_free", // внутренние переезды — виза не нужна
  serbia: "visa_free", // безвиз до 30 дней
  tajikistan: "visa_free", // безвиз
  uzbekistan: "visa_free", // безвиз
  turkey: "visa_free", // безвиз до 60 дней
  thailand: "visa_free", // безвиз до 60 дней
  uae: "visa_free", // безвиз до 90 дней
  indonesia: "visa_free", // виза по прилёту (VOA), Бали
  montenegro: "visa_free", // безвиз до 30 дней
  qatar: "visa_free", // безвиз
  bahrain: "visa_free", // виза по прилёту / e-visa по прилёту
  oman: "visa_free", // безвиз до 14 дней
  maldives: "visa_free", // виза по прилёту (на всякий — нет в БД)
  sri_lanka: "visa_free", // ETA по прилёту / онлайн — фактически без заранее оформленной визы
  "sri-lanka": "visa_free",
  malaysia: "visa_free", // безвиз до 30 дней
  philippines: "visa_free", // безвиз до 30 дней
  morocco: "visa_free", // безвиз до 90 дней
  tunisia: "visa_free", // безвиз до 90 дней
  cambodia: "visa_free", // виза по прилёту / e-visa
  nepal: "visa_free", // виза по прилёту
  jordan: "visa_free", // виза по прилёту
  argentina: "visa_free", // безвиз до 90 дней
  brazil: "visa_free", // безвиз до 90 дней
  mexico: "visa_free", // безвиз до 180 дней
  "south-korea": "visa_free", // безвиз до 60 дней (требуется K-ETA онлайн, но не консульская виза)
  "north-macedonia": "visa_free", // безвиз до 90 дней
  albania: "visa_free", // безвиз (сезонно/круглогодично)
  // Переведены в «Без визы» по решению Виктории (2026-06-17): виза по прилёту /
  // e-visa / нюансы режима описываются текстом внутри страниц страны и города.
  egypt: "visa_free", // виза по прилёту
  israel: "visa_free", // безвиз до 90 дней
  china: "visa_free", // нюансы (групповой безвиз / послабления) — внутри страницы
  vietnam: "visa_free", // e-visa оформляется онлайн; нюансы — внутри страницы

  // --- Нужна виза заранее (Шенген/ЕС/e-visa заранее/консульская) ---
  bulgaria: "visa_required", // ЕС / Шенген
  croatia: "visa_required", // Шенген
  cyprus: "visa_required", // pro-visa / национальная виза заранее
  "czech-republic": "visa_required", // Шенген
  greece: "visa_required", // Шенген
  hungary: "visa_required", // Шенген
  portugal: "visa_required", // Шенген
  spain: "visa_required", // Шенген
  india: "visa_required", // e-visa оформляется заранее
};

// Спорные страны переведены в «Без визы» по решению Виктории (2026-06-17);
// визовые нюансы (сроки, e-visa, виза по прилёту) описываются текстом внутри
// страниц страны и города, а не на плашке.
export const VISA_NEEDS_REVIEW: string[] = [];

export type VisaInfo = {
  status: VisaStatus;
  label: "Без визы" | "Нужна виза";
};

// Возвращает визовый статус по стране города. Ключ — country_slug.
// Неизвестная страна → консервативно "visa_required".
export function getVisa(
  city: { country_slug: string | null } | null | undefined
): VisaInfo {
  const slug = city?.country_slug ?? "";
  const status: VisaStatus = VISA_BY_COUNTRY[slug] ?? "visa_required";
  return {
    status,
    label: status === "visa_free" ? "Без визы" : "Нужна виза",
  };
}
