import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { motion, useReducedMotion as useMotionReduce } from "motion/react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "./motion";

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
      setPhase("revealing");
      window.setTimeout(() => setPhase("idle"), 740);
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
        "page-curtain",
        phase === "covering" && "is-covering",
        phase === "revealing" && "is-revealing",
      )}
      aria-hidden="true"
    >
      <div className="curtain-leaf left" />
      <div className="curtain-leaf right" />
    </div>
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
