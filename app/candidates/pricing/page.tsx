import type { Metadata } from "next";
import Link from "next/link";
import { CheckList, PageHero, Section, buttonClass } from "../../components/ui";
import { appSignup } from "@/lib/links";

export const metadata: Metadata = {
  title: "Pricing for Job Seekers | HireRevolution AI",
  description: "HireRevolution AI is free for job seekers. Auto-search is a paid upgrade, free for a limited time.",
};

export default function CandidatePricingPage() {
  return (
    <main className="flex-1">
      <PageHero title="Free for job seekers" subtitle="Build your profile, tailor your applications and get found, free. No credit card." />
      <Section>
        <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <p className="text-6xl font-bold text-green-600 mb-2">$0</p>
          <p className="text-xl text-gray-600 mb-8">Core features, always free</p>
          <div className="text-left mb-8">
            <CheckList
              items={[
                "Your AI-built skills profile",
                "AI-tailored application materials",
                "A recruiter-searchable profile",
                "Export and share your profile",
              ]}
            />
          </div>
          <div className="text-left rounded-xl bg-white border border-green-200 p-4 mb-8">
            <p className="font-semibold text-gray-900">Auto-search: free for a limited time</p>
            <p className="text-sm text-gray-600">
              Auto-search finds matching jobs for you automatically. It will become an optional paid upgrade; for now
              it&apos;s free.
            </p>
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
