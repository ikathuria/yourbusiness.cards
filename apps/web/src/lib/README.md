# Lib (`src/lib/`)

Cross-cutting infrastructure shared across features — thin clients and helpers, no
business logic. Added as milestones need them:

- `supabase/` — server + browser Supabase clients (M3)
- `stripe.ts` — Stripe client (M6)
- `qr.ts` — QR generation via `qrcode` (M2)
- `og.tsx` — `@vercel/og` image helpers (M2)
- `utils.ts` — small shared helpers (slugify, cn, etc.)
