import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { estimateSpeechSeconds, excerpt } from "@/lib/utils";
import {
  CAPSULE_RECIPIENTS,
  EMOTIONS,
  LIFE_CATEGORIES,
  MAP_CITIES,
  MEMORY_CATEGORIES,
  VOICE_CATEGORIES,
} from "./constants";
import {
  clampYear,
  localHourFromOffset,
  moderateAdvice,
  moderateText,
  sanitizeLocation,
} from "./moderate";
import { allowRate, codesMatch, getVisitorId, issueCode } from "./visitor.server";
import type {
  AlmostLife,
  Book,
  Capsule,
  CuratorReply,
  EmotionMap,
  Memory,
  MuseumStats,
  Voice,
  WallPost,
  WriteResult,
} from "./types";

const HIDE_AFTER = 5;
const LIST_LIMIT = 60;
let seeded = false;
let aiWindowStart = 0;
let aiCalls = 0;

function iso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function num(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function bool(value: unknown) {
  return value === true || value === "t" || value === "true";
}

function allowAi() {
  const now = Date.now();
  if (now - aiWindowStart > 10 * 60 * 1000) {
    aiWindowStart = now;
    aiCalls = 0;
  }
  if (aiCalls >= 36) return false;
  aiCalls += 1;
  return true;
}

async function busy(action: string, limit: number): Promise<WriteResult | null> {
  const ok = await allowRate(action, limit);
  if (ok) return null;
  return { ok: false, error: "The desk is busy. Please wait a little before trying again." };
}

function failMod(check: { ok: false; reason: string; crisis?: boolean }): WriteResult {
  return { ok: false, error: check.reason, crisis: check.crisis };
}

async function ensureSeed() {
  if (seeded) return;
  const sql = await getSql();
  const existing = await sql<{ n: number }>`select count(*)::int as n from memories`;
  if (num(existing[0]?.n) > 0) {
    seeded = true;
    return;
  }
  try {
    const flag = await sql<{ key: string }>`
      insert into museum_meta (key, value) values ('seeded', '1')
      on conflict (key) do nothing
      returning key
    `;
    if (!flag[0]) {
      seeded = true;
      return;
    }
  } catch {
    /* museum_meta may not exist yet on a brand-new migrate; continue seeding */
  }
  const data = await import("./seed-data.server");
  for (const item of data.SEED_MEMORIES) {
    const hour = new Date(item.created).getUTCHours();
    await sql`
      insert into memories (
        title, content, category, emotion, year, location, anonymous_id, created_at, is_seed, views, local_hour
      ) values (
        ${item.title}, ${item.content}, ${item.category}, ${item.emotion}, ${item.year},
        ${item.location}, ${"seed"}, ${item.created}, ${true}, ${Math.floor(Math.random() * 40)}, ${hour}
      )
    `;
  }
  for (const item of data.SEED_LIVES) {
    await sql`
      insert into almost_lives (
        title, story, category, age, location, career, relationship, dream, anonymous_id, is_seed
      ) values (
        ${item.title}, ${item.story}, ${item.category}, ${item.age}, ${item.location},
        ${item.career}, ${item.relationship}, ${item.dream}, ${"seed"}, ${true}
      )
    `;
  }
  for (const item of data.SEED_CAPSULES) {
    await sql`
      insert into capsules (
        title, content, unlock_at, privacy, recipient, anonymous_id, is_seed, opened
      ) values (
        ${item.title}, ${item.content}, ${item.unlockAt}, ${item.privacy}, ${item.recipient},
        ${"seed"}, ${true}, ${new Date(item.unlockAt).getTime() < Date.now()}
      )
    `;
  }
  for (const item of data.SEED_VOICES) {
    await sql`
      insert into voices (title, transcript, category, duration_sec, anonymous_id, is_seed)
      values (${item.title}, ${item.transcript}, ${item.category}, ${item.durationSec}, ${"seed"}, ${true})
    `;
  }
  for (const item of data.SEED_BOOKS) {
    await sql`
      insert into books (
        title, chapter_before, chapter_moment, chapter_change, chapter_after, edit_code, anonymous_id, is_seed
      ) values (
        ${item.title}, ${item.chapterBefore}, ${item.chapterMoment}, ${item.chapterChange},
        ${item.chapterAfter}, ${issueCode()}, ${"seed"}, ${true}
      )
    `;
  }
  for (const item of data.SEED_WALL) {
    const inserted = await sql<{ id: number }>`
      insert into wall_posts (content, emotion, anonymous_id, is_seed)
      values (${item.content}, ${item.emotion}, ${"seed"}, ${true})
      returning id
    `;
    const wallId = inserted[0]?.id;
    if (!wallId) continue;
    for (const reply of item.replies) {
      await sql`insert into replies (wall_id, content) values (${wallId}, ${reply})`;
    }
  }
  seeded = true;
}

function mapMemory(row: Record<string, unknown>): Memory {
  return {
    id: num(row.id),
    title: String(row.title),
    content: String(row.content),
    category: row.category as Memory["category"],
    emotion: row.emotion as Memory["emotion"],
    year: row.year == null ? null : num(row.year),
    location: row.location ? String(row.location) : null,
    createdAt: iso(row.created_at),
    views: num(row.views),
    neededCount: num(row.needed_count),
    understandCount: num(row.understand_count),
    remindedCount: num(row.reminded_count),
  };
}

function mapLife(row: Record<string, unknown>): AlmostLife {
  return {
    id: num(row.id),
    title: String(row.title),
    story: String(row.story),
    category: row.category as AlmostLife["category"],
    age: row.age == null ? null : num(row.age),
    location: row.location ? String(row.location) : null,
    career: row.career ? String(row.career) : null,
    relationship: row.relationship ? String(row.relationship) : null,
    dream: row.dream ? String(row.dream) : null,
    createdAt: iso(row.created_at),
    views: num(row.views),
    neededCount: num(row.needed_count),
    understandCount: num(row.understand_count),
    remindedCount: num(row.reminded_count),
  };
}

function mapVoice(row: Record<string, unknown>): Voice {
  return {
    id: num(row.id),
    title: String(row.title),
    transcript: String(row.transcript),
    category: row.category as Voice["category"],
    durationSec: num(row.duration_sec),
    createdAt: iso(row.created_at),
    listens: num(row.listens),
    neededCount: num(row.needed_count),
  };
}

function mapBook(row: Record<string, unknown>, canEdit = false): Book {
  return {
    id: num(row.id),
    title: String(row.title),
    chapterBefore: String(row.chapter_before ?? ""),
    chapterMoment: String(row.chapter_moment ?? ""),
    chapterChange: String(row.chapter_change ?? ""),
    chapterAfter: String(row.chapter_after ?? ""),
    createdAt: iso(row.created_at),
    views: num(row.views),
    canEdit,
  };
}

function mapCapsule(row: Record<string, unknown>, reveal: boolean): Capsule {
  const unlockAt = iso(row.unlock_at);
  const locked = new Date(unlockAt).getTime() > Date.now();
  const privacy = row.privacy === "private" ? "private" : "public";
  return {
    id: num(row.id),
    title: String(row.title),
    content: locked || (!reveal && privacy === "private") ? null : String(row.content),
    unlockAt,
    privacy,
    recipient: privacy === "private" && !reveal ? "sealed" : (row.recipient as Capsule["recipient"]),
    createdAt: iso(row.created_at),
    locked,
    opened: bool(row.opened),
  };
}

export const getMuseumStats = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeed();
  const sql = await getSql();
  const [memories, lives, capsules, voices, books, wall] = await Promise.all([
    sql<{ n: number }>`select count(*)::int as n from memories where hidden = false`,
    sql<{ n: number }>`select count(*)::int as n from almost_lives where hidden = false`,
    sql<{ n: number }>`select count(*)::int as n from capsules where hidden = false`,
    sql<{ n: number }>`select count(*)::int as n from voices where hidden = false`,
    sql<{ n: number }>`select count(*)::int as n from books where hidden = false`,
    sql<{ n: number }>`select count(*)::int as n from wall_posts where hidden = false`,
  ]);
  const counts = {
    memories: num(memories[0]?.n),
    lives: num(lives[0]?.n),
    capsules: num(capsules[0]?.n),
    voices: num(voices[0]?.n),
    books: num(books[0]?.n),
    wall: num(wall[0]?.n),
  };
  const stats: MuseumStats = {
    ...counts,
    artifacts:
      counts.memories + counts.lives + counts.capsules + counts.voices + counts.books + counts.wall,
  };
  return stats;
});

