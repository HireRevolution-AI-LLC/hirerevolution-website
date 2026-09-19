import type { Metadata } from "next";
import Link from "next/link";
import FounderSection from "../components/FounderSection";
import { CheckList, CtaBand, FeatureGrid, ImageHero, Section, buttonClass } from "../components/ui";
import { SWITCH_TO } from "@/lib/audience";
import { CANDIDATE_FEATURES } from "@/lib/content";
import { appSignup } from "@/lib/links";

export const metadata: Metadata = {
  title: "HireRevolution AI for Job Seekers | Get Matched on Your Skills",
  description:
    "Our AI interviews you to capture the skills you'd never think to list, then matches you to jobs on what you can actually do. Your profile, resumes and cover letters are free.",
};

export default function CandidateHome() {
  return (
    <main className="flex-1">
      <ImageHero
        eyebrow="For job seekers · Free to use"
        title="Land interviews without rewriting your resume."
        subtitle="Our AI interviews you to capture the skills you'd never think to list, then matches you to jobs on what you can actually do."
        image={{ src: "/images/robot-candidate2-dog-wide.webp", alt: "The HireRevolution robot reviewing a resume at a desk, with a robot dog" }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <a href={appSignup("individual")} className={buttonClass.onDark}>
            Start free
          </a>
          <Link href="/candidates/features" className={buttonClass.outlineOnDark}>
            How it works
          </Link>
        </div>
        <p className="mt-8 text-blue-200">
          Hiring instead?{" "}
          <Link href={SWITCH_TO.hiring} prefetch={false} className="font-semibold text-white underline underline-offset-4 hover:text-blue-100">
            See HireRevolution for hiring teams →
          </Link>
        </p>
      </ImageHero>

      <Section
        title="Stop writing resumes for robots"
        subtitle="Skills matter, not keywords. Build your profile once and let the matches come to you."
      >
        <FeatureGrid features={CANDIDATE_FEATURES} />
      </Section>

      <Section tone="gray">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">How it works</h2>
          <ol className="space-y-6">
            {[
              ["Tell our AI about yourself", "A short, guided interview captures your skills and experience, including the ones you'd never list."],
              ["Get your profile", "A complete 360-degree profile that represents what you can actually do."],
              ["Apply with confidence", "Search for jobs that fit your skills and generate a tailored resume and cover letter for each one."],
            ].map(([title, text], i) => (
              <li key={title} className="flex items-start gap-4 bg-white rounded-xl p-6 border border-gray-200">
                <span className="shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{title}</p>
                  <p className="text-gray-600">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <CheckList items={["No credit card required", "Your profile, resumes and cover letters are free", "Auto-search is an optional paid upgrade"]} />
          </div>
        </div>
      </Section>

      <FounderSection />

      <CtaBand title="Get found for what you can do." subtitle="Create your free profile in minutes.">
        <a href={appSignup("individual")} className={buttonClass.onDark}>
          Start free
        </a>
      </CtaBand>
    </main>
  );
}
