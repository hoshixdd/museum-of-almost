import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { EmptyRoom } from "@/components/museum/empty-room";
import { Field, PrimaryButton, TextInput } from "@/components/museum/fields";
import { shredArtifact } from "@/lib/museum/api";
import { forgetClaim, listClaims } from "@/lib/museum/local";

export const Route = createFileRoute("/desk")({
  component: DeskPage,
});

function hrefFor(kind: string, id: number) {
  if (kind === "memory") return `/archive/${id}`;
  if (kind === "life") return `/lives/${id}`;
  if (kind === "voice") return `/voice/${id}`;
  if (kind === "book") return `/library/${id}`;
  if (kind === "capsule" || kind === "capsule-key") return `/vault/${id}`;
  if (kind === "wall") return `/wall`;
  return "/hall";
}

function DeskPage() {
  const [claims, setClaims] = useState(() => listClaims());
  const [code, setCode] = useState("");
  const visible = useMemo(
    () => claims.filter((item) => item.kind !== "capsule-key" || !claims.some((other) => other.kind === "capsule" && other.id === item.id)),
    [claims],
  );

  return (
    <MuseumShell>
      <RoomHeader
        kicker="This device"
        title="Your desk"
        line="Claim slips live in this browser. Copy them. Screenshot them. We cannot recover a lost slip."
      />
      <div className="mx-auto max-w-2xl space-y-6 px-5 md:px-10">
        {visible.map((claim) => (
          <article key={`${claim.kind}-${claim.id}`} className="rounded-xl bg-ink-elevated px-5 py-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] tracking-[0.24em] text-gold uppercase">{claim.kind}</p>
            <h2 className="mt-2 font-display text-2xl">{claim.title || `Piece ${claim.id}`}</h2>
            <p className="mt-3 font-mono text-sm text-fog">{claim.code}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href={hrefFor(claim.kind, claim.id)} className="text-gold">
                Open
              </a>
              <button
                type="button"
                className="text-mist hover:text-paper"
                onClick={async () => {
                  const kind = claim.kind === "capsule-key" ? "capsule" : claim.kind;
                  if (kind !== "memory" && kind !== "life" && kind !== "voice" && kind !== "book" && kind !== "wall" && kind !== "capsule") {
                    return;
                  }
                  const result = await shredArtifact({ data: { kind, id: claim.id, code: claim.code } });
                  if (!result.ok) {
                    toast.error(result.error);
                    return;
                  }
                  forgetClaim(claim.kind, claim.id);
                  setClaims(listClaims());
                  toast("Shredded. It will leave the rooms.");
                }}
              >
                Shred
              </button>
            </div>
          </article>
        ))}
        {visible.length === 0 ? <EmptyRoom line="No claim slips on this phone yet." action="Leave a letter" href="/archive" /> : null}

        <form
          className="space-y-4 pt-8"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const kind = String(form.get("kind") ?? "memory") as "memory" | "life" | "voice" | "book" | "wall" | "capsule";
            const id = Number(form.get("id"));
            const result = await shredArtifact({ data: { kind, id, code } });
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            forgetClaim(kind, id);
            setClaims(listClaims());
            toast("Shredded.");
          }}
        >
          <p className="text-sm text-mist">Have a slip from another phone? Shred from here.</p>
          <Field label="Kind">
            <select name="kind" className="min-h-11 w-full rounded-lg bg-ink-elevated px-3 text-sm">
              <option value="memory">Letter</option>
              <option value="life">Life</option>
              <option value="voice">Voice</option>
              <option value="book">Book</option>
              <option value="wall">Wall</option>
              <option value="capsule">Capsule</option>
            </select>
          </Field>
          <Field label="Catalog number">
            <TextInput name="id" type="number" required placeholder="31" />
          </Field>
          <Field label="Claim slip">
            <TextInput value={code} onChange={(event) => setCode(event.target.value)} required placeholder="MUSEUM-…" />
          </Field>
          <PrimaryButton>Shred this piece</PrimaryButton>
        </form>
        <p className="text-sm text-mist">
          Looking for letters you kept instead? <Link to="/kept" className="text-gold">Open Kept</Link>.
        </p>
      </div>
    </MuseumShell>
  );
}
