import { PageHero, Section } from "../../components/ui";
import { CompareCta, CompareTable, Faq, OtherComparisons, ProfileStats } from "../components";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/compare/talent-rediscovery";

export const metadata = pageMetadata({
  path: PATH,
  title: "HireRevolution and Talent Rediscovery Tools | HireRevolution AI",
  description:
    "Re-engagement and talent rediscovery tools bring past candidates back. HireRevolution shows which of them fit the job, and why, and adds candidates you don't have yet.",
});

export default function CompareRediscoveryPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Bring candidates back. Then know which ones fit."
        subtitle="Talent rediscovery and re-engagement tools help you get more from the candidates you already have. HireRevolution works next to them: it shows which candidates fit the job in front of you, and adds people who aren't in your database yet."
      />

      <Section title="Two jobs that work together" subtitle="One brings candidates back to you. The other shows who fits.">
        <CompareTable
          left="Rediscovery and re-engagement tools"
          right="HireRevolution"
          rows={[
            {
              topic: "Focus",
              left: "Getting past applicants and database candidates to respond again.",
              right: "Showing which candidates fit each job, with the evidence.",
            },
            {
              topic: "Candidates",
              left: "The candidates already in your ATS and talent pools.",
              right: "Your candidates, plus job seekers who joined HireRevolution and match the job.",
            },
            {
              topic: "What a recruiter sees",
              left: "Who has engaged, responded or updated their details.",
              right:
                "A ranked shortlist, a match chart of the required skills each person covers, and Standout Signals with the line each came from.",
            },
            {
              topic: "Old records",
              left: "Brings stale records back to life by reaching out.",
              right:
                "Reads the work a resume describes, including skills the candidate never listed, so an old record can still match a new kind of job.",
            },
          ]}
        />
      </Section>

      <Section tone="gray" title="The depth behind every match">
        <ProfileStats />
      </Section>

      <Section title="Questions about rediscovery">
        <Faq
          items={[
            {
              q: "We already use a re-engagement tool. Do we need HireRevolution?",
              a: "They do different jobs. Re-engagement gets candidates talking to you again. HireRevolution tells you which of them, and which new candidates, fit the job you're filling.",
            },
            {
              q: "Can HireRevolution match the candidates already in our ATS?",
              a: "Yes. Connect your ATS, and your candidates are matched against your open jobs alongside the candidates on HireRevolution.",
            },
            {
              q: "Do you work with rediscovery and re-engagement vendors?",
              a: "We'd like to. If you build one and want to talk about an integration, get in touch.",
            },
          ]}
        />
      </Section>

      <Section tone="gray" title="More comparisons">
        <OtherComparisons current={PATH} />
      </Section>

      <CompareCta />
    </main>
  );
}
