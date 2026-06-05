import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/supabase/auth";
import { PLAN_FEATURES } from "@/features/billing/plans";
import { Sticker } from "@/components/site/Sticker";
import { generateCard } from "./actions";

export const metadata: Metadata = { title: "Generate with AI" };

const EXAMPLE =
  "Lumen Coffee — a cozy specialty coffee shop in Portland. We roast single-origin beans, serve oat-milk lattes and house-made pastries, and host live acoustic sets on Fridays. Open 7am–6pm daily. Phone (503) 555-0142, on Instagram @lumencoffee, and we take pre-orders online.";

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const account = await getAccount();
  if (!account) redirect("/login");

  const aiEnabled = PLAN_FEATURES[account.plan].ai;

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="border-b-2 border-ink bg-paper-2">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/dashboard/new" className="font-display text-sm font-extrabold text-ink no-underline">
            ← Back
          </Link>
          <span className="rounded-md border-2 border-ink bg-brand px-2 py-0.5 text-xs font-extrabold uppercase text-white">
            Premium · AI
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">✨ Generate a card with AI</h1>
        <p className="mt-1 max-w-xl text-sm font-medium text-ink/60">
          Describe your business in a few sentences. Our AI picks the right template, colors, and
          copy, then drops you into the editor to fine-tune.
        </p>

        {!aiEnabled ? (
          <div className="mt-8 rounded-2xl border-2 border-ink bg-paper-2 p-8 text-center shadow-[4px_4px_0_0_#161320]">
            <p className="font-display text-xl font-extrabold">AI generation is a Premium feature</p>
            <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-ink/60">
              Upgrade to Premium to let AI design a complete card from a short description.
            </p>
            <div className="mt-6 flex justify-center">
              <Sticker href="/dashboard" variant="primary" size="md">
                See plans
              </Sticker>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-6 rounded-2xl border-2 border-ink bg-coral/25 p-4 text-sm font-bold text-ink shadow-[3px_3px_0_0_#161320]">
                {error}
              </div>
            )}
            <form action={generateCard} className="mt-8 space-y-4">
              <label className="font-display text-xs font-extrabold uppercase tracking-wide text-ink/70">
                Tell us about your business
              </label>
              <textarea
                name="brief"
                required
                minLength={8}
                rows={7}
                defaultValue=""
                placeholder={EXAMPLE}
                className="w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-sm text-ink outline-none focus:shadow-[3px_3px_0_0_#6d5ef7]"
              />
              <div className="flex items-center gap-3">
                <button className="rounded-xl border-2 border-ink bg-brand px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-[3px_3px_0_0_#161320] transition-transform hover:-translate-y-0.5">
                  ✨ Generate my card
                </button>
                <span className="text-xs font-medium text-ink/45">Takes a few seconds.</span>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
