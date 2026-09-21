import { createHmac, hkdfSync, timingSafeEqual } from "node:crypto";

/**
 * Proof that this browser is the one that submitted a given JD.
 *
 * `/api/submit-jd/status` used to accept any import UUID, so possession of an
 * id was the only control on reading that job's title and preview link. The
 * POST that creates the import now hands back a short-lived token bound to
 * that id, and the status route will not answer without it.
 *
 * Server-only: reads TURNSTILE_SECRET.
 *
 * The signing key is *derived* from TURNSTILE_SECRET rather than being its
 * own variable, deliberately. A separate secret would have to be added to
 * every environment before this code could ship, and the usual way that goes
 * wrong is a silent fallback that signs with a constant and protects nothing.
 * TURNSTILE_SECRET is already required on any deployment where the JD form
 * works at all -- `verifyTurnstile` refuses every submission without it -- so
 * there is no environment where this is configured and that one is not.
 * HKDF with a distinct `info` label keeps the derived key separable from the
 * secret itself, which is what makes reusing it safe.
 *
 * Rotating TURNSTILE_SECRET invalidates tokens issued before the rotation.
 * The cost is that a page polling across that moment falls back to "we'll
 * email you the link", which is the same thing it does on any other failure.
 */

// The page polls for six minutes and then gives up (GIVE_UP_MS in
// NextSteps.tsx). This is wide enough that a slow import never trips it, and
// short enough that a leaked token is not a lasting key to the record.
const TTL_MS = 30 * 60_000;

export const SUBMISSION_TOKEN_HEADER = "x-submission-token";

let cachedKey: Buffer | null = null;

/** null when TURNSTILE_SECRET is unset, which fails both issuing and verifying. */
function signingKey(): Buffer | null {
  if (cachedKey) return cachedKey;
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) {
    console.error("[submission-token] TURNSTILE_SECRET is not set");
    return null;
  }
  cachedKey = Buffer.from(
    hkdfSync("sha256", secret, "hirerevolution-website", "submission-token/v1", 32),
  );
  return cachedKey;
}

function sign(importId: string, expiresAt: number, key: Buffer): string {
  return createHmac("sha256", key).update(`${importId}.${expiresAt}`).digest("base64url");
}

/** A token the browser sends back when polling for this import's status. */
export function issueSubmissionToken(importId: string): string | null {
  const key = signingKey();
  if (!key) return null;
  const expiresAt = Date.now() + TTL_MS;
  return `${expiresAt}.${sign(importId, expiresAt, key)}`;
}

/** True only for an unexpired token this server issued for this exact id. */
export function verifySubmissionToken(importId: string, token: unknown): boolean {
  const key = signingKey();
  if (!key || typeof token !== "string") return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expiresAt = Number(token.slice(0, dot));
  if (!Number.isSafeInteger(expiresAt) || expiresAt < Date.now()) return false;

  const presented = Buffer.from(token.slice(dot + 1), "base64url");
  const expected = Buffer.from(sign(importId, expiresAt, key), "base64url");
  // timingSafeEqual throws on a length mismatch, which a caller controls.
  return presented.length === expected.length && timingSafeEqual(presented, expected);
}
