import Link from "next/link";
import { PageHero, Section } from "../../components/ui";
import { CompareCta, CompareTable, Faq, OtherComparisons, ProfileStats } from "../components";
import { NAMED_ATS } from "@/lib/compare";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/compare/ats";
const atsList = `${NAMED_ATS.slice(0, -1).join(", ")} and ${NAMED_ATS.at(-1)}`;
const atsShort = `${NAMED_ATS.slice(0, 5).join(", ")} and more`;

export const metadata = pageMetadata({
  path: PATH,
  title: "HireRevolution and Your ATS | HireRevolution AI",
  description: `HireRevolution doesn't replace your applicant tracking system. It connects to ${atsShort}, and adds skills evidence to every candidate.`,
});

const STEPS = [
  {
    title: "Connect your ATS",
    body: "Connect it from the app. Your open jobs and your candidates come across, and nothing in your ATS changes.",
  },
  {
    title: "We match every job",
    body: "Each job is matched against your own candidates and against job seekers on HireRevolution, and ranked by the skills each person has shown.",
  },
  {
    title: "Results go back where you work",
    body: "Our match analysis can be written back to the candidate's record in the ATS you already use, so your recruiters see it where they work.",
  },
];

export default function CompareAtsPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Keep your ATS. Add the evidence."
        subtitle={`HireRevolution isn't an applicant tracking system, and it doesn't ask you to replace one. It works with ${atsShort}, and shows you which candidates can do the job, and why.`}
      />

      <Section title="Two jobs, done side by side" subtitle="Your ATS stays your system of record. HireRevolution does the matching.">
        <CompareTable
          left="Stays in your ATS"
          right="HireRevolution adds"
          rows={[
            {
              topic: "The job",
              left: "Your jobs, pipeline stages, submissions and records, exactly as you run them today.",
              right:
                "A job profile built by interviewing the hiring manager about the role, the team and what success looks like.",
            },
            {
              topic: "Candidates",
              left: "Everyone who applied to you or was added to your database.",
              right:
                "Your candidates, job seekers who joined HireRevolution, and people we find across the wider market who fit the job.",
            },
            {
              topic: "The candidate's profile",
              left: "The record and resume your team keeps.",
              right:
                "A profile built by an AI interview: about 100 skills with years in each, skills the candidate never listed, and Standout Signals.",
            },
            {
              topic: "Deciding who to call",
              left: "Your team's process and judgment.",
              right:
                "A ranked shortlist and a match chart that shows, at a glance, which required skills each person covers. Share the shortlist with colleagues in one link; they don't need an account.",
            },
            {
              topic: "Where the results live",
              left: "In your ATS.",
              right: "Our match analysis, written back to the candidate's record in the ATS you already use.",
            },
          ]}
        />
      </Section>

      <Section tone="gray" title="How it works with your ATS">
        <ol className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-blue-700 font-bold mb-2">Step {i + 1}</p>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="The depth behind every match">
        <ProfileStats />
      </Section>

      <Section tone="gray" title="Questions about your ATS">
        <Faq
          items={[
            {
              q: "Do I have to replace my ATS?",
              a: "No. HireRevolution works alongside it. Your jobs, candidates and records stay where they are.",
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
              a: "Many ATSs now include AI tools, and they work from the records in your database. HireRevolution adds two things a typical ATS record doesn't hold: a candidate profile built by interviewing the candidate, and a job profile built by interviewing the hiring manager. It also brings in matching candidates who aren't in your database yet.",
            },
            {
              q: "Will my recruiters have to learn a new workflow?",
              a: "Very little. Matching starts as soon as a job comes across, and our match analysis can be written back to the records your recruiters already use.",
            },
            {
              q: "Which plans include an ATS connection?",
              a: (
                <>
                  See{" "}
                  <Link href="/pricing" className="text-blue-700 font-semibold hover:text-blue-800">
                    pricing
                  </Link>{" "}
                  for what each plan includes.
                </>
              ),
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
