import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { getEmotionMap, listMemories } from "@/lib/museum/api";
import { MAP_CITIES } from "@/lib/museum/constants";
import { excerpt } from "@/lib/utils";
import type { MapPoint, Memory } from "@/lib/museum/types";

export const Route = createFileRoute("/map")({
  loader: async () => {
    const [map, memories] = await Promise.all([getEmotionMap(), listMemories({ data: {} })]);
    return { map, memories };
  },
  component: MapPage,
});

function MapPage() {
  const { map, memories } = Route.useLoaderData();
  const points = map.points;
  const [active, setActive] = useState<MapPoint | { city: string; region: string; count: number } | null>(
    points.find((point) => point.count > 0) ?? points[0] ?? null,
  );
  const stories: Memory[] = active
    ? memories.filter((item) => (item.location ?? "").toLowerCase() === active.city.toLowerCase())
    : [];
  const max = Math.max(1, ...points.map((point) => point.count));

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Gallery VI"
        title="The Emotion Map"
        line="Only cities, never streets. A constellation of feeling rather than a census."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.3fr_0.9fr] md:px-10">
        <div className="relative aspect-[1.7/1] overflow-hidden rounded-lg bg-ink-elevated shadow-[var(--shadow-border)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,color-mix(in_oklab,var(--color-gold)_12%,transparent),transparent_45%)]" />
          <svg viewBox="0 0 100 58" className="h-full w-full text-gold">
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={`lat-${i}`}
                x1="0"
                x2="100"
                y1={6 + i * 6.5}
                y2={6 + i * 6.5}
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeWidth="0.15"
              />
            ))}
            {MAP_CITIES.map((city) => {
              const point = points.find((item) => item.city === city.city);
              const count = point?.count ?? 0;
              const selected = active?.city === city.city;
              return (
                <g key={city.city}>
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={selected ? 1.6 : count ? 0.7 + (count / max) * 1.8 : 0.45}
                    fill="currentColor"
                    className={count ? "map-pulse text-gold" : "text-paper"}
                    opacity={selected ? 1 : count ? 0.85 : 0.28}
                  />
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="3.2"
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${city.city}, ${count} memories`}
                    className="cursor-pointer"
                    onClick={() => setActive({ ...city, count })}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActive({ ...city, count });
                      }
                    }}
                  />
                </g>
              );
            })}
          </svg>
        </div>
        <div>
          {active ? (
            <>
              <p className="text-[11px] tracking-[0.32em] text-gold uppercase">
                {"region" in active ? active.region : "Unplaced"}
              </p>
              <h2 className="mt-2 font-display text-4xl">{active.city}</h2>
              <p className="mt-2 text-sm text-mist">
                {active.count} {active.count === 1 ? "memory" : "memories"} preserved at city level.
              </p>
              <ul className="mt-8 space-y-5">
                {stories.slice(0, 4).map((memory) => (
                  <li key={memory.id}>
                    <Link to="/archive/$id" params={{ id: String(memory.id) }} className="block">
                      <p className="font-display text-xl">{memory.title}</p>
                      <p className="mt-1 text-sm text-mist">{excerpt(memory.content, 120)}</p>
                    </Link>
                  </li>
                ))}
                {stories.length === 0 ? <p className="text-sm text-mist">No public memories from this city yet.</p> : null}
              </ul>
            </>
          ) : (
            <p className="text-mist">Choose a city.</p>
          )}
          {map.unplaced.length ? (
            <div className="mt-10">
              <p className="text-[11px] tracking-[0.24em] text-mist uppercase">not on the map yet</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {map.unplaced.map((city) => (
                  <li key={city.city}>
                    <button
                      type="button"
                      className="min-h-11 rounded-full px-3 text-sm text-gold shadow-[var(--shadow-border)]"
                      onClick={() => setActive({ city: city.city, region: "Unplaced", count: city.count })}
                    >
                      {city.city} · {city.count}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </MuseumShell>
  );
}
