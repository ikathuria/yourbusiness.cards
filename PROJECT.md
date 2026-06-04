# YourBusiness.Cards — Project Tracker

> Living context map. Any LLM or human should be able to read this file alone and understand
> what the project is, how it's built, and where things are. **Keep it in sync** — update it
> whenever the stack, structure, conventions, or status changes.

_Last updated: 2026-06-03_

---

## What it is

YourBusiness.Cards is a freemium SaaS that lets any business create a **single-screen, mobile-sized digital "business card"** — a mini landing page (not a full website) showing the business's name, description, contact info, and links. The owner logs in, picks a professionally-designed template, fills a simple editor (with a live preview), and gets a shareable URL (`yourbusiness.cards/c/<slug>`) plus a QR code to put on flyers, packaging, storefronts, and ads. Target users are local/SMB owners (coffee shops, salons, trades, market stalls) who want a scannable presence without building a website. The entity is the **business**, not a person — differentiating it from Linktree and personal vCard tools.

**UI/visual quality is the entire product and the moat.** The cards must look more expensive than any competitor's output. Monetization follows the same axis — **design power is the pricing ladder:** Free (curated templates + light tweaks) → Pro (all theme families + deep customization) → Premium (AI-generated cards).

---

## Stack

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Frontend | Next.js (App Router) + React | 16.2.x (16.2.6 LTS) | SSR for public card pages + OG/meta tags. |
| Styling | Tailwind CSS + shadcn/ui | Tailwind 4.x | Token-driven theming; card themes = CSS-var/token sets. |
| Motion | Motion (framer-motion successor) | latest | Premium entrance/hover/scroll animation in templates + editor. |
| Typography | `next/font` + curated variable fonts | with Next 16 | Self-hosted, zero-CLS font pairings per family. |
| OG images | `@vercel/og` (Satori) | latest | Per-card branded share images. |
| Backend | Next.js Route Handlers / Server Actions | with Next 16 | No separate backend service. |
| Database | Supabase (Postgres) | latest | Free tier; RLS for multi-tenancy. |
| Auth | Supabase Auth | latest | Magic-link + optional Google OAuth. |
| Storage | Supabase Storage | latest | Logos / cover images. |
| QR | `qrcode` (npm) | latest | Self-hosted, theme-styled QR; no QR SaaS. |
| AI (Premium) | Anthropic API (Claude) | latest | Generates template/palette/copy from business info. |
| Payments | Stripe Checkout + Customer Portal | latest API | 3-tier subs; % per txn only, no monthly fee. |
| Hosting | Vercel | free tier | Apex domain `yourbusiness.cards`. |

> Versions verified against official docs on 2026-06-03. Re-verify before coding against a library — Next 16 and Tailwind 4 changed APIs from prior majors.

**Design is treated as a feature with acceptance criteria** — see `PLAN.md → Design Principles` and `docs/03-design-system.md`. Three aesthetic families (Modern Premium, Bold & Expressive, Clean & Classic), token-driven, ~9 templates at launch, motion with `prefers-reduced-motion` support, single-screen discipline, pixel-QA at 390px as a "done" gate.

---

## Architecture

1. **Public card request** → `GET /c/[slug]` is SSR'd: server reads the published card from Supabase (anon key + RLS public-read), looks up its template in the `src/templates/` registry, renders the single-screen animated card with per-card `@vercel/og` tags, and includes a theme-styled QR (from `/api/qr`) pointing back to the same URL.
2. **Template registry** → one typed source of templates (component + metadata, grouped by family/tier) feeds the public renderer, the `/templates` gallery, the editor live-preview, and the AI generator — add a template once, it shows up everywhere.
3. **Owner editing** → authed `(dashboard)` routes use Supabase Auth session; Server Actions write content + `theme overrides` to `business_cards`/`card_links` under RLS (owner-only). Live preview reuses the real template component. Customization controls are plan-gated.
4. **Billing** → Stripe Checkout starts a Pro/Premium subscription; `POST /api/stripe` webhook updates the account's `plan`; one typed plan-config in `features/billing` gates card count, template/customization access, AI, and badge.
5. **AI generation (Premium)** → `POST /api/generate` sends business info to Claude with a zod-constrained schema; the model *selects* `{templateId, palette, fonts, copy}` from the registry, and the server creates a draft card.
6. **Analytics (Pro)** → public card visits/scans insert into `card_views`; dashboard aggregates per card.

---

## Project structure

