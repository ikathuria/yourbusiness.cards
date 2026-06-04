"use client";

import { useState } from "react";

/** Client-side copy-link + view + QR actions for a card row. */
export function CardRowActions({ slug, published }: { slug: string; published: boolean }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/c/${slug}` : `/c/${slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const btn =
    "rounded-lg border-2 border-ink bg-paper-2 px-3 py-1.5 text-xs font-extrabold text-ink no-underline transition-transform hover:-translate-y-0.5";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {published && (
        <a href={`/c/${slug}`} target="_blank" rel="noopener noreferrer" className={btn}>
          View ↗
        </a>
      )}
      <button type="button" onClick={copy} className={btn} disabled={!published}>
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a href={`/api/qr?slug=${slug}&format=svg`} download={`${slug}-qr.svg`} className={btn}>
        QR
      </a>
    </div>
  );
}
