import Image from "next/image";
import Link from "next/link";
import FounderSection from "./components/FounderSection";
import YouTube from "./components/YouTube";
import { CheckList, CtaBand, FeatureGrid, ImageHero, Section, buttonClass } from "./components/ui";
import { SWITCH_TO } from "@/lib/audience";
import { HIRING_FEATURES, VIDEOS } from "@/lib/content";

/** Home for hiring managers, the default audience. Job seekers switch to /candidates. */
export default function HiringHome() {
  return (
    <main className="flex-1">
      <ImageHero
        eyebrow="For hiring managers & recruiting teams"
        title={
          <>
            Stop reading <span className="text-blue-400">resumes.</span>
          </>
        }
        subtitle="HireRevolution ranks candidates by the skills they can prove, not the keywords they typed. It works with the ATS you already use."
        image={{ src: "/images/robot-executive.webp", alt: "The HireRevolution robot at an executive desk with hiring dashboards" }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/demo" className={buttonClass.onDark}>
            Book a demo
          </Link>
          <Link href="/offers/submit-jd" className={buttonClass.outlineOnDark}>
            Try it free with a job
          </Link>
        </div>
        <p className="mt-8 text-blue-200">
          Looking for a job instead?{" "}
          <Link href={SWITCH_TO.candidates} prefetch={false} className="font-semibold text-white underline underline-offset-4 hover:text-blue-100">
            See how we help job seekers →
          </Link>
        </p>
      </ImageHero>

      <Section>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
              Find matched candidates in 4 clicks
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You&apos;re spending hours a week on resume screening, candidate intros and scheduling. We make that
              disappear.
            </p>
            <CheckList
              items={[
                "Post a job in under 5 minutes",
                "AI ranks candidates so you don't have to read every resume",
                "Get a shareable job link instantly",
              ]}
            />
          </div>
          <YouTube id={VIDEOS.fourClicks.id} title={VIDEOS.fourClicks.title} />
        </div>
      </Section>

      <Section
        tone="gray"
        title="Hiring on what people can actually do"
        subtitle="Our AI interviews both sides, the candidate and you, then matches complete profiles, not keywords."
      >
        <FeatureGrid features={HIRING_FEATURES} columns={3} />
        <div className="text-center mt-12">
          <Link href="/features" className="text-blue-700 font-semibold hover:text-blue-800">
            See all features →
          </Link>
        </div>
      </Section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 items-center">
          <div className="relative w-52 h-72 mx-auto rounded-2xl overflow-hidden shadow-lg">
            <Image src="/images/early-access.webp" alt="Robot stepping through a glowing doorway" fill sizes="208px" className="object-cover" />
          </div>
          <div>
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-3">Limited-time offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
              Send us a job description. We&apos;ll find the candidates.
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Paste your JD and we&apos;ll create the job in HireRevolution, search for matching candidates, and email
              you a link to them within minutes. Free, for a limited time.
            </p>
            <Link href="/offers/submit-jd" className={buttonClass.primary}>
              Submit your JD
            </Link>
          </div>
        </div>
      </section>

      <FounderSection />

      <CtaBand
        title="Ready to fill your roles faster?"
        subtitle="See it in 20 minutes with our team, or try it yourself right now in our demo environment."
      >
        <Link href="/demo" className={buttonClass.onDark}>
          Book a demo
        </Link>
        <Link href="/contact-sales" className={buttonClass.outlineOnDark}>
          Talk to sales
        </Link>
      </CtaBand>
    </main>
  );
}
