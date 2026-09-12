import { createFileRoute, Link } from "@tanstack/react-router";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { listMemories } from "@/lib/museum/api";
import { catalogNumber, excerpt } from "@/lib/utils";

export const Route = createFileRoute("/midnight")({
  loader: () => listMemories({ data: { midnight: true } }),
  component: MidnightPage,
});

function MidnightPage() {
  const memories = Route.useLoaderData();

  return (
    <MuseumShell dense>
      <RoomHeader
        kicker="Annex"
        title="The Midnight Archive"
        line="Stories submitted between midnight and dawn, when the rooms are quietest."
      />
      <div className="mx-auto max-w-3xl space-y-8 px-5 md:px-10">
        {memories.map((memory) => (
          <Link key={memory.id} to="/archive/$id" params={{ id: String(memory.id) }} className="block transition-[transform] duration-500 hover:translate-x-1">
            <p className="text-[10px] tracking-[0.28em] text-gold uppercase">{catalogNumber("ARCHIVE", memory.id)}</p>
            <h2 className="mt-2 font-display text-3xl">{memory.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">{excerpt(memory.content, 200)}</p>
          </Link>
        ))}
        {memories.length === 0 ? <p className="text-mist">No one has written after midnight yet.</p> : null}
      </div>
    </MuseumShell>
  );
}
