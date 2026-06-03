import Link from "next/link";

/** Brand footer, shared across marketing pages. */
export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <span className="font-display text-lg font-extrabold tracking-tight">
          yourbusiness<span className="text-mint">.cards</span>
        </span>
        <div className="flex items-center gap-6 text-sm font-semibold text-paper/70">
          <Link href="/templates" className="no-underline transition-colors hover:text-paper">
            Templates
          </Link>
          <Link href="/" className="no-underline transition-colors hover:text-paper">
            Pricing
          </Link>
          <Link href="/" className="no-underline transition-colors hover:text-paper">
            Sign in
          </Link>
        </div>
        <span className="text-xs text-paper/40">© {new Date().getFullYear()} YourBusiness.Cards</span>
      </div>
    </footer>
  );
}
