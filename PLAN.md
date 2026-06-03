# YourBusiness.Cards

> A SaaS where any business creates a single-screen, mobile-sized digital "business card" — a mini landing page with the business's description, links, and contact info, generated from a simple logged-in editor and shareable (link + QR code) for ads, packaging, and storefronts.

---

## Viability Summary

| | |
|---|---|
| **Market** | Crowded but with a real gap — link-in-bio (Linktree, Beacons, Solo.to) and vCard tools (Uniqode, Infy vCard) are **person-centric**; almost none are built for a *business as the entity* with an ad-ready, single-screen card. |
| **Feasibility** | Easy–medium — the editor + public page + QR are trivial; the only real work is clean multi-tenant routing and a freemium gate. All well-trodden with free starters. |
| **Free to build** | Yes — Vercel + Supabase + Stripe free tiers cover everything until real traffic. Only unavoidable cost later is Stripe's % per transaction and a domain you already own. |
| **Monetization** | Freemium SaaS where **design power is the upgrade ladder** — Free: curated templates + light tweaks; Pro ~$8/mo: all theme families + deep customization, analytics, custom domain; Premium ~$15/mo: AI-generated cards. In-band with the $4–15/mo market. |

**The wedge:** "Make a *stunning* scannable business card for your shop in 60 seconds, put the QR on your flyer." Targets local/SMB owners (coffee shops, salons, trades) who don't want a website and find Linktree too plain/creator-flavored. **UI/visual quality is the entire product and the moat** — the cards must look more expensive than anything a competitor outputs.

---

## 🏆 Hackathon Track (build this first)

> This project is being built for a **hackathon** with an **online/remote demo** (build window: ~1 week). Judges watch via screen-share / video / a submitted link — they are *not* in the room. The chosen wow-factor is **a gallery of stunning, animated templates**. Optimize every hour for *visible polish that reads well on a screen recording*, not backend completeness. The full milestone plan below is the north star; this track is the demo-day cut.

**Online-demo implications (important):**
- **A clickable live link is the new "scan the QR."** Judges can't reliably scan a QR off a shared screen — instead give them a real URL they open themselves (in chat / submission), and show the card in a **phone/device frame** on your own screen so it reads as mobile.
- **OG unfurl is a hidden wow-moment.** When you paste the card link into the call chat or submission, it should unfurl into a beautiful branded preview (`@vercel/og`). Judges see polish before they even click. Make this excellent.
- **Recording quality matters as much as the app.** Smooth motion, no janky reflows, no localhost — everything must look effortless on screen. Consider recording at high res / 60fps if submitting a video.
- **Have a fallback recording.** Live online demos break (network, screen-share lag). Record a flawless run-through as backup.

**Demo-day MVP (must be done & deployed):**
1. **A beautiful landing page** — the first 5 seconds judges see. Big type, motion, a live card preview. Sets the "this looks expensive" tone immediately.
2. **The template gallery (the star)** — a browsable wall of gorgeous, animated, single-screen cards across all 3 families. This is the wow-moment; invest the most time here. Aim for **9–12 polished templates**, each with tasteful Motion.
3. **A live "create" flow** — pick a template → fill business info in a slick editor with live preview → get a real public card URL + QR. Keep it frictionless; **skip login for the demo** (anonymous create is fine).
4. **Deployed at `yourbusiness.cards`** — non-negotiable: a public, clickable URL judges can open on their own device, with a clean OG preview. A localhost demo loses to a deployed one every time.

