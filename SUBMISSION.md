# YourBusiness.Cards — Hackathon Submission

> **A business card people actually scan.** Stunning, single-screen digital business cards for small businesses — pick a template, add your details, and get a shareable link + QR code in 60 seconds. No website needed.

| | |
|---|---|
| **Live app** | https://yourbusiness-cards.vercel.app |
| **Template gallery** | https://yourbusiness-cards.vercel.app/templates |
| **Example card** | https://yourbusiness-cards.vercel.app/c/central-perk |
| **Category** | Freemium SaaS · Web · AI |
| **Status** | Live, deployed, end-to-end functional |

---

## 1. The one-line pitch

A freemium SaaS where any **business** (not a person) creates a beautiful, **single-screen, mobile-sized digital business card** — a mini landing page with their name, description, contact info, and links — then shares it as a link + QR code for flyers, packaging, storefronts, and ads. **The visual quality is the product; design power is the pricing ladder.**

---

## 2. The problem

Local and small-business owners — coffee shops, salons, trades, market stalls — need a scannable online presence, but:

- **Building a website is overkill** (cost, time, maintenance) for what is really "here's who we are, here's how to reach us, here are our links."
- **Linktree / Beacons / link-in-bio tools are person- and creator-centric** and look plain. They don't feel like a *brand*, and they're not designed as an ad-ready, single-screen object you'd print a QR of on a flyer.
- **vCard / QR tools are utilitarian** — they produce something functional but ugly. Nothing about them says "this business is worth your time."

**The gap:** there is almost nothing built for *a business as the entity* that produces a card good enough to look more expensive than the business actually is — and that's exactly the impression a flyer or storefront QR needs to make in the first two seconds.

---

## 3. The solution

A logged-in owner:
1. **Picks a professionally-designed, animated template** (or lets **AI generate the whole card** from a sentence about their business).
2. **Fills a slick editor with a real-time live preview** — business details, contact, reorderable links, template + dual accent colors.
3. **Owns their link** (`/c/their-business`) and gets a **theme-matched QR code** (or **AI-generated QR art**) to print and share.

The output is a **viewport-height, mobile-first, no-scroll card** that looks like it came from a design studio — and it unfurls into a **branded preview image** when the link is shared anywhere.

---

## 4. What makes it different (the wedge)

- **Business is the entity, not a person.** The data model centers on a `business_card`, not a personal profile — the structural differentiator from Linktree/vCard tools.
- **UI/visual quality is the entire product and the moat.** Most competitors treat design as a setting; here it's the core deliverable, with acceptance criteria (single-screen at 390px, tasteful motion, empty/loading states, Stripe/Linear/Vercel-tier finish).
- **Design power is the upgrade ladder.** What you pay for is literally *how good the card can look*: Free (curated templates + preset accents) → Pro (all families + deep customization) → Premium (**AI card generation + AI QR art**). The monetization story and the product story are the same axis.
- **Single-screen discipline.** Beauty inside a fixed mobile frame is the constraint that defines the product and keeps it from drifting into "yet another website builder."

---

## 5. Feature breakdown

### Core product
- **9 hand-built, animated templates** across **three aesthetic families** — Modern Premium (`Aurora`, `Halo`, `Monolith`), Bold & Expressive (`Pop`, `Neon`, `Carnival`), Clean & Classic (`Editorial`, `Embossed`, `Linen`). Each is single-screen, mobile-first, token-driven, with entrance/hover motion and `prefers-reduced-motion` support.
- **Public SSR renderer** at `/c/[slug]` — reads the published card from Postgres, looks up its template in the registry, renders the animated single-screen card with per-card metadata.
- **Public template gallery** at `/templates` — every template shown live inside a **phone frame**, doubling as marketing, SEO, and the demo centerpiece.
- **Per-card branded OG images** via `@vercel/og` — share a card link and it unfurls into a polished, on-brand preview.
- **Self-hosted, theme-styled QR codes** via the `qrcode` lib — color-matched to the card, PNG/SVG, no third-party QR SaaS or recurring cost.

### Editor (tiered)
- **Live-preview editor** — the preview pane is an iframe rendering the **real template component**, fed by `postMessage`, updating on every keystroke. The preview is exactly what visitors will see.
- **Editable share link (slug)** — owners set their own URL, **auto-suggested from the business name** until they customize it; server-side canonicalization, reserved-word blocking, and unique-collision retry.
- **Dual accent colors** — templates that blend two colors (gradients, alternating buttons) expose **both** as customizable, with presets for everyone and custom hex gated to paid tiers.
- **Content + contact + reorderable links**, template switcher, publish/unpublish.

