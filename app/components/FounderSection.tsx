import Image from "next/image";
import { FOUNDER_LINKEDIN } from "@/lib/links";

export default function FounderSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_280px] gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance">
            Hiring is broken. We&apos;ve felt it from both sides.
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Our founder spent years on the hiring side of the table, digging through keyword-stuffed resumes and
            fighting ATS systems that made finding the right person harder, not easier. Meanwhile, job seekers were
            spending hours tailoring resumes and cover letters just to get past the filters, often without ever
            hearing back.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            HireRevolution fixes both sides. Our AI matches people to roles based on what they can actually do.
            Candidates get seen. Employers find talent they&apos;d otherwise miss.
          </p>
          <a href="/about" className="text-blue-700 font-semibold hover:text-blue-800">
            Read our story →
          </a>
        </div>
        <figure className="text-center">
          <div className="relative w-56 h-72 mx-auto rounded-2xl overflow-hidden shadow-lg">
            <Image src="/images/gregg.webp" alt="Gregg Casey, founder of HireRevolution" fill sizes="224px" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-gray-700">
            <a href={FOUNDER_LINKEDIN} className="font-semibold hover:text-blue-700" target="_blank" rel="noopener noreferrer">
              Gregg Casey
            </a>
            , Founder
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
