export function EmptyRoom({
  line,
  action,
  href,
}: {
  line: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="rounded-xl bg-ink-elevated px-6 py-14 text-center shadow-[var(--shadow-border)]">
      <p className="font-display text-2xl text-paper/90">{line}</p>
      {action && href ? (
        <a href={href} className="mt-5 inline-block text-sm text-gold">
          {action}
        </a>
      ) : null}
    </div>
  );
}
