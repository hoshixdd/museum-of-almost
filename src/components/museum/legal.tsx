import { Link } from "@tanstack/react-router";
import { MuseumShell } from "./shell";

export function LegalPage({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <MuseumShell>
      <article className="mx-auto max-w-2xl px-5 py-8 md:px-10">
        <p className="text-[11px] tracking-[0.32em] text-gold uppercase">{kicker}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{title}</h1>
        <div className="mt-10 space-y-5 text-sm leading-relaxed text-fog [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-paper [&_a]:text-gold">
          {children}
        </div>
        <p className="mt-12 text-[11px] tracking-[0.2em] text-mist uppercase">
          <Link to="/hall">Return to the hall</Link>
        </p>
      </article>
    </MuseumShell>
  );
}
