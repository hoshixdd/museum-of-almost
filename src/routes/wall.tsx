import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MuseumShell } from "@/components/museum/shell";
import { RoomHeader } from "@/components/museum/room-header";
import { WallForm } from "@/components/museum/forms";
import { GhostButton, TextInput } from "@/components/museum/fields";
import { InView } from "@/components/museum/motion";
import { createReply, listWall } from "@/lib/museum/api";
import { Reactions } from "@/components/museum/reactions";

export const Route = createFileRoute("/wall")({
  loader: () => listWall(),
  component: WallPage,
});

function WallPage() {
  const posts = Route.useLoaderData();
  const router = useRouter();
  const [compose, setCompose] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  return (
    <MuseumShell>
      <RoomHeader
        kicker="Gallery VII"
        title="The Stranger Wall"
        line="You may reply. You may not argue, advise, or judge. Recognition is enough."
        action={
          <GhostButton onClick={() => setCompose((value) => !value)}>
            {compose ? "Close" : "Leave a note"}
          </GhostButton>
        }
      />
      {compose ? (
        <div className="mx-auto mb-12 max-w-2xl px-5 md:px-10">
          <WallForm onCreated={() => void router.invalidate()} />
        </div>
      ) : null}
      <div className="mx-auto max-w-2xl space-y-8 px-5 md:px-10">
        {posts.map((post) => (
          <InView key={post.id}>
            <article className="rounded-lg bg-ink-elevated px-6 py-6 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-border-hover)]">
              <p className="font-display text-2xl leading-snug">{post.content}</p>
              {post.emotion ? (
                <p className="mt-3 text-[10px] tracking-[0.24em] text-gold uppercase">{post.emotion}</p>
              ) : null}
              <ul className="mt-5 space-y-2">
                {post.replies.map((reply) => (
                  <li key={reply.id} className="text-sm text-mist">
                    {reply.content}
                  </li>
                ))}
              </ul>
              <form
                className="mt-4 flex gap-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const content = drafts[post.id]?.trim();
                  if (!content) return;
                  const result = await createReply({ data: { wallId: post.id, content } });
                  if (!result.ok) {
                    toast.error(result.error);
                    return;
                  }
                  setDrafts((current) => ({ ...current, [post.id]: "" }));
                  void router.invalidate();
                }}
              >
                <TextInput
                  value={drafts[post.id] ?? ""}
                  onChange={(event) => setDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                  placeholder="I understand."
                  maxLength={180}
                />
                <GhostButton type="submit">Reply</GhostButton>
              </form>
              <Reactions kind="wall" id={post.id} counts={{ understand: post.understandCount }} />
            </article>
          </InView>
        ))}
      </div>
    </MuseumShell>
  );
}
