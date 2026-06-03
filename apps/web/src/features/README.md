# Features (`src/features/`)

Feature-sliced modules. Each feature colocates its `types.ts`, `validation.ts` (zod),
UI, and `*.test.ts`. Cross-cutting infra (db/stripe/qr clients) lives in `src/lib/`.

| Feature | Responsibility | Milestone |
|---|---|---|
| `cards/` | Card data model, editor, validation | 2, 5 |
| `billing/` | Stripe checkout + 3-tier plan gating config | 6 |
| `generate/` | Premium AI card generation (Claude) | 7 |
| `analytics/` | Card view / QR scan counters (Pro) | 9 |

New feature → new folder here. See `PLAN.md` and `PROJECT.md` for the full map.
