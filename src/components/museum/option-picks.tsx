import { useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "./motion";
import { SUGGESTED_CITIES } from "@/lib/museum/constants";

export type PickOption = {
  value: string;
  label: string;
  hint?: string;
  mark?: string;
};

const EMOTION_MARKS: Record<string, string> = {
  Love: "♡",
  Sadness: "·",
  Hope: "✦",
  Anger: "!",
  Nostalgia: "◌",
  Healing: "+",
  Fear: "?",
};

const TILTS = [-2.4, 1.6, -1.1, 2.2, -1.8, 1.2, -0.7, 2.6, -2.1, 0.9];

export function emotionOptions(list: readonly string[], extra?: PickOption): PickOption[] {
  const mapped = list.map((item) => ({
    value: item,
    label: item,
    mark: EMOTION_MARKS[item] ?? "·",
  }));
  return extra ? [extra, ...mapped] : mapped;
}

export function asOptions(list: readonly string[]): PickOption[] {
  return list.map((item) => ({ value: item, label: item }));
}

type Tone = "ink" | "paper";

export function OptionPicks({
  name,
  label,
  options,
  defaultValue = "",
  value,
  onChange,
  tone = "ink",
  allowEmpty = false,
  emptyLabel = "any",
}: {
  name?: string;
  label: string;
  options: PickOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (next: string) => void;
  tone?: Tone;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const reduce = useReducedMotion();
  const groupId = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const items = allowEmpty ? [{ value: "", label: emptyLabel }, ...options] : options;

  function pick(next: string) {
    if (value === undefined) setInner(next);
    onChange?.(next);
  }

  return (
    <fieldset className="w-full min-w-0 max-w-full">
      <legend id={groupId} className="mb-2 w-full text-[11px] tracking-[0.2em] text-gold uppercase">
        {label}
      </legend>
      {name ? <input type="hidden" name={name} value={current} /> : null}
      <div className="sticker-row" role="radiogroup" aria-labelledby={groupId}>
        {items.map((item, index) => {
          const on = current === item.value;
          const tilt = TILTS[index % TILTS.length];
          return (
            <motion.button
              key={`${item.value}-${item.label}`}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => pick(item.value)}
              className={cn("sticker", tone === "paper" && "sticker-paper", on && "is-on")}
              style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
              initial={reduce ? false : { opacity: 0, y: 10, rotate: tilt * 1.6 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: on ? 0 : tilt,
                scale: on ? 1.05 : 1,
              }}
              transition={{
                type: reduce ? "tween" : "spring",
                stiffness: 420,
                damping: 24,
                delay: reduce ? 0 : Math.min(index * 0.02, 0.2),
              }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              whileHover={reduce ? undefined : { y: -3, rotate: 0 }}
            >
              {item.mark ? <span className="sticker-mark">{item.mark}</span> : null}
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ChoiceCards({
  name,
  label,
  options,
  defaultValue,
  tone = "ink",
}: {
  name: string;
  label: string;
  options: PickOption[];
  defaultValue: string;
  tone?: Tone;
}) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(defaultValue);

  return (
    <fieldset className="w-full min-w-0 max-w-full">
      <legend className="mb-3 text-[11px] tracking-[0.2em] text-gold uppercase">{label}</legend>
      <input type="hidden" name={name} value={current} />
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((item, index) => {
          const on = current === item.value;
          return (
            <motion.button
              key={item.value}
              type="button"
              onClick={() => setCurrent(item.value)}
              aria-pressed={on}
              className={cn("choice-card", tone === "paper" && "choice-card-paper", on && "is-on")}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, scale: on ? 1 : 0.99 }}
              transition={{ duration: 0.45, ease: easeOutExpo, delay: reduce ? 0 : index * 0.06 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
            >
              <span className="choice-tape" aria-hidden="true" />
              <span className="font-display text-xl leading-tight">{item.label}</span>
              {item.hint ? (
                <span className={cn("mt-2 block text-sm leading-relaxed", on ? "opacity-80" : "opacity-60")}>
                  {item.hint}
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

const DECADES = [1960, 1970, 1980, 1990, 2000, 2010, 2020] as const;

function yearsIn(decade: number) {
  const end = Math.min(decade + 9, 2026);
  const list: number[] = [];
  for (let year = decade; year <= end; year += 1) list.push(year);
  return list;
}

export function YearPicks({
  name = "year",
  label = "Year",
  defaultValue = "",
  tone = "ink",
}: {
  name?: string;
  label?: string;
  defaultValue?: string;
  tone?: Tone;
}) {
  const reduce = useReducedMotion();
  const initial = defaultValue;
  const [year, setYear] = useState(initial);
  const [decade, setDecade] = useState<number | null>(() => {
    const n = Number(initial);
    if (!n) return null;
    return Math.floor(n / 10) * 10;
  });
  const years = useMemo(() => (decade == null ? [] : yearsIn(decade)), [decade]);

  return (
    <fieldset className="w-full min-w-0 max-w-full">
      <legend className="mb-3 text-[11px] tracking-[0.2em] text-gold uppercase">{label}</legend>
      <input type="hidden" name={name} value={year} />
      <div className="sticker-row">
        <motion.button
          type="button"
          className={cn("sticker", tone === "paper" && "sticker-paper", year === "" && "is-on")}
          onClick={() => {
            setYear("");
            setDecade(null);
          }}
          animate={{ rotate: year === "" ? 0 : -1.4, scale: year === "" ? 1.04 : 1 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
        >
          <span className="sticker-mark">◌</span>
          unknown
        </motion.button>
        {DECADES.map((item, index) => {
          const on = decade === item;
          const tilt = TILTS[index % TILTS.length];
          return (
            <motion.button
              key={item}
              type="button"
              className={cn("sticker", tone === "paper" && "sticker-paper", on && "is-on")}
              onClick={() => setDecade(item)}
              style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
              animate={{ rotate: on ? 0 : tilt, scale: on ? 1.04 : 1 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
            >
              {String(item).slice(2)}s
            </motion.button>
          );
        })}
      </div>
      {years.length ? (
        <motion.div
          className="mt-3 sticker-row"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: easeOutExpo }}
        >
          {years.map((item) => {
            const on = year === String(item);
            return (
              <motion.button
                key={item}
                type="button"
                className={cn("sticker sticker-year", tone === "paper" && "sticker-paper", on && "is-on")}
                onClick={() => setYear(String(item))}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                animate={{ scale: on ? 1.06 : 1 }}
              >
                {item}
              </motion.button>
            );
          })}
        </motion.div>
      ) : null}
    </fieldset>
  );
}

export function CityPicks({
  value,
  onChange,
  tone = "ink",
}: {
  value: string;
  onChange: (next: string) => void;
  tone?: Tone;
}) {
  const reduce = useReducedMotion();
  const chips = SUGGESTED_CITIES.slice(0, 10);

  return (
    <div className="sticker-row mt-3" aria-label="Suggested cities">
      {chips.map((city, index) => {
        const on = value === city;
        return (
          <motion.button
            key={city}
            type="button"
            className={cn("sticker sticker-city", tone === "paper" && "sticker-paper", on && "is-on")}
            onClick={() => onChange(on ? "" : city)}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, scale: on ? 1.05 : 1 }}
            transition={{ delay: reduce ? 0 : 0.02 * index, duration: 0.35, ease: easeOutExpo }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
          >
            {city}
          </motion.button>
        );
      })}
    </div>
  );
}
