/**
 * Plan config — the single source of truth for tier gates and Stripe price mapping.
 * `PLAN_FEATURES` is plain data (safe to import anywhere); the price helpers read
 * server env (price IDs aren't secret, but they're only set server-side).
 */
export type Plan = "free" | "pro" | "premium";

export type PlanFeatures = {
  label: string;
  /** max PUBLISHED cards at once (drafts are unlimited). */
  maxPublished: number;
  customColor: boolean;
  allFamilies: boolean;
  ai: boolean;
  /** show the "Made with" badge on public cards. */
  badge: boolean;
};

export const PLAN_FEATURES: Record<Plan, PlanFeatures> = {
  free: { label: "Free", maxPublished: 1, customColor: false, allFamilies: false, ai: false, badge: true },
  pro: { label: "Pro", maxPublished: Infinity, customColor: true, allFamilies: true, ai: false, badge: false },
  premium: { label: "Premium", maxPublished: Infinity, customColor: true, allFamilies: true, ai: true, badge: false },
};

export type PaidPlan = Exclude<Plan, "free">;

export function priceIdFor(plan: PaidPlan): string | undefined {
  return plan === "pro"
    ? process.env.STRIPE_PRICE_PRO_MONTHLY
    : process.env.STRIPE_PRICE_PREMIUM_MONTHLY;
}

/** Map a Stripe price id back to a plan (falls back to free). */
export function planFromPriceId(priceId: string | null | undefined): Plan {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return "pro";
  if (priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY) return "premium";
  return "free";
}
