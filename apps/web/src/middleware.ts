import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Run on all routes except static assets, images, and the QR/OG endpoints.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/qr|.*opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
