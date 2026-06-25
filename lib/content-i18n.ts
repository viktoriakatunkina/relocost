import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Locale } from "@/i18n/routing";
import { defaultLocale } from "@/i18n/routing";
import type { City } from "./types";
import type { CityContent } from "./cities-content";
import type { CountryContent } from "./countries-content";
import type { BlogPost } from "./blog";

// ───────────────────────────────────────────────────────────────────────────
// Фаза 3 локализации: перевод КОНТЕНТА (тексты из БД + контентные TS-файлы).
//
// Хранилище переводов — JSON-файлы в репозитории:
//   content/i18n/{locale}/cities/{slug}.json
//   content/i18n/{locale}/countries/{slug}.json
//   content/i18n/{locale}/blog/{slug}.json
//
// Почему файлы, а не таблицы Supabase:
//   • НЕТ автономного DDL-доступа к БД (новые колонки/таблицы под переводы
//     применить нельзя) — а файлы не требуют миграций вообще;
//   • переводы версионируются в git вместе с кодом и ревьюятся в PR;
//   • контент уже частично живёт в репо (lib/cities-content.ts,
//     lib/countries-content.ts) — переводы логично держать рядом, тем же путём;
//   • грузятся статически на этапе build (SSG/generateStaticParams) — никаких
//     лишних обращений к БД и API на каждый запрос.
//
// Принцип фолбэка: для ru ничего не подменяем (русский — источник правды).
// Для en/uz берём перевод, если файл есть И поле в нём заполнено; иначе —
// русский оригинал. Перевод может быть частичным (deep-merge по полям).
// ───────────────────────────────────────────────────────────────────────────

// Структуры переводов повторяют формы исходных сущностей, но все поля
// опциональны — переводить можно частично, незаполненное падает в ru-фолбэк.

/** Переводимые поля города (DB-поля + контент из cities-content.ts). */
export type CityTranslation = {
  // Поля из таблицы cities (Supabase).
  seo_title?: string;
  seo_description?: string;
  intro_text?: string;
  climate?: string;
  language?: string;
  currency?: string;
  population?: string;
  flight_from_moscow?: string;
  // Поля из CITY_CONTENT (lib/cities-content.ts). Массивы переводятся целиком
  // и подменяют русский только при совпадении длины (иначе ru-фолбэк — чтобы
  // расхождение источника и перевода не «съело» элементы).
  pros?: string[];
  cons?: string[];
  best_places?: Array<{ name?: string; description?: string }>;
  visa_steps?: Array<{ title?: string; description?: string }>;
  faq?: Array<{ question?: string; answer?: string }>;
  reviews?: Array<{ profession?: string; text?: string }>;
};

/** Переводимые поля страны (всё из COUNTRY_CONTENT). */
export type CountryTranslation = {
  intro?: string;
  climate?: string;
  mentality?: string;
  language_note?: string;
  visa_note?: string;
};

/** Переводимые поля статьи блога (поля из таблицы blog_posts). */
export type BlogTranslation = {
  title?: string;
  seo_title?: string;
  seo_description?: string;
  content_md?: string;
};

// Корень хранилища переводов. Читаем файлы с диска через fs (страницы — это
// серверные компоненты / SSG, fs доступен на этапе сборки). fs выбран вместо
// dynamic import(), чтобы webpack не собирал context-модуль из всех JSON и не
// раздувал бандл по мере роста числа переводов (99 городов + 46 стран + 72
// статьи × 2 локали).
const I18N_ROOT = join(process.cwd(), "content", "i18n");

// Кэш в пределах процесса сборки: один и тот же файл читается под город (DB-
// поля + контент) и под metadata — не дёргаем диск трижды.
const fileCache = new Map<string, unknown>();

async function loadJson<T>(
  locale: Locale,
  kind: "cities" | "countries" | "blog",
  slug: string,
): Promise<T | null> {
  if (locale === defaultLocale) return null; // ru: подмена не нужна.
  const key = `${locale}/${kind}/${slug}`;
  if (fileCache.has(key)) return fileCache.get(key) as T | null;
  try {
    const raw = await readFile(join(I18N_ROOT, locale, kind, `${slug}.json`), "utf8");
    const parsed = JSON.parse(raw) as T;
    fileCache.set(key, parsed);
    return parsed;
  } catch {
    fileCache.set(key, null); // файла нет — тихий фолбэк на русский.
    return null;
  }
}

// Выбор строки: перевод, если непустой; иначе русский оригинал.
function pick(translated: string | undefined, ru: string): string;
function pick(
  translated: string | undefined,
  ru: string | null,
): string | null;
function pick(
  translated: string | undefined,
  ru: string | null,
): string | null {
  if (typeof translated === "string" && translated.trim()) return translated;
  return ru;
}

