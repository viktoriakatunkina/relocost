import { Link } from "@/i18n/navigation";
import type { NewsItemCard } from "@/lib/news";
import type { NewsCTACity } from "@/lib/news-city-match";
import { NewsCTA } from "./NewsCTA";

// Дата события/публикации в карточке — короткий формат «21 сентября 2026».
function formatNewsDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

// Не оборачиваем всю карточку в один <Link> — внутри уже есть отдельная
// ссылка CTA (NewsCTA), а вложенные <a> внутри <a> невалидны и ломают клики.
export function NewsCard({
  item,
  ctaCity,
}: {
  item: NewsItemCard;
  ctaCity?: NewsCTACity | null;
}) {
  const dateLabel = formatNewsDate(item.event_date ?? item.created_at);
  return (
    <article className="rounded-3xl bg-surface border hairline p-6 transition hover:-translate-y-1 hover:border-copper/40 hover:bg-surface-elevated">
      <div className="flex items-center gap-2 text-brandy/60 text-[11px] uppercase tracking-[0.15em] mb-3">
        {item.category && <span className="chip chip-accent">{item.category}</span>}
        {dateLabel && <span>{dateLabel}</span>}
      </div>
      <Link href={`/news/${item.slug}`} className="group block">
        <h2 className="font-serif text-xl md:text-2xl text-cream leading-tight text-pretty group-hover:text-copper transition mb-2.5">
          {item.title}
        </h2>
      </Link>
      <p className="text-brandy/80 text-sm leading-relaxed mb-1">
        {item.summary}
      </p>
      {item.source_name && (
        <p className="text-brandy/50 text-xs mt-2">Источник: {item.source_name}</p>
      )}
      <NewsCTA city={ctaCity} variant="card" />
    </article>
  );
}
