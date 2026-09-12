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
import { getAnonymousId, rememberCode } from "@/lib/museum/local";
import { SafetyNote } from "./safety-note";
import { Field, PrimaryButton, SelectInput, TextArea, TextInput } from "./fields";

function years() {
  const list = [];
  for (let year = 2026; year >= 1960; year -= 1) list.push(year);
  return list;
}

async function afterSubmit(title: string, emotion?: string, room?: string) {
  try {
    const result = await reflectOnWriting({ data: { title, emotion, room } });
    toast(result.text);
  } catch {
    toast("You preserved something meaningful.");
  }
}

export function MemoryForm({ paper = false }: { paper?: boolean }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const tone = paper ? "paper" : undefined;

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        const result = await createMemory({
          data: {
            title: String(form.get("title") ?? ""),
            content: String(form.get("content") ?? ""),
            category: String(form.get("category") ?? "Love") as (typeof MEMORY_CATEGORIES)[number],
            emotion: String(form.get("emotion") ?? "Nostalgia") as (typeof EMOTIONS)[number],
            year: form.get("year") ? Number(form.get("year")) : undefined,
            location: String(form.get("location") ?? "") || undefined,
            anonymousId: getAnonymousId(),
          },
        });
        setPending(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        void navigate({ to: "/archive/$id", params: { id: String(result.id) } });
        void afterSubmit(String(form.get("title")), String(form.get("emotion")), "archive");
      }}
    >
      <SafetyNote compact />
      <Field label="Title">
        <TextInput name="title" required maxLength={120} placeholder="The letter I never sent" tone={tone} />
      </Field>
      <Field label="Message">
        <TextArea name="content" required maxLength={4000} placeholder="Write as if the person might never read it." tone={tone} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Category">
          <SelectInput name="category" defaultValue="Love" tone={tone}>
            {MEMORY_CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Emotion">
          <SelectInput name="emotion" defaultValue="Nostalgia" tone={tone}>
            {EMOTIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Year">
          <SelectInput name="year" defaultValue="" tone={tone}>
            <option value="">Unknown</option>
            {years().map((year) => (
              <option key={year}>{year}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="City or region">
          <TextInput name="location" list="city-list" maxLength={48} placeholder="Optional" tone={tone} />
        </Field>
      </div>
      <CityList />
      <PrimaryButton disabled={pending}>{pending ? "Preserving…" : "Leave this letter"}</PrimaryButton>
    </form>
  );
}

export function LifeForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        const result = await createLife({
          data: {
            title: String(form.get("title") ?? ""),
            story: String(form.get("story") ?? ""),
            category: String(form.get("category") ?? "Almost Self") as (typeof LIFE_CATEGORIES)[number],
            age: form.get("age") ? Number(form.get("age")) : undefined,
            location: String(form.get("location") ?? "") || undefined,
            career: String(form.get("career") ?? "") || undefined,
            relationship: String(form.get("relationship") ?? "") || undefined,
            dream: String(form.get("dream") ?? "") || undefined,
            anonymousId: getAnonymousId(),
          },
        });
        setPending(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        void navigate({ to: "/lives/$id", params: { id: String(result.id) } });
        void afterSubmit(String(form.get("title")), undefined, "lives");
      }}
    >
      <SafetyNote compact />
      <Field label="Title">
        <TextInput name="title" required maxLength={120} placeholder="The life I almost lived" />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Category">
          <SelectInput name="category" defaultValue="Almost Self">
            {LIFE_CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Age in that life">
          <TextInput name="age" type="number" min={1} max={120} placeholder="Optional" />
        </Field>
        <Field label="Place">
          <TextInput name="location" list="city-list" placeholder="Optional city" />
        </Field>
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
      <PrimaryButton disabled={pending}>{pending ? "Preserving…" : "Leave this life"}</PrimaryButton>
    </form>
  );
}

export function CapsuleForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const unlock = String(form.get("unlockAt") ?? "");
        setPending(true);
        const result = await createCapsule({
          data: {
            title: String(form.get("title") ?? ""),
            content: String(form.get("content") ?? ""),
            unlockAt: new Date(unlock).toISOString(),
            privacy: String(form.get("privacy") ?? "public") as "public" | "private",
            recipient: String(form.get("recipient") ?? "Future self") as (typeof CAPSULE_RECIPIENTS)[number],
            anonymousId: getAnonymousId(),
          },
        });
        setPending(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        if (result.accessCode) {
          rememberCode("capsule", result.id, result.accessCode);
          toast(`Private key: ${result.accessCode}. Keep it to open this capsule.`);
        }
        void navigate({ to: "/vault/$id", params: { id: String(result.id) } });
        void afterSubmit(String(form.get("title")), undefined, "vault");
      }}
    >
      <SafetyNote compact />
      <Field label="Title">
        <TextInput name="title" required placeholder="A note for a later winter" />
      </Field>
      <Field label="Message">
        <TextArea name="content" required placeholder="What should wait?" />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Unlock date">
          <TextInput name="unlockAt" type="datetime-local" required />
        </Field>
        <Field label="Recipient">
          <SelectInput name="recipient" defaultValue="Future self">
            {CAPSULE_RECIPIENTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Privacy">
          <SelectInput name="privacy" defaultValue="public">
            <option value="public">Public — visible, locked until the date</option>
            <option value="private">Private — only with the key</option>
          </SelectInput>
        </Field>
      </div>
      <PrimaryButton disabled={pending}>{pending ? "Sealing…" : "Seal this capsule"}</PrimaryButton>
    </form>
  );
}

