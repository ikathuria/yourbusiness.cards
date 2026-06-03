import type { Metadata } from "next";
import Link from "next/link";
import { templatesByFamily } from "@/templates/registry";
import { FAMILY_LABELS, type TemplateFamily } from "@/templates/types";
import { sampleCardFor } from "@/features/cards/seed";
import { PhoneFrame } from "@/components/PhoneFrame";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse stunning, single-screen digital business card templates. Pick one and make it yours in seconds.",
};

const FAMILY_ORDER: TemplateFamily[] = ["modern", "bold", "classic"];
const FAMILY_ACCENT: Record<TemplateFamily, string> = {
  modern: "bg-brand text-white",
  bold: "bg-coral text-ink",
  classic: "bg-mint text-ink",
};
const TIER_STYLE: Record<string, string> = {
  free: "bg-paper-2 text-ink",
  pro: "bg-mint text-ink",
  premium: "bg-brand text-white",
};

export default function TemplatesGallery() {
  const byFamily = templatesByFamily();

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <SiteNav />

      {/* Header */}
      <header className="mx-auto max-w-4xl px-6 pt-10 pb-6 text-center">
        <span className="inline-block -rotate-1 rounded-lg border-2 border-ink bg-mint px-3 py-1 text-sm font-extrabold shadow-[3px_3px_0_0_#161320]">
          The gallery
        </span>
        <h1 className="font-display mt-6 text-[2.75rem] font-extrabold leading-[1.0] tracking-tight sm:text-6xl">
          Templates that look{" "}
          <span className="relative inline-block">
            <span className="relative z-10">expensive.</span>
            <span className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-coral" />
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-semibold text-ink/65">
          Professionally designed, single-screen cards across three styles. Every business
          finds its look — then makes it theirs in seconds.
        </p>
      </header>

      {/* Families */}
      <div className="mx-auto max-w-6xl space-y-20 px-6 py-12">
        {FAMILY_ORDER.map((family) => {
          const items = byFamily[family] ?? [];
          if (items.length === 0) return null;
          return (
            <section key={family}>
              <div className="mb-10 flex items-center gap-3">
                <span className={`rounded-lg border-2 border-ink px-3 py-1.5 font-display text-lg font-extrabold shadow-[3px_3px_0_0_#161320] ${FAMILY_ACCENT[family]}`}>
                  {FAMILY_LABELS[family]}
                </span>
                <span className="font-display text-sm font-bold text-ink/50">
                  {items.length} template{items.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="grid grid-cols-1 justify-items-center gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => {
                  const card = sampleCardFor(t.id);
                  return (
                    <article key={t.id} className="flex flex-col items-center">
                      <Link href={`/c/${card.slug}`} className="rounded-[2.4rem] border-2 border-ink shadow-[5px_5px_0_0_#161320] transition-transform hover:-translate-y-1">
                        <PhoneFrame src={`/c/${card.slug}`} title={`${t.name} preview`} />
                      </Link>
                      <div className="mt-5 w-full max-w-[16rem] text-center">
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="font-display text-lg font-extrabold text-ink">{t.name}</h3>
                          <span className={`rounded-md border-2 border-ink px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wide ${TIER_STYLE[t.tier]}`}>
                            {t.tier}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-ink/60">{t.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <SiteFooter />
    </div>
  );
}
