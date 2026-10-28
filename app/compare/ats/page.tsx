import Link from "next/link";
import { Section } from "../../components/ui";
import { CompareCards, CompareCta, CompareHero, CompareTable, Faq, ProductVideo, StatsBand } from "../components";
import AtsLayerDiagram from "./AtsLayerDiagram";
import { NAMED_ATS } from "@/lib/compare";
import { VIDEOS } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/compare/ats";
const atsList = `${NAMED_ATS.slice(0, -1).join(", ")} and ${NAMED_ATS.at(-1)}`;
const atsShort = `${NAMED_ATS.slice(0, 5).join(", ")} and more`;

export const metadata = pageMetadata({
  path: PATH,
  title: "HireRevolution and Your ATS | HireRevolution AI",
  description: `HireRevolution doesn't replace your applicant tracking system. It connects to ${atsShort}, and adds skills evidence to every candidate.`,
});

export default function CompareAtsPage() {
  return (
    <main className="flex-1">
      <CompareHero
        eyebrow="HireRevolution and your ATS"
        title="Keep your ATS. Add the evidence."
        subtitle={`No rip-and-replace. HireRevolution works with ${atsShort}, and shows which candidates can do the job.`}
        visual={<AtsLayerDiagram />}
      />

      <Section title="Two jobs, side by side" subtitle="Your ATS stays the system of record. We do the matching.">
        <CompareTable
          left="Your ATS keeps"
          right="HireRevolution adds"
          rows={[
            {
              topic: "The job",
              icon: "briefcase",
              left: "Jobs, stages and records, as you run them today.",
              right: "A job profile from interviewing the hiring manager.",
            },
            {
              topic: "Candidates",
              icon: "users",
              left: "Everyone who applied or is in your database.",
              right: "Plus job seekers on HireRevolution and people we find across the wider market.",
            },
            {
              topic: "The profile",
              icon: "profile",
              left: "The record and resume your team keeps.",
              right: "About 100 skills with years, skills never listed, and Standout Signals.",
            },
            {
              topic: "Who to call",
              icon: "chart",
              left: "Your team's process and judgment.",
              right: "A ranked shortlist and at-a-glance match chart, shared in one link.",
            },
            {
              topic: "Where results live",
              icon: "writeBack",
              left: "In your ATS.",
              right: "Our match analysis, written back to the candidate's record.",
            },
          ]}
        />
      </Section>

      <StatsBand />

      {/* Not VIDEOS.stack: its integrations screen shows other vendors' logos. */}
      <Section tone="tint" title="See it work" subtitle="Matched candidates for a job, in four clicks.">
        <ProductVideo id={VIDEOS.fourClicks.id} title={VIDEOS.fourClicks.title} />
      </Section>

      <Section title="Questions about your ATS">
        <Faq
          items={[
            {
              q: "Do I have to replace my ATS?",
              a: "No. Your jobs, candidates and records stay where they are.",
            },
            {
              q: "Which applicant tracking systems do you work with?",
              a: (
                <>
                  {atsList}. Don&apos;t see yours?{" "}
                  <Link href="/contact-sales" className="text-blue-700 font-semibold hover:text-blue-800">
                    Ask us
                  </Link>
                  .
                </>
              ),
            },
            {
              q: "My ATS already has AI matching. What does this add?",
              a: "Profiles built by interviewing the candidate and the hiring manager, which a typical ATS record doesn't hold. And matching candidates who aren't in your database yet.",
            },
            {
              q: "Will my recruiters need a new workflow?",
              a: "Very little. Matching starts when a job comes across, and results can be written back to the records they already use.",
            },
            {
              q: "Which plans include an ATS connection?",
              a: (
                <>
                  See{" "}
                  <Link href="/pricing" className="text-blue-700 font-semibold hover:text-blue-800">
                    pricing
                  </Link>
                  .
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section tone="gray" title="More comparisons">
        <CompareCards current={PATH} />
      </Section>

      <CompareCta />
    </main>
  );
}
