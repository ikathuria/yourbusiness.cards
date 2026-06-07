/**
 * POST /api/stripe/portal — open the Stripe Customer Portal to manage/cancel a
 * subscription. → { url }
 */
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/url";

export const runtime = "nodejs";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export async function POST() {
  if (!isStripeConfigured()) return json(503, { error: "Billing isn't configured yet." });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json(401, { error: "Sign in required." });

  const { data: account } = await supabase
    .from("accounts")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle<{ stripe_customer_id: string | null }>();

  if (!account?.stripe_customer_id) return json(400, { error: "No billing account yet — upgrade first." });

  const origin = await getBaseUrl();
  const session = await getStripe().billingPortal.sessions.create({
    customer: account.stripe_customer_id,
    return_url: `${origin}/dashboard`,
  });

  return json(200, { url: session.url });
}
