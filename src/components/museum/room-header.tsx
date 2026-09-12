import { SplitTitle } from "./presence";
import { Rise } from "./motion";

export function RoomHeader({
  kicker,
  title,
  line,
  action,
}: {
  kicker: string;
  title: string;
  line: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-12 md:flex-row md:items-end md:justify-between md:px-10">
      <div className="max-w-2xl">
        <Rise>
          <p className="text-[11px] tracking-[0.46em] text-gold uppercase">{kicker}</p>
        </Rise>
        <SplitTitle text={title} className="mt-4 font-display text-4xl leading-[1.02] md:text-6xl" />
        <Rise delay={0.18}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist">{line}</p>
        </Rise>
      </div>
      {action ? (
        <Rise delay={0.28} className="shrink-0">
          {action}
        </Rise>
      ) : null}
    </div>
  );
}
