# Tally apps

Three small to-do apps that share one list. Each is its own site with its own look; all three read
and write the same Supabase `todos` table, so a task added in one shows up in the others.
There is no sign-in: everyone who opens a site sees and edits the same list.

| App | Folder | What it looks like | Live |
| --- | --- | --- | --- |
| **Tally** | `apps/tally` | One quiet list on warm paper, serif wordmark, green accent | LIVE_TALLY |
| **Tally Board** | `apps/tally-board` | Cards in To do and Done columns, navy bar, indigo accent | LIVE_BOARD |
| **Tally Lite** | `apps/tally-lite` | Plain text on a dark screen, monospaced, amber accent | LIVE_LITE |

Each app's `DESIGN.md` describes its palette, type and layout.

## Tech stack

- **npm workspaces**: the apps live in `apps/*`, with one `package-lock.json` at the root.
- **Vite + React 19 + TypeScript**, plain CSS per app. Each build is a static `dist/` folder.
- **Supabase** for storage: one `todos` table (`id`, `title`, `done`, `created_at`), used from the
  browser with `@supabase/supabase-js` and the public publishable key.
- **Vercel** hosts each app as its own project (root directory `apps/<app>`), with a preview
  deployment for every pull request.

## Local setup

```bash
npm install                    # once, at the root
npm run dev -w tally           # http://localhost:5173
npm run dev -w tally-board     # http://localhost:5174
npm run dev -w tally-lite      # http://localhost:5175
```

| Command (at the root) | What it does |
| --- | --- |
| `npm run build` | Type-checks and builds all three apps |
| `npm run build -w <app>` | Builds one app into `apps/<app>/dist` |
| `npm run lint` | ESLint in every app |
| `npm run typecheck` | `tsc -b` in every app |

## Supabase

All three apps use the same project, `https://hszqtfynyogshhltamep.supabase.co`. The URL and the
publishable key are defaults in each app's `src/lib/supabase.ts`; both are public by design, and
row level security decides what they may do. To point an app elsewhere, set `VITE_SUPABASE_URL`
and `VITE_SUPABASE_PUBLISHABLE_KEY` (see `apps/<app>/.env.example`) and rebuild.

The `todos` table already exists. For a fresh project, apply
`supabase/migrations/20261007120000_todos.sql` (SQL Editor, or `npx supabase db push` after
`npx supabase link`). Its policies let the `anon` role read and change every row, which suits a
shared demo list; tighten them before storing anything private.

## Deploy (Vercel)

Each app is a separate Vercel project connected to this repository:

| Setting | Value |
| --- | --- |
| Root Directory | `apps/<app>` |
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Include files outside the root directory | on (installs from the root lockfile) |

A push to `main` deploys all three to production; a pull request gets a preview of each app.

## Project structure

```
apps/
  tally/          The original single list
  tally-board/    The board layout
  tally-lite/     The plain-text layout
supabase/
  migrations/     The todos table and its row level security policies
```
