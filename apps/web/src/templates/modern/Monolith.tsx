"use client";

/**
 * Monolith — Modern Premium.
 * Full-bleed brand-gradient hero, white type, sticky bottom contact bar.
 * Best for agencies and premium brands.
 */
import { motion, useReducedMotion } from "motion/react";
import type { TemplateProps } from "@/templates/types";
import { getContactActions, getLinkActions, monogram } from "@/templates/shared/contact";
import { fadeInUp, staggerContainer } from "@/design/motion";

export default function Monolith({ card }: TemplateProps) {
  const reduce = useReducedMotion();
  const accent = card.theme?.accent ?? "#6d5ef7";
  const contact = getContactActions(card);
  const links = getLinkActions(card);
  const primaryContact = contact.filter((c) => c.href).slice(0, 3);

  return (
    <div
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden px-6 pb-28 pt-14"
      style={{ background: `linear-gradient(150deg, ${accent} 0%, #3a2db5 55%, #f25ca2 130%)` }}
    >
      {/* Subtle grain/noise via radial highlights */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 10%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(50% 40% at 90% 80%, rgba(255,255,255,0.12), transparent 60%)",
        }}
      />

      <motion.div
        variants={staggerContainer(0.09)}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="relative z-10 flex flex-1 flex-col"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} className="mb-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 font-display text-xl font-bold text-white ring-1 ring-white/25 backdrop-blur">
            {card.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.logoUrl} alt="" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              monogram(card.businessName)
            )}
          </div>
        </motion.div>

        {/* Big name block */}
        <div className="mt-10">
          <motion.h1
            variants={fadeInUp}
            className="font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-tight text-white"
          >
            {card.businessName}
          </motion.h1>
          {card.tagline && (
            <motion.p variants={fadeInUp} className="mt-3 text-lg font-medium text-white/85">
              {card.tagline}
            </motion.p>
          )}
          {card.description && (
            <motion.p variants={fadeInUp} className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {card.description}
            </motion.p>
          )}
        </div>

        {/* Links */}
        {links.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-8 space-y-2.5">
            {links.map(({ key, label, href, Icon }) => (
              <motion.a
                key={key}
                href={href}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between rounded-2xl bg-white/12 px-5 py-3.5 text-sm font-semibold text-white no-underline ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/20"
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} className="text-white/80" />
                  <span className="truncate">{label}</span>
                </span>
                <span aria-hidden className="text-white/50">
                  &rarr;
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Sticky contact bar */}
      {primaryContact.length > 0 && (
        <motion.div
          initial={reduce ? false : { y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-around rounded-2xl bg-white/95 px-2 py-2.5 shadow-xl backdrop-blur"
        >
          {primaryContact.map(({ key, href, Icon, label }) => (
            <a
              key={key}
              href={href}
              aria-label={label}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-zinc-700 no-underline transition-colors hover:bg-zinc-100"
            >
              <Icon size={18} style={{ color: accent }} />
              <span className="text-[0.6rem] font-medium capitalize">{key}</span>
            </a>
          ))}
        </motion.div>
      )}
    </div>
  );
}
