import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, PRODUCTION_ORIGIN } from "@/lib/site";

// Always the production origin, even when built for staging: these URLs are
// what we are asking search engines to index, and staging is excluded from
// crawling altogether (see robots.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return INDEXABLE_ROUTES.map(({ path, priority }) => ({
    url: `${PRODUCTION_ORIGIN}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
