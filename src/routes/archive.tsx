import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { MemoryForm } from "@/components/museum/forms";
import { GhostButton } from "@/components/museum/fields";
import { TiltCard } from "@/components/museum/tilt-card";
import { InView } from "@/components/museum/motion";
import { EmptyRoom } from "@/components/museum/empty-room";
import { listMemories } from "@/lib/museum/api";
import { EMOTIONS, MEMORY_CATEGORIES } from "@/lib/museum/constants";
import { catalogNumber, excerpt, formatLocation, formatYear } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/archive")({
  loader: () => listMemories({ data: {} }),
  component: ArchivePage,
});

function ArchivePage() {
  const memories = Route.useLoaderData();
  const [emotion, setEmotion] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [compose, setCompose] = useState(false);

  const visible = useMemo(() => {
    return memories.filter((item) => {
      if (emotion && item.emotion !== emotion) return false;
      if (category && item.category !== category) return false;
      if (query) {
        const hay = `${item.title} ${item.content} ${item.location ?? ""}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [memories, emotion, category, query]);

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Gallery I"
        title="The Unsent Archive"
        line="Messages written and never sent. Read them as artifacts, not as a feed."
        action={
          <GhostButton onClick={() => setCompose((value) => !value)}>
            {compose ? "Close the desk" : "Leave a letter"}
          </GhostButton>
        }
      />
      {compose ? (
        <div className="museum-rise mx-auto mb-16 max-w-2xl px-5 md:px-10">
          <div className="paper-sheet letter-open px-6 py-8 md:px-10 md:py-10">
            <MemoryForm paper />
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <label className="flex-1">
            <span className="sr-only">Search the catalog</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the catalog…"
              className="min-h-11 w-full rounded-md bg-ink-elevated px-4 text-sm shadow-[var(--shadow-border)] outline-none placeholder:text-mist focus:shadow-[var(--shadow-border-hover)]"
            />
          </label>
          <label>
            <span className="sr-only">Emotion</span>
            <select
              value={emotion}
              onChange={(event) => setEmotion(event.target.value)}
              className="min-h-11 rounded-md bg-ink-elevated px-3 text-sm shadow-[var(--shadow-border)]"
            >
              <option value="">All emotions</option>
              {EMOTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-h-11 rounded-md bg-ink-elevated px-3 text-sm shadow-[var(--shadow-border)]"
            >
              <option value="">All categories</option>
              {MEMORY_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-6 text-[11px] tracking-[0.2em] text-mist uppercase">{visible.length} artifacts</p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {visible.map((memory, index) => (
            <InView key={memory.id} className={cn("block", index % 2 === 1 ? "md:mt-10" : "")}>
              <Link to="/archive/$id" params={{ id: String(memory.id) }} className="block">
                <TiltCard className="px-7 py-8" tilt={((memory.id % 5) - 2) * 0.7}>
                  <p className="text-[11px] tracking-[0.24em] text-rust uppercase">
                    {catalogNumber("ARCHIVE", memory.id)}
                  </p>
                  <h2 className="mt-3 font-display text-2xl text-letter">{memory.title}</h2>
                  <p className="mt-2 text-[11px] tracking-[0.14em] text-letter/55 uppercase">
                    {formatYear(memory.year)} · {formatLocation(memory.location)}
                  </p>
                  <p className="mt-4 font-display text-base leading-relaxed text-letter/90">
                    {excerpt(memory.content, 180)}
                  </p>
                </TiltCard>
              </Link>
            </InView>
          ))}
        </div>
        {visible.length === 0 ? (
          <EmptyRoom line="Nothing in this drawer." action="Leave the first letter" href="/archive" />
        ) : null}
      </div>
    </MuseumShell>
  );
}
