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

/** A safe, collision-resistant slug for a new draft card. */
export function draftSlug(name: string): string {
  const base = slugify(name);
  return isReserved(base) ? `${base}-${randomSuffix()}` : `${base}-${randomSuffix()}`;
}
