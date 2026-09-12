import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Atmosphere } from "@/components/museum/atmosphere";
import { FilmGrain, GallerySpot, MuseumCursor, useReducedMotion } from "@/components/museum/presence";
import { Magnetic, easeOutExpo } from "@/components/museum/motion";
import { markEnteredMuseum } from "@/lib/museum/local";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Entrance });

const WHISPERS = [
  "the texts you never sent.",
  "the lives you almost lived.",
  "the words that stayed in drafts.",
  "you're allowed to leave them here.",
];

function Entrance() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(reduce);
  const [whisper, setWhisper] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (reduce) {
      setReady(true);
      return;
    }
    const timer = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setWhisper((current) => (current + 1) % WHISPERS.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [reduce]);

  function enter() {
    if (reduce) {
      markEnteredMuseum();
      void navigate({ to: "/hall" });
      return;
    }
    setLeaving(true);
    window.setTimeout(() => {
      markEnteredMuseum();
      void navigate({ to: "/hall" });
    }, 880);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-5 text-center">
      <Atmosphere dense />
      <GallerySpot />
      <FilmGrain />
      <MuseumCursor />
      <div className="ember-glow" aria-hidden="true" />
      <div className={cn("enter-bloom", leaving && "is-flooding")} aria-hidden="true" />

      <button
        type="button"
        onClick={() => {
          markEnteredMuseum();
          void navigate({ to: "/hall" });
        }}
        className="absolute top-6 right-6 z-20 min-h-11 text-sm text-mist transition-colors duration-300 hover:text-paper"
      >
        skip
      </button>

      <motion.div
        className="note-card relative z-10 w-full max-w-md rounded-xl bg-paper px-8 py-12 text-letter md:px-10 md:py-14"
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.15 }}
      >
        <p className="text-[11px] tracking-[0.32em] text-gold uppercase">a quiet place</p>
        <h1 className="mt-5 font-display leading-[0.92]">
          <span className="block text-2xl italic text-letter/70">the</span>
          <span className="mt-1 block text-5xl tracking-[-0.04em] md:text-6xl">museum</span>
          <span className="mt-1 block text-3xl italic text-gold">of almost</span>
        </h1>
        <p className="mt-6 text-base leading-relaxed text-letter/70">
          For the drafts, the almosts, and the things you still carry.
        </p>
        <div className="mt-5 h-7">
          <AnimatePresence mode="wait">
            <motion.p
              key={WHISPERS[whisper]}
              className="font-display text-lg text-letter/80 italic"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
            >
              {WHISPERS[whisper]}
            </motion.p>
          </AnimatePresence>
        </div>
        <motion.div
          className="mt-10"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          <Magnetic>
            <button
              type="button"
              onClick={enter}
              className="inline-flex min-h-12 items-center rounded-full bg-gold px-9 text-sm font-semibold tracking-wide text-paper transition-transform duration-150 hover:bg-gold-dim active:scale-[0.96]"
            >
              come in
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>
    </main>
  );
}
