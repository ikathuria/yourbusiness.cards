/**
 * POST /api/stripe/webhook — Stripe events → update accounts.plan.
 *
 * Verifies the signature against the raw body, then maps subscription state to a
 * plan via the service-role client (no user session in a webhook). Set this URL
 * as a Stripe webhook endpoint and put its signing secret in STRIPE_WEBHOOK_SECRET.
 */
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { planFromPriceId, type Plan } from "@/features/billing/plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return new Response("not configured", { status: 503 });

  const raw = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    return new Response(`Webhook signature error: ${e instanceof Error ? e.message : "bad"}`, { status: 400 });
  }

  const admin = createAdminClient();
  const setPlanByCustomer = (customer: string, plan: Plan) =>
    admin.from("accounts").update({ plan }).eq("stripe_customer_id", customer);

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const accountId = s.metadata?.account_id;
      const plan = (s.metadata?.plan as Plan) ?? "pro";
      const customer = typeof s.customer === "string" ? s.customer : s.customer?.id;
      if (accountId) {
        await admin.from("accounts").update({ plan, stripe_customer_id: customer }).eq("id", accountId);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price?.id;
      const active = sub.status === "active" || sub.status === "trialing";
      const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      await setPlanByCustomer(customer, active ? planFromPriceId(priceId) : "free");
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      await setPlanByCustomer(customer, "free");
      break;
    }
  }

  return new Response("ok", { status: 200 });
}
