import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Only run auth check on page routes. Exclude:
     * - _next/static (JS, CSS, chunks)
     * - _next/image
     * - favicon and other static files
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:ico|png|svg|woff2?)$).*)",
  ],
};
