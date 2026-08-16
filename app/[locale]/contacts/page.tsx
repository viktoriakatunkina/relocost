import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { typo } from "@/lib/typography";
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

/* ─── иконки SVG (inline, без внешних зависимостей) ─────────── */

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ─── страница ───────────────────────────────────────────────── */

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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <p className="eyebrow mb-5">Контакты</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream leading-[1.05] mb-4">
          Контакты и реквизиты
        </h1>
        <p className="text-brandy/75 text-base leading-relaxed">
          {typo(
            "По вопросам оплаты, доступа и возвратов пишите на email — отвечаем в течение 1–2 рабочих дней. Претензии по закону рассматриваем в течение 10 рабочих дней.",
          )}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 space-y-5">

        {/* ── Email-контакт ─────────────────────────────────── */}
        <a
          href="mailto:viktoriakatunkina7k@gmail.com"
          className="flex items-center gap-4 rounded-2xl bg-copper/10 border border-copper/30
                     px-6 py-5 group hover:bg-copper/15 transition-colors"
        >
          <span className="text-copper">
            <IconMail />
          </span>
          <div>
            <p className="text-brandy/55 text-xs uppercase tracking-widest mb-0.5">
              Email для обращений
            </p>
            <p className="text-copper text-base font-medium group-hover:underline">
              viktoriakatunkina7k@gmail.com
            </p>
          </div>
        </a>

        {/* ── Реквизиты ─────────────────────────────────────── */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <h2 className="font-serif text-xl text-cream mb-5">
            Реквизиты исполнителя
          </h2>
          <dl className="divide-y divide-[var(--hairline)]">
            {[
              { label: "Исполнитель", value: "Катункина Виктория Витальевна" },
              {
                label: "Статус",
                value: "Самозанятый, плательщик налога на профессиональный доход (НПД)",
              },
              { label: "ИНН", value: "260503461107" },
              {
                label: "Email",
                value: "viktoriakatunkina7k@gmail.com",
                href: "mailto:viktoriakatunkina7k@gmail.com",
              },
              {
                label: "Сайт",
                value: "relocost.ru",
                href: "https://relocost.ru",
              },
            ].map((d) => (
              <div
                key={d.label}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3"
              >
                <dt className="text-brandy/50 text-[10px] uppercase tracking-[0.14em] sm:w-40 shrink-0">
                  {d.label}
                </dt>
                <dd className="text-cream text-sm">
                  {d.href ? (
                    <a href={d.href} className="text-copper hover:underline">
                      {d.value}
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Оплата и получение доступа ───────────────────── */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <h2 className="font-serif text-xl text-cream mb-5">
            Оплата и получение доступа
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: <IconCard />,
                title: "Что Вы покупаете",
                text: "Доступ к платным информационным разделам сайта relocost.ru. Для страниц городов: «Лучшие места для посещения» (19 ₽), «Полный список статей расходов» (49 ₽) и комбо «Расходы + Лучшие места» (59 ₽). Для страниц стран: «Рейтинг городов страны» (49 ₽) и «Полный обзор страны» (29 ₽). Цены окончательные, в рублях, НДС не облагаются (режим НПД).",
              },
              {
                icon: <IconShield />,
                title: "Как оплатить",
                text: "Оплата онлайн банковской картой через сервис ЮKassa. Перед оплатой Вы указываете email — на него приходит подтверждение и чек.",
              },
              {
                icon: <IconCheck />,
                title: "Как Вы получаете услугу",
                text: "Это цифровая услуга — физическая доставка не требуется. Доступ к оплаченному разделу открывается на сайте автоматически сразу после успешной оплаты, а подтверждение дублируется на указанный email.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-copper mt-0.5 shrink-0">{item.icon}</span>
                <div>
                  <p className="text-cream text-sm font-medium mb-1">{item.title}</p>
                  <p className="text-brandy/80 text-sm leading-relaxed">
                    {typo(item.text)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Возврат ──────────────────────────────────────── */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <h2 className="font-serif text-xl text-cream mb-5">
            Возврат и претензии
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-brandy/85">
            <p>
              {typo(
                "Поскольку услуга является цифровым информационным контентом и исполняется в момент оплаты (доступ открывается мгновенно), после открытия доступа возврат в общем случае не производится.",
              )}
            </p>
            <div className="flex gap-3 rounded-xl border border-copper/30 bg-copper/5 px-4 py-3">
              <span className="text-copper mt-0.5 shrink-0"><IconClock /></span>
              <p>
                {typo(
                  "Если доступ по техническим причинам не открылся — напишите нам, мы исправим ситуацию: откроем вручную или вернем оплату в течение 10 рабочих дней со дня получения обоснованного требования.",
                )}
              </p>
            </div>
            <p>
              Подробные условия — в{" "}
              <Link href="/offer" className="text-copper hover:underline">
                публичной оферте
              </Link>
              .
            </p>
          </div>
        </div>

        {/* ── Подача претензии ─────────────────────────────── */}
        <div className="rounded-2xl bg-surface border hairline p-6 md:p-8">
          <h2 className="font-serif text-xl text-cream mb-5">
            Как подать претензию
          </h2>
          <p className="text-brandy/75 text-sm leading-relaxed mb-5">
            {typo(
              "В соответствии со статьями 22 и 31 Закона РФ № 2300-1 «О защите прав потребителей» Ваша претензия рассматривается в течение 10 рабочих дней. Для ускорения обработки укажите в письме:",
            )}
          </p>
          <ol className="space-y-2.5">
            {[
              "Ваше имя и фамилию",
              "Email, который Вы указывали при оплате",
              "Дату и сумму платежа (если известна)",
              "Суть проблемы — что именно не так",
              "Ваше требование — возврат, открытие доступа или иное",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full
                             bg-copper/15 text-copper text-[10px] font-bold shrink-0 mt-0.5"
                >
                  {i + 1}
                </span>
                <span className="text-brandy/85 text-sm leading-relaxed">{typo(step)}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 pt-5 border-t hairline">
            <a
              href="mailto:viktoriakatunkina7k@gmail.com?subject=Претензия по заказу Relocost"
              className="inline-flex items-center gap-2 text-copper text-sm font-medium hover:underline"
            >
              <IconMail />
              Отправить претензию по email
            </a>
          </div>
        </div>

        {/* ── Персональные данные ───────────────────────────── */}
        <div className="rounded-2xl bg-surface border hairline p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="text-brandy/40 mt-0.5 shrink-0"><IconShield /></span>
            <div>
              <p className="text-cream text-sm font-medium mb-1">Персональные данные</p>
              <p className="text-brandy/70 text-sm leading-relaxed">
                {typo(
                  "Ваш email обрабатывается только для исполнения договора и направления чека. Подробнее — в ",
                )}
                <Link href="/privacy" className="text-copper hover:underline">
                  Политике конфиденциальности
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

      </section>

      <div className="pt-12 md:pt-24">
        <Footer />
      </div>
    </main>
  );
}
