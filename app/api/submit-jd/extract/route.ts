import { NextRequest, NextResponse } from "next/server";
import { AppApiNotConfiguredError, extractJDText } from "@/lib/app-api";
import { FILE_TOO_LARGE, MAX_UPLOAD_BYTES, UNSUPPORTED_FILE, isParsedFile } from "@/lib/jd-upload";
import { burstLimited, clientIp, rateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * The offer page's "Upload a file" button: a PDF or DOCX in, its text out.
 *
 * Nothing is created here. The page puts the text in its job description box,
 * the visitor checks it, and the job is made by /api/submit-jd on submit --
 * which keeps its own limits (3 per IP a day here, 2 per email and company in
 * the app). So the limits below only have to protect the parser, which costs
 * CPU on the app but no AI and no database writes.
 *
 * Plain-text files never reach this route: the page reads those itself.
 */

// An honest visitor uploads one file, maybe a second if the first was the
// wrong one. Ten a day leaves room for that without making this a free
// document-to-text service.
const IP_LIMIT = 10;
const IP_WINDOW_MS = 24 * 60 * 60_000;
// Across every visitor, so a bot spread over many addresses still cannot
// queue unbounded parses on the app. Far above today's whole-site traffic;
// lib/rate-limit.ts keeps at most 200 timestamps per key, so stay below that.
const GLOBAL_LIMIT = 100;
const GLOBAL_WINDOW_MS = 60 * 60_000;
// Room for the multipart boundary, headers and the Turnstile token.
const MAX_BODY_BYTES = MAX_UPLOAD_BYTES + 64 * 1024;

const GENERIC_ERROR = "We couldn't read that file right now. Please paste the job description instead.";
const MAX_UPSTREAM_MESSAGE = 300;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (burstLimited(ip)) {
    return error("Too many requests. Please slow down.", 429);
  }

  // Route handlers have no body limit of their own, and formData() buffers the
  // whole body, so refuse an oversized one from its header before reading it.
  // Browsers always send Content-Length with a FormData body; a request
  // without one is not from this page.
  const length = Number(request.headers.get("content-length"));
  if (!Number.isFinite(length) || length <= 0) {
    return error("Invalid request.", 411);
  }
  if (length > MAX_BODY_BYTES) {
    return error(FILE_TOO_LARGE, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error("Invalid request.", 400);
  }

  if (!(await verifyTurnstile(form.get("cf-turnstile-response"), "submit_jd", ip))) {
    return error("We couldn't confirm you're human. Please complete the check and try again.", 403);
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return error("Choose a file to upload.", 400);
  }
  if (!isParsedFile(file.name)) {
    return error(UNSUPPORTED_FILE, 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return error(FILE_TOO_LARGE, 413);
  }

  if (rateLimited(`extract-jd:${ip}`, IP_LIMIT, IP_WINDOW_MS)) {
    return error("You've uploaded several files today. Please paste the job description instead.", 429);
  }
  if (rateLimited("extract-jd:global", GLOBAL_LIMIT, GLOBAL_WINDOW_MS)) {
    console.warn("[submit-jd/extract] global upload limit reached");
    return error("We're getting a lot of uploads right now. Please paste the job description instead.", 429);
  }

  let res: Response;
  try {
    res = await extractJDText(file);
  } catch (err) {
    if (err instanceof AppApiNotConfiguredError) {
      console.error("[submit-jd/extract] app API not configured:", err.message);
    } else {
      console.error("[submit-jd/extract] app API request failed:", err);
    }
    return error(GENERIC_ERROR, 502);
  }

  const body = await res.json().catch(() => ({}));
  if (res.ok && typeof body.text === "string") {
    return NextResponse.json({ text: body.text });
  }
  // 400 and 422 carry a sentence written for the visitor (wrong type, a scan
  // with no text in it); anything else is ours to apologise for.
  if ((res.status === 400 || res.status === 422) && typeof body.detail === "string") {
    const message = body.detail.length > MAX_UPSTREAM_MESSAGE ? GENERIC_ERROR : body.detail;
    return error(message, 422);
  }
  console.error(`[submit-jd/extract] app API returned ${res.status}:`, JSON.stringify(body).slice(0, 500));
  return error(GENERIC_ERROR, 502);
}
