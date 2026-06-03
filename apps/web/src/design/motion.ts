/**
 * Shared Motion variants and transitions.
 *
 * Templates and UI compose these instead of writing one-off animations, so motion
 * feels consistent and intentional across the product. All consumers should respect
 * `prefers-reduced-motion` (see `useReducedMotion` from "motion/react").
 */
import type { Variants, Transition } from "motion/react";
import { duration, easing } from "./tokens";

/** Default premium entrance transition. */
export const entranceTransition: Transition = {
  duration: duration.base,
  ease: easing.emphasized,
};

/** Fade + rise — the workhorse entrance. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: entranceTransition },
};

/** Fade + gentle scale — for cards, media, hero art. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: entranceTransition },
};

/** Simple fade. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.slow, ease: easing.standard } },
};

/**
 * Parent that staggers its children's entrances. Pair with a child using
 * `fadeInUp` / `scaleIn` and `variants` inheritance.
 */
export const staggerContainer = (stagger = 0.08, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Tasteful hover lift for interactive surfaces (use with `whileHover`). */
export const hoverLift = {
  y: -4,
  transition: { duration: duration.fast, ease: easing.standard },
} as const;

/** Press feedback (use with `whileTap`). */
export const tapPress = { scale: 0.97 } as const;
