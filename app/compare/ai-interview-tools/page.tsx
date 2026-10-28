import { PageHero, Section } from "../../components/ui";
import { CompareCta, CompareTable, Faq, OtherComparisons, ProfileStats, VideoInterviews } from "../components";
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
      <PageHero
        title="An AI interview that builds a profile, not just a score"
        subtitle="Many AI interview and screening tools assess the applicants to one job. HireRevolution interviews each candidate once, builds a full skills profile, and matches it against every job. It interviews the hiring manager too."
      />

      <Section
        title="Six questions to ask any AI interview vendor"
        subtitle="Ask them of every tool you're considering, including us. Here are our answers."
      >
        <CompareTable
          left="Question to ask"
          right="HireRevolution's answer"
          rows={[
            {
              topic: "Who does the AI interview?",
              left: "Does the AI talk only to candidates, or does it also learn what the hiring manager needs?",
              right:
                "Both. The hiring manager is interviewed about the role, the team and what success looks like, so the job is profiled as deeply as the candidate.",
            },
            {
              topic: "Is it tied to one job?",
              left: "Does a candidate's interview count for one job, or for every job they could fit?",
              right: "Every job. A candidate is interviewed once, and the profile is matched against every job on HireRevolution.",
            },
            {
              topic: "What do you get afterwards?",
              left: "A score, a recording, a summary, or a full profile?",
              right:
                "A full profile: about 100 skills with years in each, skills the candidate never listed, and Standout Signals.",
            },
            {
              topic: "Can you see why?",
              left: "Can you trace a score back to the evidence behind it?",
              right:
                "Yes. Each skill points to the line of work history it came from, and the match chart shows which required skills a candidate covers.",
            },
            {
              topic: "Does wording matter?",
              left: "Does a candidate lose out for describing a skill differently from your job description?",
              right: "No. More than 45,000 ways of wording a skill resolve to about 12,600 skills.",
            },
            {
              topic: "What's in it for the candidate?",
              left: "Does the candidate get anything back for their time?",
              right:
                "Yes. It's free for them, and their profile keeps working: it's matched to new jobs as they open, without another interview.",
            },
          ]}
        />
      </Section>

      <Section tone="gray" title="Then hear it in their own words">
        <VideoInterviews />
      </Section>

      <Section title="The depth behind every match">
        <ProfileStats />
      </Section>

      <Section tone="gray" title="Questions about AI interviews">
        <Faq
          items={[
            {
              q: "Can I use HireRevolution alongside an AI interview tool I already have?",
              a: "Yes. They do different jobs. A screening tool assesses the people who applied; HireRevolution tells you which candidates fit the job, including people who haven't applied yet.",
            },
            {
              q: "Why interview the hiring manager?",
              a: "Job descriptions are often copied from a template or the last hire, and they leave out what only the hiring manager knows. Matching against a thin job description gives you a thin match.",
            },
            {
              q: "Does the AI make the hiring decision?",
              a: "No. It ranks candidates and shows the evidence. Your team decides who to talk to and who to hire.",
            },
          ]}
        />
      </Section>

      <Section title="More comparisons">
        <OtherComparisons current={PATH} />
      </Section>

      <CompareCta />
    </main>
  );
}
