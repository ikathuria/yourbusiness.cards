import type { Metadata } from "next";
import Link from "next/link";
import { templates } from "@/templates/registry";
import { FAMILY_LABELS } from "@/templates/types";
import { sampleCardFor } from "@/features/cards/seed";
import { createCard } from "../actions";

export const metadata: Metadata = { title: "New card" };

const TIER_STYLE: Record<string, string> = {
  free: "bg-paper-2 text-ink",
  pro: "bg-mint text-ink",
  premium: "bg-brand text-white",
};

export default function NewCardPage() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="border-b-2 border-ink bg-paper-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-display text-sm font-extrabold text-ink no-underline">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Pick a template</h1>
        <p className="mt-1 text-sm font-medium text-ink/60">
          Choose a starting design — you can customize everything next.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => {
            const sample = sampleCardFor(t.id);
            return (
              <div
                key={t.id}
                className="flex flex-col rounded-2xl border-2 border-ink bg-paper-2 p-5 shadow-[4px_4px_0_0_#161320]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-extrabold">{t.name}</h2>
                  <span className={`rounded-md border-2 border-ink px-2 py-0.5 text-[0.6rem] font-extrabold uppercase ${TIER_STYLE[t.tier]}`}>
                    {t.tier}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-ink/45">
                  {FAMILY_LABELS[t.family]}
                </p>
                <p className="mt-2 flex-1 text-sm font-medium text-ink/65">{t.description}</p>

                <div className="mt-4 flex items-center gap-2">
                  <form action={createCard} className="flex-1">
                    <input type="hidden" name="templateId" value={t.id} />
                    <button className="w-full rounded-xl border-2 border-ink bg-brand py-2.5 font-display text-sm font-extrabold text-white shadow-[3px_3px_0_0_#161320] transition-transform hover:-translate-y-0.5">
                      Use this
                    </button>
                  </form>
                  <a
                    href={`/c/${sample.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm font-extrabold text-ink no-underline transition-transform hover:-translate-y-0.5"
                  >
                    Preview ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
