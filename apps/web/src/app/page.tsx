"use client";

/**
 * Homepage — brand neobrutalist landing (dialed-back ~80%).
 * Distinct cream/ink palette with violet/mint/coral accents (its own identity,
 * not a copy of any single template). Hero showcases the Pop card.
 */
import Link from "next/link";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Sticker } from "@/components/site/Sticker";
import { PhoneFrame } from "@/components/PhoneFrame";
import { sampleCardFor } from "@/features/cards/seed";

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 24 } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const STEPS = [
  { n: "1", color: "bg-brand text-white", title: "Pick a template", body: "Choose from 9 stunning, single-screen designs across three styles." },
  { n: "2", color: "bg-mint text-ink", title: "Add your details", body: "Business name, links, hours, contact — a live preview updates as you type." },
  { n: "3", color: "bg-coral text-ink", title: "Share your link + QR", body: "Drop the link in ads, or print the QR on flyers and your storefront." },
];

// Slugs are resolved from the single seed source (sampleCardFor) so the landing
// page never drifts from the gallery/renderer data.
const HERO_TEMPLATE = "pop";
const SHOWCASE = [
  { id: "pop", name: "Pop" },
  { id: "aurora", name: "Aurora" },
  { id: "editorial", name: "Editorial" },
];

const TIERS = [
  { name: "Free", price: "$0", tag: "bg-paper-2", features: ["1 card", "Curated templates", "Link + QR code"], cta: "Start free" },
  { name: "Pro", price: "$8", tag: "bg-mint", featured: true, features: ["Unlimited cards", "All styles + customization", "Analytics + custom domain"], cta: "Go Pro" },
  { name: "Premium", price: "$15", tag: "bg-brand text-white", features: ["Everything in Pro", "AI card generator", "Premium-only templates"], cta: "Go Premium" },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <SiteNav />

      {/* Hero */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-8 pb-20 lg:grid-cols-2 lg:pt-14"
      >
        <div>
          <motion.span
            variants={rise}
            className="inline-block -rotate-1 rounded-lg border-2 border-ink bg-mint px-3 py-1 text-sm font-extrabold shadow-[3px_3px_0_0_#161320]"
          >
            ✦ Digital business cards
          </motion.span>
          <motion.h1
            variants={rise}
            className="font-display mt-6 text-[3rem] font-extrabold leading-[0.98] tracking-tight sm:text-[4rem]"
          >
            A business card people{" "}
            <span className="relative inline-block">
              <span className="relative z-10">actually scan.</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-coral" />
            </span>
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-md text-lg font-semibold text-ink/65">
            Pick a stunning template, add your details, and get a shareable link + QR code in
            60 seconds. No website needed.
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-4">
            <Sticker href="/templates" variant="ink" size="lg" className="!shadow-[5px_5px_0_0_#6d5ef7]">
              Make yours free →
            </Sticker>
            <Sticker href="/templates" variant="light" size="lg">
              Browse templates
            </Sticker>
          </motion.div>
          <motion.div variants={rise} className="mt-8 flex items-center gap-3 text-sm font-bold text-ink/55">
            <span className="flex -space-x-2">
              {["#6d5ef7", "#21cfa0", "#ff7a5c", "#161320"].map((c) => (
                <span key={c} className="h-7 w-7 rounded-full border-2 border-ink" style={{ background: c }} />
              ))}
            </span>
            Free to start · no credit card
          </motion.div>
        </div>

        {/* Phone visual */}
        <motion.div variants={rise} className="flex justify-center lg:justify-end">
          <div className="relative -rotate-2">
            <div className="absolute -left-5 -top-5 -z-0 h-20 w-20 -rotate-12 rounded-2xl border-2 border-ink bg-mint shadow-[3px_3px_0_0_#161320]" />
            <div className="absolute -bottom-4 -right-4 z-20 rounded-xl border-2 border-ink bg-paper-2 px-3 py-1.5 text-sm font-extrabold shadow-[3px_3px_0_0_#161320]">
              60-sec setup ✨
            </div>
            <div className="relative z-10 rounded-[2.5rem] border-2 border-ink shadow-[6px_6px_0_0_#161320]">
              <PhoneFrame src={`/c/${sampleCardFor(HERO_TEMPLATE).slug}`} title="Pop template preview" scale={0.64} />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* How it works */}
      <section className="border-y-2 border-ink bg-paper-2">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Live in three steps.
          </h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {STEPS.map((s) => (
              <motion.div
                key={s.n}
                variants={rise}
                className="rounded-2xl border-2 border-ink bg-paper p-6 shadow-[4px_4px_0_0_#161320]"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink font-display text-lg font-extrabold ${s.color}`}>
                  {s.n}
                </span>
                <h3 className="font-display mt-4 text-xl font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm font-medium text-ink/65">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Template showcase */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Nine looks. Every kind of business.
          </h2>
          <Link href="/templates" className="hidden font-display text-sm font-extrabold text-brand no-underline hover:underline sm:block">
            Browse all 9 →
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-3">
          {SHOWCASE.map((t) => (
            <div key={t.id} className="flex flex-col items-center">
              <div className="rounded-[2.2rem] border-2 border-ink shadow-[5px_5px_0_0_#161320]">
                <PhoneFrame src={`/c/${sampleCardFor(t.id).slug}`} title={`${t.name} preview`} scale={0.56} />
              </div>
              <span className="mt-4 rounded-lg border-2 border-ink bg-paper-2 px-3 py-1 font-display text-sm font-extrabold shadow-[2px_2px_0_0_#161320]">
                {t.name}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center sm:hidden">
          <Sticker href="/templates" variant="light" size="md">Browse all 9 →</Sticker>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-y-2 border-ink bg-paper-2">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pay for better-looking cards.
          </h2>
          <p className="mt-3 max-w-md font-semibold text-ink/60">
            Start free. Upgrade when you want more designs, customization, and AI.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border-2 border-ink bg-paper p-6 ${tier.featured ? "shadow-[6px_6px_0_0_#21cfa0]" : "shadow-[4px_4px_0_0_#161320]"}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-extrabold">{tier.name}</h3>
                  {tier.featured && (
                    <span className="rounded-md border-2 border-ink bg-mint px-2 py-0.5 text-xs font-extrabold">
                      Popular
                    </span>
                  )}
                </div>
                <p className="font-display mt-3 text-4xl font-extrabold">
                  {tier.price}
                  <span className="text-base font-bold text-ink/50">/mo</span>
                </p>
                <ul className="mt-5 space-y-2 text-sm font-medium text-ink/75">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-mint">✦</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Sticker href="/login" variant={tier.featured ? "primary" : "light"} size="md" className="w-full">
                    {tier.cta}
                  </Sticker>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display mx-auto max-w-2xl text-[2.5rem] font-extrabold leading-[1.0] tracking-tight sm:text-5xl">
          Make a card your customers won't forget.
        </h2>
        <div className="mt-8 flex justify-center">
          <Sticker href="/templates" variant="ink" size="lg" className="!shadow-[5px_5px_0_0_#6d5ef7]">
            Make yours free →
          </Sticker>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
