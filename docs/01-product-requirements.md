# 01 — Product Requirements

## One-liner
A freemium SaaS where any **business** creates a **single-screen, mobile-sized digital
business card** — a mini landing page (not a website) with its description, contact
info, and links — shareable via a link + QR code for ads, flyers, and storefronts.

## Target user
Local / SMB owners (coffee shops, salons, trades, market stalls) who want a polished,
scannable presence without building a website, and find Linktree too plain/creator-flavored.
The entity is the **business**, not a person.

## Core value & differentiator
**Visual quality is the product and the moat** — cards must look more expensive than any
competitor's output. Design power is also the pricing ladder.

## Pricing tiers (design power = the upgrade)
| Tier | Price (target) | Gets |
|---|---|---|
| **Free** | $0 | 1 published card, curated templates + light tweaks (colors/logo/content), `/c/slug` URL, "Made with" badge |
| **Pro** | ~$8/mo | Unlimited cards, all 3 theme families + deep customization, no badge, analytics, lead capture, custom domain |
| **Premium** | ~$15/mo | Everything in Pro + **AI card generation** + premium-only template families |

## Must-have flows
1. **Browse** a gallery of stunning templates (also marketing/SEO).
2. **Create**: pick template → fill business info in a slick editor with live preview → publish.
3. **Share**: get a public URL (`/c/<slug>`) + QR + a beautiful OG preview when the link is shared.

## Non-goals (at least for v1)
- Full multi-page websites. Cards are single-screen by design.
- E-commerce / booking / payments *on* the card.
- Native mobile apps.

## Hackathon scope (online demo, ~1 week)
Build for the demo: landing page + **template gallery (the star)** + a live create→link/QR
flow (skip login), **deployed**. Defer full auth, billing, and AI to stretch. A clickable
live link replaces "scan the QR" for online judging; the OG unfurl is a wow-moment.
See `PLAN.md → Hackathon Track`.
