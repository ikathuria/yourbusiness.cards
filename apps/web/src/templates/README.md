# Template registry (`src/templates/`)

The **single source of truth** for card designs. The public renderer (`/c/[slug]`),
the gallery (`/templates`), the editor live-preview, and the Premium AI generator
all import from here — add a template once and it appears everywhere.

## Contract (built in Milestone 2)

Each template is a typed entry:

```ts
type CardTemplate = {
  id: string;                  // stable, URL/DB-safe, e.g. "aurora"
  name: string;                // display name
  family: "modern" | "bold" | "classic";
  tier: "free" | "pro" | "premium";
  previewImage: string;        // gallery thumbnail
  Component: React.ComponentType<{ card: BusinessCard }>; // consumes the card model
};
```

- Templates **consume design tokens** (`src/design/`) — never hardcode raw colors/sizes.
- Every template is **single-screen** (viewport-height, mobile-first, no scroll on mobile),
  ships tasteful Motion, and respects `prefers-reduced-motion`.
- Three families: **modern** (premium/glassy), **bold** (vivid/expressive), **classic** (clean/refined).
- Target at launch: ~3 per family (9 total).

> The AI generator only ever *selects* a registered template + token palette — never raw CSS.
