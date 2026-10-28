import { Section } from "../../components/ui";
import { CompareCards, CompareCta, CompareHero, CompareTable, Faq, ProductVideo, StatsBand, VideoInterviews } from "../components";
import { VIDEOS } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/compare/ai-interview-tools";

export const metadata = pageMetadata({
  path: PATH,
  title: "HireRevolution and AI Interview Tools | HireRevolution AI",
  description:
    "HireRevolution's AI interviews candidates and hiring managers, then matches the two profiles. Six questions to ask any AI interview or screening vendor.",
});

export default function CompareAiInterviewPage() {
  return (
    <main className="flex-1">
      <CompareHero
        eyebrow="HireRevolution and AI interview tools"
        title="An AI interview that builds a profile, not just a score"
        subtitle="One interview per candidate, matched to every job. Hiring managers are interviewed too."
        image={{ src: "/images/robot-reading.webp", alt: "The HireRevolution robot reading a resume" }}
      />

      <Section title="Six questions to ask any AI interview vendor" subtitle="Ask every tool you're considering, us included.">
        <CompareTable
          left="Ask any vendor"
          right="Our answer"
          rows={[
            {
              topic: "Who gets interviewed?",
              icon: "chat",
              left: "Candidates only, or hiring managers too?",
              right: "Both, so the job is profiled too.",
            },
            {
              topic: "Tied to one job?",
              icon: "briefcase",
              left: "One job, or every job?",
              right: "Every job, from one interview.",
            },
            {
              topic: "What you get",
              icon: "profile",
              left: "A score, or a full profile?",
              right: "~100 skills with years, unlisted skills, Standout Signals.",
            },
            {
              topic: "Can you see why?",
              icon: "eye",
              left: "Can you trace a score to evidence?",
              right: "Yes. Each skill links to its source line.",
            },
            {
              topic: "Does wording matter?",
              icon: "sparkles",
              left: "Does wording cost a match?",
              right: "No. 44,000+ wordings map to ~13,200 skills.",
            },
            {
              topic: "For the candidate",
              icon: "users",
              left: "What's in it for them?",
              right: "It's free, and the profile keeps matching new jobs.",
            },
          ]}
        />
      </Section>

      <Section tone="tint" title="Then hear it in their own words">
        <VideoInterviews />
      </Section>

      <StatsBand />

      <Section title="See it work">
        <ProductVideo id={VIDEOS.analysis.id} title={VIDEOS.analysis.title} />
      </Section>

      <Section tone="tint" title="Questions about AI interviews">
        <Faq
          items={[
            {
              q: "Can I use HireRevolution alongside an AI interview tool I already have?",
              a: "Yes. Screening assesses who applied. We show who fits, applied or not.",
            },
            {
              q: "Why interview the hiring manager?",
              a: "Job descriptions miss what only the hiring manager knows.",
            },
            {
              q: "Does the AI make the hiring decision?",
              a: "No. It ranks and shows the evidence. Your team decides.",
            },
          ]}
        />
      </Section>

      <Section title="More comparisons">
        <CompareCards current={PATH} />
      </Section>

      <CompareCta />
    </main>
  );
}
