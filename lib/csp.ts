/**
 * The Content-Security-Policy for every page, built per request around a
 * fresh nonce (proxy.ts). Next reads the nonce back out of this header while
 * rendering and puts it on its own inline scripts, which is what lets
 * script-src and style-src go without 'unsafe-inline'. The cost is that pages
 * can no longer be prerendered -- a static page has no request to take a
 * nonce from -- so the root layout opts every page into dynamic rendering.
 *
 * Everything the browser is allowed to load. Kept in step with the code:
 *   challenges.cloudflare.com  Turnstile's script, its iframe and its XHR
 *   www.youtube-nocookie.com   the embedded player (YouTube.tsx)
 *   i.ytimg.com                video thumbnails, loaded before the player is
 * Fonts are self-hosted by next/font, so no external font origin is needed,
 * and Stripe prices arrive server-side, so there is no Stripe origin either.
 *
 * No 'strict-dynamic': it would switch off 'self', and Cloudflare's Email
 * Obfuscation injects /cdn-cgi/.../email-decode.min.js into every page with
 * no nonce. Every mailto link on the site would then stay scrambled.
 *
 * No `data:` in img-src: nothing on the site uses a data: image, and a scheme
 * source is exactly what scanners score as an over-broad directive.
 */

// Turbopack's hot reload runs eval and injects its styles inline, and the dev
// server talks over a websocket. The relaxations are development-only.
const DEV = process.env.NODE_ENV !== "production";

export function contentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${DEV ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
    `style-src 'self' ${DEV ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    "img-src 'self' https://i.ytimg.com",
    "font-src 'self'",
    `connect-src 'self'${DEV ? " ws:" : ""} https://challenges.cloudflare.com`,
    "frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/** API routes return JSON, never a document, so they get nothing at all. */
export const API_CSP = "default-src 'none'; frame-ancestors 'none'";
