"use client";

import { useState } from "react";

// Блок «Встроить на сайт» — embeddable badge для блогеров.
// Генерирует dofollow-обратные ссылки на relocost.ru (цель: линкбилдинг).
// Бейдж — SVG-маршрут /api/badge/[slug], кешируется 24ч на CDN.

const BASE = "https://relocost.ru";

export function BadgeEmbed({
  slug,
  cityName,
}: {
  slug: string;
  cityName: string;
}) {
  const [copied, setCopied] = useState(false);

  const badgeSrc = `${BASE}/api/badge/${slug}`;
  const pageUrl = `${BASE}/city/${slug}`;
  const alt = `Стоимость жизни в ${cityName} — Relocost`;

  const snippet = `<a href="${pageUrl}" target="_blank" rel="noopener">\n  <img src="${badgeSrc}" alt="${alt}" width="360" height="90" style="border:0">\n</a>`;

  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Для блогеров и авторов</span>
      <h2 className="font-serif text-3xl md:text-4xl text-cream mt-6 mb-3">
        Встройте бейдж на свой сайт
      </h2>
      <p className="text-brandy/80 text-base mb-8 max-w-2xl text-pretty">
        Скопируйте код и вставьте в статью — бейдж автоматически покажет
        актуальные данные о стоимости жизни в {cityName}.
      </p>

      {/* Превью бейджа */}
      <div className="mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badgeSrc}
          alt={alt}
          width={360}
          height={90}
          className="rounded-lg"
        />
      </div>

      {/* Сниппет с кнопкой копирования */}
      <div className="rounded-2xl bg-surface border hairline overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b hairline">
          <span className="text-xs text-brandy/50 font-mono">HTML</span>
          <button
            onClick={copy}
            className="text-xs px-3 py-1 rounded-lg bg-copper/15 text-copper hover:bg-copper/25 transition-colors"
          >
            {copied ? "Скопировано ✓" : "Скопировать код"}
          </button>
        </div>
        <pre className="px-4 py-4 text-xs font-mono text-brandy/80 overflow-x-auto whitespace-pre">
          {snippet}
        </pre>
      </div>

      <p className="mt-4 text-xs text-brandy/40">
        Бейдж обновляется автоматически при изменении данных. Ссылка ведёт
        на страницу с полным расчётом бюджета переезда.
      </p>
    </section>
  );
}
