# The Museum of Almost

An anonymous digital museum for unsent letters, almost-lives, time capsules, and the things people still carry. Built for late nights — 16 through 29.

Leave a letter. Wander the rooms. Or just sit.

**Code:** [github.com/hoshixdd/museum-of-almost](https://github.com/hoshixdd/museum-of-almost)

**Live:** [museum-of-almost.vercel.app](https://museum-of-almost.vercel.app)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hoshixdd/museum-of-almost)

## What’s here

- **Unsent Archive** — letters that were never sent
- **Almost Lives** — versions of us that stayed imaginary
- **Time Vault** — notes locked until later
- **Voice Room** — spoken letters, read aloud in the browser (not recordings)
- **Human Library** — anonymous lives, bound as books
- **Emotion Map** — feeling, city by city
- **Stranger Wall** — quiet replies, no advice
- **Need to hear** — one artifact, chosen without ranking
- **Kept / Your desk** — this-device favorites and claim slips so you can shred what you left

No accounts. No likes. No ranking. 16+.

## Stack (all free-plan)

- TanStack Start + React 19
- Tailwind CSS v4
- Cloud Postgres via [Neon](https://neon.tech) (Hobby) with a local PGLite fallback
- [Vercel](https://vercel.com) Hobby

No Supabase. No paid APIs required. The Curator uses xAI when a key is present, and falls back to keyword search when it is not.

## Database (free)

| Where | Database |
| --- | --- |
| Preview / local | PGLite if `DATABASE_URL` is unset |
| Production | Free Neon Postgres. Migrations run on build. |

In Vercel → Project → Settings → Environment Variables:

- `DATABASE_URL` — Neon connection string (required or letters vanish)
- `VITE_AUTH_ENABLED` = `false`
- `XAI_API_KEY` — optional, only for The Curator

## Share it

1. Open the Vercel project.
2. Settings → Deployment Protection → turn **Vercel Authentication** off so anyone can visit.
3. Settings → Git → connect [hoshixdd/museum-of-almost](https://github.com/hoshixdd/museum-of-almost) so every push deploys.
4. Add a free Neon `DATABASE_URL`.

## Safety

The museum is anonymous and world-readable. Don’t include names, addresses, or anyone’s private information. Crisis writing is not published — use local emergency services or [Find a Helpline](https://findahelpline.com/). Claim slips let you shred your own pieces. Reports from several visitors can hide a piece; seed stories stay.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
```
