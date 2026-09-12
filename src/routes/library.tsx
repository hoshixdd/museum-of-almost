import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { BookForm } from "@/components/museum/forms";
import { GhostButton } from "@/components/museum/fields";
import { InView } from "@/components/museum/motion";
import { EmptyRoom } from "@/components/museum/empty-room";
import { listBooks } from "@/lib/museum/api";
import { catalogNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({
  loader: () => listBooks(),
  component: LibraryPage,
});

function LibraryPage() {
  const books = Route.useLoaderData();
  const [compose, setCompose] = useState(false);

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Gallery V"
        title="The Human Library"
        line="Every person becomes a book. Four chapters. No author name on the spine. Write at least two before placing it."
        action={
          <GhostButton onClick={() => setCompose((value) => !value)}>
            {compose ? "Close" : "Begin a book"}
          </GhostButton>
        }
      />
      {compose ? (
        <div className="mx-auto mb-16 max-w-2xl px-5 md:px-10">
          <BookForm />
        </div>
      ) : null}
      <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-3 md:px-10">
        {books.map((book, index) => (
          <InView key={book.id}>
            <Link
              to="/library/$id"
              params={{ id: String(book.id) }}
              className={cn(
                "flex min-h-56 flex-col justify-between rounded-md bg-ink-elevated px-5 py-6 shadow-[var(--shadow-border)]",
                "transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-border-hover)]",
                index % 2 === 0 ? "border-l-2 border-l-gold" : "border-l-2 border-l-paper",
              )}
            >
              <div>
                <p className="text-[10px] tracking-[0.28em] text-gold uppercase">{catalogNumber("BOOK", book.id)}</p>
                <h2 className="mt-4 font-display text-2xl leading-snug">{book.title}</h2>
              </div>
              <p className="text-[11px] tracking-[0.16em] text-mist uppercase">Four chapters</p>
            </Link>
          </InView>
        ))}
      </div>
      {books.length === 0 ? (
        <div className="mx-auto mt-8 max-w-6xl px-5 md:px-10">
          <EmptyRoom line="The stacks are empty." />
        </div>
      ) : null}
    </MuseumShell>
  );
}
