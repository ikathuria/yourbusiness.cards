# 04 — Supabase Setup (Milestone 3)

The app reads published cards from Supabase, and **falls back to seed data when
Supabase isn't configured** — so everything keeps working until you finish these steps.

## 1. Create a free Supabase project
1. Go to <https://supabase.com> → sign in → **New project**.
2. Pick a name, a strong database password, and a region near you.
3. Wait ~2 min for it to provision.

## 2. Run the schema + seed
In the dashboard: **SQL Editor → New query**, then run each file's contents:
1. `supabase/migrations/0001_initial_schema.sql` — tables, RLS, triggers, grants.
2. `supabase/seed.sql` — the 9 demo cards (optional but handy for testing).

(Or, with the Supabase CLI linked: `supabase db push` then run the seed.)

## 3. Get your keys
Dashboard → **Project Settings → API**. Copy:
- **Project URL**
- **Publishable key** (preferred) — or the legacy **anon** key.
- **service_role key** (server-only; needed later for Stripe webhooks / admin).

## 4. Add env vars
Create `apps/web/.env.local` (it's gitignored) with:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
# or, if you only have the legacy key:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # keep secret; used in later milestones
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Verify
1. Restart the dev server (`npm run dev`).
2. Visit `/c/scoops-parlour` — it now loads from the **database** (not seed).
3. Quick RLS check: a card with `published = false` should 404 for anonymous visitors,
   and only `published = true` rows are readable without auth.

## Security notes (baked into the schema)
- **RLS is on for every table.** Anonymous users can read only `published = true` cards
  (+ their links); all writes are owner-scoped (`account_id = auth.uid()`), enforced in M4 auth.
- The `handle_new_user` trigger (auto-creates an `accounts` row on signup) is `security definer`
  with `search_path = ''` and **revoked** from the API roles.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser (no `NEXT_PUBLIC_` prefix).
