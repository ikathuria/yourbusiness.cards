"use client";

/**
 * Linen — Clean & Classic.
 * Warm neutral palette, refined serif, soft paper texture.
 * Best for artisan cafes, bakeries, craft businesses.
 */
import { motion, useReducedMotion } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";
import { fadeInUp, staggerContainer } from "@/design/motion";

export default function Linen({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const accent = card.theme?.accent ?? "#9c6b4a"; // warm terracotta-brown
  const contact = getContactActions(card);
  const links = getLinkActions(card);

  return (
    <div
      className="flex min-h-[100dvh] w-full items-center justify-center px-6 py-12"
      style={{
        background: "#efe7da",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 40%), radial-gradient(circle at 80% 80%, rgba(156,107,74,0.08), transparent 45%)",
      }}
    >
      <motion.article
        variants={staggerContainer(0.09)}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="w-full max-w-sm text-center"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full font-serif text-2xl"
          style={{ background: "rgba(156,107,74,0.12)", color: accent, border: `1px solid ${accent}40` }}
        >
          {card.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.logoUrl} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            monogram(card.businessName)
          )}
        </motion.div>

        <motion.p variants={fadeInUp} className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">
          {card.tagline ?? "Since day one"}
        </motion.p>
        <motion.h1 variants={fadeInUp} className="mt-3 font-serif text-[2.5rem] font-medium leading-[1.05] tracking-tight text-[#3a2e25]">
          {card.businessName}
        </motion.h1>

        {card.description && (
          <motion.p variants={fadeInUp} className="mx-auto mt-4 max-w-xs font-serif text-base leading-relaxed text-[#6b5a4c]">
            {card.description}
          </motion.p>
        )}

        <motion.div variants={fadeInUp} className="mx-auto my-7 flex items-center justify-center gap-3 text-[#3a2e25]/30">
          <span className="h-px w-10" style={{ background: "currentColor" }} />
          <span className="text-xs" style={{ color: accent }}>✦</span>
          <span className="h-px w-10" style={{ background: "currentColor" }} />
        </motion.div>

        {contact.length > 0 && (
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {contact.map(({ key, label, href, Icon }) => {
              const row = (
                <span className="flex items-center gap-2 text-sm text-[#5b4c3f]">
                  <Icon size={13} style={{ color: accent }} />
                  <span className="truncate">{label}</span>
                </span>
              );
              return href ? (
                <a key={key} href={href} className="no-underline transition-opacity hover:opacity-70">{row}</a>
              ) : (
                <span key={key}>{row}</span>
              );
            })}
          </motion.div>
        )}

        {links.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-7 space-y-2.5">
            {links.map(({ key, label, href, Icon }) => (
              <motion.a
                key={key}
                href={href}
                whileHover={{ y: -2 }}
                className="flex items-center justify-center gap-2.5 rounded-full border px-5 py-3 text-sm font-medium text-[#3a2e25] no-underline transition-colors"
                style={{ borderColor: `${accent}50`, background: "rgba(255,255,255,0.4)" }}
              >
                <Icon size={15} style={{ color: accent }} />
                <span className="truncate">{label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.article>
    </div>
  );
}
