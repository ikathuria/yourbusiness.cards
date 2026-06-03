import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seedCardBySlug } from "@/features/cards/seed";
import { resolveTemplate } from "@/templates/registry";

/**
 * Public business card renderer.
 *
 * Currently reads from seed data; Milestone 3 swaps this for Supabase (published
 * cards only). Picks the card's template from the registry and renders it.
 */

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const card = seedCardBySlug(slug);
  if (!card) return { title: "Card not found" };
  const title = card.tagline ? `${card.businessName} — ${card.tagline}` : card.businessName;
  return {
    title,
    description: card.description,
    openGraph: { title, description: card.description, type: "profile" },
  };
}

export default async function CardPage({ params }: PageParams) {
  const { slug } = await params;
  const card = seedCardBySlug(slug);
  if (!card) notFound();

  const template = resolveTemplate(card.templateId);
  const { Component } = template;

  return <Component card={card} />;
}
