import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { MuseumShell } from "@/components/museum/shell";
import { SafetyNote } from "@/components/museum/safety-note";
import { SplitTitle } from "@/components/museum/presence";
import { InView, Magnetic, easeOutExpo } from "@/components/museum/motion";
import { getMuseumStats } from "@/lib/museum/api";
import { ANNEXES, APP_TAGLINE, ROOMS } from "@/lib/museum/constants";

export const Route = createFileRoute("/hall")({
  loader: () => getMuseumStats(),
  component: Hall,
});

function Hall() {
  const stats = Route.useLoaderData();

  return (
    <MuseumShell>
      <section className="relative mx-auto max-w-3xl px-5 pt-6 pb-14 md:px-8 md:pt-10">
        <p className="text-[11px] tracking-[0.28em] text-gold uppercase">you can stay as long as you want</p>
        <SplitTitle
          text="Go wherever feels right."
          className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] md:text-6xl"
        />
        <motion.p
          className="mt-6 max-w-lg text-base leading-relaxed text-mist md:text-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: easeOutExpo }}
        >
          Nothing here is ranked. Nothing is a performance. {stats.artifacts} stories are already
          waiting. {APP_TAGLINE}
        </motion.p>
        <motion.div
          className="mt-9"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: easeOutExpo }}
        >
          <Magnetic>
            <Link
              to="/needed"
              className="inline-flex min-h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-paper transition-transform duration-150 hover:bg-gold-dim active:scale-[0.96]"
            >
              something I need to hear
            </Link>
          </Magnetic>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-3xl px-5 md:px-8">
        <p className="text-[11px] tracking-[0.28em] text-mist uppercase">rooms</p>
        <ol className="mt-5 space-y-3">
          {ROOMS.map((room) => (
            <li key={room.slug}>
              <InView>
                <Link
                  to={room.href}
                  className="group relative block overflow-hidden rounded-xl bg-ink-elevated px-6 py-7 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-border-hover)]"
                >
                  <span className="absolute top-3 right-5 font-display text-6xl text-gold/20">
                    {room.roman}
                  </span>
                  <p className="text-[11px] tracking-[0.28em] text-gold uppercase">
                    gallery {room.roman}
                  </p>
                  <h2 className="mt-2 pr-16 font-display text-3xl leading-tight text-paper transition-colors duration-300 group-hover:text-gold md:text-4xl">
                    {room.name.replace("The ", "")}
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-mist">{room.line}</p>
                  <span className="mt-4 inline-block text-sm text-gold transition-transform duration-300 group-hover:translate-x-1">
                    come in →
                  </span>
                </Link>
              </InView>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative mx-auto mt-16 max-w-3xl px-5 md:px-8">
        <p className="text-[11px] tracking-[0.28em] text-mist uppercase">also here</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {ANNEXES.map((room) => (
            <InView key={room.slug}>
              <Link
                to={room.href}
                className="block rounded-xl bg-ink-elevated px-5 py-6 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-border-hover)]"
              >
                <p className="font-display text-2xl">{room.name}</p>
                <p className="mt-2 text-sm text-mist">{room.line}</p>
              </Link>
            </InView>
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-16 max-w-3xl px-5 pb-8 md:px-8">
        <SafetyNote />
      </section>
    </MuseumShell>
  );
}
