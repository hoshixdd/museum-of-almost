import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-paper">
      <p className="text-[11px] tracking-[0.4em] text-gold uppercase">Misplaced</p>
      <h1 className="mt-4 font-display text-4xl">This room does not exist.</h1>
      <a href="/hall" className="mt-8 text-[11px] tracking-[0.28em] text-mist uppercase hover:text-gold">
        Return to the hall
      </a>
    </main>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFound,
    defaultViewTransition: true,
  });
}
