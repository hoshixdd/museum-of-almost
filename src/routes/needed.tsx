import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { Letter } from "@/components/museum/letter";
import { Reactions } from "@/components/museum/reactions";
import { ShareBar } from "@/components/museum/share-bar";
import { GhostButton } from "@/components/museum/fields";
import { Rise } from "@/components/museum/motion";
import { getRandomMemory } from "@/lib/museum/api";
import { rememberNeededId, seenNeededIds } from "@/lib/museum/local";
import type { Memory } from "@/lib/museum/types";

export const Route = createFileRoute("/needed")({
  staleTime: 0,
  loader: () => getRandomMemory({ data: {} }),
  component: NeededPage,
});

function NeededPage() {
  const initial = Route.useLoaderData();
  const [memory, setMemory] = useState<Memory | null>(initial);

  useEffect(() => {
    if (memory) rememberNeededId(memory.id);
  }, [memory]);

  return (
    <MuseumShell>
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-10">
        <Rise>
          <p className="text-[11px] tracking-[0.4em] text-gold uppercase">Something I need to hear</p>
        </Rise>
        <Rise delay={0.08}>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Chosen without ranking.</h1>
        </Rise>
        <Rise delay={0.16}>
          <p className="mt-3 max-w-xl text-sm text-mist">
            This is not the most liked artifact. It is simply one that is here.
          </p>
        </Rise>
        {memory ? (
          <div className="mt-10">
            <Letter memory={memory} full />
            <ShareBar title={memory.title} path={`/archive/${memory.id}`} />
            <Reactions
              kind="memory"
              id={memory.id}
              counts={{
                needed: memory.neededCount,
                understand: memory.understandCount,
                reminded: memory.remindedCount,
              }}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <GhostButton
                onClick={async () => {
                  const next = await getRandomMemory({ data: { exclude: seenNeededIds() } });
                  if (next) setMemory(next);
                }}
              >
                Show me another
              </GhostButton>
              <Link
                to="/archive/$id"
                params={{ id: String(memory.id) }}
                className="inline-flex min-h-12 items-center text-sm text-gold"
              >
                Open this letter
              </Link>
            </div>
          </div>
        ) : (
          <p className="mt-12 text-mist">The drawers are empty tonight.</p>
        )}
      </div>
    </MuseumShell>
  );
}
