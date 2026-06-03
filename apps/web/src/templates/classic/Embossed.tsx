"use client";

/**
 * Embossed — Clean & Classic.
 * A literal business card resting on a neutral surface; centered monogram, restrained.
 * Best for trades, accountants, professional services.
 */
import { motion, useReducedMotion } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";
import { fadeInUp, scaleIn, staggerContainer } from "@/design/motion";

export default function Embossed({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const accent = card.theme?.accent ?? "#b08d57"; // muted gold
  const contact = getContactActions(card);
  const links = getLinkActions(card);

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#e9e7e2] px-6 py-12"
      style={{ backgroundImage: "radial-gradient(circle at 50% 30%, #f3f1ec, #dedbd3)" }}
    >
      <motion.article
        variants={staggerContainer(0.08)}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="w-full max-w-sm"
      >
        <motion.div
          variants={scaleIn}
          className="rounded-2xl border border-black/5 bg-[#fbfaf7] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]"
        >
          {/* Top: monogram + name */}
          <div className="flex items-center gap-4 border-b border-zinc-900/10 pb-5">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg font-serif text-lg font-semibold"
              style={{ background: "#1c1c1c", color: accent }}
            >
              {card.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.logoUrl} alt="" className="h-full w-full rounded-lg object-cover" />
              ) : (
                monogram(card.businessName)
              )}
            </div>
            <div className="min-w-0">
              <motion.h1 variants={fadeInUp} className="font-serif text-2xl font-semibold leading-tight text-zinc-900">
                {card.businessName}
              </motion.h1>
              {card.tagline && (
                <motion.p variants={fadeInUp} className="mt-0.5 text-xs font-medium uppercase tracking-[0.15em]" style={{ color: accent }}>
                  {card.tagline}
                </motion.p>
              )}
            </div>
          </div>

          {card.description && (
            <motion.p variants={fadeInUp} className="mt-5 text-sm leading-relaxed text-zinc-600">
              {card.description}
            </motion.p>
          )}

          {contact.length > 0 && (
            <motion.dl variants={fadeInUp} className="mt-5 space-y-2.5">
              {contact.map(({ key, label, href, Icon }) => {
                const row = (
                  <div className="flex items-center gap-3 text-sm text-zinc-700">
                    <Icon size={14} style={{ color: accent }} />
                    <span className="truncate">{label}</span>
                  </div>
                );
                return href ? (
                  <a key={key} href={href} className="block no-underline transition-colors hover:text-zinc-950">{row}</a>
                ) : (
                  <div key={key}>{row}</div>
                );
              })}
            </motion.dl>
          )}

          {links.length > 0 && (
            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-2 border-t border-zinc-900/10 pt-5">
              {links.map(({ key, label, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 no-underline transition-colors hover:border-zinc-400"
                >
                  <Icon size={13} style={{ color: accent }} />
                  <span className="truncate">{label}</span>
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.article>
    </div>
  );
}
