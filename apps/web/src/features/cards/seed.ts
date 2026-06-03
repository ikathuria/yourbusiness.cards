/**
 * Seed cards — sample businesses used by the gallery and the public renderer
 * before the Supabase data layer (Milestone 3) lands. Each template id maps to a
 * tailored sample so previews look real.
 */
import type { BusinessCard } from "./types";

export const sampleCards: Record<string, BusinessCard> = {
  aurora: {
    slug: "lumen-coffee",
    templateId: "aurora",
    businessName: "Lumen Coffee",
    tagline: "Specialty roasts, all day",
    description: "Single-origin espresso, slow bar, and pastries baked in-house every morning.",
    contact: {
      phone: "+1 (415) 555-0123",
      website: "lumen.coffee",
      address: "812 Valencia St, San Francisco, CA",
      hours: "Mon–Sun · 7am–6pm",
    },
    links: [
      { label: "Order ahead", url: "lumen.coffee/order", icon: "link" },
      { label: "Instagram", url: "instagram.com/lumencoffee", icon: "instagram" },
      { label: "Our menu", url: "lumen.coffee/menu", icon: "link" },
    ],
  },
  halo: {
    slug: "maison-bloom",
    templateId: "halo",
    businessName: "Maison Bloom",
    tagline: "Floral design studio",
    description: "Seasonal arrangements, weddings, and weekly subscriptions for homes and offices.",
    contact: {
      phone: "+1 (212) 555-0177",
      email: "hello@maisonbloom.co",
      website: "maisonbloom.co",
      address: "45 Greenwich Ave, New York, NY",
    },
    links: [
      { label: "Book a consultation", url: "maisonbloom.co/book", icon: "link" },
      { label: "Instagram", url: "instagram.com/maisonbloom", icon: "instagram" },
    ],
  },
  monolith: {
    slug: "vertex-studio",
    templateId: "monolith",
    businessName: "Vertex Studio",
    tagline: "Brand & product design",
    description: "We build identities and interfaces for ambitious teams. Currently booking Q3.",
    contact: {
      email: "studio@vertex.design",
      website: "vertex.design",
      phone: "+1 (310) 555-0199",
    },
    links: [
      { label: "See our work", url: "vertex.design/work", icon: "link" },
      { label: "Start a project", url: "vertex.design/contact", icon: "link" },
      { label: "LinkedIn", url: "linkedin.com/company/vertex", icon: "linkedin" },
    ],
  },
};

/** A sample card for a given template id (falls back to a generic one). */
export function sampleCardFor(templateId: string): BusinessCard {
  return (
    sampleCards[templateId] ?? {
      ...sampleCards.aurora,
      templateId,
      slug: `demo-${templateId}`,
    }
  );
}

/** Lookup a seed card by slug (used by the placeholder /c/[slug] renderer). */
export function seedCardBySlug(slug: string): BusinessCard | undefined {
  return Object.values(sampleCards).find((c) => c.slug === slug);
}
