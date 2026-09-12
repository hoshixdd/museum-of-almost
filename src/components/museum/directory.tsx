import { Link } from "@tanstack/react-router";
import { ANNEXES, ROOMS } from "@/lib/museum/constants";
import { Rise } from "./motion";

export function Directory({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-20">
      <Rise>
        <p className="text-[11px] tracking-[0.32em] text-gold uppercase">map</p>
      </Rise>
      <Rise delay={0.08}>
        <h2 className="mt-3 font-display text-4xl md:text-6xl">pick a room</h2>
      </Rise>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <ol className="space-y-1">
          {ROOMS.map((room, index) => (
            <li key={room.slug}>
              <Rise delay={0.1 + index * 0.04}>
                <Link to={room.href} onClick={onNavigate} className="group block rounded-lg py-3">
                  <p className="text-[10px] tracking-[0.28em] text-mist uppercase">
                    gallery {room.roman}
                  </p>
                  <p className="font-display text-2xl text-paper transition-colors duration-300 group-hover:text-gold md:text-3xl">
                    {room.name.replace("The ", "")}
                  </p>
                  <p className="mt-1 text-sm text-mist">{room.line}</p>
                </Link>
              </Rise>
            </li>
          ))}
        </ol>
        <div>
          <p className="text-[10px] tracking-[0.28em] text-mist uppercase">also here</p>
          <ul className="mt-3 space-y-1">
            {ANNEXES.map((room, index) => (
              <li key={room.slug}>
                <Rise delay={0.16 + index * 0.05}>
                  <Link to={room.href} onClick={onNavigate} className="group block rounded-lg py-3">
                    <p className="font-display text-2xl text-paper transition-colors duration-300 group-hover:text-gold">
                      {room.name}
                    </p>
                    <p className="mt-1 text-sm text-mist">{room.line}</p>
                  </Link>
                </Rise>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
