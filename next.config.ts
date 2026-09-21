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

const nextConfig: NextConfig = {
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
