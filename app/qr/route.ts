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
 */

const DESTINATION = "/";

export function GET() {
  return new Response(null, {
    status: 307,
    headers: { Location: DESTINATION, "Cache-Control": "no-store" },
  });
}
