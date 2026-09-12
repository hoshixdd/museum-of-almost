import { Link2, Share } from "lucide-react";
import { toast } from "sonner";

export function ShareBar({ title, path }: { title: string; path: string }) {
  async function copyLink() {
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied. Send it like a note, not a post.");
    } catch {
      toast.error("Could not copy the link.");
    }
  }

  async function nativeShare() {
    const url = new URL(path, window.location.origin).toString();
    if (typeof navigator.share !== "function") {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title, url, text: `${title} — The Museum of Almost` });
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => void copyLink()}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-mist shadow-[var(--shadow-border)] hover:text-paper"
      >
        <Link2 className="size-3.5" strokeWidth={1.6} />
        Copy link
      </button>
      <button
        type="button"
        onClick={() => void nativeShare()}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-mist shadow-[var(--shadow-border)] hover:text-paper"
      >
        <Share className="size-3.5" strokeWidth={1.6} />
        Share
      </button>
    </div>
  );
}
