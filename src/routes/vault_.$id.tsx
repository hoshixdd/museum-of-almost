import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { Field, PrimaryButton, TextInput } from "@/components/museum/fields";
import { getCapsule } from "@/lib/museum/api";
import { getCode } from "@/lib/museum/local";
import { catalogNumber } from "@/lib/utils";

export const Route = createFileRoute("/vault_/$id")({
  loader: async ({ params }) => {
    const stored = typeof window !== "undefined" ? getCode("capsule", Number(params.id)) : "";
    const result = await getCapsule({ data: { id: Number(params.id), accessCode: stored || undefined } });
    if (!result.ok) throw notFound();
    return result.capsule;
  },
  component: CapsulePage,
});

function CapsulePage() {
  const initial = Route.useLoaderData();
  const [capsule, setCapsule] = useState(initial);
  const [code, setCode] = useState("");
  const remaining = useMemo(() => new Date(capsule.unlockAt).getTime() - Date.now(), [capsule.unlockAt]);
  const locked = remaining > 0;

  async function unlockPrivate() {
    const result = await getCapsule({ data: { id: capsule.id, accessCode: code } });
    if (result.ok) setCapsule(result.capsule);
  }

  return (
    <MuseumShell>
      <div className="mx-auto max-w-2xl px-5 py-10 md:px-10">
        <Link to="/vault" className="text-[11px] tracking-[0.24em] text-mist uppercase hover:text-gold">
          Return to the vault
        </Link>
        <p className="mt-10 text-[11px] tracking-[0.32em] text-gold uppercase">{catalogNumber("VAULT", capsule.id)}</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">{capsule.title}</h1>
        <p className="mt-3 text-sm text-mist">
          For {capsule.recipient.toLowerCase()} · {capsule.privacy}
        </p>
        {locked ? (
          <div className="mt-12 rounded-lg bg-ink-elevated px-6 py-10 text-center vault-lock">
            <p className="text-[11px] tracking-[0.3em] text-gold uppercase">Sealed</p>
            <p className="mt-4 font-display text-3xl tabular-nums">
              {formatCountdown(remaining)}
            </p>
            <p className="mt-3 text-sm text-mist">
              Opens {new Date(capsule.unlockAt).toLocaleString()}
            </p>
          </div>
        ) : capsule.content ? (
          <div className="paper-sheet mt-12 px-8 py-10">
            <p className="text-[11px] tracking-[0.28em] text-gold-dim uppercase">Opening</p>
            <p className="mt-5 font-display text-xl leading-relaxed text-letter">{capsule.content}</p>
          </div>
        ) : (
          <form
            className="mt-12 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void unlockPrivate();
            }}
          >
            <p className="text-sm text-mist">This capsule is private. Enter the key issued when it was sealed.</p>
            <Field label="Access key">
              <TextInput value={code} onChange={(event) => setCode(event.target.value)} placeholder="MUSEUM-XXXX" />
            </Field>
            <PrimaryButton>Open</PrimaryButton>
          </form>
        )}
      </div>
    </MuseumShell>
  );
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "Open";
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}
