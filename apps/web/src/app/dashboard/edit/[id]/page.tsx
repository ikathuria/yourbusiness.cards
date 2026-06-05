import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccount } from "@/lib/supabase/auth";
import { templates } from "@/templates/registry";
import { CardEditor, type EditorCard } from "../../CardEditor";

export const metadata: Metadata = { title: "Edit card" };

type Row = {
  id: string;
  slug: string;
  template_id: string;
  business_name: string;
  tagline: string | null;
  description: string | null;
  contact: EditorCard["contact"] | null;
  theme_overrides: { accent?: string; accent2?: string } | null;
  published: boolean;
  qr_art_url: string | null;
  card_links: { label: string; url: string; icon: string | null; position: number }[] | null;
};

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await getAccount();
  if (!account) redirect("/login");

  const supabase = await createClient();
  const BASE_COLS =
    "id, slug, template_id, business_name, tagline, description, contact, theme_overrides, published, card_links(label, url, icon, position)";

  // Prefer selecting qr_art_url, but tolerate it being absent if migration 0002
  // hasn't been applied yet (otherwise the whole query errors and 404s).
  let { data, error } = await supabase
    .from("business_cards")
    .select(`${BASE_COLS}, qr_art_url`)
    .eq("id", id)
    .eq("account_id", account.id)
    .maybeSingle<Row>();

  if (error) {
    ({ data, error } = await supabase
      .from("business_cards")
      .select(BASE_COLS)
      .eq("id", id)
      .eq("account_id", account.id)
      .maybeSingle<Row>());
  }

  if (!data) notFound();

  const initial: EditorCard = {
    id: data.id,
    slug: data.slug,
    templateId: data.template_id,
    businessName: data.business_name,
    tagline: data.tagline ?? "",
    description: data.description ?? "",
    contact: {
      phone: data.contact?.phone ?? "",
      email: data.contact?.email ?? "",
      website: data.contact?.website ?? "",
      address: data.contact?.address ?? "",
      hours: data.contact?.hours ?? "",
    },
    links: (data.card_links ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((l) => ({ label: l.label, url: l.url, icon: l.icon ?? "link" })),
    themeAccent: data.theme_overrides?.accent ?? null,
    themeAccent2: data.theme_overrides?.accent2 ?? null,
    published: data.published,
    qrArtUrl: data.qr_art_url ?? null,
  };

  const templateMeta = templates.map((t) => ({ id: t.id, name: t.name, family: t.family, tier: t.tier }));

  return <CardEditor initial={initial} plan={account.plan} templates={templateMeta} />;
}
