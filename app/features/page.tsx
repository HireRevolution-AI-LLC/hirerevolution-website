import Link from "next/link";
import YouTube from "../components/YouTube";
import { CtaBand, FeatureGrid, PageHero, Section, buttonClass } from "../components/ui";
import { SWITCH_TO } from "@/lib/audience";
import { HIRING_COMING_SOON, HIRING_FEATURES, HIRING_TEAM_FEATURES, VIDEOS } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/features",
  title: "Features for Hiring Teams | HireRevolution AI",
  description:
    "Automatic candidate search, skills-based ranking, 40+ ATS integrations, candidate sourcing, shareable ranked shortlists, an AI job description builder, Standout Signals, AI intros and interview scheduling.",
});

export default function HiringFeaturesPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Everything you need to hire smarter"
        subtitle="Stop spending hours a week on resume screening, candidate intros and scheduling. We automate all of it."
      />

      <Section>
        <FeatureGrid features={HIRING_FEATURES} columns={3} />
      </Section>

      <Section
        tone="gray"
        title="Your whole team sees the same ranked analysis"
        subtitle="Share candidates with colleagues in one link. Nobody needs an account to help you decide."
      >
        <FeatureGrid features={HIRING_TEAM_FEATURES} columns={3} />
      </Section>

      <Section title="See it work" subtitle="Short walkthroughs of the product, each under a minute or two.">
        <div className="grid md:grid-cols-2 gap-10">
          <YouTube id={VIDEOS.analysis.id} title={VIDEOS.analysis.title} />
          <YouTube id={VIDEOS.jd.id} title={VIDEOS.jd.title} />
          <YouTube id={VIDEOS.stack.id} title={VIDEOS.stack.title} />
          <YouTube id={VIDEOS.fourClicks.id} title={VIDEOS.fourClicks.title} />
        </div>
      </Section>

      <Section tone="gray" title="Coming soon">
        <FeatureGrid features={HIRING_COMING_SOON} />
        <p className="text-center text-gray-600 mt-10">
          Looking for a job?{" "}
          <Link href={SWITCH_TO.candidates} prefetch={false} className="text-blue-700 font-semibold hover:text-blue-800">
            See features for job seekers →
          </Link>
        </p>
      </Section>

      <CtaBand title="See it with your own jobs" subtitle="Try the demo environment now, or book 20 minutes with our team.">
        <Link href="/demo" className={buttonClass.onDark}>
          Book a demo
        </Link>
        <Link href="/offers/submit-job-description" className={buttonClass.outlineOnDark}>
          Try it free with your JD
        </Link>
      </CtaBand>
    </main>
  );
}
