import type { NextConfig } from "next";

// The app's /privacy and /terms are the one legal text (public, no sign-in),
// so the website sends its old Hostinger URLs there. Always the production
// app: the dev app sits behind Cloudflare Access.
const LEGAL_APP_URL = "https://app.hirerevolution.ai";

// Every non-root URL in the old Hostinger sitemap, so the cutover keeps the
// inbound links. Targets are the page each old URL actually *contained*, not
// what its slug suggests — two of those slugs are misleading:
//   /job-searching is the About page (the old nav's "About" and "Read our
//     story" both pointed at it), not anything to do with job seekers.
//   /ai-job-applications-candidate-seeker-details is employer-facing
//     ("Are you an employer looking to attract the right candidates faster?"
//     / "Empowering Employers"); "candidate-seeker" means one who seeks
//     candidates. Its near-twin /ai-job-applications-seeker-details is the
//     genuinely job-seeker-facing one, despite sharing a <title>.
// /demo, /fulfillment-policy and /digital-accessibility are also in the old
// sitemap and already exist here at the same paths.
const LEGACY_HOSTINGER_URLS = [
  { source: "/ai-hiring-solutions", destination: "/features" },
  { source: "/ai-hiring-solutions-pricing", destination: "/pricing" },
  { source: "/contact-ai-hiring-solutions", destination: "/contact" },
  { source: "/job-searching", destination: "/about" },
  { source: "/ai-job-applications-candidate-seeker-details", destination: "/features" },
  { source: "/ai-job-applications-seeker-details", destination: "/candidates/features" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacy-policy", destination: `${LEGAL_APP_URL}/privacy`, permanent: true },
      { source: "/privacy", destination: `${LEGAL_APP_URL}/privacy`, permanent: true },
      { source: "/terms-of-service", destination: `${LEGAL_APP_URL}/terms`, permanent: true },
      { source: "/terms", destination: `${LEGAL_APP_URL}/terms`, permanent: true },
      { source: "/accessibility", destination: "/digital-accessibility", permanent: true },
      ...LEGACY_HOSTINGER_URLS.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
