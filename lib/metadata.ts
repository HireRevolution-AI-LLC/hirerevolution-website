import type { Metadata } from "next";

export const SITE_NAME = "HireRevolution AI";
export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630 };

/**
 * Everything a page tells search engines and link previews about itself.
 *
 * Next replaces -- it does not merge -- the layout's openGraph and twitter
 * blocks when a page sets its own, and a page that sets neither inherits the
 * layout's. That inheritance is how every page used to preview on LinkedIn as
 * the home page, og:url included. So each page builds the whole set here.
 *
 * `preview` is for link cards, when they should read differently from the
 * search result; it defaults to the page's title and description.
 */
export function pageMetadata({
  path,
  title,
  description,
  preview = {},
}: {
  path: string;
  title: string;
  description: string;
  preview?: { title?: string; description?: string };
}): Metadata {
  const card = {
    title: preview.title ?? title,
    description: preview.description ?? description,
  };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...card, url: path, siteName: SITE_NAME, images: [OG_IMAGE], type: "website" },
    twitter: { ...card, card: "summary_large_image", images: [OG_IMAGE.url] },
  };
}
