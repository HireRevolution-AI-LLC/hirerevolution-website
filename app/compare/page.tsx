import { Section } from "../components/ui";
import { CompareCards, CompareCta, CompareHero, IconGrid, ProductVideo, StatsBand } from "./components";
import { VIDEOS } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/compare",
  title: "How HireRevolution AI Compares | HireRevolution AI",
  description:
    "Where HireRevolution AI fits next to your ATS, AI interview tools and talent rediscovery tools. Most of the time it works alongside them.",
});

export default function CompareHubPage() {
  return (
    <main className="flex-1">
      <CompareHero
        eyebrow="Compare"
        title="Where HireRevolution AI fits in your hiring stack"
        subtitle="Not another system to switch to. The matching layer that shows who can do the job, and why."
        image={{
          src: "/images/robots-woman-coworker-coffee.webp",
          alt: "Two HireRevolution AI robots at a laptop, under the HireRevolution.ai sign",
        }}
      />

      <Section title="Compare by category" subtitle="Pick the kind of tool you're weighing us against.">
        <CompareCards />
      </Section>

      <Section tone="tint" title="What we add to any stack" subtitle="It works alongside the tools you already run.">
        <IconGrid
          columns={5}
          items={[
            {
              icon: "chat",
              tone: "violet",
              title: "AI interviews, both sides",
              body: "Candidates and hiring managers both.",
            },
            {
              icon: "sparkles",
              tone: "amber",
              title: "Skills never listed",
              body: "Inferred, with the reason shown.",
            },
            {
              icon: "star",
              tone: "emerald",
              title: "Standout Signals",
              body: "What sets each candidate apart.",
            },
            {
              icon: "chart",
              tone: "blue",
              title: "At-a-glance match chart",
              body: "Required skills covered, with years.",
            },
            {
              icon: "userPlus",
              tone: "sky",
              title: "Candidates you don't have",
              body: "Job seekers plus a wider-market search.",
            },
          ]}
        />
      </Section>

      <StatsBand />

      <Section title="See it work">
        <ProductVideo id={VIDEOS.analysis.id} title={VIDEOS.analysis.title} />
      </Section>

      <CompareCta />
    </main>
  );
}