const listMemoriesInput = z.object({
  category: z.string().optional(),
  emotion: z.string().optional(),
  location: z.string().optional(),
  query: z.string().optional(),
  midnight: z.boolean().optional(),
  forgotten: z.boolean().optional(),
  favoritesOnly: z.array(z.number()).max(80).optional(),
});

export const listMemories = createServerFn({ method: "GET" })
  .validator((input: unknown) => listMemoriesInput.parse(input ?? {}))
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    let rows = await sql<Record<string, unknown>>`
      select id, title, left(content, 320) as content, category, emotion, year, location,
             created_at, views, needed_count, understand_count, reminded_count, local_hour
      from memories where hidden = false order by created_at desc limit ${LIST_LIMIT * 2}
    `;
    if (data.category) rows = rows.filter((row) => row.category === data.category);
    if (data.emotion) rows = rows.filter((row) => row.emotion === data.emotion);
    if (data.location) {
      const city = data.location.toLowerCase();
      rows = rows.filter((row) => String(row.location ?? "").toLowerCase() === city);
    }
    if (data.query) {
      const q = data.query.toLowerCase();
      rows = rows.filter((row) =>
        `${row.title} ${row.content} ${row.location ?? ""}`.toLowerCase().includes(q),
      );
    }
    if (data.midnight) {
      rows = rows.filter((row) => {
        const hour = row.local_hour == null ? null : num(row.local_hour);
        return hour != null && hour < 5;
      });
    }
    if (data.forgotten) {
      const month = new Date().getUTCMonth();
      rows = rows
        .slice()
        .sort(
          (a, b) =>
            num(a.needed_count) + num(a.understand_count) - (num(b.needed_count) + num(b.understand_count)) ||
            num(a.views) - num(b.views) ||
            num(a.id) - num(b.id),
        )
        .filter((_, index) => (index + month) % 3 !== 0)
        .slice(0, 8);
    }
    if (data.favoritesOnly) {
      const ids = new Set(data.favoritesOnly);
      rows = rows.filter((row) => ids.has(num(row.id)));
    }
    return rows.slice(0, LIST_LIMIT).map(mapMemory);
  });

