# The Museum of Almost

An anonymous digital museum for unsent letters, almost-lives, time capsules, and the things people still carry. Built for late nights — teens through late twenties.

Leave a letter. Wander the rooms. Or just sit.

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
- Postgres in the cloud (Neon-compatible) with a local PGLite fallback
- Deployed on Vercel

## Database (free)

This project uses **cloud Postgres**, not Supabase.

Supabase is a great product, but it would mean a second account, extra API keys, and rewriting storage the app already has. Letters, lives, capsules, and wall notes are text — they live in Postgres. Voices are spoken in the browser, so there are no audio files to store.

- **Preview / local:** PGLite (Postgres compiled to WASM) if `DATABASE_URL` is unset
- **Production:** set `DATABASE_URL` to a free [Neon](https://neon.tech) Postgres URL (or any Postgres). Migrations run on build.

Hobby Neon and Hobby Vercel are both free.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

## Safety

The museum is anonymous and world-readable. Don’t include names, addresses, or anyone’s private information. If you are in crisis, use local emergency services or [Find a Helpline](https://findahelpline.com/).
