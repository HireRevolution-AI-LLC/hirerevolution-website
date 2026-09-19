/**
 * Server-side Cloudflare Turnstile check (siteverify). Server-only: reads
 * TURNSTILE_SECRET.
 *
 * Environment:
 *   TURNSTILE_SECRET     the widget's secret key
 *   TURNSTILE_HOSTNAMES  comma-separated frontend hostnames this deployment
 *                        accepts, e.g. "staging.hirerevolution.ai". Never
 *                        localhost on a deployed server.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** True only for a fresh, valid token issued for this action on an approved hostname. */
export async function verifyTurnstile(token: unknown, expectedAction: string, clientIp: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );

  if (
    !secret ||
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    expectedHostnames.size === 0
  ) {
    if (!secret || expectedHostnames.size === 0) {
      console.error("[turnstile] TURNSTILE_SECRET or TURNSTILE_HOSTNAMES is not set");
    }
    return false;
  }

  let result: { success?: boolean; action?: string; hostname?: string; "error-codes"?: string[] };
  try {
    const r = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({ secret, response: token, remoteip: clientIp }),
    });
    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    result = await r.json();
  } catch (err) {
    console.error("[turnstile] siteverify failed:", err);
    return false;
  }

  if (!result.success || result.action !== expectedAction || !expectedHostnames.has(result.hostname ?? "")) {
    console.warn(
      `[turnstile] rejected: success=${result.success} action=${result.action} hostname=${result.hostname} errors=${result["error-codes"]}`,
    );
    return false;
  }
  return true;
}
