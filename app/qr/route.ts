/**
 * The address printed in every QR code (business cards, handouts, signs):
 * https://hirerevolution.ai/qr. It forwards to DESTINATION, so re-pointing
 * every code already in circulation is a one-line change and a deploy -- no
 * reprinting.
 *
 * The destination is a constant in source on purpose. It is not read from a
 * query parameter, a cookie, a database or an admin page, and the request's
 * own query string is not passed along, so nothing a visitor sends can change
 * where /qr goes. The only way to change it is a commit.
 *
 * DESTINATION may be a path on this site ("/videos") or an absolute URL we
 * control. A path is sent as a relative Location, which the browser resolves
 * against the address it scanned -- building an absolute URL from the request
 * would pick up the host nginx proxies to (localhost) instead.
 *
 * The redirect is temporary (307) and marked no-store, never permanent: a 308
 * is cached by browsers and Cloudflare indefinitely, and anyone who had
 * scanned a code before would keep landing on the old destination.
 *
 * Counting scans: every request is logged as a "[qr] scan" line (timestamp
 * only, no IP or user agent), so `grep -c '\[qr\] scan'` over the PM2 out log
 * gives the total. The destination also carries utm_source=qr, which does
 * nothing on its own today -- the site has no analytics -- but lets any
 * analytics tool added later attribute these visits, and how they behave on
 * the site afterwards, to the QR codes. Keep the tag when changing the
 * destination to another page here; it is pointless on an external site.
 */

const DESTINATION = "/?utm_source=qr";

export function GET() {
  console.log(`[qr] scan ${new Date().toISOString()}`);
  return new Response(null, {
    status: 307,
    headers: { Location: DESTINATION, "Cache-Control": "no-store" },
  });
}