### AI (Premium)
- **AI card generator** (`/dashboard/generate`) — describe your business in a sentence or two; **Claude** returns a tool-constrained, schema-valid `{templateId, accent, tagline, description, contact, links}`, the server creates a draft, and you land in the editor on a complete, good-looking card.
- **AI QR art** — turn the plain QR into branded, artistic imagery via a **Replicate ControlNet "illusion" model**, using the *real* high-redundancy QR as the control image so the result stays scannable and stable across regenerations; output is stored in Supabase Storage.

### Platform
- **Multi-tenant auth + dashboard** — Supabase Auth (email + password), session-refresh middleware, a dashboard listing only your own cards with status, copy-link, QR, and view counts.
- **3-tier Stripe billing** — Checkout + Customer Portal + signature-verified webhook, all gated by a **single typed plan config** (`features/billing/plans.ts`) that's the one source of truth for card limits, customization, AI access, and the badge.
- **Privacy-safe analytics** — per-card view counts with QR-scan vs link attribution, readable only by the card owner via RLS.

---

## 6. Technical deep-dive (engineering substance)

### The keystone: one typed template registry
A single registry in `src/templates/` defines every template as `component + metadata (id, name, family, tier, description)`. **The public renderer, the gallery, the editor's live preview, and the AI generator all read the same source.** Add a template once and it appears everywhere — and the AI can immediately select it. This is what keeps quality consistent and the system extensible.

### Design system, not ad-hoc styles
`src/design/` holds tokens (color roles, type scale, spacing, radius, shadow, motion timing), `next/font` pairings (Sora/Inter/Fraunces/JetBrains Mono, self-hosted, zero layout shift), and shared Motion variants. Templates consume tokens — they never hardcode raw values — which is why themes are cheap to add and visually coherent.

### Multi-tenancy via Postgres RLS
Every table enforces Row-Level Security: **public read only on `published = true`**, **owner-scoped read/write** via `account_id = auth.uid()`. Anon visitors can read a published card but never drafts or other accounts' rows; analytics are insert-by-anyone but read-only-by-owner. A hardened `security definer` trigger auto-provisions an `accounts` row on signup. This is real isolation, not app-layer filtering.

### SSR + share-ready by default
Public cards are server-rendered for SEO and instant unfurls; each card generates its own `@vercel/og` image reflecting its brand. The QR endpoint tags scans (`?src=qr`) so analytics can distinguish a flyer scan from a shared link.

### Constrained AI (it can't break the design)
The generator never writes CSS. It calls Claude with a **tool whose input schema is constrained to the real registry** — `templateId` is an enum of existing template ids, `accent` is a hex, copy fields have length bounds — and the server re-validates with zod (`generatedCardSchema`) before persisting. The static design-director system prompt + template catalog are sent with **prompt caching** to cut latency/cost. Worst case (a malformed field) falls back to a safe default; the output **always renders correctly**.

### Scannable AI QR art (the hard part)
Naively prompting an image model yields pretty-but-unscannable QRs. The implementation:
- renders the **actual** QR for the card URL server-side with **error-correction level H** (max redundancy) and a clean quiet zone,
- feeds that as the **control image** to the ControlNet model (rather than letting the model invent its own QR from text), so the encoded data is identical and stable across "regenerate,"
- pushes `controlnet_conditioning_scale` past the model default to favor **readability over stylization**, with a negative prompt that fights low-contrast/cluttered output,
- downloads the result and uploads it to a public Supabase Storage bucket via the service role (after verifying ownership), saving a cache-busted `qr_art_url` on the card.

### Resilience details
- The editor query **degrades gracefully** if the `qr_art_url` column is missing (pre-migration), so it never hard-404s.
- Slug saves **retry on unique-constraint collisions** — even against cards hidden from the current user by RLS — appending a suffix rather than failing.
- The landing page sources its preview slugs from the **single seed module**, so renaming a card never leaves the homepage pointing at a dead link.

---

## 7. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2 (App Router) + React 19.2 (Server Actions, Turbopack) |
| Styling | Tailwind CSS 4 (token-driven theming) |
| Motion | Motion (framer-motion successor) |
| Typography | `next/font` + Sora / Inter / Fraunces / JetBrains Mono |
| OG images | `@vercel/og` (Satori) |
| Database / Auth / Storage | Supabase (Postgres + RLS, Auth, Storage) |
| QR | `qrcode` (self-hosted) |
| AI — card generation | Anthropic Claude (tool-constrained structured output) |
| AI — QR art | Replicate (ControlNet "illusion") |
| Payments | Stripe (Checkout + Customer Portal + webhook) |
| Hosting | Vercel (auto-deploy from `main`) |

