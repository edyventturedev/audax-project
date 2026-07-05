import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/updateSession";

// Next.js 16: Middleware is now called "Proxy". Same functionality.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
