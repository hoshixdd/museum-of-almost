import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setVeil(true));
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDirectory();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeDirectory() {
    setVeil(false);
    window.setTimeout(() => {
      setOpen(false);
      menuRef.current?.focus();
    }, 380);
  }

  return (
    <div className="relative min-h-screen bg-ink text-paper">
      <a
        href="#museum-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to rooms
      </a>
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
          <span className="mr-1.5 text-gold not-italic">♡</span>
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Rooms">
          {ROOMS.slice(0, 6).map((room) => (
            <Link
              key={room.slug}
              to={room.href}
              className={cn(
                "relative text-sm transition-colors duration-300",
                pathname.startsWith(room.href)
                  ? "text-gold after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-gold/80"
                  : "text-mist hover:text-paper",
              )}
            >
              {room.name.replace("The ", "")}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/needed"
            className="inline-flex min-h-10 items-center rounded-full bg-gold/15 px-4 text-sm text-gold transition-colors duration-300 hover:bg-gold hover:text-ink"
          >
            need to hear
          </Link>
          <button
            ref={menuRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-paper transition-transform duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-gold/80"
            aria-label="Open directory"
            aria-expanded={open}
            aria-controls="museum-directory"
          >
            <Menu className="size-5" strokeWidth={1.6} />
          </button>
        </div>
      </header>
      <main id="museum-main" className="relative z-10">
        {children}
      </main>
      <footer className="relative z-10 mt-20 border-t border-ash px-5 py-12 text-center md:px-8">
        <p className="font-display text-2xl text-paper/85 italic">leave something. or just sit.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-mist">
          <Link to="/desk" className="transition-colors duration-200 hover:text-paper">
            your desk
          </Link>
          <Link to="/kept" className="transition-colors duration-200 hover:text-paper">
            kept
          </Link>
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
        <div
          id="museum-directory"
          role="dialog"
          aria-modal="true"
          aria-label="Directory"
          className={cn("directory-veil fixed inset-0 z-50", veil && "open")}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={closeDirectory}
            className="absolute top-5 right-5 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-paper focus-visible:ring-2 focus-visible:ring-gold/80"
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
