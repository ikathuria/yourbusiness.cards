"use client";

/**
 * Pop — Bold & Expressive.
 * Neobrutalist sticker style: color blocks, thick borders, hard shadows, springy motion.
 * Best for ice cream shops, toy stores, kids' brands.
 */
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";

const pop: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 18 } },
};
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

export default function Pop({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const accent = card.theme?.accent ?? "#ff4d6d";
  const accent2 = card.theme?.accent2 ?? "#4dccff";
  const contact = getContactActions(card);
  const links = getLinkActions(card);

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#ffd23f] px-5 py-10">
      <motion.article
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="w-full max-w-sm rounded-3xl border-[3px] border-black bg-white p-6 text-center shadow-[8px_8px_0_0_#000]"
      >
        <motion.div variants={pop} className="mx-auto mb-4 w-fit">
          <div
            className="flex h-20 w-20 -rotate-3 items-center justify-center rounded-2xl border-[3px] border-black font-display text-2xl font-extrabold text-white shadow-[4px_4px_0_0_#000]"
            style={{ background: accent }}
          >
            {card.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.logoUrl} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              monogram(card.businessName)
            )}
          </div>
        </motion.div>

        <motion.h1 variants={pop} className="font-display text-4xl font-extrabold leading-none tracking-tight text-black">
          {card.businessName}
        </motion.h1>
        {card.tagline && (
          <motion.p
            variants={pop}
            className="mx-auto mt-3 w-fit -rotate-1 rounded-full border-[2.5px] border-black px-3 py-1 text-sm font-bold text-black"
            style={{ background: accent, color: "#fff" }}
          >
            {card.tagline}
          </motion.p>
        )}
        {card.description && (
          <motion.p variants={pop} className="mt-4 text-sm font-medium leading-relaxed text-black/70">
            {card.description}
          </motion.p>
        )}

        {contact.length > 0 && (
          <motion.div variants={pop} className="mt-5 flex flex-wrap justify-center gap-2">
            {contact.map(({ key, label, href, Icon }) => {
              const inner = (
                <span className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-white px-2.5 py-1 text-xs font-bold text-black">
                  <Icon size={13} strokeWidth={2.5} />
                  <span className="max-w-[9rem] truncate">{label}</span>
                </span>
              );
              return href ? (
                <a key={key} href={href} className="no-underline">{inner}</a>
              ) : (
                <span key={key}>{inner}</span>
              );
            })}
          </motion.div>
        )}

        {links.length > 0 && (
          <motion.div variants={pop} className="mt-5 space-y-3">
            {links.map(({ key, label, href, Icon }, i) => (
              <motion.a
                key={key}
                href={href}
                whileHover={{ x: 2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                className="flex items-center gap-3 rounded-2xl border-[3px] border-black px-4 py-3 text-sm font-extrabold text-black no-underline shadow-[4px_4px_0_0_#000]"
                style={{ background: i % 2 === 0 ? accent : accent2, color: i % 2 === 0 ? "#fff" : "#000" }}
              >
                <Icon size={16} strokeWidth={2.5} />
                <span className="truncate">{label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.article>
    </div>
  );
}
