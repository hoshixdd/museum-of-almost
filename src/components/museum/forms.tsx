import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  createBook,
  createCapsule,
  createLife,
  createMemory,
  createVoice,
  createWallPost,
  reflectOnWriting,
} from "@/lib/museum/api";
import {
  CAPSULE_RECIPIENTS,
  EMOTIONS,
  LIFE_CATEGORIES,
  MEMORY_CATEGORIES,
  SUGGESTED_CITIES,
  VOICE_CATEGORIES,
} from "@/lib/museum/constants";
import { rememberCode, takeComposePrompt } from "@/lib/museum/local";
import { ClaimSlip } from "./claim-slip";
import { CrisisPanel, SafetyNote } from "./safety-note";
import { Field, PrimaryButton, TextArea, TextInput } from "./fields";
import {
  asOptions,
  ChoiceCards,
  CityPicks,
  emotionOptions,
  OptionPicks,
  YearPicks,
} from "./option-picks";

function offsetMinutes() {
  return new Date().getTimezoneOffset();
}

async function afterSubmit(title: string, emotion?: string, room?: string) {
  try {
    const result = await reflectOnWriting({ data: { title, emotion, room } });
    toast(result.text);
  } catch {
    toast("You preserved something meaningful.");
  }
}

function PublicConfirm({ tone }: { tone?: "paper" }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="space-y-2">
      <input
        type="checkbox"
        name="publicOk"
        required
        checked={ok}
        onChange={() => setOk((value) => !value)}
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => setOk((value) => !value)}
        aria-pressed={ok}
        className={`sticker ${tone === "paper" ? "sticker-paper" : ""} ${ok ? "is-on" : ""}`}
      >
        <span className="sticker-mark">{ok ? "♡" : "○"}</span>
        {ok ? "I understand — public, 16+" : "tap to agree — public, 16+"}
      </button>
      <p className={`text-sm leading-relaxed ${tone === "paper" ? "text-letter/75" : "text-mist"}`}>
        Anyone in these rooms can read this. No names. Cities only.
      </p>
    </div>
  );
}

export function MemoryForm({ paper = false }: { paper?: boolean }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [claim, setClaim] = useState<{ code: string; id: number; title: string } | null>(null);
  const [location, setLocation] = useState("");
  const [seedTitle] = useState(() => takeComposePrompt());
  const tone = paper ? "paper" : undefined;

  if (crisis) return <CrisisPanel />;
  if (claim) {
    return (
      <ClaimSlip
        code={claim.code}
        title={claim.title}
        onContinue={() => void navigate({ to: "/archive/$id", params: { id: String(claim.id) } })}
      />
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        const title = String(form.get("title") ?? "");
        const result = await createMemory({
          data: {
            title,
            content: String(form.get("content") ?? ""),
            category: String(form.get("category") ?? "Love") as (typeof MEMORY_CATEGORIES)[number],
            emotion: String(form.get("emotion") ?? "Nostalgia") as (typeof EMOTIONS)[number],
            year: form.get("year") ? Number(form.get("year")) : undefined,
            location: String(form.get("location") ?? "") || undefined,
            offsetMinutes: offsetMinutes(),
          },
        });
        setPending(false);
        if (!result.ok) {
          if (result.crisis) {
            setCrisis(true);
            return;
          }
          toast.error(result.error);
          return;
        }
        if (result.deleteCode) rememberCode("memory", result.id, result.deleteCode, title);
        setClaim({ code: result.deleteCode ?? "", id: result.id, title });
        void afterSubmit(title, String(form.get("emotion")), "archive");
      }}
    >
      <SafetyNote compact />
      <Field label="Title">
        <TextInput
          name="title"
          required
          maxLength={120}
          defaultValue={seedTitle}
          placeholder="The letter I never sent"
          tone={tone}
        />
      </Field>
      <Field label="Message">
        <TextArea name="content" required maxLength={4000} placeholder="Write as if the person might never read it." tone={tone} />
      </Field>
      <div className="space-y-5">
        <OptionPicks
          name="category"
          label="This belongs with"
          defaultValue="Love"
          options={asOptions(MEMORY_CATEGORIES)}
          tone={tone ?? "ink"}
        />
        <OptionPicks
          name="emotion"
          label="It feels like"
          defaultValue="Nostalgia"
          options={emotionOptions(EMOTIONS)}
          tone={tone ?? "ink"}
        />
        <YearPicks name="year" label="When, roughly" tone={tone ?? "ink"} />
        <div>
          <Field label="City or region">
            <TextInput
              name="location"
              list="city-list"
              maxLength={48}
              placeholder="Manila, not a street"
              tone={tone}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </Field>
          <CityPicks value={location} onChange={setLocation} tone={tone ?? "ink"} />
        </div>
      </div>
      <CityList />
      <PublicConfirm tone={tone} />
      <PrimaryButton disabled={pending}>{pending ? "Preserving…" : "Leave this letter"}</PrimaryButton>
    </form>
  );
}

