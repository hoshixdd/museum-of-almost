import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { APP_NAME, ROOMS } from "@/lib/museum/constants";
import { cn } from "@/lib/utils";
import { Atmosphere } from "./atmosphere";
import { Directory } from "./directory";
import { FilmGrain, GallerySpot, MuseumCursor, ScrollProgress } from "./presence";

export function MuseumShell({
  children,
  dense = false,
}: {
  children: React.ReactNode;
  dense?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [veil, setVeil] = useState(false);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setVeil(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function closeDirectory() {
    setVeil(false);
    window.setTimeout(() => setOpen(false), 380);
  }

  return (
    <div className="relative min-h-screen bg-ink text-paper">
      <Atmosphere dense={dense} />
      <GallerySpot />
      <FilmGrain />
      <MuseumCursor />
      <ScrollProgress />
      <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-5 md:px-8">
        <Link
          to="/hall"
          className="font-display text-sm tracking-wide text-paper/80 italic transition-colors duration-300 hover:text-gold"
        >
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {ROOMS.slice(0, 4).map((room) => (
            <Link
              key={room.slug}
              to={room.href}
              className={cn(
                "text-sm transition-colors duration-300",
                pathname.startsWith(room.href) ? "text-gold" : "text-mist hover:text-paper",
              )}
            >
              {room.name.replace("The ", "")}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/needed"
            className="hidden min-h-10 items-center rounded-full bg-gold/15 px-4 text-sm text-gold transition-colors duration-300 hover:bg-gold hover:text-paper sm:inline-flex"
          >
            need to hear
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-paper transition-transform duration-150 active:scale-[0.96]"
            aria-label="Open directory"
          >
            <Menu className="size-5" strokeWidth={1.6} />
          </button>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
      <footer className="relative z-10 mt-20 border-t border-ash px-5 py-12 text-center md:px-8">
        <p className="font-display text-2xl text-paper/85 italic">leave something. or just sit.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-mist">
          <Link to="/safety" className="transition-colors duration-200 hover:text-paper">
            safety
          </Link>
          <Link to="/guidelines" className="transition-colors duration-200 hover:text-paper">
            guidelines
          </Link>
          <Link to="/terms" className="transition-colors duration-200 hover:text-paper">
            terms
          </Link>
          <Link to="/privacy" className="transition-colors duration-200 hover:text-paper">
            privacy
          </Link>
          <Link to="/exit" className="transition-colors duration-200 hover:text-paper">
            exit
          </Link>
        </div>
      </footer>
      {open ? (
        <div className={cn("directory-veil fixed inset-0 z-50", veil && "open")}>
          <button
            type="button"
            onClick={closeDirectory}
            className="absolute top-5 right-5 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-paper"
            aria-label="Close directory"
          >
            <X className="size-5" strokeWidth={1.6} />
          </button>
          <Directory onNavigate={closeDirectory} />
        </div>
      ) : null}
    </div>
  );
}
