import { Section } from "../../components/ui";
import { CompareCards, CompareCta, CompareHero, CompareTable, Faq, ProductVideo, StatsBand } from "../components";
import { VIDEOS } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/compare/talent-rediscovery";

export const metadata = pageMetadata({
  path: PATH,
  title: "HireRevolution AI and Talent Rediscovery Tools | HireRevolution AI",
  description:
    "Re-engagement and talent rediscovery tools bring past candidates back. HireRevolution AI shows which of them fit the job, and why, and adds candidates you don't have yet.",
});

export default function CompareRediscoveryPage() {
  return (
    <main className="flex-1">
      <CompareHero
        eyebrow="HireRevolution AI and rediscovery tools"
        title="Bring candidates back. Then know which ones fit."
        subtitle="Rediscovery tools re-engage past candidates. We show who fits, and add people you don't have."
        image={{ src: "/images/robots-crowd.webp", alt: "A crowd of robots, one standing out" }}
      />

      <Section title="Two jobs that work together" subtitle="One brings candidates back. The other shows who fits.">
        <CompareTable
          left="Rediscovery tools"
          right="HireRevolution AI"
          rows={[
            {
              topic: "Focus",
              icon: "target",
              left: "Getting past candidates to respond.",
              right: "Showing who fits, with evidence.",
            },
            {
              topic: "Candidates",
              icon: "users",
              left: "Your ATS and talent pools.",
              right: "Yours, plus job seekers and wider-market finds.",
            },
            {
              topic: "What you see",
              icon: "chart",
              left: "Who engaged or responded.",
              right: "Ranked shortlist, match chart, Standout Signals.",
            },
            {
              topic: "Old records",
              icon: "refresh",
              left: "Revived by outreach.",
              right: "Read for unlisted skills, so they fit new jobs.",
            },
          ]}
        />
      </Section>

      <StatsBand />

      <Section tone="tint" title="See it work">
        <ProductVideo id={VIDEOS.jd.id} title={VIDEOS.jd.title} />
      </Section>

      <Section title="Questions about rediscovery">
        <Faq
          items={[
            {
              q: "We already use a re-engagement tool. Do we need HireRevolution AI?",
              a: "They do different jobs. Re-engagement gets candidates talking; we show who fits.",
            },
            {
              q: "Can HireRevolution AI match the candidates already in our ATS?",
              a: "Yes. Connect your ATS and they're matched too.",
            },
            {
              q: "Do you work with rediscovery and re-engagement vendors?",
              a: "We'd like to. If you build one, get in touch.",
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
