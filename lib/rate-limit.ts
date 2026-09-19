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

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
