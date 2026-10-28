import Image from "../components/Image";
import Link from "next/link";
import type { ReactNode } from "react";
import YouTube from "../components/YouTube";
import { CtaBand, buttonClass } from "../components/ui";
import { COMPARE_PAGES, PROFILE_STATS, PROFILE_STATS_AS_OF, VIDEO_INTERVIEWS_LIVE } from "@/lib/compare";

/**
 * Building blocks shared by the /compare pages.
 *
 * Colors are the brand palette (Marketing/brand-colors.md): Ink Navy #182F54
 * for the customer's own systems, Revolution Blue #2758A1 for what
 * HireRevolution adds, tint #E9EFF8 for panels. No inline style attributes:
 * the production CSP forbids them (lib/csp.ts), and the dev server allows
 * them, so a slip would only show up in production.
 */

const ICON_PATHS = {
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12zM8 12h.01M12 12h.01M16 12h.01" />,
  refresh: <path d="M4 4v5h5M20 20v-5h-5M5.6 15a7 7 0 0 0 12.6 1.5M18.4 9A7 7 0 0 0 5.8 7.5" />,
  sparkles: (
    <path d="M11 3l1.8 4.7 4.7 1.8-4.7 1.8L11 16l-1.8-4.7L4.5 9.5l4.7-1.8zM18 14l.9 2.1 2.1.9-2.1.9L18 20l-.9-2.1-2.1-.9 2.1-.9z" />
  ),
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  chart: <path d="M3 20h18M7 16v-4M12 16V7M17 16v-7" />,
  userPlus: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M19 8v6M16 11h6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M16 4a4 4 0 0 1 0 8M22 20c0-2.5-1.7-4.6-4-5.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
    </>
  ),
  profile: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16c.5-1.3 1.6-2 3-2s2.5.7 3 2M14 10h4M14 14h4" />
    </>
  ),
  writeBack: <path d="M9 14l-5-5 5-5M4 9h11a5 5 0 0 1 0 10h-3" />,
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  video: (
    <>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10l6-3v10l-6-3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
};

export type IconName = keyof typeof ICON_PATHS;

const BADGE_TONES = {
  blue: "bg-[#E9EFF8] text-[#2758A1]",
  navy: "bg-[#182F54] text-white",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  sky: "bg-sky-100 text-sky-700",
};

export type BadgeTone = keyof typeof BADGE_TONES;

export function IconBadge({ name, tone = "blue", size = "md" }: { name: IconName; tone?: BadgeTone; size?: "sm" | "md" }) {
  const box = size === "sm" ? "w-9 h-9 rounded-lg" : "w-12 h-12 rounded-xl";
  const icon = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  return (
    <span className={`${box} ${BADGE_TONES[tone]} inline-flex items-center justify-center shrink-0`} aria-hidden="true">
      <svg
        className={icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICON_PATHS[name]}
      </svg>
    </span>
  );
}

