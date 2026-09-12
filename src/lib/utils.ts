import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function catalogNumber(prefix: string, id: number) {
  return `${prefix} № ${String(id).padStart(6, "0")}`;
}

export function formatYear(year?: number | null) {
  if (!year) return "Year unknown";
  return String(year);
}

export function formatLocation(location?: string | null) {
  const value = location?.trim();
  if (!value) return "Unknown location";
  return value;
}

export function excerpt(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

export function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateSpeechSeconds(text: string) {
  const words = wordCount(text);
  return Math.max(8, Math.round((words / 130) * 60));
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function isMidnightHour(iso: string) {
  const hour = new Date(iso).getUTCHours();
  return hour >= 0 && hour < 5;
}
