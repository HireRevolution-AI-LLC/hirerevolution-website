import { chmodSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { NextRequest } from "next/server";

/**
 * Per-IP sliding-window limits for the public forms.
 *
 * Held in memory -- one process serves the site (PM2 fork mode), so the
 * counts are exact while it runs -- and mirrored to a small file so they
 * survive a restart. Every push to `main` redeploys and reloads PM2, so
 * without the file the daily per-IP JD limit reset several times a day and
 * anyone watching deploys could wait one out.
 *
 * The file is a mirror, not the source of truth: the map is authoritative
 * for this process, writes are debounced, and every filesystem error is
 * swallowed. Losing it costs the last few seconds of history and nothing
 * else, so a broken disk must never turn into a failed form submission.
 *
 * Still single-process: two PM2 instances would each keep their own map and
 * race on the file, which is why the site runs one (see HANDOFF.md item 4).
 * The app enforces the lasting per-email and per-company limits regardless.
 */

const windows = new Map<string, number[]>();

// Longest window any caller uses (the 24h JD limit). Anything older than this
// is dead weight, so it is dropped when loading and when saving.
const MAX_AGE_MS = 24 * 60 * 60_000;
// One IP cannot be worth more than this many timestamps; a key at its limit
// stops appending anyway. Guards the file against a pathological caller.
const MAX_TIMESTAMPS = 200;
// Long enough to batch a burst into one write, short enough that a deploy
// landing mid-traffic loses almost nothing.
const SAVE_DEBOUNCE_MS = 5_000;

const STATE_FILE =
  process.env.RATE_LIMIT_STATE_FILE ?? join(tmpdir(), "hirerevolution-rate-limit.json");

let loaded = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function prune(times: number[], now: number): number[] {
  // `t > now` only happens if the clock moved back; those are unusable.
  return times.filter((t) => typeof t === "number" && t <= now && now - t < MAX_AGE_MS);
}

/**
 * Read the mirror once, on the first limited request rather than at import:
 * `next build` imports this module, and a build should not touch the file.
 */
function load(): void {
  if (loaded) return;
  loaded = true;
  try {
    const saved: unknown = JSON.parse(readFileSync(STATE_FILE, "utf8"));
    if (!saved || typeof saved !== "object") return;
    const now = Date.now();
    for (const [key, times] of Object.entries(saved as Record<string, unknown>)) {
      if (!Array.isArray(times)) continue;
      const recent = prune(times as number[], now);
      if (recent.length) windows.set(key, recent.slice(-MAX_TIMESTAMPS));
    }
  } catch {
    // No file yet, or it is unreadable or corrupt. Starting empty is the same
    // behaviour this had before the file existed.
  }
}

function writeNow(): void {
  saveTimer = null;
  try {
    const now = Date.now();
    const out: Record<string, number[]> = {};
    for (const [key, times] of windows) {
      const recent = prune(times, now);
      if (recent.length) out[key] = recent;
      else windows.delete(key);
    }
    // Rename so a crash mid-write cannot leave a truncated file behind, and
    // 0600 because the contents are a list of visitor IP addresses.
    const tmp = `${STATE_FILE}.${process.pid}.tmp`;
    mkdirSync(dirname(STATE_FILE), { recursive: true });
    writeFileSync(tmp, JSON.stringify(out), { mode: 0o600 });
    renameSync(tmp, STATE_FILE);
    chmodSync(STATE_FILE, 0o600);
  } catch {
    // Best effort by design; see the note at the top of the file.
  }
}

function scheduleSave(): void {
  if (saveTimer) return;
  saveTimer = setTimeout(writeNow, SAVE_DEBOUNCE_MS);
  // Never hold the process open, which is what makes `pm2 reload` graceful.
  saveTimer.unref?.();
}

// PM2 sends SIGINT on reload and SIGTERM on stop. Flushing here is what turns
// "within five seconds of the last request" into "nothing lost on a deploy".
// `once` per signal, and the handler does not exit -- Next owns shutdown.
if (typeof process !== "undefined" && !process.env.NEXT_PHASE?.includes("build")) {
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, () => {
      if (saveTimer) clearTimeout(saveTimer);
      if (loaded) writeNow();
    });
  }
}

/** Record an attempt for `key`; true when it is over `limit` within `windowMs`. */
export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  load();
  const now = Date.now();
  const recent = (windows.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    windows.set(key, recent);
    scheduleSave();
    return true;
  }
  recent.push(now);
  windows.set(key, recent.slice(-MAX_TIMESTAMPS));
  scheduleSave();
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
