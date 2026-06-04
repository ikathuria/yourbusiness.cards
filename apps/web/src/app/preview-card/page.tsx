"use client";

/**
 * Internal live-preview surface for the editor. Rendered inside an iframe; the
 * editor pushes the in-progress card via postMessage and this re-renders the
 * REAL template component — so the preview matches /c/[slug] exactly.
 *
 * Not linked anywhere and fed only by same-origin postMessage.
 */
import { useEffect, useState } from "react";
import { resolveTemplate } from "@/templates/registry";
import type { BusinessCard } from "@/features/cards/types";

export default function PreviewCard() {
  const [card, setCard] = useState<BusinessCard | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "ybc:card") setCard(e.data.card as BusinessCard);
    }
    window.addEventListener("message", onMessage);
    // tell the editor we're ready for the first payload
    window.parent?.postMessage({ type: "ybc:ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!card) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-paper text-sm text-ink/40">
        Loading preview…
      </div>
    );
  }

  const { Component } = resolveTemplate(card.templateId);
  return <Component card={card} />;
}