export function VoiceForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        const result = await createVoice({
          data: {
            title: String(form.get("title") ?? ""),
            transcript: String(form.get("transcript") ?? ""),
            category: String(form.get("category") ?? "Letters") as (typeof VOICE_CATEGORIES)[number],
            anonymousId: getAnonymousId(),
          },
        });
        setPending(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        void navigate({ to: "/voice/$id", params: { id: String(result.id) } });
        void afterSubmit(String(form.get("title")), undefined, "voice");
      }}
    >
      <SafetyNote compact />
      <p className="text-sm text-mist">
        Speak by writing. The room will read it aloud — no files leave your device, no recording is stored.
      </p>
      <Field label="Title">
        <TextInput name="title" required placeholder="A confession to an empty kitchen" />
      </Field>
      <Field label="Spoken letter">
        <TextArea name="transcript" required placeholder="Write the words you would have said." />
      </Field>
      <Field label="Category">
        <SelectInput name="category" defaultValue="Letters">
          {VOICE_CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </SelectInput>
      </Field>
      <PrimaryButton disabled={pending}>{pending ? "Placing…" : "Leave this voice"}</PrimaryButton>
    </form>
  );
}

export function BookForm() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        const result = await createBook({
          data: {
            title: String(form.get("title") ?? ""),
            chapterBefore: String(form.get("chapterBefore") ?? ""),
            chapterMoment: String(form.get("chapterMoment") ?? ""),
            chapterChange: String(form.get("chapterChange") ?? ""),
            chapterAfter: String(form.get("chapterAfter") ?? ""),
            anonymousId: getAnonymousId(),
          },
        });
        setPending(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        rememberCode("book", result.id, result.editCode);
        toast(`Library card: ${result.editCode}. Keep it to continue this book.`);
        void navigate({ to: "/library/$id", params: { id: String(result.id) } });
        void afterSubmit(String(form.get("title")), undefined, "library");
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
      <PrimaryButton disabled={pending}>{pending ? "Binding…" : "Place this book"}</PrimaryButton>
    </form>
  );
}

export function WallForm({ onCreated }: { onCreated?: () => void }) {
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        setPending(true);
        const result = await createWallPost({
          data: {
            content: String(data.get("content") ?? ""),
            emotion: (String(data.get("emotion") ?? "") || undefined) as (typeof EMOTIONS)[number] | undefined,
            anonymousId: getAnonymousId(),
          },
        });
        setPending(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        form.reset();
        toast("Pinned without a name.");
        onCreated?.();
      }}
    >
      <Field label="A sentence for the wall">
        <TextArea name="content" required maxLength={500} placeholder="No advice. No performance. Just what is true." className="min-h-24" />
      </Field>
      <Field label="Emotion">
        <SelectInput name="emotion" defaultValue="">
          <option value="">Unspecified</option>
          {EMOTIONS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </SelectInput>
      </Field>
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
