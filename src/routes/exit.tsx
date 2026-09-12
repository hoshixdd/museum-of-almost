import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { Field, PrimaryButton, TextArea } from "@/components/museum/fields";
import { SafetyNote, CrisisPanel } from "@/components/museum/safety-note";
import { Reactions } from "@/components/museum/reactions";
import { createExitNote, listExitNotes } from "@/lib/museum/api";

export const Route = createFileRoute("/exit")({
  loader: () => listExitNotes(),
  component: ExitPage,
});

function ExitPage() {
  const notes = Route.useLoaderData();
  const router = useRouter();
  const [left, setLeft] = useState(false);
  const [crisis, setCrisis] = useState(false);

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Gallery VIII"
        title="The Exit Wall"
        line="Before you leave: what will you leave behind?"
      />
      <div className="mx-auto max-w-2xl px-5 md:px-10">
        {crisis ? (
          <CrisisPanel />
        ) : left ? (
          <div className="py-8 text-center">
            <p className="font-display text-3xl italic">Go gently. The rooms remain open.</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link to="/needed" className="text-[11px] tracking-[0.24em] text-gold uppercase">
                Explore another memory
              </Link>
              <Link to="/hall" className="text-[11px] tracking-[0.24em] text-mist uppercase">
                Return later through the hall
              </Link>
            </div>
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const result = await createExitNote({ data: { content: String(form.get("content") ?? "") } });
              if (!result.ok) {
                if (result.crisis) {
                  setCrisis(true);
                  return;
                }
                toast.error(result.error);
                return;
              }
              setLeft(true);
              void router.invalidate();
            }}
          >
            <SafetyNote compact />
            <Field label="Leave something">
              <TextArea name="content" required minLength={8} placeholder="A sentence you do not need to keep carrying." />
            </Field>
            <PrimaryButton>Leave this behind</PrimaryButton>
          </form>
        )}
        <div className="mt-16 space-y-6">
          {notes.map((note) => (
            <div key={note.id}>
              <p className="font-display text-lg text-paper/80">{note.content}</p>
              <Reactions kind="exit" id={note.id} />
            </div>
          ))}
        </div>
      </div>
    </MuseumShell>
  );
}
