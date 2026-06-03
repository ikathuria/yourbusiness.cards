import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedCard } from "@/features/cards/queries";
import { resolveTemplate } from "@/templates/registry";

/**
 * Public business card renderer.
 *
 * Reads PUBLISHED cards from Supabase (falls back to seed data when Supabase is
 * not configured). Picks the card's template from the registry and renders it.
 */

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const card = await getPublishedCard(slug);
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
  const card = await getPublishedCard(slug);
  if (!card) notFound();

  const template = resolveTemplate(card.templateId);
  const { Component } = template;

  return <Component card={card} />;
}
