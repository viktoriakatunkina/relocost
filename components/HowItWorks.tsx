import { getTranslations } from "next-intl/server";

type StepAccent = {
  fg: string;
  bg: string;
  ring: string;
  num: string;
};

// Свой акцентный цвет на каждый шаг — блок перестает быть однотонным.
const ACCENTS: StepAccent[] = [
  { fg: "#3FB984", bg: "rgba(63,185,132,0.16)", ring: "rgba(63,185,132,0.40)", num: "rgba(63,185,132,0.16)" },
  { fg: "#E0A93E", bg: "rgba(224,169,62,0.16)", ring: "rgba(224,169,62,0.40)", num: "rgba(224,169,62,0.16)" },
  { fg: "#E0947A", bg: "rgba(224,148,122,0.16)", ring: "rgba(224,148,122,0.40)", num: "rgba(224,148,122,0.16)" },
];

const ICONS = [SearchIcon, CalcIcon, BookIcon];

export async function HowItWorks({ cityCount }: { cityCount: number }) {
  const t = await getTranslations("howItWorks");

  const steps = [
    { n: "01", title: t("step1Title"), text: t("step1Text", { count: cityCount }) },
    { n: "02", title: t("step2Title"), text: t("step2Text") },
    { n: "03", title: t("step3Title"), text: t("step3Text") },
  ];

  return (
    <section className="relative py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="font-serif text-4xl md:text-6xl text-cream mt-6 text-balance">
            {t("title")}
          </h2>
          <p className="text-brandy/80 text-lg max-w-xl mx-auto mt-4 text-pretty">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => {
            const Icon = ICONS[i];
            const a = ACCENTS[i];
            return (
              <div
                key={s.n}
                className="group relative p-8 rounded-3xl bg-surface border hairline transition-all duration-300 hover:bg-surface-elevated hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{
                      color: a.fg,
                      backgroundColor: a.bg,
                      boxShadow: `0 0 0 1px ${a.ring}, 0 8px 24px -12px ${a.fg}`,
                    }}
                  >
                    <Icon />
                  </div>
                  <span
                    className="font-serif text-6xl md:text-7xl leading-none select-none tabular-nums lining-nums"
                    style={{ color: a.num }}
                    aria-hidden
                  >
                    {s.n}
                  </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-cream mb-3">{s.title}</h3>
                <p className="text-brandy/85 leading-relaxed text-pretty">{s.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" fill="currentColor" fillOpacity="0.16" />
      <circle cx="12" cy="10" r="3.25" />
    </svg>
  );
}

function CalcIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2.5" width="16" height="19" rx="2.5" fill="currentColor" fillOpacity="0.14" />
      <rect x="7" y="5.5" width="10" height="3.5" rx="1" />
      <circle cx="8" cy="13" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="16" cy="13" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="16" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" fill="currentColor" fillOpacity="0.14" />
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="11.5" x2="13" y2="11.5" />
    </svg>
  );
}
