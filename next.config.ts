import type { NextConfig } from "next";

// The app's /privacy and /terms are the one legal text (public, no sign-in),
// so the website sends its old Hostinger URLs there. Always the production
// app: the dev app sits behind Cloudflare Access.
const LEGAL_APP_URL = "https://app.hirerevolution.ai";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacy-policy", destination: `${LEGAL_APP_URL}/privacy`, permanent: true },
      { source: "/privacy", destination: `${LEGAL_APP_URL}/privacy`, permanent: true },
      { source: "/terms-of-service", destination: `${LEGAL_APP_URL}/terms`, permanent: true },
      { source: "/terms", destination: `${LEGAL_APP_URL}/terms`, permanent: true },
      { source: "/accessibility", destination: "/digital-accessibility", permanent: true },
    ];
  },
};

export default nextConfig;
