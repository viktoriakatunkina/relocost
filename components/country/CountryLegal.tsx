// Детальный блок «Виза, ВНЖ и налоги» на странице страны (MoveHub / prian-стиль):
// три ключевых аспекта переезда в одном акцентном блоке — как въехать, как
// остаться надолго и сколько платить налогов. Данные — из COUNTRY_CONTENT
// (visa_note / residency_note / taxes_note), выверенный контент с пометкой о
// сверке. Рендерится, если есть хотя бы одна из заметок.
import type { ReactNode } from "react";

const VisaIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
);
const DocIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);
const TaxIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
);

function Item({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text?: string;
}) {
  if (!text) return null;
  return (
    <div className="flex gap-4">
      <span
        className="shrink-0 mt-0.5 w-10 h-10 rounded-xl bg-copper/15 border border-copper/30 text-copper flex items-center justify-center"
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <h3 className="text-cream font-medium mb-1.5">{title}</h3>
        <p className="text-brandy/80 text-sm md:text-base leading-relaxed text-pretty">
          {text}
        </p>
      </div>
    </div>
  );
}

export function CountryLegal({
  countryName,
  visa,
  residency,
  taxes,
}: {
  countryName: string;
  visa?: string;
  residency?: string;
  taxes?: string;
}) {
  if (!visa && !residency && !taxes) return null;
  return (
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Переезд по шагам</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Виза, ВНЖ и налоги — {countryName}
      </h2>
      <p className="text-brandy/80 text-lg mb-10 max-w-2xl text-pretty">
        Главное для переезда: как въехать, как остаться надолго и сколько платить
        налогов. Правила меняются — перед поездкой сверяйтесь с официальными
        источниками.
      </p>
      <div className="rounded-3xl bg-surface border hairline p-6 md:p-9 space-y-7">
        <Item icon={VisaIcon} title="Виза и въезд" text={visa} />
        <Item icon={DocIcon} title="ВНЖ и легализация" text={residency} />
        <Item icon={TaxIcon} title="Налоги" text={taxes} />
      </div>
    </section>
  );
}
