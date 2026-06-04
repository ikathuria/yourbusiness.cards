import Link from "next/link";
import { Sticker } from "@/components/site/Sticker";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <Link
        href="/"
        className="mb-10 font-display text-lg font-extrabold tracking-tight text-ink no-underline"
      >
        yourbusiness<span className="text-brand">.cards</span>
      </Link>

      <span className="inline-block -rotate-2 rounded-lg border-2 border-ink bg-coral px-3 py-1 text-sm font-extrabold shadow-[3px_3px_0_0_#161320]">
        404
      </span>
      <h1 className="font-display mt-6 text-[2.5rem] font-extrabold leading-[1.0] tracking-tight sm:text-5xl">
        This card isn&apos;t here.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base font-semibold text-ink/60">
        The page or card you&apos;re after doesn&apos;t exist, or it hasn&apos;t been published yet.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Sticker href="/templates" variant="primary" size="lg">
          Browse templates
        </Sticker>
        <Sticker href="/" variant="light" size="lg">
          Back home
        </Sticker>
      </div>
    </main>
  );
}
