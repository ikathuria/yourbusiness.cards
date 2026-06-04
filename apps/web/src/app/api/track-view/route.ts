/**
 * POST /api/track-view — record a public card view.
 * Body: { slug, source: "link" | "qr" }
 *
 * Called client-side (once per session per card) so prefetches/bots don't inflate
 * counts. Anonymous insert is allowed by RLS (card_views insert policy); reads are
 * owner-only, so counts surface in the owner's dashboard.
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return new Response(null, { status: 204 });

  let body: { slug?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }
  const slug = body.slug;
  const source = body.source === "qr" ? "qr" : "link";
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return new Response("bad slug", { status: 400 });

  const supabase = await createClient();
  const { data: card } = await supabase
    .from("business_cards")
    .select("id")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle<{ id: string }>();
  if (!card) return new Response(null, { status: 204 });

  await supabase.from("card_views").insert({ card_id: card.id, source });
  return new Response(null, { status: 204 });
}
