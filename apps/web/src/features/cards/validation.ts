/**
 * Card data model — the input contract every template consumes.
 * zod 4 schemas; types are inferred and re-exported from `./types`.
 */
import { z } from "zod";

/** Contact details. All optional — templates render only what's present. */
export const contactSchema = z.object({
  phone: z.string().min(1).optional(),
  email: z.email().optional(),
  /** Free-form address; rendered as a Google Maps search link. */
  address: z.string().min(1).optional(),
  /** With or without protocol; normalized at render time. */
  website: z.string().min(1).optional(),
  hours: z.string().min(1).optional(),
});

/** A button/link on the card. */
export const cardLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  /** Optional lucide icon key (e.g. "instagram"); falls back to a generic link icon. */
  icon: z.string().optional(),
});

/** Plan-gated visual overrides. Kept minimal for now; templates lean on design tokens. */
export const themeOverridesSchema = z.object({
  /** CSS color used as the card's accent (overrides the template default). */
  accent: z.string().optional(),
});

export const businessCardSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, and dashes"),
  templateId: z.string().min(1),
  businessName: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  contact: contactSchema.default({}),
  links: z.array(cardLinkSchema).default([]),
  theme: themeOverridesSchema.optional(),
});
