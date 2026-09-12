import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MuseumShell } from "@/components/museum/shell";
import { Reactions } from "@/components/museum/reactions";
import { Field, PrimaryButton, TextArea, TextInput } from "@/components/museum/fields";
import { getBook, updateBook } from "@/lib/museum/api";
import { getCode, rememberCode } from "@/lib/museum/local";
import { catalogNumber } from "@/lib/utils";

export const Route = createFileRoute("/library_/$id")({
  loader: async ({ params }) => {
    const stored = typeof window !== "undefined" ? getCode("book", Number(params.id)) : "";
    const book = await getBook({ data: { id: Number(params.id), editCode: stored || undefined } });
    if (!book) throw notFound();
    return book;
  },
  component: BookPage,
});

function BookPage() {
  const book = Route.useLoaderData();
  const [editing, setEditing] = useState(book.canEdit);
  const [code, setCode] = useState("");
  const chapters = [
    { key: "before", label: "Chapter 1 — Before", text: book.chapterBefore, name: "chapterBefore" },
    { key: "moment", label: "Chapter 2 — The Moment", text: book.chapterMoment, name: "chapterMoment" },
    { key: "change", label: "Chapter 3 — The Change", text: book.chapterChange, name: "chapterChange" },
    { key: "after", label: "Chapter 4 — After", text: book.chapterAfter, name: "chapterAfter" },
  ];

  return (
    <MuseumShell>
      <div className="mx-auto max-w-2xl px-5 py-8 md:px-10">
        <Link to="/library" className="text-[11px] tracking-[0.24em] text-mist uppercase hover:text-gold">
          Return to the stacks
        </Link>
        <p className="mt-10 text-[11px] tracking-[0.32em] text-gold uppercase">{catalogNumber("BOOK", book.id)}</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">{book.title}</h1>
        {editing ? (
          <form
            className="mt-10 space-y-5"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const stored = getCode("book", book.id);
              const result = await updateBook({
                data: {
                  id: book.id,
                  editCode: stored,
                  title: String(form.get("title") ?? book.title),
                  chapterBefore: String(form.get("chapterBefore") ?? ""),
                  chapterMoment: String(form.get("chapterMoment") ?? ""),
                  chapterChange: String(form.get("chapterChange") ?? ""),
                  chapterAfter: String(form.get("chapterAfter") ?? ""),
                },
              });
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast("The book was quietly updated.");
            }}
          >
            <Field label="Title">
              <TextInput name="title" defaultValue={book.title} />
            </Field>
            {chapters.map((chapter) => (
              <Field key={chapter.key} label={chapter.label}>
                <TextArea name={chapter.name} defaultValue={chapter.text} />
              </Field>
            ))}
            <PrimaryButton>Save chapters</PrimaryButton>
          </form>
        ) : (
          <div className="mt-12 space-y-12">
            {chapters.map((chapter) => (
              <section key={chapter.key}>
                <p className="text-[10px] tracking-[0.28em] text-gold uppercase">{chapter.label}</p>
                <p className="mt-3 font-display text-xl leading-relaxed">
                  {chapter.text || <span className="text-mist">This chapter is still unwritten.</span>}
                </p>
              </section>
            ))}
          </div>
        )}
        {!editing ? (
          <form
            className="mt-12 flex flex-col gap-3 sm:flex-row"
            onSubmit={async (event) => {
              event.preventDefault();
              const result = await getBook({ data: { id: book.id, editCode: code } });
              if (result?.canEdit) {
                rememberCode("book", book.id, code);
                setEditing(true);
              } else {
                toast.error("That library card does not open this book.");
              }
            }}
          >
            <TextInput value={code} onChange={(event) => setCode(event.target.value)} placeholder="Library card to continue writing" />
            <PrimaryButton>Continue this book</PrimaryButton>
          </form>
        ) : null}
        <Reactions kind="book" id={book.id} />
      </div>
    </MuseumShell>
  );
}