**Defer to "stretch / roadmap slide" (don't let these eat gallery time):**
- Full auth & multi-tenant dashboard (M4) — stub or anonymous for the demo.
- 3-tier Stripe billing (M6) — show the pricing page as a *mockup*; don't wire payments.
- AI generation (M7) — high wow, but only if the gallery is already flawless and time remains. If built, it becomes the showstopper finale.

**Build order for the week:**
`M1 (scaffold + design system)` → `M2 (gallery — go big, most of your time)` → thin slice of `M3 + M5` (minimal persistence + create/editor, no full auth) → `M8 (deploy + QR)` → polish pass → *then* AI (M7) only if ahead.

**Demo script (≈2 min, online):** open on the landing page (motion hooks them) → scroll the template gallery, flipping through families ("every business finds its look") → live-create a card for a fictional café in ~30s → reveal the finished card **in a phone frame on screen** and **drop the live link in the call chat** so judges can open it on their own phones (it unfurls into a clean OG preview) → one line on the business model (design power = the upgrade ladder: Free → Pro → Premium AI) → close. *Keep a flawless pre-recorded run as backup.*

**Judging-criteria mapping:** *Design/UX* → the gallery + landing carry this (your strength). *Technical* → token-driven design system, shared template registry, SSR + per-card OG images. *Wow/creativity* → the gallery reveal + judges opening the real link themselves (+ AI finale if built). *Completeness* → a deployed, end-to-end create→share flow beats a broader half-working one.

---

## Tech Stack

> Versions verified against current official docs on 2026-06-03. Re-check before coding.

| Layer | Choice | Version | Reason |
|---|---|---|---|
| Frontend | Next.js (App Router) + React | 16.2.x (16.2.6 LTS) | Free, Vercel-native, SSR for public card pages (OG tags + SEO), one codebase for app + API. |
| Styling | Tailwind CSS + shadcn/ui | Tailwind 4.x | Token-driven theming — each card theme is a set of CSS variables/Tailwind tokens. |
| **Motion** | **Motion (framer-motion successor)** | latest | **First-class** — entrance animations, parallax, hover/scroll motion that make cards feel premium. Used in templates + editor. |
| **Typography** | **`next/font` + curated Google/variable fonts** | with Next 16 | Self-hosted, zero-layout-shift premium font pairings per theme family. |
| **OG images** | **`@vercel/og` (Satori)** | latest | Per-card share images that look as good as the card — critical since cards get shared in ads/social. |
| Backend | Next.js Route Handlers / Server Actions | (with Next 16) | Colocated, no extra service to host. |
| Database | Supabase (Postgres) | latest | Free tier, RLS for clean multi-tenancy, row-level access per account. |
| Auth | Supabase Auth | latest | Email magic-link + Google OAuth, integrates with the same DB and RLS. |
| Storage | Supabase Storage | latest | Logos / cover images / card backgrounds on the free tier. |
| QR codes | `qrcode` (npm) | latest | Generate PNG/SVG QR server-side for free; styled to match card theme; no third-party QR SaaS. |
| **AI (Premium)** | **Anthropic API (Claude)** | latest | Generates layout choice + color palette + polished copy from raw business info. Cheap per-card, gated to top tier. |
| Payments | Stripe (Checkout + Customer Portal) | latest API | No monthly fee, % per transaction only; Customer Portal handles plan management for free. |
| Hosting | Vercel | free tier | Zero-config Next.js deploy, custom domain (yourbusiness.cards), edge SSR. |

> Not GitHub Pages: this needs auth, a database, dynamic per-business public pages, and SSR'd OG/meta tags — so Vercel, not static hosting.

---

## Design Principles

> The product is judged in the first 2 seconds someone sees a card. Treat visual quality as a feature with acceptance criteria, not as "polish."

- **Design-system first.** A small set of design tokens (color roles, type scale, spacing, radius, shadow, motion timing) drives every theme. Templates consume tokens — they never hardcode raw values. This is what makes new themes cheap and keeps quality consistent.
- **Templates are typed, curated components.** Each template = a React component + metadata (name, family, preview image, supported blocks, tier). They live in a registry so the editor, gallery, and renderer all read the same source.
- **Three aesthetic families, professionally distinct:** **Modern Premium** (glassy, big type, gradients, smooth motion), **Bold & Expressive** (vivid color, display fonts, playful motion), **Clean & Classic** (minimal, refined serif/sans, restrained). Aim for ~3 templates per family at launch (9 total).
- **Motion with restraint.** Every template ships tasteful entrance + hover/scroll motion; respect `prefers-reduced-motion`. Motion should feel intentional, never decorative-noise.
- **Single-screen discipline.** Viewport-height, mobile-first, no-scroll-on-mobile. Beauty within a fixed frame is the constraint that defines the product.
- **The editor must feel as good as the output.** Live preview, instant theme switching, drag-to-reorder, no janky reflows. A clunky editor undercuts a premium promise.
- **Pixel QA is a gate.** "Done" for any visual task includes: looks correct on a 390px mobile viewport, has motion, has empty/loading states, and passes a side-by-side against a reference (Linear/Stripe/Vercel-tier finish).

---

## Project Structure

```
repo-root/
├─ apps/
│  └─ web/                      # Next.js app — own package.json
│     └─ src/
│        ├─ app/
│        │  ├─ (marketing)/     # public landing / pricing for the product itself
│        │  ├─ (dashboard)/     # authed: list & edit your business cards
│        │  ├─ c/[slug]/        # PUBLIC rendered business card (the product output)
│        │  ├─ templates/       # public gallery showcasing all templates (marketing + SEO)
│        │  └─ api/             # route handlers: stripe webhook, qr, og-image, generate (AI)
│        ├─ design/             # design system: tokens.ts, fonts.ts, motion.ts, theme CSS vars
│        ├─ templates/          # template REGISTRY: one component+metadata per template,
│        │                      #   grouped by family (modern/ bold/ classic/); shared by
│        │                      #   gallery, editor preview, and public renderer
│        ├─ features/
│        │  ├─ cards/           # card model: types.ts, validation.ts, editor, *.test.ts
│        │  ├─ billing/         # stripe checkout, 3-tier plan gating, webhook handling
│        │  ├─ generate/        # AI card generation (Premium): prompt, schema, mapping
│        │  └─ analytics/       # view/scan counters (Pro)
│        └─ lib/                # supabase client, stripe client, qr, og, utils
├─ supabase/                    # migrations + RLS policies (SQL)
├─ docs/                        # 01-product-requirements.md, 02-data-model.md, ...
├─ PROJECT.md                   # living context tracker
├─ PLAN.md                      # this file
├─ package.json                 # root: delegating scripts (npm --prefix apps/web run …)
├─ CLAUDE.md                    # one line → "See PROJECT.md for project context."
├─ .env.example
└─ README.md
```

**Conventions**
- `apps/web` layout even though it's one app; root `package.json` delegates, no workspaces until a 2nd package (e.g. a mobile or admin app) actually exists.
- New feature → `apps/web/src/features/<name>/`, colocating `types.ts`, `validation.ts` (zod), and `*.test.ts`.
- `docs/` filenames: zero-padded kebab-case, no spaces/special chars.
- DB changes go through `supabase/` migrations with RLS policies — never ad-hoc table edits.
- **Before coding against any library (Next 16, Supabase, Stripe, Tailwind 4), fetch its latest official docs.** Next 16 and Tailwind 4 both changed APIs from prior majors — never code from memory.
- Keep `PROJECT.md` in sync whenever structure, stack, or status changes.

---

## Environment Variables

```
# Required — Supabase (Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=          # project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # public anon key (RLS-protected)
SUPABASE_SERVICE_ROLE_KEY=         # server-only; used in webhooks/admin tasks — never expose to client

# Required — Stripe (Dashboard → Developers → API keys)
STRIPE_SECRET_KEY=                 # server-side secret
STRIPE_WEBHOOK_SECRET=             # from `stripe listen` / dashboard webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO_MONTHLY=          # price ID for the Pro plan

# Required — app
NEXT_PUBLIC_APP_URL=               # https://yourbusiness.cards (used in QR + share + OG links)

# Required for Premium AI card generation
ANTHROPIC_API_KEY=                 # Claude API key; server-only, used in /api/generate

# Optional
NEXT_PUBLIC_GOOGLE_OAUTH=          # if enabling Google login in Supabase Auth
STRIPE_PRICE_PREMIUM_MONTHLY=      # price ID for the Premium (AI) plan
```

---

## Milestones

> Design is front-loaded on purpose: the template gallery (M2) is the core feature and the moat, built before auth/billing so the visual bar is set early and everything else renders into it.

### Milestone 1: Scaffold + Design Foundation
**Goal:** Repo runs locally, structure in place, and the design-system primitives exist so every later screen is built on tokens, fonts, and motion — not ad-hoc styles.

Tasks:
- [x] Initialize `apps/web` with Next.js (verify current stable via official docs) + Tailwind 4 + shadcn/ui — Done when: `npm --prefix apps/web run dev` starts without errors and shows a placeholder page. *(Next 16.2.7, React 19.2.4, Tailwind 4, Turbopack. shadcn deferred to M2 when components are needed.)*
- [x] Set up folder structure per Project Structure section, incl. `src/design/`, `src/templates/`, `supabase/`, `docs/` — Done when: those dirs and root delegating `package.json` exist.
- [x] Build the design system in `src/design/`: `tokens.ts` (color roles, type scale, spacing, radius, shadow, motion timing), `fonts.ts` (`next/font` pairings), `motion.ts` (shared Motion variants), Tailwind theme wired to the tokens — Done when: a demo page renders text/buttons using only tokens and a sample entrance animation plays. *(Motion 12.40; Sora/Inter/JetBrains Mono; tokens in globals.css `@theme`.)*
- [x] Create `PROJECT.md`, root `CLAUDE.md` (→ PROJECT.md), and `.env.example` with all vars — Done when: all committed and `.env.example` matches the Environment Variables section.
- [x] Write `docs/01-product-requirements.md`, `docs/02-data-model.md`, `docs/03-design-system.md` — Done when: all exist; the design doc captures tokens, families, and the template-registry contract.

> ✅ **Milestone 1 complete.** `npm run build` passes (typecheck + static prerender); `npm run dev` serves the design-system demo at `/`. Verified 2026-06-03.

---

### Milestone 2: Design System & Template Gallery *(core feature / moat)*
**Goal:** A library of professionally distinct, animated templates renders beautifully on a single screen — this is the product's first impression and selling point. Built with seed data, before auth/DB.

Tasks:
- [x] Define the card data model (business_card, links, theme config) as TypeScript types + zod in `features/cards` — Done when: a sample card object validates and is the input contract every template consumes. *(zod 4 schema + inferred types + seed data.)*
- [x] Build the **template registry** in `src/templates/`: each template = component + metadata (`id`, `name`, `family`, `tier`, `previewImage`, supported blocks) — Done when: a typed `templates` list is importable and iterable. *(registry.ts: getTemplate/resolveTemplate/templatesByFamily.)*
- [x] Build **3 template families × ~3 templates (9 total)** — Modern Premium, Bold & Expressive, Clean & Classic — each: single-screen/viewport-height, mobile-first, token-driven, with tasteful Motion entrance + hover and `prefers-reduced-motion` support — Done when: each renders from the same seed card and passes the Design Principles pixel-QA gate at 390px. *(Modern: Aurora/Halo/Monolith · Bold: Pop/Neon/Carnival · Classic: Editorial/Embossed/Linen. Added Fraunces serif for Classic. All screenshotted at 375px.)*
- [x] Public renderer at `app/c/[slug]` that picks the card's template from the registry and renders it — Done when: `/c/demo` shows a complete, animated, single-screen card with no mobile scroll. *(Next 16 async params, per-card metadata, 404.)*
- [x] Public **template gallery** at `app/templates` showcasing all templates with live previews, ideally shown inside a **phone/device frame** so cards read as mobile on a shared screen — Done when: visitors can browse every template in-frame (doubles as marketing + SEO + the demo centerpiece). *(PhoneFrame iframes the real card pages.)*
- [ ] Premium per-card OG image via `@vercel/og` reflecting the card's theme — Done when: pasting a card link in Slack/iMessage/X unfurls into a branded preview (this is a demo wow-moment — make it excellent).
- [ ] Theme-styled QR endpoint `app/api/qr` (color matches card) — Done when: scanning opens `/c/[slug]`.

> ◐ **In progress.** All 9 templates + registry + renderer + gallery done and verified (build green, screenshots at 375px). Remaining: OG images + QR endpoint.

---

### Milestone 3: Data Layer — Supabase + multi-tenant schema
**Goal:** Cards persist in Supabase with row-level security so an account only sees its own cards.

Tasks:
- [ ] Create `supabase/` migrations: `accounts` (incl. `plan`), `business_cards` (slug unique, template id, theme overrides JSON, published flag), `card_links`, `card_views` — Done when: `supabase db push` applies cleanly.
- [ ] Add RLS policies: owner-only read/write on own rows; public read on published cards only — Done when: anon can read a published card but cannot read drafts or others' rows.
- [ ] Wire the Supabase client in `lib/` (server + browser); `/c/[slug]` reads from Supabase instead of seed data — Done when: the public renderer loads a real DB row.
- [ ] Slug generation + uniqueness + reserved-word guard (`api`, `c`, `templates`, `login`) — Done when: duplicate names yield distinct slugs and reserved paths are blocked.

---

### Milestone 4: Auth + Dashboard
**Goal:** A user can sign up, log in, and land on a polished dashboard listing their cards.

Tasks:
- [ ] Supabase Auth: email magic-link (+ optional Google OAuth) with protected `(dashboard)` route group; account row auto-created on first sign-in — Done when: unauthenticated users are redirected to login.
- [ ] Dashboard card list (designed to the same bar as the cards): status (draft/published), public URL, copy-link / download-QR, thumbnail preview — Done when: a logged-in user sees only their own cards.
- [ ] "New card" flow → template picker → creates a draft → routes to editor — Done when: a new draft appears in the list and DB under that account with its chosen template.

---

### Milestone 5: Card Editor with Tiered Customization
**Goal:** A non-technical owner builds and publishes a beautiful card in minutes; how much they can customize depends on their plan.

Tasks:
- [ ] Editor shell with **live preview pane** rendering the real template as you type (instant, no janky reflow) — Done when: preview matches `/c/[slug]` exactly and updates on every change.
- [ ] Content form in `features/cards`: business name, tagline, description, logo/cover upload (Supabase Storage), contact fields (phone, email, address→maps, website, hours), add/reorder links — Done when: edits save and validate (zod) with inline errors.
- [ ] **Light tweaks (all tiers incl. Free):** swap among allowed templates, pick from preset color palettes within a theme, logo, content — Done when: changes persist and preview updates; Free is constrained to curated presets.
- [ ] **Deep customization (Pro):** all theme families, custom colors/fonts pairings, layout-block toggles, background options, motion-intensity preset — Done when: gated controls appear only for Pro and persist as `theme overrides`.
- [ ] Publish / unpublish toggle controlling public visibility — Done when: published cards are publicly reachable; unpublished return 404.

---

### Milestone 6: Monetization — 3-Tier Stripe + Gating
**Goal:** Free / Pro / Premium enforced; users can upgrade and manage billing in test mode. Design power is the upsell.

Tasks:
- [ ] Single source-of-truth plan config in `features/billing`:
  - **Free** — 1 published card, curated templates + light tweaks only, `yourbusiness.cards/c/slug`, "Made with YourBusiness.Cards" badge.
  - **Pro (~$8/mo)** — unlimited cards, all theme families + deep customization, no badge, analytics, lead capture, custom domain.
  - **Premium (~$15/mo)** — everything in Pro + AI card generation + premium-only template families.
  Done when: limits/features are one typed config read everywhere.
- [ ] Stripe Checkout for Pro & Premium + Customer Portal link — Done when: upgrading in test mode flips the account plan and the portal can switch/cancel.
- [ ] Stripe webhook at `app/api/stripe` updating account plan on checkout/subscription events — Done when: plan stays correct after upgrade, downgrade, cancel, renewal.
- [ ] Enforce gates in editor + renderer (card-count limit, template/customization access, badge) — Done when: each tier can do exactly its allowed set and the badge renders only on Free cards.

---

### Milestone 7: AI Card Generator *(Premium headline feature)*
**Goal:** A Premium user enters business info and gets a polished, on-brand card generated instantly — the wow-tier.

Tasks:
- [ ] `features/generate`: prompt + structured output schema (zod) mapping business info → `{ templateId, palette, fonts, copy (tagline/description), suggested links }` using the Anthropic API — Done when: a server call returns schema-valid output.
- [ ] `app/api/generate` route (Premium-gated, rate-limited, server-only key) that creates a draft card from the AI output — Done when: a Premium user submits info and lands in the editor on a complete, good-looking draft.
- [ ] "Generate with AI" entry point in the new-card flow, gated to Premium with an upsell for others — Done when: non-Premium users see the upsell; Premium users get a generated card.
- [ ] Guardrails: AI only selects from the real template registry + token palettes (never free-form CSS) so output can't break the design — Done when: generated cards always render correctly.

---

### Milestone 8: Deploy
**Goal:** Live at https://yourbusiness.cards on Vercel.

Tasks:
- [ ] Connect repo to Vercel, root `apps/web`, add all env vars — Done when: production build succeeds.
- [ ] Point the `yourbusiness.cards` domain at Vercel; verify `/c/[slug]`, `/templates`, and OG images work in prod — Done when: a real card loads at the apex domain and previews correctly when shared.
- [ ] Switch Stripe to live keys + live webhook; smoke-test a real upgrade — Done when: a live Pro/Premium upgrade succeeds end-to-end.

---

### Milestone 9: Polish & Pro/Premium Features
**Goal:** No rough edges anywhere; paid features deliver real value and the whole product feels premium.

Tasks:
- [ ] Analytics (Pro): count card views + QR scans, clean chart in dashboard — Done when: views increment per visit and display per card.
- [ ] Lead capture block (Pro): optional "contact us" form → stored leads / owner notification — Done when: a submission is stored and visible to the owner.
- [ ] Custom domain support (Pro): serve a card on the user's own domain (CNAME mapping) — Done when: a Pro user's card loads on their domain.
- [ ] Whole-app finish pass: loading/empty/error/skeleton states, friendly 404 card page, motion consistency, mobile QA across all 9 templates, rate-limiting on public/QR/generate endpoints — Done when: no console errors on core flows and every template passes pixel-QA on mobile.

---

## Claude Code Commands

> In every session, fetch the latest official docs for any library before coding against it, and keep `PROJECT.md` in sync with what you build.

**Start fresh (Milestone 1):**
```
claude "Read PLAN.md and PROJECT.md. Complete Milestone 1, fetching the latest official docs for any library before using it. Update PROJECT.md to reflect what you built. Mark tasks done as you go. Stop after Milestone 1 and commit."
```

**Resume from any point:**
```
claude "Read PLAN.md and PROJECT.md. Find the first incomplete task and continue, fetching the latest official docs for any library before using it. Keep PROJECT.md in sync. Mark tasks done as you go. Commit when a milestone is complete."
```

**Test the current state:**
```
claude "Read PLAN.md and PROJECT.md. Without building anything new, test everything that's marked done. Report what works and what's broken."
```

---

## Notes & Decisions

- **UI quality is the product.** The visual bar is set in Milestone 2 before anything else; auth, billing, and data all render into a renderer that already looks premium. Don't defer design to a "polish" phase.
- **Design power is the pricing ladder.** Free = curated templates + light tweaks; Pro = all families + deep customization; Premium = AI generation. What you pay for is *how good the card can look* — keep the gates aligned to that story.
- **Single-screen, not a website.** The public card is viewport-height, mobile-first, no-scroll-on-mobile by design — this is the product's identity vs full site builders. Keep the renderer constrained.
- **Business is the entity, not a person.** Schema centers on `business_card`, not a personal profile — the differentiator from Linktree/vCard tools.
- **Templates are a registry, not scattered files.** Gallery, editor preview, public renderer, and the AI generator all read the same typed template list — add a template once, it appears everywhere.
- **AI never writes raw CSS.** The generator only *selects* from the real template registry + token palettes, so output can't break the design.
- **Free starters exist** (Vercel `nextjs-subscription-payments`, KolbySisk `next-supabase-stripe-starter`) — reference for Stripe+Supabase wiring, but keep the codebase minimal and feature-sliced rather than adopting a heavy boilerplate wholesale.
- **QR is self-hosted** via the `qrcode` lib — no third-party QR SaaS dependency or recurring cost.
- Pricing targets: Pro **~$8/mo**, Premium **~$15/mo** (in-band with Liinks $4–10, QR Tiger $7+, AI tools $15+). Revisit after first users.