```
repo-root/
├─ apps/
│  └─ web/                      # Next.js app — own package.json
│     └─ src/
│        ├─ app/
│        │  ├─ (marketing)/     # product landing + pricing
│        │  ├─ (dashboard)/     # authed: manage your cards
│        │  ├─ c/[slug]/        # PUBLIC business card (the output)
│        │  ├─ templates/       # public template gallery (marketing + SEO)
│        │  └─ api/             # stripe webhook, qr, og-image, generate (AI)
│        ├─ design/             # design system: tokens, fonts, motion, theme vars
│        ├─ templates/          # template REGISTRY (modern/ bold/ classic/) — shared by
│        │                      #   gallery, editor preview, renderer, AI generator
│        ├─ components/         # shared UI: PhoneFrame, site/ (Nav, Footer, Sticker)
│        ├─ features/
│        │  ├─ cards/           # card model, editor, validation, tests
│        │  ├─ billing/         # stripe + 3-tier plan gating
│        │  ├─ generate/        # AI card generation (Premium)
│        │  └─ analytics/       # view/scan counters (Pro)
│        └─ lib/                # supabase + stripe clients, qr, og, utils
├─ supabase/                    # SQL migrations + RLS policies
├─ docs/                        # 01-product-requirements.md, 02-data-model.md, ...
├─ PROJECT.md                   # this file
└─ PLAN.md                      # build plan
```

[Update the tree as the repo grows. `packages/` only appears once a 2nd consumer exists.]

---

## Conventions

- **Where new code goes:** new feature → `apps/web/src/features/<name>/`, colocating `types.ts`, `validation.ts` (zod), and `*.test.ts`. Cross-cutting infra → `lib/`.
- **DB changes:** always via `supabase/` migrations with RLS policies — no ad-hoc table edits.
- **Naming:** files/dirs kebab-case; React components PascalCase; branches `feat/…`, `fix/….`
- **Testing:** colocated `*.test.ts` next to the code (runner TBD at Milestone 2 — verify current Vitest/Next testing guidance before adding).
- **Docs:** `docs/` filenames are zero-padded kebab-case, no spaces.
- **Before coding any library:** fetch its latest official docs — never code APIs from memory.
- **Root `package.json` delegates** (`npm --prefix apps/web run …`); no workspaces until a real 2nd package exists.

---

## Current status

| Milestone | Status | Notes |
|---|---|---|
| 1. Scaffold + design foundation | ✅ done | Next 16.2.7 + React 19.2.4 + Tailwind 4 + Motion 12.40; `design/` tokens/fonts/motion; build + dev verified |
| 2. Design system & template gallery | ✅ done | 9 templates (3 families) + registry + `/c/[slug]` renderer + `/templates` gallery + branded homepage + per-card OG images + `/api/qr`. Bold neobrutalist brand UI. |
| 3. Data layer (Supabase + RLS) | ✅ done | schema + RLS + `@supabase/ssr` clients + `getPublishedCard()`; verified against live DB (DB-only card renders, unknown slugs 404). Env in `apps/web/.env.local`. |
| 4. Auth + dashboard | ✅ done | email+password auth, session-refresh `middleware.ts`, `/dashboard` (own cards, publish/delete, copy-link/QR), `/dashboard/new` picker → `createCard`. Verified in-browser. |
| 5. Card editor (tiered) | ✅ core done | `/dashboard/edit/[id]` + `CardEditor` + iframe live preview (`/preview-card`) + `saveCard`. Template/accent/content/links/publish verified. Deferred: logo upload, inline zod, deep Pro customization. |
| 6. Monetization (3-tier Stripe) | ◐ built, gate-verified | `features/billing/plans.ts` + Stripe checkout/portal/webhook + dashboard `BillingControls`. Free publish-limit gate **verified in-browser**. Payment flow pending the user's Stripe keys (`docs/06-stripe-setup.md`). Badge deferred. |
| 7. AI card generator | ☐ todo | Premium headline; AI selects from registry only |
| 8. Deploy | ✅ live | **https://yourbusiness-cards.vercel.app** — Vercel (root `apps/web`), auto-deploys on push to `main`. Verified in prod: homepage, gallery, login, DB-backed cards (DB-only card rendered), QR + OG images. See `docs/05-deploy.md`. |
| 9. Polish | ◐ core done | **Analytics** (`/api/track-view` + `ViewTracker`; dashboard 👁 counts; QR-scan vs link tagged; RLS owner-only — verified) + **branded 404** (`app/not-found.tsx`). Lead capture, custom domain, rate-limiting deferred. |

