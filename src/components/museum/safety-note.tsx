import { Link } from "@tanstack/react-router";

export function SafetyNote({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="rounded-xl bg-ink-elevated px-5 py-4 text-sm leading-relaxed text-mist shadow-[var(--shadow-border)]">
      <p>
        Stories here can hold grief. Do not include names, addresses, or anyone’s private information.
        Cities only — never streets.
      </p>
      <p className={compact ? "mt-2" : "mt-2"}>
        If you are in immediate danger, contact local emergency services. Support:{" "}
        <Link to="/safety" className="text-gold">
          Safety resources
        </Link>
        .
      </p>
    </aside>
  );
}

export function CrisisPanel() {
  return (
    <aside className="rounded-xl bg-paper px-6 py-6 text-letter shadow-[var(--shadow-letter)]">
      <p className="text-[11px] tracking-[0.28em] text-rust uppercase">pause here</p>
      <h2 className="mt-3 font-display text-3xl">You do not have to leave this in the museum.</h2>
      <p className="mt-4 text-sm leading-relaxed text-letter/75">
        If you are thinking about ending your life or hurting yourself, please get help before writing. The
        museum cannot find you or intervene.
      </p>
      <ul className="mt-5 space-y-2 text-sm">
        <li>
          <a className="text-rust underline" href="https://findahelpline.com/" target="_blank" rel="noreferrer">
            Find a Helpline
          </a>
        </li>
        <li>
          <a className="text-rust underline" href="https://www.iasp.info/suicidalthoughts/" target="_blank" rel="noreferrer">
            IASP
          </a>
        </li>
        <li>
          <a className="text-rust underline" href="https://988lifeline.org/" target="_blank" rel="noreferrer">
            988 Lifeline (US)
          </a>
        </li>
      </ul>
    </aside>
  );
}
