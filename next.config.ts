import type { NextConfig } from "next";

import { PRIVACY_URL, TERMS_URL } from "./lib/site";

// Every non-root URL in the old Hostinger sitemap, so the cutover keeps the
// inbound links. Targets are the page each old URL actually *contained*, not
// what its slug suggests -- two of those slugs are misleading:
//   /job-searching is the About page (the old nav's "About" and "Read our
//     story" both pointed at it), not anything to do with job seekers.
//   /ai-job-applications-candidate-seeker-details is employer-facing
//     ("Are you an employer looking to attract the right candidates faster?"
//     / "Empowering Employers"); "candidate-seeker" means one who seeks
//     candidates. Its near-twin /ai-job-applications-seeker-details is the
//     genuinely job-seeker-facing one, despite sharing a <title>.
// /demo and /fulfillment-policy are also in the old sitemap and already exist
// here at the same paths; /digital-accessibility is handled below.
const LEGACY_HOSTINGER_URLS = [
  // The old "Services" page, which pitched both audiences at once
  // ("AI Hiring Solutions for Job Seekers and Employers"). /features is the
  // hiring features page -- each audience has its own -- so there is no
  // single features page that matches it. The home page is the one that
  // offers both paths, so it lands there.
  { source: "/ai-hiring-solutions", destination: "/" },
  { source: "/ai-hiring-solutions-pricing", destination: "/pricing" },
  { source: "/contact-ai-hiring-solutions", destination: "/contact" },
  { source: "/job-searching", destination: "/about" },
  { source: "/ai-job-applications-candidate-seeker-details", destination: "/features" },
  { source: "/ai-job-applications-seeker-details", destination: "/job-seekers/features" },
  // The old footer's accessibility link. The page itself is /accessibility
  // here, which is what it calls itself ("Accessibility Statement").
  { source: "/digital-accessibility", destination: "/accessibility" },
];

// Paths this site used before launch. Nothing public points at them, but
// staging links and bookmarks do, and they cost one line each.
const RENAMED_URLS = [
  { source: "/candidates", destination: "/job-seekers" },
  { source: "/candidates/:path*", destination: "/job-seekers/:path*" },
  { source: "/offers/submit-jd", destination: "/offers/submit-job-description" },
];

// Everything the browser is allowed to load. Kept in step with the code:
//   challenges.cloudflare.com  Turnstile's script, its iframe and its XHR
//   www.youtube-nocookie.com   the embedded player (YouTube.tsx)
//   i.ytimg.com                video thumbnails, loaded before the player is
// Fonts are self-hosted by next/font, so no external font origin is needed,
// and Stripe prices arrive server-side, so there is no Stripe origin either.
//
// script-src needs 'unsafe-inline': Next puts hydration data in inline
// script tags, and a nonce would force every prerendered page to render per
// request. The directives that do not depend on it -- frame-ancestors,
// base-uri, form-action, object-src -- are the ones carrying most of the
// weight here, and they are exact.
// Turbopack's hot reload runs eval, so `next dev` would break under the
// production policy. The relaxation is scoped to development only.
const DEV = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${DEV ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://i.ytimg.com",
  "font-src 'self'",
  // ws: is the dev server's hot-reload socket.
  `connect-src 'self'${DEV ? " ws:" : ""} https://challenges.cloudflare.com`,
  "frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // No includeSubDomains and no preload on purpose: this zone has subdomains
  // owned by other repos (app, app-dev, api, api-demo, staging), and preload
  // is close to irreversible. Widen it deliberately once every subdomain is
  // known to be HTTPS-only.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },

  async redirects() {
    return [
      { source: "/privacy-policy", destination: PRIVACY_URL, permanent: true },
      { source: "/privacy", destination: PRIVACY_URL, permanent: true },
      { source: "/terms-of-service", destination: TERMS_URL, permanent: true },
      { source: "/terms", destination: TERMS_URL, permanent: true },
      ...[...LEGACY_HOSTINGER_URLS, ...RENAMED_URLS].map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
