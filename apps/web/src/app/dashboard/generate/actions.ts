"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAccount } from "@/lib/supabase/auth";
import { draftSlug } from "@/lib/slug";
import { PLAN_FEATURES } from "@/features/billing/plans";
import { generateCardDraft } from "@/features/generate/generate";

/**
 * Premium AI card generation. Takes a free-text brief, asks Claude to select a
 * template + accent + copy from the registry, creates a draft card, and drops
 * the owner straight into the editor.
 */
export async function generateCard(formData: FormData) {
  const account = await getAccount();
  if (!account) redirect("/login");
  if (!PLAN_FEATURES[account.plan].ai) redirect("/dashboard?upgrade=ai");

  const brief = String(formData.get("brief") ?? "");
  const result = await generateCardDraft(brief);
  if (!result.ok) {
    redirect(`/dashboard/generate?error=${encodeURIComponent(result.error)}`);
  }
  const card = result.card;

  const supabase = await createClient();
  const contact = Object.fromEntries(
    Object.entries(card.contact).filter(([, v]) => typeof v === "string" && v.trim()),
  );

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("business_cards")
      .insert({
        account_id: account.id,
        slug: draftSlug(card.businessName),
        template_id: card.templateId,
        business_name: card.businessName,
        tagline: card.tagline || null,
        description: card.description || null,
        contact,
        theme_overrides: card.accent ? { accent: card.accent } : {},
        published: false,
      })
      .select("id")
      .single();

    if (!error && data) {
      const links = card.links
        .filter((l) => l.label.trim() && l.url.trim())
        .map((l, i) => ({
          card_id: data.id,
          label: l.label.trim(),
          url: l.url.trim(),
          icon: l.icon || "link",
          position: i,
        }));
      if (links.length) await supabase.from("card_links").insert(links);

      revalidatePath("/dashboard");
      redirect(`/dashboard/edit/${data.id}?generated=1`);
    }
    if (error && error.code !== "23505") throw new Error(error.message);
  }
  throw new Error("Could not save the generated card — please try again.");
}
