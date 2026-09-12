import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MuseumShell } from "@/components/museum/shell";
import { Reactions } from "@/components/museum/reactions";
import { ShareBar } from "@/components/museum/share-bar";
import { getLife } from "@/lib/museum/api";
import { APP_NAME } from "@/lib/museum/constants";
import { catalogNumber, excerpt, formatLocation } from "@/lib/utils";

export const Route = createFileRoute("/lives_/$id")({
  loader: async ({ params }) => {
    const life = await getLife({ data: { id: Number(params.id) } });
    if (!life) throw notFound();
    return life;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Almost life"} — ${APP_NAME}` },
      { name: "description", content: excerpt(loaderData?.story ?? "", 140) },
    ],
  }),
  component: LifePage,
});

function LifePage() {
  const life = Route.useLoaderData();
  const facts = [
    life.age ? `Age ${life.age}` : null,
    life.location ? formatLocation(life.location) : null,
    life.career,
    life.relationship,
  ].filter(Boolean);

  return (
    <MuseumShell>
      <div className="mx-auto max-w-3xl px-5 py-8 md:px-10">
        <Link to="/lives" className="text-[11px] tracking-[0.24em] text-mist uppercase hover:text-gold">
          Return to almost lives
        </Link>
        <p className="mt-10 text-[11px] tracking-[0.32em] text-gold uppercase">{catalogNumber("LIFE", life.id)}</p>
        <h1 className="mt-4 font-display text-4xl md:text-6xl">{life.title}</h1>
        <p className="mt-3 text-[12px] tracking-[0.2em] text-mist uppercase">{life.category}</p>
        <ul className="mt-8 space-y-2 text-sm text-fog">
          {facts.map((fact) => (
            <li key={String(fact)}>{fact}</li>
          ))}
          {life.dream ? <li className="italic">Dream: {life.dream}</li> : null}
        </ul>
        <div className="hairline my-8" />
        <p className="font-display text-xl leading-relaxed md:text-2xl">{life.story}</p>
        <ShareBar title={life.title} path={`/lives/${life.id}`} />
        <Reactions
          kind="life"
          id={life.id}
          counts={{
            needed: life.neededCount,
            understand: life.understandCount,
            reminded: life.remindedCount,
          }}
        />
      </div>
    </MuseumShell>
  );
}
