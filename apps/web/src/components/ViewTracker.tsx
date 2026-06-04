"use client";

import { useEffect } from "react";

/**
 * Fires a single view event per session per card after hydration. Reads `?src=qr`
 * to distinguish QR scans from link visits. Renders nothing.
 */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get("src") === "qr" ? "qr" : "link";
    const key = `ybc:viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* sessionStorage unavailable — still track once per mount */
    }
    fetch("/api/track-view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, source }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
