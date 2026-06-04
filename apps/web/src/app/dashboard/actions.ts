"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { draftSlug } from "@/lib/slug";
import { resolveTemplate } from "@/templates/registry";

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
      redirect("/dashboard"); // editor lands here in Milestone 5
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
