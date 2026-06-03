/** Template registry contract. See src/templates/README.md. */
import type { ComponentType } from "react";
import type { BusinessCard } from "@/features/cards/types";

export type TemplateFamily = "modern" | "bold" | "classic";
export type TemplateTier = "free" | "pro" | "premium";

export type TemplateProps = { card: BusinessCard };

export type CardTemplateMeta = {
  id: string;
  name: string;
  family: TemplateFamily;
  tier: TemplateTier;
  /** One-line description for the gallery. */
  description: string;
};

export type CardTemplate = CardTemplateMeta & {
  Component: ComponentType<TemplateProps>;
};

export const FAMILY_LABELS: Record<TemplateFamily, string> = {
  modern: "Modern Premium",
  bold: "Bold & Expressive",
  classic: "Clean & Classic",
};
