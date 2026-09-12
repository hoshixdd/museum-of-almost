import { cn } from "@/lib/utils";
import { Magnetic } from "./motion";

type Tone = "ink" | "paper";

function fieldClass(tone: Tone | undefined, extra?: string) {
  return cn(
    "min-h-11 w-full rounded-lg px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold/80",
    tone === "paper"
      ? "input-paper"
      : "bg-ink-elevated text-paper shadow-[var(--shadow-border)] placeholder:text-mist/70 focus:shadow-[var(--shadow-border-hover)]",
    "transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    extra,
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] tracking-[0.2em] text-gold uppercase">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({
  tone,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { tone?: Tone }) {
  return <input {...props} className={cn(fieldClass(tone), props.className)} />;
}

export function TextArea({
  tone,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { tone?: Tone }) {
  return (
    <textarea
      {...props}
      className={cn(fieldClass(tone, "min-h-36 py-3 leading-relaxed"), props.className)}
    />
  );
}

export function SelectInput({
  tone,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { tone?: Tone }) {
  return (
    <select
      {...props}
      className={cn(fieldClass(tone, "px-3"), "color-scheme-inherit", props.className)}
    />
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Magnetic>
      <button
        type="submit"
        {...props}
        className={cn(
          "inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-ink",
          "transition-[transform,background-color] duration-150 ease-out hover:bg-gold-dim active:scale-[0.96] disabled:opacity-50",
          props.className,
        )}
      >
        {children}
      </button>
    </Magnetic>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: string }) {
  return (
    <Magnetic className="inline-block">
      <button type="button" {...props} className={cn("ghost-pill", props.className)}>
        {children}
      </button>
    </Magnetic>
  );
}
