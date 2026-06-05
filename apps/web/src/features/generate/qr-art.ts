import "server-only";
import Replicate from "replicate";
import QRCode from "qrcode";

/**
 * AI QR art via Replicate (Milestone 7A).
 *
 * A ControlNet "illusion"-style model turns a plain QR code into a scannable but
 * artistic image. We render the real QR ourselves and pass it as the control
 * `image`, so the encoded data stays identical and stable across regenerations
 * (rather than letting the model re-derive a QR from text each time).
 *
 *   REPLICATE_API_TOKEN   — your Replicate token
 *   REPLICATE_QR_MODEL    — "owner/name:version" (defaults to the illusion model)
 */

const DEFAULT_MODEL =
  "andreasjansson/illusion:75d51a73fce3c00de31ed9ab4358c73e8fc0f627dc8ce975818e653317cb919b";

export type QrArtResult =
  | { ok: true; bytes: Uint8Array; contentType: string }
  | { ok: false; error: string };

function firstUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) {
    for (const item of output) {
      const u = firstUrl(item);
      if (u) return u;
    }
    return null;
  }
  // Replicate's newer SDK can return FileOutput objects with a .url() helper.
  if (output && typeof output === "object" && "url" in output) {
    const u = (output as { url: unknown }).url;
    if (typeof u === "function") return String((output as { url: () => unknown }).url());
    if (typeof u === "string") return u;
  }
  return null;
}

export async function generateQrArt(opts: {
  url: string;
  prompt: string;
}): Promise<QrArtResult> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return { ok: false, error: "AI QR art isn't configured (missing REPLICATE_API_TOKEN)." };
  }
  const prompt = opts.prompt.trim();
  if (prompt.length < 3) return { ok: false, error: "Describe the QR style you want." };

  const model = (process.env.REPLICATE_QR_MODEL || DEFAULT_MODEL) as Parameters<
    Replicate["run"]
  >[0];
  const replicate = new Replicate({ auth: token });

  try {
    // Render the actual scannable QR for this URL and feed it as the control
    // image (data URI). This is what "regenerate" reuses so the QR data is
    // identical every time — only the artistic styling changes.
    const qrDataUri = await QRCode.toDataURL(opts.url, {
      margin: 2,
      width: 768,
      errorCorrectionLevel: "H", // high redundancy survives the stylization
      color: { dark: "#000000", light: "#ffffff" },
    });

    const output = await replicate.run(model, {
      input: {
        prompt,
        image: qrDataUri,
        qr_code_content: "", // empty → use the supplied control image
        // High controlnet weight keeps the QR readable (model range 0–4, default
        // 2.2).
        controlnet_conditioning_scale: 2.0,
        num_inference_steps: 40,
        guidance_scale: 6.5, // lower guidance = less over-stylization that hides modules
        negative_prompt:
          "ugly, disfigured, low quality, blurry, busy background, low contrast, noisy, cluttered, illegible",
      },
    });

    const imageUrl = firstUrl(output);
    if (!imageUrl) return { ok: false, error: "The model returned no image. Try again." };

    const res = await fetch(imageUrl);
    if (!res.ok) return { ok: false, error: `Couldn't fetch the generated image (${res.status}).` };
    const bytes = new Uint8Array(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "image/png";
    return { ok: true, bytes, contentType };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: `QR art generation failed: ${message}` };
  }
}
