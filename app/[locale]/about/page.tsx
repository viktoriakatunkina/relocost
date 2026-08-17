import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";
import { getSiteStats } from "@/lib/site-stats";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  return {
    title: "О проекте Relocost — как мы считаем стоимость жизни",
    description:
      "О проекте Relocost: калькулятор стоимости жизни для планирующих переезд. Откуда берем цены, как часто обновляем данные и почему цифрам можно доверять.",
    alternates: buildAlternates("/about", params.locale),
  };
}

export const revalidate = 86400;

const SOURCES = [
  {
    name: "Numbeo",
    what: "крупнейшая база пользовательских цен по городам мира",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    name: "Expatistan",
    what: "сравнение стоимости жизни для экспатов",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "ЦБ РФ",
    what: "официальный курс валют для пересчета в рубли",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    name: "Локальные источники",
    what: "объявления аренды, тарифы операторов и транспорта в каждом городе",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const PRINCIPLES = [
  {
    t: "Реальные цены, а не реклама",
    d: "Мы показываем типичный диапазон «от и до», а не самую низкую цифру для красивого заголовка. Цель — чтобы Вы спланировали бюджет без сюрпризов после переезда.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    t: "Регулярное обновление",
    d: "Базовые категории (аренда, продукты, транспорт, ЖКХ) пересматриваем ежеквартально и при заметных изменениях курса валют. Год актуальности всегда указан в материале.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
  {
    t: "Честность о волатильном",
    d: "Визы, налоги и банковские правила меняются быстро. В таких статьях мы прямо помечаем дату и просим проверять актуальные условия в первоисточниках перед решениями.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const PRINCIPLE_ACCENTS = [
  { color: "#3FB984", bg: "rgba(63,185,132,0.14)", ring: "rgba(63,185,132,0.35)" },
  { color: "#E0A93E", bg: "rgba(224,169,62,0.14)", ring: "rgba(224,169,62,0.35)" },
  { color: "#E0947A", bg: "rgba(224,148,122,0.14)", ring: "rgba(224,148,122,0.35)" },
] as const;

const PRINCIPLES_WITH_COLORS = PRINCIPLES.map((p, i) => ({
  ...p,
  ...PRINCIPLE_ACCENTS[i % PRINCIPLE_ACCENTS.length],
}));

const FEATURES = [
  {
    title: "Калькулятор",
    description: "Введите образ жизни — получите реальную оценку бюджета на месяц. Аренда, еда, транспорт, развлечения — всё в одном числе.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="8.01" y2="10" strokeWidth="2.5" />
        <line x1="12" y1="10" x2="12.01" y2="10" strokeWidth="2.5" />
        <line x1="16" y1="10" x2="16.01" y2="10" strokeWidth="2.5" />
        <line x1="8" y1="14" x2="8.01" y2="14" strokeWidth="2.5" />
        <line x1="12" y1="14" x2="12.01" y2="14" strokeWidth="2.5" />
        <line x1="16" y1="14" x2="16.01" y2="14" strokeWidth="2.5" />
        <line x1="8" y1="18" x2="12" y2="18" strokeWidth="2.5" />
        <line x1="16" y1="18" x2="16.01" y2="18" strokeWidth="2.5" />
      </svg>
    ),
    href: "/",
  },
  {
    title: "Журнал",
    description: "Практические статьи о переезде: как открыть счёт, получить ВНЖ, найти жилье и не заблудиться в бюрократии чужой страны.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    href: "/blog",
  },
  {
    title: "Подборки",
    description: "Сравнение городов по стоимости жизни, рейтинги по категориям и страновые обзоры — чтобы Вы могли выбирать осознанно.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2.5" />
        <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2.5" />
        <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2.5" />
      </svg>
    ),
    href: "/countries",
  },
];

// Иконки городов для коллажа в hero-секции (SVG-заглушки без внешних URL)
const HERO_TILES = [
  {
    label: "Тбилиси",
    flag: "🇬🇪",
    gradient: "from-emerald-900 to-kombu-green",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Дубай",
    flag: "🇦🇪",
    gradient: "from-amber-900 to-kombu-green",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="7" width="20" height="14" rx="1" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    label: "Бангкок",
    flag: "🇹🇭",
    gradient: "from-sky-900 to-kombu-green",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "Белград",
    flag: "🇷🇸",
    gradient: "from-rose-900 to-kombu-green",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default async function AboutPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");

  const stats = await getSiteStats().catch(() => ({
    cityCount: 120,
    countryCount: 30,
    foreignCountryCount: 25,
    blogCount: 130,
  }));

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[
          { name: tc("home"), href: "/" },
          { name: tf("about") },
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 20% 40%, rgba(196,134,109,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(106,120,77,0.22) 0%, transparent 55%)",
          }}
          aria-hidden
        />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Текст и статистика */}
            <div>
              <div className="fade-up">
                <span className="eyebrow">О проекте</span>
              </div>
              <h1
                className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-cream leading-[1.05] mt-6 mb-6 fade-up text-balance"
                style={{ animationDelay: "100ms", letterSpacing: "-0.02em" }}
              >
                Помогаем переехать{" "}
                <span className="text-copper italic">с открытыми глазами</span>
              </h1>
              <p
                className="text-brandy/90 text-lg md:text-xl leading-relaxed text-pretty fade-up mb-10"
                style={{ animationDelay: "200ms" }}
              >
                Relocost — калькулятор стоимости жизни и журнал для тех, кто планирует
                переезд внутри России или за рубеж. Собираем реальные цены по городам,
                считаем честный месячный бюджет и объясняем визы, банки и быт.
              </p>

              {/* Статистика — 4 карточки */}
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up"
                style={{ animationDelay: "300ms" }}
              >
                {[
                  { value: `${stats.cityCount}+`, label: "городов", emoji: "🏙" },
                  { value: `${stats.countryCount}+`, label: "стран", emoji: "🌍" },
                  { value: `${stats.blogCount}+`, label: "статей", emoji: "📖" },
                  { value: "7", label: "категорий цен", emoji: "📊" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border hairline bg-surface/70 px-4 py-5 text-center hover:border-copper/30 transition-colors">
                    <div className="text-xl mb-1" aria-hidden>{s.emoji}</div>
                    <span className="block font-serif text-3xl text-copper leading-none mb-1">
                      {s.value}
                    </span>
                    <span className="text-brandy/70 text-xs">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Коллаж городов (SVG-заглушки — без внешних URL) */}
            <div
              className="hidden md:grid grid-cols-2 gap-3 fade-up"
              style={{ animationDelay: "200ms" }}
              aria-hidden
            >
              {HERO_TILES.map((tile, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br ${tile.gradient} flex flex-col items-center justify-center gap-2`}
                  style={{ animationDelay: `${300 + i * 60}ms` }}
                >
                  <div className="text-3xl leading-none">{tile.flag}</div>
                  <div className="text-cream/60">{tile.icon}</div>
                  <span className="text-xs text-cream/50 font-medium tracking-wide">{tile.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-tree/40 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Что такое Relocost */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Reveal>
          <span className="eyebrow">🔧 Инструменты</span>
          <h2 className="font-serif text-3xl md:text-5xl text-cream mt-5 mb-4 text-balance">
            Что такое Relocost
          </h2>
          <p className="text-brandy/80 text-lg max-w-2xl mb-10 text-pretty">
            Три раздела сайта решают разные задачи переезда — от подбора города до практического быта.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <Link
                href={f.href as "/"}
                className="group block rounded-2xl border hairline bg-surface p-6 hover:border-copper/35 hover:bg-surface-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-copper/15 flex items-center justify-center text-copper mb-5 group-hover:bg-copper/22 group-hover:scale-105 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-serif text-xl text-cream mb-2">{f.title}</h3>
                <p className="text-brandy/75 text-sm leading-relaxed">{f.description}</p>
                <div className="mt-4 text-copper/70 text-xs flex items-center gap-1 group-hover:text-copper transition-colors">
                  Перейти
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Принципы */}
      <section className="bg-surface/40 border-y hairline py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <span className="eyebrow">✨ Принципы</span>
            <h2 className="font-serif text-3xl md:text-5xl text-cream mt-5 mb-4">
              Как мы работаем
            </h2>
            <p className="text-brandy/80 text-lg max-w-xl mb-10 text-pretty">
              Три правила, которые определяют каждую цифру на сайте.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {PRINCIPLES_WITH_COLORS.map((p, i) => (
              <Reveal key={p.t} delay={i * 80}>
                <div
                  className="rounded-2xl border bg-surface p-6 h-full transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: p.ring }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ color: p.color, backgroundColor: p.bg, boxShadow: `0 0 0 1px ${p.ring}` }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-serif text-xl text-cream mb-3 leading-snug">{p.t}</h3>
                  <p className="text-brandy/80 text-sm leading-relaxed">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Методология */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Reveal>
          <span className="eyebrow">📊 Методология</span>
          <h2 className="font-serif text-3xl md:text-5xl text-cream mt-5 mb-4">
            Откуда мы берем цифры
          </h2>
          <p className="text-brandy/80 text-lg max-w-2xl mb-10 text-pretty">
            Цены — агрегированные оценки на основе нескольких открытых источников, приведенные
            к рублям. Мы не выдумываем числа и не берем их «с потолка».
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {SOURCES.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <div className="group flex gap-4 items-start rounded-2xl border hairline bg-surface p-5 hover:border-copper/30 transition-all duration-300 hover:-translate-y-0.5">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-copper/12 flex items-center justify-center text-copper mt-0.5 group-hover:bg-copper/18 transition-colors">
                  {s.icon}
                </div>
                <div>
                  <p className="text-cream font-semibold mb-1 flex items-center gap-2">
                    <span className="inline-block w-5 h-5 rounded-full bg-copper/20 text-copper text-xs font-bold flex items-center justify-center" style={{ display: 'inline-flex' }}>{i + 1}</span>
                    {s.name}
                  </p>
                  <p className="text-brandy/70 text-sm leading-relaxed">{s.what}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="rounded-2xl border border-copper/25 bg-copper/5 px-6 py-5 flex gap-4 items-start">
            <span className="text-copper text-2xl shrink-0 mt-0.5" aria-hidden>⚠️</span>
            <p className="text-brandy/80 text-sm leading-relaxed">
              <span className="text-copper font-semibold">Важно:</span>{" "}
              наши цифры — это ориентир для планирования, а не оферта. Реальные расходы зависят
              от района, образа жизни и момента въезда. Перед решениями по визам, налогам и банкам
              всегда проверяйте актуальные правила в официальных источниках.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Полоса-баннер перед CTA (CSS-градиент, без внешних URL) */}
      <div className="max-w-5xl mx-auto px-6 mb-0">
        <Reveal>
          <div
            className="relative h-52 md:h-72 rounded-3xl overflow-hidden flex items-center px-8 md:px-12"
            style={{
              background:
                "linear-gradient(135deg, #202808 0%, #33432B 40%, #4a5e36 70%, #202808 100%)",
            }}
          >
            {/* Декоративный узор */}
            <svg
              className="absolute right-0 top-0 h-full opacity-10"
              viewBox="0 0 400 288"
              fill="none"
              aria-hidden
            >
              <circle cx="350" cy="50" r="120" stroke="#DEC59E" strokeWidth="1" />
              <circle cx="350" cy="50" r="80" stroke="#DEC59E" strokeWidth="0.7" />
              <circle cx="350" cy="50" r="40" stroke="#DEC59E" strokeWidth="0.5" />
              <circle cx="60" cy="240" r="100" stroke="#C4866D" strokeWidth="0.8" />
              <circle cx="200" cy="150" r="60" stroke="#6A784D" strokeWidth="0.6" />
            </svg>
            <p className="relative font-serif text-2xl md:text-4xl text-cream max-w-lg leading-snug text-balance">
              Переезд — это не страшно,{" "}
              <span className="text-copper italic">если знать цифры заранее</span>
            </p>
          </div>
        </Reveal>
      </div>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <Reveal>
          <h2 className="font-serif text-3xl md:text-5xl text-cream mb-4 text-balance">
            Готовы спланировать переезд?
          </h2>
          <p className="text-brandy/80 text-lg max-w-xl mx-auto mb-10 text-pretty">
            Откройте калькулятор стоимости жизни — введите бюджет, климат и
            приоритеты, получите персональную подборку городов за пару минут.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://relocost.ru/match"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-pill bg-copper text-pine-tree font-semibold transition hover:bg-brandy hover:text-pine-tree min-h-[44px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="12" y2="10" />
                <line x1="8" y1="14" x2="14" y2="14" />
              </svg>
              Открыть калькулятор
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
