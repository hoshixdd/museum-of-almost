import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { easeOutExpo } from "./motion";
import { hasSeenHallIntro, markHallIntro } from "@/lib/museum/local";
import { useReducedMotion } from "./reduced-motion";

export { useReducedMotion } from "./reduced-motion";

export function FilmGrain() {
  return <div className="film-grain" aria-hidden="true" />;
}

export function GallerySpot() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const onMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--spot-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--spot-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return <div className="gallery-spot" aria-hidden="true" />;
}

export function MuseumCursor() {
  return null;
}

export function ScrollProgress() {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? (window.scrollY / max) * 100 : 0;
      document.documentElement.style.setProperty("--scroll", `${value}%`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="progress-rail" aria-hidden="true">
      <span />
    </div>
  );
}

export function PageCurtain() {
  return null;
}

const ARRIVAL_CARDS = [
  { kicker: "lights down", line: "you can stay as long as you want." },
  { kicker: "a quiet house", line: "the museum of almost" },
  { kicker: "sit anywhere", line: "nothing here is a performance." },
];

export function ArrivalIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [card, setCard] = useState(0);

  useEffect(() => {
    if (reduce || hasSeenHallIntro()) return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      markHallIntro();
      return;
    }
    setShow(true);
  }, [reduce]);

  useEffect(() => {
    if (!show) return;
    if (card >= ARRIVAL_CARDS.length) {
      markHallIntro();
      const timer = window.setTimeout(() => setShow(false), 420);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setCard((value) => value + 1), 1100);
    return () => window.clearTimeout(timer);
  }, [show, card]);

  function skip() {
    markHallIntro();
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="arrival-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          role="dialog"
          aria-label="Entering the museum"
        >
          <div className="letterbox top" />
          <div className="letterbox bottom is-on" />
          <button type="button" className="arrival-skip" onClick={skip}>
            skip
          </button>
          <div className="arrival-stage">
            <AnimatePresence mode="wait">
              {card < ARRIVAL_CARDS.length ? (
                <motion.div
                  key={ARRIVAL_CARDS[card].line}
                  className="text-center"
                  initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: easeOutExpo }}
                >
                  <p className="text-[11px] tracking-[0.4em] text-gold uppercase">
                    {ARRIVAL_CARDS[card].kicker}
                  </p>
                  <p className="mt-4 font-display text-3xl text-paper italic md:text-5xl">
                    {ARRIVAL_CARDS[card].line}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SplitTitle({
  text,
  className,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block pr-[0.28em]"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.55, ease: easeOutExpo }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
