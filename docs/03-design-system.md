# 03 — Design System

> Visual quality is the product. Treat design as a feature with acceptance criteria, not
> "polish." Source of truth: CSS variables in `apps/web/src/app/globals.css` (Tailwind 4
> `@theme`) + TS mirrors in `apps/web/src/design/`.

## Files
| File | Role |
|---|---|
| `src/app/globals.css` | Color roles (light + dark), `@theme` token→utility mapping, radii, shadows, display type sizes, gradient/`font-display` helpers, reduced-motion guard |
| `src/design/tokens.ts` | TS mirror of programmatic tokens — color role names, motion `duration`/`easing`, `radius`, `typeScale`, shadow roles |
| `src/design/fonts.ts` | `next/font` pairings → `--font-display` (Sora), `--font-sans` (Inter), `--font-mono` (JetBrains Mono) |
| `src/design/motion.ts` | Shared Motion variants: `fadeInUp`, `scaleIn`, `fadeIn`, `staggerContainer`, `hoverLift`, `tapPress` |

## Color roles (semantic — never use raw hex in components)
`background`, `surface`, `surface-elevated`, `foreground`, `muted`, `border`, `brand`,
`brand-foreground`, `accent`, `ring`. Consumed as Tailwind utilities (`bg-surface`,
`text-muted`, `border-border`, `bg-brand`, …) or `var(--color-<role>)`. Light + dark via
`prefers-color-scheme`.

Brand identity: indigo-violet `--brand` → pink `--accent`, used as the signature gradient
(`.bg-brand-gradient`, `.text-brand-gradient`).

## Type
Display **Sora** (headlines, business names), body **Inter**, mono **JetBrains Mono**.
Display sizes: `text-display-1`, `text-display-2` (fluid `clamp`).

## Motion
Durations `fast .18 / base .32 / slow .6`; easing `emphasized [0.16,1,0.3,1]` for entrances.
Every animated surface must respect `prefers-reduced-motion` (`useReducedMotion`).

## The three template families (Milestone 2)
- **Modern Premium** — glassy, big type, gradients, smooth motion.
- **Bold & Expressive** — vivid color, display fonts, playful motion.
- **Clean & Classic** — minimal, refined serif/sans, restrained.

## Pixel-QA gate (definition of "done" for any visual task)
1. Correct on a **390px** mobile viewport. 2. Single-screen (no mobile scroll for a card).
3. Has motion (and a reduced-motion fallback). 4. Has empty/loading states.
5. Passes a side-by-side against a Linear/Stripe/Vercel-tier reference.
