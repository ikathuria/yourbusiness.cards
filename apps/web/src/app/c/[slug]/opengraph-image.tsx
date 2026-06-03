import { ImageResponse } from "next/og";
import { seedCardBySlug } from "@/features/cards/seed";

/**
 * Per-card Open Graph image — the branded preview that unfurls when a card link
 * is shared (Slack/iMessage/X/social). Brand neobrutalist look: cream/ink with
 * violet/mint/coral. Uses the default font (upgrade to Sora later).
 */
export const alt = "Digital business card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = seedCardBySlug(slug);
  const name = card?.businessName ?? "YourBusiness.Cards";
  const tagline = card?.tagline ?? "Stunning digital business cards";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f4ee",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* decorative blocks (top-right) */}
        <div style={{ position: "absolute", top: 64, right: 80, display: "flex", gap: 16 }}>
          <div style={{ display: "flex", width: 48, height: 48, borderRadius: 12, background: "#6d5ef7", border: "3px solid #161320" }} />
          <div style={{ display: "flex", width: 48, height: 48, borderRadius: 12, background: "#21cfa0", border: "3px solid #161320" }} />
          <div style={{ display: "flex", width: 48, height: 48, borderRadius: 12, background: "#ff7a5c", border: "3px solid #161320" }} />
        </div>

        {/* brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, color: "#161320" }}>
          <div style={{ display: "flex", width: 22, height: 22, borderRadius: 7, background: "#6d5ef7" }} />
          <div style={{ display: "flex", fontWeight: 800 }}>yourbusiness</div>
          <div style={{ display: "flex", fontWeight: 800, color: "#6d5ef7" }}>.cards</div>
        </div>

        {/* name + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: name.length > 22 ? 76 : 100,
              fontWeight: 800,
              color: "#161320",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </div>
          <div style={{ display: "flex", marginTop: 8, height: 18, width: 220, background: "#ff7a5c" }} />
          <div style={{ display: "flex", marginTop: 24, fontSize: 38, color: "#6d5ef7", fontWeight: 700 }}>
            {tagline}
          </div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: "#161320" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", width: 14, height: 14, borderRadius: 99, background: "#21cfa0" }} />
            <div style={{ display: "flex" }}>Digital business card · tap or scan to connect</div>
          </div>
          {card && (
            <div style={{ display: "flex", color: "#161320", opacity: 0.55 }}>/c/{card.slug}</div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