export const getMemory = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ id: z.number() }).parse(input))
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from memories where id = ${data.id} and hidden = false
    `;
    return rows[0] ? mapMemory(rows[0]) : null;
  });

export const getRandomMemory = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ exclude: z.array(z.number()).max(24).optional() }).parse(input ?? {}))
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from memories where hidden = false order by random() limit 16
    `;
    const skip = new Set(data.exclude ?? []);
    const picked = rows.find((row) => !skip.has(num(row.id))) ?? rows[0];
    return picked ? mapMemory(picked) : null;
  });

export const createMemory = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      title: z.string().min(2).max(120),
      content: z.string().min(8).max(4000),
      category: z.enum(MEMORY_CATEGORIES),
      emotion: z.enum(EMOTIONS),
      year: z.number().optional(),
      location: z.string().optional(),
      offsetMinutes: z.number().optional(),
    }).parse(input),
  )
  .handler(async ({ data }): Promise<WriteResult> => {
    const limited = await busy("write", 6);
    if (limited) return limited;
    const check = moderateText(`${data.title}\n${data.content}`);
    if (!check.ok) return failMod(check);
    const sql = await getSql();
    const code = issueCode();
    const hour = localHourFromOffset(data.offsetMinutes);
    const rows = await sql<{ id: number }>`
      insert into memories (title, content, category, emotion, year, location, anonymous_id, delete_code, local_hour)
      values (
        ${data.title.trim()}, ${data.content.trim()}, ${data.category}, ${data.emotion},
        ${clampYear(data.year)}, ${sanitizeLocation(data.location)}, ${getVisitorId()}, ${code}, ${hour}
      )
      returning id
    `;
    return { ok: true, id: rows[0].id, deleteCode: code };
  });

export const listLives = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ category: z.string().optional() }).parse(input ?? {}))
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    let rows = await sql<Record<string, unknown>>`
      select id, title, left(story, 320) as story, category, age, location, career, relationship, dream,
             created_at, views, needed_count, understand_count, reminded_count
      from almost_lives where hidden = false order by created_at desc limit ${LIST_LIMIT}
    `;
    if (data.category) rows = rows.filter((row) => row.category === data.category);
    return rows.map(mapLife);
  });

export const getLife = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ id: z.number() }).parse(input))
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from almost_lives where id = ${data.id} and hidden = false
    `;
    return rows[0] ? mapLife(rows[0]) : null;
  });

export const createLife = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      title: z.string().min(2).max(120),
      story: z.string().min(8).max(4000),
      category: z.enum(LIFE_CATEGORIES),
      age: z.number().min(1).max(120).optional(),
      location: z.string().optional(),
      career: z.string().max(120).optional(),
      relationship: z.string().max(160).optional(),
      dream: z.string().max(200).optional(),
    }).parse(input),
  )
  .handler(async ({ data }): Promise<WriteResult> => {
    const limited = await busy("write", 6);
    if (limited) return limited;
    const check = moderateText(
      `${data.title}\n${data.story}\n${data.career ?? ""}\n${data.relationship ?? ""}\n${data.dream ?? ""}`,
    );
    if (!check.ok) return failMod(check);
    const sql = await getSql();
    const code = issueCode();
    const rows = await sql<{ id: number }>`
      insert into almost_lives (
        title, story, category, age, location, career, relationship, dream, anonymous_id, delete_code
      ) values (
        ${data.title.trim()}, ${data.story.trim()}, ${data.category}, ${data.age ?? null},
        ${sanitizeLocation(data.location)}, ${data.career?.trim() || null},
        ${data.relationship?.trim() || null}, ${data.dream?.trim() || null},
        ${getVisitorId()}, ${code}
      )
      returning id
    `;
    return { ok: true, id: rows[0].id, deleteCode: code };
  });

export const listCapsules = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeed();
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select * from capsules where hidden = false order by unlock_at asc limit ${LIST_LIMIT}
  `;
  return rows.map((row) => mapCapsule(row, false));
});

