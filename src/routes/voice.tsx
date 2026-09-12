import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { VoiceForm } from "@/components/museum/forms";
import { GhostButton } from "@/components/museum/fields";
import { EmptyRoom } from "@/components/museum/empty-room";
import { listVoices } from "@/lib/museum/api";
import { VOICE_CATEGORIES } from "@/lib/museum/constants";
import { catalogNumber, formatDuration } from "@/lib/utils";

export const Route = createFileRoute("/voice")({
  loader: () => listVoices({ data: {} }),
  component: VoicePage,
});

function VoicePage() {
  const voices = Route.useLoaderData();
  const [compose, setCompose] = useState(false);
  const [category, setCategory] = useState("");
  const visible = category ? voices.filter((item) => item.category === category) : voices;

  return (
    <MuseumShell dense>
      <RoomHeader
        kicker="Gallery IV"
        title="The Voice Room"
        line="Spoken letters, read aloud in this browser. Nothing is recorded. Sit in the dark and listen to one at a time."
        action={
          <GhostButton onClick={() => setCompose((value) => !value)}>
            {compose ? "Close" : "Leave a spoken letter"}
          </GhostButton>
        }
      />
      {compose ? (
        <div className="mx-auto mb-16 max-w-2xl px-5 md:px-10">
          <VoiceForm />
        </div>
      ) : null}
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Voice categories">
          <button type="button" onClick={() => setCategory("")} className={`min-h-11 px-3 text-[11px] uppercase ${category ? "text-mist" : "text-gold"}`}>
            All
          </button>
          {VOICE_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`min-h-11 px-3 text-[11px] uppercase ${category === item ? "text-gold" : "text-mist"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <ul className="mt-10 divide-y divide-ash">
          {visible.map((voice) => (
            <li key={voice.id}>
              <Link to="/voice/$id" params={{ id: String(voice.id) }} className="flex items-baseline justify-between gap-4 py-6 transition-[transform] duration-500 hover:translate-x-1">
                <div>
                  <p className="text-[10px] tracking-[0.28em] text-gold uppercase">{catalogNumber("VOICE", voice.id)}</p>
                  <p className="mt-2 font-display text-2xl">{voice.title}</p>
                  <p className="mt-1 text-sm text-mist">{voice.category}</p>
                </div>
                <p className="text-sm tabular-nums text-mist">{formatDuration(voice.durationSec)}</p>
              </Link>
            </li>
          ))}
        </ul>
        {visible.length === 0 ? <EmptyRoom line="The room is quiet." /> : null}
      </div>
    </MuseumShell>
  );
}
