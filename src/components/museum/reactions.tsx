import { useEffect, useState } from "react";
import { Bookmark, Flag } from "lucide-react";
import { toast } from "sonner";
import { reactTo, reportContent } from "@/lib/museum/api";
import { REACTIONS, REPORT_REASONS } from "@/lib/museum/constants";
import { hasReacted, isFavorite, markReacted, toggleFavorite } from "@/lib/museum/local";
import { cn } from "@/lib/utils";
import type { ArtifactKind, ReactionKey } from "@/lib/museum/types";

export function Reactions({
  kind,
  id,
  counts,
}: {
  kind: ArtifactKind;
  id: number;
  counts?: { needed?: number; understand?: number; reminded?: number };
}) {
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSaved(isFavorite(kind, id));
    const next: Record<string, boolean> = {};
    for (const reaction of REACTIONS) {
      if (hasReacted(kind, id, reaction.key)) next[reaction.key] = true;
    }
    setDone(next);
  }, [kind, id]);

  const available = REACTIONS.filter((reaction) => {
    if (kind === "book" || kind === "capsule" || kind === "exit" || kind === "reply") return false;
    if (kind === "voice") return reaction.key === "needed";
    if (kind === "wall") return reaction.key === "understand";
    return true;
  });

  async function onReact(key: ReactionKey) {
    if (done[key]) return;
    if (kind !== "memory" && kind !== "life" && kind !== "voice" && kind !== "wall") return;
    markReacted(kind, id, key);
    setDone((current) => ({ ...current, [key]: true }));
    await reactTo({ data: { kind, id, reaction: key } });
  }

  const reportKind =
    kind === "wall" ? "wall" : kind === "exit" ? "exit" : kind === "reply" ? "reply" : kind;

  return (
    <div className={kind === "reply" ? "inline-flex" : "mt-8 space-y-4"}>
      <div className="flex flex-wrap gap-2">
        {available.map((reaction) => {
          const used = Boolean(done[reaction.key]);
          return (
            <button
              key={reaction.key}
              type="button"
              onClick={() => onReact(reaction.key)}
              disabled={used}
              className={cn("sticker", used && "is-on")}
            >
              {reaction.label}
              {counts && counts[reaction.key] ? ` · ${counts[reaction.key]}` : ""}
            </button>
          );
        })}
        {kind !== "exit" && kind !== "reply" ? (
          <button
            type="button"
            onClick={() => setSaved(toggleFavorite(kind, id))}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm",
              saved ? "text-gold" : "text-mist hover:text-paper",
            )}
          >
            <Bookmark className="size-3.5" strokeWidth={1.5} />
            {saved ? "Kept" : "Keep"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setReportOpen((value) => !value)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-mist hover:text-paper"
        >
          <Flag className="size-3.5" strokeWidth={1.5} />
          Report
        </button>
      </div>
      {reportOpen ? (
        <div className="flex flex-wrap gap-2">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              className="sticker"
              onClick={async () => {
                await reportContent({
                  data: {
                    kind: reportKind as "memory" | "life" | "voice" | "book" | "wall" | "capsule" | "exit" | "reply",
                    id,
                    reason,
                  },
                });
                setReportOpen(false);
                toast("Noted. If enough people flag this, it leaves the rooms.");
              }}
            >
              {reason}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
