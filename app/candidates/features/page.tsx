import type { Metadata } from "next";
import { CtaBand, FeatureGrid, PageHero, Section, buttonClass } from "../../components/ui";
import { CANDIDATE_FEATURES, CANDIDATE_MORE_FEATURES } from "@/lib/content";
import { appSignup } from "@/lib/links";

export const metadata: Metadata = {
  title: "Features for Job Seekers | HireRevolution AI",
  description: "An AI-built skills profile, automatic job matching, tailored applications and a recruiter-searchable profile. Free for job seekers.",
};

export default function CandidateFeaturesPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Everything you need to get hired on your skills"
        subtitle="Stop optimizing resumes for algorithms. Apply based on what you can actually do. Free for job seekers, with auto-search free for a limited time."
      />
      <Section>
        <FeatureGrid features={CANDIDATE_FEATURES} />
      </Section>
      <Section tone="gray" title="And more">
        <FeatureGrid features={CANDIDATE_MORE_FEATURES} />
      </Section>
      <CtaBand title="Build your free profile" subtitle="No credit card required.">
        <a href={appSignup("individual")} className={buttonClass.onDark}>
          Start free
        </a>
      </CtaBand>
    </main>
  );
}
