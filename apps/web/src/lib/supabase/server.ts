import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_KEY } from "./config";

/**
 * Server-side Supabase client (App Router). `cookies()` is async in Next 16.
 * Server Components can't write cookies — those writes are swallowed and handled
 * by middleware (added with auth in Milestone 4).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // called from a Server Component — safe to ignore (middleware refreshes)
        }
      },
    },
  });
}
