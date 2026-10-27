import AutoSearchPromo from "../../components/AutoSearchPromo";
import { CtaBand, FeatureGrid, PageHero, Section, buttonClass } from "../../components/ui";
import { CANDIDATE_FEATURES, CANDIDATE_MORE_FEATURES } from "@/lib/content";
import { appSignup } from "@/lib/links";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/job-seekers/features",
  title: "Features for Job Seekers | HireRevolution AI",
  description:
    "Auto-search finds jobs that match your skills, free for a limited time. Plus a free AI-built skills profile, tailored resumes and cover letters, and a recruiter-searchable profile.",
});

export default function CandidateFeaturesPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Everything you need to get hired on your skills"
        subtitle="Stop optimizing resumes for algorithms. Your profile, resumes and cover letters are free, and auto-search is free for a limited time."
      />
      <AutoSearchPromo />
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