export function LifeForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [claim, setClaim] = useState<{ code: string; id: number; title: string } | null>(null);
  const [location, setLocation] = useState("");

  if (crisis) return <CrisisPanel />;
  if (claim) {
    return (
      <ClaimSlip
        code={claim.code}
        title={claim.title}
        onContinue={() => void navigate({ to: "/lives/$id", params: { id: String(claim.id) } })}
      />
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        const title = String(form.get("title") ?? "");
        const result = await createLife({
          data: {
            title,
            story: String(form.get("story") ?? ""),
            category: String(form.get("category") ?? "Almost Self") as (typeof LIFE_CATEGORIES)[number],
            age: form.get("age") ? Number(form.get("age")) : undefined,
            location: String(form.get("location") ?? "") || undefined,
            career: String(form.get("career") ?? "") || undefined,
            relationship: String(form.get("relationship") ?? "") || undefined,
            dream: String(form.get("dream") ?? "") || undefined,
          },
        });
        setPending(false);
        if (!result.ok) {
          if (result.crisis) {
            setCrisis(true);
            return;
          }
          toast.error(result.error);
          return;
        }
        if (result.deleteCode) rememberCode("life", result.id, result.deleteCode, title);
        setClaim({ code: result.deleteCode ?? "", id: result.id, title });
        void afterSubmit(title, undefined, "lives");
      }}
    >
      <SafetyNote compact />
      <Field label="Title">
        <TextInput name="title" required maxLength={120} placeholder="The life I almost lived" />
      </Field>
      <OptionPicks
        name="category"
        label="Which almost"
        defaultValue="Almost Self"
        options={asOptions(LIFE_CATEGORIES)}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Age in that life">
          <TextInput name="age" type="number" min={1} max={120} placeholder="Optional" />
        </Field>
        <div>
          <Field label="Place">
            <TextInput
              name="location"
              list="city-list"
              placeholder="Optional city"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </Field>
          <CityPicks value={location} onChange={setLocation} />
        </div>
        <Field label="Career">
          <TextInput name="career" maxLength={120} placeholder="Optional" />
        </Field>
        <Field label="Relationship">
          <TextInput name="relationship" maxLength={160} placeholder="Optional" />
        </Field>
        <Field label="Dream">
          <TextInput name="dream" maxLength={200} placeholder="Optional" />
        </Field>
      </div>
      <Field label="Story">
        <TextArea name="story" required placeholder="Describe the parallel version without explaining it away." />
      </Field>
      <CityList />
      <PublicConfirm />
      <PrimaryButton disabled={pending}>{pending ? "Preserving…" : "Leave this life"}</PrimaryButton>
    </form>
  );
}

