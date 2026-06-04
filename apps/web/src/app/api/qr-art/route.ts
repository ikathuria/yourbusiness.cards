/**
 * POST /api/qr-art — generate AI QR art for a card (Premium only).
 * Body: { cardId, prompt, qrStrength? }
 *
 * Verifies ownership + Premium plan, generates scannable QR art via Replicate,
 * persists it to Supabase Storage, and saves the URL onto the card
 * (theme_overrides.qrArtUrl). Returns { url }.
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateQrArt, isReplicateConfigured } from "@/lib/replicate";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel-safe; generation usually completes within this

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json(401, { error: "Sign in required." });

  const { data: account } = await supabase
    .from("accounts")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle<{ plan: string }>();
  if (account?.plan !== "premium") {
    return json(403, { error: "AI QR art is a Premium feature.", upgrade: true });
  }
  if (!isReplicateConfigured()) {
    return json(503, { error: "AI QR art isn't configured yet (missing REPLICATE_API_TOKEN)." });
  }

  let body: { cardId?: string; prompt?: string; qrStrength?: number };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid request body." });
  }
  const cardId = body.cardId;
  const prompt = (body.prompt ?? "").trim();
  if (!cardId || !prompt) return json(400, { error: "cardId and prompt are required." });

  const { data: card } = await supabase
    .from("business_cards")
    .select("slug, theme_overrides")
    .eq("id", cardId)
    .eq("account_id", user.id)
    .maybeSingle<{ slug: string; theme_overrides: Record<string, unknown> | null }>();
  if (!card) return json(404, { error: "Card not found." });

  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || new URL(req.url).origin;
  const url = `${base}/c/${card.slug}`;

  let imageUrl: string;
  try {
    ({ imageUrl } = await generateQrArt({ url, prompt, qrStrength: body.qrStrength }));
  } catch (e) {
    return json(502, { error: e instanceof Error ? e.message : "Generation failed." });
  }

  // Persist the image to Storage so the link doesn't expire.
  try {
    const imgRes = await fetch(imageUrl);
    const bytes = new Uint8Array(await imgRes.arrayBuffer());
    const admin = createAdminClient();
    const path = `${cardId}/${Date.now()}.png`;
    const { error: upErr } = await admin.storage
      .from("card-art")
      .upload(path, bytes, { contentType: "image/png", upsert: true });
    if (upErr) throw upErr;
    const {
      data: { publicUrl },
    } = admin.storage.from("card-art").getPublicUrl(path);

    const theme = { ...(card.theme_overrides ?? {}), qrArtUrl: publicUrl };
    await supabase.from("business_cards").update({ theme_overrides: theme }).eq("id", cardId).eq("account_id", user.id);

    return json(200, { url: publicUrl });
  } catch (e) {
    // Fall back to the (temporary) Replicate URL if storage fails.
    return json(200, { url: imageUrl, ephemeral: true, warn: e instanceof Error ? e.message : "storage failed" });
  }
}
