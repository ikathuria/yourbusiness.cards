# 02 — Data Model

> Implemented in **Milestone 3** as Supabase migrations under `supabase/`. This is the
> intended shape; refine when writing the migrations (fetch current Supabase docs first).

## Entities

### `accounts`
One per authenticated owner. Created on first sign-in.
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | matches Supabase `auth.users.id` |
| `email` | text | |
| `plan` | text | `free` \| `pro` \| `premium` (default `free`) |
| `stripe_customer_id` | text null | set after first checkout |
| `created_at` | timestamptz | default now() |

### `business_cards`
The product's output. One business = one card.
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | |
| `account_id` | uuid (fk → accounts) | owner |
| `slug` | text unique | public URL segment (`/c/<slug>`); reserved words blocked |
| `template_id` | text | id from the `src/templates/` registry |
| `theme_overrides` | jsonb | palette/font/layout tweaks (gated by plan) |
| `business_name` | text | |
| `tagline` | text null | |
| `description` | text null | |
| `logo_url` | text null | Supabase Storage |
| `cover_url` | text null | Supabase Storage |
| `contact` | jsonb | phone, email, address, website, hours |
| `published` | boolean | default false; only published cards are public |
| `created_at` / `updated_at` | timestamptz | |

### `card_links`
Ordered links/buttons on a card.
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | |
| `card_id` | uuid (fk → business_cards) | |
| `label` | text | |
| `url` | text | |
| `icon` | text null | |
| `position` | int | sort order |

### `card_views`  *(analytics, Pro — Milestone 9)*
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (pk) | |
| `card_id` | uuid (fk) | |
| `source` | text | `link` \| `qr` |
| `created_at` | timestamptz | |

## RLS (Milestone 3)
- `accounts`, `business_cards`, `card_links`: **owner-only** read/write (`account_id = auth.uid()`).
- Public (anon) **read** allowed on `business_cards` + their `card_links` **only when `published = true`**.
- `card_views`: anon **insert** allowed; read restricted to the owning account.

## Reserved slugs
`api`, `c`, `templates`, `login`, `dashboard`, `pricing`, `_next` (extend as routes are added).
