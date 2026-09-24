import { NextRequest, NextResponse } from "next/server";
import {
  AUDIENCE_COOKIE,
  AUDIENCE_PARAM,
  isJobSeekerPath,
  parseAudience,
  type Audience,
} from "@/lib/audience";
import { contentSecurityPolicy } from "@/lib/csp";

/**
 * Runs on every page request, for two jobs.
 *
 * 1. The CSP nonce. Each page gets a fresh one, in the Content-Security-Policy
 *    response header and in the same header on the *request*, which is where
 *    Next reads it from to stamp its own inline scripts while rendering.
 *
 * 2. Remembers whether the visitor is hiring or job seeking, so the shared
 *    pages (/about, /contact) show the right nav and CTA -- on "/" and
 *    /job-seekers only, which is where the switch links land.
 *
 * The home page is deliberately *not* personalised. It always renders the
 * hiring page with both audience tabs on it, because everyone landing on the
 * domain should get to see the two paths and pick one. An earlier version sent
 * a returning job seeker straight to the job-seeker home, which meant those
 * visitors never saw the choice -- and a hiring manager who had once looked at
 * the job-seeker side kept getting sent there for a year afterwards.
 */

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

function withNonce(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname !== "/" && !isJobSeekerPath(pathname)) return withNonce(request);

  const chosen = parseAudience(searchParams.get(AUDIENCE_PARAM));
  const saved = parseAudience(request.cookies.get(AUDIENCE_COOKIE)?.value);

  const audience: Audience | null = chosen ?? (isJobSeekerPath(pathname) ? "candidates" : null);
  let response: NextResponse;
  if (chosen) {
    // Remember the choice, then drop ?for= so the address stays clean to share.
    const clean = request.nextUrl.clone();
    clean.searchParams.delete(AUDIENCE_PARAM);
    response = NextResponse.redirect(clean, 307);
  } else {
    response = withNonce(request);
  }
  if (audience && audience !== saved) {
    response.cookies.set(AUDIENCE_COOKIE, audience, {
      maxAge: ONE_YEAR_SECONDS,
      sameSite: "lax",
      path: "/",
      // Not in local dev, which is plain http -- the cookie would be dropped
      // and the audience switch would silently stop working.
      secure: process.env.NODE_ENV === "production",
    });
  }
  return response;
}

// Every page, and nothing that is not one: API routes, build assets and
// anything with a file extension (public/ images, robots.txt, sitemap.xml)
// neither need a nonce nor are documents a CSP applies to.
// Link prefetches are skipped too: a prefetched "For job seekers" link would
// otherwise mark every visitor as a job seeker. Next reads this config
// statically, so it has to be written out literally.
export const config = {
  matcher: [
    {
      source: "/((?!api/|_next/static|_next/image|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
