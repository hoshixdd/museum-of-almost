import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { MuseumShell } from "@/components/museum/shell";
import { Reactions } from "@/components/museum/reactions";
import { getVoice } from "@/lib/museum/api";
import { catalogNumber, formatDuration } from "@/lib/utils";

export const Route = createFileRoute("/voice_/$id")({
  loader: async ({ params }) => {
    const voice = await getVoice({ data: { id: Number(params.id) } });
    if (!voice) throw notFound();
    return voice;
  },
  component: VoiceListenPage,
});

function VoiceListenPage() {
  const voice = Route.useLoaderData();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function toggle() {
    if (!window.speechSynthesis) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(voice.transcript);
    utterance.rate = 0.92;
    utterance.pitch = 0.95;
    utterance.onboundary = (event) => {
      if (voice.transcript.length) setProgress(event.charIndex / voice.transcript.length);
    };
    utterance.onend = () => {
      setPlaying(false);
      setProgress(1);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }

  return (
    <MuseumShell dense>
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-5 py-10 md:px-10">
        <Link to="/voice" className="text-[11px] tracking-[0.24em] text-mist uppercase hover:text-gold">
          Return to the dark
        </Link>
        <p className="mt-10 text-[11px] tracking-[0.32em] text-gold uppercase">{catalogNumber("VOICE", voice.id)}</p>
        <h1 className="mt-4 font-display text-4xl">{voice.title}</h1>
        <p className="mt-2 text-sm text-mist">
          {voice.category} · {formatDuration(voice.durationSec)}
        </p>
        <div className="mt-12 flex h-24 items-end justify-center gap-1">
          {Array.from({ length: 32 }, (_, index) => (
            <span
              key={index}
              className="wave-bar w-1 rounded-full bg-gold/80"
              style={{
                height: `${18 + ((index * 37) % 70)}%`,
                opacity: playing ? 0.4 + ((index / 32 + progress) % 1) * 0.6 : 0.25,
                ["--wave" as string]: `${0.8 + (index % 5) * 0.15}s`,
                ["--delay" as string]: `${index * 40}ms`,
                animationPlayState: playing ? "running" : "paused",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={toggle}
          className="mx-auto mt-10 inline-flex min-h-14 min-w-14 items-center justify-center rounded-full text-paper shadow-[var(--shadow-border-hover)]"
          aria-label={playing ? "Pause" : "Listen"}
        >
          {playing ? <Pause className="size-6" strokeWidth={1.4} /> : <Play className="size-6 translate-x-0.5" strokeWidth={1.4} />}
        </button>
        <p className="mt-10 font-display text-xl leading-relaxed text-paper/90">{voice.transcript}</p>
        <Reactions kind="voice" id={voice.id} counts={{ needed: voice.neededCount }} />
      </div>
    </MuseumShell>
  );
}
