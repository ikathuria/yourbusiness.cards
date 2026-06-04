import "server-only";

/**
 * Thin Replicate client for AI QR art (Stable Diffusion + QR ControlNet).
 *
 * The exact model + input keys are centralized here so they can be confirmed
 * against the live API once a token exists (model schemas vary by version).
 * Default model: a QR-art ControlNet that turns a URL into scannable artwork.
 */
const API = "https://api.replicate.com/v1";

// Monster Labs "QR Code Monster v2" via Replicate — best scannability + quality.
// Input keys verified against the live schema (qr_code_content, prompt,
// negative_prompt, guidance_scale, num_inference_steps, controlnet_conditioning_scale).
const QR_MODEL = "andreasjansson/illusion";

export function isReplicateConfigured(): boolean {
  return Boolean(process.env.REPLICATE_API_TOKEN);
}

export type QrArtParams = {
  /** URL the QR encodes (e.g. https://yourbusiness.cards/c/lumen-coffee). */
  url: string;
  prompt: string;
  negativePrompt?: string;
  /** controlnet_conditioning_scale ~1.2–2.5: higher = more scannable, less arty. */
  qrStrength?: number;
  seed?: number;
};

type Prediction = {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[] | null;
  error?: string | null;
};

export async function generateQrArt(params: QrArtParams): Promise<{ imageUrl: string }> {
  const token = process.env.REPLICATE_API_TOKEN!;
  // illusion builds the QR from `qr_code_content`. `controlnet_conditioning_scale`
  // is the scannability lever (model default 2.2; ~1.5–2.2 is a good range —
  // higher = more reliably scannable, less arty).
  const input: Record<string, unknown> = {
    prompt: params.prompt,
    qr_code_content: params.url,
    negative_prompt:
      params.negativePrompt ?? "ugly, blurry, low quality, distorted, disfigured, watermark, text, words",
    num_inference_steps: 40,
    guidance_scale: 7.5,
    controlnet_conditioning_scale: params.qrStrength ?? 2.0,
  };
  if (params.seed != null) input.seed = params.seed;

  // Resolve the model's current version (this model's name-based predictions
  // endpoint 404s; the version-pinned /predictions endpoint is the reliable path).
  const modelRes = await fetch(`${API}/models/${QR_MODEL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!modelRes.ok) throw new Error(`Replicate model lookup ${modelRes.status}: ${await modelRes.text()}`);
  const version = (await modelRes.json())?.latest_version?.id;
  if (!version) throw new Error("Could not resolve Replicate model version.");

  const res = await fetch(`${API}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait", // block up to ~60s for a synchronous result
    },
    body: JSON.stringify({ version, input }),
  });
  if (!res.ok) {
    throw new Error(`Replicate ${res.status}: ${await res.text()}`);
  }

  let pred = (await res.json()) as Prediction;
  pred = await waitFor(pred, token);

  if (pred.status !== "succeeded") {
    throw new Error(`Generation ${pred.status}: ${pred.error ?? "unknown error"}`);
  }
  const out = Array.isArray(pred.output) ? pred.output.at(-1) : pred.output;
  if (typeof out !== "string") throw new Error("No image was returned.");
  return { imageUrl: out };
}

async function waitFor(pred: Prediction, token: string): Promise<Prediction> {
  let p = pred;
  for (let i = 0; i < 45 && (p.status === "starting" || p.status === "processing"); i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const r = await fetch(`${API}/predictions/${p.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    p = (await r.json()) as Prediction;
  }
  return p;
}
