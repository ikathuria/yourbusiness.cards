/**
 * QR endpoint — returns a scannable QR code that opens a card at /c/[slug].
 *
 * GET /api/qr?slug=lumen-coffee[&format=svg][&fg=161320][&bg=f7f4ee|transparent][&size=512]
 *
 * Self-hosted via the `qrcode` lib (no third-party QR SaaS). Default colors use
 * the brand palette (ink on paper). Styled per card later via the editor.
 */
import QRCode from "qrcode";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const HEX = /^[0-9a-fA-F]{3,8}$/;

function color(value: string | null, fallback: string): string {
  if (!value) return fallback;
  if (value.toLowerCase() === "transparent") return "#00000000";
  return HEX.test(value) ? `#${value}` : fallback;
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return new Response("Missing or invalid 'slug'", { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || origin;
  const target = `${base}/c/${slug}?src=qr`; // tag scans for analytics

  const dark = color(searchParams.get("fg"), "#161320");
  const light = color(searchParams.get("bg"), "#f7f4ee");
  const size = Math.min(Math.max(Number(searchParams.get("size")) || 512, 128), 1024);
  const format = searchParams.get("format") === "svg" ? "svg" : "png";

  const opts = { margin: 2, color: { dark, light }, errorCorrectionLevel: "M" as const };

  try {
    if (format === "svg") {
      const svg = await QRCode.toString(target, { type: "svg", ...opts });
      return new Response(svg, {
        headers: {
          "content-type": "image/svg+xml",
          "cache-control": "public, max-age=86400, immutable",
        },
      });
    }
    const png = await QRCode.toBuffer(target, { type: "png", width: size, ...opts });
    return new Response(new Uint8Array(png), {
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response("Failed to generate QR", { status: 500 });
  }
}
