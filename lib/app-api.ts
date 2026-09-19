/**
 * Server-side client for the HireRevolution app API (app.hirerevolution.ai).
 *
 * The website submits JDs through the same endpoint as the app's
 * "Create Job Description" button on /add-jd: POST /api/jobs/create-3rd-party.
 * That endpoint only accepts a signed-in admin or content_creator, so the
 * website signs in as a dedicated service user (a content_creator Firebase
 * account) and caches its ID token. Never import this from a client component:
 * it reads the service user's password from the environment.
 *
 * Environment (set in .env.production.local on the droplet):
 *   APP_API_URL                 e.g. https://api.hirerevolution.ai
 *   FIREBASE_WEB_API_KEY        the app's public Firebase web API key
 *   WEBSITE_SUBMITTER_EMAIL     the service user's sign-in email
 *   WEBSITE_SUBMITTER_PASSWORD  the service user's password
 */

// FIREBASE_AUTH_EMULATOR_HOST (Firebase's own convention) points sign-in at an
// emulator or a local mock, so the flow can be tested without the real app.
const SIGN_IN_URL = `${
  process.env.FIREBASE_AUTH_EMULATOR_HOST
    ? `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/`
    : "https://"
}identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`;
const REQUEST_TIMEOUT_MS = 30_000;
// Refresh a few minutes before Firebase's one-hour expiry.
const TOKEN_REFRESH_MARGIN_MS = 5 * 60_000;

export class AppApiNotConfiguredError extends Error {}

export type ThirdPartyJD = {
  companyName: string;
  companyWebsite: string;
  hiringManagerName: string;
  hiringManagerEmail: string;
  jdText: string;
};

let cachedToken: { idToken: string; expiresAt: number } | null = null;

function config() {
  const apiUrl = process.env.APP_API_URL;
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  const email = process.env.WEBSITE_SUBMITTER_EMAIL;
  const password = process.env.WEBSITE_SUBMITTER_PASSWORD;
  if (!apiUrl || !apiKey || !email || !password) {
    throw new AppApiNotConfiguredError(
      "APP_API_URL, FIREBASE_WEB_API_KEY, WEBSITE_SUBMITTER_EMAIL and WEBSITE_SUBMITTER_PASSWORD must all be set",
    );
  }
  return { apiUrl: apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl, apiKey, email, password };
}

async function getIdToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.idToken;
  }
  const { apiKey, email, password } = config();
  const res = await fetch(`${SIGN_IN_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Service user sign-in failed (HTTP ${res.status}): ${body?.error?.message ?? "unknown"}`);
  }
  const data = (await res.json()) as { idToken: string; expiresIn: string };
  cachedToken = {
    idToken: data.idToken,
    expiresAt: Date.now() + Number(data.expiresIn) * 1000 - TOKEN_REFRESH_MARGIN_MS,
  };
  return data.idToken;
}

/**
 * Create the JD the way /add-jd does, with background: true so the app
 * returns 202 as soon as the company and hiring manager are resolved and runs
 * the AI pipeline (and the intro email) on its own.
 */
export async function createThirdPartyJD(jd: ThirdPartyJD): Promise<Response> {
  const { apiUrl } = config();
  const body = JSON.stringify({
    company_name: jd.companyName,
    company_website: jd.companyWebsite,
    jd_text: jd.jdText,
    hiring_manager_email: jd.hiringManagerEmail,
    hiring_manager_name: jd.hiringManagerName,
    background: true,
  });

  const send = async (token: string) =>
    fetch(`${apiUrl}/api/jobs/create-3rd-party`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

  const res = await send(await getIdToken());
  // A token revoked or expired early: sign in again once.
  if (res.status === 401) {
    return send(await getIdToken(true));
  }
  return res;
}
