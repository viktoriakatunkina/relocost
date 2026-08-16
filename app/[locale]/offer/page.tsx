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
    title: "Публичная оферта — Relocost",
    description:
      "Публичная оферта на оказание услуг по предоставлению доступа к платным информационным разделам отчетов о стоимости жизни на сайте relocost.ru.",
    alternates: buildAlternates("/offer", params.locale),
    openGraph: {
      title: "Публичная оферта — Relocost",
      description:
        "Условия предоставления доступа к платным информационным разделам сайта relocost.ru.",
      type: "website",
    },
  };
}

const PACKAGES: { name: string; title: string; price: string; note?: string }[] = [
  { name: "places", title: "Лучшие места для посещения", price: "19 ₽" },
  { name: "budget", title: "Полный список статей расходов", price: "49 ₽" },
  { name: "bundle", title: "Расходы + Лучшие места (комбо)", price: "59 ₽" },
  {
    name: "country_cities",
    title: "Рейтинг городов страны",
    price: "49 ₽",
    note: "для страниц стран",
  },
  {
    name: "country_overview",
    title: "Полный обзор страны",
    price: "29 ₽",
    note: "для страниц стран",
  },
];

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

function Callout({
  variant,
  children,
}: {
  variant: "info" | "warning";
  children: React.ReactNode;
}) {
  const styles =
    variant === "warning"
      ? "border-copper/50 bg-copper/5"
      : "border-cream/20 bg-cream/5";
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm text-brandy/85 leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

/* ─── страница ───────────────────────────────────────────────── */

export default async function OfferPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");

  return (
    <main className="pb-12 md:pb-24">
      <Breadcrumbs
        items={[{ name: tc("home"), href: "/" }, { name: tf("offer") }]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <p className="eyebrow mb-5">Документы</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream leading-[1.05] mb-4">
          Публичная оферта
        </h1>
        <p className="text-brandy/60 text-sm mb-6">
          Договор на оказание информационных услуг. Редакция от 5 августа 2026 г.
        </p>

        {/* Быстрые факты */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Стоимость", value: "от 19 до 59 ₽ за раздел" },
            { label: "Оплата", value: "ЮKassa, банковская карта" },
            { label: "Доступ", value: "сразу после оплаты" },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-xl bg-surface border hairline px-4 py-3"
            >
              <p className="text-brandy/55 text-[10px] uppercase tracking-widest mb-1">
                {f.label}
              </p>
              <p className="text-cream text-sm font-medium">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Тело оферты ──────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 space-y-8">

        {/* 1. Общие положения */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={1}>Общие положения</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "Настоящий документ является публичной офертой (далее — «Оферта») самозанятого Катункиной Виктории Витальевны (ИНН 260503461107), плательщика налога на профессиональный доход (далее — «Исполнитель»), и адресован любому физическому лицу (далее — «Заказчик»), выразившему намерение воспользоваться услугами Исполнителя.",
              )}
            </p>
            <p>
              {typo(
                "Оплата услуг Заказчиком означает полное и безоговорочное принятие условий настоящей Оферты (акцепт) в соответствии со статьями 437 и 438 Гражданского кодекса Российской Федерации. С момента оплаты Оферта считается заключенным договором.",
              )}
            </p>
            <p>
              {typo(
                "Настоящая Оферта регулируется законодательством Российской Федерации, в том числе Гражданским кодексом РФ, Законом РФ № 2300-1 «О защите прав потребителей» и Федеральным законом № 152-ФЗ «О персональных данных».",
              )}
            </p>
          </div>
        </div>

        {/* 2. Предмет договора */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={2}>Предмет договора</SectionTitle>
          <p className="ml-10 text-brandy/85 text-sm leading-relaxed">
            {typo(
              "Исполнитель предоставляет Заказчику доступ к платным информационным разделам сайта relocost.ru. Для страниц городов доступны разделы: «Лучшие места для посещения» и «Полный список статей расходов», а также их комбинация. Для страниц стран — «Рейтинг городов страны» и «Полный обзор страны». Материалы представляют собой аналитическую и справочную информацию о стоимости жизни, собранную из открытых источников.",
            )}
          </p>
        </div>

        {/* 3. Пакеты и цены */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={3}>Пакеты и цены</SectionTitle>
          <div className="ml-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {PACKAGES.map((p) => (
                <div
                  key={p.name}
                  className="flex items-start justify-between gap-3
                             rounded-xl border hairline px-4 py-3"
                >
                  <div>
                    <p className="text-cream text-sm font-medium leading-snug">
                      {typo(`«${p.title}»`)}
                    </p>
                    {p.note && (
                      <p className="text-brandy/50 text-[11px] mt-0.5">{p.note}</p>
                    )}
                  </div>
                  <span className="text-copper font-bold text-sm shrink-0">
                    {p.price}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-brandy/65 text-xs leading-relaxed">
              {typo(
                "Цены указаны в российских рублях. Стоимость услуг налогом на добавленную стоимость (НДС) не облагается, поскольку Исполнитель применяет специальный налоговый режим «Налог на профессиональный доход» (НПД).",
              )}
            </p>
          </div>
        </div>

        {/* 4. Порядок оплаты */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={4}>Порядок оплаты</SectionTitle>
          <p className="ml-10 text-brandy/85 text-sm leading-relaxed">
            {typo(
              "Оплата услуг производится онлайн банковской картой через платежный сервис ЮKassa (ООО «НКО ЮMoney»). Перед оплатой Заказчик указывает адрес электронной почты (email), на который направляется подтверждение и который используется для предоставления услуги и идентификации Заказчика. Совершая оплату, Заказчик выражает согласие на немедленное исполнение договора и подтверждает, что осведомлен об утрате права на односторонний отказ от договора после открытия доступа к цифровому контенту.",
            )}
          </p>
        </div>

        {/* 5. Порядок получения услуги */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={5}>Порядок получения услуги</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "Доступ к оплаченному разделу открывается на сайте автоматически сразу после успешной оплаты. Копия материалов или подтверждение доступа дополнительно дублируется на указанный Заказчиком email.",
              )}
            </p>
            <p>
              {typo(
                "Услуга считается оказанной Исполнителем в полном объеме и надлежащим образом с момента открытия Заказчику доступа к оплаченному разделу.",
              )}
            </p>
          </div>
        </div>

        {/* 6. Возврат денежных средств */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={6}>Возврат денежных средств</SectionTitle>
          <div className="ml-10 space-y-3">
            <Callout variant="warning">
              <strong className="text-cream">Важно:</strong>{" "}
              {typo(
                "В соответствии с пунктом 4 статьи 26.1 Закона РФ «О защите прав потребителей», Заказчик утрачивает право на отказ от договора в отношении цифрового информационного контента после того, как Исполнитель начал исполнение договора с явно выраженного согласия Заказчика и Заказчик подтвердил, что тем самым теряет право на отказ. Оплата услуги означает такое согласие.",
              )}
            </Callout>
            <p className="text-brandy/85 text-sm leading-relaxed">
              {typo(
                "Если по техническим причинам доступ не открылся или была произведена двойная оплата — пишите на email Исполнителя. В случае подтверждения факта неисполнения услуги Исполнитель возвращает уплаченные денежные средства в течение 10 рабочих дней со дня поступления обоснованного требования.",
              )}
            </p>
          </div>
        </div>

        {/* 7. Ответственность сторон */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={7}>Ответственность сторон</SectionTitle>
          <p className="ml-10 text-brandy/85 text-sm leading-relaxed">
            {typo(
              "Материалы носят информационно-справочный характер. Цены и данные о стоимости жизни являются ориентировочными, основаны на открытых источниках и могут изменяться со временем. Исполнитель не несет ответственности за решения, принятые Заказчиком на основе предоставленных материалов, а также за форс-мажорные обстоятельства (сбои интернета, действия третьих лиц и т. п.).",
            )}
          </p>
        </div>

        {/* 8. Персональные данные */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={8}>Персональные данные</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "Адрес электронной почты Заказчика является персональными данными и обрабатывается в соответствии с Федеральным законом № 152-ФЗ «О персональных данных». Email используется исключительно для предоставления услуги, идентификации Заказчика и связи с ним в рамках настоящего договора.",
              )}
            </p>
            <p>
              {typo(
                "Email передается платежному сервису ЮKassa в объеме, необходимом для проведения оплаты и направления чека. Иным третьим лицам персональные данные не передаются.",
              )}
            </p>
            <p>
              Подробнее — в{" "}
              <Link href="/privacy" className="text-copper hover:underline">
                Политике конфиденциальности
              </Link>
              .
            </p>
          </div>
        </div>

        {/* 9. Претензии и споры */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={9}>Претензии и порядок разрешения споров</SectionTitle>
          <div className="ml-10 space-y-3 text-brandy/85 text-sm leading-relaxed">
            <p>
              {typo(
                "В случае возникновения разногласий Заказчик направляет Исполнителю письменную претензию на email viktoriakatunkina7k@gmail.com с указанием: ФИО, email, использованного при оплате, описания ситуации и требования.",
              )}
            </p>
            <Callout variant="info">
              {typo(
                "Исполнитель рассматривает претензию и направляет ответ в течение 10 (десяти) рабочих дней со дня ее получения (статьи 22 и 31 Закона РФ № 2300-1 «О защите прав потребителей»).",
              )}
            </Callout>
            <p>
              {typo(
                "Если спор не урегулирован в досудебном порядке, он подлежит рассмотрению в суде по месту жительства Заказчика (для физических лиц) в соответствии с законодательством Российской Федерации.",
              )}
            </p>
          </div>
        </div>

        {/* 10. Изменение оферты */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={10}>Изменение условий оферты</SectionTitle>
          <p className="ml-10 text-brandy/85 text-sm leading-relaxed">
            {typo(
              "Исполнитель вправе в одностороннем порядке изменять условия настоящей Оферты. Новая редакция вступает в силу с момента ее публикации на сайте relocost.ru. Продолжение использования платных разделов после публикации новой редакции означает согласие Заказчика с изменениями. К отношениям, возникшим до внесения изменений, применяется редакция Оферты, действовавшая на момент акцепта.",
            )}
          </p>
        </div>

        {/* 11. Применимое право */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <SectionTitle n={11}>Применимое право</SectionTitle>
          <p className="ml-10 text-brandy/85 text-sm leading-relaxed">
            {typo(
              "Настоящая Оферта и отношения сторон регулируются законодательством Российской Федерации. К ней применяются нормы Гражданского кодекса РФ (глава 39 «Возмездное оказание услуг»), Закона РФ № 2300-1 «О защите прав потребителей» и Федерального закона № 152-ФЗ «О персональных данных».",
            )}
          </p>
        </div>

        {/* 12. Реквизиты исполнителя */}
        <div className="rounded-2xl border border-copper/30 bg-copper/5 p-6 md:p-8">
          <SectionTitle n={12}>Реквизиты исполнителя</SectionTitle>
          <dl className="ml-10 divide-y divide-[var(--hairline)]">
            {[
              { label: "Исполнитель", value: "Катункина Виктория Витальевна" },
              { label: "Статус", value: "Самозанятый, плательщик НПД" },
              { label: "ИНН", value: "260503461107" },
              { label: "Email", value: "viktoriakatunkina7k@gmail.com", href: "mailto:viktoriakatunkina7k@gmail.com" },
              { label: "Сайт", value: "relocost.ru", href: "https://relocost.ru" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-baseline
                           gap-0.5 sm:gap-6 py-2.5"
              >
                <dt className="text-brandy/50 text-[10px] uppercase tracking-widest sm:w-32 shrink-0">
                  {row.label}
                </dt>
                <dd className="text-cream text-sm">
                  {row.href ? (
                    <a href={row.href} className="text-copper hover:underline">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="ml-10 mt-4 text-brandy/50 text-xs">
            Редакция от 5 августа 2026 г.
          </p>
        </div>

        {/* Подвальная ссылка */}
        <p className="text-brandy/60 text-sm">
          Реквизиты и контакты также доступны на странице{" "}
          <Link href="/contacts" className="text-copper hover:underline">
            «Контакты и реквизиты»
          </Link>
          .
        </p>
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
