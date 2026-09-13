import { useEffect, useState } from "react";
import { useReducedMotion as useMotionReduce } from "motion/react";

export function useReducedMotion() {
  const fromMotion = useMotionReduce();
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => setReduce(motion.matches || coarse.matches);
    update();
    motion.addEventListener("change", update);
    coarse.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);
  return Boolean(fromMotion) || reduce;
}