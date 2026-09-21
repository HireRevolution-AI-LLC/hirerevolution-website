/** The public origin the site is canonically served from after the cutover. */
export const PRODUCTION_ORIGIN = "https://hirerevolution.ai";
export const PRODUCTION_HOST = new URL(PRODUCTION_ORIGIN).host;

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