export const getCapsule = createServerFn({ method: "GET" })
  .validator((input: unknown) =>
    z.object({ id: z.number(), accessCode: z.string().optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from capsules where id = ${data.id} and hidden = false
    `;
    const row = rows[0];
    if (!row) return { ok: false as const, error: "This capsule is not in the vault." };
    const privacy = row.privacy === "private" ? "private" : "public";
    const locked = new Date(iso(row.unlock_at)).getTime() > Date.now();
    if (privacy === "private") {
      const code = String(row.access_code ?? "");
      if (!codesMatch(code, data.accessCode ?? "")) {
        return { ok: true as const, capsule: mapCapsule(row, false) };
      }
    }
    if (!locked) {
      await sql`update capsules set opened = true where id = ${data.id}`;
    }
    return { ok: true as const, capsule: mapCapsule(row, true) };
  });

export const createCapsule = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      title: z.string().min(2).max(120),
      content: z.string().min(8).max(4000),
      unlockAt: z.string().min(8),
      privacy: z.enum(["public", "private"]),
      recipient: z.enum(CAPSULE_RECIPIENTS),
    }).parse(input),
  )
  .handler(async ({ data }): Promise<WriteResult> => {
    const limited = await busy("write", 6);
    if (limited) return limited;
    const check = moderateText(`${data.title}\n${data.content}`);
    if (!check.ok) return failMod(check);
    const unlock = new Date(data.unlockAt);
    if (Number.isNaN(unlock.getTime()) || unlock.getTime() < Date.now() + 60_000) {
      return { ok: false, error: "Choose an unlock date in the future." };
    }
    const code = data.privacy === "private" ? issueCode() : issueCode();
    const access = data.privacy === "private" ? issueCode() : null;
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      insert into capsules (title, content, unlock_at, privacy, recipient, access_code, anonymous_id, delete_code)
      values (
        ${data.title.trim()}, ${data.content.trim()}, ${unlock.toISOString()}, ${data.privacy},
        ${data.recipient}, ${access}, ${getVisitorId()}, ${code}
      )
      returning id
    `;
    return { ok: true, id: rows[0].id, deleteCode: code, accessCode: access };
  });

export const listVoices = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ category: z.string().optional() }).parse(input ?? {}))
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    let rows = await sql<Record<string, unknown>>`
      select id, title, left(transcript, 320) as transcript, category, duration_sec, created_at, listens, needed_count
      from voices where hidden = false order by created_at desc limit ${LIST_LIMIT}
    `;
    if (data.category) rows = rows.filter((row) => row.category === data.category);
    return rows.map(mapVoice);
  });

export const getVoice = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ id: z.number() }).parse(input))
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from voices where id = ${data.id} and hidden = false
    `;
    return rows[0] ? mapVoice(rows[0]) : null;
  });

export const createVoice = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      title: z.string().min(2).max(120),
      transcript: z.string().min(8).max(4000),
      category: z.enum(VOICE_CATEGORIES),
    }).parse(input),
  )
  .handler(async ({ data }): Promise<WriteResult> => {
    const limited = await busy("write", 6);
    if (limited) return limited;
    const check = moderateText(`${data.title}\n${data.transcript}`);
    if (!check.ok) return failMod(check);
    const sql = await getSql();
    const duration = estimateSpeechSeconds(data.transcript);
    const code = issueCode();
    const rows = await sql<{ id: number }>`
      insert into voices (title, transcript, category, duration_sec, anonymous_id, delete_code)
      values (
        ${data.title.trim()}, ${data.transcript.trim()}, ${data.category}, ${duration},
        ${getVisitorId()}, ${code}
      )
      returning id
    `;
    return { ok: true, id: rows[0].id, deleteCode: code };
  });

export const listBooks = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeed();
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select id, title, chapter_before, chapter_moment, chapter_change, chapter_after, created_at, views
    from books where hidden = false order by created_at desc limit ${LIST_LIMIT}
  `;
  return rows.map((row) => mapBook(row));
});

