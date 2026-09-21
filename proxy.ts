import { NextRequest, NextResponse } from "next/server";
import {
  AUDIENCE_COOKIE,
  AUDIENCE_PARAM,
  isJobSeekerPath,
  parseAudience,
  type Audience,
} from "@/lib/audience";

/**
 * Remembers whether the visitor is hiring or job seeking, so the shared pages
 * (/about, /contact) show the right nav and CTA.
 *
 * The home page is deliberately *not* personalised. It always renders the
 * hiring page with both audience tabs on it, because everyone landing on the
 * domain should get to see the two paths and pick one. An earlier version sent
 * a returning job seeker straight to the job-seeker home, which meant those
 * visitors never saw the choice -- and a hiring manager who had once looked at
 * the job-seeker side kept getting sent there for a year afterwards.
 */

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const chosen = parseAudience(searchParams.get(AUDIENCE_PARAM));
  const saved = parseAudience(request.cookies.get(AUDIENCE_COOKIE)?.value);

  const audience: Audience | null = chosen ?? (isJobSeekerPath(pathname) ? "candidates" : null);
  let response = NextResponse.next();
  if (chosen) {
    // Remember the choice, then drop ?for= so the address stays clean to share.
    const clean = request.nextUrl.clone();
    clean.searchParams.delete(AUDIENCE_PARAM);
    response = NextResponse.redirect(clean, 307);
  }
  if (audience && audience !== saved) {
    response.cookies.set(AUDIENCE_COOKIE, audience, {
      maxAge: ONE_YEAR_SECONDS,
      sameSite: "lax",
      path: "/",
    });
  }
  return response;
}

// The switch links land on "/" or "/job-seekers"; nothing else needs the proxy.
// Link prefetches are skipped: a prefetched "For job seekers" link would
// otherwise mark every visitor as a job seeker. Next reads this config
// statically, so it has to be written out literally.
export const config = {
  matcher: [
    {
      source: "/",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/job-seekers",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/job-seekers/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
