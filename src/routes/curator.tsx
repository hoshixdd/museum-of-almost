import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { Field, PrimaryButton, TextArea } from "@/components/museum/fields";
import { SafetyNote } from "@/components/museum/safety-note";
import { askCurator } from "@/lib/museum/api";
import type { CuratorReply } from "@/lib/museum/types";

export const Route = createFileRoute("/curator")({
  component: CuratorPage,
});

type Turn = { role: "user" | "curator"; text: string; matches?: Extract<CuratorReply, { ok: true }>["matches"] };

function CuratorPage() {
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "curator",
      text: "I am not a doctor and I am not here to fix you. Tell me, quietly, what you are carrying, and I will try to find a room or a story that belongs beside it.",
    },
  ]);
  const [pending, setPending] = useState(false);

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Annex"
        title="The Curator"
        line="An attendant who helps you discover stories. Not therapy. Not advice. A matching of experience."
      />
      <div className="mx-auto max-w-2xl px-5 md:px-10">
        <SafetyNote compact />
        <div className="mt-10 space-y-8">
          {turns.map((turn, index) => (
            <div key={`${turn.role}-${index}`}>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
                {turn.role === "curator" ? "The Curator" : "Visitor"}
              </p>
              <p className="mt-2 font-display text-xl leading-relaxed">{turn.text}</p>
              {turn.matches?.length ? (
                <ul className="mt-4 space-y-2">
                  {turn.matches.map((match) => (
                    <li key={match.id}>
                      <Link to="/archive/$id" params={{ id: String(match.id) }} className="text-sm text-gold">
                        {match.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
        <form
          className="mt-10 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            const message = String(data.get("message") ?? "").trim();
            if (!message) return;
            setTurns((current) => [...current, { role: "user", text: message }]);
            form.reset();
            setPending(true);
            const history = turns
              .slice(-6)
              .map((turn) => ({ role: turn.role, text: turn.text }));
            const result = await askCurator({ data: { message, history } });
            setPending(false);
            if (!result.ok) {
              setTurns((current) => [...current, { role: "curator", text: result.error }]);
              return;
            }
            setTurns((current) => [...current, { role: "curator", text: result.text, matches: result.matches }]);
          }}
        >
          <Field label="What are you carrying?">
            <TextArea name="message" required maxLength={500} placeholder="A feeling, a city, a kind of almost." className="min-h-24" />
          </Field>
          <PrimaryButton disabled={pending}>{pending ? "Listening…" : "Ask the Curator"}</PrimaryButton>
        </form>
      </div>
    </MuseumShell>
  );
}