export const getBook = createServerFn({ method: "GET" })
  .validator((input: unknown) =>
    z.object({ id: z.number(), editCode: z.string().optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql<Record<string, unknown>>`
      select * from books where id = ${data.id} and hidden = false
    `;
    const row = rows[0];
    if (!row) return null;
    const canEdit = codesMatch(String(row.edit_code ?? ""), data.editCode ?? "");
    return mapBook(row, canEdit);
  });

export const createBook = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      title: z.string().min(2).max(120),
      chapterBefore: z.string().max(2000).optional(),
      chapterMoment: z.string().max(2000).optional(),
      chapterChange: z.string().max(2000).optional(),
      chapterAfter: z.string().max(2000).optional(),
    }).parse(input),
  )
  .handler(async ({ data }): Promise<WriteResult> => {
    const limited = await busy("write", 6);
    if (limited) return limited;
    const chapters = [data.chapterBefore, data.chapterMoment, data.chapterChange, data.chapterAfter].filter(
      (part) => (part ?? "").trim().length >= 8,
    );
    if (chapters.length < 2) {
      return { ok: false, error: "Write at least two chapters before placing the book." };
    }
    const body = [data.title, data.chapterBefore, data.chapterMoment, data.chapterChange, data.chapterAfter]
      .filter(Boolean)
      .join("\n");
    const check = moderateText(body);
    if (!check.ok) return failMod(check);
    const code = issueCode();
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      insert into books (
        title, chapter_before, chapter_moment, chapter_change, chapter_after, edit_code, anonymous_id
      ) values (
        ${data.title.trim()}, ${data.chapterBefore?.trim() ?? ""}, ${data.chapterMoment?.trim() ?? ""},
        ${data.chapterChange?.trim() ?? ""}, ${data.chapterAfter?.trim() ?? ""}, ${code},
        ${getVisitorId()}
      )
      returning id
    `;
    return { ok: true, id: rows[0].id, editCode: code, deleteCode: code };
  });

export const updateBook = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      id: z.number(),
      editCode: z.string().min(4),
      title: z.string().min(2).max(120),
      chapterBefore: z.string().max(2000),
      chapterMoment: z.string().max(2000),
      chapterChange: z.string().max(2000),
      chapterAfter: z.string().max(2000),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const check = moderateText(
      `${data.title}\n${data.chapterBefore}\n${data.chapterMoment}\n${data.chapterChange}\n${data.chapterAfter}`,
    );
    if (!check.ok) return { ok: false as const, error: check.reason, crisis: check.crisis };
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      update books
      set title = ${data.title.trim()},
          chapter_before = ${data.chapterBefore},
          chapter_moment = ${data.chapterMoment},
          chapter_change = ${data.chapterChange},
          chapter_after = ${data.chapterAfter}
      where id = ${data.id} and edit_code = ${data.editCode} and hidden = false
      returning id
    `;
    if (!rows[0]) return { ok: false as const, error: "This library card does not open that book." };
    return { ok: true as const, id: rows[0].id };
  });

export const listWall = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeed();
  const sql = await getSql();
  const posts = await sql<Record<string, unknown>>`
    select * from wall_posts where hidden = false order by created_at desc limit 40
  `;
  const replies = await sql<Record<string, unknown>>`
    select * from replies where hidden = false order by created_at asc
  `;
  const grouped = new Map<number, WallPost["replies"]>();
  for (const reply of replies) {
    const wallId = num(reply.wall_id);
    const list = grouped.get(wallId) ?? [];
    if (list.length >= 12) continue;
    list.push({ id: num(reply.id), content: String(reply.content), createdAt: iso(reply.created_at) });
    grouped.set(wallId, list);
  }
  return posts.map((post) => ({
    id: num(post.id),
    content: String(post.content),
    emotion: post.emotion ? (post.emotion as WallPost["emotion"]) : null,
    createdAt: iso(post.created_at),
    understandCount: num(post.understand_count),
    replies: grouped.get(num(post.id)) ?? [],
  })) satisfies WallPost[];
});

export const createWallPost = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      content: z.string().min(8).max(500),
      emotion: z.enum(EMOTIONS).optional(),
    }).parse(input),
  )
  .handler(async ({ data }): Promise<WriteResult> => {
    const limited = await busy("write", 6);
    if (limited) return limited;
    const check = moderateText(data.content, { min: 8, max: 500 });
    if (!check.ok) return failMod(check);
    const sql = await getSql();
    const code = issueCode();
    const rows = await sql<{ id: number }>`
      insert into wall_posts (content, emotion, anonymous_id, delete_code)
      values (${data.content.trim()}, ${data.emotion ?? null}, ${getVisitorId()}, ${code})
      returning id
    `;
    return { ok: true, id: rows[0].id, deleteCode: code };
  });

