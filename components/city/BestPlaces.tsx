"use client";

import Image from "next/image";
import { useUnlocked, isUnlocked } from "@/lib/unlocked";
import { LockedSection } from "@/components/freemium/LockedSection";
import type { CityContent, PlaceType } from "@/lib/cities-content";
import { typo } from "@/lib/typography";
import { photoSrc } from "@/lib/photo";

// Экспортируется — переиспользуется в components/trip/RouteTimeline.tsx для
// чипов типа точки маршрута (RouteStop["type"] — тот же набор значений).
export const TYPE_LABELS: Record<PlaceType, string> = {
  cafe: "Кафе",
  restaurant: "Ресторан",
  district: "Район",
  market: "Рынок",
  coworking: "Коворкинг",
  park: "Парк",
  attraction: "Достопримечательность",
};

function PlaceCard({ p }: { p: CityContent["best_places"][number] }) {
  // image_url всегда указывает на публичный Supabase Storage (bucket
  // "photos", путь u/<hash>.jpg) — фото загружены туда заранее, т.к.
  // images.unsplash.com недоступен с прод-VPS. photoSrc() дополнительно
  // разруливает R2-фолбэк при квоте Storage (см. lib/photo.ts).
  const src = photoSrc(p.image_url ?? null, null, { w: 800, q: 80 });
  return (
    <div className="rounded-3xl bg-surface border hairline hover:border-copper/25 hover:bg-surface-elevated transition group overflow-hidden">
      {src && (
        <div className="relative w-full h-36 md:h-40">
          <Image
            src={src}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-2xl text-cream leading-tight text-pretty">{p.name}</h3>
          <span className="chip chip-accent shrink-0">
            {TYPE_LABELS[p.type]}
          </span>
        </div>
        <p className="text-brandy/85 leading-relaxed text-pretty">
          {typo(p.description)}
        </p>
      </div>
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
  if (!places || places.length === 0) return null;
  const free = places.slice(0, 2);
  const locked = places.slice(2);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 md:pt-20">
      <span className="eyebrow">Локации</span>
      <h2 className="font-serif text-3xl md:text-5xl text-cream mt-6 mb-3">
        Лучшие места
      </h2>
      <p className="text-brandy/75 text-lg mb-10 max-w-xl text-pretty">
        {typo("Кафе, рестораны, районы и коворкинги, которые рекомендуют переехавшие.")}
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
              hint={`Еще ${locked.length} проверенных мест: рестораны, рынки, коворкинги, скрытые районы.`}
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
