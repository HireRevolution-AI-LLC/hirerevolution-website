/**
 * Every page has a hiring version and a candidate version. Hiring pages keep the
 * plain URLs (hiring managers are the default audience); candidate pages live
 * under /candidates. The visitor's choice is remembered in a cookie (set by
 * proxy.ts) so the home page and the shared pages follow it.
 */

export type Audience = "hiring" | "candidates";

export const AUDIENCE_COOKIE = "hr_audience";
export const AUDIENCE_PARAM = "for";
export const CANDIDATES_PREFIX = "/candidates";

export function parseAudience(value: string | null | undefined): Audience | null {
  return value === "hiring" || value === "candidates" ? value : null;
}

export function isCandidatePath(pathname: string): boolean {
  return pathname === CANDIDATES_PREFIX || pathname.startsWith(`${CANDIDATES_PREFIX}/`);
}

/** Pages with no audience of their own; their nav follows the cookie. */
export const SHARED_PATHS = ["/about", "/contact"];

/** Links that switch audience; the ?for= makes proxy.ts remember the choice. */
export const SWITCH_TO: Record<Audience, string> = {
  hiring: `/?${AUDIENCE_PARAM}=hiring`,
  candidates: `${CANDIDATES_PREFIX}?${AUDIENCE_PARAM}=candidates`,
};

export const HOME: Record<Audience, string> = { hiring: "/", candidates: CANDIDATES_PREFIX };

export const NAV_LINKS: Record<Audience, { label: string; href: string }[]> = {
  hiring: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demo", href: "/demo" },
    { label: "About", href: "/about" },
  ],
  candidates: [
    { label: "Features", href: `${CANDIDATES_PREFIX}/features` },
    { label: "Pricing", href: `${CANDIDATES_PREFIX}/pricing` },
    { label: "About", href: "/about" },
  ],
};
