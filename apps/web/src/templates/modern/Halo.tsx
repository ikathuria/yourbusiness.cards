"use client";

/**
 * Halo — Modern Premium.
 * Light, airy, generous whitespace with a soft gradient halo behind the logo.
 * Best for wellness, salons, boutiques.
 */
import { motion, useReducedMotion } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";
import { fadeInUp, scaleIn, staggerContainer } from "@/design/motion";

export default function Halo({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const accent = card.theme?.accent ?? "#6d5ef7";
  const contact = getContactActions(card);
  const links = getLinkActions(card);

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#fafaf7] px-5 py-12">
      <motion.article
        variants={staggerContainer(0.08)}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="relative z-10 w-full max-w-sm text-center"
      >
        {/* Halo + logo */}
        <motion.div variants={scaleIn} className="relative mx-auto mb-7 h-28 w-28">
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)`, transform: "scale(1.6)" }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(from 180deg, ${accent}, #f25ca2, ${accent})` }}
          />
          <div className="absolute inset-[3px] flex items-center justify-center overflow-hidden rounded-full bg-white">
            {card.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-3xl font-bold" style={{ color: accent }}>
                {monogram(card.businessName)}
              </span>
            )}
          </div>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="font-display text-[2rem] font-bold leading-tight tracking-tight text-zinc-900"
        >
          {card.businessName}
        </motion.h1>
        {card.tagline && (
          <motion.p variants={fadeInUp} className="mt-2 text-sm font-medium" style={{ color: accent }}>
            {card.tagline}
          </motion.p>
        )}
        {card.description && (
          <motion.p variants={fadeInUp} className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
            {card.description}
          </motion.p>
        )}

        {/* Contact row */}
        {contact.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-2">
            {contact.map(({ key, label, href, Icon }) => {
              const inner = (
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm ring-1 ring-zinc-200/80 transition-shadow hover:shadow-md">
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
          <motion.div variants={fadeInUp} className="mt-7 space-y-3">
            {links.map(({ key, label, href, Icon }) => (
              <motion.a
                key={key}
                href={href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 rounded-full border border-zinc-200 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-800 no-underline shadow-sm transition-shadow hover:shadow-md"
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
