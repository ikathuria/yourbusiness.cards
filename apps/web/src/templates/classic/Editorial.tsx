"use client";

/**
 * Editorial — Clean & Classic.
 * Serif display, thin rules, restrained magazine layout.
 * Best for law, consulting, real estate, fine dining.
 */
import { motion, useReducedMotion } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";
import { fadeInUp, staggerContainer } from "@/design/motion";

export default function Editorial({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const contact = getContactActions(card);
  const links = getLinkActions(card);

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#f6f4ef] px-6 py-12">
      <motion.article
        variants={staggerContainer(0.09)}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="w-full max-w-sm"
      >
        {/* Eyebrow */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between border-b border-zinc-900/15 pb-3">
          <span className="font-serif text-xs italic text-zinc-500">Established</span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-zinc-400">Card</span>
        </motion.div>

        <motion.div variants={fadeInUp} className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-900/20 font-serif text-xl text-zinc-800">
          {card.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.logoUrl} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            monogram(card.businessName)
          )}
        </motion.div>

        <motion.h1 variants={fadeInUp} className="mt-6 text-center font-serif text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-zinc-900">
          {card.businessName}
        </motion.h1>
        {card.tagline && (
          <motion.p variants={fadeInUp} className="mt-3 text-center font-serif text-base italic text-zinc-500">
            {card.tagline}
          </motion.p>
        )}

        <motion.div variants={fadeInUp} className="mx-auto my-6 h-px w-12 bg-zinc-900/20" />

        {card.description && (
          <motion.p variants={fadeInUp} className="text-center text-sm leading-relaxed text-zinc-600">
            {card.description}
          </motion.p>
        )}

        {contact.length > 0 && (
          <motion.dl variants={fadeInUp} className="mt-7 space-y-2.5 border-t border-zinc-900/10 pt-5">
            {contact.map(({ key, label, href, Icon }) => {
              const row = (
                <div className="flex items-center gap-3 text-sm text-zinc-700">
                  <Icon size={14} className="text-zinc-400" />
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
          <motion.div variants={fadeInUp} className="mt-6 space-y-2.5">
            {links.map(({ key, label, href }) => (
              <motion.a
                key={key}
                href={href}
                whileHover={{ x: 3 }}
                className="flex items-center justify-between border-b border-zinc-900/15 pb-2.5 text-sm font-medium text-zinc-800 no-underline"
              >
                <span className="truncate">{label}</span>
                <span aria-hidden className="font-serif text-zinc-400">&rarr;</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.article>
    </div>
  );
}
