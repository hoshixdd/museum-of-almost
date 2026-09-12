const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?){1,2}\d{4}/;
const HATE =
  /\b(kill\s+all|hate\s+crime|racial\s+slur|gas\s+the|lynch)\b/i;
const SEXUAL_EXPLICIT =
  /\b(child\s+porn|csam|underage\s+sex|sexual\s+content\s+involving\s+minors)\b/i;
const THREAT = /\b(i\s+will\s+kill\s+you|bomb\s+threat|shoot\s+up)\b/i;
const DOXX =
  /\b(here\s+is\s+their\s+address|ssn\b|social\s+security|home\s+address\s+is)\b/i;

export function moderateText(raw: string): { ok: true } | { ok: false; reason: string } {
  const text = raw.trim();
  if (text.length < 8) return { ok: false, reason: "Please write a little more. Short notes disappear too quickly here." };
  if (text.length > 4000) return { ok: false, reason: "This piece is too long for a single artifact. Try 4,000 characters or fewer." };
  if (EMAIL.test(text)) return { ok: false, reason: "Please remove email addresses. This museum stays anonymous." };
  if (PHONE.test(text) && (text.match(/\d/g) ?? []).length >= 10) {
    return { ok: false, reason: "Please remove phone numbers or other personal contact details." };
  }
  if (SEXUAL_EXPLICIT.test(text)) return { ok: false, reason: "This cannot be preserved here." };
  if (HATE.test(text) || THREAT.test(text)) return { ok: false, reason: "Threats and hate have no place in these rooms." };
  if (DOXX.test(text)) return { ok: false, reason: "Do not share anyone’s private information." };
  return { ok: true };
}

export function sanitizeLocation(value?: string | null) {
  if (!value) return null;
  const city = value.trim().replace(/\s+/g, " ");
  if (!city) return null;
  return city.slice(0, 48);
}

export function clampYear(year?: number | null) {
  if (year == null || Number.isNaN(year)) return null;
  if (year < 1950 || year > 2026) return null;
  return year;
}
