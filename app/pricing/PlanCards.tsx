"use client";

import Link from "next/link";
import { useState } from "react";
import { appSignup } from "@/lib/links";
import type { Plan } from "@/lib/pricing";

type Interval = "month" | "year";

function dollars(cents: number): string {
  const whole = cents % 100 === 0;
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 })}`;
}

/** The biggest annual saving across plans, as a whole percent, or null. */
function annualSaving(plans: Plan[]): number | null {
  const savings = plans
    .filter((p) => p.monthlyCents && p.annualCents)
    .map((p) => 1 - p.annualCents! / (p.monthlyCents! * 12));
  if (savings.length === 0) return null;
  const pct = Math.round(Math.max(...savings) * 100);
  return pct > 0 ? pct : null;
}

export default function PlanCards({ plans }: { plans: Plan[] }) {
  const hasAnnual = plans.some((p) => p.annualCents);
  const hasMonthly = plans.some((p) => p.monthlyCents);
  // Annual first, like the app's own plans page.
  const [interval, setBilling] = useState<Interval>(hasAnnual ? "year" : "month");
  const saving = annualSaving(plans);
  const shown = plans.filter((p) => (interval === "year" ? p.annualCents : p.monthlyCents));

  const toggleClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition ${active ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`;

  return (
    <div>
      {hasAnnual && hasMonthly && (
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1" role="group" aria-label="Billing period">
            <button type="button" className={toggleClass(interval === "month")} aria-pressed={interval === "month"} onClick={() => setBilling("month")}>
              Monthly
            </button>
            <button type="button" className={toggleClass(interval === "year")} aria-pressed={interval === "year"} onClick={() => setBilling("year")}>
              Annual{saving ? <span className="ml-2 text-green-700">Save {saving}%</span> : null}
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shown.map((plan) => {
          const cents = interval === "year" ? plan.annualCents! : plan.monthlyCents!;
          const perMonth = interval === "year" ? Math.round(cents / 12) : cents;
          const highlight = plan.popular || !!plan.promoLabel;
          return (
            <div
              key={plan.key}
              className={`rounded-2xl p-6 flex flex-col bg-white ${highlight ? "border-2 border-blue-600 shadow-lg" : "border border-gray-200"}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                {(plan.promoLabel || plan.popular) && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    {plan.promoLabel ?? "Most popular"}
                  </span>
                )}
              </div>
              <p className="mb-1">
                <span className="text-4xl font-bold text-gray-900">{dollars(perMonth)}</span>
                <span className="text-gray-600"> /month</span>
              </p>
              <p className="text-sm text-gray-500 mb-5 min-h-5">
                {interval === "year" ? `Billed annually at ${dollars(cents)}` : "Billed monthly"}
              </p>
              <p className="text-gray-700 whitespace-pre-line mb-6">{plan.description}</p>
              {plan.foundingSpots && (
                <p className="text-sm font-semibold text-amber-700 mb-4">Limited: {plan.foundingSpots} founding partner spots</p>
              )}
              <a
                href={appSignup("employer")}
                className={`mt-auto text-center px-5 py-3 rounded-lg font-semibold transition ${
                  highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "border-2 border-blue-600 text-blue-700 hover:bg-blue-50"
                }`}
              >
                Get started
              </a>
            </div>
          );
        })}

        <div className="rounded-2xl p-6 flex flex-col bg-gray-900 text-white">
          <h3 className="text-xl font-bold mb-2">Enterprise</h3>
          <p className="text-4xl font-bold mb-1">Let&apos;s talk</p>
          <p className="text-sm text-gray-400 mb-5">Custom pricing</p>
          <p className="text-gray-200 mb-6">
            For larger teams hiring at scale: every open role, ATS and HRIS integrations, and priority support.
          </p>
          <Link href="/contact-sales" className="mt-auto text-center bg-white text-gray-900 px-5 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Talk to sales
          </Link>
        </div>
      </div>
    </div>
  );
}
