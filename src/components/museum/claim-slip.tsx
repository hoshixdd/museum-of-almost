import { useState } from "react";
import { toast } from "sonner";
import { PrimaryButton } from "./fields";

export function ClaimSlip({
  code,
  title,
  onContinue,
}: {
  code: string;
  title: string;
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast("Claim slip copied.");
    } catch {
      toast.error("Copy failed — screenshot this code.");
    }
  }

  return (
    <div className="note-card mx-auto w-full max-w-md rounded-xl bg-paper px-8 py-10 text-letter">
      <p className="text-[11px] tracking-[0.28em] text-rust uppercase">write this down</p>
      <h2 className="mt-3 font-display text-3xl">Your claim slip</h2>
      <p className="mt-3 text-sm leading-relaxed text-letter/70">
        {title} is public in the rooms. This code is the only way to shred it later. We cannot email it. It
        lives on this phone unless you copy it.
      </p>
      <p className="mt-6 rounded-lg bg-paper-dim px-4 py-3 font-mono text-sm tracking-wide text-letter">
        {code}
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <PrimaryButton type="button" onClick={() => void copy()}>
          {copied ? "Copied" : "Copy claim slip"}
        </PrimaryButton>
        <button
          type="button"
          onClick={onContinue}
          className="min-h-11 text-sm text-letter/70 underline-offset-4 hover:underline"
        >
          I saved it — continue
        </button>
      </div>
    </div>
  );
}
