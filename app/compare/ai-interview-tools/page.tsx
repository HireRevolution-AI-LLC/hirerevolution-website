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
        subtitle="We interview each candidate once and match them to every job. We interview the hiring manager too."
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
              left: "Only candidates, or the hiring manager too?",
              right: "Both. The job is profiled as deeply as the candidate.",
            },
            {
              topic: "Tied to one job?",
              icon: "briefcase",
              left: "Does an interview count for one job, or every job?",
              right: "Every job. One interview, matched against every job on HireRevolution.",
            },
            {
              topic: "What you get",
              icon: "profile",
              left: "A score, a recording, or a full profile?",
              right: "A full profile: about 100 skills with years, skills never listed, and Standout Signals.",
            },
            {
              topic: "Can you see why?",
              icon: "eye",
              left: "Can you trace a score back to its evidence?",
              right: "Yes. Each skill points to its line of work history.",
            },
            {
              topic: "Does wording matter?",
              icon: "sparkles",
              left: "Does describing a skill differently cost a candidate?",
              right: "No. 44,000+ ways of wording a skill resolve to about 13,200 skills.",
            },
            {
              topic: "For the candidate",
              icon: "users",
              left: "Do candidates get anything for their time?",
              right: "Yes. It's free, and their profile keeps matching new jobs.",
            },
          ]}
        />
      </Section>

      <Section tone="tint" title="Then hear it in their own words">
        <VideoInterviews />
      </Section>

      <StatsBand />

      <Section title="See it work" subtitle="A walkthrough of a candidate analysis in the product.">
        <ProductVideo id={VIDEOS.analysis.id} title={VIDEOS.analysis.title} />
      </Section>

      <Section tone="tint" title="Questions about AI interviews">
        <Faq
          items={[
            {
              q: "Can I use HireRevolution alongside an AI interview tool I already have?",
              a: "Yes. A screening tool assesses who applied. We show who fits, including people who haven't applied.",
            },
            {
              q: "Why interview the hiring manager?",
              a: "Job descriptions leave out what only the hiring manager knows. A thin job description gives a thin match.",
            },
            {
              q: "Does the AI make the hiring decision?",
              a: "No. It ranks candidates and shows the evidence. Your team decides.",
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
