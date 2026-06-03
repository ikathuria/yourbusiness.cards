"use client";

/**
 * Aurora — Modern Premium.
 * Dark glassmorphism over a slowly drifting gradient-mesh background.
 * Best for tech-forward cafes, design studios, startups.
 */
import { motion, useReducedMotion } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";
import { fadeInUp, staggerContainer } from "@/design/motion";

export default function Aurora({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const accent = card.theme?.accent ?? "#8b7dff";
  const contact = getContactActions(card);
  const links = getLinkActions(card);

  const blob = (delay: number) =>
    reduce
      ? {}
      : {
          animate: { x: [0, 30, -20, 0], y: [0, -25, 20, 0], scale: [1, 1.15, 0.95, 1] },
          transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#07070a] px-5 py-10">
      {/* Gradient mesh */}
      <motion.div
        {...blob(0)}
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl"
        style={{ background: accent, opacity: 0.5 }}
      />
      <motion.div
        {...blob(3)}
        className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "#f25ca2", opacity: 0.4 }}
      />
      <motion.div
        {...blob(6)}
        className="pointer-events-none absolute right-10 top-10 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "#4dd0e1", opacity: 0.25 }}
      />

      {/* Glass card */}
      <motion.article
        variants={staggerContainer(0.08)}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white/12 bg-white/[0.06] p-8 text-center shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-5 h-20 w-20">
          <div
            className="flex h-full w-full items-center justify-center rounded-2xl font-display text-2xl font-bold text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}, #f25ca2)` }}
          >
            {card.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.logoUrl} alt="" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              monogram(card.businessName)
            )}
          </div>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="font-display text-3xl font-bold leading-tight tracking-tight text-white"
        >
          {card.businessName}
        </motion.h1>
        {card.tagline && (
          <motion.p variants={fadeInUp} className="mt-2 text-sm font-medium text-white/70">
            {card.tagline}
          </motion.p>
        )}
        {card.description && (
          <motion.p variants={fadeInUp} className="mt-4 text-sm leading-relaxed text-white/55">
            {card.description}
          </motion.p>
        )}

        {/* Contact chips */}
        {contact.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-2">
            {contact.map(({ key, label, href, Icon }) => {
              const inner = (
                <span className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10">
                  <Icon size={13} strokeWidth={2} style={{ color: accent }} />
                  <span className="max-w-[10rem] truncate">{label}</span>
                </span>
              );
              return href ? (
                <a key={key} href={href} className="no-underline">
                  {inner}
                </a>
              ) : (
                <span key={key}>{inner}</span>
              );
            })}
          </motion.div>
        )}

        {/* Links */}
        {links.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-6 space-y-2.5">
            {links.map(({ key, label, href, Icon }) => (
              <motion.a
                key={key}
                href={href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-medium text-white no-underline backdrop-blur transition-colors hover:bg-white/10"
              >
                <Icon size={16} style={{ color: accent }} />
                <span className="truncate">{label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.article>
    </div>
  );
}
