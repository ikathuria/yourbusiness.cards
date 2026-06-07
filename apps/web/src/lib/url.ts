import "server-only";
import { headers } from "next/headers";

const LOCAL = /(localhost|127\.0\.0\.1|0\.0\.0\.0)/;

/**
 * Absolute base URL (no trailing slash) for building public links — QR targets,
 * share links, Stripe redirects, OG.
 *
 * Resolution order, designed to "just work" on Vercel without a manual env:
 *   1. An explicit, NON-localhost `NEXT_PUBLIC_APP_URL` (intentional override).
 *   2. The live request host (correct in prod and locally) via forwarded headers.
 *   3. Vercel's system-provided production/deployment URL.
 *   4. Whatever `NEXT_PUBLIC_APP_URL` is, else localhost.
 *
 * Note: a localhost value of `NEXT_PUBLIC_APP_URL` is deliberately ignored when a
 * real request host is available, so a stale env var can't poison prod links.
 */
export async function getBaseUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
  if (configured && !LOCAL.test(configured)) return configured;

  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") ?? (LOCAL.test(host) ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // headers() is unavailable outside a request scope — fall through.
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return configured || "http://localhost:3000";
}
