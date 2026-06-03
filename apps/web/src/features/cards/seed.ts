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
  pop: {
    slug: "scoops-parlour",
    templateId: "pop",
    businessName: "Scoops Parlour",
    tagline: "24 wild flavors",
    description: "Small-batch ice cream, sundaes, and shakes. Made fresh, scooped with joy.",
    contact: {
      phone: "+1 (305) 555-0144",
      website: "scoops.fun",
      address: "120 Ocean Dr, Miami, FL",
    },
    links: [
      { label: "Today's flavors", url: "scoops.fun/flavors", icon: "link" },
      { label: "Order a cake", url: "scoops.fun/cakes", icon: "link" },
    ],
  },
  neon: {
    slug: "fade-house",
    templateId: "neon",
    businessName: "Fade House",
    tagline: "Cuts after dark",
    description: "Precision fades, hot-towel shaves, and beard work. Walk-ins till midnight.",
    contact: {
      phone: "+1 (702) 555-0188",
      website: "fadehouse.la",
      address: "9 Fremont St, Las Vegas, NV",
      hours: "Tue–Sun · 2pm–12am",
    },
    links: [
      { label: "Book a chair", url: "fadehouse.la/book", icon: "link" },
      { label: "Instagram", url: "instagram.com/fadehouse", icon: "instagram" },
    ],
  },
  carnival: {
    slug: "sugar-petal",
    templateId: "carnival",
    businessName: "Sugar & Petal",
    tagline: "Cakes & blooms",
    description: "Custom cakes and fresh flowers for birthdays, weddings, and just-because days.",
    contact: {
      phone: "+1 (503) 555-0166",
      email: "hi@sugarpetal.shop",
      website: "sugarpetal.shop",
    },
    links: [
      { label: "Order a cake", url: "sugarpetal.shop/order", icon: "link" },
      { label: "Wedding inquiries", url: "sugarpetal.shop/weddings", icon: "link" },
    ],
  },
  editorial: {
    slug: "hale-mercer",
    templateId: "editorial",
    businessName: "Hale & Mercer",
    tagline: "Attorneys at Law",
    description: "Estate planning, real estate, and small-business counsel. Trusted since 1998.",
    contact: {
      phone: "+1 (617) 555-0133",
      email: "office@halemercer.law",
      website: "halemercer.law",
      address: "200 Beacon St, Boston, MA",
    },
    links: [
      { label: "Schedule a consultation", url: "halemercer.law/contact", icon: "link" },
    ],
  },
  embossed: {
    slug: "northgate-plumbing",
    templateId: "embossed",
    businessName: "Northgate Plumbing",
    tagline: "Licensed & insured",
    description: "Residential and commercial plumbing. Same-day service, upfront pricing, no surprises.",
    contact: {
      phone: "+1 (614) 555-0111",
      email: "dispatch@northgate.plumbing",
      website: "northgate.plumbing",
      address: "Serving Greater Columbus, OH",
    },
    links: [
      { label: "Request service", url: "northgate.plumbing/book", icon: "link" },
      { label: "Get a quote", url: "northgate.plumbing/quote", icon: "link" },
    ],
  },
  linen: {
    slug: "flour-stone",
    templateId: "linen",
    businessName: "Flour & Stone",
    tagline: "Wood-fired bakery",
    description: "Naturally leavened sourdough, morning pastries, and stone-milled flour. Baked daily.",
    contact: {
      phone: "+1 (415) 555-0150",
      website: "flourandstone.bakery",
      address: "27 Mill Ln, Sonoma, CA",
      hours: "Wed–Sun · 7am–2pm",
    },
    links: [
      { label: "Pre-order bread", url: "flourandstone.bakery/order", icon: "link" },
      { label: "Visit us", url: "flourandstone.bakery/visit", icon: "link" },
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
