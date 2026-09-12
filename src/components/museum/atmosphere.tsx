const GLYPHS = [
  { ch: "a", x: "7%", dur: "28s", delay: "-4s", size: "4.2rem" },
  { ch: "l", x: "19%", dur: "24s", delay: "-11s", size: "2.4rem" },
  { ch: "m", x: "31%", dur: "32s", delay: "-2s", size: "3.4rem" },
  { ch: "o", x: "44%", dur: "26s", delay: "-16s", size: "2rem" },
  { ch: "s", x: "56%", dur: "34s", delay: "-7s", size: "3.8rem" },
  { ch: "t", x: "68%", dur: "23s", delay: "-19s", size: "2.6rem" },
  { ch: "n", x: "79%", dur: "29s", delay: "-9s", size: "1.8rem" },
  { ch: "e", x: "88%", dur: "25s", delay: "-13s", size: "3rem" },
];

const DUST = Array.from({ length: 16 }, (_, i) => ({
  x: `${(i * 53) % 100}%`,
  dur: `${16 + (i % 9)}s`,
  delay: `-${(i * 1.7) % 16}s`,
}));

export function Atmosphere({ dense = false }: { dense?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="light-cool" />
      <div className="light-warm" />
      <div className="vignette" />
      {GLYPHS.map((glyph, i) => (
        <span
          key={`g-${i}`}
          className="float-glyph"
          style={{
            ["--x" as string]: glyph.x,
            ["--dur" as string]: glyph.dur,
            ["--delay" as string]: glyph.delay,
            ["--size" as string]: glyph.size,
          }}
        >
          {glyph.ch}
        </span>
      ))}
      {(dense ? DUST : DUST.slice(0, 9)).map((speck, i) => (
        <span
          key={`d-${i}`}
          className="dust-speck"
          style={{
            ["--x" as string]: speck.x,
            ["--dur" as string]: speck.dur,
            ["--delay" as string]: speck.delay,
          }}
        />
      ))}
    </div>
  );
}
