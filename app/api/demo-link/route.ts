import { NextRequest, NextResponse } from "next/server";
import { burstLimited, clientIp, rateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { FREE_EMAIL_DOMAINS, emailDomain, normalizeWebsite, text } from "@/lib/validate";

/**
 * Self-serve demo: forwards to the demo environment's
 * POST /api/demo/request-link (ai-hr-chatbot backend/endpoints/demo_page_endpoints.py),
 * which checks the work email against the company website, creates a 7-day
 * demo invite and emails the link. That endpoint only accepts requests whose
 * Origin is an approved marketing-site origin, so this server sends its own.
 *
 * Environment:
 *   DEMO_API_URL  the demo environment's API, e.g. https://api-demo.hirerevolution.ai
 *   SITE_ORIGIN   this site's public origin, e.g. https://staging.hirerevolution.ai
 */

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 24 * 60 * 60_000;
const TIMEOUT_MS = 20_000;

const GENERIC_ERROR =
  "Something went wrong on our side. Please try again, or book a live demo instead.";

type DemoApiBody = { success?: boolean; message?: string; detail?: unknown; errors?: { msg?: string }[]; error?: string };

/** The demo API's message for the visitor: FastAPI `detail`, or a 422's `errors`. */
function apiError(body: DemoApiBody): string | null {
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.errors) && body.errors.length > 0) {
    const messages = body.errors.map((e) => e?.msg).filter((m): m is string => typeof m === "string");
    if (messages.length > 0) return messages.join(" ");
  }
  return null;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Cheap ceiling first, so the Turnstile call below is not free to trigger.
  const ip = clientIp(request);
  if (burstLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  // Human check next: nothing else runs for a request without a valid token.
  if (!(await verifyTurnstile(body["cf-turnstile-response"], "request_demo", ip))) {
    return NextResponse.json(
      { error: "We couldn't confirm you're human. Please complete the check and try again." },
      { status: 403 },
    );
  }

  // Honeypot: hidden from people, filled in by bots. Pretend it worked.
  if (text(body.faxNumber)) {
    return NextResponse.json({ ok: true, message: "Check your email for your demo link." });
  }

  const email = text(body.email, 320).toLowerCase();
  const domain = emailDomain(email);
  if (!domain) {
    return NextResponse.json({ error: "Enter a valid work email." }, { status: 400 });
  }
  if (FREE_EMAIL_DOMAINS.has(domain)) {
    return NextResponse.json(
      { error: "Please use your work email, not a personal address like Gmail." },
      { status: 400 },
    );
  }
  const companyUrl = normalizeWebsite(text(body.companyWebsite, 2048));
  if (!companyUrl) {
    return NextResponse.json({ error: "Enter your company website, like https://yourcompany.com." }, { status: 400 });
  }

  if (rateLimited(`demo-link:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: "You've already requested demo links today. Check your inbox, or book a live demo." },
      { status: 429 },
    );
  }

  const demoApiUrl = process.env.DEMO_API_URL;
  const siteOrigin = process.env.SITE_ORIGIN;
  if (!demoApiUrl || !siteOrigin) {
    console.error("[demo-link] DEMO_API_URL or SITE_ORIGIN is not set");
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
  }

  const payload: Record<string, string> = { email, company_url: companyUrl };
  const firstName = text(body.firstName, 100);
  const lastName = text(body.lastName, 100);
  if (firstName) payload.first_name = firstName;
  if (lastName) payload.last_name = lastName;

  let res: Response;
  try {
    res = await fetch(`${demoApiUrl}/api/demo/request-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Origin: siteOrigin },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    console.error("[demo-link] demo API request failed:", err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
  }

  const result: DemoApiBody = await res.json().catch(() => ({}));
  if (res.ok && result.success) {
    console.log(`[demo-link] demo link requested for ${domain}`);
    return NextResponse.json({ ok: true, message: result.message ?? "Check your email for your demo link." });
  }

  // 400/422: the demo API rejected the input with a message meant for the visitor.
  const message = apiError(result);
  if ((res.status === 400 || res.status === 422) && message) {
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (res.status === 429) {
    return NextResponse.json({ error: "Too many requests right now. Please try again in a few minutes." }, { status: 429 });
  }
  console.error(`[demo-link] demo API returned ${res.status}:`, JSON.stringify(result).slice(0, 500));
  return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
}
