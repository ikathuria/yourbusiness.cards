/**
 * Design tokens — the single source of truth for the visual system.
 *
 * Color roles live as CSS variables in `globals.css` (so Tailwind utilities and
 * templates consume them); this file mirrors the *programmatic* tokens (motion
 * timing, radii, type scale) for use in TS — Motion variants, inline styles, and
 * template metadata. Templates must consume these roles, never hardcode raw values.
 */

/** Semantic color roles. Backed by CSS vars `--color-<role>` in globals.css. */
export const colorRoles = [
  "background",
  "surface",
  "surface-elevated",
  "foreground",
  "muted",
  "border",
  "brand",
  "brand-foreground",
  "accent",
  "ring",
] as const;
export type ColorRole = (typeof colorRoles)[number];

/** Motion durations in seconds. */
export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
  xslow: 0.9,
} as const;

/** Cubic-bezier easing curves. Tuples are typed for Motion's `ease`. */
export const easing = {
  standard: [0.4, 0, 0.2, 1],
  /** Emphasized "ease-out-expo" — premium, decisive entrances. */
  emphasized: [0.16, 1, 0.3, 1],
  entrance: [0.22, 1, 0.36, 1],
} as const satisfies Record<string, [number, number, number, number]>;

/** Corner radii. Mirrors the `--radius-*` Tailwind namespace. */
export const radius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  full: "9999px",
} as const;

/** Fluid-ish display + body type scale (rem). Body sizes use Tailwind defaults. */
export const typeScale = {
  display1: "clamp(2.75rem, 6vw, 4.5rem)",
  display2: "clamp(2.25rem, 4.5vw, 3.5rem)",
  heading: "clamp(1.5rem, 2.5vw, 2rem)",
  body: "1rem",
  small: "0.875rem",
} as const;

/** Named elevation shadows. Mirrors the `--shadow-*` namespace. */
export const shadowRoles = ["soft", "elevated", "glow"] as const;
export type ShadowRole = (typeof shadowRoles)[number];
