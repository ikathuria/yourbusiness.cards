/**
 * Template registry — the single source of truth for card designs.
 * The public renderer, gallery, editor preview, and AI generator all read this.
 * Add a template here once and it appears everywhere.
 *
 * Status: all three families built (Milestone 2) — 9 templates.
 */
import type { CardTemplate, TemplateFamily } from "./types";
import Aurora from "./modern/Aurora";
import Halo from "./modern/Halo";
import Monolith from "./modern/Monolith";
import Pop from "./bold/Pop";
import Neon from "./bold/Neon";
import Carnival from "./bold/Carnival";
import Editorial from "./classic/Editorial";
import Embossed from "./classic/Embossed";
import Linen from "./classic/Linen";

export const templates: CardTemplate[] = [
  // Modern Premium
  {
    id: "aurora",
    name: "Aurora",
    family: "modern",
    tier: "free",
    description: "Dark glassmorphism over a drifting gradient mesh.",
    Component: Aurora,
  },
  {
    id: "halo",
    name: "Halo",
    family: "modern",
    tier: "free",
    description: "Light and airy with a soft gradient halo.",
    Component: Halo,
  },
  {
    id: "monolith",
    name: "Monolith",
    family: "modern",
    tier: "pro",
    description: "Full-bleed gradient hero with a sticky contact bar.",
    Component: Monolith,
  },
  // Bold & Expressive
  {
    id: "pop",
    name: "Pop",
    family: "bold",
    tier: "free",
    description: "Neobrutalist sticker style with springy motion.",
    Component: Pop,
  },
  {
    id: "neon",
    name: "Neon",
    family: "bold",
    tier: "pro",
    description: "Dark with neon glow accents and glowing buttons.",
    Component: Neon,
  },
  {
    id: "carnival",
    name: "Carnival",
    family: "bold",
    tier: "pro",
    description: "Bright pastel gradient with floating shapes.",
    Component: Carnival,
  },
  // Clean & Classic
  {
    id: "editorial",
    name: "Editorial",
    family: "classic",
    tier: "free",
    description: "Serif display, thin rules, magazine layout.",
    Component: Editorial,
  },
  {
    id: "embossed",
    name: "Embossed",
    family: "classic",
    tier: "pro",
    description: "A literal business card, restrained and refined.",
    Component: Embossed,
  },
  {
    id: "linen",
    name: "Linen",
    family: "classic",
    tier: "premium",
    description: "Warm neutral palette with a refined serif.",
    Component: Linen,
  },
];

export const DEFAULT_TEMPLATE_ID = "aurora";

export function getTemplate(id: string): CardTemplate | undefined {
  return templates.find((t) => t.id === id);
}

/** Template for an id, falling back to the default so a card always renders. */
export function resolveTemplate(id: string): CardTemplate {
  return getTemplate(id) ?? templates.find((t) => t.id === DEFAULT_TEMPLATE_ID)!;
}

export function templatesByFamily(): Record<TemplateFamily, CardTemplate[]> {
  return templates.reduce(
    (acc, t) => {
      (acc[t.family] ??= []).push(t);
      return acc;
    },
    {} as Record<TemplateFamily, CardTemplate[]>,
  );
}
