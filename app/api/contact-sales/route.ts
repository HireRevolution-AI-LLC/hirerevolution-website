import { NextRequest, NextResponse } from "next/server";
import { AppApiNotConfiguredError, sendContactSales } from "@/lib/app-api";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * Enterprise inquiries (linked from the app's "subscribe" emails for larger
 * companies). The app sends the notification email to the team.
 */

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 24 * 60 * 60_000;
const FALLBACK_ERROR =
  "Something went wrong on our side. Please email us at support@hirerevolution.ai instead.";

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(email: string): boolean {
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[0] || email.includes(" ")) return false;
  const domain = parts[1];
  return domain.includes(".") && !domain.startsWith(".") && !domain.endsWith(".");
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Human check first: nothing else runs for a request without a valid token.
  const ip = clientIp(request);
  if (!(await verifyTurnstile(body["cf-turnstile-response"], "contact_sales", ip))) {
    return NextResponse.json(
      { error: "We couldn't confirm you're human. Please complete the check and try again." },
      { status: 403 },
    );
  }

  // Honeypot: hidden from people, filled in by bots. Pretend it worked.
  if (text(body.faxNumber, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = text(body.name, 200);
  const email = text(body.email, 320).toLowerCase();
  const company = text(body.company, 255);
  if (!name || !email || !company) {
    return NextResponse.json({ error: "Please fill in your name, work email and company." }, { status: 400 });
  }
  if (!validEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (rateLimited(`contact-sales:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: "We've already received your messages today. We'll be in touch soon." },
      { status: 429 },
    );
  }

  let res: Response;
  try {
    res = await sendContactSales({
      name,
      email,
      company,
      companyWebsite: text(body.companyWebsite, 2048),
      teamSize: text(body.teamSize, 50),
      message: text(body.message, 5000),
    });
  } catch (err) {
    if (err instanceof AppApiNotConfiguredError) {
      console.error("[contact-sales] app API not configured:", err.message);
    } else {
      console.error("[contact-sales] app API request failed:", err);
    }
    return NextResponse.json({ error: FALLBACK_ERROR }, { status: 502 });
  }

  if (res.ok) {
    console.log(`[contact-sales] inquiry from ${company}`);
    return NextResponse.json({ ok: true });
  }
  const errBody = await res.text().catch(() => "");
  console.error(`[contact-sales] app API returned ${res.status}:`, errBody.slice(0, 500));
  return NextResponse.json({ error: FALLBACK_ERROR }, { status: 502 });
}
