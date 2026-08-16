"use client";

import { useEffect, useRef, useState } from "react";
import {
  COUNTRY_SIZE_DATA,
  RUSSIA_SVG_PATH,
  RUSSIA_AREA_KM2,
} from "@/lib/country-size-data";

type Props = {
  countrySlug: string;
  countryName: string;
  locale: string;
  titleRu?: string;
  titleEn?: string;
};

// Форматируем число с разделителями тысяч
function formatNumber(n: number, locale: string): string {
  return n.toLocaleString(locale === "en" ? "en-US" : "ru-RU");
}

export function TrueSizeMap({
  countrySlug,
  countryName,
  locale,
  titleRu = "Насколько велика",
  titleEn = "How big is",
}: Props) {
  const data = COUNTRY_SIZE_DATA[countrySlug];
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!data) return null;

  const isRu = locale !== "en";
  const heading = isRu
    ? `${titleRu} ${countryName}?`
    : `${titleEn} ${countryName}?`;
  const comparison = isRu ? data.comparison_ru : data.comparison_en;
  const areaLabel = isRu ? "Площадь" : "Area";
  const russiaLabel = isRu ? "Россия" : "Russia";
  const countryLabel = countryName;

  // Соотношение площадей для масштабирования SVG-контура страны
  // Отображаем страну пропорционально Russia в едином viewBox
  // Russia занимает ~70% viewBox по ширине; страна масштабируется пропорционально
  const scaleCountry = Math.sqrt(data.area_km2 / RUSSIA_AREA_KM2);
  // Минимальный масштаб 0.10 чтобы маленькие страны были видны; максимум 0.85
  const finalScale = Math.max(0.10, Math.min(0.85, scaleCountry));

  // Определяем опорную точку масштабирования — центр viewBox (100,100)
  const cx = 100;
  const cy = 100;

  return (
    <section
      ref={containerRef}
      className={`max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      aria-label={heading}
    >
      <div className="mb-6 md:mb-8">
        <p className="text-copper uppercase text-xs tracking-[0.2em] font-medium mb-3">
          True Size
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-cream">
          {heading}
        </h2>
      </div>

      {/* Карточка с двумя контурами */}
      <div className="bg-surface hairline rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* SVG-визуализация */}
          <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-pine-tree/60">
            <div className="w-full max-w-sm mx-auto">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
                aria-hidden="true"
              >
                {/* Сетка фона */}
                <defs>
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="#33432B"
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                  </pattern>
                  <clipPath id="countryClip">
                    <path d={data.svg_path} />
                  </clipPath>
                </defs>
                <rect width="200" height="200" fill="url(#grid)" />

                {/* Контур России — полупрозрачный, на весь viewBox */}
                <path
                  d={RUSSIA_SVG_PATH}
                  fill="#6A784D"
                  fillOpacity="0.25"
                  stroke="#6A784D"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  className={
                    visible
                      ? "transition-all duration-700 delay-100"
                      : "opacity-0"
                  }
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.7s ease 0.1s",
                  }}
                />

                {/* Подпись России */}
                <text
                  x="100"
                  y="12"
                  textAnchor="middle"
                  fill="#8A9A6E"
                  fontSize="7"
                  fontFamily="system-ui, sans-serif"
                >
                  {russiaLabel} ({formatNumber(RUSSIA_AREA_KM2, locale)} km²)
                </text>

                {/* Контур страны — масштабированный, акцентный цвет */}
                <g
                  transform={`translate(${cx},${cy}) scale(${finalScale}) translate(${-cx},${-cy})`}
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
                  }}
                >
                  <path
                    d={data.svg_path}
                    fill="#C4866D"
                    fillOpacity="0.4"
                    stroke="#C4866D"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Подпись страны */}
                <text
                  x="100"
                  y="192"
                  textAnchor="middle"
                  fill="#C4866D"
                  fontSize="7"
                  fontFamily="system-ui, sans-serif"
                >
                  {countryLabel} ({formatNumber(data.area_km2, locale)} km²)
                </text>
              </svg>
            </div>

            {/* Легенда */}
            <div className="flex items-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2 text-muted-green">
                <span
                  className="inline-block w-4 h-3 rounded-sm"
                  style={{ background: "#6A784D", opacity: 0.7 }}
                />
                {russiaLabel}
              </span>
              <span className="flex items-center gap-2 text-brandy">
                <span
                  className="inline-block w-4 h-3 rounded-sm"
                  style={{ background: "#C4866D", opacity: 0.7 }}
                />
                {countryLabel}
              </span>
            </div>
          </div>

          {/* Текстовые факты */}
          <div className="p-6 md:p-8 flex flex-col justify-center gap-5">
            {/* Основное сравнение */}
            <p className="text-brandy/90 text-base leading-relaxed">
              {comparison}
            </p>

            {/* Числовые факты */}
            <div className="grid grid-cols-2 gap-4">
              <Stat
                label={`${areaLabel} ${countryLabel}`}
                value={`${formatNumber(data.area_km2, locale)} km²`}
                accent
              />
              <Stat
                label={`${areaLabel} ${russiaLabel}`}
                value={`${formatNumber(RUSSIA_AREA_KM2, locale)} km²`}
              />
              <Stat
                label={isRu ? "Россия больше в" : "Russia is larger by"}
                value={`${data.russia_ratio}×`}
                accent
              />
              <Stat
                label={isRu ? "Доля от России" : "Share of Russia"}
                value={`1/${data.russia_ratio}`}
              />
            </div>

            {/* CTA */}
            <p className="text-muted-green text-sm mt-1">
              {isRu
                ? "Размер — не приговор: переехать в маленькую страну проще, чем кажется."
                : "Size isn’t everything — small countries often offer the best quality of life."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-green text-xs uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`font-serif text-xl ${accent ? "text-copper" : "text-cream"}`}
      >
        {value}
      </span>
    </div>
  );
}
