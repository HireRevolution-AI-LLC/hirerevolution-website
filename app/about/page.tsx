import type { Metadata } from "next";
import Image from "next/image";
import { FOUNDER_LINKEDIN } from "@/lib/links";

export const metadata: Metadata = {
  title: "About | HireRevolution AI",
  description: "Why we built HireRevolution: hiring is broken on both sides, and skills should matter more than keywords.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Fixing a Broken Hiring System
          </h1>
          <p className="text-xl text-gray-600">
            For everyone. Hiring managers deserve to get their time back. Job seekers deserve to be evaluated on skills, not keywords.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Problem
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Traditional hiring is broken. Hiring teams spend dozens of hours a week reading resumes, writing intros, and scheduling interviews—often with candidates who were never going to be a fit.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              They use resume screening based on keywords, which filters out strong candidates who use different words than the job description. Meanwhile, job seekers waste hours tailoring resumes to trick algorithms, only to hear nothing back.
            </p>
            <p className="text-lg text-gray-600">
              It&apos;s a two-sided dysfunction. Neither side is getting evaluated fairly.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Solution
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              HireRevolution doesn&apos;t screen resumes or play keyword games. Instead, we build complete 360-degree profiles on both sides:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  For Candidates
                </h3>
                <p className="text-gray-600">
                  Our AI interviews you to build a complete picture of what you can do—capturing skills you&apos;d never think to list, or knew so well you forgot to mention. The result is a profile that actually represents you.
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  For Hiring Managers
                </h3>
                <p className="text-gray-600">
                  We interview you about the actual role, team context, and success criteria—then match candidates against that deep understanding, not just a surface-level JD. You get ranked shortlists of people who can actually do the job.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why This Works
            </h2>
            <ul className="space-y-4 text-lg text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 mt-1">✓</span>
                <span>
                  <strong>Skills matter more than words.</strong> We evaluate what people can actually do, not how well they guess your keywords.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 mt-1">✓</span>
                <span>
                  <strong>Complete context matters.</strong> A 360-degree profile vs. a resume, and a deep job profile vs. a template JD—that depth enables genuinely better matching.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 mt-1">✓</span>
                <span>
                  <strong>Two-sided marketplace.</strong> Candidates get the platform free, which builds a continuously growing talent pool. That talent pool is what makes the hiring-team product valuable.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 mt-1">✓</span>
                <span>
                  <strong>Works with what you already use.</strong> We integrate with 40+ ATS platforms—no rip-and-replace, no new workflow. Just better matching on top of your existing tools.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 grid md:grid-cols-[1fr_200px] gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Founded by a Hiring Manager
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                HireRevolution was founded by Gregg W. Casey, a former hiring manager who experienced the limitations of traditional ATS workflows firsthand. This isn&apos;t a generic &quot;AI applied to hiring&quot;—it&apos;s built by someone who lived the problem and got tired of wasting time on resume screening.
              </p>
              <p className="text-lg text-gray-600">
                Founder-market fit matters. We&apos;re solving a problem we actually had.
              </p>
            </div>
            <figure className="text-center">
              <div className="relative w-44 h-56 mx-auto rounded-2xl overflow-hidden shadow-lg">
                <Image src="/images/gregg.webp" alt="Gregg Casey, founder of HireRevolution" fill sizes="176px" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-gray-700">
                <a href={FOUNDER_LINKEDIN} className="font-semibold hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                  Gregg Casey
                </a>
                , Founder
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </main>
  );
}
