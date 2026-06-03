# Supabase (`supabase/`)

Database migrations and Row-Level-Security policies (SQL). Set up in **Milestone 3**.

- All schema changes go through migrations here — never ad-hoc table edits.
- Tables: `accounts` (incl. `plan`), `business_cards`, `card_links`, `card_views`.
- RLS: owner-only read/write on own rows; public read on **published** cards only.

See `docs/02-data-model.md` for the schema and `PLAN.md` Milestone 3 for tasks.
