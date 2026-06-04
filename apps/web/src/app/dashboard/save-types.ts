/** Shared payload type for the saveCard server action (kept out of the
 * "use server" file, which may only export async functions). */
export type SaveCardInput = {
  id: string;
  templateId: string;
  businessName: string;
  tagline: string;
  description: string;
  contact: { phone?: string; email?: string; website?: string; address?: string; hours?: string };
  links: { label: string; url: string; icon?: string }[];
  themeAccent: string | null;
  published: boolean;
};
