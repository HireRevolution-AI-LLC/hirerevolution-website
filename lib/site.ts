/** The public origin the site is canonically served from after the cutover. */
export const PRODUCTION_ORIGIN = "https://hirerevolution.ai";
export const PRODUCTION_HOST = new URL(PRODUCTION_ORIGIN).host;

/**
 * The legal text lives in the app so there is one copy, not two. Always the
 * PRODUCTION app, even when this site is built for staging: the dev app sits
 * behind Cloudflare Access and would ask a reader to authenticate.
 */
export const LEGAL_APP_URL = "https://app.hirerevolution.ai";
export const PRIVACY_URL = `${LEGAL_APP_URL}/privacy`;
export const TERMS_URL = `${LEGAL_APP_URL}/terms`;

/**
 * Indexable pages, in the order they matter. Hiring pages rank above the
 * job-seeker ones because hiring teams are the paying audience. Redirects
 * (/privacy, /terms, the old Hostinger URLs) and API routes are deliberately
 * absent -- a sitemap should only list URLs that answer with 200.
 */
export const INDEXABLE_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/features", priority: 0.9 },
  { path: "/pricing", priority: 0.9 },
  { path: "/demo", priority: 0.8 },
  { path: "/offers/submit-job-description", priority: 0.8 },
  { path: "/contact-sales", priority: 0.7 },
  { path: "/job-seekers", priority: 0.7 },
  { path: "/job-seekers/features", priority: 0.6 },
  { path: "/job-seekers/pricing", priority: 0.6 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/accessibility", priority: 0.3 },
  { path: "/fulfillment-policy", priority: 0.3 },
];
