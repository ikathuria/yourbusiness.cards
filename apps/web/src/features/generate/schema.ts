/**
 * Constrained output schema for AI card generation.
 *
 * Claude must *select* a template + accent from the registry and write copy —
 * never raw CSS. The schema is the contract that keeps the model on the rails;
 * the server validates against it before creating a draft card.
 */
import { z } from "zod";
import { templates, DEFAULT_TEMPLATE_ID } from "@/templates/registry";

/** Registry template ids the model may choose from. */
export const TEMPLATE_IDS = templates.map((t) => t.id) as [string, ...string[]];

/** Curated accent presets the model picks from (matches the editor swatches). */
export const ACCENT_PRESETS = [
  "#6d5ef7",
  "#21cfa0",
  "#ff7a5c",
  "#f25ca2",
  "#0ea5e9",
  "#f59e0b",
  "#ef4444",
  "#0f172a",
] as const;

export const generatedCardSchema = z.object({
  templateId: z
    .enum(TEMPLATE_IDS)
    .catch(DEFAULT_TEMPLATE_ID)
    .describe("Registry template id whose aesthetic fits this business."),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .describe("Accent color as a #RRGGBB hex, ideally one of the brand presets."),
  businessName: z.string().min(1).max(60),
  tagline: z.string().max(80).describe("Short punchy tagline (a few words)."),
  description: z.string().max(220).describe("One or two warm sentences about the business."),
  contact: z.object({
    phone: z.string().max(40).optional(),
    email: z.string().max(120).optional(),
    website: z.string().max(120).optional(),
    address: z.string().max(160).optional(),
    hours: z.string().max(120).optional(),
  }),
  links: z
    .array(
      z.object({
        label: z.string().min(1).max(40),
        url: z.string().min(1).max(200),
        icon: z.string().max(30).optional(),
      }),
    )
    .max(6)
    .describe("Up to 6 call-to-action links (Order, Menu, Book, Instagram, etc.)."),
});

export type GeneratedCard = z.infer<typeof generatedCardSchema>;

/** JSON Schema for the Anthropic tool. Hand-written to stay in sync with the zod schema above. */
export const generatedCardJsonSchema = {
  type: "object",
  properties: {
    templateId: { type: "string", enum: TEMPLATE_IDS, description: "Registry template id." },
    accent: { type: "string", description: "#RRGGBB accent hex." },
    businessName: { type: "string" },
    tagline: { type: "string" },
    description: { type: "string" },
    contact: {
      type: "object",
      properties: {
        phone: { type: "string" },
        email: { type: "string" },
        website: { type: "string" },
        address: { type: "string" },
        hours: { type: "string" },
      },
    },
    links: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          url: { type: "string" },
          icon: { type: "string", description: "lucide icon key, e.g. instagram, phone, link" },
        },
        required: ["label", "url"],
      },
    },
  },
  required: ["templateId", "accent", "businessName", "tagline", "description", "contact", "links"],
} as const;
