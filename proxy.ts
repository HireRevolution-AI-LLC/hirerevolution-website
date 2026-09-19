import { NextRequest, NextResponse } from "next/server";
import {
  AUDIENCE_COOKIE,
  AUDIENCE_PARAM,
  CANDIDATES_PREFIX,
  isCandidatePath,
  parseAudience,
  type Audience,
} from "@/lib/audience";

/**
 * Remembers whether the visitor is hiring or job seeking. An explicit choice
 * (?for=hiring|candidates, from the home page buttons or the nav switch) or a
 * visit to a candidate page sets the cookie; a returning job seeker who opens
 * the home page lands on the candidate home.
 */

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const chosen = parseAudience(searchParams.get(AUDIENCE_PARAM));
  const saved = parseAudience(request.cookies.get(AUDIENCE_COOKIE)?.value);

  if (pathname === "/" && !chosen && saved === "candidates") {
    return NextResponse.redirect(new URL(CANDIDATES_PREFIX, request.url), 307);
  }

  const audience: Audience | null = chosen ?? (isCandidatePath(pathname) ? "candidates" : null);
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

// The switch links land on "/" or "/candidates"; nothing else needs the proxy.
// Link prefetches are skipped: a prefetched "Job seeking" link would otherwise
// mark every visitor as a job seeker. Next reads this config statically, so it
// has to be written out literally.
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
      source: "/candidates",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/candidates/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
