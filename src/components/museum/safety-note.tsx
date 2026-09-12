import { Link } from "@tanstack/react-router";

export function SafetyNote({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="rounded-lg bg-ink-elevated px-5 py-4 text-sm leading-relaxed text-mist shadow-[var(--shadow-border)]">
      <p>
        This platform contains personal stories that may include grief, loss, or difficult experiences.
        {compact ? null : " Do not include names, addresses, or anyone’s private information."}
      </p>
      {compact ? null : (
        <p className="mt-2">
          If you are in immediate danger, contact local emergency services. Support:{" "}
          <Link to="/safety" className="text-gold">
            Safety resources
          </Link>
          .
        </p>
      )}
    </aside>
  );
}
