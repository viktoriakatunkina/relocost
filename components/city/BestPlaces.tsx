"use client";

import { useUnlocked, isUnlocked } from "@/lib/unlocked";
import { LockedSection } from "@/components/freemium/LockedSection";
import type { CityContent, PlaceType } from "@/lib/cities-content";

const TYPE_LABELS: Record<PlaceType, string> = {
  cafe: "Кафе",
  restaurant: "Ресторан",
  district: "Район",
  market: "Рынок",
  coworking: "Коворкинг",
  park: "Парк",
  attraction: "Достопримечательность",
};

function PlaceCard({ p }: { p: CityContent["best_places"][number] }) {
  return (
    <div className="p-6 rounded-2xl bg-kombu-green/40 border border-dingley/30">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h3 className="font-serif text-2xl text-cream">{p.name}</h3>
        <span className="text-pale-copper text-xs uppercase tracking-wider whitespace-nowrap">
          {TYPE_LABELS[p.type]}
        </span>
      </div>
      <p className="text-brandy/90 leading-relaxed">{p.description}</p>
    </div>
  );
}

export function BestPlaces({
  slug,
  places,
}: {
  slug: string;
  places: CityContent["best_places"];
}) {
  const unlocked = useUnlocked(slug);
  const opened = isUnlocked(unlocked, "places");
  const free = places.slice(0, 2);
  const locked = places.slice(2);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-20">
      <h2 className="font-serif text-3xl md:text-4xl text-cream mb-2">
        Лучшие места
      </h2>
      <p className="text-brandy/70 mb-8">
        Кафе, рестораны, районы и коворкинги, которые рекомендуют переехавшие.
      </p>
      <div className="grid md:grid-cols-2 gap-5">
        {free.map((p) => (
          <PlaceCard key={p.name} p={p} />
        ))}
      </div>

      {locked.length > 0 && (
        <div className="mt-5">
          {opened ? (
            <div className="grid md:grid-cols-2 gap-5">
              {locked.map((p) => (
                <PlaceCard key={p.name} p={p} />
              ))}
            </div>
          ) : (
            <LockedSection
              slug={slug}
              pkg="places"
              hint={`Ещё ${locked.length} проверенных мест: рестораны, рынки, коворкинги, скрытые районы.`}
            >
              <div className="grid md:grid-cols-2 gap-5">
                {locked.map((p) => (
                  <PlaceCard key={p.name} p={p} />
                ))}
              </div>
            </LockedSection>
          )}
        </div>
      )}
    </section>
  );
}