export const createReply = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      wallId: z.number(),
      content: z.string().min(2).max(180),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const limited = await busy("reply", 16);
    if (limited) return limited;
    const check = moderateAdvice(data.content);
    if (!check.ok) return { ok: false as const, error: check.reason, crisis: check.crisis };
    const sql = await getSql();
    const parent = await sql<{ id: number }>`
      select id from wall_posts where id = ${data.wallId} and hidden = false
    `;
    if (!parent[0]) return { ok: false as const, error: "That note is no longer on the wall." };
    await sql`insert into replies (wall_id, content) values (${data.wallId}, ${data.content.trim()})`;
    return { ok: true as const };
  });

export const createExitNote = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ content: z.string().min(8).max(400) }).parse(input))
  .handler(async ({ data }): Promise<WriteResult> => {
    const limited = await busy("write", 6);
    if (limited) return limited;
    const check = moderateText(data.content, { min: 8, max: 400 });
    if (!check.ok) return failMod(check);
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      insert into exit_notes (content) values (${data.content.trim()}) returning id
    `;
    return { ok: true, id: rows[0].id };
  });

export const listExitNotes = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeed();
  const sql = await getSql();
  const rows = await sql<{ id: number; content: string; created_at: unknown }>`
    select id, content, created_at from exit_notes where hidden = false order by created_at desc limit 24
  `;
  return rows.map((row) => ({
    id: num(row.id),
    content: row.content,
    createdAt: iso(row.created_at),
  }));
});

export const reactTo = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      kind: z.enum(["memory", "life", "voice", "wall"]),
      id: z.number(),
      reaction: z.enum(["needed", "understand", "reminded"]),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const limited = await busy("react", 40);
    if (limited) return { ok: false as const };
    const visitorId = getVisitorId();
    const sql = await getSql();
    const inserted = await sql<{ visitor_id: string }>`
      insert into visitor_reactions (visitor_id, kind, content_id, reaction)
      values (${visitorId}, ${data.kind}, ${data.id}, ${data.reaction})
      on conflict (visitor_id, kind, content_id, reaction) do nothing
      returning visitor_id
    `;
    if (!inserted[0]) return { ok: true as const };
    if (data.kind === "memory") {
      if (data.reaction === "needed") await sql`update memories set needed_count = needed_count + 1 where id = ${data.id}`;
      if (data.reaction === "understand") await sql`update memories set understand_count = understand_count + 1 where id = ${data.id}`;
      if (data.reaction === "reminded") await sql`update memories set reminded_count = reminded_count + 1 where id = ${data.id}`;
    } else if (data.kind === "life") {
      if (data.reaction === "needed") await sql`update almost_lives set needed_count = needed_count + 1 where id = ${data.id}`;
      if (data.reaction === "understand") await sql`update almost_lives set understand_count = understand_count + 1 where id = ${data.id}`;
      if (data.reaction === "reminded") await sql`update almost_lives set reminded_count = reminded_count + 1 where id = ${data.id}`;
    } else if (data.kind === "voice" && data.reaction === "needed") {
      await sql`update voices set needed_count = needed_count + 1 where id = ${data.id}`;
    } else if (data.kind === "wall" && data.reaction === "understand") {
      await sql`update wall_posts set understand_count = understand_count + 1 where id = ${data.id}`;
    }
    return { ok: true as const };
  });

export const reportContent = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      kind: z.enum(["memory", "life", "voice", "book", "wall", "capsule", "exit", "reply"]),
      id: z.number(),
      reason: z.string().min(2).max(80),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const limited = await busy("report", 8);
    if (limited && !limited.ok) return { ok: false as const, error: limited.error };
    const visitorId = getVisitorId();
    const sql = await getSql();
    const inserted = await sql<{ id: number }>`
      insert into reports (content_type, content_id, reason, visitor_id)
      values (${data.kind}, ${data.id}, ${data.reason}, ${visitorId})
      on conflict (visitor_id, content_type, content_id) do nothing
      returning id
    `;
    if (!inserted[0]) return { ok: true as const };
    if (data.kind === "memory") {
      await sql`update memories set report_count = report_count + 1, hidden = case when is_seed = false and report_count + 1 >= ${HIDE_AFTER} then true else hidden end where id = ${data.id}`;
    } else if (data.kind === "life") {
      await sql`update almost_lives set report_count = report_count + 1, hidden = case when is_seed = false and report_count + 1 >= ${HIDE_AFTER} then true else hidden end where id = ${data.id}`;
    } else if (data.kind === "voice") {
      await sql`update voices set report_count = report_count + 1, hidden = case when is_seed = false and report_count + 1 >= ${HIDE_AFTER} then true else hidden end where id = ${data.id}`;
    } else if (data.kind === "book") {
      await sql`update books set report_count = report_count + 1, hidden = case when is_seed = false and report_count + 1 >= ${HIDE_AFTER} then true else hidden end where id = ${data.id}`;
    } else if (data.kind === "capsule") {
      await sql`update capsules set report_count = report_count + 1, hidden = case when is_seed = false and report_count + 1 >= ${HIDE_AFTER} then true else hidden end where id = ${data.id}`;
    } else if (data.kind === "wall") {
      await sql`update wall_posts set report_count = report_count + 1, hidden = case when is_seed = false and report_count + 1 >= ${HIDE_AFTER} then true else hidden end where id = ${data.id}`;
    } else if (data.kind === "exit") {
      await sql`update exit_notes set report_count = report_count + 1, hidden = case when report_count + 1 >= ${HIDE_AFTER} then true else hidden end where id = ${data.id}`;
    } else {
      await sql`update replies set report_count = report_count + 1, hidden = case when report_count + 1 >= ${HIDE_AFTER} then true else hidden end where id = ${data.id}`;
    }
    return { ok: true as const };
  });

export const shredArtifact = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      kind: z.enum(["memory", "life", "voice", "book", "wall", "capsule"]),
      id: z.number(),
      code: z.string().min(4).max(80),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.kind === "memory") {
      const rows = await sql<{ id: number }>`
        update memories set hidden = true
        where id = ${data.id} and delete_code = ${data.code} and is_seed = false
        returning id
      `;
      if (!rows[0]) return { ok: false as const, error: "That claim slip does not match this letter." };
    } else if (data.kind === "life") {
      const rows = await sql<{ id: number }>`
        update almost_lives set hidden = true
        where id = ${data.id} and delete_code = ${data.code} and is_seed = false
        returning id
      `;
      if (!rows[0]) return { ok: false as const, error: "That claim slip does not match this life." };
    } else if (data.kind === "voice") {
      const rows = await sql<{ id: number }>`
        update voices set hidden = true
        where id = ${data.id} and delete_code = ${data.code} and is_seed = false
        returning id
      `;
      if (!rows[0]) return { ok: false as const, error: "That claim slip does not match this voice." };
    } else if (data.kind === "book") {
      const rows = await sql<{ id: number }>`
        update books set hidden = true
        where id = ${data.id} and edit_code = ${data.code} and is_seed = false
        returning id
      `;
      if (!rows[0]) return { ok: false as const, error: "That library card does not match this book." };
    } else if (data.kind === "wall") {
      const rows = await sql<{ id: number }>`
        update wall_posts set hidden = true
        where id = ${data.id} and delete_code = ${data.code} and is_seed = false
        returning id
      `;
      if (!rows[0]) return { ok: false as const, error: "That claim slip does not match this note." };
    } else {
      const rows = await sql<{ id: number }>`
        update capsules set hidden = true
        where id = ${data.id} and delete_code = ${data.code} and is_seed = false
        returning id
      `;
      if (!rows[0]) return { ok: false as const, error: "That claim slip does not match this capsule." };
    }
    return { ok: true as const };
  });

export const getEmotionMap = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeed();
  const sql = await getSql();
  const rows = await sql<{ location: string; n: number }>`
    select location, count(*)::int as n
    from memories
    where hidden = false and location is not null and location <> ''
    group by location
  `;
  const lifeRows = await sql<{ location: string; n: number }>`
    select location, count(*)::int as n
    from almost_lives
    where hidden = false and location is not null and location <> ''
    group by location
  `;
  const counts = new Map<string, number>();
  for (const row of [...rows, ...lifeRows]) {
    const key = row.location.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + num(row.n));
  }
  const known = new Set(MAP_CITIES.map((city) => city.city.toLowerCase()));
  const points = MAP_CITIES.map((city) => ({
    ...city,
    count: counts.get(city.city.toLowerCase()) ?? 0,
  }));
  const unplaced = [...counts.entries()]
    .filter(([city]) => !known.has(city))
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 24);
  const result: EmotionMap = { points, unplaced };
  return result;
});

async function curatorFallback(message: string): Promise<CuratorReply> {
  const sql = await getSql();
  const q = message.toLowerCase();
  const emotion = EMOTIONS.find((item) => q.includes(item.toLowerCase()));
  const rows = await sql<Record<string, unknown>>`
    select id, title, emotion, category, location, left(content, 160) as content
    from memories where hidden = false order by created_at desc limit 40
  `;
  const scored = rows
    .map((row) => {
      const hay = `${row.title} ${row.content} ${row.emotion} ${row.category} ${row.location ?? ""}`.toLowerCase();
      let score = 0;
      for (const word of q.split(/\s+/).filter((part) => part.length > 3)) {
        if (hay.includes(word)) score += 1;
      }
      if (emotion && String(row.emotion) === emotion) score += 3;
      return { row, score };
    })
    .sort((a, b) => b.score - a.score);
  const matches = scored.slice(0, 3).map(({ row }) => ({
    kind: "memory" as const,
    id: num(row.id),
    title: String(row.title),
    href: `/archive/${num(row.id)}`,
  }));
  return {
    ok: true,
    text: "I am only an attendant, not a doctor. Here are a few rooms that sit beside what you described. Stay as long as you need.",
    matches,
  };
}

export const askCurator = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      message: z.string().min(2).max(500),
      history: z.array(z.object({ role: z.enum(["user", "curator"]), text: z.string() })).max(8).optional(),
    }).parse(input),
  )
  .handler(async ({ data }): Promise<CuratorReply> => {
    const limited = await busy("curator", 10);
    if (limited && !limited.ok) return { ok: false, error: limited.error };
    const safety = moderateText(data.message, { min: 2, max: 500 });
    if (!safety.ok && safety.crisis) {
      return {
        ok: true,
        text: "If you are in danger, please contact local emergency services or Find a Helpline. I cannot intervene, and I am not a counselor. If you still want a quiet story to sit with, I can look — after you are safe.",
        matches: [],
      };
    }
    await ensureSeed();
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey || !allowAi()) return curatorFallback(data.message);
    const sql = await getSql();
    const memories = await sql<Record<string, unknown>>`
      select id, title, category, emotion, location, left(content, 110) as content
      from memories where hidden = false order by random() limit 18
    `;
    const catalog = memories
      .map((row) => {
        const id = num(row.id);
        return `#${id} [${row.emotion}/${row.category}${row.location ? `/${row.location}` : ""}] ${row.title} — ${excerpt(String(row.content), 110)}`;
      })
      .join("\n");
    const history = (data.history ?? []).map((item) => ({
      role: item.role === "curator" ? ("assistant" as const) : ("user" as const),
      content: item.text,
    }));
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 380,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are The Curator of The Museum of Almost, a quiet night attendant in an anonymous archive of things that almost happened. You help visitors discover stories. You are not a therapist, doctor, or crisis counselor. Never give medical advice. If someone is in danger, gently point them to local emergency services and findahelpline.com. Speak in short, warm, precise paragraphs. No emoji. No exclamation. When a catalog of artifacts is provided, you may recommend up to three by their #id. End recommendations with a line: MATCHES: 12, 4, 9 (ids only, or MATCHES: none).",
          },
          ...history,
          {
            role: "user",
            content: `Visitor: ${data.message}\n\nCatalog:\n${catalog}`,
          },
        ],
      }),
    });
    if (!res.ok) return curatorFallback(data.message);
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return curatorFallback(data.message);
    const matchLine = text.match(/MATCHES:\s*([^\n]+)/i);
    const spoken = text.replace(/\n*MATCHES:\s*[^\n]+/i, "").trim();
    const ids = (matchLine?.[1] ?? "")
      .split(/[, ]+/)
      .map((part) => Number(part.replace(/[^\d]/g, "")))
      .filter((id) => Number.isFinite(id) && id > 0);
    const byId = new Map(memories.map((row) => [num(row.id), row]));
    const matches = ids
      .map((id) => byId.get(id))
      .filter((row): row is Record<string, unknown> => Boolean(row))
      .slice(0, 3)
      .map((row) => ({
        kind: "memory" as const,
        id: num(row.id),
        title: String(row.title),
        href: `/archive/${num(row.id)}`,
      }));
    return { ok: true, text: spoken, matches };
  });

export const reflectOnWriting = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      title: z.string().max(120),
      emotion: z.string().max(40).optional(),
      room: z.string().max(40).optional(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const fallback = "You preserved something meaningful. It will sit here without being ranked.";
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey || !allowAi()) return { text: fallback };
    const limited = await allowRate("reflect", 12);
    if (!limited) return { text: fallback };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 80,
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "You are The Curator. Thank a visitor in two short sentences for leaving an anonymous artifact. Do not give advice. No emoji.",
          },
          {
            role: "user",
            content: `Room: ${data.room ?? "archive"}. Emotion: ${data.emotion ?? "unspecified"}. Title: ${data.title}`,
          },
        ],
      }),
    });
    if (!res.ok) return { text: fallback };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { text: body.choices?.[0]?.message?.content?.trim() || fallback };
  });
