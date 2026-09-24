import type { Metadata } from "next";
import Image from "../components/Image";
import Link from "next/link";
import YouTube from "../components/YouTube";
import { CheckList, PageHero, Section } from "../components/ui";
import { SWITCH_TO } from "@/lib/audience";
import { HIRING_FEATURES, VIDEOS } from "@/lib/content";
import { CALENDLY_URL } from "@/lib/links";
import DemoLinkForm from "./DemoLinkForm";

export const metadata: Metadata = {
  title: "See a Demo | HireRevolution AI for Hiring Teams",
  description:
    "Try HireRevolution yourself in our demo environment, no call needed, or book a 20-minute live demo with our team.",
};

export default function DemoPage() {
  return (
    <main className="flex-1">
      <PageHero
        title="Find candidates without reading a single resume"
        subtitle="See how it works: try it yourself right now, or let us walk you through it. No credit card required."
      />

      <section className="px-4 -mt-10 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-8 flex flex-col min-w-0">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Self-serve</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Try it yourself now</h2>
            <p className="text-gray-600 mb-5">
              No call needed. We&apos;ll email you a link to a demo environment with sample jobs and candidates, good for 7
              days.
            </p>
            <div className="mb-6">
              <CheckList
                items={[
                  "Post a job in under 5 minutes",
                  "AI ranks candidates so you don't have to read every resume",
                  "Get a shareable job link instantly",
                ]}
              />
            </div>
            <div className="mt-auto">
              <DemoLinkForm />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-8 flex flex-col min-w-0">
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">Live demo · about 20 minutes</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Schedule a demo with us</h2>
            <p className="text-gray-600 mb-5">
              Get a personal walkthrough with your own roles in mind, and ask anything, from ATS integration to pricing.
            </p>
            <div className="mb-6">
              <CheckList
                items={[
                  "See candidates matched to a role like yours",
                  "How it fits with your ATS",
                  "Plans and pricing for your team",
                ]}
              />
            </div>
            <div className="relative aspect-[3/2] rounded-xl overflow-hidden mb-6">
              <Image
                src="/images/robots-woman-coworker-coffee.webp"
                alt="Robots at a desk with the HireRevolution dashboard"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto w-full text-center bg-blue-600 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Pick a time
            </a>
          </div>
        </div>
      </section>

      <Section tone="gray" title="What you'll see" subtitle="Everything a hiring manager needs, shown on real jobs.">
        <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIRING_FEATURES.map((f, i) => (
            <li key={f.title} className="bg-white rounded-xl border border-gray-200 p-6">
              <span className="inline-flex w-9 h-9 rounded-full bg-blue-600 text-white font-bold items-center justify-center mb-3">
                {i + 1}
              </span>
              <p className="font-semibold text-gray-900 text-lg mb-1">{f.title}</p>
              <p className="text-gray-600">{f.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Watch it work">
        <div className="grid md:grid-cols-2 gap-10">
          <YouTube id={VIDEOS.fourClicks.id} title={VIDEOS.fourClicks.title} />
          <YouTube id={VIDEOS.analysis.id} title={VIDEOS.analysis.title} />
          <YouTube id={VIDEOS.jd.id} title={VIDEOS.jd.title} />
          <YouTube id={VIDEOS.stack.id} title={VIDEOS.stack.title} />
        </div>
        <p className="text-center text-gray-600 mt-12">
          Looking for a job? The demo is for hiring teams.{" "}
          <Link href={SWITCH_TO.candidates} prefetch={false} className="text-blue-700 font-semibold hover:text-blue-800">
            Start free as a job seeker →
          </Link>
        </p>
      </Section>
    </main>
  );
}
