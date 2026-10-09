# Tally apps

- npm workspaces monorepo: three Vite + React 19 + TypeScript single-page apps under `apps/`
  (`tally`, `tally-board`, `tally-lite`). One `package-lock.json` at the root; run `npm install`
  there, never inside an app.
- All three apps read and write the same Supabase `todos` table straight from the browser through
  supabase-js; each app's client is in `apps/<app>/src/lib/supabase.ts`. There is no server.
- The schema is in `supabase/migrations/` at the root and is shared. Schema changes go in a new
  migration file and must work for all three apps.
- Each app has its own look: plain CSS in `apps/<app>/src/index.css` with the tokens from that
  app's `DESIGN.md`. Don't share styles between apps and don't add a UI library.
- Each app is its own Vercel project whose root directory is `apps/<app>`.
- Checks: `npm run build`, `npm run lint` and `npm run typecheck` at the root run all three;
  `npm run build -w <app>` runs one.
