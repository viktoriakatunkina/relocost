import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "О проекте Relocost — как мы считаем стоимость жизни",
  description:
    "Кто делает Relocost, откуда берем цены по городам, как часто обновляем данные и почему цифрам можно доверять. Методология и источники.",
  alternates: { canonical: "/about" },
};

export const revalidate = 86400;

const SOURCES = [
  { name: "Numbeo", what: "крупнейшая база цен от пользователей по городам мира" },
  { name: "Expatistan", what: "сравнение стоимости жизни для экспатов" },
  { name: "ЦБ РФ", what: "официальный курс валют для пересчета в рубли" },
  { name: "Локальные источники", what: "объявления аренды, тарифы операторов и транспорта в каждом городе" },
];

const PRINCIPLES = [
  {
    t: "Реальные цены, а не реклама",
    d: "Мы показываем типичный диапазон «от и до», а не самую низкую цифру для красивого заголовка. Цель — чтобы Вы спланировали бюджет без сюрпризов после переезда.",
  },
  {
    t: "Регулярное обновление",
    d: "Базовые категории (аренда, продукты, транспорт, ЖКХ) пересматриваем ежеквартально и при заметных изменениях курса валют. Год актуальности всегда указан в материале.",
  },
  {
    t: "Честность о волатильном",
    d: "Визы, налоги и банковские правила меняются быстро. В таких статьях мы прямо помечаем дату и просим проверять актуальные условия в первоисточниках перед решениями.",
  },
];

export default function AboutPage() {
  return (
    <main className="pb-24">
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: "О проекте" },
        ]}
      />

      <section className="max-w-3xl mx-auto px-6 pt-12">
        <span className="eyebrow">О проекте</span>
        <h1 className="font-serif text-4xl md:text-6xl text-cream mt-6 leading-[1.05]">
          Помогаем переехать с открытыми глазами
        </h1>
        <p className="text-brandy/90 text-lg md:text-xl mt-6 leading-relaxed text-pretty">
          Relocost — это калькулятор стоимости жизни и журнал для тех, кто планирует переезд
          внутри России или за рубеж. Мы собираем реальные цены по городам, считаем честный
          месячный бюджет и объясняем визы, банки и быт простым языком.
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          {PRINCIPLES.map((p) => (
            <div key={p.t} className="p-5 rounded-2xl border hairline bg-surface">
              <h2 className="text-cream font-serif text-xl mb-2">{p.t}</h2>
              <p className="text-brandy/80 text-sm leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-3xl text-cream mt-16 mb-4">Откуда мы берем цифры</h2>
        <p className="text-brandy/85 leading-relaxed mb-6">
          Цены — это агрегированные оценки на основе нескольких открытых источников, приведенные
          к рублям. Мы не выдумываем числа и не берем их «с потолка»:
        </p>
        <ul className="space-y-3 mb-8">
          {SOURCES.map((s) => (
            <li key={s.name} className="flex gap-3 text-brandy/85">
              <span className="text-copper font-semibold shrink-0">{s.name}</span>
              <span className="text-brandy/70">— {s.what}</span>
            </li>
          ))}
        </ul>
        <p className="text-brandy/70 text-sm leading-relaxed mb-12">
          Важно: наши цифры — это ориентир для планирования, а не оферта. Реальные расходы зависят
          от района, образа жизни и момента въезда. Перед решениями по визам, налогам и банкам
          всегда проверяйте актуальные правила в официальных источниках.
        </p>

        <div className="p-6 rounded-2xl border hairline bg-surface">
          <h2 className="font-serif text-2xl text-cream mb-2">Кто делает Relocost</h2>
          <p className="text-brandy/80 leading-relaxed mb-4">
            Проект ведет небольшая редакция, которая сама проходила через переезд и знает, какие
            вопросы возникают на практике. По всем вопросам и предложениям — пишите нам.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-copper text-pine-tree font-semibold text-sm transition hover:bg-brandy"
            >
              Открыть калькулятор
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill border hairline text-cream/90 text-sm transition hover:border-copper"
            >
              Контакты и реквизиты
            </Link>
          </div>
        </div>
      </section>

      <div className="pt-12">
        <Footer />
      </div>
    </main>
  );
}
