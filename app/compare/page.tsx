import Link from "next/link";
import { CheckList, PageHero, Section } from "../components/ui";
import { CompareCta, ProfileStats } from "./components";
import { COMPARE_PAGES } from "@/lib/compare";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/compare",
  title: "How HireRevolution Compares | HireRevolution AI",
  description:
    "Where HireRevolution fits next to your ATS, AI interview tools and talent rediscovery tools. Most of the time it works alongside them.",
});

export default function CompareHubPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Where HireRevolution fits in your hiring stack"
        subtitle="HireRevolution isn't another system to switch to. It's the matching layer that shows you which candidates can do the job, and why, inside the tools you already run."
      />

      <Section title="Compare by category" subtitle="Pick the kind of tool you're weighing us against.">
        <div className="grid md:grid-cols-3 gap-8">
          {COMPARE_PAGES.map((p) => (
            <Link
              key={p.path}
              href={p.path}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">HireRevolution and {p.title} →</h2>
              <p className="text-gray-600">{p.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="gray" title="What HireRevolution adds to any stack">
        <div className="max-w-3xl mx-auto">
          <CheckList
            items={[
              <>
                <strong>AI interviews on both sides.</strong> Candidates are interviewed to build a full profile, and hiring
                managers are interviewed to build the job. The match uses both, not a resume against a job description.
              </>,
              <>
                <strong>Skills a candidate never listed.</strong> Our AI infers skills from the work a resume describes, and
                shows why each one was inferred.
              </>,
              <>
                <strong>Standout Signals.</strong> What makes each candidate stand out, with the role, company, dates and the
                line it came from.
              </>,
              <>
                <strong>A match chart you can read at a glance.</strong> Which required skills a candidate covers, with years
                in each, so nobody has to read the resume to see why someone ranked where they did.
              </>,
              <>
                <strong>Candidates you don&apos;t have yet.</strong> Job seekers join HireRevolution free, and we search the
                wider market for people who fit each job, so you see more than your own database.
              </>,
            ]}
          />
        </div>
      </Section>

      <Section title="The depth behind every match">
        <ProfileStats />
      </Section>

      <CompareCta />
    </main>
  );
}
