import { getRecentCrowdPrices, getCityCrowdPrices } from "@/lib/crowd-prices";
import type { CrowdPrice } from "@/lib/crowd-prices";
import { getAllCitiesForSearch } from "@/lib/cities";

const CATEGORY_EMOJI: Record<string, string> = {
  food: "🍜",
  rent: "🏠",
  transport: "🚌",
  leisure: "🎭",
  health: "💊",
  other: "📌",
  cafe: "☕",
  utilities: "💡",
  entertainment: "🎭",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 2) return "только что";
  if (diffMin < 60) return `${diffMin} мин назад`;
  if (diffH < 24) return `${diffH} ч назад`;
  if (diffD === 1) return "вчера";
  if (diffD < 7) return `${diffD} дн назад`;
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(amount) + " ₽";
}

interface Props {
  citySlug?: string;
  limit?: number;
  initialPrices?: CrowdPrice[];
}

function PriceCard({
  p,
  showCity,
  cityName,
  cityEmoji,
}: {
  p: CrowdPrice;
  showCity: boolean;
  cityName: string;
  cityEmoji: string | null;
}) {
  const catEmoji = CATEGORY_EMOJI[p.category] ?? "📌";
  return (
    <div className="shrink-0 flex flex-col gap-2 bg-surface border hairline rounded-2xl p-4 w-[200px]">
      {showCity && (
        <p className="text-brandy/55 text-[11px] leading-none truncate">
          <span aria-hidden>{cityEmoji}</span>{" "}
          {cityName}
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <span aria-hidden className="text-base leading-none">{catEmoji}</span>
        <p className="text-brandy/70 text-xs truncate">{p.item_name}</p>
      </div>
      <p className="text-cream font-semibold text-lg leading-none tabular-nums">
        {formatAmount(p.amount_rub)}
      </p>
      <p className="text-brandy/35 text-[10px] leading-none mt-auto">
        {timeAgo(p.created_at)}
      </p>
    </div>
  );
}

export async function CrowdPriceFeed({ citySlug, limit = 8, initialPrices }: Props) {
  const fetchedPrices = initialPrices ?? (
    citySlug
      ? await getCityCrowdPrices(citySlug, limit)
      : await getRecentCrowdPrices(limit)
  );

  const prices = initialPrices ? initialPrices.slice(0, limit) : fetchedPrices;

  if (prices.length === 0) return null;

  const showCity = !citySlug;
  let cityMap = new Map<string, { name_ru: string; flag_emoji: string | null }>();
  if (showCity) {
    const cities = await getAllCitiesForSearch();
    cityMap = new Map(cities.map((c) => [c.slug, c]));
  }

  return (
    <div className="flex overflow-x-auto gap-3 scrollbar-none -mx-6 px-6 pb-1">
      {prices.map((p) => {
        const city = cityMap.get(p.city_slug);
        return (
          <PriceCard
            key={p.id}
            p={p}
            showCity={showCity}
            cityName={city?.name_ru ?? p.city_slug}
            cityEmoji={city?.flag_emoji ?? ""}
          />
        );
      })}
    </div>
  );
}
