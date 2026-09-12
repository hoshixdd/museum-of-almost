import { catalogNumber, formatLocation, formatYear } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Memory } from "@/lib/museum/types";

export function Letter({ memory, full = false }: { memory: Memory; full?: boolean }) {
  return (
    <article
      className={cn(
        "paper-sheet relative mx-auto w-full max-w-2xl px-8 py-10 md:px-12 md:py-14",
        full && "letter-open letter-fold",
      )}
      style={{ perspective: "1200px" }}
    >
      <p className="text-[11px] tracking-[0.28em] text-rust uppercase">
        {catalogNumber("ARCHIVE", memory.id)}
      </p>
      <h2 className="mt-4 font-display text-3xl leading-tight text-letter md:text-4xl">{memory.title}</h2>
      <p className="mt-3 text-xs tracking-[0.16em] text-letter/70 uppercase">
        {formatYear(memory.year)} · {formatLocation(memory.location)} · {memory.emotion}
      </p>
      <div className="hairline my-6" />
      <p
        className={
          full
            ? "font-display text-xl leading-[1.65] text-letter md:text-[1.4rem]"
            : "font-display text-lg leading-relaxed text-letter line-clamp-5"
        }
      >
        {memory.content}
      </p>
      <p className="mt-8 text-[11px] tracking-[0.18em] text-letter/55 uppercase">{memory.category}</p>
    </article>
  );
}