---

## 8. What's built (completeness)

| Capability | State |
|---|---|
| Design system + 9 animated templates (3 families) | ✅ Done |
| Public SSR renderer `/c/[slug]` + branded OG images | ✅ Done |
| Template gallery in phone frames | ✅ Done |
| Theme-styled QR endpoint | ✅ Done |
| Supabase data layer + RLS multi-tenancy | ✅ Done |
| Auth + dashboard (own cards, status, analytics) | ✅ Done |
| Live-preview editor (content, links, template, dual accents) | ✅ Done |
| Editable share links (auto-suggest + collision-safe) | ✅ Done |
| 3-tier Stripe billing + plan gating | ✅ Built (needs live keys to transact) |
| Privacy-safe view/scan analytics | ✅ Done |
| **AI card generation (Premium)** | ✅ Done |
| **AI QR art (Premium)** | ✅ Done |
| Deployed to production | ✅ Live |

---

## 9. Challenges we solved

- **Scannable AI QR codes.** Getting an image model to produce art that *still scans* required feeding a real error-correction-H QR as the ControlNet control image and tuning the conditioning weight — not just prompting.
- **AI that can't break a premium design.** Constraining Claude to *select* from a typed registry (enum template ids + zod re-validation) instead of generating layout/CSS guarantees the output always renders correctly.
- **True multi-tenancy on a free stack.** Postgres RLS policies (public-read-published, owner-everything-else) give real per-account isolation without a bespoke backend.
- **A live preview that never lies.** The editor renders the *actual* template component in an iframe via `postMessage`, so what you edit is exactly what ships.
- **Backwards-safe migrations.** The editor tolerates a missing `qr_art_url` column so deploying the schema and the code in either order never breaks the edit flow.

---

## 10. Accomplishments we're proud of

- A **deployed, end-to-end create→share flow** — not a mockup. You can sign in, generate or build a card, customize it, publish, and open the real public URL with a clean OG unfurl.
- **Two genuinely useful AI features** (card generation + scannable QR art) that map directly to the top pricing tier, instead of AI bolted on for show.
- A **registry-driven architecture** where one abstraction powers the renderer, gallery, editor, and AI simultaneously.
- A template wall that reads as **"this looks expensive"** in the first five seconds — the entire product thesis.

---

## 11. What's next

- Logo/cover image upload (Supabase Storage) and inline zod validation in the editor.
- Deeper Pro customization: fonts, layout-block toggles, motion intensity.
- Lead-capture block and per-card custom domains (Pro).
- Suggested-prompt chips for AI QR art; one-click "regenerate variations."
- Custom apex domain + live Stripe keys for real transactions.

---

## 12. How to evaluate it (for judges)

1. **Open the landing page** → first impression / motion. https://yourbusiness-cards.vercel.app
2. **Browse the gallery** → flip through the three families in phone frames. `/templates`
3. **Open a live card** → `/c/central-perk`, `/c/stark-industries`, `/c/krusty-krab` — each is a real single-screen card; paste a link somewhere to see the OG unfurl.
4. **Sign in and create** → pick a template, edit with live preview, set your own link + colors, publish, open the public URL.
5. *(With API keys)* **Generate with AI** → `/dashboard/generate` describes a business → complete draft; in the editor, generate **AI QR art**.

> The showcase uses **fictional** pop-culture brands (Wayne Enterprises, Stark Industries, The Daily Planet, Dunder Mifflin, Central Perk, …) purely to show each template's personality — demo-only, trademarked names.

---

## 13. Judging-criteria mapping

| Criterion | Where it shows up |
|---|---|
| **Design / UX** | The product's core strength — 9 polished animated templates, a token-driven design system, single-screen discipline, a live-preview editor, branded OG unfurls. |
| **Technical execution** | Typed template registry shared by 4 surfaces; SSR + per-card OG; Postgres RLS multi-tenancy; tool-constrained + zod-validated AI; ControlNet QR with a real control image; Stripe webhook + single plan-config gating. |
| **Innovation / creativity** | Business-as-the-entity positioning; design-power-as-pricing-ladder; **scannable AI QR art**; AI that selects from a registry so it can't break the design. |
| **Completeness** | A deployed, end-to-end create→share flow with auth, billing, analytics, and two working AI features — live in production, not a prototype. |
| **Impact / market fit** | Targets a real, underserved segment (local SMBs) with a clear wedge against Linktree/vCard tools and an in-band freemium model (~$8 Pro / ~$15 Premium). |

---

<div align="center">

**Built with [Claude Code](https://claude.com/claude-code) · Next.js + Supabase + Stripe + Claude + Replicate, on Vercel.**

</div>
