import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { EmptyRoom } from "@/components/museum/empty-room";
import { listMemories } from "@/lib/museum/api";
import { listFavorites } from "@/lib/museum/local";
import { catalogNumber, excerpt } from "@/lib/utils";

export const Route = createFileRoute("/kept")({
  loader: () => listMemories({ data: {} }),
  component: KeptPage,
});

function KeptPage() {
  const memories = Route.useLoaderData();
  const kept = useMemo(() => {
    const ids = new Set(listFavorites().filter((item) => item.kind === "memory").map((item) => item.id));
    return memories.filter((item) => ids.has(item.id));
  }, [memories]);

  return (
    <MuseumShell>
      <RoomHeader
        kicker="This device"
        title="Kept"
        line="Letters you asked this phone to remember. They are not synced. A new browser starts empty."
      />
      <div className="mx-auto max-w-3xl space-y-8 px-5 md:px-10">
        {kept.map((memory) => (
          <Link key={memory.id} to="/archive/$id" params={{ id: String(memory.id) }} className="block">
            <p className="text-[11px] tracking-[0.24em] text-gold uppercase">{catalogNumber("ARCHIVE", memory.id)}</p>
            <h2 className="mt-2 font-display text-3xl">{memory.title}</h2>
            <p className="mt-3 text-sm text-mist">{excerpt(memory.content, 180)}</p>
          </Link>
        ))}
        {kept.length === 0 ? (
          <EmptyRoom line="Nothing kept yet." action="Find something you need to hear" href="/needed" />
        ) : null}
      </div>
    </MuseumShell>
  );
}
