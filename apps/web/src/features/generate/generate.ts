import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { templates } from "@/templates/registry";
import { FAMILY_LABELS } from "@/templates/types";
import {
  generatedCardSchema,
  generatedCardJsonSchema,
  ACCENT_PRESETS,
  type GeneratedCard,
} from "./schema";

const MODEL = "claude-sonnet-4-6";

/** Static catalog of templates the model chooses from — cached across calls. */
function templateCatalog(): string {
  return templates
    .map((t) => `- ${t.id} (${FAMILY_LABELS[t.family]}, ${t.tier}): ${t.description}`)
    .join("\n");
}

const SYSTEM = `You are the design director for YourBusiness.Cards, which makes single-screen, mobile-sized digital business cards for small businesses.

Given a short description of a business, you produce the data for ONE beautiful card by SELECTING from a fixed registry — you never invent CSS, fonts, or layouts.

Pick the template whose aesthetic best fits the business's vibe (a law office ≠ a taco truck). Pick an accent color that suits the brand; prefer one of these brand presets unless the business clearly implies another: ${ACCENT_PRESETS.join(", ")}.

Write concise, warm, confident marketing copy in the business's voice. The tagline is a few words; the description is one or two sentences. Only include contact fields and links that are stated or strongly implied — never fabricate phone numbers, emails, or addresses. For links, prefer realistic calls to action (Order online, View menu, Book now, Instagram) and use a lucide icon key when obvious (instagram, phone, mail, map-pin, calendar, link).

Available templates:
${templateCatalog()}

Return your answer ONLY by calling the create_card tool.`;

export type GenerateResult =
  | { ok: true; card: GeneratedCard }
  | { ok: false; error: string };

/** Generate a draft card from a free-text business description via Claude. */
export async function generateCardDraft(brief: string): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { ok: false, error: "AI is not configured (missing ANTHROPIC_API_KEY)." };

  const trimmed = brief.trim();
  if (trimmed.length < 8) return { ok: false, error: "Tell us a bit more about the business." };

  const client = new Anthropic({ apiKey });

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: [
        // Cache the static design-director prompt + template catalog across requests.
        { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
      ],
      tools: [
        {
          name: "create_card",
          description: "Create the business card data by selecting a template and writing copy.",
          input_schema: generatedCardJsonSchema as unknown as Anthropic.Tool.InputSchema,
        },
      ],
      tool_choice: { type: "tool", name: "create_card" },
      messages: [{ role: "user", content: trimmed.slice(0, 4000) }],
    });

    const toolUse = res.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "create_card",
    );
    if (!toolUse) return { ok: false, error: "The AI didn't return a card. Please try again." };

    const parsed = generatedCardSchema.safeParse(toolUse.input);
    if (!parsed.success) {
      return { ok: false, error: "The AI returned an unexpected shape. Please try again." };
    }
    return { ok: true, card: parsed.data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: `AI generation failed: ${message}` };
  }
}
