import { getPlans } from "./app-api";

/**
 * Hiring-team plans, from Stripe through the app (the same GET /api/plans the
 * app's subscription page uses). Employers see the app's "recruiting_firm"
 * plans. Monthly and annual are separate Stripe products (RF_Growth and
 * RF_Growth_Annual), paired here by plan key. Enterprise has no Stripe
 * product; it's "contact us".
 */

const PERSONA = "recruiting_firm";
const ANNUAL_SUFFIX = "_Annual";

export type Plan = {
  key: string;
  name: string;
  description: string;
  monthlyCents: number | null;
  annualCents: number | null;
  popular: boolean;
  promoLabel: string | null;
  foundingSpots: number | null;
};

type ApiPlan = {
  id?: string;
  name?: string;
  description?: string;
  price_cents?: number;
  metadata?: Record<string, string | undefined>;
};

async function subscriptions(interval: "month" | "year"): Promise<ApiPlan[]> {
  const res = await getPlans(PERSONA, interval);
  if (!res.ok) throw new Error(`GET /api/plans (${interval}) returned ${res.status}`);
  const body = await res.json();
  const plans: ApiPlan[] = Array.isArray(body?.plans) ? body.plans : [];
  return plans.filter(
    (p) =>
      p.metadata?.hr_plan_type === "subscription" &&
      p.metadata?.hr_hidden !== "true" &&
      typeof p.id === "string" &&
      typeof p.price_cents === "number",
  );
}

/** "Recruiting Firm Growth (Annual)" -> "Growth": the website speaks to all hiring teams. */
function displayName(name: string): string {
  let n = name.trim();
  if (n.endsWith("(Annual)")) n = n.slice(0, -"(Annual)".length).trim();
  if (n.startsWith("Recruiting Firm ")) n = n.slice("Recruiting Firm ".length);
  return n;
}

// Stripe descriptions are written for the app. These parts don't make sense on
// the website: the page shows the annual saving itself, and the badge is an
// in-app UI element.
const APP_ONLY_PHRASES = [
  "Save 20% with annual billing.",
  " (look for the shield badge in the integration catalog)",
];

function cleanDescription(description: string): string {
  return description
    .split("\n")
    .map((line) => APP_ONLY_PHRASES.reduce((l, phrase) => l.replace(phrase, ""), line).replace("  ", " ").trim())
    .filter(Boolean)
    .join("\n");
}

// Prices come from Stripe through the app; fetch them at most hourly. Pages
// render per request (the CSP nonce, app/layout.tsx), so without this every
// view of /pricing would be two calls to the app. Only a success is kept: a
// failure is retried on the next view rather than pinned for an hour.
const PLANS_TTL_MS = 60 * 60 * 1000;
let cachedPlans: { plans: Plan[]; expiresAt: number } | null = null;

/** Hiring plans sorted by price, or null when the app can't be reached (the page then shows "talk to us"). */
export async function getHiringPlans(): Promise<Plan[] | null> {
  if (cachedPlans && cachedPlans.expiresAt > Date.now()) return cachedPlans.plans;
  const plans = await fetchHiringPlans();
  if (plans) cachedPlans = { plans, expiresAt: Date.now() + PLANS_TTL_MS };
  return plans;
}

async function fetchHiringPlans(): Promise<Plan[] | null> {
  try {
    const [monthly, annual] = await Promise.all([subscriptions("month"), subscriptions("year")]);
    const byKey = new Map<string, Plan>();
    for (const p of monthly) {
      byKey.set(p.id!, {
        key: p.id!,
        name: displayName(p.name ?? p.id!),
        description: cleanDescription(p.description ?? ""),
        monthlyCents: p.price_cents!,
        annualCents: null,
        popular: p.metadata?.popular === "true",
        promoLabel: p.metadata?.hr_promo_label || null,
        foundingSpots: Number(p.metadata?.hr_promo_slots_total) || null,
      });
    }
    for (const p of annual) {
      const key = p.id!.endsWith(ANNUAL_SUFFIX) ? p.id!.slice(0, -ANNUAL_SUFFIX.length) : p.id!;
      const plan = byKey.get(key);
      if (plan) {
        plan.annualCents = p.price_cents!;
      } else {
        byKey.set(key, {
          key,
          name: displayName(p.name ?? key),
          description: cleanDescription(p.description ?? ""),
          monthlyCents: null,
          annualCents: p.price_cents!,
          popular: p.metadata?.popular === "true",
          promoLabel: p.metadata?.hr_promo_label || null,
          foundingSpots: Number(p.metadata?.hr_promo_slots_total) || null,
        });
      }
    }
    const plans = [...byKey.values()].sort(
      (a, b) => (a.monthlyCents ?? (a.annualCents ?? 0) / 12) - (b.monthlyCents ?? (b.annualCents ?? 0) / 12),
    );
    return plans.length > 0 ? plans : null;
  } catch (err) {
    console.error("[pricing] could not load plans from the app:", err);
    return null;
  }
}
