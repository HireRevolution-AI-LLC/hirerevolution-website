import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckList, PageHero, Section, buttonClass } from "../components/ui";
import { SWITCH_TO } from "@/lib/audience";
import { getHiringPlans } from "@/lib/pricing";
import PlanCards from "./PlanCards";

export const metadata: Metadata = {
  title: "Pricing for Hiring Teams | HireRevolution AI",
  description: "Plans for hiring managers, recruiting firms and enterprise talent teams, sized to your team and open roles.",
};

// Prices come from Stripe through the app; refresh them at most hourly.
export const revalidate = 3600;

/** Shown if the app can't be reached when the page is built or refreshed. */
function HiringPlansFallback() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-blue-50 border-2 border-blue-600 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hiring managers & recruiting firms</h2>
        <p className="text-gray-600 mb-6">
          Pricing depends on your team size, number of open roles and integrations. Every plan includes:
        </p>
        <div className="mb-8">
          <CheckList
            items={[
              "Skills-based candidate ranking, with no resume reading",
              "Automatic candidate search for every job",
              "AI job description builder",
              "Skill match charts and Standout Signals",
              "AI candidate intros and in-app interview scheduling",
            ]}
          />
        </div>
        <Link href="/demo" className={buttonClass.primary}>
          Book a demo
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h2>
        <p className="text-gray-600 mb-6">For larger teams hiring at scale. Everything above, plus:</p>
        <div className="mb-8">
          <CheckList
            items={[
              "ATS and HRIS integrations: JobDiva, Bullhorn, Lever, Recruit CRM and 40+ more",
              "Every open role, across teams",
              "Priority support",
            ]}
          />
        </div>
        <Link href="/contact-sales" className={buttonClass.outline}>
          Talk to sales
        </Link>
      </div>
    </div>
  );
}

export default async function HiringPricingPage() {
  const plans = await getHiringPlans();
  return (
    <main className="flex-1">
      <PageHero
        title="Pricing that fits your team"
        subtitle="Start with a plan that fits, and grow into more jobs, more recruiters and your ATS. Enterprise? Let's talk."
      />

      <Section>
        {plans ? (
          <>
            <PlanCards plans={plans} />
            <p className="text-center text-gray-600 mt-8">
              Every plan includes skills-based candidate ranking, automatic candidate search, the AI job description
              builder, Standout Signals, AI intros and in-app interview scheduling.
            </p>
          </>
        ) : (
          <HiringPlansFallback />
        )}
      </Section>

      <Section tone="gray">
        <div className="grid md:grid-cols-[1fr_320px] gap-10 items-center">
          <div>
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-3">Limited-time offer</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try it free with one of your jobs</h2>
            <p className="text-lg text-gray-600 mb-6">
              Submit your job description and we&apos;ll create it in HireRevolution and search for candidates, free.
              The easiest way to see it work.
            </p>
            <Link href="/offers/submit-jd" className={buttonClass.primary}>
              Submit your JD
            </Link>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <Image src="/images/robot-reading.webp" alt="Robot reading a job description" fill sizes="320px" className="object-cover" />
          </div>
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Questions about pricing?</h2>
          <p className="text-gray-600 mb-6">Every team is different. Let&apos;s talk about what works for you.</p>
          <Link href="/contact-sales" className="text-blue-700 font-semibold hover:text-blue-800">
            Talk to sales →
          </Link>
          <p className="text-gray-600 mt-10">
            Looking for a job?{" "}
            <Link href={SWITCH_TO.candidates} prefetch={false} className="text-blue-700 font-semibold hover:text-blue-800">
              It&apos;s free for job seekers →
            </Link>
          </p>
        </div>
      </Section>
    </main>
  );
}
