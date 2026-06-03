/**
 * Builds contact + link "actions" (icon + label + href) from a card.
 *
 * Returns DATA, not UI — each template renders these in its own visual style so
 * we stay DRY without forcing a uniform look.
 */
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";
import type { BusinessCard, CardLink } from "@/features/cards/types";

export type ContactAction = {
  key: string;
  label: string;
  /** href, or undefined for display-only items like opening hours. */
  href?: string;
  Icon: LucideIcon;
};

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// lucide-react no longer ships brand logos (trademark), so social links use a
// generic link/globe icon — the label still names the platform.
const LINK_ICONS: Record<string, LucideIcon> = {
  website: Globe,
  link: LinkIcon,
};

/** Primary contact methods (phone/email/address/website/hours). */
export function getContactActions(card: BusinessCard): ContactAction[] {
  const { contact } = card;
  const actions: ContactAction[] = [];
  if (contact.phone)
    actions.push({ key: "phone", label: contact.phone, href: `tel:${contact.phone}`, Icon: Phone });
  if (contact.email)
    actions.push({ key: "email", label: contact.email, href: `mailto:${contact.email}`, Icon: Mail });
  if (contact.website)
    actions.push({
      key: "website",
      label: contact.website.replace(/^https?:\/\//i, ""),
      href: normalizeUrl(contact.website),
      Icon: Globe,
    });
  if (contact.address)
    actions.push({
      key: "address",
      label: contact.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
      Icon: MapPin,
    });
  if (contact.hours) actions.push({ key: "hours", label: contact.hours, Icon: Clock });
  return actions;
}

/** Custom links/buttons, with a resolved icon. */
export function getLinkActions(card: BusinessCard): ContactAction[] {
  return card.links.map((link: CardLink, i) => ({
    key: `link-${i}`,
    label: link.label,
    href: normalizeUrl(link.url),
    Icon: (link.icon && LINK_ICONS[link.icon.toLowerCase()]) || LinkIcon,
  }));
}

/** Two-letter monogram fallback when a card has no logo. */
export function monogram(businessName: string): string {
  const words = businessName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
