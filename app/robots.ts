import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { PRODUCTION_HOST, PRODUCTION_ORIGIN } from "@/lib/site";

/**
 * Only the production host invites crawlers. staging.hirerevolution.ai runs
 * the same build from the same droplet, and until now served neither a
 * robots.txt nor an X-Robots-Tag -- so it was free to index and would have
 * competed with the apex for the same copy.
 *
 * Reading the Host header makes this per-request rather than baked in at
 * build time, which is what lets one build answer correctly on both names.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.toLowerCase().split(":")[0];

  if (host !== PRODUCTION_HOST && host !== `www.${PRODUCTION_HOST}`) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${PRODUCTION_ORIGIN}/sitemap.xml`,
    host: PRODUCTION_ORIGIN,
  };
}
