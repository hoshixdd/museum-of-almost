import { useRef } from "react";
import { cn } from "@/lib/utils";

export function TiltCard({
  children,
  className,
  tilt = 0,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function reset() {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
  }

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    node.style.setProperty("--rx", `${(-py * 7).toFixed(2)}deg`);
    node.style.setProperty("--ry", `${(px * 9).toFixed(2)}deg`);
  }

  return (
    <div
      ref={ref}
      className={cn("paper-sheet paper-card", className)}
      style={{ ["--tilt" as string]: `${tilt}deg` }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
