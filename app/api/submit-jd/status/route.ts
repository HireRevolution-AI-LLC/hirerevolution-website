import { NextRequest, NextResponse } from "next/server";
import { getJobImport } from "@/lib/app-api";
import { clientIp, rateLimited } from "@/lib/rate-limit";

/**
 * Progress of a website JD submission, polled by the next-steps page until the
 * job exists and its no-login preview link is ready. Reads the import through
 * the app as the website's service user, which submitted it.
 */

// The page polls every few seconds for a few minutes.
const POLL_LIMIT = 120;
const POLL_WINDOW_MS = 10 * 60_000;

const HEX = "0123456789abcdef";

function isUuid(value: string): boolean {
  if (value.length !== 36) return false;
  for (let i = 0; i < value.length; i++) {
    const c = value[i].toLowerCase();
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      if (c !== "-") return false;
    } else if (!HEX.includes(c)) {
      return false;
    }
  }
  return true;
}

export async function GET(request: NextRequest) {
  const importId = request.nextUrl.searchParams.get("id") ?? "";
  if (!isUuid(importId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }
  if (rateLimited(`submit-jd-status:${clientIp(request)}`, POLL_LIMIT, POLL_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let res: Response;
  try {
    res = await getJobImport(importId);
  } catch (err) {
    console.error("[submit-jd/status] app API request failed:", err);
    return NextResponse.json({ error: "Unavailable." }, { status: 502 });
  }
  if (res.status === 404) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (!res.ok) {
    console.error(`[submit-jd/status] app API returned ${res.status}`);
    return NextResponse.json({ error: "Unavailable." }, { status: 502 });
  }

  const row = await res.json().catch(() => ({}));
  return NextResponse.json({
    status: typeof row.status === "string" ? row.status : "unknown",
    jobTitle: typeof row.title === "string" ? row.title : null,
    previewUrl: typeof row.preview_url === "string" ? row.preview_url : null,
    freeCandidateCap: typeof row.free_candidate_cap === "number" ? row.free_candidate_cap : null,
  });
}
