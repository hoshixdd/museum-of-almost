import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { LifeForm } from "@/components/museum/forms";
import { GhostButton } from "@/components/museum/fields";
import { InView } from "@/components/museum/motion";
import { EmptyRoom } from "@/components/museum/empty-room";
import { asOptions, OptionPicks } from "@/components/museum/option-picks";
import { listLives } from "@/lib/museum/api";
import { LIFE_CATEGORIES } from "@/lib/museum/constants";
import { catalogNumber, excerpt } from "@/lib/utils";

export const Route = createFileRoute("/lives")({
  loader: () => listLives({ data: {} }),
  component: LivesPage,
});

function LivesPage() {
  const lives = Route.useLoaderData();
  const [compose, setCompose] = useState(false);
  const [category, setCategory] = useState("");
  const visible = category ? lives.filter((item) => item.category === category) : lives;

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Gallery II"
        title="The Almost Lives"
        line="Parallel versions, written as if they had happened. Not better. Not worse. Adjacent."
        action={
          <GhostButton onClick={() => setCompose((value) => !value)}>
            {compose ? "Close" : "Leave a life"}
          </GhostButton>
        }
      />
      {compose ? (
        <div className="mx-auto mb-16 max-w-2xl px-5 md:px-10">
          <LifeForm />
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <OptionPicks
          label="Which almost"
          emptyLabel="all of them"
          allowEmpty
          value={category}
          onChange={setCategory}
          options={asOptions(LIFE_CATEGORIES)}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visible.map((life) => (
            <InView key={life.id}>
              <Link
                to="/lives/$id"
                params={{ id: String(life.id) }}
                className="block rounded-lg bg-ink-elevated px-6 py-7 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-border-hover)]"
              >
                <p className="text-[10px] tracking-[0.28em] text-gold uppercase">{catalogNumber("LIFE", life.id)}</p>
                <h2 className="mt-3 font-display text-2xl">{life.title}</h2>
                <p className="mt-2 text-[11px] tracking-[0.16em] text-mist uppercase">{life.category}</p>
                <p className="mt-4 text-sm leading-relaxed text-fog">{excerpt(life.story, 170)}</p>
              </Link>
            </InView>
          ))}
        </div>
        {visible.length === 0 ? <EmptyRoom line="No lives in this drawer yet." /> : null}
      </div>
    </MuseumShell>
  );
}
