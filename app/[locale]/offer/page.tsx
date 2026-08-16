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
  { name: "country_cities", title: "Рейтинг городов страны", price: "49 ₽", note: "для страниц стран" },
  { name: "country_overview", title: "Полный обзор страны", price: "29 ₽", note: "для страниц стран" },
];

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

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-10">
        <p className="eyebrow mb-5">Документы</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream leading-[1.05] mb-4">
          Публичная оферта
        </h1>
        <p className="text-brandy/60 text-sm">
          Договор на оказание услуг. Редакция от 3 июня 2026 г.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <article
          className="prose prose-invert max-w-none
            prose-headings:font-serif prose-headings:text-cream
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-brandy/85 prose-p:leading-relaxed
            prose-li:text-brandy/85 prose-strong:text-cream
            prose-a:text-copper prose-a:no-underline hover:prose-a:underline
            prose-hr:hairline"
        >
          <h2>1. Общие положения</h2>
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

          <h2>2. Предмет договора</h2>
          <p>
            {typo(
              "Исполнитель предоставляет Заказчику доступ к платным информационным разделам сайта relocost.ru. Для страниц городов доступны разделы: «Лучшие места для посещения» и «Полный список статей расходов», а также их комбинация. Для страниц стран — «Рейтинг городов страны» и «Полный обзор страны». Материалы представляют собой аналитическую и справочную информацию о стоимости жизни.",
            )}
          </p>

          <h2>3. Пакеты и цены</h2>
          <p>
            {typo(
              "Заказчику доступны следующие пакеты информационных материалов:",
            )}
          </p>
          <ul>
            {PACKAGES.map((p) => (
              <li key={p.name}>
                <strong>{typo(`«${p.title}» — ${p.price}`)}</strong>
                {p.note ? typo(` (${p.note})`) : ""}.
              </li>
            ))}
          </ul>
          <p>
            {typo(
              "Цены указаны в российских рублях. Стоимость услуг налогом на добавленную стоимость (НДС) не облагается, поскольку Исполнитель применяет специальный налоговый режим «Налог на профессиональный доход» (НПД).",
            )}
          </p>

          <h2>4. Порядок оплаты</h2>
          <p>
            {typo(
              "Оплата услуг производится онлайн банковской картой через платежный сервис ЮKassa (ООО «НКО ЮMoney»). Перед оплатой Заказчик указывает адрес электронной почты (email), на который направляется подтверждение и который используется для предоставления услуги.",
            )}
          </p>

          <h2>5. Порядок получения услуги</h2>
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

          <h2>6. Возврат денежных средств</h2>
          <p>
            {typo(
              "Поскольку услуга носит характер предоставления доступа к цифровому информационному контенту и оказывается в момент оплаты, после открытия доступа возврат денежных средств не производится.",
            )}
          </p>
          <p>
            {typo(
              "Спорные ситуации (двойная оплата, технический сбой, не открывшийся доступ) решаются индивидуально по обращению Заказчика на email Исполнителя. Если услуга фактически не была оказана, Исполнитель возвращает уплаченные денежные средства.",
            )}
          </p>

          <h2>7. Ответственность сторон</h2>
          <p>
            {typo(
              "Материалы носят информационно-справочный характер. Цены и данные о стоимости жизни являются ориентировочными, основаны на открытых источниках и могут изменяться со временем. Исполнитель не несет ответственности за решения, принятые Заказчиком на основе предоставленных материалов.",
            )}
          </p>

          <h2>8. Персональные данные</h2>
          <p>
            {typo(
              "Адрес электронной почты Заказчика используется исключительно для предоставления услуги и связи с Заказчиком. Email не передается третьим лицам, за исключением платежного сервиса, обеспечивающего проведение оплаты.",
            )}
          </p>

          <h2>9. Реквизиты исполнителя</h2>
          <ul>
            <li>
              {typo("Исполнитель: самозанятый Катункина Виктория Витальевна")}
            </li>
            <li>{typo("Статус: плательщик НПД")}</li>
            <li>ИНН: 260503461107</li>
            <li>
              Email:{" "}
              <a href="mailto:viktoriakatunkina7k@gmail.com">
                viktoriakatunkina7k@gmail.com
              </a>
            </li>
            <li>
              Сайт: <a href="https://relocost.ru">relocost.ru</a>
            </li>
          </ul>
          <p className="text-brandy/55 text-sm">
            Редакция настоящей Оферты опубликована 3 июня 2026 г.
          </p>
        </article>

        <p className="mt-10 text-brandy/70 text-sm">
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
