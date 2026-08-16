import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { typo } from "@/lib/typography";
import { type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";

export function generateStaticParams() {
  return [{ locale: "ru" }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return {
    title: "Политика конфиденциальности — Relocost",
    description:
      "Политика конфиденциальности сайта relocost.ru: какие персональные данные собираются, как используются и как Вы можете ими управлять.",
    alternates: buildAlternates("/privacy", params.locale),
    openGraph: {
      title: "Политика конфиденциальности — Relocost",
      description:
        "Порядок обработки персональных данных на сайте relocost.ru.",
      type: "website",
    },
  };
}

/* ─── вспомогательные компоненты ─────────────────────────────── */

function SectionNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center w-7 h-7 rounded-full
                 bg-copper/15 text-copper text-xs font-bold shrink-0 mt-0.5"
    >
      {n}
    </span>
  );
}

function SectionTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <SectionNumber n={n} />
      <h2 className="font-serif text-xl text-cream leading-snug">{children}</h2>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-cream/20 bg-cream/5 px-4 py-3 text-sm text-brandy/85 leading-relaxed">
      {children}
    </div>
  );
}

/* ─── страница ───────────────────────────────────────────────── */

export default async function PrivacyPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[{ name: tc("home"), href: "/" }, { name: "Политика конфиденциальности" }]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <p className="eyebrow mb-5">Документы</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream leading-[1.05] mb-4">
          Политика конфиденциальности
        </h1>
        <p className="text-brandy/60 text-sm">
          Редакция от 5 августа 2026 г. Применяется к сайту relocost.ru.
        </p>
      </section>

      {/* ── Содержание ───────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 space-y-6">

        {/* 1. Оператор */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={1}>Кто обрабатывает Ваши данные</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "Оператором персональных данных на сайте relocost.ru является самозанятый Катункина Виктория Витальевна (ИНН 260503461107), далее — «Оператор».",
              )}
            </p>
            <p>
              {typo(
                "Настоящая Политика принята в соответствии с требованиями Федерального закона № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных пользователей сайта.",
              )}
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-xs">
              {[
                { label: "Оператор", value: "Катункина Виктория Витальевна" },
                { label: "ИНН", value: "260503461107" },
                { label: "Email оператора", value: "viktoriakatunkina7k@gmail.com" },
                { label: "Сайт", value: "relocost.ru" },
              ].map((r) => (
                <div key={r.label}>
                  <dt className="text-brandy/45 uppercase tracking-widest text-[9px]">{r.label}</dt>
                  <dd className="text-cream">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 2. Какие данные собираются */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={2}>Какие персональные данные собираются</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "При использовании платных функций сайта Оператор собирает следующие персональные данные:",
              )}
            </p>
            <ul className="space-y-2">
              {[
                {
                  name: "Адрес электронной почты (email)",
                  desc: "Указывается Вами при оплате. Используется для идентификации заказчика и предоставления доступа к оплаченным разделам.",
                },
              ].map((item) => (
                <li key={item.name} className="flex gap-3">
                  <span className="text-copper mt-1 shrink-0">•</span>
                  <div>
                    <strong className="text-cream">{item.name}</strong>
                    {" — "}
                    {typo(item.desc)}
                  </div>
                </li>
              ))}
            </ul>
            <Callout>
              {typo(
                "Сайт не собирает имена, телефоны, адреса, платежные реквизиты или иные чувствительные данные. Платежная информация (данные карты) обрабатывается исключительно сервисом ЮKassa и Оператору не передается.",
              )}
            </Callout>
          </div>
        </div>

        {/* 3. Цели и основания */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={3}>Цели и правовые основания обработки</SectionTitle>
          <div className="ml-10 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--hairline)]">
                    <th className="text-left py-2 pr-4 text-brandy/50 text-xs font-normal uppercase tracking-widest">
                      Цель
                    </th>
                    <th className="text-left py-2 text-brandy/50 text-xs font-normal uppercase tracking-widest">
                      Основание (ФЗ-152)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-brandy/85">
                  {[
                    {
                      goal: "Исполнение договора: предоставление доступа к оплаченным разделам",
                      basis: "п. 5 ч. 1 ст. 6 — исполнение договора с субъектом",
                    },
                    {
                      goal: "Направление чека и подтверждения оплаты на email",
                      basis: "п. 5 ч. 1 ст. 6 — исполнение договора",
                    },
                    {
                      goal: "Восстановление доступа по обращению пользователя",
                      basis: "п. 5 ч. 1 ст. 6 — исполнение договора",
                    },
                    {
                      goal: "Аналитика посещаемости (Яндекс.Метрика, cookie)",
                      basis: "п. 1 ч. 1 ст. 6 — согласие (информирование на сайте)",
                    },
                  ].map((row) => (
                    <tr key={row.goal} className="border-b border-[var(--hairline)]">
                      <td className="py-2.5 pr-4 leading-snug align-top">{typo(row.goal)}</td>
                      <td className="py-2.5 text-brandy/60 leading-snug align-top text-xs">{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Передача третьим лицам */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={4}>Передача данных третьим лицам</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "Email-адрес пользователя передается следующим третьим лицам:",
              )}
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-copper mt-1 shrink-0">•</span>
                <div>
                  <strong className="text-cream">ООО «НКО ЮMoney» (ЮKassa)</strong>{" "}
                  {typo("— платежный сервис. Email передается для направления кассового чека в соответствии с требованиями Федерального закона № 54-ФЗ «О применении контрольно-кассовой техники».")}
                </div>
              </li>
            </ul>
            <p>
              {typo(
                "Иным третьим лицам персональные данные не передаются, не продаются и не используются в рекламных целях.",
              )}
            </p>
          </div>
        </div>

        {/* 5. Срок хранения */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={5}>Сроки хранения данных</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "Email-адрес хранится в базе данных сайта в течение срока, необходимого для исполнения договора и урегулирования возможных претензий. По истечении общего срока исковой давности (3 года с момента последней оплаты) данные удаляются или обезличиваются, если иное не требуется по закону.",
              )}
            </p>
            <p>
              {typo(
                "Кассовые чеки и данные о платежах хранятся в соответствии с требованиями налогового законодательства (5 лет).",
              )}
            </p>
          </div>
        </div>

        {/* 6. Cookie */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={6}>Файлы cookie и Яндекс.Метрика</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "Сайт использует Яндекс.Метрику — сервис веб-аналитики АО «Яндекс». Яндекс.Метрика устанавливает файлы cookie в Вашем браузере для сбора обезличенной статистики посещаемости (страницы, источники трафика, время на сайте). Личные данные в analytics-cookie не содержатся.",
              )}
            </p>
            <p>
              {typo(
                "Вы можете отключить cookie в настройках браузера или использовать расширения для блокировки трекеров. Это не ограничит доступ к бесплатным разделам сайта.",
              )}
            </p>
            <Callout>
              {typo(
                "Данные Яндекс.Метрики обрабатываются АО «Яндекс» в соответствии с Политикой конфиденциальности Яндекса. Оператор сайта relocost.ru имеет доступ только к агрегированной статистике (без идентификации конкретных пользователей).",
              )}
            </Callout>
          </div>
        </div>

        {/* 7. Права пользователя */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={7}>Ваши права как субъекта персональных данных</SectionTitle>
          <div className="ml-10">
            <p className="text-brandy/85 text-sm leading-relaxed mb-4">
              {typo(
                "В соответствии со статьями 14–17 Федерального закона № 152-ФЗ Вы вправе:",
              )}
            </p>
            <ul className="space-y-2.5">
              {[
                "Получить информацию о том, какие Ваши данные обрабатываются",
                "Потребовать уточнения, блокирования или уничтожения данных",
                "Отозвать согласие на обработку данных (при условии, что обработка основана на согласии)",
                "Обжаловать действия Оператора в Роскомнадзор (rkn.gov.ru)",
              ].map((right, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-brandy/85">
                  <span className="text-copper mt-1 shrink-0 text-lg leading-none">→</span>
                  <span className="leading-relaxed">{typo(right)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t hairline">
              <p className="text-brandy/75 text-sm leading-relaxed">
                {typo(
                  "Для реализации прав направьте запрос на email Оператора: ",
                )}
                <a
                  href="mailto:viktoriakatunkina7k@gmail.com"
                  className="text-copper hover:underline"
                >
                  viktoriakatunkina7k@gmail.com
                </a>
                {typo(". Оператор рассмотрит запрос в течение 10 рабочих дней.")}
              </p>
            </div>
          </div>
        </div>

        {/* 8. Меры защиты */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={8}>Меры защиты данных</SectionTitle>
          <p className="ml-10 text-brandy/85 text-sm leading-relaxed">
            {typo(
              "Сайт работает по протоколу HTTPS. Данные хранятся в защищенной облачной базе данных (Supabase) с разграничением прав доступа. Оператор принимает организационные и технические меры для защиты персональных данных от несанкционированного доступа, утраты и разглашения.",
            )}
          </p>
        </div>

        {/* 9. Изменения */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={9}>Изменения политики</SectionTitle>
          <p className="ml-10 text-brandy/85 text-sm leading-relaxed">
            {typo(
              "Оператор вправе обновлять настоящую Политику. Новая редакция публикуется на этой странице с указанием даты. Продолжение использования сайта после публикации означает Ваше согласие с обновленной Политикой.",
            )}
          </p>
        </div>

        {/* Ссылки на связанные документы */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/offer"
            className="inline-flex items-center gap-2 rounded-xl border hairline
                       px-4 py-2.5 text-sm text-brandy/80 hover:text-cream hover:border-copper/40 transition"
          >
            Публичная оферта →
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-2 rounded-xl border hairline
                       px-4 py-2.5 text-sm text-brandy/80 hover:text-cream hover:border-copper/40 transition"
          >
            Контакты →
          </Link>
        </div>

        <p className="text-brandy/45 text-xs">
          Редакция от 5 августа 2026 г.
        </p>
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
