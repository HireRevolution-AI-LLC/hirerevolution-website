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
        subtitle={`Works with ${atsShort}. No rip-and-replace.`}
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
              left: "Jobs, stages and records.",
              right: "A job profile from a hiring-manager interview.",
            },
            {
              topic: "Candidates",
              icon: "users",
              left: "Applicants and your database.",
              right: "Plus job seekers and wider-market finds.",
            },
            {
              topic: "The profile",
              icon: "profile",
              left: "The resume and record.",
              right: "~100 skills with years, unlisted skills, Standout Signals.",
            },
            {
              topic: "Who to call",
              icon: "chart",
              left: "Your team's judgment.",
              right: "A ranked shortlist and match chart, shared in one link.",
            },
            {
              topic: "Where results live",
              icon: "writeBack",
              left: "In your ATS.",
              right: "Match analysis, written back to the record.",
            },
          ]}
        />
      </Section>

      <StatsBand />

      {/* Not VIDEOS.stack: its integrations screen shows other vendors' logos. */}
      <Section tone="tint" title="See it work">
        <ProductVideo id={VIDEOS.fourClicks.id} title={VIDEOS.fourClicks.title} />
      </Section>

      <Section title="Questions about your ATS">
        <Faq
          items={[
            {
              q: "Do I have to replace my ATS?",
              a: "No. Your jobs, candidates and records stay put.",
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
              a: "Profiles from interviewing the candidate and the hiring manager, plus candidates not yet in your database.",
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
