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
 * ATSs we name. Policy (Gregg, 2026-10-28): an ATS is switched on when a
 * customer buys the connection, so we name every one with a planned path:
 * our own connector first (no per-connection fee), Merge as the fallback.
 * Native connectors for all of these were written 2026-10-28 in ai-hr-chatbot
 * PRs #643-#646 (Greenhouse and JobDiva already had one), tested with mocked
 * vendor APIs; none has run against a real customer yet. Recruit CRM and Loxo
 * have no Merge fallback, so they depend on #644/#646 merging.
 * The first five lead the hero.
 */
export const NAMED_ATS = [
  "JobDiva",
  "Bullhorn",
  "Greenhouse",
  "Lever",
  "Workday",
  "Recruit CRM",
  "Loxo",
  "iCIMS",
  "JobAdder",
  "Manatal",
  "Zoho Recruit",
  "Teamtailor",
  "Breezy HR",
];

/**
 * Measured on production 2026-10-28 across the 259 candidates with a skills
 * profile: median 103 skills, 100% with years, 14.8% inferred (is_implied),
 * 99.5% with evidence; 44,777 active skill wordings (skill_variant) resolve to
 * 13,212 active skills (skill_canonical). Re-measure before changing the copy.
 */
export const PROFILE_STATS_AS_OF = "October 2026";

export const PROFILE_STATS: { figure: string; label: string; detail: string }[] = [
  {
    figure: "~100",
    label: "skills per candidate profile",
    detail: "Each one carries years of experience and the line of work history it came from.",
  },
  {
    figure: "1 in 7",
    label: "skills the candidate never listed",
    detail: "Inferred from the work a resume describes. Each shows the reason it was inferred.",
  },
  {
    figure: "44,000+",
    label: "ways of wording a skill",
    detail: "Resolve to about 13,200 skills, so a different term on a resume doesn't cost a candidate the match.",
  },
];

/**
 * On-demand video interviews launch about 2026-11-04. Until then the section
 * carries a "Coming in November" badge; flip this to true at launch.
 * No retakes is the selling point: never add copy that shows or implies one,
 * and describe no other mechanics (timers, limits) without checking the app.
 */
export const VIDEO_INTERVIEWS_LIVE = false;
