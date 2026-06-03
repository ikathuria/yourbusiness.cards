"use client";

/**
 * Neon — Bold & Expressive.
 * Dark with neon glow accents and glowing buttons.
 * Best for bars, nightlife, barbershops, gaming.
 */
import { motion, useReducedMotion } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";
import { fadeInUp, staggerContainer } from "@/design/motion";

export default function Neon({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const accent = card.theme?.accent ?? "#00f0ff";
  const glow = `0 0 12px ${accent}, 0 0 24px ${accent}80`;
  const contact = getContactActions(card);
  const links = getLinkActions(card);

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#080510] px-5 py-10">
      {/* grid glow floor */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-30"
        style={{
          backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />
      <motion.article
        variants={staggerContainer(0.08)}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="relative z-10 w-full max-w-sm rounded-3xl border p-8 text-center"
        style={{ borderColor: `${accent}55`, background: "rgba(255,255,255,0.02)", boxShadow: `0 0 40px ${accent}25, inset 0 0 30px ${accent}10` }}
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-5 w-fit">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border-2 font-display text-2xl font-bold"
            style={{ borderColor: accent, color: accent, boxShadow: glow, textShadow: glow }}
          >
            {card.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.logoUrl} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              monogram(card.businessName)
            )}
          </div>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="font-display text-3xl font-bold uppercase tracking-wide text-white"
          style={{ textShadow: glow }}
        >
          {card.businessName}
        </motion.h1>
        {card.tagline && (
          <motion.p variants={fadeInUp} className="mt-2 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
            {card.tagline}
          </motion.p>
        )}
        {card.description && (
          <motion.p variants={fadeInUp} className="mt-4 text-sm leading-relaxed text-white/55">
            {card.description}
          </motion.p>
        )}

        {contact.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-2">
            {contact.map(({ key, label, href, Icon }) => {
              const inner = (
                <span className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-white/85" style={{ borderColor: `${accent}55` }}>
                  <Icon size={13} style={{ color: accent }} />
                  <span className="max-w-[10rem] truncate">{label}</span>
                </span>
              );
              return href ? <a key={key} href={href} className="no-underline">{inner}</a> : <span key={key}>{inner}</span>;
            })}
          </motion.div>
        )}

        {links.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-6 space-y-3">
            {links.map(({ key, label, href, Icon }) => (
              <motion.a
                key={key}
                href={href}
                whileHover={{ scale: 1.02, boxShadow: glow }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2.5 rounded-xl border bg-black/30 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white no-underline"
                style={{ borderColor: accent }}
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
