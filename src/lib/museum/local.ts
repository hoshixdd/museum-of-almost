const ANON_KEY = "museum.anonymousId";
const FAVORITES_KEY = "museum.favorites";
const CODES_KEY = "museum.codes";
const ENTERED_KEY = "museum.hasEntered";
const REACTED_KEY = "museum.reacted";
const PACT_KEY = "museum.pact";
const AGE_KEY = "museum.age16";
const NEEDED_KEY = "museum.neededSeen";

export type FavoriteRef = { kind: string; id: number };
export type ClaimRef = { kind: string; id: number; code: string; title?: string };

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAnonymousId() {
  if (typeof window === "undefined") return "visitor";
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    id = `VISITOR-${rand}`;
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

export function hasEnteredMuseum() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ENTERED_KEY) === "1";
}

export function markEnteredMuseum() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ENTERED_KEY, "1");
}

export function hasAcceptedPact() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PACT_KEY) === "1" && localStorage.getItem(AGE_KEY) === "1";
}

export function acceptPact() {
  if (typeof window === "undefined") return;
  localStorage.setItem(PACT_KEY, "1");
  localStorage.setItem(AGE_KEY, "1");
}

export function listFavorites(): FavoriteRef[] {
  return readJson<FavoriteRef[]>(FAVORITES_KEY, []);
}

export function isFavorite(kind: string, id: number) {
  return listFavorites().some((item) => item.kind === kind && item.id === id);
}

export function toggleFavorite(kind: string, id: number) {
  const current = listFavorites();
  const exists = current.some((item) => item.kind === kind && item.id === id);
  const next = exists
    ? current.filter((item) => !(item.kind === kind && item.id === id))
    : [...current, { kind, id }];
  writeJson(FAVORITES_KEY, next);
  return !exists;
}

export function rememberCode(kind: string, id: number, code: string, title?: string) {
  const current = readJson<Record<string, ClaimRef>>(CODES_KEY, {});
  current[`${kind}:${id}`] = { kind, id, code, title };
  writeJson(CODES_KEY, current);
}

export function getCode(kind: string, id: number) {
  const current = readJson<Record<string, ClaimRef>>(CODES_KEY, {});
  const entry = current[`${kind}:${id}`];
  if (entry && typeof entry === "object" && "code" in entry) return entry.code;
  if (typeof entry === "string") return entry;
  return "";
}

export function listClaims(): ClaimRef[] {
  const current = readJson<Record<string, ClaimRef | string>>(CODES_KEY, {});
  return Object.values(current)
    .map((entry) => {
      if (typeof entry === "string") return null;
      return entry;
    })
    .filter((entry): entry is ClaimRef => Boolean(entry));
}

export function forgetClaim(kind: string, id: number) {
  const current = readJson<Record<string, ClaimRef>>(CODES_KEY, {});
  delete current[`${kind}:${id}`];
  writeJson(CODES_KEY, current);
}

export function hasReacted(kind: string, id: number, reaction: string) {
  const current = readJson<string[]>(REACTED_KEY, []);
  return current.includes(`${kind}:${id}:${reaction}`);
}

export function markReacted(kind: string, id: number, reaction: string) {
  const current = readJson<string[]>(REACTED_KEY, []);
  const key = `${kind}:${id}:${reaction}`;
  if (current.includes(key)) return false;
  writeJson(REACTED_KEY, [...current, key]);
  return true;
}

export function seenNeededIds() {
  return readJson<number[]>(NEEDED_KEY, []);
}

export function rememberNeededId(id: number) {
  const next = [...new Set([...seenNeededIds(), id])].slice(-24);
  writeJson(NEEDED_KEY, next);
  return next;
}

const HALL_INTRO_KEY = "museum.hallIntro";

export function hasSeenHallIntro() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(HALL_INTRO_KEY) === "1";
}

export function markHallIntro() {
  if (typeof window === "undefined") return;
  localStorage.setItem(HALL_INTRO_KEY, "1");
}
