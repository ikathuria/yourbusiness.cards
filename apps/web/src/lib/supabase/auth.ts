import "server-only";
import { createClient } from "./server";

export type Account = { id: string; email: string | null; plan: "free" | "pro" | "premium" };

/** The current authenticated user (revalidated against Supabase), or null. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** The current user's account row (plan, email), or null if signed out. */
export async function getAccount(): Promise<Account | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("accounts")
    .select("id, email, plan")
    .eq("id", user.id)
    .maybeSingle<Account>();

  // Fall back to the auth user if the accounts row hasn't propagated yet.
  return data ?? { id: user.id, email: user.email ?? null, plan: "free" };
}