**🏆 Hackathon context:** building for a hackathon (~1 week) with an **online/remote demo** (judges watch via screen-share/video/submitted link — not in the room); the wow-factor is **a gallery of stunning animated templates**. Prioritize per `PLAN.md → Hackathon Track`: nail the landing page + template gallery (shown in a phone frame) + a live create flow producing a clickable public link with a beautiful OG unfurl, deploy it, and **defer full auth, billing, and AI to stretch.** A clickable live link replaces "scan the QR" for online judging. Keep a flawless backup recording.

**Demo-critical path:** M1 (scaffold + design system) → M2 (gallery, go big) → thin M3+M5 (minimal persistence + create/editor, skip login) → M8 (deploy + live QR) → polish → M7 (AI) only if ahead.

**Milestone 2 done.** 9 templates + registry + `/c/[slug]` renderer + `/templates` gallery + branded homepage + per-card OG images + `/api/qr`. Fonts: Sora/Inter/Fraunces/JetBrains Mono. Brand site palette = cream/ink + violet/mint/coral.

**Milestone 3 done & verified.** Supabase connected; schema + RLS applied, 9 cards seeded, app reads live from the DB. Env in `apps/web/.env.local`.

**Milestone 4 done & verified.** Email+password auth, session-refresh `middleware.ts`, `/dashboard` (own cards, publish/delete, copy-link/QR), `/dashboard/new` picker → `createCard`. ✅ Supabase "Confirm email" is OFF (verified) — instant form signups work.

**Milestone 5 core done & verified.** The editor: `/dashboard/edit/[id]` (`CardEditor` client) with a **live preview iframe** (`/preview-card`) fed by `postMessage` that renders the real template and updates as you type; content + contact + links (add/reorder); template switcher + accent presets (all tiers) + custom color (Pro-gated); Publish/Unpublish. `saveCard` server action persists owner-scoped (verified: rename → save → DB). `createCard` now routes into the editor; dashboard rows have an Edit link. Deferred: logo/cover upload (Storage), inline zod errors, deeper Pro customization (fonts/layout/motion).
**🚀 LIVE:** https://yourbusiness-cards.vercel.app (M8 done; auto-deploys from `main`). Production verified against Supabase. Supabase "Confirm email" is OFF (verified) so live signups are instant.

**Env note:** all env vars live in **`apps/web/.env.local`** (gitignored) and **`apps/web/.env.example`** (template). The root-level `.env.local`/`.env.example` were removed to avoid the duplicate-file confusion — edit only `apps/web/.env.local` going forward.

**Next up (remaining):** **M6** built on `feat/m6-stripe` — set up Stripe (`docs/06-stripe-setup.md`), test the payment flow, then merge. M7A AI QR art (on `feat/m7-ai-qr-art`, needs Replicate token), M7B AI card generator (Nano Banana + Anthropic). _Branch previews deploy automatically._

**Known follow-up:** Next 16.2 warns that the `middleware.ts` file convention is deprecated in favor of `proxy.ts` (still works for now — rename when convenient).

**Toolchain note (Windows):** scaffold/install commands must run in **native PowerShell** with **absolute `--prefix` paths** — the Bash tool's git-bash mangles Windows paths, and a drifting cwd previously created a nested `apps/web/apps/web` duplicate. Always `Set-Location` to the repo root first.

---

## Glossary

- **Card / business card** — a published single-screen public page for one business (the product's output), at `/c/<slug>`.
- **Single-screen** — viewport-height, mobile-first, no-scroll-on-mobile by design; the core constraint that distinguishes this from website builders.
- **Template** — a typed, curated, animated card design in the `src/templates/` registry; each has a family and a tier. Shared by gallery, editor preview, renderer, and AI generator.
- **Family** — one of three aesthetic directions: **Modern Premium**, **Bold & Expressive**, **Clean & Classic**.
- **Design tokens** — the color-role / type-scale / spacing / motion values in `src/design/` that every template consumes; no template hardcodes raw values.
- **Light tweaks vs deep customization** — Free users edit content + preset palettes within a template (can't break it); Pro users get fonts, layout blocks, backgrounds, motion intensity, all families.
- **Account** — a logged-in owner; one account can own multiple business cards (limited by plan).
- **Slug** — the unique URL segment for a card (`/c/<slug>`); reserved words (`api`, `c`, `templates`, `login`) are blocked.
- **Plan** — **Free / Pro / Premium**; gates card count, template access, customization depth, AI generation, badge, analytics, lead capture, and custom domain.
- **Premium AI generation** — Premium-only: Claude turns business info into a draft card by *selecting* a template + palette + copy from the registry (never raw CSS).
- **Badge** — the "Made with YourBusiness.Cards" mark shown on Free cards, removed on Pro/Premium.
