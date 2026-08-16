import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n-seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return {
    title: "Контакты и реквизиты — Relocost",
    description:
      "Реквизиты исполнителя и контакты Relocost: самозанятый Катункина Виктория Витальевна, ИНН 260503461107. По вопросам оплаты, доступа и возвратов — email.",
    alternates: buildAlternates("/contacts", params.locale),
    openGraph: {
      title: "Контакты и реквизиты — Relocost",
      description:
        "Реквизиты исполнителя и контакты для вопросов по оплате и доступу к платным разделам.",
      type: "website",
    },
  };
}

const DETAILS: { label: string; value: React.ReactNode }[] = [
  { label: "Исполнитель", value: "Самозанятый Катункина Виктория Витальевна" },
  { label: "Статус", value: "Плательщик налога на профессиональный доход (НПД)" },
  { label: "ИНН", value: "260503461107" },
  {
    label: "Email",
    value: (
      <a
        href="mailto:viktoriakatunkina7k@gmail.com"
        className="text-copper hover:underline"
      >
        viktoriakatunkina7k@gmail.com
      </a>
    ),
  },
  {
    label: "Сайт",
    value: (
      <a
        href="https://relocost.ru"
        className="text-copper hover:underline"
      >
        relocost.ru
      </a>
    ),
  },
];

export default async function ContactsPage({
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
        items={[
          { name: tc("home"), href: "/" },
          { name: tf("contacts") },
        ]}
      />

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-12">
        <p className="eyebrow mb-5">Контакты</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream leading-[1.05] mb-6">
          Контакты и реквизиты
        </h1>
        <p className="text-brandy/80 text-lg leading-relaxed">
          По любым вопросам, связанным с оплатой, доступом к платным разделам
          и возвратами, пишите на email — отвечаем в течение 1–2 рабочих дней.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6">
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <h2 className="font-serif text-2xl text-cream mb-6">
            Реквизиты исполнителя
          </h2>
          <dl className="divide-y divide-[var(--hairline)]">
            {DETAILS.map((d) => (
              <div
                key={d.label}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3.5"
              >
                <dt className="text-brandy/55 text-xs uppercase tracking-[0.14em] sm:w-40 shrink-0">
                  {d.label}
                </dt>
                <dd className="text-cream text-base">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mt-8">
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <h2 className="font-serif text-2xl text-cream mb-6">
            Оплата и получение доступа
          </h2>
          <dl className="space-y-5 text-brandy/85 leading-relaxed">
            <div>
              <dt className="text-cream font-medium mb-1">Что вы покупаете</dt>
              <dd>
                Доступ к платным информационным разделам отчета о стоимости
                жизни в выбранном городе: «Лучшие места» (19 ₽), «Все расходы»
                (49 ₽) и комбо «Расходы + Места» (59 ₽). Для страниц стран:
                «Рейтинг городов» (49 ₽) и «О стране» (29 ₽). Цены
                окончательные, в рублях, НДС не облагаются (режим НПД).
              </dd>
            </div>
            <div>
              <dt className="text-cream font-medium mb-1">Как оплатить</dt>
              <dd>
                Оплата онлайн банковской картой через сервис ЮKassa. Перед
                оплатой вы указываете email — на него приходит подтверждение.
              </dd>
            </div>
            <div>
              <dt className="text-cream font-medium mb-1">
                Как вы получаете услугу
              </dt>
              <dd>
                Это цифровая услуга — физическая доставка не требуется. Доступ к
                оплаченному разделу открывается на сайте автоматически сразу
                после успешной оплаты, а подтверждение дублируется на указанный
                email.
              </dd>
            </div>
            <div>
              <dt className="text-cream font-medium mb-1">Возврат</dt>
              <dd>
                Условия возврата описаны в{" "}
                <a href="/offer" className="text-copper hover:underline">
                  публичной оферте
                </a>
                . Если доступ по техническим причинам не открылся — напишите
                нам, мы откроем его вручную или вернем оплату.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
