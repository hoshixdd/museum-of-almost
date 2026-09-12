const ANON_KEY = "museum.anonymousId";
const FAVORITES_KEY = "museum.favorites";
const CODES_KEY = "museum.codes";
const ENTERED_KEY = "museum.hasEntered";
const REACTED_KEY = "museum.reacted";

export type FavoriteRef = { kind: string; id: number };

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
  return sessionStorage.getItem(ENTERED_KEY) === "1";
}

export function markEnteredMuseum() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ENTERED_KEY, "1");
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

export function rememberCode(kind: "capsule" | "book", id: number, code: string) {
  const current = readJson<Record<string, string>>(CODES_KEY, {});
  current[`${kind}:${id}`] = code;
  writeJson(CODES_KEY, current);
}

export function getCode(kind: "capsule" | "book", id: number) {
  const current = readJson<Record<string, string>>(CODES_KEY, {});
  return current[`${kind}:${id}`] ?? "";
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
