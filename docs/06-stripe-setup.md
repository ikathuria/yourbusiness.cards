# 06 — Stripe Setup (Milestone 6)

Monetization is built (checkout, customer portal, webhook, plan gates). The payment
flow is dormant until you add a Stripe account's keys. Everything degrades gracefully
without them (checkout/portal return "Billing isn't configured yet").

## 1. Stripe account (stay in TEST mode)
Create/sign in at <https://dashboard.stripe.com>. Keep the **Test mode** toggle ON —
test cards don't charge real money.

## 2. Create two products with monthly prices
**Product catalog → Add product** (twice):
- **Pro** — recurring, e.g. **$8 / month** → copy the **Price ID** (`price_…`).
- **Premium** — recurring, e.g. **$15 / month** → copy the **Price ID**.

## 3. Get your API key
**Developers → API keys** → copy the **Secret key** (`sk_test_…`).
(The publishable key isn't needed — we use Stripe-hosted Checkout via redirect.)

## 4. Add a webhook endpoint
**Developers → Webhooks → Add endpoint**:
- **URL:** `https://yourbusiness-cards.vercel.app/api/stripe/webhook`
- **Events:** `checkout.session.completed`, `customer.subscription.created`,
  `customer.subscription.updated`, `customer.subscription.deleted`
- Copy the **Signing secret** (`whsec_…`).

## 5. Enable the Customer Portal
**Settings → Billing → Customer portal** → activate (lets users cancel/switch).

## 6. Add env vars
In **Vercel → Project → Settings → Environment Variables** (and your local
`apps/web/.env.local`):
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
```
Redeploy after adding them in Vercel.

## 7. Test the flow (test mode)
1. On the deployed site: sign in → **Dashboard → Upgrade to Pro**.
2. Pay with the Stripe test card: **4242 4242 4242 4242**, any future expiry, any CVC, any ZIP.
3. You're redirected to `/dashboard?upgraded=pro`; the webhook flips your plan to **Pro**.
4. Verify: the plan badge reads **PRO**, the editor's custom-color unlocks, and you can
   publish more than one card. **Manage billing** opens the portal; canceling reverts to Free.
5. Premium unlocks the AI features (QR art / card generator) too.

> Local webhook testing (optional): `stripe listen --forward-to localhost:3000/api/stripe/webhook`
> prints a local `whsec_…` to use in `.env.local`. Otherwise just test against the deployed URL.

## How plans gate features
Source of truth: `apps/web/src/features/billing/plans.ts`.
- **Free:** 1 published card, curated templates, no custom color, no AI.
- **Pro:** unlimited cards, full customization, no badge.
- **Premium:** + AI QR art & AI card generator.
The webhook (`/api/stripe/webhook`) keeps `accounts.plan` in sync with the subscription.
