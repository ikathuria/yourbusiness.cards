import type { Metadata } from "next";
import Link from "next/link";
import { templatesByFamily } from "@/templates/registry";
import { FAMILY_LABELS, type TemplateFamily } from "@/templates/types";
import { sampleCardFor } from "@/features/cards/seed";
import { PhoneFrame } from "@/components/PhoneFrame";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse stunning, single-screen digital business card templates. Pick one and make it yours in seconds.",
};

const FAMILY_ORDER: TemplateFamily[] = ["modern", "bold", "classic"];

export default function TemplatesGallery() {
  const byFamily = templatesByFamily();

  return (
    <main className="min-h-[100dvh] bg-background px-6 py-20">
      {/* Header */}
      <header className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-muted">The gallery</p>
        <h1 className="font-display mt-4 text-[length:var(--text-display-1)] font-extrabold leading-[1.02] tracking-tight text-foreground">
          Templates that look{" "}
          <span className="text-brand-gradient">expensive.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Professionally designed, single-screen cards across three styles. Every business
          finds its look — then makes it theirs in seconds.
        </p>
      </header>

      {/* Families */}
      <div className="mx-auto mt-20 max-w-6xl space-y-24">
        {FAMILY_ORDER.map((family) => {
          const items = byFamily[family] ?? [];
          if (items.length === 0) return null;
          return (
            <section key={family}>
              <div className="mb-10 flex items-baseline justify-between border-b border-border pb-4">
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  {FAMILY_LABELS[family]}
                </h2>
                <span className="font-mono text-xs text-muted">
                  {items.length} template{items.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="grid grid-cols-1 justify-items-center gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => {
                  const card = sampleCardFor(t.id);
                  return (
                    <article key={t.id} className="flex flex-col items-center">
                      <PhoneFrame src={`/c/${card.slug}`} title={`${t.name} preview`} />
                      <div className="mt-5 w-full max-w-[16rem] text-center">
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {t.name}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
                              t.tier === "free"
                                ? "bg-brand/10 text-brand"
                                : t.tier === "pro"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-foreground/10 text-foreground"
                            }`}
                          >
                            {t.tier}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted">{t.description}</p>
                        <Link
                          href={`/c/${card.slug}`}
                          className="mt-3 inline-block font-mono text-xs text-brand underline-offset-4 hover:underline"
                        >
                          Open full card &rarr;
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
