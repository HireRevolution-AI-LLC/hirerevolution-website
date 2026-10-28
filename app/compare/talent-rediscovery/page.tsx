import { Section } from "../../components/ui";
import { CompareCards, CompareCta, CompareHero, CompareTable, Faq, ProductVideo, StatsBand } from "../components";
import { VIDEOS } from "@/lib/content";
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
      <CompareHero
        eyebrow="HireRevolution and rediscovery tools"
        title="Bring candidates back. Then know which ones fit."
        subtitle="Rediscovery tools re-engage your past candidates. We show which of them fit the job, and add people you don't have yet."
        image={{ src: "/images/robots-crowd.webp", alt: "A crowd of robots, one standing out" }}
      />

      <Section title="Two jobs that work together" subtitle="One brings candidates back. The other shows who fits.">
        <CompareTable
          left="Rediscovery tools"
          right="HireRevolution"
          rows={[
            {
              topic: "Focus",
              icon: "target",
              left: "Getting past candidates to respond again.",
              right: "Showing who fits each job, with the evidence.",
            },
            {
              topic: "Candidates",
              icon: "users",
              left: "Those already in your ATS and talent pools.",
              right: "Yours, plus job seekers on HireRevolution and people we find across the wider market.",
            },
            {
              topic: "What you see",
              icon: "chart",
              left: "Who engaged, responded or updated their details.",
              right: "A ranked shortlist, a match chart and Standout Signals.",
            },
            {
              topic: "Old records",
              icon: "refresh",
              left: "Revived by reaching out.",
              right: "Read for skills never listed, so they can match new kinds of jobs.",
            },
          ]}
        />
      </Section>

      <StatsBand />

      <Section tone="tint" title="See it work" subtitle="Find the candidates you'd otherwise miss.">
        <ProductVideo id={VIDEOS.jd.id} title={VIDEOS.jd.title} />
      </Section>

      <Section title="Questions about rediscovery">
        <Faq
          items={[
            {
              q: "We already use a re-engagement tool. Do we need HireRevolution?",
              a: "They do different jobs. Re-engagement gets candidates talking to you. We show which of them, and which new people, fit the job.",
            },
            {
              q: "Can HireRevolution match the candidates already in our ATS?",
              a: "Yes. Connect your ATS, and they're matched alongside the candidates on HireRevolution.",
            },
            {
              q: "Do you work with rediscovery and re-engagement vendors?",
              a: "We'd like to. If you build one and want to talk about an integration, get in touch.",
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
