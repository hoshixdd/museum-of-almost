import type {
  CAPSULE_RECIPIENTS,
  EMOTIONS,
  LIFE_CATEGORIES,
  MEMORY_CATEGORIES,
  VOICE_CATEGORIES,
} from "./constants";

export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number];
export type Emotion = (typeof EMOTIONS)[number];
export type LifeCategory = (typeof LIFE_CATEGORIES)[number];
export type VoiceCategory = (typeof VOICE_CATEGORIES)[number];
export type CapsuleRecipient = (typeof CAPSULE_RECIPIENTS)[number];
export type ArtifactKind = "memory" | "life" | "voice" | "book" | "wall";
export type ReactionKey = "needed" | "understand" | "reminded";

export type Memory = {
  id: number;
  title: string;
  content: string;
  category: MemoryCategory;
  emotion: Emotion;
  year: number | null;
  location: string | null;
  createdAt: string;
  views: number;
  neededCount: number;
  understandCount: number;
  remindedCount: number;
};

export type AlmostLife = {
  id: number;
  title: string;
  story: string;
  category: LifeCategory;
  age: number | null;
  location: string | null;
  career: string | null;
  relationship: string | null;
  dream: string | null;
  createdAt: string;
  views: number;
  neededCount: number;
  understandCount: number;
  remindedCount: number;
};

export type Capsule = {
  id: number;
  title: string;
  content: string | null;
  unlockAt: string;
  privacy: "public" | "private";
  recipient: CapsuleRecipient;
  createdAt: string;
  locked: boolean;
  opened: boolean;
};

export type Voice = {
  id: number;
  title: string;
  transcript: string;
  category: VoiceCategory;
  durationSec: number;
  createdAt: string;
  listens: number;
  neededCount: number;
};

export type Book = {
  id: number;
  title: string;
  chapterBefore: string;
  chapterMoment: string;
  chapterChange: string;
  chapterAfter: string;
  createdAt: string;
  views: number;
  canEdit: boolean;
};

export type WallPost = {
  id: number;
  content: string;
  emotion: Emotion | null;
  createdAt: string;
  understandCount: number;
  replies: WallReply[];
};

export type WallReply = {
  id: number;
  content: string;
  createdAt: string;
};

export type MapPoint = {
  city: string;
  region: string;
  x: number;
  y: number;
  count: number;
};

export type MuseumStats = {
  memories: number;
  lives: number;
  capsules: number;
  voices: number;
  books: number;
  wall: number;
  artifacts: number;
};

export type CuratorReply = {
  ok: true;
  text: string;
  matches: { kind: ArtifactKind; id: number; title: string; href: string }[];
} | {
  ok: false;
  error: string;
};
