import { NextRequest, NextResponse } from "next/server";
import { AppApiNotConfiguredError, createThirdPartyJD } from "@/lib/app-api";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * Limited-time offer: a hiring manager submits a JD and we create it in
 * HireRevolution and search for candidates. Forwards to the same app endpoint
 * the "Create Job Description" button on app.hirerevolution.ai/add-jd calls.
 *
 * Everything here is re-checked by the app; the checks below exist to give
 * the visitor a clear message and to keep junk off the app's AI pipeline.
 */

const MIN_JD_LENGTH = 50; // matches the app's jd_text min_length
const MAX_JD_LENGTH = 100_000;
// Per IP. The app also limits each work email and company to 2 website JDs.
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 24 * 60 * 60_000;

// The offer is for a work address; these can't tie a submitter to a company.
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "ymail.com", "outlook.com",
  "hotmail.com", "live.com", "msn.com", "icloud.com", "me.com", "mac.com",
  "aol.com", "proton.me", "protonmail.com", "gmx.com", "mail.com",
  "yandex.com", "zoho.com",
]);

const APP_LOGIN_URL = "https://app.hirerevolution.ai/login";

const GENERIC_ERROR =
  "Something went wrong on our side. Please try again, or email your job description to support@hirerevolution.ai.";

function emailDomain(email: string): string | null {
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[0] || email.includes(" ")) return null;
  const domain = parts[1];
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) return null;
  return domain;
}

function normalizeWebsite(website: string): string | null {
  try {
    const url = new URL(website.includes("://") ? website : `https://${website}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

type OfferLimit = { code: "website_offer_limit"; message?: string; login_url?: string };

function isOfferLimit(detail: unknown): detail is OfferLimit {
  return typeof detail === "object" && detail !== null && (detail as OfferLimit).code === "website_offer_limit";
}

/** Turn the app's error body into something a visitor can act on. */
function upstreamMessage(status: number, detail: unknown): string {
  if (status === 409) {
    return "We already have this job description for your company and are working on it. Check your inbox for an email from HireRevolution.";
  }
  if (status === 429) {
    return "We're getting a lot of submissions right now. Please try again in a few minutes.";
  }
  if (status === 422) {
    // Pydantic errors arrive as a list of {msg}; pipeline errors as a string.
    if (Array.isArray(detail)) {
      const msgs = detail
        .map((d) => String((d as { msg?: string })?.msg ?? ""))
        .map((m) => (m.startsWith("Value error, ") ? m.slice("Value error, ".length) : m))
        .filter(Boolean);
      if (msgs.length) return msgs.join(" ");
    }
    if (typeof detail === "string") return detail;
  }
  return GENERIC_ERROR;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request.");
  }

  // Human check first: nothing else runs for a request without a valid token.
  const ip = clientIp(request);
  if (!(await verifyTurnstile(body["cf-turnstile-response"], "submit_jd", ip))) {
    return NextResponse.json(
      { error: "We couldn't confirm you're human. Please complete the check and try again." },
      { status: 403 },
    );
  }

  // Honeypot: hidden from people, filled in by bots. Pretend it worked.
  if (text(body.faxNumber)) {
    return NextResponse.json({ ok: true });
  }

  const companyName = text(body.companyName);
  const companyWebsite = text(body.companyWebsite);
  const hiringManagerName = text(body.hiringManagerName);
  const hiringManagerEmail = text(body.hiringManagerEmail).toLowerCase();
  const jdText = text(body.jobDescription);

  if (!companyName || !companyWebsite || !hiringManagerName || !hiringManagerEmail || !jdText) {
    return badRequest("Please fill in every field.");
  }
  if (companyName.length > 255 || hiringManagerName.length > 200) {
    return badRequest("That name is too long.");
  }
  const website = normalizeWebsite(companyWebsite);
  if (!website) {
    return badRequest("Enter your company website, like https://yourcompany.com.");
  }
  const domain = emailDomain(hiringManagerEmail);
  if (!domain) {
    return badRequest("Enter a valid email address.");
  }
  if (FREE_EMAIL_DOMAINS.has(domain)) {
    return badRequest("Please use your work email address so we can connect you to your company.");
  }
  if (jdText.length < MIN_JD_LENGTH) {
    return badRequest(`The job description needs at least ${MIN_JD_LENGTH} characters.`);
  }
  if (jdText.length > MAX_JD_LENGTH) {
    return badRequest("That job description is too long. Please trim it and try again.");
  }

  if (rateLimited(`submit-jd:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      {
        error: "You've already sent several job descriptions today. Log in to HireRevolution to add more jobs.",
        loginUrl: APP_LOGIN_URL,
      },
      { status: 429 },
    );
  }

  let res: Response;
  try {
    res = await createThirdPartyJD({
      companyName,
      companyWebsite: website,
      hiringManagerName,
      hiringManagerEmail,
      jdText,
    });
  } catch (err) {
    if (err instanceof AppApiNotConfiguredError) {
      console.error("[submit-jd] app API not configured:", err.message);
    } else {
      console.error("[submit-jd] app API request failed:", err);
    }
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
  }

  if (res.status === 202 || res.ok) {
    const queued = await res.json().catch(() => ({}));
    console.log(`[submit-jd] queued JD for ${companyName} (${website}) as import ${queued.import_id}`);
    return NextResponse.json({
      ok: true,
      importId: typeof queued.import_id === "string" ? queued.import_id : null,
      freeCandidateCap: typeof queued.free_candidate_cap === "number" ? queued.free_candidate_cap : null,
    });
  }

  const errBody = await res.json().catch(() => ({}));
  if (res.status === 429 && isOfferLimit(errBody.detail)) {
    return NextResponse.json(
      {
        error:
          errBody.detail.message ??
          "You've already used the free website offer for this email or company. Log in to HireRevolution to add more jobs.",
        loginUrl: errBody.detail.login_url ?? APP_LOGIN_URL,
      },
      { status: 429 },
    );
  }
  console.error(`[submit-jd] app API returned ${res.status}:`, JSON.stringify(errBody).slice(0, 500));
  const status = res.status === 409 || res.status === 422 || res.status === 429 ? res.status : 502;
  return NextResponse.json({ error: upstreamMessage(res.status, errBody.detail) }, { status });
}
