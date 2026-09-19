import type { Metadata } from "next";
import Link from "next/link";
import { CheckList, PageHero, Section, buttonClass } from "../../components/ui";
import { appSignup } from "@/lib/links";

export const metadata: Metadata = {
  title: "Pricing for Job Seekers | HireRevolution AI",
  description: "Your HireRevolution AI profile, resumes and cover letters are free. Auto-search is an optional paid upgrade.",
};

export default function CandidatePricingPage() {
  return (
    <main className="flex-1">
      <PageHero title="Free for job seekers" subtitle="Your online profile, resumes and cover letters are free. Some extras, like auto-search, are optional paid upgrades." />
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
                "A recruiter-searchable profile",
                "Export and share your profile",
              ]}
            />
          </div>
          <div className="text-left rounded-xl bg-white border border-green-200 p-4 mb-8">
            <p className="font-semibold text-gray-900">Optional upgrade: auto-search</p>
            <p className="text-sm text-gray-600">
              Auto-search finds matching jobs for you automatically, so you don&apos;t have to look. It&apos;s a paid
              option; everything above stays free.
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