export function CapsuleForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [claim, setClaim] = useState<{ code: string; id: number; title: string } | null>(null);

  if (crisis) return <CrisisPanel />;
  if (claim) {
    return (
      <ClaimSlip
        code={claim.code}
        title={claim.title}
        onContinue={() => void navigate({ to: "/vault/$id", params: { id: String(claim.id) } })}
      />
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const unlock = String(form.get("unlockAt") ?? "");
        setPending(true);
        const title = String(form.get("title") ?? "");
        const result = await createCapsule({
          data: {
            title,
            content: String(form.get("content") ?? ""),
            unlockAt: new Date(unlock).toISOString(),
            privacy: String(form.get("privacy") ?? "public") as "public" | "private",
            recipient: String(form.get("recipient") ?? "Future self") as (typeof CAPSULE_RECIPIENTS)[number],
          },
        });
        setPending(false);
        if (!result.ok) {
          if (result.crisis) {
            setCrisis(true);
            return;
          }
          toast.error(result.error);
          return;
        }
        if (result.deleteCode) rememberCode("capsule", result.id, result.deleteCode, title);
        if (result.accessCode) rememberCode("capsule-key", result.id, result.accessCode, title);
        setClaim({ code: result.accessCode ?? result.deleteCode ?? "", id: result.id, title });
        void afterSubmit(title, undefined, "vault");
      }}
    >
      <SafetyNote compact />
      <Field label="Title">
        <TextInput name="title" required placeholder="A note for a later winter" />
      </Field>
      <Field label="Message">
        <TextArea name="content" required placeholder="What should wait?" />
      </Field>
      <Field label="Unlock date">
        <TextInput name="unlockAt" type="datetime-local" required />
      </Field>
      <OptionPicks
        name="recipient"
        label="For"
        defaultValue="Future self"
        options={asOptions(CAPSULE_RECIPIENTS)}
      />
      <ChoiceCards
        name="privacy"
        label="How it waits"
        defaultValue="public"
        options={[
          { value: "public", label: "Public", hint: "Anyone can see it exists. The words wait until the date." },
          { value: "private", label: "Private", hint: "Sealed. Only the key on your claim slip opens it." },
        ]}
      />
      <PublicConfirm />
      <PrimaryButton disabled={pending}>{pending ? "Sealing…" : "Seal this capsule"}</PrimaryButton>
    </form>
  );
}

export function VoiceForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [claim, setClaim] = useState<{ code: string; id: number; title: string } | null>(null);

  if (crisis) return <CrisisPanel />;
  if (claim) {
    return (
      <ClaimSlip
        code={claim.code}
        title={claim.title}
        onContinue={() => void navigate({ to: "/voice/$id", params: { id: String(claim.id) } })}
      />
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        const title = String(form.get("title") ?? "");
        const result = await createVoice({
          data: {
            title,
            transcript: String(form.get("transcript") ?? ""),
            category: String(form.get("category") ?? "Letters") as (typeof VOICE_CATEGORIES)[number],
          },
        });
        setPending(false);
        if (!result.ok) {
          if (result.crisis) {
            setCrisis(true);
            return;
          }
          toast.error(result.error);
          return;
        }
        if (result.deleteCode) rememberCode("voice", result.id, result.deleteCode, title);
        setClaim({ code: result.deleteCode ?? "", id: result.id, title });
        void afterSubmit(title, undefined, "voice");
      }}
    >
      <SafetyNote compact />
      <p className="text-sm text-mist">
        This is a spoken letter, not a recording. Write the words. The room reads them aloud in your browser — nothing is uploaded.
      </p>
      <Field label="Title">
        <TextInput name="title" required placeholder="A confession to an empty kitchen" />
      </Field>
      <Field label="Spoken letter">
        <TextArea name="transcript" required placeholder="Write the words you would have said." />
      </Field>
      <OptionPicks
        name="category"
        label="Kind of voice"
        defaultValue="Letters"
        options={asOptions(VOICE_CATEGORIES)}
      />
      <PublicConfirm />
      <PrimaryButton disabled={pending}>{pending ? "Placing…" : "Leave this voice"}</PrimaryButton>
    </form>
  );
}

