/** Card domain types, inferred from the zod schemas in `./validation`. */
import type { z } from "zod";
import type {
  businessCardSchema,
  contactSchema,
  cardLinkSchema,
  themeOverridesSchema,
} from "./validation";

export type BusinessCard = z.infer<typeof businessCardSchema>;
export type ContactInfo = z.infer<typeof contactSchema>;
export type CardLink = z.infer<typeof cardLinkSchema>;
export type ThemeOverrides = z.infer<typeof themeOverridesSchema>;
