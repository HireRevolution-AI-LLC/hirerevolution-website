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
      "Keep your ATS. We connect to it and add skills evidence.",
  },
  {
    path: "/compare/ai-interview-tools",
    title: "AI interview tools",
    summary:
      "One interview per candidate, matched to every job.",
  },
  {
    path: "/compare/talent-rediscovery",
    title: "talent rediscovery tools",
    summary:
      "They bring candidates back. We show which ones fit.",
  },
];

/**
 * ATSs we name in public. Gregg, 2026-11-18: name only JobDiva and Workday,
 * and say "and others" for the rest.
 *
 * This list is a business choice, not a legal limit. Trademark law lets us
 * name a vendor in plain, accurate text with no logo and no claim of a
 * partnership. A vendor's own naming rules bind us only once we agree to its
 * terms, for example by using its API. Most vendors publish such rules
 * (Greenhouse, Lever, iCIMS, JobAdder, Loxo, Manatal, Breezy HR, Teamtailor
 * ask for permission; Zoho bans its name in paid ads), and a vendor whose API
 * we rely on can cut off access. Bullhorn is not named at all while there is
 * no Bullhorn agreement.
 *
 * Every name here must also appear in SiteFooter's "not affiliated" line.
 * Never use a vendor's logo, and never call us its "partner", "certified",
 * "official" or "authorized" integration without a signed agreement. Check
 * the vendor's terms before adding a name.
 */
export const NAMED_ATS = ["JobDiva", "Workday"];

/** "JobDiva, Workday and others", for every place that lists ATSs. */
export const ATS_NAMES_TEXT = `${NAMED_ATS.join(", ")} and others`;

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
    label: "skills per profile",
    detail: "Each with years and its source.",
  },
  {
    figure: "1 in 7",
    label: "skills never listed",
    detail: "Inferred, with the reason shown.",
  },
  {
    figure: "44,000+",
    label: "ways to word a skill",
    detail: "Mapped to about 13,200 skills.",
  },
];

/**
 * On-demand video interviews launch about 2026-11-04. Until then the section
 * carries a "Coming in November" badge; flip this to true at launch.
 * No retakes is the selling point: never add copy that shows or implies one,
 * and describe no other mechanics (timers, limits) without checking the app.
 */
export const VIDEO_INTERVIEWS_LIVE = false;