export function BookForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [claim, setClaim] = useState<{ code: string; id: number; title: string } | null>(null);

  if (crisis) return <CrisisPanel />;
  if (claim) {
    return (
      <ClaimSlip
        code={claim.code}
        title={claim.title}
        onContinue={() => void navigate({ to: "/library/$id", params: { id: String(claim.id) } })}
      />
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        const title = String(form.get("title") ?? "");
        const result = await createBook({
          data: {
            title,
            chapterBefore: String(form.get("chapterBefore") ?? ""),
            chapterMoment: String(form.get("chapterMoment") ?? ""),
            chapterChange: String(form.get("chapterChange") ?? ""),
            chapterAfter: String(form.get("chapterAfter") ?? ""),
          },
        });
        setPending(false);
        if (!result.ok) {
          if (result.crisis) {
            setCrisis(true);
            return;
          }
          toast.error(result.error);
          return;
        }
        if (result.editCode) rememberCode("book", result.id, result.editCode, title);
        setClaim({ code: result.editCode ?? result.deleteCode ?? "", id: result.id, title });
        void afterSubmit(title, undefined, "library");
      }}
    >
      <SafetyNote compact />
      <Field label="Book title">
        <TextInput name="title" required placeholder="Notes from the unsent decade" />
      </Field>
      <Field label="Chapter 1 — Before">
        <TextArea name="chapterBefore" placeholder="Who were you before the moment?" />
      </Field>
      <Field label="Chapter 2 — The Moment">
        <TextArea name="chapterMoment" placeholder="What changed, even slightly?" />
      </Field>
      <Field label="Chapter 3 — The Change">
        <TextArea name="chapterChange" placeholder="What did you do with it?" />
      </Field>
      <Field label="Chapter 4 — After">
        <TextArea name="chapterAfter" placeholder="Where are you now? You may leave this blank and return." />
      </Field>
      <PublicConfirm />
      <PrimaryButton disabled={pending}>{pending ? "Binding…" : "Place this book"}</PrimaryButton>
    </form>
  );
}

export function WallForm({ onCreated }: { onCreated?: () => void }) {
  const [pending, setPending] = useState(false);
  const [crisis, setCrisis] = useState(false);

  if (crisis) return <CrisisPanel />;

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        setPending(true);
        const content = String(data.get("content") ?? "");
        const result = await createWallPost({
          data: {
            content,
            emotion: (String(data.get("emotion") ?? "") || undefined) as (typeof EMOTIONS)[number] | undefined,
          },
        });
        setPending(false);
        if (!result.ok) {
          if (result.crisis) {
            setCrisis(true);
            return;
          }
          toast.error(result.error);
          return;
        }
        if (result.deleteCode) rememberCode("wall", result.id, result.deleteCode, content.slice(0, 48));
        form.reset();
        toast("Pinned without a name. Claim slip is on Your desk.");
        onCreated?.();
      }}
    >
      <SafetyNote compact />
      <Field label="A sentence for the wall">
        <TextArea name="content" required maxLength={500} placeholder="No advice. No performance. Just what is true." className="min-h-24" />
      </Field>
      <OptionPicks
        name="emotion"
        label="It feels like"
        defaultValue=""
        allowEmpty
        emptyLabel="unspecified"
        options={emotionOptions(EMOTIONS)}
      />
      <PublicConfirm />
      <PrimaryButton disabled={pending}>{pending ? "Pinning…" : "Pin anonymously"}</PrimaryButton>
    </form>
  );
}

function CityList() {
  return (
    <datalist id="city-list">
      {SUGGESTED_CITIES.map((city) => (
        <option key={city} value={city} />
      ))}
    </datalist>
  );
}
