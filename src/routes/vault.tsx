import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { CapsuleForm } from "@/components/museum/forms";
import { GhostButton } from "@/components/museum/fields";
import { InView } from "@/components/museum/motion";
import { EmptyRoom } from "@/components/museum/empty-room";
import { listCapsules } from "@/lib/museum/api";
import { catalogNumber } from "@/lib/utils";

export const Route = createFileRoute("/vault")({
  loader: () => listCapsules(),
  component: VaultPage,
});

function VaultPage() {
  const capsules = Route.useLoaderData();
  const [compose, setCompose] = useState(false);

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Gallery III"
        title="The Time Vault"
        line="Public capsules can be seen and not opened. Private ones exist only as a locked hour."
        action={
          <GhostButton onClick={() => setCompose((value) => !value)}>
            {compose ? "Close" : "Seal a capsule"}
          </GhostButton>
        }
      />
      {compose ? (
        <div className="mx-auto mb-16 max-w-2xl px-5 md:px-10">
          <CapsuleForm />
        </div>
      ) : null}
      <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2 md:px-10">
        {capsules.map((capsule) => (
          <InView key={capsule.id}>
            <Link
              to="/vault/$id"
              params={{ id: String(capsule.id) }}
              className="vault-lock block rounded-lg bg-ink-elevated px-6 py-8 transition-[transform] duration-500 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
                  {catalogNumber("VAULT", capsule.id)}
                </p>
                {capsule.locked ? (
                  <Lock className="size-4 text-gold" strokeWidth={1.4} />
                ) : (
                  <Unlock className="size-4 text-gold" strokeWidth={1.4} />
                )}
              </div>
              <h2 className="mt-4 font-display text-2xl">{capsule.title}</h2>
              <p className="mt-3 text-sm text-mist">
                {capsule.privacy === "private"
                  ? "A sealed hour"
                  : `For ${String(capsule.recipient).toLowerCase()}`}{" "}
                · {capsule.locked ? `opens ${new Date(capsule.unlockAt).toLocaleDateString()}` : "open"}
              </p>
            </Link>
          </InView>
        ))}
      </div>
      {capsules.length === 0 ? (
        <div className="mx-auto mt-8 max-w-6xl px-5 md:px-10">
          <EmptyRoom line="The vault is empty." />
        </div>
      ) : null}
    </MuseumShell>
  );
}
