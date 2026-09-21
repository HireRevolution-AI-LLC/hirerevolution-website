import type { NextRequest } from "next/server";

/**
 * Per-IP sliding-window limits for the public forms.
 *
 * In memory: one process serves the site (PM2 fork mode), so this is exact
 * while it runs but resets on every deploy or restart. It is a first line of
 * defence only; the app enforces the lasting per-email and per-company limits.
 */

const windows = new Map<string, number[]>();

/** Record an attempt for `key`; true when it is over `limit` within `windowMs`. */
export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (windows.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    windows.set(key, recent);
    return true;
  }
  recent.push(now);
  windows.set(key, recent);
  return false;
}

/**
 * A cheap per-IP ceiling for the form endpoints, checked *before* Turnstile.
 *
 * Verifying a token is an outbound HTTPS call with a ten-second timeout, and
 * it used to be the first thing every POST did, so anyone could make this
 * server open unbounded connections to Cloudflare by posting junk tokens --
 * on one PM2 process with 1 GB, that is enough to hurt. The real per-form
 * limits still run after validation; this one only exists to stop the
 * expensive step from being free.
 *
 * Set well above honest use: a person correcting a validation error and
 * resubmitting a few times stays far below it.
 */
const BURST_LIMIT = 20;
const BURST_WINDOW_MS = 5 * 60_000;

export function burstLimited(ip: string): boolean {
  return rateLimited(`burst:${ip}`, BURST_LIMIT, BURST_WINDOW_MS);
}

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
