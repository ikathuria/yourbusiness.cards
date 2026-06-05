"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { BusinessCard } from "@/features/cards/types";
import { saveCard, generateCardQrArt } from "./actions";
import type { SaveCardInput } from "./save-types";
import { sanitizeSlugInput, slugify } from "@/lib/slug";

export type EditorCard = {
  id: string;
  slug: string;
  templateId: string;
  businessName: string;
  tagline: string;
  description: string;
  contact: { phone: string; email: string; website: string; address: string; hours: string };
  links: { label: string; url: string; icon: string }[];
  themeAccent: string | null;
  themeAccent2: string | null;
  published: boolean;
  qrArtUrl: string | null;
};

type TemplateMeta = { id: string; name: string; family: "modern" | "bold" | "classic"; tier: string };

const ACCENTS = ["#6d5ef7", "#21cfa0", "#ff7a5c", "#f25ca2", "#0ea5e9", "#f59e0b", "#ef4444", "#0f172a"];
const FAMILY_LABEL = { modern: "Modern", bold: "Bold", classic: "Classic" } as const;

// Templates that pair the primary accent with a second customizable color
// (gradients / alternating buttons). Others ignore accent2.
const SECONDARY_ACCENT_TEMPLATES = new Set(["aurora", "halo", "monolith", "carnival", "pop"]);

