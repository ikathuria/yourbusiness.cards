"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { draftSlug } from "@/lib/slug";
import { resolveTemplate } from "@/templates/registry";
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

/** Persist editor changes (owner-scoped). Replaces the card's links. */
export async function saveCard(input: SaveCardInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const contact = Object.fromEntries(
    Object.entries(input.contact).filter(([, v]) => typeof v === "string" && v.trim()),
  );
  const theme_overrides = input.themeAccent ? { accent: input.themeAccent } : {};

  const { error } = await supabase
    .from("business_cards")
    .update({
      template_id: input.templateId,
      business_name: input.businessName.trim() || "Untitled card",
      tagline: input.tagline.trim() || null,
      description: input.description.trim() || null,
      contact,
      theme_overrides,
      published: input.published,
    })
    .eq("id", input.id)
    .eq("account_id", user.id);
  if (error) return { ok: false, error: error.message };

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
  return { ok: true };
}
