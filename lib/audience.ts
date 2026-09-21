/**
 * Every page has a hiring version and a job-seeker version. Hiring pages keep
 * the plain URLs (hiring managers are the default audience and the ones who
 * pay); job-seeker pages live under /job-seekers. The visitor's choice is
 * remembered in a cookie (set by proxy.ts) so the shared pages follow it.
 *
 * The URLs say "job seekers" because every label on that side does. The
 * audience *key* stays "candidates": it is the cookie value and the ?for=
 * value, so renaming it would silently reset the choice for everyone who
 * already has the cookie.
 */

export type Audience = "hiring" | "candidates";

export const AUDIENCE_COOKIE = "hr_audience";
export const AUDIENCE_PARAM = "for";
export const JOB_SEEKERS_PREFIX = "/job-seekers";

export function parseAudience(value: string | null | undefined): Audience | null {
  return value === "hiring" || value === "candidates" ? value : null;
}

export function isJobSeekerPath(pathname: string): boolean {
  return pathname === JOB_SEEKERS_PREFIX || pathname.startsWith(`${JOB_SEEKERS_PREFIX}/`);
}

/** Pages with no audience of their own; their nav follows the cookie. */
export const SHARED_PATHS = ["/about", "/contact"];

/** Links that switch audience; the ?for= makes proxy.ts remember the choice. */
export const SWITCH_TO: Record<Audience, string> = {
  hiring: `/?${AUDIENCE_PARAM}=hiring`,
  candidates: `${JOB_SEEKERS_PREFIX}?${AUDIENCE_PARAM}=candidates`,
};

export const HOME: Record<Audience, string> = { hiring: "/", candidates: JOB_SEEKERS_PREFIX };

export const NAV_LINKS: Record<Audience, { label: string; href: string }[]> = {
  hiring: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demo", href: "/demo" },
    { label: "About", href: "/about" },
  ],
  candidates: [
    { label: "Features", href: `${JOB_SEEKERS_PREFIX}/features` },
    { label: "Pricing", href: `${JOB_SEEKERS_PREFIX}/pricing` },
    { label: "About", href: "/about" },
  ],
};