// Перевод массива объектов по позициям с пер-польным фолбэком. Подменяем
// только если длина перевода совпадает с оригиналом — иначе весь массив ru.
function mergeArray<T>(
  ru: T[],
  tr: Array<Partial<Record<keyof T, unknown>>> | undefined,
  fields: ReadonlyArray<keyof T>,
): T[] {
  if (!tr || tr.length !== ru.length) return ru;
  return ru.map((orig, i) => {
    const t = tr[i] ?? {};
    const out = { ...orig };
    for (const f of fields) {
      const v = t[f];
      if (typeof v === "string" && v.trim()) {
        out[f] = v as T[keyof T];
      }
    }
    return out;
  });
}

// ── Города ─────────────────────────────────────────────────────────────────

/**
 * Локализует DB-поля города. Для ru возвращает исходный объект без изменений.
 * Для en/uz подменяет переводимые текстовые поля при наличии перевода.
 * name_en/country_en НЕ трогаем — их отдаёт lib/i18n-content.ts.
 */
export async function localizeCity(city: City, locale: Locale): Promise<City> {
  const tr = await loadJson<CityTranslation>(locale, "cities", city.slug);
  if (!tr) return city;
  return {
    ...city,
    seo_title: pick(tr.seo_title, city.seo_title),
    seo_description: pick(tr.seo_description, city.seo_description),
    intro_text: pick(tr.intro_text, city.intro_text),
    climate: pick(tr.climate, city.climate),
    language: pick(tr.language, city.language),
    currency: pick(tr.currency, city.currency),
    population: pick(tr.population, city.population),
    flight_from_moscow: pick(tr.flight_from_moscow, city.flight_from_moscow),
  };
}

/**
 * Локализует контент города (CITY_CONTENT). content может быть undefined —
 * тогда вернётся undefined (страница это уже умеет обрабатывать).
 */
export async function localizeCityContent(
  content: CityContent | undefined,
  slug: string,
  locale: Locale,
): Promise<CityContent | undefined> {
  if (!content) return content;
  const tr = await loadJson<CityTranslation>(locale, "cities", slug);
  if (!tr) return content;
  return {
    ...content,
    pros:
      tr.pros && tr.pros.length === content.pros.length ? tr.pros : content.pros,
    cons:
      tr.cons && tr.cons.length === content.cons.length ? tr.cons : content.cons,
    best_places: mergeArray(content.best_places, tr.best_places, [
      "name",
      "description",
    ]),
    visa_steps: mergeArray(content.visa_steps, tr.visa_steps, [
      "title",
      "description",
    ]),
    faq: mergeArray(content.faq, tr.faq, ["question", "answer"]),
    reviews: mergeArray(content.reviews, tr.reviews, ["profession", "text"]),
  };
}

// Лёгкий вариант для metadata: переводим только seo_title/description, не
// загружая весь объект города (generateMetadata дёргает их отдельным запросом).
export async function localizeCitySeo(
  seo: { seo_title: string | null; seo_description: string | null },
  slug: string,
  locale: Locale,
): Promise<{ seo_title: string | null; seo_description: string | null }> {
  const tr = await loadJson<CityTranslation>(locale, "cities", slug);
  if (!tr) return seo;
  return {
    seo_title: pick(tr.seo_title, seo.seo_title),
    seo_description: pick(tr.seo_description, seo.seo_description),
  };
}

// ── Страны ─────────────────────────────────────────────────────────────────

export async function localizeCountryContent(
  content: CountryContent | null,
  slug: string,
  locale: Locale,
): Promise<CountryContent | null> {
  if (!content) return content;
  const tr = await loadJson<CountryTranslation>(locale, "countries", slug);
  if (!tr) return content;
  return {
    ...content,
    intro: pick(tr.intro, content.intro),
    climate: pick(tr.climate, content.climate),
    mentality: pick(tr.mentality, content.mentality),
    language_note: pick(tr.language_note, content.language_note),
    visa_note: pick(tr.visa_note, content.visa_note),
  };
}

// ── Блог ───────────────────────────────────────────────────────────────────

export async function localizeBlogPost(
  post: BlogPost,
  locale: Locale,
): Promise<BlogPost> {
  const tr = await loadJson<BlogTranslation>(locale, "blog", post.slug);
  if (!tr) return post;
  return {
    ...post,
    title: pick(tr.title, post.title),
    seo_title: pick(tr.seo_title, post.seo_title),
    seo_description: pick(tr.seo_description, post.seo_description),
    content_md: pick(tr.content_md, post.content_md),
  };
}
