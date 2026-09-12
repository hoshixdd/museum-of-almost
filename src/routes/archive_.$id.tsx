import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MuseumShell } from "@/components/museum/shell";
import { Letter } from "@/components/museum/letter";
import { Reactions } from "@/components/museum/reactions";
import { getMemory } from "@/lib/museum/api";

export const Route = createFileRoute("/archive_/$id")({
  loader: async ({ params }) => {
    const memory = await getMemory({ data: { id: Number(params.id) } });
    if (!memory) throw notFound();
    return memory;
  },
  component: MemoryPage,
});

function MemoryPage() {
  const memory = Route.useLoaderData();

  return (
    <MuseumShell>
      <div className="mx-auto max-w-3xl px-5 py-6 md:px-10">
        <Link to="/archive" className="text-[11px] tracking-[0.24em] text-mist uppercase hover:text-gold">
          Return to the archive
        </Link>
        <div className="mt-8">
          <Letter memory={memory} full />
        </div>
        <Reactions
          kind="memory"
          id={memory.id}
          counts={{
            needed: memory.neededCount,
            understand: memory.understandCount,
            reminded: memory.remindedCount,
          }}
        />
      </div>
    </MuseumShell>
  );
}
