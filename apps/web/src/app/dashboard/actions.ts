"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { draftSlug, finalizeSlug, randomSuffix } from "@/lib/slug";
import { resolveTemplate } from "@/templates/registry";
import { PLAN_FEATURES, type Plan } from "@/features/billing/plans";
import { getAccount } from "@/lib/supabase/auth";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { generateQrArt } from "@/features/generate/qr-art";
import type { SaveCardInput } from "./save-types";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createCard(formData: FormData) {
  const templateId = resolveTemplate(String(formData.get("templateId") ?? "aurora")).id;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = "Untitled card";
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("business_cards")
      .insert({
        account_id: user.id,
        slug: draftSlug(name),
        template_id: templateId,
        business_name: name,
        published: false,
      })
      .select("id")
      .single();

    if (!error && data) {
      revalidatePath("/dashboard");
      redirect(`/dashboard/edit/${data.id}`); // straight into the editor
    }
    // retry only on unique-slug collisions
    if (error && error.code !== "23505") throw new Error(error.message);
  }
  throw new Error("Could not create a card — please try again.");
}

export async function togglePublish(formData: FormData) {
  const id = String(formData.get("id"));
  const next = String(formData.get("published")) === "true";
  const supabase = await createClient();

  // Enforce the plan's published-card limit when publishing.
  if (next) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: account } = await supabase
        .from("accounts")
        .select("plan")
        .eq("id", user.id)
        .maybeSingle<{ plan: Plan }>();
      const limit = PLAN_FEATURES[account?.plan ?? "free"].maxPublished;
      if (Number.isFinite(limit)) {
        const { count } = await supabase
          .from("business_cards")
          .select("id", { count: "exact", head: true })
          .eq("account_id", user.id)
          .eq("published", true)
          .neq("id", id);
        if ((count ?? 0) >= limit) redirect("/dashboard?limit=free");
      }
    }
  }

  const { error } = await supabase.from("business_cards").update({ published: next }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteCard(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("business_cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

/** Persist editor changes (owner-scoped). Replaces the card's links.
 * Returns the canonical slug (may differ from the requested one if it
 * collided with another card and a suffix was appended). */
export async function saveCard(
  input: SaveCardInput,
): Promise<{ ok: boolean; error?: string; slug?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const contact = Object.fromEntries(
    Object.entries(input.contact).filter(([, v]) => typeof v === "string" && v.trim()),
  );
  const theme_overrides: { accent?: string; accent2?: string } = {};
  if (input.themeAccent) theme_overrides.accent = input.themeAccent;
  if (input.themeAccent2) theme_overrides.accent2 = input.themeAccent2;

  const businessName = input.businessName.trim() || "Untitled card";
  const desiredBase = finalizeSlug(input.slug, businessName);

  // Try the desired slug; on a unique-slug collision (possibly with a card we
  // can't see under RLS), append a random suffix and retry.
  let slug = desiredBase;
  let lastError: string | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase
      .from("business_cards")
      .update({
        slug,
        template_id: input.templateId,
        business_name: businessName,
        tagline: input.tagline.trim() || null,
        description: input.description.trim() || null,
        contact,
        theme_overrides,
        published: input.published,
      })
      .eq("id", input.id)
      .eq("account_id", user.id);
    if (!error) {
      lastError = null;
      break;
    }
    if (error.code === "23505") {
      slug = `${desiredBase}-${randomSuffix()}`;
      lastError = "That link is taken — pick another.";
      continue;
    }
    return { ok: false, error: error.message };
  }
  if (lastError) return { ok: false, error: lastError };

  // Replace links with the current ordered set.
  await supabase.from("card_links").delete().eq("card_id", input.id);
  const links = input.links
    .filter((l) => l.label.trim() && l.url.trim())
    .map((l, i) => ({ card_id: input.id, label: l.label.trim(), url: l.url.trim(), icon: l.icon || "link", position: i }));
  if (links.length) {
    const { error: linkError } = await supabase.from("card_links").insert(links);
    if (linkError) return { ok: false, error: linkError.message };
  }

  revalidatePath("/dashboard");
  return { ok: true, slug };
}

/**
 * Premium: generate AI QR art for a card, store it in Supabase Storage, and save
 * the public URL on the card. Returns the URL for the editor to preview.
 */
export async function generateCardQrArt(input: {
  cardId: string;
  prompt: string;
}): Promise<{ ok: boolean; url?: string; error?: string }> {
  const account = await getAccount();
  if (!account) return { ok: false, error: "Not signed in." };
  if (!PLAN_FEATURES[account.plan].ai) return { ok: false, error: "AI QR art is a Premium feature." };
  if (!isAdminConfigured()) return { ok: false, error: "Storage isn't configured on the server." };

  const supabase = await createClient();
  const { data: card } = await supabase
    .from("business_cards")
    .select("id, slug")
    .eq("id", input.cardId)
    .eq("account_id", account.id)
    .maybeSingle<{ id: string; slug: string }>();
  if (!card) return { ok: false, error: "Card not found." };

  const base = (process.env.NEXT_PUBLIC_APP_URL || "https://yourbusiness.cards").replace(/\/$/, "");
  const target = `${base}/c/${card.slug}?src=qr`;

  const result = await generateQrArt({ url: target, prompt: input.prompt });
  if (!result.ok) return { ok: false, error: result.error };

  // Upload with the service role (bucket writes bypass RLS); path is per-card so
  // regenerating overwrites the previous art.
  const admin = createAdminClient();
  const path = `${account.id}/${card.id}.png`;
  const { error: uploadError } = await admin.storage
    .from("qr-art")
    .upload(path, result.bytes, { contentType: result.contentType, upsert: true });
  if (uploadError) return { ok: false, error: `Upload failed: ${uploadError.message}` };

  const { data: pub } = admin.storage.from("qr-art").getPublicUrl(path);
  // Cache-bust so the editor preview shows the new art after a regenerate.
  const url = `${pub.publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("business_cards")
    .update({ qr_art_url: url })
    .eq("id", card.id)
    .eq("account_id", account.id);
  if (updateError) return { ok: false, error: updateError.message };

  revalidatePath("/dashboard");
  return { ok: true, url };
}
