"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";

export type PickerCity = {
  slug: string;
  name_ru: string;
  country_ru: string;
};

// Выбор произвольной пары городов на /compare: два select'а + кнопка, которая
// собирает slug ровно так же, как канонизация в app/[locale]/compare/[pair]/
// page.tsx (алфавитная пара городов, pairSlug = `${a}-vs-${b}`) — чтобы
// переход сразу попадал на каноническую страницу, а не на реверс-дубль,
// который затем редиректит. dynamicParams=true на [pair] держит страницу
// живой даже для пар, которых нет среди прегенерированных.
export function ComparePicker({ cities }: { cities: PickerCity[] }) {
  const router = useRouter();
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [error, setError] = useState("");

  const sorted = useMemo(
    () => [...cities].sort((x, y) => x.name_ru.localeCompare(y.name_ru, "ru")),
    [cities],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!a || !b) {
      setError("Выберите два города — оба поля должны быть заполнены.");
      return;
    }
    if (a === b) {
      setError("Выберите два разных города.");
      return;
    }
    setError("");
    const [first, second] = [a, b].sort();
    router.push(`/compare/${first}-vs-${second}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-surface border hairline p-6 md:p-8"
    >
      <div className="grid sm:grid-cols-[1fr,auto,1fr] items-end gap-4 mb-5">
        <CitySelect
          label="Первый город"
          value={a}
          onChange={setA}
          cities={sorted}
          disabledSlug={b}
        />
        <p className="hidden sm:block text-brandy/45 text-sm pb-3 text-center">
          или
        </p>
        <CitySelect
          label="Второй город"
          value={b}
          onChange={setB}
          cities={sorted}
          disabledSlug={a}
        />
      </div>

      {error && <p className="text-amber-400 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 rounded-pill bg-copper text-pine-tree font-semibold hover:bg-brandy transition"
      >
        Сравнить города
      </button>
    </form>
  );
}

function CitySelect({
  label,
  value,
  onChange,
  cities,
  disabledSlug,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
  cities: PickerCity[];
  disabledSlug: string;
}) {
  return (
    <label className="block">
      <span className="block text-brandy/70 text-sm mb-2">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-pill bg-pine-tree/60 border hairline text-cream pl-4 pr-9 py-3 text-sm focus:border-copper focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-pine-tree">
            — выберите город —
          </option>
          {cities.map((c) => (
            <option
              key={c.slug}
              value={c.slug}
              disabled={c.slug === disabledSlug && disabledSlug !== ""}
              className="bg-pine-tree"
            >
              {c.name_ru} ({c.country_ru})
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 text-copper pointer-events-none"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </label>
  );
}
