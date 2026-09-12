import { randomBytes, timingSafeEqual } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";

const COOKIE = "museum_vid";

export function issueCode() {
  return `MUSEUM-${randomBytes(6).toString("hex").toUpperCase()}`;
}

export function codesMatch(left?: string | null, right?: string | null) {
  if (!left || !right) return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getVisitorId() {
  try {
    const existing = getCookie(COOKIE)?.trim();
    if (existing && existing.length >= 8 && existing.length <= 80) return existing;
    const next = `V${randomBytes(16).toString("hex")}`;
    setCookie(COOKIE, next, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
    });
    return next;
  } catch {
    return "anon";
  }
}

export async function allowRate(action: string, limit: number) {
  const visitorId = getVisitorId();
  const sql = await getSql();
  const rows = await sql<{ n: number }>`
    select count(*)::int as n
    from rate_events
    where visitor_id = ${visitorId}
      and action = ${action}
      and created_at > now() - interval '1 hour'
  `;
  const n = Number(rows[0]?.n ?? 0);
  if (n >= limit) return false;
  await sql`
    insert into rate_events (visitor_id, action) values (${visitorId}, ${action})
  `;
  return true;
}
