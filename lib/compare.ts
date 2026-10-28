/**
 * The comparison pages under /compare.
 *
 * Naming policy (see the PR that added these pages): a company is named only
 * where we integrate with it or the claim is checkable on its own public site,
 * and never to say it lacks something. Everything else is compared by
 * category, on what HireRevolution adds rather than what anyone else is
 * missing. No third-party logos.
 */

export type ComparePage = {
  path: string;
  /** Reads after "HireRevolution and ", so it keeps its own capitals. */
  title: string;
  summary: string;
};

export const COMPARE_PAGES: ComparePage[] = [
  {
    path: "/compare/ats",
    title: "your ATS",
    summary:
      "Keep the applicant tracking system you run today. HireRevolution connects to it and adds skills evidence to every candidate.",
  },
  {
    path: "/compare/ai-interview-tools",
    title: "AI interview and screening tools",
    summary:
      "Many AI interview tools assess the applicants to one job. Ours builds a profile that is matched against every job, and it interviews the hiring manager too.",
  },
  {
    path: "/compare/talent-rediscovery",
    title: "talent rediscovery and re-engagement tools",
    summary:
      "Re-engagement tools bring past candidates back. HireRevolution shows which of them fit the job in front of you, and why.",
  },
];

/**
 * ATSs the live site already names as integrations (lib/content.ts) and that
 * have a native connector in the app. Add a name here only after confirming
 * a working connection, not just a connector file.
 */
export const NAMED_ATS = ["JobDiva", "Bullhorn", "Lever", "Recruit CRM"];

/** Measured on production on this date; re-measure before changing the copy. */
export const PROFILE_STATS_AS_OF = "October 2026";

export const PROFILE_STATS: { figure: string; label: string; detail: string }[] = [
  {
    figure: "~100",
    label: "skills per candidate profile",
    detail: "Each one carries years of experience and the line of work history it came from.",
  },
  {
    figure: "1 in 6",
    label: "skills the candidate never listed",
    detail: "Inferred from the work a resume describes. Each shows the reason it was inferred.",
  },
  {
    figure: "45,000+",
    label: "ways of wording a skill",
    detail: "Resolve to about 12,600 skills, so a different term on a resume doesn't cost a candidate the match.",
  },
];
