"use client";

import { useState } from "react";
import type { CityRoute, RouteStop } from "@/lib/city-routes";
import { TYPE_LABELS } from "@/components/city/BestPlaces";
import { LockedSection } from "@/components/freemium/LockedSection";
import {
  useTripProgress,
  toggleStop,
  stopId,
  routeStopsChecked,
} from "@/lib/trip-progress";
import { reachGoal } from "@/lib/metrika";
import { typo } from "@/lib/typography";
import {
  formatDurationRange,
  formatCostRange,
  formatHoursRange,
  formatTransfer,
  routeCostTotal,
} from "@/lib/trip-format";

// ─── Точка маршрута ─────────────────────────────────────────────────────────

function StopRow({
  stop,
  index,
  done,
  onToggle,
}: {
  stop: RouteStop;
  index: number;
  done: boolean;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-pressed={done}
        aria-label={`Точка ${index + 1}: ${stop.name}${done ? " — пройдено" : ""}`}
        className={`mt-0.5 shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
          done
            ? "bg-copper border-copper text-pine-tree animate-check-pop"
            : "border-brandy/30 text-brandy/60 hover:border-copper/50 hover:text-copper"
        }`}
      >
        {done ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          index + 1
        )}
      </button>
      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
          <h3
            className={`font-serif text-xl leading-tight text-pretty ${
              done ? "text-brandy/50 line-through" : "text-cream"
            }`}
          >
            {stop.name}
          </h3>
          <span className="chip chip-accent shrink-0">{TYPE_LABELS[stop.type]}</span>
        </div>
        <p
          className={`text-sm leading-relaxed text-pretty ${
            done ? "text-brandy/40" : "text-brandy/80"
          }`}
        >
          {typo(stop.description)}
        </p>
        <p className="text-brandy/55 text-xs mt-2 tabular-nums">
          {formatDurationRange(stop.duration_min)} · {formatCostRange(stop.cost_rub)}
        </p>
        {stop.tip && (
          <p className="text-brandy/60 text-xs italic mt-1.5 leading-relaxed text-pretty">
            {typo(stop.tip)}
          </p>
        )}
      </div>
    </div>
  );
}

function ConnectorRow({ transfer }: { transfer?: RouteStop["transfer"] }) {
  if (!transfer) return null;
  return (
    <div className="flex gap-4 py-2">
      <div className="w-9 flex justify-center shrink-0">
        <div className="w-px h-5 bg-cream/12" aria-hidden />
      </div>
      <p className="text-brandy/40 text-xs flex items-center gap-1.5">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
        {formatTransfer(transfer)}
      </p>
    </div>
  );
}

function RouteSummary({ route }: { route: CityRoute }) {
  const [min, max] = routeCostTotal(route);
  return (
    <p className="mt-4 pt-4 border-t hairline text-brandy/70 text-sm">
      Весь маршрут: {formatHoursRange(route.hours)} · {formatCostRange([min, max])}
    </p>
  );
}

function ShareRow({ routeTitle }: { routeTitle: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Буфер обмена недоступен (нет разрешения/старый браузер) — тихо
      // игнорируем, кнопка просто не даст обратной связи.
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-copper/25 bg-copper/10 px-4 py-3 fade-in">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-copper shrink-0"
        aria-hidden
      >
        <path d="M12 3v2M12 19v2M5 5l1.4 1.4M17.6 17.6 19 19M3 12h2M19 12h2M5 19l1.4-1.4M17.6 6.4 19 5" />
        <circle cx="12" cy="12" r="4" />
      </svg>
      <div className="flex-1 min-w-[180px]">
        <p className="text-copper font-serif text-base leading-tight">Маршрут пройден!</p>
        <p className="text-brandy/60 text-xs mt-0.5">
          Все точки «{routeTitle}» отмечены — можно поделиться с попутчиком.
        </p>
      </div>
      <button
        type="button"
        onClick={handleShare}
        className="shrink-0 px-4 py-2 rounded-pill border border-copper/40 text-copper text-sm hover:bg-copper/10 transition"
      >
        {copied ? "Ссылка скопирована" : "Поделиться"}
      </button>
    </div>
  );
}

// ─── Таймлайн маршрута ──────────────────────────────────────────────────────

export function RouteTimeline({
  citySlug,
  route,
  locked = false,
  lockHint,
}: {
  citySlug: string;
  route: CityRoute;
  /** Открыта только первая точка, остальное — под LockedSection (пакет "places"). */
  locked?: boolean;
  lockHint?: string;
}) {
  const checked = useTripProgress(citySlug);
  const total = route.stops.length;
  const doneCount = routeStopsChecked(checked, route.slug);
  const isDone = doneCount === total;

  function handleToggle(index: number) {
    const wasDone = doneCount === total;
    const next = toggleStop(citySlug, route.slug, index);
    if (next.includes(stopId(route.slug, index))) {
      reachGoal("trip_stop_checked");
    }
    const nowDone = routeStopsChecked(next, route.slug) === total;
    if (!wasDone && nowDone) reachGoal("trip_route_done");
  }

  if (!locked) {
    return (
      <div>
        <div>
          {route.stops.map((stop, i) => (
            <div key={stop.name}>
              {i > 0 && <ConnectorRow transfer={stop.transfer} />}
              <StopRow
                stop={stop}
                index={i}
                done={checked.includes(stopId(route.slug, i))}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </div>
        <RouteSummary route={route} />
        {isDone && <ShareRow routeTitle={route.title} />}
      </div>
    );
  }

  const [first, ...rest] = route.stops;
  return (
    <div>
      <StopRow
        stop={first}
        index={0}
        done={checked.includes(stopId(route.slug, 0))}
        onToggle={handleToggle}
      />
      <LockedSection
        slug={citySlug}
        pkg="places"
        hint={lockHint}
        onOpen={() => reachGoal("trip_paywall_open")}
      >
        <div>
          {rest.map((stop, i) => (
            <div key={stop.name}>
              <ConnectorRow transfer={stop.transfer} />
              <StopRow
                stop={stop}
                index={i + 1}
                done={checked.includes(stopId(route.slug, i + 1))}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </div>
        <RouteSummary route={route} />
      </LockedSection>
    </div>
  );
}
