import Link from "next/link";
import type { ReactNode } from "react";
import { CtaBand, buttonClass } from "../components/ui";
import { COMPARE_PAGES, PROFILE_STATS, PROFILE_STATS_AS_OF, VIDEO_INTERVIEWS_LIVE } from "@/lib/compare";

/** Building blocks shared by the /compare pages. */

export type TableRow = { topic: string; left: ReactNode; right: ReactNode };

/**
 * A two-column table. On the ATS and rediscovery pages the columns are two
 * jobs done side by side; on the interview page the left column is a question
 * to ask any vendor. It never asserts what a named product lacks.
 */
export function CompareTable({ left, right, rows }: { left: string; right: string; rows: TableRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-gray-700 min-w-[36rem]">
        <thead className="bg-gray-50 text-gray-900">
          <tr>
            <th scope="col" className="p-4 w-1/5">
              <span className="sr-only">Topic</span>
            </th>
            <th scope="col" className="p-4 font-semibold">
              {left}
            </th>
            <th scope="col" className="p-4 font-semibold text-blue-700">
              {right}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.topic} className="align-top">
              <th scope="row" className="p-4 font-semibold text-gray-900">
                {row.topic}
              </th>
              <td className="p-4">{row.left}</td>
              <td className="p-4 bg-blue-50/50">{row.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProfileStats() {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-8">
        {PROFILE_STATS.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-blue-700 mb-2">{s.figure}</p>
            <p className="font-semibold text-gray-900 mb-2">{s.label}</p>
            <p className="text-gray-600">{s.detail}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center mt-6">
        Measured across candidate profiles on HireRevolution, {PROFILE_STATS_AS_OF}.
      </p>
    </div>
  );
}

/** On-demand video interviews; badged until VIDEO_INTERVIEWS_LIVE is switched on. */
export function VideoInterviews() {
  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-8">
      <div className="flex justify-between items-start gap-3 mb-4">
        <h3 className="text-2xl font-semibold text-gray-900">On-demand video interviews</h3>
        {!VIDEO_INTERVIEWS_LIVE && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">
            Coming in November
          </span>
        )}
      </div>
      <p className="text-lg text-gray-600 mb-4">
        Send candidates your interview questions. They record their answers on HireRevolution, and your team reviews
        them alongside our AI analysis.
      </p>
      <p className="text-lg text-gray-600">
        <strong className="text-gray-900">No retakes, by design.</strong> You see each candidate&apos;s real first
        answer.
      </p>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <dl className="max-w-3xl mx-auto space-y-8">
      {items.map((item) => (
        <div key={item.q}>
          <dt className="text-xl font-semibold text-gray-900 mb-2">{item.q}</dt>
          <dd className="text-lg text-gray-600">{item.a}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Links to the other comparison pages, so each page leads on to the rest. */
export function OtherComparisons({ current }: { current: string }) {
  const others = COMPARE_PAGES.filter((p) => p.path !== current);
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {others.map((p) => (
        <Link
          key={p.path}
          href={p.path}
          className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">HireRevolution and {p.title} →</h3>
          <p className="text-gray-600">{p.summary}</p>
        </Link>
      ))}
    </div>
  );
}

export function CompareCta() {
  return (
    <CtaBand title="See it with your own jobs" subtitle="Book 20 minutes with our team, or try it free with one job description.">
      <Link href="/demo" className={buttonClass.onDark}>
        Book a demo
      </Link>
      <Link href="/offers/submit-job-description" className={buttonClass.outlineOnDark}>
        Try it free with a job
      </Link>
    </CtaBand>
  );
}
