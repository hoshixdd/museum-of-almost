import { createFileRoute, Link } from "@tanstack/react-router";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { listMemories } from "@/lib/museum/api";
import { catalogNumber, excerpt } from "@/lib/utils";

export const Route = createFileRoute("/forgotten")({
  loader: () => listMemories({ data: { forgotten: true } }),
  component: ForgottenPage,
});

function ForgottenPage() {
  const memories = Route.useLoaderData();

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Annex"
        title="The Forgotten Room"
        line="A rotating exhibition of memories that have been sitting in the dark. It changes with the month."
      />
      <div className="mx-auto grid max-w-5xl gap-8 px-5 md:grid-cols-2 md:px-10">
        {memories.map((memory) => (
          <Link key={memory.id} to="/archive/$id" params={{ id: String(memory.id) }} className="block border-t border-ash pt-6 transition-[transform,color] duration-500 hover:translate-x-1">
            <p className="text-[10px] tracking-[0.28em] text-mist uppercase">{catalogNumber("ARCHIVE", memory.id)}</p>
            <h2 className="mt-3 font-display text-2xl">{memory.title}</h2>
            <p className="mt-3 text-sm text-mist">{excerpt(memory.content, 150)}</p>
          </Link>
        ))}
      </div>
    </MuseumShell>
  );
}
