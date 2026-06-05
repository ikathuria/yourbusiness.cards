/** Slug helpers for card URLs (/c/<slug>). */

const RESERVED = new Set([
  "api", "c", "templates", "login", "dashboard", "pricing", "auth",
  "signup", "new", "_next", "favicon", "robots", "sitemap",
]);

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "card";
}

export function isReserved(slug: string): boolean {
  return RESERVED.has(slug);
}

export function randomSuffix(length = 4): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

/**
 * Light, typing-friendly sanitizer for the slug field in the editor.
 * Lowercases and collapses invalid runs to a single hyphen but keeps a
 * trailing hyphen so the user can keep typing (e.g. "lumen-"). The final
 * canonical form is produced by `slugify` on save.
 */
export function sanitizeSlugInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .slice(0, 40);
}

/** Canonical slug for saving: slugify, then de-reserve with a suffix. */
export function finalizeSlug(desired: string, fallback: string): string {
  const base = slugify(desired) || slugify(fallback);
  return isReserved(base) ? `${base}-${randomSuffix()}` : base;
}

/** A safe, collision-resistant slug for a new draft card. */
export function draftSlug(name: string): string {
  const base = slugify(name);
  return isReserved(base) ? `${base}-${randomSuffix()}` : `${base}-${randomSuffix()}`;
}
