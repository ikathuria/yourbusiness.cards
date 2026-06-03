"use client";

/**
 * Carnival — Bold & Expressive.
 * Bright pastel gradient with floating animated shapes and bouncy buttons.
 * Best for bakeries, florists, events.
 */
import { motion, useReducedMotion } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";
import { fadeInUp, staggerContainer } from "@/design/motion";

const SHAPES = [
  { c: "#ff9ec7", s: 70, x: "8%", y: "12%", d: 0 },
  { c: "#ffd56b", s: 50, x: "82%", y: "8%", d: 0.6 },
  { c: "#8ad9ff", s: 90, x: "78%", y: "76%", d: 1.2 },
  { c: "#b79cff", s: 44, x: "12%", y: "80%", d: 1.8 },
];

export default function Carnival({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const accent = card.theme?.accent ?? "#ff5fa2";
  const contact = getContactActions(card);
  const links = getLinkActions(card);

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden px-5 py-10"
      style={{ background: "linear-gradient(160deg, #fff4f8 0%, #f3ecff 50%, #eafaff 100%)" }}
    >
      {/* floating shapes */}
      {SHAPES.map((sh, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full blur-[1px]"
          style={{ background: sh.c, width: sh.s, height: sh.s, left: sh.x, top: sh.y, opacity: 0.55 }}
          animate={reduce ? undefined : { y: [0, -16, 0], x: [0, 8, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: sh.d }}
        />
      ))}

      <motion.article
        variants={staggerContainer(0.08)}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white bg-white/70 p-7 text-center shadow-xl backdrop-blur-md"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-4 w-fit">
          <motion.div
            animate={reduce ? undefined : { rotate: [0, -6, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-20 w-20 items-center justify-center rounded-3xl font-display text-2xl font-extrabold text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}, #ffb347)` }}
          >
            {card.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.logoUrl} alt="" className="h-full w-full rounded-3xl object-cover" />
            ) : (
              monogram(card.businessName)
            )}
          </motion.div>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="font-display text-[2rem] font-extrabold leading-tight tracking-tight text-zinc-900">
          {card.businessName}
        </motion.h1>
        {card.tagline && (
          <motion.p variants={fadeInUp} className="mt-2 text-sm font-bold" style={{ color: accent }}>
            {card.tagline}
          </motion.p>
        )}
        {card.description && (
          <motion.p variants={fadeInUp} className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
            {card.description}
          </motion.p>
        )}

        {contact.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-5 flex flex-wrap justify-center gap-2">
            {contact.map(({ key, label, href, Icon }) => {
              const inner = (
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm">
                  <Icon size={13} style={{ color: accent }} />
                  <span className="max-w-[10rem] truncate">{label}</span>
                </span>
              );
              return href ? <a key={key} href={href} className="no-underline">{inner}</a> : <span key={key}>{inner}</span>;
            })}
          </motion.div>
        )}

        {links.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-5 space-y-3">
            {links.map(({ key, label, href, Icon }) => (
              <motion.a
                key={key}
                href={href}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2.5 rounded-full px-5 py-3.5 text-sm font-bold text-white no-underline shadow-md"
                style={{ background: `linear-gradient(135deg, ${accent}, #ffb347)` }}
              >
                <Icon size={16} />
                <span className="truncate">{label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.article>
    </div>
  );
}
