<div align="center">

# yourbusiness**.cards**

### A business card people *actually* scan.

**Stunning, single-screen digital business cards for small businesses — pick a template, add your details, and get a shareable link + QR code in 60 seconds. No website needed.**

[**🌐 Live demo →**](https://yourbusiness-cards.vercel.app) · [Template gallery](https://yourbusiness-cards.vercel.app/templates) · [Submission write-up](./SUBMISSION.md)

![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2-149ECA?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3FCF8E?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?logo=stripe)
![Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-D97757?logo=anthropic)

</div>

---

## What it is

**YourBusiness.Cards** is a freemium SaaS that lets any business create a **single-screen, mobile-sized digital "business card"** — a mini landing page (not a full website) showing the business's name, description, contact info, and links. The owner logs in, picks a professionally-designed template, fills a simple editor with a **live preview**, and gets a shareable URL (`/c/<slug>`) plus a **theme-matched QR code** to put on flyers, packaging, storefronts, and ads.

The entity is the **business**, not a person — the wedge that differentiates it from Linktree and personal vCard tools. Target users are local/SMB owners (coffee shops, salons, trades, market stalls) who want a scannable presence without building a website.

> **UI/visual quality is the entire product and the moat.** The cards are designed to look *more expensive* than any competitor's output — and monetization follows the same axis: **design power is the pricing ladder.**

---

## ✨ Highlights

- **🎨 9 hand-built, animated templates** across three aesthetic families (Modern Premium · Bold & Expressive · Clean & Classic), each single-screen, mobile-first, and token-driven.
- **⚡ Live-preview editor** — the preview is the *real* template component, updated as you type via `postMessage`.
- **🔗 Editable share links** — own your URL (`/c/your-business`), auto-suggested from your name, with reserved-word + collision handling.
- **🟣 Dual accent colors** — templates that blend two colors let you customize *both*.
- **📱 Self-hosted, theme-styled QR codes** — no QR SaaS, no recurring cost.
- **🖼️ Per-card branded OG images** — paste a card link anywhere and it unfurls into a beautiful preview (`@vercel/og`).
- **🤖 AI card generation (Premium)** — describe your business and Claude *selects* a template + palette + writes the copy from the real registry (never raw CSS).
- **🎭 AI QR art (Premium)** — turn the plain QR into branded, scannable art via a ControlNet model (Replicate), stored in Supabase Storage.
- **💳 3-tier Stripe billing** — Free / Pro / Premium, gated by a single typed plan config.
- **📊 Privacy-safe analytics** — per-card views and QR-scan vs link tracking, owner-only via RLS.
- **🔒 Multi-tenant by design** — Postgres Row-Level Security so an account only ever sees its own cards.

---

## 🧩 Architecture at a glance

```
Public card request  →  GET /c/[slug]  (SSR)
   reads published card from Supabase (anon + RLS public-read)
   → looks up its template in the registry
   → renders the single-screen animated card
   → per-card @vercel/og share image + theme-styled /api/qr

Owner editing        →  (auth) /dashboard/edit/[id]
   Server Actions write content + theme overrides to Supabase under RLS
   live preview iframe (/preview-card) re-renders the REAL template via postMessage

AI generation        →  /dashboard/generate (Premium)
   Claude tool-call returns a schema-constrained {templateId, accent, copy, links}
   → server creates a draft card → opens the editor

AI QR art            →  generateCardQrArt (Premium)
   render real QR (errorCorrection H) → Replicate ControlNet control image
   → upload PNG to Supabase Storage → save qr_art_url on the card

Billing              →  Stripe Checkout/Portal + /api/stripe/webhook
   one typed plan config gates card count, customization, AI, and badge
```

**The keystone pattern:** a single **typed template registry** (`src/templates/`) feeds the public renderer, the `/templates` gallery, the editor's live preview, *and* the AI generator. Add a template once — it shows up everywhere, and the AI can immediately use it.

---

## 🛠️ Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16.2** (App Router) + **React 19.2** | SSR for public cards + OG/meta; Server Actions; Turbopack. |
| Styling | **Tailwind CSS 4** | Token-driven theming; card themes = CSS-var/token sets. |
| Motion | **Motion** (framer-motion successor) | Entrance/hover/scroll animation with `prefers-reduced-motion`. |
| Typography | **`next/font`** + curated variable fonts | Sora / Inter / Fraunces / JetBrains Mono — self-hosted, zero-CLS. |
| OG images | **`@vercel/og`** (Satori) | Per-card branded share images. |
| Database | **Supabase (Postgres)** | RLS for multi-tenancy. |
| Auth | **Supabase Auth** | Email + password (magic-link/OAuth ready). |
| Storage | **Supabase Storage** | AI QR-art images (`qr-art` bucket). |
| QR | **`qrcode`** (npm) | Self-hosted, theme-styled; no QR SaaS. |
| AI — card gen | **Anthropic Claude** | Tool-constrained structured output. |
| AI — QR art | **Replicate** (ControlNet "illusion") | Scannable QR styling. |
| Payments | **Stripe** Checkout + Customer Portal | 3-tier subscriptions. |
| Hosting | **Vercel** | Apex domain `yourbusiness.cards`; auto-deploy from `main`. |

---

## 🚀 Getting started

### Prerequisites
- **Node 20+** and npm
- A **Supabase** project (free tier) — for DB, auth, storage
- *(Optional)* **Stripe**, **Anthropic**, and **Replicate** accounts to exercise billing + AI

### 1. Clone & install
```bash
git clone https://github.com/ikathuria/yourbusiness.cards.git
cd yourbusiness.cards
npm --prefix apps/web install
```

### 2. Configure environment
Copy the template and fill it in (all app env lives in `apps/web/.env.local`):
```bash
cp apps/web/.env.example apps/web/.env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Public, RLS-protected key (preferred) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⛳ | Legacy fallback for the publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server-only** — storage uploads, webhooks. Never expose. |
| `NEXT_PUBLIC_APP_URL` | ✅ | Base URL for QR + share + OG links |
| `ANTHROPIC_API_KEY` | AI | Claude API key — card generation |
| `REPLICATE_API_TOKEN` | AI | Replicate token — AI QR art |
| `REPLICATE_QR_MODEL` | AI | `owner/name:version` (defaults to the illusion model) |
| `STRIPE_SECRET_KEY` | 💳 | Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | 💳 | From `stripe listen` / dashboard webhook |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 💳 | Stripe publishable |
| `STRIPE_PRICE_PRO_MONTHLY` / `STRIPE_PRICE_PREMIUM_MONTHLY` | 💳 | Price IDs per plan |
| `NEXT_PUBLIC_GOOGLE_OAUTH` | optional | Enable Google login |

### 3. Set up the database
The Supabase CLI isn't linked — apply SQL via the **Supabase SQL editor**, in order:
1. `supabase/migrations/0001_initial_schema.sql` — tables + RLS + triggers
2. `supabase/migrations/0002_qr_art.sql` — `qr_art_url` column + `qr-art` Storage bucket
3. `supabase/seed.sql` — *(optional)* the 9 showcase demo cards

### 4. Run
```bash
npm --prefix apps/web run dev     # http://localhost:3000
npm --prefix apps/web run build   # production build
```

---

## 📁 Project structure

```
repo-root/
├─ apps/web/                      # Next.js app (own package.json)
│  └─ src/
│     ├─ app/
│     │  ├─ page.tsx              # marketing landing
│     │  ├─ templates/            # public template gallery (SEO + showcase)
│     │  ├─ c/[slug]/             # PUBLIC business card (the output) + OG image
│     │  ├─ dashboard/            # authed: cards, editor, AI generate, billing
│     │  ├─ preview-card/         # live-preview target for the editor iframe
│     │  └─ api/                  # qr, track-view, stripe (checkout/portal/webhook)
│     ├─ design/                  # design system: tokens, fonts, motion
│     ├─ templates/               # TEMPLATE REGISTRY (modern/ bold/ classic/)
│     ├─ components/              # PhoneFrame, site nav/footer, ViewTracker
│     ├─ features/
│     │  ├─ cards/                # card model, validation (zod), seed data
│     │  ├─ billing/              # Stripe + 3-tier plan gating
│     │  └─ generate/             # AI card gen (Claude) + AI QR art (Replicate)
│     └─ lib/                     # supabase + stripe clients, slug, admin
├─ supabase/                      # SQL migrations + RLS + seed
├─ docs/                          # product, data model, design, setup guides
├─ PROJECT.md                     # living context tracker
├─ PLAN.md                        # build plan / milestones
└─ SUBMISSION.md                  # hackathon write-up
```

---

## 💸 Plans (design power = the pricing ladder)

| | **Free** | **Pro** (~$8/mo) | **Premium** (~$15/mo) |
|---|---|---|---|
| Published cards | 1 | Unlimited | Unlimited |
| Templates | Curated | All families | All families |
| Customization | Preset accents | Custom colors (both accents) | Custom colors |
| **AI card generator** | — | — | ✅ |
| **AI QR art** | — | — | ✅ |
| "Made with" badge | Shown | Removed | Removed |
| Analytics | — | ✅ | ✅ |

---

## 📈 Status

Live and deployed at **[yourbusiness-cards.vercel.app](https://yourbusiness-cards.vercel.app)** (auto-deploys from `main`). Built end-to-end: design system, 9 templates, public renderer, gallery, OG images, QR, Supabase data layer + RLS, auth, dashboard, live-preview editor, 3-tier Stripe billing, analytics, **AI card generation**, and **AI QR art**. See [`PROJECT.md`](./PROJECT.md) for the detailed milestone tracker and [`PLAN.md`](./PLAN.md) for the full plan.

---

## 📝 Note on the demo content

The showcase cards use well-known **fictional** pop-culture brands (Wayne Enterprises, Stark Industries, The Daily Planet, Dunder Mifflin, Central Perk, …) purely to demonstrate each template's personality. These names are trademarked and are **demo-only** — swap to original/parody names before any real launch.

---

<div align="center">

Built with [Claude Code](https://claude.com/claude-code) · Hosted on Vercel + Supabase

</div>