/** Green check for what HireRevolution does; a neutral mark for the other column. */
function Mark({ ours }: { ours: boolean }) {
  return ours ? (
    <svg className="w-6 h-6 shrink-0 mt-0.5" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#059669" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg className="w-6 h-6 shrink-0 mt-0.5" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth={1.5} />
      <path d="M8 12h8" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/** Dark hero: short copy and two buttons on the left, a picture or diagram on the right. */
export function CompareHero({
  eyebrow,
  title,
  subtitle,
  image,
  visual,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  image?: { src: string; alt: string };
  visual?: ReactNode;
}) {
  return (
    <section className="bg-gradient-to-br from-[#0B1633] via-[#182F54] to-[#2758A1] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-blue-200 font-semibold text-sm uppercase tracking-wider mb-4">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-balance">{title}</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl text-balance">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/demo" className={buttonClass.onDark}>
              Book a demo
            </Link>
            <Link href="/offers/submit-job-description" className={buttonClass.outlineOnDark}>
              Try it free with your JD
            </Link>
          </div>
        </div>
        {image ? (
          <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        ) : (
          visual
        )}
      </div>
    </section>
  );
}

export type TableRow = { topic: string; icon: IconName; left: ReactNode; right: ReactNode };

/**
 * Two columns: the other category (neutral marks) and HireRevolution (green
 * checks). On the interview page the left column is a question to ask any
 * vendor. It never asserts what a named product lacks. A table from md up;
 * stacked cards on phones, so nothing scrolls sideways.
 */
export function CompareTable({ left, right, rows }: { left: string; right: string; rows: TableRow[] }) {
  return (
    <>
      <div className="hidden md:block rounded-2xl overflow-hidden border border-[#2758A1]/20 shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th scope="col" className="p-5 w-1/4 bg-white">
                <span className="sr-only">Topic</span>
              </th>
              <th scope="col" className="p-5 bg-gray-100 text-gray-700 font-semibold">
                {left}
              </th>
              <th scope="col" className="p-5 bg-[#2758A1] text-white font-semibold">
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white inline-flex items-center justify-center">
                    <Image src="/logo-emblem.png" alt="" width={28} height={28} />
                  </span>
                  {right}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rows.map((row) => (
              <tr key={row.topic} className="align-top">
                <th scope="row" className="p-5 font-semibold text-gray-900">
                  <span className="flex items-center gap-3">
                    <IconBadge name={row.icon} size="sm" />
                    {row.topic}
                  </span>
                </th>
                <td className="p-5 text-gray-600">
                  <span className="flex gap-3">
                    <Mark ours={false} />
                    <span>{row.left}</span>
                  </span>
                </td>
                <td className="p-5 bg-[#E9EFF8]/60 text-gray-900">
                  <span className="flex gap-3">
                    <Mark ours />
                    <span>{row.right}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="md:hidden space-y-4">
        {rows.map((row) => (
          <li key={row.topic} className="bg-white rounded-2xl border border-[#2758A1]/20 shadow-sm overflow-hidden">
            <p className="flex items-center gap-3 p-4 font-semibold text-gray-900">
              <IconBadge name={row.icon} size="sm" />
              {row.topic}
            </p>
            <div className="flex gap-3 px-4 pb-4 text-gray-600">
              <Mark ours={false} />
              <p>
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">{left}</span>
                {row.left}
              </p>
            </div>
            <div className="flex gap-3 p-4 bg-[#E9EFF8] text-gray-900">
              <Mark ours />
              <p>
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#2758A1]">{right}</span>
                {row.right}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/** A grid of icon cards: a short headline and one line each. */
export function IconGrid({
  items,
  columns = 3,
}: {
  items: { icon: IconName; tone: BadgeTone; title: string; body: ReactNode }[];
  columns?: 3 | 5;
}) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-3"}`}>
      {items.map((item) => (
        <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#2758A1]/10">
          <IconBadge name={item.icon} tone={item.tone} />
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-1">{item.title}</h3>
          <p className="text-gray-600">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

/** The measured profile figures on a navy band. */
export function StatsBand() {
  return (
    <section className="py-16 px-4 bg-[#182F54] text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-balance">The depth behind every match</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PROFILE_STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/5 ring-1 ring-white/15 p-6 text-center">
              <p className="text-5xl font-bold text-white mb-2">{s.figure}</p>
              <p className="font-semibold text-blue-100 mb-1">{s.label}</p>
              <p className="text-blue-200">{s.detail}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-blue-200 text-center mt-8">
          Measured across candidate profiles on HireRevolution, {PROFILE_STATS_AS_OF}.
        </p>
      </div>
    </section>
  );
}

/** One of the product walkthroughs: the real product, not a mock-up. */
export function ProductVideo({ id, title }: { id: string; title: string }) {
  return (
    <div className="max-w-3xl mx-auto">
      <YouTube id={id} title={title} />
    </div>
  );
}

/** On-demand video interviews; badged until VIDEO_INTERVIEWS_LIVE is switched on. */
export function VideoInterviews() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm ring-1 ring-[#2758A1]/10 flex flex-col sm:flex-row gap-6">
      <IconBadge name="video" tone="violet" />
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h3 className="text-2xl font-semibold text-gray-900">On-demand video interviews</h3>
          {!VIDEO_INTERVIEWS_LIVE && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">
              Coming in November
            </span>
          )}
        </div>
        <p className="text-lg text-gray-600 mb-3">
          Candidates record answers to your questions; your team reviews them with our AI analysis.
        </p>
        <p className="text-lg text-gray-900 font-semibold">No retakes, by design. You see each candidate&apos;s real first answer.</p>
      </div>
    </div>
  );
}

/** Questions as accordions, so the page stays short until someone opens one. */
export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item) => (
        <details key={item.q} className="group bg-white rounded-xl ring-1 ring-gray-200 open:ring-[#2758A1]/40">
          <summary className="flex justify-between items-center gap-4 cursor-pointer list-none p-5 text-lg font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="text-[#2758A1] text-2xl leading-none transition group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="px-5 pb-5 text-gray-600">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

const PAGE_ICONS: Record<string, { icon: IconName; tone: BadgeTone }> = {
  "/compare/ats": { icon: "database", tone: "navy" },
  "/compare/ai-interview-tools": { icon: "chat", tone: "violet" },
  "/compare/talent-rediscovery": { icon: "refresh", tone: "emerald" },
};

/** Cards linking to comparison pages; the hub shows all of them, each page the others. */
export function CompareCards({ current }: { current?: string }) {
  const pages = COMPARE_PAGES.filter((p) => p.path !== current);
  return (
    <div className={`grid gap-6 ${pages.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      {pages.map((p) => (
        <Link
          key={p.path}
          href={p.path}
          className="group block bg-white rounded-2xl p-6 shadow-sm ring-1 ring-[#2758A1]/10 border-t-4 border-[#2758A1] hover:shadow-lg transition"
        >
          <IconBadge name={PAGE_ICONS[p.path].icon} tone={PAGE_ICONS[p.path].tone} />
          <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">HireRevolution and {p.title}</h3>
          <p className="text-gray-600 mb-4">{p.summary}</p>
          <span className="text-[#2758A1] font-semibold group-hover:underline">Compare →</span>
        </Link>
      ))}
    </div>
  );
}

export function CompareCta() {
  return (
    <CtaBand title="See it with your own jobs">
      <Link href="/demo" className={buttonClass.onDark}>
        Book a demo
      </Link>
      <Link href="/offers/submit-job-description" className={buttonClass.outlineOnDark}>
        Try it free with your JD
      </Link>
    </CtaBand>
  );
}
