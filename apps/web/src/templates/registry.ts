/**
 * Template registry — the single source of truth for card designs.
 * The public renderer, gallery, editor preview, and AI generator all read this.
 * Add a template here once and it appears everywhere.
 *
 * Status: Modern Premium family built (Milestone 2, family-first). Bold &
 * Classic families to follow.
 */
import type { CardTemplate, TemplateFamily } from "./types";
import Aurora from "./modern/Aurora";
import Halo from "./modern/Halo";
import Monolith from "./modern/Monolith";

export const templates: CardTemplate[] = [
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
