# The Museum of Almost

An anonymous digital museum for unsent letters, almost-lives, time capsules, and the things people still carry. Built for late nights — teens through late twenties.

Leave a letter. Wander the rooms. Or just sit.

**Code:** [github.com/hoshixdd/museum-of-almost](https://github.com/hoshixdd/museum-of-almost)

**Live:** [museum-of-almost-probablecause.vercel.app](https://museum-of-almost-probablecause.vercel.app)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hoshixdd/museum-of-almost)

## What’s here

- **Unsent Archive** — letters that were never sent
- **Almost Lives** — versions of us that stayed imaginary
- **Time Vault** — notes locked until later
- **Voice Room** — spoken memories, read aloud in the browser
- **Human Library** — anonymous lives, bound as books
- **Emotion Map** — feeling, city by city
- **Stranger Wall** — quiet replies, no advice
- **Need to hear** — one artifact, chosen without ranking

No accounts. No likes. No ranking.

## Stack

- TanStack Start + React 19
- Tailwind CSS v4
- Cloud Postgres (Neon-compatible) with a local PGLite fallback
- Vercel

## Database (free)

This project uses **cloud Postgres**, not Supabase.

Supabase is a great product, but it would mean a second account, extra API keys, and rewriting storage the app already has. Letters, lives, capsules, and wall notes are text — they live in Postgres. Voices are spoken in the browser, so there are no audio files to store.

| Where | Database |
| --- | --- |
| Preview / local | PGLite (Postgres compiled to WASM) if `DATABASE_URL` is unset |
| Production | Free [Neon](https://neon.tech) Postgres (or any Postgres). Migrations run on build. |

Hobby Neon and Hobby Vercel are both free. In Vercel → Project → Settings → Environment Variables, add `DATABASE_URL` from Neon’s connection string. Also set `VITE_AUTH_ENABLED` to `false` (this museum is anonymous — no accounts).

## Share it

1. Open the [Vercel project](https://vercel.com/probablecause/museum-of-almost).
2. Settings → Deployment Protection → turn **Vercel Authentication** off so anyone can visit.
3. Settings → Git → connect [hoshixdd/museum-of-almost](https://github.com/hoshixdd/museum-of-almost) so every push deploys.
4. Add a free Neon `DATABASE_URL` so letters actually persist across visitors.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

## Safety

The museum is anonymous and world-readable. Don’t include names, addresses, or anyone’s private information. If you are in crisis, use local emergency services or [Find a Helpline](https://findahelpline.com/).
