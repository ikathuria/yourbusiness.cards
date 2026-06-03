import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Sticker — the brand's neobrutalist button/link (dialed-back ~80%: 2px borders,
 * soft 3–4px offset shadow, chunky display type). Renders a Link if `href` is set.
 */
type Variant = "primary" | "ink" | "light" | "mint" | "coral";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white",
  ink: "bg-ink text-paper",
  light: "bg-paper-2 text-ink",
  mint: "bg-mint text-ink",
  coral: "bg-coral text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm rounded-lg shadow-[3px_3px_0_0_#161320]",
  md: "px-5 py-2.5 text-sm rounded-xl shadow-[3px_3px_0_0_#161320]",
  lg: "px-7 py-3.5 text-base rounded-2xl shadow-[4px_4px_0_0_#161320]",
};

type StickerProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
};

export function Sticker({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: StickerProps) {
  const cls = `inline-flex items-center justify-center gap-2 border-2 border-ink font-display font-extrabold no-underline transition-transform hover:-translate-y-0.5 active:translate-y-0 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <button className={cls}>{children}</button>;
}
