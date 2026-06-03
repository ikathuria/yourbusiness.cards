/**
 * Curated font pairings, self-hosted via `next/font` (zero layout shift).
 *
 * Exposes CSS variables consumed by `globals.css` / Tailwind's `--font-*` theme:
 *   --font-display  Sora        — headlines, business names, hero
 *   --font-sans     Inter       — body, UI
 *   --font-serif    Fraunces    — refined serif for Clean & Classic templates
 *   --font-mono     JetBrains   — code, URLs, technical accents
 *
 * Apply `fontVariables` to <html> so the variables cascade everywhere.
 */
import { Sora, Inter, Fraunces, JetBrains_Mono } from "next/font/google";

export const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontSerif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/** Space-joined font CSS-variable classes for the root <html> element. */
export const fontVariables = `${fontDisplay.variable} ${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`;
