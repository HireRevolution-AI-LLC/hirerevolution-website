import type { Metadata } from "next";
import Link from "next/link";
import { CheckList, PageHero, Section, buttonClass } from "../../components/ui";
import { AUTO_SEARCH_PROMO } from "@/lib/content";
import { appSignup } from "@/lib/links";

export const metadata: Metadata = {
  title: "Pricing for Job Seekers | HireRevolution AI",
  description: "Your HireRevolution AI profile, resumes and cover letters are free. Auto-search is free for a limited time.",
};

export default function CandidatePricingPage() {
  return (
    <main className="flex-1">
      <PageHero title="Free for job seekers" subtitle="Your online profile, resumes and cover letters are free. And for a limited time, so is auto-search." />
      <Section>
        <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <p className="text-6xl font-bold text-green-600 mb-2">$0</p>
          <p className="text-xl text-gray-600 mb-8">Free, no credit card</p>
          <div className="text-left mb-8">
            <CheckList
              items={[
                "Your AI-built online profile",
                "Resumes and cover letters tailored to each job",
                "Help searching for jobs yourself",
                "Auto-search, free for a limited time",
                "A recruiter-searchable profile",
                "Export and share your profile",
              ]}
            />
          </div>
          <div className="text-left rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-400 p-5 mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-white mb-3">
              {AUTO_SEARCH_PROMO.badge}
            </span>
            <p className="font-bold text-gray-900 text-lg mb-1">Auto-search, free right now</p>
            <p className="text-sm text-gray-700 mb-2">
              Auto-search keeps looking for jobs that match your skills and brings them straight to you.
            </p>
            <p className="text-sm font-semibold text-amber-900">{AUTO_SEARCH_PROMO.urgency}</p>
          </div>
          <a href={appSignup("individual")} className={buttonClass.primary}>
            Start free
          </a>
        </div>
        <p className="text-center text-gray-600 mt-10">
          Employers pay so job seekers don&apos;t have to. Hiring?{" "}
          <Link href="/pricing" className="text-blue-700 font-semibold hover:text-blue-800">
            See pricing for teams →
          </Link>
        </p>
      </Section>
    </main>
  );
}
