const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?){1,2}\d{4}/;
const URLS = /\bhttps?:\/\/|\bwww\.[a-z0-9-]+\.[a-z]{2,}\b/i;
const STREET =
  /\b(\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|place|pl)\b)|(apt\.?\s?\d+|unit\s+\d+)/i;
const HATE =
  /\b(kill\s+all|hate\s+crime|racial\s+slur|gas\s+the|lynch|nazi|white\s+power)\b/i;
const SEXUAL_EXPLICIT =
  /\b(child\s+porn|csam|underage\s+sex|sexual\s+content\s+involving\s+minors|cp\s+of)\b/i;
const THREAT = /\b(i\s+will\s+kill\s+you|bomb\s+threat|shoot\s+up|i'll\s+kill\s+you)\b/i;
const DOXX =
  /\b(here\s+is\s+their\s+address|ssn\b|social\s+security|home\s+address\s+is|doxx)\b/i;
const ADVICE = /\b(you should|you need to|just get over|kill yourself|kys)\b/i;

const CRISIS =
  /\b(kill myself|killing myself|end my life|take my life|suicide|suicidal|i want to die|i wanna die|want to disappear forever|better off dead|hang myself|cut myself|self[- ]harm|kms)\b/i;

export type ModerateResult =
  | { ok: true }
  | { ok: false; reason: string; crisis?: boolean };

export function isCrisisText(raw: string) {
  return CRISIS.test(raw);
}

export function moderateText(raw: string, options?: { min?: number; max?: number }): ModerateResult {
  const text = raw.trim();
  const min = options?.min ?? 8;
  const max = options?.max ?? 4000;
  if (text.length < min) {
    return { ok: false, reason: "Please write a little more. Short notes disappear too quickly here." };
  }
  if (text.length > max) {
    return { ok: false, reason: "This piece is too long for a single artifact. Try 4,000 characters or fewer." };
  }
  if (CRISIS.test(text)) {
    return {
      ok: false,
      crisis: true,
      reason:
        "If you are in danger, please stop and get help before leaving this here. Contact local emergency services or Find a Helpline. The museum cannot intervene.",
    };
  }
  if (EMAIL.test(text)) return { ok: false, reason: "Please remove email addresses. This museum stays anonymous." };
  if (PHONE.test(text) && (text.match(/\d/g) ?? []).length >= 10) {
    return { ok: false, reason: "Please remove phone numbers or other personal contact details." };
  }
  if (STREET.test(text)) {
    return { ok: false, reason: "Please keep places to a city or region — never a street or apartment." };
  }
  if (URLS.test(text)) return { ok: false, reason: "Please leave links out. This is not a noticeboard." };
  if (SEXUAL_EXPLICIT.test(text)) return { ok: false, reason: "This cannot be preserved here." };
  if (HATE.test(text) || THREAT.test(text)) return { ok: false, reason: "Threats and hate have no place in these rooms." };
  if (DOXX.test(text)) return { ok: false, reason: "Do not share anyone’s private information." };
  return { ok: true };
}

export function moderateAdvice(raw: string): ModerateResult {
  const check = moderateText(raw, { min: 2, max: 180 });
  if (!check.ok) return check;
  if (ADVICE.test(raw)) {
    return {
      ok: false,
      reason: "This wall is for recognition, not advice or judgment. Try a quieter sentence.",
    };
  }
  return { ok: true };
}

export function sanitizeLocation(value?: string | null) {
  if (!value) return null;
  const city = value.trim().replace(/\s+/g, " ");
  if (!city) return null;
  if (STREET.test(city) || EMAIL.test(city) || PHONE.test(city)) return null;
  if (/\d{3,}/.test(city)) return null;
  return city.slice(0, 48);
}

export function clampYear(year?: number | null) {
  if (year == null || Number.isNaN(year)) return null;
  if (year < 1950 || year > 2026) return null;
  return year;
}

export function localHourFromOffset(offsetMinutes?: number) {
  if (offsetMinutes == null || Number.isNaN(offsetMinutes)) return null;
  if (offsetMinutes < -14 * 60 || offsetMinutes > 14 * 60) return null;
  const utc = Date.now();
  const local = new Date(utc - offsetMinutes * 60_000);
  return local.getUTCHours();
}
