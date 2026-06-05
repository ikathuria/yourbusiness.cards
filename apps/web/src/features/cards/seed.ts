/**
 * Seed cards — sample businesses used by the gallery and the public renderer.
 * Each template id maps to a tailored sample so previews look real.
 *
 * These are well-known FICTIONAL pop-culture brands chosen to show off each
 * template's personality (demo/showcase only — swap to original parody names
 * before any real launch, as the names are trademarked).
 */
import type { BusinessCard } from "./types";

export const sampleCards: Record<string, BusinessCard> = {
  // ── Modern Premium ──────────────────────────────────────────
  aurora: {
    slug: "wayne-enterprises",
    templateId: "aurora",
    businessName: "Wayne Enterprises",
    tagline: "Building a brighter Gotham",
    description:
      "Aerospace, biotech, and applied sciences — innovating responsibly for a safer tomorrow.",
    contact: {
      email: "info@wayne.enterprises",
      website: "wayne.enterprises",
      address: "1007 Mountain Dr, Gotham City",
    },
    links: [
      { label: "Our divisions", url: "wayne.enterprises/divisions", icon: "link" },
      { label: "Wayne Foundation", url: "wayne.enterprises/foundation", icon: "link" },
      { label: "Careers", url: "wayne.enterprises/careers", icon: "link" },
    ],
    theme: { accent: "#c9a227" },
  },
  halo: {
    slug: "lumon-industries",
    templateId: "halo",
    businessName: "Lumon Industries",
    tagline: "The work is mysterious and important",
    description:
      "A diversified enterprise advancing the science of a balanced life since 1865. Praise Kier.",
    contact: {
      email: "outreach@lumon.industries",
      website: "lumon.industries",
      address: "Kier, PE",
    },
    links: [
      { label: "Explore severance", url: "lumon.industries/severance", icon: "link" },
      { label: "Our history", url: "lumon.industries/kier", icon: "link" },
    ],
    theme: { accent: "#3f9aa6" },
  },
  monolith: {
    slug: "stark-industries",
    templateId: "monolith",
    businessName: "Stark Industries",
    tagline: "The future, engineered",
    description:
      "Clean energy, advanced robotics, and aerospace. Privatizing world peace, one breakthrough at a time.",
    contact: {
      email: "press@stark.com",
      website: "stark.com",
      phone: "+1 (212) 970-4133",
      address: "200 Park Ave, New York, NY",
    },
    links: [
      { label: "Stark tech", url: "stark.com/tech", icon: "link" },
      { label: "Clean energy", url: "stark.com/arc", icon: "link" },
      { label: "Newsroom", url: "stark.com/news", icon: "link" },
    ],
    theme: { accent: "#e0322b" },
  },

  // ── Bold & Expressive ───────────────────────────────────────
  pop: {
    slug: "krusty-krab",
    templateId: "pop",
    businessName: "The Krusty Krab",
    tagline: "Home of the Krabby Patty",
    description:
      "The finest eating establishment under the sea. Secret-formula burgers, served fresh and fast.",
    contact: {
      phone: "+1 (555) 836-2274",
      website: "krustykrab.sea",
      address: "831 Bottom Feeder Ln, Bikini Bottom",
      hours: "Mon–Sun · 11am–9pm",
    },
    links: [
      { label: "See the menu", url: "krustykrab.sea/menu", icon: "link" },
      { label: "Krabby of the day", url: "krustykrab.sea/special", icon: "link" },
    ],
    theme: { accent: "#ef5e3a" },
  },
  neon: {
    slug: "duff-beer",
    templateId: "neon",
    businessName: "Duff Beer",
    tagline: "Can't get enough of that wonderful Duff",
    description:
      "Brewed with the finest hops since 1972. Ice-cold and always refreshing. Please drink responsibly.",
    contact: {
      website: "duff.beer",
      address: "Springfield",
      hours: "Tap room · daily till 2am",
    },
    links: [
      { label: "Find a tap near you", url: "duff.beer/locator", icon: "link" },
      { label: "Brewery tours", url: "duff.beer/tours", icon: "link" },
      { label: "Instagram", url: "instagram.com/duffbeer", icon: "instagram" },
    ],
    theme: { accent: "#ff2e4d" },
  },
  carnival: {
    slug: "willy-wonka",
    templateId: "carnival",
    businessName: "Wonka Chocolate Factory",
    tagline: "Pure imagination, pure chocolate",
    description:
      "Magical confections, everlasting gobstoppers, and golden-ticket tours. Scrumdiddlyumptious since 1964.",
    contact: {
      email: "goldenticket@wonka.chocolate",
      website: "wonka.chocolate",
    },
    links: [
      { label: "Win a golden ticket", url: "wonka.chocolate/ticket", icon: "link" },
      { label: "Our sweets", url: "wonka.chocolate/shop", icon: "link" },
    ],
    theme: { accent: "#7e57c2" },
  },

  // ── Clean & Classic ─────────────────────────────────────────
  editorial: {
    slug: "daily-planet",
    templateId: "editorial",
    businessName: "The Daily Planet",
    tagline: "Metropolis since 1938",
    description:
      "Award-winning journalism covering Metropolis and beyond. Truth, justice, and the stories that matter.",
    contact: {
      phone: "+1 (212) 555-1938",
      email: "tips@dailyplanet.news",
      website: "dailyplanet.news",
      address: "1000 Broadway, Metropolis",
    },
    links: [
      { label: "Subscribe", url: "dailyplanet.news/subscribe", icon: "link" },
      { label: "Today's front page", url: "dailyplanet.news/today", icon: "link" },
    ],
    theme: { accent: "#234a8f" },
  },
  embossed: {
    slug: "dunder-mifflin",
    templateId: "embossed",
    businessName: "Dunder Mifflin",
    tagline: "Limitless paper in a paperless world",
    description:
      "Your local source for paper and office supplies. Regional, reliable, and refreshingly personal.",
    contact: {
      phone: "+1 (570) 555-0000",
      email: "scranton@dundermifflin.com",
      website: "dundermifflin.com",
      address: "1725 Slough Ave, Scranton, PA",
    },
    links: [
      { label: "Shop paper", url: "dundermifflin.com/paper", icon: "link" },
      { label: "Request a quote", url: "dundermifflin.com/quote", icon: "link" },
    ],
    theme: { accent: "#2f5d8a" },
  },
  linen: {
    slug: "central-perk",
    templateId: "linen",
    businessName: "Central Perk",
    tagline: "Where everyone knows your order",
    description:
      "Coffee, couches, and good company in the heart of the Village. Open mic every Thursday.",
    contact: {
      phone: "+1 (212) 555-2468",
      website: "centralperk.cafe",
      address: "90 Bedford St, New York, NY",
      hours: "Mon–Sun · 6am–11pm",
    },
    links: [
      { label: "Our menu", url: "centralperk.cafe/menu", icon: "link" },
      { label: "Open mic night", url: "centralperk.cafe/openmic", icon: "link" },
    ],
    theme: { accent: "#b5651d" },
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
