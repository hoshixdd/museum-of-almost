import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "This room closed unexpectedly. Try another door, or come back in a moment.";

export function AppErrorComponent(_props: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-paper">
      <span className="text-gold" aria-hidden="true">
        <TriangleAlert className="size-8" strokeWidth={1.5} />
      </span>
      <h1 className="font-display text-3xl font-medium">This room is closed</h1>
      <p className="max-w-md text-sm leading-relaxed text-mist">{FALLBACK_MESSAGE}</p>
      <a href="/hall" className="mt-2 text-sm text-gold">
        Return to the hall
      </a>
    </main>
  );
}
