import { NextRequest, NextResponse } from "next/server";

/**
 * Owner-only protection for /owner/* (QR generator and future owner tools).
 * Interim guard until Phase 2 full owner login: HTTP Basic Auth enforced on the server,
 * so the page code and QR generator are never served to customers.
 *
 * Required env vars (Vercel -> Project Settings -> Environment Variables):
 *   OWNER_PANEL_USER, OWNER_PANEL_PASSWORD
 * If they are missing, the panel is LOCKED (fail closed), never open.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function middleware(req: NextRequest) {
  const user = process.env.OWNER_PANEL_USER;
  const pass = process.env.OWNER_PANEL_PASSWORD;

  if (!user || !pass) {
    return new NextResponse("Owner panel is not configured.", { status: 503 });
  }

  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const [u, ...rest] = atob(header.slice(6)).split(":");
      if (safeEqual(u, user) && safeEqual(rest.join(":"), pass)) {
        const res = NextResponse.next();
        res.headers.set("Cache-Control", "no-store");
        res.headers.set("X-Robots-Tag", "noindex, nofollow");
        return res;
      }
    } catch {
      // fall through to 401
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Owner Panel", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/owner/:path*"],
};
