/**
 * POST /api/stripe/checkout — start a subscription Checkout for Pro/Premium.
 * Body: { plan: "pro" | "premium" }  →  { url }
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { priceIdFor, type PaidPlan } from "@/features/billing/plans";
import { getBaseUrl } from "@/lib/url";

export const runtime = "nodejs";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) return json(503, { error: "Billing isn't configured yet." });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json(401, { error: "Sign in required." });

  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid body." });
  }
  const plan: PaidPlan = body.plan === "premium" ? "premium" : "pro";
  const price = priceIdFor(plan);
  if (!price) return json(503, { error: `Price for ${plan} isn't configured.` });

  const { data: account } = await supabase
    .from("accounts")
    .select("stripe_customer_id, email")
    .eq("id", user.id)
    .maybeSingle<{ stripe_customer_id: string | null; email: string | null }>();

  const stripe = getStripe();

  // Reuse or create the Stripe customer for this account.
  let customerId = account?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: account?.email ?? user.email ?? undefined,
      metadata: { account_id: user.id },
    });
    customerId = customer.id;
    await supabase.from("accounts").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const origin = await getBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/dashboard?upgraded=${plan}`,
    cancel_url: `${origin}/dashboard`,
    allow_promotion_codes: true,
    metadata: { account_id: user.id, plan },
    subscription_data: { metadata: { account_id: user.id } },
  });

  return json(200, { url: session.url });
}
