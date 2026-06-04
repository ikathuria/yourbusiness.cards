import Link from "next/link";
import { Sticker } from "./Sticker";

/** Brand top nav, shared across marketing pages. */
export function SiteNav() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-ink no-underline">
        yourbusiness<span className="text-brand">.cards</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/templates"
          className="hidden text-sm font-bold text-ink/70 no-underline transition-colors hover:text-ink sm:block"
        >
          Templates
        </Link>
        <Sticker href="/login" variant="light" size="sm">
          Sign in
        </Sticker>
        <Sticker href="/login" variant="primary" size="sm">
          Make yours
        </Sticker>
      </div>
    </nav>
  );
}
