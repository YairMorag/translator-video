# NextPlay Academy (POC)

A digital player-development layer for football schools. NextPlay Academy helps
coaches assign safe, age-appropriate home-training tasks between official
sessions, lets players report how a task went, gives parents a calm and
transparent view of what's happening, and gives school admins a picture of
engagement and safety across every team.

> "NextPlay Academy" is a placeholder product name — it is only referenced via
> `lib/config.ts` (`APP_NAME`), so rebranding is a one-line change.

This is not a fitness app, a social network, or a medical tool. It does not
track calories, weight, or body shape, and it never gives medical or
nutrition advice. See [Safety principles](#safety-principles) below.

## Core demo flow

1. **Coach** logs in, opens a team, selects a player, and assigns weekly
   tasks. A simple rules engine suggests age/position-appropriate tasks; the
   coach reviews, edits, and approves the plan.
2. **Player** logs in, sees today's task, starts it, completes it, and
   reports difficulty, fatigue, and pain.
3. If pain is reported, training pauses and a **risk flag** is raised
   immediately — visible to the coach and school admin.
4. **Parent** sees the same tasks, who approved them, and any safety alerts.
5. **Admin** sees school-wide engagement, adherence, and open risk flags.

Every step above is wired end-to-end in this POC using seeded demo data.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + a small shadcn/ui-style component set (`components/ui`)
- Recharts for the dashboard charts
- React Hook Form patterns via native forms + Server Actions, Zod for validation
- date-fns for date handling, Lucide for icons
- Supabase schema + client scaffolding (see below) — **not required to run the POC**

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables or database are
required — the app runs entirely on an in-memory, seeded mock data layer
(`lib/data/seed.ts` + `lib/data/store.ts`).

### Demo accounts

Go to `/demo` for one-click logins, or use `/login` with any password:

| Role         | Email                     | Name         |
|--------------|----------------------------|--------------|
| School Admin | `admin@nextplay.demo`      | Dana Shapiro |
| Coach        | `coach@nextplay.demo`      | Amir Levi    |
| Parent       | `parent@nextplay.demo`     | Noa Katz     |
| Player       | `player@nextplay.demo`     | Daniel Katz  |

Noa Katz (parent) has two linked children — Daniel Katz (consent already
approved) and Itay Malka (consent pending) — so the consent-approval flow is
reachable from the demo account without extra setup.

Authentication is a lightweight cookie-based "demo session" (see
`lib/auth/session.ts` and `lib/auth/actions.ts`), deliberately structured so
it can be swapped for real Supabase Auth without touching page code —
every page calls `requireProfile(role)` to get the current user and gate access.

## Main routes

| Route | Description |
|---|---|
| `/` | Marketing landing page |
| `/login`, `/demo` | Sign-in and instant demo role picker |
| `/admin`, `/admin/teams`, `/admin/teams/[teamId]`, `/admin/reports` | School admin |
| `/coach`, `/coach/teams`, `/coach/teams/[teamId]`, `/coach/players/[playerId]`, `/coach/assign` | Coach |
| `/player`, `/player/week`, `/player/tasks/[taskId]`, `/player/tasks/[taskId]/report`, `/player/progress` | Player |
| `/parent`, `/parent/child/[playerId]`, `/parent/consent` | Parent |

`/player/progress` was added beyond the originally suggested route list to
give the "Progress" nav item (called for in the spec) somewhere to point.
Coach/admin "Coaches" and "Players" nav items are folded into the Teams
pages rather than given their own routes, to keep the route set small.

## Data model

See `lib/types.ts` for the full TypeScript model and
`supabase/migrations/0001_init.sql` for the equivalent SQL schema (schools,
teams, profiles, players, parent/coach links, task catalog, weekly plans,
assigned tasks, task reports, coach notes, consents, risk flags).

- **Mock data layer** (what actually runs today): `lib/data/seed.ts` (demo
  data for "North Valley Football Academy", 3 teams, 15 players, 26
  catalog tasks) and `lib/data/store.ts` (in-memory query/mutation
  functions — the single seam the rest of the app talks to).
- **Rules engine**: `lib/rules-engine.ts` — `suggestTasksForPlayer()` filters
  the task catalog by age/position/focus, blocks all suggestions if pain was
  recently reported, restricts to recovery/mobility if fatigue is high, and
  always requires explicit coach approval before anything reaches a player.

### Supabase (schema + client scaffolding, not wired up)

`supabase/migrations/0001_init.sql` and `0002_rls.sql` define the full
Postgres schema and row-level-security policies matching the access rules
described below. `lib/supabase/client.ts` and `lib/supabase/server.ts` set up
`@supabase/ssr` clients. None of this is wired into the running app yet —
the POC intentionally ships on mock data so it runs with zero setup. To move
to real persistence: run the migrations against a Supabase project, port
`lib/data/seed.ts` into a seed script (SQL inserts or a one-off script using
the service-role client), replace the functions in `lib/data/store.ts` with
Supabase queries, and replace the cookie session in `lib/auth/session.ts`
with Supabase Auth.

## Safety principles

This product is used by minors, so safety constraints are enforced in the
data flow, not just the copy:

- A player is inactive (sees only a "parent approval needed" screen) until
  parental consent is approved.
- Coaches must explicitly approve every weekly plan — the rules engine only
  ever *suggests*.
- A pain report immediately blocks further task suggestions for that player
  and raises a high-severity risk flag; the player sees "stop training for
  now" messaging, not shaming language.
- A fatigue report of 4/5 or higher restricts new suggestions to
  recovery/mobility tasks and raises a flag.
- No calorie counting, weight tracking, body-shape language, public
  rankings, public profiles, social feed, likes, comments, or peer
  comparison anywhere in the product.
- No medical advice or injury diagnosis; the one nutrition/recovery-adjacent
  task in the catalog ("Sleep & Recovery Habits Reflection") is explicitly
  educational, not personalized.

## Known POC limitations

- No video upload — task detail pages show a "Video demonstration coming
  soon" placeholder.
- No real authentication — demo/cookie session only (see above for the
  Supabase Auth migration path).
- No personalized nutrition or medical guidance of any kind.
- No public rankings, profiles, or social features.
- The rules engine is deterministic and rule-based, not an autonomous AI —
  by design, per the product brief.
- Mock data resets whenever the server process restarts (it's in memory).
- Single school, single season — multi-tenancy isn't modeled beyond the
  `school_id` foreign keys already present in the schema.

## Next steps after the POC

- Wire up Supabase Auth + Postgres using the schema/RLS already checked in.
- Add video demonstrations to the task catalog.
- Add push/email notifications for coaches (new pain/fatigue flags) and
  parents (new weekly plan published).
- Expand the rules engine with more nuanced load-management history
  (multi-week fatigue trends, not just the latest report).
- Add a lightweight admin UI for managing the task catalog itself.
