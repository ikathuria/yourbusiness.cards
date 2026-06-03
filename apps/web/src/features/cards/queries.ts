import "server-only";
import type { BusinessCard, CardLink } from "./types";
import { seedCardBySlug } from "./seed";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** A business_cards row joined with its card_links (snake_case, from Postgres). */
type CardRow = {
  slug: string;
  template_id: string;
  business_name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  contact: BusinessCard["contact"] | null;
  theme_overrides: Record<string, unknown> | null;
  card_links: { label: string; url: string; icon: string | null; position: number }[] | null;
};

function mapRow(row: CardRow): BusinessCard {
  const links: CardLink[] = (row.card_links ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((l) => ({ label: l.label, url: l.url, icon: l.icon ?? undefined }));

  const theme = row.theme_overrides && Object.keys(row.theme_overrides).length > 0
    ? (row.theme_overrides as BusinessCard["theme"])
    : undefined;

  return {
    slug: row.slug,
    templateId: row.template_id,
    businessName: row.business_name,
    tagline: row.tagline ?? undefined,
    description: row.description ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    coverUrl: row.cover_url ?? undefined,
    contact: row.contact ?? {},
    links,
    theme,
  };
}

/**
 * Fetch a PUBLISHED card by slug. Reads from Supabase when configured (RLS allows
 * anon read of published cards), otherwise — or on any error / miss — falls back
 * to seed data so the 9 demo cards always render. Returns undefined if not found.
 */
export async function getPublishedCard(slug: string): Promise<BusinessCard | undefined> {
  if (!isSupabaseConfigured()) return seedCardBySlug(slug);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("business_cards")
      .select(
        "slug, template_id, business_name, tagline, description, logo_url, cover_url, contact, theme_overrides, card_links(label, url, icon, position)",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle<CardRow>();

    if (error || !data) return seedCardBySlug(slug);
    return mapRow(data);
  } catch {
    return seedCardBySlug(slug);
  }
}
