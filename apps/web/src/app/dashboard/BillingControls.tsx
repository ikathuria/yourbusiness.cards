"use client";

import { useState } from "react";

/** Upgrade (Free) or Manage billing (Pro/Premium) — redirects to Stripe. */
export function BillingControls({ plan }: { plan: "free" | "pro" | "premium" }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(path: string, body?: object, tag?: string) {
    setBusy(tag ?? path);
    setError(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else setError(data.error ?? "Something went wrong.");
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(null);
    }
  }

  const btn =
    "rounded-lg border-2 border-ink px-4 py-2 text-sm font-extrabold transition-transform hover:-translate-y-0.5 disabled:opacity-60";

  return (
    <div className="flex flex-col gap-2">
      {plan === "free" ? (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => go("/api/stripe/checkout", { plan: "pro" }, "pro")} disabled={!!busy} className={`${btn} bg-brand text-white shadow-[3px_3px_0_0_#161320]`}>
            {busy === "pro" ? "…" : "Upgrade to Pro"}
          </button>
          <button onClick={() => go("/api/stripe/checkout", { plan: "premium" }, "premium")} disabled={!!busy} className={`${btn} bg-ink text-paper shadow-[3px_3px_0_0_#6d5ef7]`}>
            {busy === "premium" ? "…" : "Upgrade to Premium"}
          </button>
        </div>
      ) : (
        <button onClick={() => go("/api/stripe/portal", undefined, "portal")} disabled={!!busy} className={`${btn} bg-paper-2 text-ink`}>
          {busy === "portal" ? "…" : "Manage billing"}
        </button>
      )}
      {error && <p className="text-xs font-semibold text-coral">{error}</p>}
    </div>
  );
}