export function CardEditor({
  initial,
  plan,
  templates,
}: {
  initial: EditorCard;
  plan: "free" | "pro" | "premium";
  templates: TemplateMeta[];
}) {
  const [card, setCard] = useState<EditorCard>(initial);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // Once the owner edits the link by hand we stop auto-suggesting it from the
  // business name. A freshly-created "untitled-card-…" slug counts as unedited.
  const [slugEdited, setSlugEdited] = useState(
    () => !initial.slug.startsWith(slugify(initial.businessName)),
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canCustomColor = plan !== "free";
  const canUseAi = plan === "premium";
  const hasSecondaryAccent = SECONDARY_ACCENT_TEMPLATES.has(card.templateId);
  // QR-art generation state.
  const [qrPrompt, setQrPrompt] = useState("");
  const [qrPending, setQrPending] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "yourbusiness.cards")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  // Build the BusinessCard the preview renders.
  const previewCard = useMemo<BusinessCard>(
    () => ({
      slug: card.slug,
      templateId: card.templateId,
      businessName: card.businessName || "Your business",
      tagline: card.tagline || undefined,
      description: card.description || undefined,
      contact: Object.fromEntries(
        Object.entries(card.contact).filter(([, v]) => v && v.trim()),
      ),
      links: card.links.filter((l) => l.label.trim() && l.url.trim()).map((l) => ({ ...l })),
      theme:
        card.themeAccent || card.themeAccent2
          ? {
              ...(card.themeAccent ? { accent: card.themeAccent } : {}),
              ...(card.themeAccent2 ? { accent2: card.themeAccent2 } : {}),
            }
          : undefined,
    }),
    [card],
  );

  // Handshake: preview iframe tells us when it's ready.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin === window.location.origin && e.data?.type === "ybc:ready") setReady(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Push the current card to the preview on every change.
  useEffect(() => {
    if (ready && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "ybc:card", card: previewCard },
        window.location.origin,
      );
    }
  }, [previewCard, ready]);

  function set<K extends keyof EditorCard>(key: K, value: EditorCard[K]) {
    setCard((c) => ({ ...c, [key]: value }));
    setSaved(null);
  }
  function setContact(key: keyof EditorCard["contact"], value: string) {
    setCard((c) => ({ ...c, contact: { ...c.contact, [key]: value } }));
    setSaved(null);
  }
  // Business name drives the slug until the owner customizes the link.
  function setBusinessName(value: string) {
    setCard((c) => ({
      ...c,
      businessName: value,
      slug: slugEdited ? c.slug : slugify(value) || c.slug,
    }));
    setSaved(null);
  }
  function setSlug(value: string) {
    setSlugEdited(true);
    setCard((c) => ({ ...c, slug: sanitizeSlugInput(value) }));
    setSaved(null);
  }
  function setLink(i: number, key: "label" | "url", value: string) {
    setCard((c) => ({ ...c, links: c.links.map((l, j) => (j === i ? { ...l, [key]: value } : l)) }));
    setSaved(null);
  }
  function addLink() {
    setCard((c) => ({ ...c, links: [...c.links, { label: "", url: "", icon: "link" }] }));
  }
  function removeLink(i: number) {
    setCard((c) => ({ ...c, links: c.links.filter((_, j) => j !== i) }));
  }
  function moveLink(i: number, dir: -1 | 1) {
    setCard((c) => {
      const next = [...c.links];
      const j = i + dir;
      if (j < 0 || j >= next.length) return c;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...c, links: next };
    });
  }

  function persist(publishedOverride?: boolean) {
    const published = publishedOverride ?? card.published;
    const payload: SaveCardInput = {
      id: card.id,
      slug: card.slug,
      templateId: card.templateId,
      businessName: card.businessName,
      tagline: card.tagline,
      description: card.description,
      contact: card.contact,
      links: card.links,
      themeAccent: card.themeAccent,
      themeAccent2: card.themeAccent2,
      published,
    };
    startTransition(async () => {
      const res = await saveCard(payload);
      if (res.ok) {
        setCard((c) => ({ ...c, published, slug: res.slug ?? c.slug }));
        setSaved(published ? "Published!" : "Saved");
      } else {
        setSaved(res.error ?? "Save failed");
      }
    });
  }

  async function downloadQr() {
    if (!card.qrArtUrl) return;
    try {
      const res = await fetch(card.qrArtUrl);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${card.slug}-qr.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      setQrError("Couldn't download the image — use Open ↗ and save it manually.");
    }
  }

  async function generateQr() {
    if (qrPending) return;
    setQrError(null);
    setQrPending(true);
    try {
      const res = await generateCardQrArt({ cardId: card.id, prompt: qrPrompt });
      if (res.ok && res.url) {
        setCard((c) => ({ ...c, qrArtUrl: res.url! }));
      } else {
        setQrError(res.error ?? "QR art failed.");
      }
    } finally {
      setQrPending(false);
    }
  }

  const input = "w-full rounded-xl border-2 border-ink bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:shadow-[3px_3px_0_0_#6d5ef7]";
  const labelCls = "font-display text-xs font-extrabold uppercase tracking-wide text-ink/70";

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper-2/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <Link href="/dashboard" className="font-display text-sm font-extrabold no-underline">
            ← Dashboard
          </Link>
          <div className="flex items-center gap-2">
            {saved && <span className="text-sm font-bold text-ink/60">{saved}</span>}
            {card.published && (
              <a
                href={`/c/${card.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-ink bg-paper px-3 py-1.5 text-xs font-extrabold no-underline"
              >
                View ↗
              </a>
            )}
            <button
              onClick={() => persist()}
              disabled={pending}
              className="rounded-lg border-2 border-ink bg-paper px-4 py-1.5 text-sm font-extrabold disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => persist(!card.published)}
              disabled={pending}
              className="rounded-lg border-2 border-ink bg-brand px-4 py-1.5 text-sm font-extrabold text-white shadow-[3px_3px_0_0_#161320] disabled:opacity-60"
            >
              {card.published ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="space-y-8">
          {/* Template */}
          <section>
            <h2 className={labelCls}>Template</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => set("templateId", t.id)}
                  className={`rounded-lg border-2 border-ink px-3 py-1.5 text-xs font-extrabold transition-transform hover:-translate-y-0.5 ${
                    card.templateId === t.id ? "bg-ink text-paper" : "bg-paper-2 text-ink"
                  }`}
                  title={`${FAMILY_LABEL[t.family]} · ${t.tier}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </section>

          {/* Accent */}
          <section>
            <h2 className={labelCls}>{hasSecondaryAccent ? "Primary color" : "Accent color"}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => set("themeAccent", c)}
                  className={`h-8 w-8 rounded-lg border-2 ${card.themeAccent === c ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-ink"}`}
                  style={{ background: c }}
                  aria-label={`Accent ${c}`}
                />
              ))}
              <button
                onClick={() => set("themeAccent", null)}
                className="rounded-lg border-2 border-ink bg-paper-2 px-2.5 py-1.5 text-xs font-extrabold"
              >
                Default
              </button>
              {canCustomColor ? (
                <input
                  type="color"
                  value={card.themeAccent ?? "#6d5ef7"}
                  onChange={(e) => set("themeAccent", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-lg border-2 border-ink bg-white"
                  aria-label="Custom accent color"
                />
              ) : (
                <span className="rounded-lg border-2 border-dashed border-ink/40 px-2.5 py-1.5 text-[0.65rem] font-bold text-ink/50">
                  Custom color · Pro
                </span>
              )}
            </div>
          </section>

          {/* Secondary accent — only for templates that use a second color */}
          {hasSecondaryAccent && (
            <section>
              <h2 className={labelCls}>Secondary color</h2>
              <p className="mt-1 text-xs font-medium text-ink/45">
                This template blends two colors — set the second one here.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => set("themeAccent2", c)}
                    className={`h-8 w-8 rounded-lg border-2 ${card.themeAccent2 === c ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-ink"}`}
                    style={{ background: c }}
                    aria-label={`Secondary ${c}`}
                  />
                ))}
                <button
                  onClick={() => set("themeAccent2", null)}
                  className="rounded-lg border-2 border-ink bg-paper-2 px-2.5 py-1.5 text-xs font-extrabold"
                >
                  Default
                </button>
                {canCustomColor ? (
                  <input
                    type="color"
                    value={card.themeAccent2 ?? "#f25ca2"}
                    onChange={(e) => set("themeAccent2", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-lg border-2 border-ink bg-white"
                    aria-label="Custom secondary color"
                  />
                ) : (
                  <span className="rounded-lg border-2 border-dashed border-ink/40 px-2.5 py-1.5 text-[0.65rem] font-bold text-ink/50">
                    Custom color · Pro
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Content */}
          <section className="space-y-4">
            <h2 className={labelCls}>Business details</h2>
            <div>
              <label className="text-sm font-bold">Business name</label>
              <input className={`mt-1.5 ${input}`} value={card.businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Lumen Coffee" />
            </div>
            <div>
              <label className="text-sm font-bold">Card link</label>
              <div className={`mt-1.5 flex items-center overflow-hidden rounded-xl border-2 border-ink bg-white focus-within:shadow-[3px_3px_0_0_#6d5ef7]`}>
                <span className="select-none whitespace-nowrap border-r-2 border-ink bg-paper-2 px-3 py-2.5 font-mono text-xs text-ink/60">
                  {appUrl}/c/
                </span>
                <input
                  className="min-w-0 flex-1 bg-white px-3 py-2.5 font-mono text-sm text-ink outline-none"
                  value={card.slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-business"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              <p className="mt-1 text-xs font-medium text-ink/45">
                Lowercase letters, numbers and hyphens. Auto-filled from your name until you edit it.
              </p>
            </div>
            <div>
              <label className="text-sm font-bold">Tagline</label>
              <input className={`mt-1.5 ${input}`} value={card.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Specialty roasts, all day" />
            </div>
            <div>
              <label className="text-sm font-bold">Description</label>
              <textarea className={`mt-1.5 ${input} min-h-20`} value={card.description} onChange={(e) => set("description", e.target.value)} placeholder="A short line about your business." />
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className={labelCls}>Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                ["phone", "Phone", "+1 (415) 555-0123"],
                ["email", "Email", "hello@business.com"],
                ["website", "Website", "yourbusiness.com"],
                ["hours", "Hours", "Mon–Sun · 8am–6pm"],
              ] as const).map(([key, label, ph]) => (
                <div key={key}>
                  <label className="text-sm font-bold">{label}</label>
                  <input className={`mt-1.5 ${input}`} value={card.contact[key]} onChange={(e) => setContact(key, e.target.value)} placeholder={ph} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-sm font-bold">Address</label>
                <input className={`mt-1.5 ${input}`} value={card.contact.address} onChange={(e) => setContact("address", e.target.value)} placeholder="123 Main St, City, ST" />
              </div>
            </div>
          </section>

          {/* Links */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className={labelCls}>Links</h2>
              <button onClick={addLink} className="rounded-lg border-2 border-ink bg-mint px-3 py-1.5 text-xs font-extrabold">
                + Add link
              </button>
            </div>
            {card.links.length === 0 && <p className="text-sm text-ink/50">No links yet.</p>}
            <div className="space-y-2">
              {card.links.map((l, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl border-2 border-ink bg-paper-2 p-2">
                  <div className="flex flex-col">
                    <button onClick={() => moveLink(i, -1)} className="px-1 text-xs font-extrabold text-ink/50 hover:text-ink">▲</button>
                    <button onClick={() => moveLink(i, 1)} className="px-1 text-xs font-extrabold text-ink/50 hover:text-ink">▼</button>
                  </div>
                  <input className={`${input} flex-1`} value={l.label} onChange={(e) => setLink(i, "label", e.target.value)} placeholder="Label (e.g. Order ahead)" />
                  <input className={`${input} flex-1`} value={l.url} onChange={(e) => setLink(i, "url", e.target.value)} placeholder="example.com/order" />
                  <button onClick={() => removeLink(i)} className="rounded-lg border-2 border-ink bg-paper px-2.5 py-2 text-xs font-extrabold text-coral">✕</button>
                </div>
              ))}
            </div>
          </section>

          {/* AI QR art (Premium) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className={labelCls}>QR code</h2>
              <span className="rounded-md border-2 border-ink bg-brand px-1.5 py-0.5 text-[0.55rem] font-extrabold uppercase text-white">
                AI · Premium
              </span>
            </div>

            {!canUseAi ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-ink/40 bg-paper-2 p-4">
                <p className="text-sm font-medium text-ink/60">
                  Turn your QR code into branded art with AI. Plain QR is always available below.
                </p>
                <Link href="/dashboard" className="shrink-0 rounded-lg border-2 border-ink bg-brand px-3 py-1.5 text-xs font-extrabold text-white no-underline">
                  Upgrade
                </Link>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-ink bg-paper-2 p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Preview */}
                  <div className="mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-white">
                    <img
                      src={card.qrArtUrl ?? `/api/qr?slug=${card.slug}&format=svg`}
                      alt="Card QR code"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {/* Controls */}
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-bold">Describe the QR style</label>
                    <textarea
                      className={`${input} min-h-16`}
                      value={qrPrompt}
                      onChange={(e) => setQrPrompt(e.target.value)}
                      placeholder="A cozy coffee shop scene, warm tones, latte art, cinematic lighting"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={generateQr}
                        disabled={qrPending || qrPrompt.trim().length < 3}
                        className="rounded-lg border-2 border-ink bg-brand px-4 py-1.5 text-xs font-extrabold text-white shadow-[3px_3px_0_0_#161320] disabled:opacity-50"
                      >
                        {qrPending ? "Generating…" : card.qrArtUrl ? "Regenerate" : "✨ Generate QR art"}
                      </button>
                      {card.qrArtUrl && (
                        <>
                          <a
                            href={card.qrArtUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border-2 border-ink bg-paper px-3 py-1.5 text-xs font-extrabold no-underline"
                          >
                            Open ↗
                          </a>
                          <button
                            type="button"
                            onClick={downloadQr}
                            className="rounded-lg border-2 border-ink bg-paper px-3 py-1.5 text-xs font-extrabold"
                          >
                            Download
                          </button>
                        </>
                      )}
                    </div>
                    {qrError && <p className="text-xs font-bold text-coral">{qrError}</p>}
                    <p className="text-xs font-medium text-ink/45">
                      Always scan-test AI QR art before printing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-3 text-center font-display text-xs font-extrabold uppercase tracking-wide text-ink/50">
            Live preview
          </p>
          <div className="mx-auto w-fit rounded-[2.4rem] border-2 border-ink bg-ink p-2.5 shadow-[6px_6px_0_0_#161320]">
            <iframe
              ref={iframeRef}
              src="/preview-card"
              title="Live card preview"
              className="rounded-[1.9rem] border-0 bg-black"
              style={{ width: 320, height: 660 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
