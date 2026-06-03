"use client";

/**
 * Design-system demo (Milestone 1 acceptance surface).
 *
 * Proves tokens + fonts + motion are wired: it renders type from the display/sans
 * fonts, swatches from the color roles, elevation from the shadow tokens, and a
 * staggered Motion entrance. Replaced by the real landing page in Milestone 2.
 */

import { motion, useReducedMotion } from "motion/react";
import { colorRoles } from "@/design/tokens";
import { fadeInUp, scaleIn, staggerContainer, hoverLift, tapPress } from "@/design/motion";

const swatches = colorRoles.filter((r) => r !== "ring" && r !== "brand-foreground");

export default function DesignSystemDemo() {
  const reduce = useReducedMotion();

  return (
    <main className="flex flex-1 flex-col items-center bg-background px-6 py-20">
      <motion.section
        className="w-full max-w-3xl"
        variants={staggerContainer()}
        initial={reduce ? false : "hidden"}
        animate="visible"
      >
        <motion.p
          variants={fadeInUp}
          className="font-mono text-sm uppercase tracking-[0.2em] text-muted"
        >
          Design system · Milestone 1
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="font-display mt-4 text-[length:var(--text-display-1)] font-extrabold leading-[1.02] tracking-tight text-foreground"
        >
          Cards that look{" "}
          <span className="text-brand-gradient">expensive.</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
        >
          The visual foundation for YourBusiness.Cards — tokens, curated typography,
          and motion. Everything else renders into this.
        </motion.p>

        <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
          <motion.button
            whileHover={hoverLift}
            whileTap={tapPress}
            className="bg-brand-gradient rounded-full px-6 py-3 text-sm font-semibold text-white shadow-glow"
          >
            Primary action
          </motion.button>
          <motion.button
            whileHover={hoverLift}
            whileTap={tapPress}
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground shadow-soft"
          >
            Secondary
          </motion.button>
        </motion.div>

        {/* Color roles */}
        <motion.div variants={fadeInUp} className="mt-16">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
            Color roles
          </h2>
          <motion.ul
            variants={staggerContainer(0.05)}
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {swatches.map((role) => (
              <motion.li
                key={role}
                variants={scaleIn}
                className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft"
              >
                <div
                  className="h-16 w-full"
                  style={{ background: `var(--color-${role})` }}
                />
                <p className="px-3 py-2 font-mono text-xs text-muted">{role}</p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Type scale */}
        <motion.div variants={fadeInUp} className="mt-16">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
            Type scale
          </h2>
          <div className="mt-4 space-y-3 rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="font-display text-[length:var(--text-display-2)] font-bold leading-tight tracking-tight text-foreground">
              Display — Sora
            </p>
            <p className="text-xl text-foreground">Body large — Inter</p>
            <p className="text-base text-muted">Body — the quick brown fox jumps over the lazy dog.</p>
            <p className="font-mono text-sm text-muted">mono — yourbusiness.cards/c/blue-bottle</p>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
