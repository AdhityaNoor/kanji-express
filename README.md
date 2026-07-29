# Kanji Express — JLPT Study

AI-powered JLPT (N5–N1) learning platform. **Vite + React 18 + TypeScript + Tailwind CSS** on the front end, **Vercel serverless functions + MongoDB Atlas** on the back end. Mobile-first and PWA-ready.

## Run it

Install once (delete any partial `node_modules/` first if one shipped with the project):

```bash
npm install
```

**Front-end only** (UI work; API calls will fail, so you can't log in):

```bash
npm run dev        # http://localhost:5173
```

**Full stack** (auth + database) uses the Vercel CLI so the `/api` functions run locally:

```bash
npm i -g vercel
cp .env.example .env.local   # then fill in the values (see below)
vercel dev                   # http://localhost:3000
```

Other scripts:

```bash
npm run build      # tsc typecheck + production build → dist/
npm run preview    # serve the built front end
```

## Environment variables

Set these in `.env.local` for `vercel dev` and in the Vercel dashboard for deploys (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB` | Database name (default `kanji_express`) |
| `JWT_SECRET` | Secret for signing auth JWTs — use a long random string |

Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel (framework preset **Vite** is auto-detected).
2. Add the three environment variables above under **Project Settings → Environment Variables**.
3. In MongoDB Atlas, allow Vercel's egress (or `0.0.0.0/0` for a quick start) under **Network Access**.
4. Deploy. Static assets are served from `dist/`, `/api/*` run as serverless functions, and `vercel.json` rewrites all other paths to `index.html` for client-side routing.

Verified: `tsc --noEmit` passes clean, `vite build` succeeds (1605 modules, ~83 KB gzipped JS), and all serverless functions transpile.

## Backend / API

Serverless functions live in `api/` (shared code in `api/_lib/`, ignored as routes by the leading underscore):

- `POST /api/auth/signup` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me`
- `GET`/`PATCH /api/profile`
- `POST /api/progress/complete` — records a finished lesson; awards XP, coins, and updates the streak server-side.

Auth is a **JWT stored in a secure, httpOnly, SameSite=Lax cookie**; passwords are hashed with **bcrypt** (cost 12). Users are stored in a single `users` collection with a unique email index and an embedded `progress` document, so tracking is easy to extend incrementally. **All app routes require login**; unauthenticated visitors are redirected to `/login`.

## What's built

**Dashboard** — daily goal ring, XP / level / streak / coins chips, today's review queue, JLPT N5–N1 progress bars, upcoming reviews, kanji/vocab/grammar "learned" cards, a GitHub-style 27-week study heatmap, weakest-topics list, and an exam-readiness ring.

**Courses** — N5–N1 level browser (`/courses`) with progress rings, a "continue learning" banner, section previews, and progressive unlocking (N1 locks until N2 hits 80%). Each level detail page (`/courses/:level`) has the six sections — Vocabulary, Kanji, Grammar, Listening, Reading, Practice Tests — as a selectable grid, plus a lesson list with done / in-progress / available / locked states.

**Lesson player** — every unlocked lesson opens a full study flow (`/courses/:level/:section/:lesson`): flashcard reveal for vocabulary (headword → reading → meaning + example), kanji (on/kun/strokes/example), and grammar (pattern → structure → example); and multiple-choice quizzes with instant feedback for listening, reading, and practice tests. It tracks progress, then shows an XP/accuracy completion summary with retry. Real seeded JLPT content and the per-lesson resolver live in `src/data/content.ts`; the course model is in `src/data/courses.ts`.

**Layout** — sidebar navigation on desktop/tablet (`≥ lg`), bottom tab bar on mobile (`< lg`), sticky top bar with search + streak + avatar, safe-area padding for notched/foldable devices, 44px+ touch targets, and `prefers-reduced-motion` support.

**Theming** — dark/light switcher in the top bar. Colors are CSS variables (`src/styles/index.css`) exposed to Tailwind as semantic tokens (`bg`, `fg`, `accent`, `heat`). Dark is the default deep-navy theme; **light is material white with black accents**. Choice persists via `localStorage` and falls back to the OS preference, with an inline no-flash script in `index.html`.

**Design system** — theme tokens in `tailwind.config.js`; reusable `Card`, `Button`, `Badge`, `ProgressBar`, `RingProgress`, `ThemeToggle` primitives in `src/components/ui/`.

## Structure

```
api/
  _lib/          mongodb, auth (jwt/bcrypt/cookies), http helpers, user model
  auth/          signup, login, logout, me
  profile.ts     GET / PATCH profile
  progress/      complete.ts — persist a finished lesson
src/
  components/
    ui/          Card, Button, Badge, ProgressBar, RingProgress, ThemeToggle
    layout/      AppLayout, Sidebar, BottomNav, TopBar
    dashboard/   Heatmap, StatChip
    auth/        RequireAuth (route gate)
  pages/         AuthPage, Dashboard, Courses, CourseLevel, Lesson, Profile
  data/          courses.ts, content.ts, mock.ts (dashboard placeholders)
  lib/           api client, auth + theme contexts, cn(), nav, types
```

## Pronunciation (TTS)

Vocabulary, kanji, and grammar cards have a 🔊 button. By default it uses the browser's built-in **Web Speech API** with a `ja-JP` voice — free, offline, no keys, works immediately (`src/lib/useSpeak.ts`).

For consistent natural voices, set `GOOGLE_TTS_API_KEY` (a Google Cloud key with the Text-to-Speech API enabled) and `VITE_TTS_MODE=server`. The client then plays audio from `api/tts.ts` (Google `ja-JP-Neural2`), which returns a **CDN-cacheable MP3**. Because the app's text is a fixed set, each clip is generated once and cached — so the free tier is effectively never spent. If the server call fails, it falls back to the browser voice automatically.

## Progress & unlocking

All progress shown in the UI is derived from the signed-in user's saved data (`progress.completedLessons`) via `src/lib/progress.ts` — nothing is hardcoded. A new account starts empty: only **N5** is unlocked, every bar reads 0%, and the Dashboard shows empty states. Completing lessons advances the section/level bars, the JLPT progress, "learned" counts, the study heatmap, weakest-topics, exam readiness, XP, coins, and streak. Each level unlocks once the previous one reaches **60%**.

## Next slices

Kanji handwriting canvas, flashcards + FSRS/SM-2 spaced repetition, vocabulary & grammar detail pages, AI Teacher, and practice tests — each drops into an existing route in `src/pages/`.
