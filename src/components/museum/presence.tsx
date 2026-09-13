import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion as useMotionReduce } from "motion/react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "./motion";
import { hasSeenHallIntro, markHallIntro } from "@/lib/museum/local";

export function useReducedMotion() {
  const fromMotion = useMotionReduce();
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(media.matches);
    const onChange = () => setReduce(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return Boolean(fromMotion) || reduce;
}

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
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const trails = useRef<Array<HTMLDivElement | null>>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    const trail = [
      { x, y },
      { x, y },
      { x, y },
    ];
    let hover = false;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target as HTMLElement | null;
      hover = Boolean(target?.closest("a, button, [role='button']"));
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      trail[0].x += (rx - trail[0].x) * 0.22;
      trail[0].y += (ry - trail[0].y) * 0.22;
      trail[1].x += (trail[0].x - trail[1].x) * 0.2;
      trail[1].y += (trail[0].y - trail[1].y) * 0.2;
      trail[2].x += (trail[1].x - trail[2].x) * 0.18;
      trail[2].y += (trail[1].y - trail[2].y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        ring.current.classList.toggle("is-hover", hover);
      }
      trails.current.forEach((node, index) => {
        if (!node) return;
        node.style.transform = `translate3d(${trail[index].x}px, ${trail[index].y}px, 0)`;
        node.style.opacity = hover ? "0" : `${0.45 - index * 0.12}`;
      });
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else frame = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <>
      <div ref={dot} className="cursor-dot hidden md:block" aria-hidden="true" />
      <div ref={ring} className="cursor-ring hidden md:block" aria-hidden="true" />
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          ref={(node) => {
            trails.current[index] = node;
          }}
          className="cursor-trail hidden md:block"
          aria-hidden="true"
        />
      ))}
    </>
  );
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
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "covering" | "revealing">("idle");
  const first = useRef(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const offBefore = router.subscribe("onBeforeNavigate", () => {
      if (first.current) return;
      setPhase("covering");
    });
    const offRendered = router.subscribe("onRendered", () => {
      if (first.current) {
        first.current = false;
        return;
      }
      requestAnimationFrame(() => {
        setPhase("revealing");
        window.setTimeout(() => setPhase("idle"), 560);
      });
    });
    return () => {
      offBefore();
      offRendered();
    };
  }, [router, reduce]);

  if (reduce) return null;

  return (
    <div
      className={cn(
        "film-dissolve",
        phase === "covering" && "is-covering",
        phase === "revealing" && "is-revealing",
      )}
      aria-hidden="true"
    >
      <div className="letterbox top" />
      <div className="letterbox bottom" />
      <span className="film-mark">almost</span>
    </div>
  );
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
          initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: index * 0.07, duration: 0.72, ease: easeOutExpo }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
